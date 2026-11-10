import React from 'react';
import { Briefcase, GraduationCap, Award, ExternalLink, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="timeline" className="py-16 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              <span>03. CAREER TRAJECTORY & ENGINEERING WINS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Work history & quantifiable impact.
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Production experience across venture startups, enterprise hosting infrastructure,
            and research laboratories in Germany and India.
          </p>
        </div>

        {/* 2-Column Layout: Experience Timeline + Education & Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Work Experience with vertical scroll-linked line */}
          <div className="lg:col-span-8 space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-zinc-800">
            {PORTFOLIO_DATA.experiences.map((exp) => (
              <div key={exp.id} className="relative pl-10 group">
                {/* Timeline node dot */}
                <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-blue-500 group-hover:border-white group-hover:scale-125 transition-all" />

                <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] space-y-3 group-hover:border-white/20 transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-white/[0.05]">
                    <div>
                      <h3 className="text-lg font-bold font-display text-white group-hover:text-blue-400 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span className="font-semibold text-zinc-300">{exp.company}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          {exp.location}
                        </span>
                        <span>·</span>
                        <span className="text-zinc-500">{exp.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/5">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Quantified highlights */}
                  <ul className="space-y-2 text-xs text-zinc-300 leading-relaxed pt-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.05]">
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-400 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Education & Certifications */}
          <div className="lg:col-span-4 space-y-6">
            {/* Education Box */}
            <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Academic Credentials
                </h3>
              </div>

              <div className="space-y-4">
                {PORTFOLIO_DATA.education.map((edu, idx) => (
                  <div key={idx} className="space-y-1.5 pb-3 border-b border-white/[0.04] last:border-0 last:pb-0">
                    <h4 className="text-xs font-bold text-white leading-snug">
                      {edu.degree}
                    </h4>
                    <div className="text-xs text-zinc-400">
                      {edu.institution} · {edu.location}
                    </div>
                    <span className="inline-block text-[11px] font-mono text-zinc-500">
                      {edu.period}
                    </span>
                    {edu.grade && (
                      <div className="text-[11px] font-mono text-emerald-400">
                        {edu.grade}
                      </div>
                    )}
                    <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                      {edu.notes || edu.coursework}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Box */}
            <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Industry Certifications
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {PORTFOLIO_DATA.certifications.length} verified
                </span>
              </div>

              <div className="space-y-3">
                {PORTFOLIO_DATA.certifications.map((cert) => (
                  <a
                    key={cert.id}
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors leading-snug">
                          {cert.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-1 font-mono">
                          <span>{cert.issuer}</span>
                          <span>·</span>
                          <span>{cert.date}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0 mt-0.5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
