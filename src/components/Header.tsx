import React from 'react';
import { Layers, FolderKanban, Plus, Sliders } from 'lucide-react';
import { PricingGrid } from '../types/architect';

interface HeaderProps {
  pricing: PricingGrid;
  onOpenPricing: () => void;
  onOpenProjects: () => void;
  onNewProject: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  pricing,
  onOpenPricing,
  onOpenProjects,
  onNewProject,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 text-zinc-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onNewProject}
        >
          <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-zinc-900">
                JoDev Studio
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200">
                Architecture
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block">
              Cadrage technique • Spécifications • Chiffrage TJM • Prompts
            </p>
          </div>
        </div>

        {/* Quick Actions & Pricing */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* TJM Button */}
          <button
            onClick={onOpenPricing}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-orange-400 hover:bg-orange-50/50 transition text-xs text-zinc-800"
            title="Modifier la grille tarifaire"
          >
            <Sliders className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-mono font-semibold text-zinc-900">
              {pricing.tjm} {pricing.currency}
            </span>
            <span className="text-zinc-500 text-[11px] hidden md:inline">/ jour</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-zinc-600 border border-zinc-200 hidden lg:inline">
              Aléa +{pricing.bufferPercentage}%
            </span>
          </button>

          {/* Mes Projets */}
          <button
            onClick={onOpenProjects}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-xs text-zinc-700 transition"
          >
            <FolderKanban className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Projets</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-orange-500 text-[10px] font-bold text-white flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Nouveau Projet */}
          <button
            onClick={onNewProject}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nouveau Cadrage</span>
          </button>
        </div>
      </div>
    </header>
  );
};
