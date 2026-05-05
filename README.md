# AI Resume + Portfolio Generator

Full-stack AI-powered web app that generates:

- ATS-friendly resume content and downloadable PDF
- Personal portfolio website preview and downloadable ZIP code
- LinkedIn-ready headline, about section, and skills keywords

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- AI: Gemini API, with local fallback generation when the API key is missing
- PDF: `@react-pdf/renderer`
- Export: ZIP generation via `archiver`

## Folder Structure

```txt
AI-Resume-Portfolio-Generator/
  backend/
    src/
      services/
        portfolioTemplateService.js
      server.js
    .env.example
  frontend/
    src/
      api/client.js
      components/
        PortfolioPreview.jsx
        ResumeDocument.jsx
      constants/defaults.js
      App.jsx
      index.css
    .env.example
  package.json
  README.md
```

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   npm install --prefix frontend
   npm install --prefix backend
   ```

2. Configure environment:

   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`

3. Add your Gemini key in `backend/.env`:

   ```bash
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-1.5-flash-latest
   ```

4. Run both frontend and backend:

   ```bash
   npm run dev
   ```

5. Open the app:

   - Frontend: `http://localhost:5173`
   - Backend health: `http://localhost:5000/api/health`

## MVP Features Included

- Modern form UI for user details
- Gemini enhancement of projects, experience, and professional summary
- LinkedIn bio generator
- ATS-style resume content
- Resume PDF download
- Portfolio preview
- Download portfolio code as ZIP

## Deployment Guide

Deploy the backend and frontend separately.

Backend environment variables:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` optional, defaults to `gemini-1.5-flash-latest`
- `PORT` optional

Frontend environment variables:

- `VITE_API_URL=https://your-backend-domain`

## Next Improvements

- Multiple resume templates
- Auth and saved history
- Better ATS scoring with a rubric
- One-click portfolio deploy action
