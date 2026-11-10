import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, ArrowRight, CornerDownLeft, Sparkles, X, FileText, Check, ShieldAlert } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useActiveCv } from '../hooks/useActiveCv';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Action' | 'Easter Egg';
  label: string;
  sublabel: string;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const { cvInfo } = useActiveCv();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sudoUnlocked, setSudoUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
      setSudoUnlocked(false);
    }
  }, [isOpen]);

  // Handle global shortcut key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navigateTo = (hash: string) => {
    onClose();
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const commands: CommandItem[] = [
    {
      id: 'nav-systems',
      category: 'Navigation',
      label: 'Explore Distributed System Graph',
      sublabel: 'Interactive service topology with live packet simulation',
      action: () => navigateTo('#systems'),
      shortcut: 'S',
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      label: 'Featured Case Studies & Blueprints',
      sublabel: 'Automation Flow Studio, Super Teams, ROS LiDAR + QLoRA',
      action: () => navigateTo('#projects'),
      shortcut: 'P',
    },
    {
      id: 'nav-about',
      category: 'Navigation',
      label: 'Engineering Philosophy & Bento Grid',
      sublabel: 'Tech constellation, tenets, research papers',
      action: () => navigateTo('#about'),
      shortcut: 'A',
    },
    {
      id: 'nav-timeline',
      category: 'Navigation',
      label: 'Work Experience & Timeline',
      sublabel: 'Contabo, Annextech Software, Freelance AI',
      action: () => navigateTo('#timeline'),
      shortcut: 'T',
    },
    {
      id: 'nav-playground',
      category: 'Navigation',
      label: 'Latency Benchmark & Guestbook',
      sublabel: 'Probe real-time RTT and endorse architecture',
      action: () => navigateTo('#playground'),
      shortcut: 'G',
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      label: 'Smart Contact Terminal',
      sublabel: 'Send message, copy email, phone',
      action: () => navigateTo('#contact'),
      shortcut: 'C',
    },
    {
      id: 'act-cv',
      category: 'Action',
      label: 'Download Verified Resume (PDF)',
      sublabel: 'Direct PDF download of Vatsal Maisuria CV',
      action: () => {
        window.open(cvInfo.url, '_blank');
        onClose();
      },
      shortcut: 'CV',
    },
    {
      id: 'act-admin',
      category: 'Action',
      label: 'Admin Portal (Password Required)',
      sublabel: 'View who has contacted you from the website',
      action: () => {
        onClose();
        onOpenAdmin?.();
      },
      shortcut: 'ADM',
    },
    {
      id: 'sudo-hire',
      category: 'Easter Egg',
      label: 'sudo hire-me',
      sublabel: 'Execute privileged root protocol for technical interview fast-track',
      action: () => setSudoUnlocked(true),
      shortcut: 'ROOT',
    },
  ];

  const filtered = commands.filter((cmd) => {
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.sublabel.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim().toLowerCase() === 'sudo hire-me') {
        setSudoUnlocked(true);
      } else if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl border border-white/20 shadow-2xl overflow-hidden font-sans">
        {/* Top Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-zinc-950/70">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search (e.g. 'systems', 'projects', 'sudo hire-me')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sudo Easter Egg Terminal Output */}
        {sudoUnlocked ? (
          <div className="p-6 bg-zinc-950 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between text-emerald-400 border-b border-zinc-800 pb-2">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>ROOT PRIVILEGES GRANTED // HIRING_PROTOCOL_EXEC</span>
              </span>
              <button
                onClick={() => setSudoUnlocked(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                Back to commands
              </button>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              [root@vatsal-core]# Priority dispatch initiated for technical interview scheduling:
            </p>
            <div className="p-3 bg-zinc-900/90 rounded border border-emerald-500/30 text-emerald-300 space-y-1">
              <div>Candidate: Vatsal Maisuria (M.Eng. TH Ingolstadt)</div>
              <div>Status: EU Blue Card eligible · Q4 2026 Ready</div>
              <div>Direct Email: vatsalmaisuria.77@gmail.com</div>
              <div>Direct Phone: +49 1621630552</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.location.href = `mailto:${PORTFOLIO_DATA.personal.email}?subject=Technical Interview Invitation`;
                  onClose();
                }}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold text-xs"
              >
                Send Direct Email
              </button>
              <button
                onClick={() => {
                  window.open(PORTFOLIO_DATA.personal.linkedin, '_blank');
                  onClose();
                }}
                className="px-3 py-1.5 rounded bg-zinc-800 text-white text-xs"
              >
                Connect on LinkedIn
              </button>
            </div>
          </div>
        ) : (
          /* Command List */
          <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-zinc-500">
                No matching commands found. Try 'about', 'systems', 'projects', or 'sudo hire-me'.
              </div>
            ) : (
              filtered.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 text-white border border-blue-500/30'
                        : 'text-zinc-300 hover:bg-zinc-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400'
                        }`}
                      >
                        {cmd.category === 'Easter Egg' ? (
                          <Sparkles className="w-3.5 h-3.5" />
                        ) : cmd.category === 'Action' ? (
                          <FileText className="w-3.5 h-3.5" />
                        ) : (
                          <Terminal className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold font-mono flex items-center gap-2">
                          <span>{cmd.label}</span>
                          <span className="text-[10px] text-zinc-500 font-normal">
                            ({cmd.category})
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 leading-tight">
                          {cmd.sublabel}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {cmd.shortcut && (
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
                          {cmd.shortcut}
                        </kbd>
                      )}
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-white/5 bg-zinc-950/90 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Tip: type 'sudo hire-me'</span>
        </div>
      </div>
    </div>
  );
};
