export const emptyProject = () => ({
  title: "",
  description: "",
  techStack: "",
});

export const emptyExperience = () => ({
  role: "",
  company: "",
  duration: "",
  description: "",
});

export const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  title: "",
  education: "",
  educationDetails: {
    collegeName: "",
    degree: "",
    branch: "",
    year: "",
  },
  skills: [],
  projects: [emptyProject()],
  experiences: [],
  social: {
    github: "",
    linkedin: "",
  },
};
