const htmlTemplate = ({ formData, generated }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${formData.fullName} Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>html{scroll-behavior:smooth;}</style>
</head>
<body class="bg-zinc-950 text-zinc-100">
  <header class="min-h-screen flex items-center justify-center px-6">
    <div class="max-w-3xl text-center">
      <h1 class="text-4xl md:text-6xl font-bold">${formData.fullName}</h1>
      <p class="mt-3 text-zinc-300 text-lg">${formData.title || "Software Developer"}</p>
      <p class="mt-4 text-zinc-400">${generated.portfolio.heroTagline}</p>
      <a href="#projects" class="inline-block mt-8 px-5 py-2 rounded-full border border-zinc-600 hover:border-zinc-400">View Projects</a>
    </div>
  </header>
  <section id="about" class="max-w-4xl mx-auto px-6 py-16">
    <h2 class="text-2xl font-semibold">About</h2>
    <p class="mt-4 text-zinc-400">${generated.portfolio.about}</p>
  </section>
  <section id="skills" class="max-w-4xl mx-auto px-6 py-16">
    <h2 class="text-2xl font-semibold">Skills</h2>
    <div class="mt-4 flex flex-wrap gap-2">${generated.resume.skills.map((skill) => `<span class="px-3 py-1 rounded-full border border-zinc-700 text-sm">${skill}</span>`).join("")}</div>
  </section>
  <section id="projects" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="text-2xl font-semibold">Projects</h2>
    <div class="grid md:grid-cols-2 gap-4 mt-4">
      ${generated.portfolio.projects.map((project) => `
      <article class="rounded-xl border border-zinc-800 p-4">
        <h3 class="text-lg font-medium">${project.title}</h3>
        <p class="text-zinc-500 text-sm mt-1">${project.techStack}</p>
        <p class="text-zinc-400 mt-3">${project.description}</p>
      </article>
      `).join("")}
    </div>
  </section>
  <section id="contact" class="max-w-4xl mx-auto px-6 py-16">
    <h2 class="text-2xl font-semibold">Contact</h2>
    <p class="mt-4 text-zinc-300">${formData.email} | ${formData.phone}</p>
    <p class="mt-2 text-zinc-400">${formData.social.github} ${formData.social.linkedin}</p>
  </section>
</body>
</html>
`;

const cssTemplate = `*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif}`;
const jsTemplate = `console.log("Portfolio loaded");`;

module.exports = { htmlTemplate, cssTemplate, jsTemplate };
