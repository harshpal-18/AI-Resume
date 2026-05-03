import { motion } from "framer-motion";

export function PortfolioPreview({ formData, generated }) {
  return (
    <div className="rounded-xl border border-zinc-800 p-4">
      <h3 className="mb-3 text-lg font-medium">Portfolio Preview</h3>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-zinc-950 p-4">
        <h4 className="text-2xl font-semibold">{formData.fullName}</h4>
        <p className="text-zinc-400">{formData.title || "Software Developer"}</p>
        <p className="mt-2 text-sm text-zinc-300">{generated.portfolio.heroTagline}</p>

        <div className="mt-5">
          <h5 className="font-medium">About</h5>
          <p className="mt-1 text-sm text-zinc-400">{generated.portfolio.about}</p>
        </div>

        <div className="mt-5">
          <h5 className="font-medium">Projects</h5>
          <div className="mt-2 grid gap-2">
            {generated.portfolio.projects.map((project, index) => (
              <article key={index} className="rounded-lg border border-zinc-800 p-3">
                <h6 className="font-medium">{project.title}</h6>
                <p className="text-xs text-zinc-500">{project.techStack}</p>
                <p className="mt-1 text-sm text-zinc-400">{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
