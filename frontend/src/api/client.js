import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 🔥 FIXED: return only content
export const generateAIContent = async (payload) => {
  try {
    const { data } = await api.post("/generate", payload);

    if (!data || !data.content) {
      throw new Error("No content received from server");
    }

    return data.content; // ✅ return only text
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

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${formData.fullName || "portfolio"}-portfolio.zip`;
  anchor.click();

  URL.revokeObjectURL(url);
};