/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { BenchmarkSection } from './components/BenchmarkSection';
import { SecuritySimulator } from './components/SecuritySimulator';
import { PricingCalculator } from './components/PricingCalculator';
import { CanvasComparison } from './components/CanvasComparison';
import { RisksAndAudit } from './components/RisksAndAudit';
import { EcosystemSection } from './components/EcosystemSection';
import { Footer } from './components/Footer';
import { ExportModal } from './components/ExportModal';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('sec-overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickFilter = (tagId: string) => {
    setSelectedTag(tagId);
    if (tagId === 'glimmer') {
      scrollToSection('sec-benchmark');
    } else if (tagId === 'security') {
      scrollToSection('sec-security');
    } else if (tagId === 'hardware') {
      scrollToSection('sec-features');
    } else if (tagId === 'canvas') {
      scrollToSection('sec-canvas');
    } else if (tagId === 'pricing') {
      scrollToSection('sec-pricing');
    } else {
      scrollToSection('sec-overview');
    }
  };

  // Scroll spy to highlight active section in top bar
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'sec-overview',
        'sec-features',
        'sec-benchmark',
        'sec-security',
        'sec-pricing',
        'sec-canvas',
        'sec-risks',
        'sec-ecosystem',
      ];

      const scrollPos = window.scrollY + 120;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut: Cmd/Ctrl + E to toggle ExportModal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        setIsExportModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        {/* Top Header Contract */}
        <Header
          activeSection={activeSection}
          onNavigate={scrollToSection}
          onOpenSimulator={() => scrollToSection('sec-security')}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Content Viewport */}
        <main 
          id="main-content"
          tabIndex={-1}
          role="main"
          className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 focus:outline-none"
        >
          
          {/* Section 1: Executive Summary */}
          <ExecutiveSummary
            selectedTag={selectedTag}
            onQuickFilter={handleQuickFilter}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />

          {/* Section 2: Core Capabilities & Hardware Ecosystem */}
          <CapabilitiesSection />

          {/* Section 3: Glimmer 30B & Dynamic Benchmark Suite + VRAM Calculator */}
          <BenchmarkSection />

          {/* Section 4: Interactive 5-Layer Prompt Injection Attack & Defense Simulator */}
          <SecuritySimulator />

          {/* Section 5: Meta One Pricing & ROI Task Estimator */}
          <PricingCalculator />

          {/* Section 6: Spatial Canvas Ecosystem (Meta Muse vs Muse / Allume) */}
          <CanvasComparison />

          {/* Section 7: Risks, Controversies & Security Self-Audit Checklist */}
          <RisksAndAudit />

          {/* Section 8: Competitive Landscape (Meta vs OpenAI) & Korean Platform Crisis */}
          <EcosystemSection />

        </main>

        {/* Export Modal (JSON / PDF / Markdown & Recent Exports) */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />

        {/* Footer */}
        <Footer />
      </div>
    </ToastProvider>
  );
}
