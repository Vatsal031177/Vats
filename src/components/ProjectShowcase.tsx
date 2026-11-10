import React, { useState } from 'react';
import { ExternalLink, Github, Network, FileCode, CheckCircle, ArrowRight, X, Cpu, Layers } from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '../data/portfolioData';

export const ProjectShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ai' | 'systems' | 'cloud' | 'security'>('all');
  const [viewModes, setViewModes] = useState<Record<string, 'overview' | 'architecture'>>({});
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const toggleViewMode = (projectId: string) => {
    setViewModes((prev) => ({
      ...prev,
      [projectId]: prev[projectId] === 'architecture' ? 'overview' : 'architecture',
    }));
  };

  const filteredProjects =
    selectedCategory === 'all'
      ? PORTFOLIO_DATA.projects
      : PORTFOLIO_DATA.projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-16 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              <span>02. FLAGSHIP CASE STUDIES & SYSTEM DESIGN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Production architectures in action.
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-900/70 rounded-xl border border-white/5">
            {[
              { id: 'all', label: 'All Systems' },
              { id: 'ai', label: 'AI & Agents' },
              { id: 'systems', label: 'Autonomous & Robotics' },
              { id: 'cloud', label: 'Cloud Microservices' },
              { id: 'security', label: 'Security & Audits' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isArchitectureView = viewModes[project.id] === 'architecture';

            return (
              <div
                key={project.id}
                className="glass-panel rounded-2xl flex flex-col justify-between border border-white/[0.08] overflow-hidden group hover:border-white/20 transition-all duration-300"
              >
                {/* Card Header & Architecture Toggle */}
                <div className="p-6 pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      {project.category} // SYSTEM
                    </span>

                    {/* Architecture Blueprint Toggle Button */}
                    <button
                      onClick={() => toggleViewMode(project.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                        isArchitectureView
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                      }`}
                      title="Toggle system design architecture diagram"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{isArchitectureView ? 'Overview' : 'Architecture'}</span>
                    </button>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400">{project.subtitle}</p>
                </div>

                {/* Card Body: Conditional View (Overview or Architecture Blueprint) */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  {isArchitectureView ? (
                    /* ARCHITECTURE VIEW: Interactive System Design Flow */
                    <div className="space-y-4 py-1">
                      <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-between pb-2 border-b border-zinc-800">
                        <span>SYSTEM BLUEPRINT</span>
                        <span>END-TO-END FLOW</span>
                      </div>

                      {/* Schematic Diagram Boxes */}
                      <div className="space-y-2 font-mono text-[11px]">
                        {/* Step 1: Client */}
                        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                          <span className="text-zinc-500">CLIENT</span>
                          <span className="text-zinc-200 font-medium text-right truncate max-w-[170px]">
                            {project.architecture.client}
                          </span>
                        </div>

                        {/* Connector */}
                        <div className="flex justify-center -my-1 text-zinc-600">
                          <span className="text-xs">↓</span>
                        </div>

                        {/* Step 2: Gateway */}
                        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-blue-500/30 flex items-center justify-between">
                          <span className="text-blue-400">GATEWAY</span>
                          <span className="text-zinc-200 font-medium text-right truncate max-w-[170px]">
                            {project.architecture.gateway}
                          </span>
                        </div>

                        {/* Connector */}
                        <div className="flex justify-center -my-1 text-zinc-600">
                          <span className="text-xs">↓</span>
                        </div>

                        {/* Step 3: Worker & Microservices */}
                        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-purple-500/30 space-y-1">
                          <span className="text-purple-400 block text-[10px]">SERVICES & WORKERS</span>
                          <div className="space-y-0.5 text-zinc-300 pl-1 text-[10px]">
                            {project.architecture.services.map((srv, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                                <span>{srv}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Connector */}
                        <div className="flex justify-center -my-1 text-zinc-600">
                          <span className="text-xs">↓</span>
                        </div>

                        {/* Step 4: Data Stores */}
                        <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-emerald-500/30 space-y-1">
                          <span className="text-emerald-400 block text-[10px]">PERSISTENCE & CACHE</span>
                          <div className="space-y-0.5 text-zinc-300 pl-1 text-[10px]">
                            {project.architecture.dataStores.map((ds, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                <span>{ds}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-relaxed pt-2 border-t border-zinc-900 italic">
                        {project.architecture.flowDescription}
                      </p>
                    </div>
                  ) : (
                    /* OVERVIEW VIEW: Description, Problem, Solution, Metrics */
                    <div className="space-y-4">
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Quantifiable Impact Metrics */}
                      <div className="space-y-1.5 pt-2">
                        {project.metrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{metric}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech stack badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-400 border border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="pt-5 mt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="text-xs font-semibold text-white hover:text-blue-400 flex items-center gap-1 transition-colors"
                    >
                      <span>Deep Dive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                          title="View Source on GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                          title="Open Live Deployment"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Deep Technical Case Study Walkthrough */}
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                    ARCHITECTURAL CASE STUDY
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white mt-1">
                    {activeModalProject.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{activeModalProject.subtitle}</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase">THE PROBLEM</h4>
                    <p className="text-zinc-300 leading-relaxed">{activeModalProject.problem}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase">ENGINEERED SOLUTION</h4>
                    <p className="text-zinc-300 leading-relaxed">{activeModalProject.solution}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase">END-TO-END DATA LIFECYCLE</h4>
                    <p className="text-xs font-mono text-emerald-300 leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                      {activeModalProject.architecture.flowDescription}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase">VERIFIABLE BENCHMARKS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {activeModalProject.metrics.map((m, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5 text-center">
                          <span className="text-xs font-mono text-zinc-200">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono">
                    Production Stack: {activeModalProject.techStack.join(' · ')}
                  </span>
                  <div className="flex items-center gap-2">
                    {activeModalProject.githubUrl && (
                      <a
                        href={activeModalProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-white border border-white/10"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}
                    {activeModalProject.liveUrl && (
                      <a
                        href={activeModalProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
