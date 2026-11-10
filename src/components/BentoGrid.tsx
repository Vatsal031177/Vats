import React, { useState, useEffect } from 'react';
import { Layers, Cpu, Clock, BookOpen, ExternalLink, ShieldCheck, Terminal, Compass } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

type TechCategory = 'all' | 'languages' | 'cloud' | 'ai' | 'backend' | 'security';

interface TechItem {
  name: string;
  category: TechCategory;
  usage: string;
}

const TECH_ITEMS: TechItem[] = [
  { name: 'Python', category: 'languages', usage: 'LLM agents, Flask, FastAPI, PyTorch, ROS, QLoRA' },
  { name: 'TypeScript', category: 'languages', usage: 'Full-stack type safety, React 19, Node.js, Next.js' },
  { name: 'Dart / Flutter', category: 'languages', usage: 'Cross-platform mobile & desktop, 10k+ users' },
  { name: 'C++ / CUDA', category: 'languages', usage: 'HPC research, OpenMP offloading, memory benchmarking' },
  { name: 'Java', category: 'languages', usage: 'Spring Boot enterprise microservices, JUnit' },
  { name: 'SQL & Bash', category: 'languages', usage: 'PostgreSQL migrations, Ubuntu VPS scripting' },
  { name: 'Docker', category: 'cloud', usage: 'Containerized microservices, multi-stage builds, 98% coverage' },
  { name: 'Kubernetes', category: 'cloud', usage: 'Autoscaling FastAPI inference pods, rolling deployments' },
  { name: 'GCP Cloud Run', category: 'cloud', usage: 'Serverless container execution for Automation Flow Studio' },
  { name: 'GitHub Actions', category: 'cloud', usage: 'Intelligent caching CI/CD, 40% faster build cycles' },
  { name: 'Prometheus & Grafana', category: 'cloud', usage: 'Cluster telemetry, latency alerts, system metrics' },
  { name: 'LLM Agents', category: 'ai', usage: 'HITL assessment pipelines, structured outputs, 45% latency cut' },
  { name: 'QLoRA & PyTorch', category: 'ai', usage: 'Quantized fine-tuning, adapter merging, edge serving' },
  { name: 'NVIDIA Jetson Nano', category: 'ai', usage: 'Autonomous navigation agents, edge simulation' },
  { name: 'OpenCV & YOLO', category: 'ai', usage: 'Real-time object detection & pixel-wise segmentation' },
  { name: 'Spring Boot & gRPC', category: 'backend', usage: 'High-throughput microservices, circuit-breaker resilience' },
  { name: 'FastAPI & Flask', category: 'backend', usage: 'REST API gateways, async dispatchers, OpenAPI 3.0' },
  { name: 'PostgreSQL', category: 'backend', usage: 'ACID clusters, schema migrations, HIPAA/GDPR compliance' },
  { name: 'Redis', category: 'backend', usage: 'Sub-millisecond task queuing, Pub/Sub meeting broadcast' },
  { name: 'RBAC & Least Privilege', category: 'security', usage: '40% lateral movement reduction at Contabo' },
  { name: 'API Pentesting', category: 'security', usage: 'Continuous vulnerability remediation, zero-day audits' },
];

