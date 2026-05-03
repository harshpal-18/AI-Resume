const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const archiver = require("archiver");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const {
  htmlTemplate,
  cssTemplate,
  jsTemplate,
} = require("./services/portfolioTemplateService");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Debug env
app.get("/api/debug-env", (req, res) => {
  res.json({
    hasKey: !!process.env.GEMINI_API_KEY,
    keyLength: process.env.GEMINI_API_KEY
      ? process.env.GEMINI_API_KEY.length
      : 0,
  });
});

// 🔥 FINAL GENERATE ROUTE (WORKING)
app.post("/api/generate", async (req, res) => {
  try {
    const { fullName, skills, projects, education } = req.body || {};

    const prompt = `
Create a professional resume:

Name: ${fullName}
Skills: ${skills}
Projects: ${JSON.stringify(projects)}
Education: ${education}

Provide:
1. Professional Summary
2. Skills (bullet points)
3. Project descriptions (strong, resume-ready)
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // ✅ WORKING MODEL
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      success: true,
      content: text,
    });

  } catch (error) {
    console.error("Gemini FULL ERROR:", error);

    res.status(500).json({
      error: error.message || "Failed to generate content",
    });
  }
});

// 📦 Portfolio ZIP (unchanged)
app.post("/api/portfolio-zip", async (req, res) => {
  try {
    const { formData, generated } = req.body || {};

    const projectName = (formData?.fullName || "portfolio")
      .toLowerCase()
      .replace(/\s+/g, "-");

    res.attachment(`${projectName}-portfolio.zip`);

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(res);

    archive.append(htmlTemplate({ formData, generated }), {
      name: "index.html",
    });
    archive.append(cssTemplate, { name: "styles.css" });
    archive.append(jsTemplate, { name: "script.js" });

    archive.append(
      `# Portfolio\n\nOpen index.html directly or deploy this folder.`,
      { name: "README.md" }
    );

    await archive.finalize();

  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to export portfolio ZIP.",
    });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});