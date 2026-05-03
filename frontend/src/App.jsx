import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { generateAIContent, downloadPortfolioZip } from "./api/client";
import { ResumeDocument } from "./components/ResumeDocument";
import { PortfolioPreview } from "./components/PortfolioPreview";
import { emptyExperience, emptyProject, initialFormState } from "./constants/defaults";

const SKILL_OPTIONS = [
  "React",
  "Node.js",
  "JavaScript",
  "Python",
  "SQL",
  "MongoDB",
  "Tailwind",
  "HTML",
  "CSS",
];

const COLLEGE_OPTIONS = [
  "VIT Bhopal University",
  "IIT Delhi",
  "IIT Bombay",
  "NIT Trichy",
  "Delhi University",
  "Bennett University",
  "Manipal University",
];

const DEGREE_OPTIONS = ["B.Tech", "BCA", "BBA", "B.Sc", "M.Tech", "MCA", "MBA"];
const BRANCH_OPTIONS = ["CSE", "IT", "ECE", "EEE", "ME", "Civil", "Data Science"];
const YEAR_OPTIONS = ["1st", "2nd", "3rd", "4th"];

function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [skillInput, setSkillInput] = useState("");
  const [collegeQuery, setCollegeQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(null);

  const canGenerate = useMemo(
    () =>
      formData.fullName &&
      formData.email &&
      formData.educationDetails.collegeName &&
      formData.educationDetails.degree &&
      formData.educationDetails.branch &&
      formData.projects[0].title,
    [formData],
  );

  const suggestedSkills = useMemo(() => {
    const query = skillInput.toLowerCase().trim();
    return SKILL_OPTIONS.filter(
      (skill) =>
        !formData.skills.includes(skill) &&
        (!query || skill.toLowerCase().includes(query)),
    );
  }, [skillInput, formData.skills]);

  const suggestedColleges = useMemo(() => {
    const query = collegeQuery.toLowerCase().trim();
    if (!query) return [];
    return COLLEGE_OPTIONS.filter((college) =>
      college.toLowerCase().includes(query),
    ).slice(0, 5);
  }, [collegeQuery]);

  const onChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const onEducationChange = (field, value) =>
    onChange("educationDetails", { ...formData.educationDetails, [field]: value });

  const updateProject = (index, field, value) => {
    setFormData((prev) => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], [field]: value };
      return { ...prev, projects };
    });
  };

  const updateExperience = (index, field, value) => {
    setFormData((prev) => {
      const experiences = [...prev.experiences];
      experiences[index] = { ...experiences[index], [field]: value };
      return { ...prev, experiences };
    });
  };

  const addSkill = (nextSkill) => {
    const next = nextSkill.trim();
    if (!next) return;
    if (!formData.skills.includes(next)) {
      onChange("skills", [...formData.skills, next]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    onChange(
      "skills",
      formData.skills.filter((item) => item !== skill),
    );
  };

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    try {
      const educationText = `${formData.educationDetails.degree} in ${formData.educationDetails.branch}, ${formData.educationDetails.collegeName} (${formData.educationDetails.year || "Year N/A"})`;
      const payload = {
        ...formData,
        skills: formData.skills.join(", "),
        skillsArray: formData.skills,
        education: educationText,
      };
      const response = await generateAIContent(payload);
      setGenerated(response);
    } catch (apiError) {
      setError(apiError?.response?.data?.error || "Unable to generate content right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur"
        >
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-wide text-zinc-300">
            <Sparkles size={14} /> AI Resume + Portfolio Generator
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Build your career assets in one click</h1>
          <p className="mt-3 max-w-3xl text-zinc-400">
            Fill out your details, generate professional AI-enhanced content, download an ATS-friendly
            resume PDF, get a LinkedIn-ready bio, and export portfolio source code.
          </p>
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-xl font-medium">Input Details</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="input" placeholder="Full Name" value={formData.fullName} onChange={(e) => onChange("fullName", e.target.value)} />
              <input className="input" placeholder="Email" value={formData.email} onChange={(e) => onChange("email", e.target.value)} />
              <input className="input" placeholder="Phone Number" value={formData.phone} onChange={(e) => onChange("phone", e.target.value)} />
              <input className="input" placeholder="Professional Title" value={formData.title} onChange={(e) => onChange("title", e.target.value)} />
              <input className="input" placeholder="GitHub URL" value={formData.social.github} onChange={(e) => onChange("social", { ...formData.social, github: e.target.value })} />
              <input className="input" placeholder="LinkedIn URL" value={formData.social.linkedin} onChange={(e) => onChange("social", { ...formData.social, linkedin: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="label">Education</label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="relative">
                  <input
                    className="input"
                    placeholder="College Name"
                    value={collegeQuery || formData.educationDetails.collegeName}
                    onChange={(e) => {
                      setCollegeQuery(e.target.value);
                      onEducationChange("collegeName", e.target.value);
                    }}
                  />
                  {suggestedColleges.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-1">
                      {suggestedColleges.map((college) => (
                        <button
                          key={college}
                          type="button"
                          className="block w-full rounded-lg px-2 py-1 text-left text-sm text-zinc-300 hover:bg-zinc-800"
                          onClick={() => {
                            onEducationChange("collegeName", college);
                            setCollegeQuery(college);
                          }}
                        >
                          {college}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <select
                  className="input"
                  value={formData.educationDetails.degree}
                  onChange={(e) => onEducationChange("degree", e.target.value)}
                >
                  <option value="">Degree</option>
                  {DEGREE_OPTIONS.map((degree) => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
                <select
                  className="input"
                  value={formData.educationDetails.branch}
                  onChange={(e) => onEducationChange("branch", e.target.value)}
                >
                  <option value="">Branch</option>
                  {BRANCH_OPTIONS.map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
                <select
                  className="input"
                  value={formData.educationDetails.year}
                  onChange={(e) => onEducationChange("year", e.target.value)}
                >
                  <option value="">Year</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Skills</label>
              <div className="relative">
                <input
                  className="input"
                  placeholder="Type to search skills..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (suggestedSkills[0]) addSkill(suggestedSkills[0]);
                    }
                  }}
                />
                {skillInput && suggestedSkills.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-1">
                    {suggestedSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        className="block w-full rounded-lg px-2 py-1 text-left text-sm text-zinc-300 hover:bg-zinc-800"
                        onClick={() => addSkill(skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <button key={skill} type="button" onClick={() => removeSkill(skill)} className="chip">
                    {skill} ×
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="label">Projects</label>
                <button type="button" className="btn-secondary" onClick={() => onChange("projects", [...formData.projects, emptyProject()])}>
                  Add
                </button>
              </div>
              {formData.projects.map((project, index) => (
                <div key={index} className="grid gap-2 rounded-xl border border-zinc-800 p-3">
                  <input className="input" placeholder="Project title" value={project.title} onChange={(e) => updateProject(index, "title", e.target.value)} />
                  <textarea className="input min-h-20" placeholder="Project description" value={project.description} onChange={(e) => updateProject(index, "description", e.target.value)} />
                  <input className="input" placeholder="Tech stack" value={project.techStack} onChange={(e) => updateProject(index, "techStack", e.target.value)} />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="label">Work Experience (optional)</label>
                <button type="button" className="btn-secondary" onClick={() => onChange("experiences", [...formData.experiences, emptyExperience()])}>
                  Add
                </button>
              </div>
              {formData.experiences.map((experience, index) => (
                <div key={index} className="grid gap-2 rounded-xl border border-zinc-800 p-3">
                  <input className="input" placeholder="Role" value={experience.role} onChange={(e) => updateExperience(index, "role", e.target.value)} />
                  <input className="input" placeholder="Company" value={experience.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
                  <input className="input" placeholder="Duration" value={experience.duration} onChange={(e) => updateExperience(index, "duration", e.target.value)} />
                  <textarea className="input min-h-20" placeholder="What you did" value={experience.description} onChange={(e) => updateExperience(index, "description", e.target.value)} />
                </div>
              ))}
            </div>

            <button type="button" disabled={!canGenerate || loading} onClick={handleGenerate} className="btn-primary">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : "Generate Assets"}
            </button>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </div>

          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-xl font-medium">Generated Output</h2>
            {!generated && <p className="text-zinc-400">Generate content to preview resume, portfolio and LinkedIn bio.</p>}

            {generated && (
              <div className="space-y-4">
                <div className="rounded-xl border border-zinc-800 p-4">
                  <h3 className="mb-2 text-lg font-medium">LinkedIn Bio</h3>
                  <p className="text-sm font-semibold text-zinc-300">{generated.linkedin.headline}</p>
                  <p className="mt-2 text-sm text-zinc-400">{generated.linkedin.about}</p>
                  <p className="mt-2 text-xs text-zinc-500">Skills: {generated.linkedin.skillsKeywords.join(", ")}</p>
                </div>

                <div className="rounded-xl border border-zinc-800 p-4">
                  <h3 className="mb-2 text-lg font-medium">Resume</h3>
                  <p className="text-sm text-zinc-400">{generated.resume.summary}</p>
                  <div className="mt-3">
                    <PDFDownloadLink
                      document={<ResumeDocument formData={formData} generated={generated} />}
                      fileName={`${formData.fullName || "resume"}-resume.pdf`}
                      className="btn-primary inline-flex w-auto"
                    >
                      {({ loading: docLoading }) => (docLoading ? "Preparing PDF..." : "Download Resume PDF")}
                    </PDFDownloadLink>
                  </div>
                </div>

                <PortfolioPreview formData={formData} generated={generated} />

                <button type="button" onClick={() => downloadPortfolioZip(formData, generated)} className="btn-secondary w-full">
                  Download Portfolio Code (ZIP)
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
