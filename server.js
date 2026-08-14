const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

app.post("/api/download", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                error: "Link TikTok belum dimasukkan"
            });
        }

        if (!url.includes("tiktok.com")) {
            return res.status(400).json({
                error: "Link bukan TikTok"
            });
        }

        if (!process.env.TIKTOK_API_KEY) {
            return res.status(500).json({
                error: "API key belum dipasang"
            });
        }

        const apiUrl =
            "https://apidirect.io/v1/tiktok/video?url=" +
            encodeURIComponent(url);

        const response = await fetch(apiUrl, {
            headers: {
                "X-API-Key": process.env.TIKTOK_API_KEY
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error || "API gagal memproses video"
            });
        }

        const videoUrl =
            data.video?.video_url_watermarked;

        if (!videoUrl) {
            return res.status(404).json({
                error: "Video tidak ditemukan"
            });
        }

        res.json({
            success: true,
            videoUrl: videoUrl
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Terjadi kesalahan pada server"
        });
    }
});


app.listen(PORT, "0.0.0.0", () => {

    console.log(
        "Server berjalan di port " + PORT
    );

});