import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const cleanBaseUrl = BASE_URL.replace(/\/$/, "");
const API_BASE_URL = cleanBaseUrl.endsWith("/api")
  ? cleanBaseUrl
  : `${cleanBaseUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const generateAIContent = async (payload) => {
  try {
    const { data } = await api.post("/generate", payload);

    if (!data || !data.generated) {
      throw new Error("No content received");
    }

    return data.generated;
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};

export const downloadPortfolioZip = async (formData, generated) => {
  const response = await api.post(
    "/portfolio-zip",
    { formData, generated },
    { responseType: "blob" }
  );

  const blob = new Blob([response.data], { type: "application/zip" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${formData.fullName || "portfolio"}-portfolio.zip`;
  a.click();

  URL.revokeObjectURL(url);
};
