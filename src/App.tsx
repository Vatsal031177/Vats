import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { ProjectShowcase } from './components/ProjectShowcase';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { PlaygroundSuite } from './components/PlaygroundSuite';
import { ContactTerminal } from './components/ContactTerminal';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // Global keyboard shortcut: Meta+Shift+A or Ctrl+Shift+A to quickly open Admin Portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminPortalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
      {/* Navigation Top Bar */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
        <BentoGrid />
        <ProjectShowcase />
        <ExperienceTimeline />
        <PlaygroundSuite />
        <ContactTerminal />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminPortalOpen(true)} />

      {/* ⌘K Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
      />

      {/* Password-Protected Admin Portal */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />
    </div>
  );
}
