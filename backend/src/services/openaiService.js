const OpenAI = require("openai");

let client = null;
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const fallbackTransform = (input) => {
  const projects = input.projects.map((project) => ({
    title: project.title,
    techStack: project.techStack,
    bullets: [
      `Developed ${project.title} using ${project.techStack || "modern technologies"} with a focus on reliability and maintainability.`,
      `Designed user-centric functionality and improved the overall user experience with iterative enhancements.`,
      `Collaborated on testing, optimization, and deployment processes to ensure smooth production delivery.`,
    ],
    description: `Built ${project.title}, a practical solution that solves real user needs while showcasing strong engineering practices.`,
  }));

  const experience = (input.experiences || [])
    .filter((item) => item.role || item.company || item.description)
    .map((item) => ({
      role: item.role || "Team Contributor",
      company: item.company || "Organization",
      duration: item.duration || "N/A",
      bullets: [
        `Contributed to cross-functional initiatives and delivered high-quality results under deadlines.`,
        `Implemented scalable solutions and improved operational efficiency through structured execution.`,
        `Maintained clear communication with stakeholders and supported project lifecycle activities.`,
      ],
    }));

  return {
    resume: {
      summary: `${input.fullName} is a results-oriented professional with hands-on experience in software delivery, problem solving, and continuous improvement. Skilled at building practical digital solutions and communicating effectively across teams.`,
      skills: input.skills,
      education: input.education,
      projects,
      experience,
    },
    linkedin: {
      headline: `${input.title || "Software Developer"} | ${input.skills.slice(0, 3).join(" | ") || "Product Builder"}`,
      about: `${input.fullName} builds reliable digital products and enjoys turning ideas into measurable outcomes. Strong in collaboration, modern development practices, and creating user-focused experiences.`,
      skillsKeywords: input.skills.slice(0, 12),
    },
    portfolio: {
      heroTagline: "Building meaningful digital products with clean design and practical engineering.",
      about: `${input.fullName} is passionate about developing modern, scalable, and user-friendly applications that solve real-world problems.`,
      projects,
    },
    atsScore: {
      score: Math.min(95, 60 + input.skills.length * 4 + projects.length * 3),
      tips: [
        "Use job-description specific keywords in your summary and bullet points.",
        "Quantify achievements with numbers when possible.",
        "Keep formatting consistent and avoid complex visual elements in ATS resume.",
      ],
    },
  };
};

const promptForPayload = (payload) => `
You are an expert resume writer and portfolio strategist.
Return ONLY valid JSON with this shape:
{
  "resume": {
    "summary": "string",
    "skills": ["string"],
    "education": "string",
    "projects": [{"title":"string","techStack":"string","bullets":["string"]}],
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
- Keep resume content suitable for 1-2 page output.
- If experiences are empty, return an empty array for experience.

Input JSON:
${JSON.stringify(payload, null, 2)}
`;

const parseModelJson = (raw) => {
  const trimmed = raw.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model response is not JSON.");
  return JSON.parse(trimmed.slice(start, end + 1));
};

const generateAssets = async (payload) => {
  if (!client) {
    return fallbackTransform(payload);
  }

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: promptForPayload(payload),
    temperature: 0.4,
  });

  const outputText = completion.output_text || "";
  return parseModelJson(outputText);
};

module.exports = { generateAssets };
