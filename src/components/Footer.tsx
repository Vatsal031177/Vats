import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { FileText, Github, Linkedin, ArrowUp, Lock } from 'lucide-react';
import { useActiveCv } from '../hooks/useActiveCv';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { cvInfo } = useActiveCv();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] py-12 text-xs font-mono text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.05]">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-sm font-semibold font-display text-white">
              Vatsal Maisuria
            </div>
            <p className="text-zinc-400">
              Full-Stack Architect & Autonomous Systems Engineer · Ingolstadt, Bayern, Germany
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={cvInfo.url}
              download={cvInfo.filename}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Verified CV</span>
            </a>
            <a
              href={PORTFOLIO_DATA.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={PORTFOLIO_DATA.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Owner Admin Inquiries"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
            )}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ml-2"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Vatsal Maisuria. Crafted for high-resilience production engineering.
          </div>
          <div className="text-zinc-600">
            Node Server // Express & Vite Full-Stack Topology
          </div>
        </div>
      </div>
    </footer>
  );
};
