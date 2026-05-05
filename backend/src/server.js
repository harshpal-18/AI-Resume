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
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const skillsFromPayload = (input) => {
  if (Array.isArray(input.skillsArray)) return input.skillsArray;
  if (Array.isArray(input.skills)) return input.skills;
  return String(input.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const fallbackTransform = (input) => {
  const skills = skillsFromPayload(input);
  const projects = (input.projects || [])
    .filter((project) => project.title || project.description || project.techStack)
    .map((project) => ({
      title: project.title || "Project",
      techStack: project.techStack || "Modern technologies",
      bullets: [
        `Built ${project.title || "the project"} using ${project.techStack || "modern technologies"} with a focus on usability and maintainability.`,
        project.description || "Delivered practical functionality aligned with user needs.",
        "Improved presentation, structure, and reliability through iterative development.",
      ],
      description:
        project.description ||
        `A practical portfolio project built with ${project.techStack || "modern technologies"}.`,
    }));

  const experience = (input.experiences || [])
    .filter((item) => item.role || item.company || item.description)
    .map((item) => ({
      role: item.role || "Contributor",
      company: item.company || "Organization",
      duration: item.duration || "N/A",
      bullets: [
        item.description || "Contributed to project delivery and team execution.",
        "Collaborated with stakeholders to complete work with clear priorities.",
      ],
    }));

  return {
    resume: {
      summary: `${input.fullName || "The candidate"} is a motivated ${input.title || "professional"} with hands-on experience building practical digital projects and communicating technical work clearly.`,
      skills,
      education: input.education || "",
      projects,
      experience,
    },
    linkedin: {
      headline: `${input.title || "Software Developer"} | ${skills.slice(0, 3).join(" | ") || "Portfolio Builder"}`,
      about: `${input.fullName || "I"} build reliable, user-focused digital products and enjoy turning ideas into polished outcomes.`,
      skillsKeywords: skills.slice(0, 12),
    },
    portfolio: {
      heroTagline: "Building useful digital products with clean design and practical engineering.",
      about: `${input.fullName || "This professional"} creates modern applications that combine clear user experience with dependable implementation.`,
      projects,
    },
    atsScore: {
      score: Math.min(95, 60 + skills.length * 4 + projects.length * 3),
      tips: [
        "Add job-description keywords to the summary and project bullets.",
        "Quantify project impact wherever possible.",
        "Keep resume formatting simple for ATS parsing.",
      ],
    },
  };
};

const promptForPayload = (payload) => `
You are an expert resume writer and portfolio strategist.
Return ONLY valid JSON. Do not wrap it in markdown.

Required JSON shape:
{
  "resume": {
    "summary": "string",
    "skills": ["string"],
    "education": "string",
    "projects": [{"title":"string","techStack":"string","bullets":["string"],"description":"string"}],
    "experience": [{"role":"string","company":"string","duration":"string","bullets":["string"]}]
  },
  "linkedin": {
    "headline": "string",
    "about": "string",
    "skillsKeywords": ["string"]
  },
  "portfolio": {
    "heroTagline": "string",
    "about": "string",
    "projects": [{"title":"string","techStack":"string","description":"string"}]
  },
  "atsScore": {
    "score": number,
    "tips": ["string"]
  }
}

Rules:
- ATS-friendly, concise, high-impact wording.
- Expand short input into professional achievements.
- Keep resume content suitable for a 1-2 page resume.
- If work experience is empty, return an empty array for resume.experience.
- Use the provided skills as an array in resume.skills and linkedin.skillsKeywords.

Input JSON:
${JSON.stringify(payload, null, 2)}
`;

const parseModelJson = (raw) => {
  const trimmed = raw.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Gemini response was not JSON.");
  return JSON.parse(trimmed.slice(start, end + 1));
};

app.post("/api/generate", async (req, res) => {
  try {
    const payload = req.body || {};

    if (!genAI) {
      return res.json({
        success: true,
        generated: fallbackTransform(payload),
        source: "fallback",
      });
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const result = await model.generateContent(promptForPayload(payload));
    const generated = parseModelJson(result.response.text());

    res.json({
      success: true,
      generated,
      source: "gemini",
    });
  } catch (error) {
    console.error("Gemini generate error:", error);

    res.status(500).json({
      error: error.message || "Failed to generate content",
    });
  }
});

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
      "# Portfolio\n\nOpen index.html directly or deploy this folder.",
      { name: "README.md" }
    );

    await archive.finalize();
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to export portfolio ZIP.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
