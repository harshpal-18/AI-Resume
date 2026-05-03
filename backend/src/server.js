const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const archiver = require("archiver");
const { generateAssets } = require("./services/openaiService");
const { htmlTemplate, cssTemplate, jsTemplate } = require("./services/portfolioTemplateService");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/generate", async (req, res) => {
  try {
    const payload = req.body || {};
    const generated = await generateAssets(payload);
    res.json(generated);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate content." });
  }
});

app.post("/api/portfolio-zip", async (req, res) => {
  try {
    const { formData, generated } = req.body || {};
    const projectName = (formData?.fullName || "portfolio").toLowerCase().replace(/\s+/g, "-");

    res.attachment(`${projectName}-portfolio.zip`);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(res);
    archive.append(htmlTemplate({ formData, generated }), { name: "index.html" });
    archive.append(cssTemplate, { name: "styles.css" });
    archive.append(jsTemplate, { name: "script.js" });
    archive.append(
      `# Portfolio\n\nOpen index.html directly or deploy this folder to Netlify/Vercel static hosting.`,
      { name: "README.md" },
    );
    await archive.finalize();
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to export portfolio ZIP." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
