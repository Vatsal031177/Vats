import React, { useState } from 'react';
import { ArrowDownRight, Terminal, FileText, CheckCircle2, Briefcase, ShieldCheck, Cpu, MapPin, Mail } from 'lucide-react';
import { DistributedSystemGraph } from './DistributedSystemGraph';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useActiveCv } from '../hooks/useActiveCv';

interface HeroProps {
  onOpenCommandPalette: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCommandPalette }) => {
  const [activeExpTab, setActiveExpTab] = useState<number>(0);
  const { cvInfo } = useActiveCv();

  const topAchievements = [
    {
      company: 'Freelance / Consulting',
      role: 'Full-Stack Developer (Agentic AI)',
      period: '04/2024 – Present',
      location: 'Ingolstadt, Germany',
      badge: 'Current Role',
      coreWin: 'Reduced manual workflow latency by 45% using structured LLM agents',
      bullets: [
        'Engineered human-in-the-loop (HITL) pipelines, eliminating API hallucinations across critical operations.',
        'Delivered zero-to-one B2B SaaS workflow builder with React, Python, Flask, and GCP Cloud Run.',
        'Maintained 99.9% system uptime integrating AI agents with PostgreSQL, HubSpot CRM, and external REST APIs.',
        'Achieved 98% automated test validation coverage with containerized Docker CI/CD pipelines.',
      ],
      technologies: ['Python', 'React', 'Flask', 'GCP Cloud Run', 'Docker', 'PostgreSQL', 'Gemini API'],
    },
    {
      company: 'Contabo',
      role: 'CMS Developer & Security Analyst',
      period: '12/2025 – 04/2026',
      location: 'Ingolstadt, Germany',
      badge: 'Security & Systems',
      coreWin: 'Cut lateral movement risks by 40% via Least Privilege Access & MFA',
      bullets: [
        'Audited and mapped database structures to guarantee strict compliance with GDPR, HIPAA, and PCI-DSS standards.',
        'Conducted continuous API penetration testing and configuration audits to patch zero-day vulnerabilities before go-live.',
        'Hardened enterprise content management clusters across Ubuntu VPS environments.',
      ],
      technologies: ['PostgreSQL', 'Ubuntu VPS', 'RBAC', 'SOC Compliance', 'Docker', 'Bash', 'Linux'],
    },
    {
      company: 'Annextech Software',
      role: 'Project Manager & Lead Systems Engineer',
      period: '07/2022 – 03/2024',
      location: 'Gujarat, India',
      badge: 'Scale & Architecture',
      coreWin: 'Served 10,000+ users & 50,000+ daily API calls with zero P1 incidents',
      bullets: [
        'Architected REST & gRPC microservices with JWT/OAuth2 and circuit-breaker patterns supporting 3 years of 99.9% uptime.',
        'Built multi-layer test suite achieving 85%+ coverage, eliminating 60% of regressions before staging.',
        'Optimized GitHub Actions CI/CD with layer caching, delivering 40% faster build cycles and same-day releases.',
        'Mentored 3 junior engineers, elevating team-wide first-pass code review acceptance to 78%.',
      ],
      technologies: ['Spring Boot', 'Java', 'gRPC', 'Flutter', 'PostgreSQL', 'GitHub Actions', 'JWT/OAuth2'],
    },
  ];

  return (
    <section id="top" className="relative pt-6 pb-16 lg:pt-10 lg:pb-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[320px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* TOP PROFILE CARD: Name, CV Portrait & Core Credentials */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.12] shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
            {/* CV Image with subtle ring and status indicator */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/20 p-1 bg-gradient-to-b from-blue-500/20 to-zinc-900 shadow-xl">
                <img
                  src="./assets/vatsal_portrait_clean.png"
                  alt="Vatsal Maisuria - Full-Stack & Systems Architect"
                  className="w-full h-full rounded-xl object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active</span>
              </div>
            </div>

            {/* Profile Information & Credentials */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                  Vatsal Maisuria
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs font-mono text-blue-300">
                  Full-Stack Architect
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                  100% Industry Focused
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
                  Did Not Complete Master's (Industry Focus)
                </span>
              </div>

              <p className="text-base sm:text-lg text-zinc-300 font-medium leading-relaxed max-w-3xl">
                Staff-caliber Full-Stack Software Engineer who{' '}
                <span className="text-white font-semibold">
                  did not complete his Master's degree at Technische Hochschule Ingolstadt, having intentionally left the program to work full-time on practical engineering and production systems in companies
                </span>
                . Specialized in zero-hallucination agentic workflows, gRPC/REST microservices,
                and high-availability cloud infrastructure.
              </p>

              {/* Badges / Metadata row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-zinc-400 pt-1">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ingolstadt, Bayern, Germany</span>
                </span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">EU Blue Card Eligible</span>
                <span>·</span>
                <span className="text-zinc-400">{PORTFOLIO_DATA.personal.availability}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href={cvInfo.url}
                  download={cvInfo.filename}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Verified CV (PDF)</span>
                </a>

                <button
                  onClick={onOpenCommandPalette}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-all"
                >
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Command Palette (⌘K)</span>
                </button>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Direct Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* WORK EXPERIENCE & QUANTIFIABLE ACHIEVEMENTS SPOTLIGHT ON TOP */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold font-display text-white tracking-wide">
                Work Experience & Verifiable Achievements
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Select a role to inspect production impact & metrics
            </span>
          </div>

          {/* Interactive Role Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topAchievements.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveExpTab(idx)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  activeExpTab === idx
                    ? 'bg-zinc-900 border-blue-500/60 shadow-lg shadow-blue-500/10'
                    : 'glass-panel border-white/[0.06] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-zinc-400">{item.company}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      activeExpTab === idx
                        ? 'bg-blue-600/30 text-blue-300'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white truncate">{item.role}</div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1 line-clamp-1">
                  {item.coreWin}
                </div>
              </button>
            ))}
          </div>

          {/* Active Work Experience Achievement Detail Card */}
          <div className="p-6 rounded-2xl glass-panel border border-white/[0.1] space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-display text-white">
                    {topAchievements[activeExpTab].role}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    @ {topAchievements[activeExpTab].company}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 font-mono mt-0.5">
                  {topAchievements[activeExpTab].location} · {topAchievements[activeExpTab].period}
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300 font-semibold">
                ★ {topAchievements[activeExpTab].coreWin}
              </div>
            </div>

            {/* Achievement Bullet Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-300">
              {topAchievements[activeExpTab].bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-900/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{b}</span>
                </div>
              ))}
            </div>

            {/* Tech Stack used in this role */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-500">Tech Stack:</span>
              {topAchievements[activeExpTab].technologies.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-white/5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2-COLUMN SPLIT: Systems Mission Statement + Interactive Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch pt-4">
          {/* Left Column: Systems Focus & Navigation */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-mono text-zinc-400">
                DISTRIBUTED TOPOLOGY & RESILIENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight font-display">
                Engineering zero-downtime, sub-50ms distributed pipelines.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Interact with the live topology graph on the right. Packets stream through
                gRPC microservices, Envoy gateways, schema-validated task dispatchers,
                and PostgreSQL primary clusters. Click or drag any node to test dynamic routing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs transition-all shadow-md"
              >
                <span>View Flagship Blueprints</span>
                <ArrowDownRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#playground"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-all"
              >
                <span>Live Latency Probe</span>
              </a>
            </div>

            {/* Academic & Certifications Summary */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-300">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>Did Not Complete TH Ingolstadt M.Eng. (Transitioned 100% to Industry Systems)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cisco Cyber-Security Certified & Anthropic MCP Accredited</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Node Graph */}
          <div id="systems" className="lg:col-span-7 flex flex-col">
            <DistributedSystemGraph />
          </div>
        </div>

        {/* 4-COLUMN KPI STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl glass-panel border border-white/[0.08]">
          {PORTFOLIO_DATA.metrics.map((item, idx) => (
            <div key={idx} className="space-y-1 p-2">
              <div className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight tabular-nums">
                {item.value}
              </div>
              <div className="text-xs font-semibold text-zinc-300">{item.label}</div>
              <div className="text-[11px] text-zinc-500 leading-snug">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