export const BentoGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TechCategory>('all');
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [germanyTime, setGermanyTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setGermanyTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredTech =
    activeCategory === 'all'
      ? TECH_ITEMS
      : TECH_ITEMS.filter((t) => t.category === activeCategory);

  return (
    <section id="about" className="py-16 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>01. ENGINEERING PHILOSOPHY & CONSTELLATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Systems architecture meets applied AI.
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Bridging distributed microservices with autonomous intelligent systems—governed by
            strict type invariants, least-privilege security, and measurable SLA metrics.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Interactive Tech Constellation (Span 7 cols) */}
          <div className="md:col-span-7 glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/[0.08]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Technology Constellation
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  {filteredTech.length} technologies
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-5 p-1 bg-zinc-900/60 rounded-xl border border-white/5">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'languages', label: 'Languages' },
                  { key: 'backend', label: 'Backend & APIs' },
                  { key: 'cloud', label: 'Cloud & DevOps' },
                  { key: 'ai', label: 'AI & Autonomous' },
                  { key: 'security', label: 'Security' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCategory(tab.key as TechCategory)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      activeCategory === tab.key
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Constellation Grid */}
              <div className="flex flex-wrap gap-2 min-h-[140px] items-start content-start">
                {filteredTech.map((item) => (
                  <button
                    key={item.name}
                    onMouseEnter={() => setHoveredTech(item)}
                    onClick={() => setHoveredTech(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all text-left border ${
                      hoveredTech?.name === item.name
                        ? 'bg-blue-600/20 text-blue-200 border-blue-500/50 shadow-md shadow-blue-500/10 scale-105'
                        : 'bg-zinc-900/70 text-zinc-300 border-white/5 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Hovered Context Callout */}
            <div className="mt-5 p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 text-xs font-mono">
              <span className="text-blue-400 font-semibold block mb-1">
                {hoveredTech ? hoveredTech.name : 'Hover or tap any technology above'}
              </span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {hoveredTech
                  ? `Production context: ${hoveredTech.usage}`
                  : 'Displays verifiable production deployments, container configurations, and framework integrations across real systems.'}
              </p>
            </div>
          </div>

          {/* Card 2: Core Engineering Principles (Span 5 cols) */}
          <div className="md:col-span-5 glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08] mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Architectural Tenets
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="text-emerald-400 font-mono text-[11px]">01.</span>
                    <span>Determinism Over Hallucination</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed pl-5">
                    Enforcing JSON Schema structured outputs, human-in-the-loop review gates,
                    and evaluation pipelines to eliminate LLM non-determinism in production.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="text-blue-400 font-mono text-[11px]">02.</span>
                    <span>Resilient Microservices</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed pl-5">
                    Architecting with gRPC, circuit breakers, least-privilege RBAC, and multi-layer
                    test suites achieving 85%+ coverage to eliminate production regressions.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="text-purple-400 font-mono text-[11px]">03.</span>
                    <span>Continuous Performance Validation</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed pl-5">
                    Measuring p50, p95, and p99 latency SLAs on every commit. Caching CI/CD artifacts
                    for 40% faster turnaround and zero-downtime rollouts.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>SLA Target: 99.9%</span>
              <span className="text-emerald-400">Zero P1 Incidents</span>
            </div>
          </div>

          {/* Card 3: Research & Peer-Reviewed Publications (Span 7 cols) */}
          <div className="md:col-span-7 glass-panel rounded-2xl p-6 border border-white/[0.08]">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Research & Publications
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">2 Peer-Reviewed Papers</span>
            </div>

            <div className="space-y-4">
              {PORTFOLIO_DATA.publications.map((pub) => (
                <div
                  key={pub.id}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-2 hover:border-white/15 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {pub.title}
                    </h4>
                    <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-800 shrink-0">
                      {pub.year}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{pub.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
                    <span>{pub.publisher}</span>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      {pub.technologies.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Real-Time Environment & Research Focus (Span 5 cols) */}
          <div className="md:col-span-5 glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/[0.08]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Live Engineering Hub
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active Node
                </span>
              </div>

              <div className="space-y-4">
                {/* Clock */}
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500">
                    CENTRAL EUROPEAN TIME (INGOLSTADT, DE)
                  </span>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    {germanyTime || '14:48:52 CET'}
                  </div>
                  <span className="text-xs text-zinc-400">
                    Bayern, Germany · UTC+1 (CET)
                  </span>
                </div>

                {/* Research / Industry Focus */}
                <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-semibold text-white">Practical Engineering Focus</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Did not complete Master's degree at TH Ingolstadt — intentionally stepped away to focus 100% on building high-impact production systems, gRPC microservices, and autonomous AI agents in companies.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono">Work Permit:</span>
              <span className="text-zinc-200 font-medium">EU Blue Card Eligible</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
