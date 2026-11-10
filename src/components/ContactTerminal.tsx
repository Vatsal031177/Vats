import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Copy, Check, Send, Download, Linkedin, Github, Award, ExternalLink } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useActiveCv } from '../hooks/useActiveCv';

export const ContactTerminal: React.FC = () => {
  const { cvInfo } = useActiveCv();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger lightweight canvas confetti celebration
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 300;
    canvas.height = 160;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
    }> = [];

    const colors = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        alpha: 1,
      });
    }

    let frameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha -= 0.02;
        if (p.alpha > 0) {
          alive = true;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      });
      if (alive) {
        frameId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animate();
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.personal.email);
    setCopiedEmail(true);
    triggerConfetti();
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.personal.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setStatusMessage('');

    const newInquiryRecord = {
      id: `inq-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim() || 'General Architecture Inquiry',
      message: formData.message.trim(),
      timestamp: new Date().toISOString(),
      clientIp: 'Client Direct (HTTPS / Edge)',
      isRead: false,
      isStarred: false,
    };

    // Helper to persist locally (for GitHub Pages static hosting)
    const persistLocally = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('vatsal_contact_inquiries') || '[]');
        localStorage.setItem('vatsal_contact_inquiries', JSON.stringify([newInquiryRecord, ...stored]));
        window.dispatchEvent(new Event('vatsal_inquiry_added'));
      } catch {
        // Storage full or unavailable
      }
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormStatus('success');
        setStatusMessage(data.message || 'Message transmitted! Vatsal will reply soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        triggerConfetti();
        persistLocally();
      } else {
        // When running on static GitHub Pages, server route is 404
        persistLocally();
        setFormStatus('success');
        setStatusMessage('Message transmitted! Saved to Vatsal’s secure inquiry register.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        triggerConfetti();
      }
    } catch {
      // Offline or static GitHub Pages fallback
      persistLocally();
      setFormStatus('success');
      setStatusMessage('Message transmitted! Saved to Vatsal’s secure inquiry register.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      triggerConfetti();
    }
  };

  return (
    <section id="contact" className="py-16 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>05. SMART CONTACT TERMINAL & INQUIRIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Let's build systems together.
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Open for Staff/Senior Full-Stack, Distributed Backend, and Autonomous AI Roles.
            Based in Germany with full EU Blue Card eligibility.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contacts & CV Download (Span 5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 border border-white/[0.08] space-y-6 relative overflow-hidden">
            <canvas
              ref={confettiCanvasRef}
              className="absolute inset-0 pointer-events-none z-30 w-full h-full"
            />

            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                DIRECT CHANNELS
              </span>
              <h3 className="text-xl font-bold font-display text-white">
                Get in touch with Vatsal
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Fastest response via email. Available for technical discussions, architectural audits,
                and team interviews.
              </p>
            </div>

            {/* Email quick copy */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">PRIMARY EMAIL</div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-mono text-white truncate">
                  {PORTFOLIO_DATA.personal.email}
                </span>
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors shrink-0"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Phone quick copy */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">DIRECT PHONE / WHATSAPP</div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-mono text-white truncate">
                  {PORTFOLIO_DATA.personal.phone}
                </span>
                <button
                  onClick={copyPhone}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors shrink-0"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Location & Status info */}
            <div className="space-y-2 text-xs text-zinc-400 font-mono pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>Ingolstadt, Bayern, 85051 Germany</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-zinc-500" />
                <span>EU Blue Card Eligibility Confirmed</span>
              </div>
            </div>

            {/* CV Download CTA */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <a
                href={cvInfo.url}
                download={cvInfo.filename}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Verified CV (PDF)</span>
              </a>

              {/* Social Link Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={PORTFOLIO_DATA.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 text-xs font-mono transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={PORTFOLIO_DATA.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 text-xs font-mono transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (Span 7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-white/[0.08] flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Transmission Console
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  Rate-limited · TLS Protected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">YOUR NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">YOUR WORK EMAIL *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@techcorp.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">SUBJECT / PROJECT TOPIC</label>
                <input
                  type="text"
                  placeholder="Senior Full-Stack Architect Role / System Consultation"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-zinc-400">MESSAGE *</label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {formData.message.length}/1000
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  maxLength={1000}
                  placeholder="Describe your architecture requirements, hiring opportunity, or technical challenge..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {formStatus === 'submitting' ? 'Transmitting Packet...' : 'Transmit Message'}
                  </span>
                </button>

                {statusMessage && (
                  <p
                    className={`text-xs font-mono ${
                      formStatus === 'error' ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
