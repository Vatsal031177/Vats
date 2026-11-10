import React from 'react';
import { FileText, Command, Lock } from 'lucide-react';
import { useActiveCv } from '../hooks/useActiveCv';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette, onOpenAdmin }) => {
  const { cvInfo } = useActiveCv();
  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/85 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Zone with CV portrait */}
        <a
          href="#top"
          className="text-base font-semibold tracking-tight text-white hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 font-display flex items-center gap-2.5"
        >
          <img
            src="./assets/vatsal_portrait_clean.png"
            alt="Vatsal Maisuria"
            className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-sm"
          />
          <span>Vatsal Maisuria</span>
        </a>

        {/* Zone 2: 4-5 clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a
            href="#about"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            About & Philosophy
          </a>
          <a
            href="#systems"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Distributed Systems
          </a>
          <a
            href="#projects"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Case Studies
          </a>
          <a
            href="#timeline"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Timeline
          </a>
          <a
            href="#playground"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Playground & Guestbook
          </a>
          <a
            href="#contact"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: 1 primary action button + ⌘K trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Open Command Palette (⌘K or Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5 text-zinc-400" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-300 rounded border border-zinc-700 font-mono">
              ⌘K
            </kbd>
          </button>

          <a
            href={cvInfo.url}
            download={cvInfo.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-sm shadow-blue-500/20 whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Verified CV</span>
          </a>

          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors shrink-0"
            title="Owner Admin Portal (Password Required)"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
