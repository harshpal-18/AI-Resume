# AI Resume + Portfolio Generator

Full-stack AI-powered web app that generates:
- ATS-friendly resume content + downloadable PDF
- Personal portfolio website preview + downloadable ZIP code
- LinkedIn-ready headline, about section, and skills keywords

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- AI: OpenAI API (with local fallback generation when API key is missing)
- PDF: `@react-pdf/renderer`
- Export: ZIP generation via `archiver`

## Folder Structure

```txt
AI-Resume-Portfolio-Generator/
  backend/
    src/
      services/
        openaiService.js
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
3. Add your OpenAI key in `backend/.env`:
   ```bash
   OPENAI_API_KEY=your_key_here
   ```
4. Run both frontend + backend:
   ```bash
   npm run dev
   ```
5. Open the app:
   - Frontend: `http://localhost:5173`
   - Backend health: `http://localhost:5000/api/health`

## MVP Features Included

- Modern, minimal form UI for user details
- AI enhancement of projects/experience and professional summary
- LinkedIn bio generator (headline/about/keywords)
- ATS-style resume content
- Resume PDF download
- Portfolio preview with smooth styling
- Download portfolio code as ZIP

## Deployment Guide

### Option A: Vercel (Recommended)

1. Push project to GitHub.
2. Deploy backend as a Node server (Vercel project root: `backend`).
3. Set environment variables on backend:
   - `OPENAI_API_KEY`
   - `PORT` (optional)
4. Deploy frontend as separate Vercel project (root: `frontend`).
5. Set frontend env:
   - `VITE_API_URL=https://your-backend-domain/api`

### Option B: Netlify + Render/Railway

1. Deploy `frontend` on Netlify.
2. Deploy `backend` on Render/Railway as Node web service.
3. Configure `VITE_API_URL` in Netlify environment.

## Next Improvements

- Multiple resume templates
- Auth + saved history
- Better ATS scoring with rubric
- One-click portfolio deploy action
