import React from 'react';
import {
  Smartphone,
  Globe,
  Monitor,
  Database,
  Layers,
  ArrowRight,
  Sliders,
  Check,
} from 'lucide-react';
import { ProjectInput } from '../types/architect';
import { PROJECT_PRESETS } from '../utils/presets';

interface Step1InputProps {
  input: ProjectInput;
  onChange: (input: ProjectInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onOpenPricing: () => void;
}

export const Step1Input: React.FC<Step1InputProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
  onOpenPricing,
}) => {
  const togglePlatform = (p: 'web' | 'mobile-ios' | 'mobile-android' | 'desktop') => {
    const exists = input.targetPlatforms.includes(p);
    const updated = exists
      ? input.targetPlatforms.filter((x) => x !== p)
      : [...input.targetPlatforms, p];
    onChange({ ...input, targetPlatforms: updated });
  };

  const loadPreset = (presetData: Partial<ProjectInput>) => {
    onChange({
      ...input,
      ...presetData,
      techStack: {
        ...input.techStack,
        ...presetData.techStack,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Intro Header */}
      <div className="border border-zinc-200 bg-white rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">
          <span>Cadrage Initial & Expression du Besoin</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          Définissez le projet, vos idées et la stack technique
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
          Renseignez les attentes du client et vos premières pistes. L'architecte logiciel va analyser la faisabilité, vous poser des questions de confrontation sur les points critiques et structurer votre devis.
        </p>

        {/* Quick Presets */}
        <div className="mt-5 pt-4 border-t border-zinc-100">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
            Exemples pré-remplis :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PROJECT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(preset.data)}
                className="text-left p-3 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-orange-50/40 hover:border-orange-300 transition text-xs group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-zinc-900 group-hover:text-orange-600 truncate">
                    {preset.name}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 line-clamp-2">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: Informations Générales & Attentes Client */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-100">
          <div className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
            Le Projet & Les Attentes Métier du Client
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Nom du Projet <span className="text-orange-600">*</span>
            </label>
            <input
              type="text"
              required
              value={input.projectName}
              onChange={(e) => onChange({ ...input, projectName: e.target.value })}
              placeholder="Ex: FieldOps Pro"
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Nom du Client / Entreprise
            </label>
            <input
              type="text"
              value={input.clientName}
              onChange={(e) => onChange({ ...input, clientName: e.target.value })}
              placeholder="Ex: Entreprise Martin"
              className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Client Objective */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
            Ce que le client veut comme résultat (Objectif métier / problème à résoudre) <span className="text-orange-600">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={input.clientObjective}
            onChange={(e) => onChange({ ...input, clientObjective: e.target.value })}
            placeholder="Ex: Permettre aux 30 techniciens de terrain de saisir leurs rapports d'intervention avec photos et signature client, même en sous-sol sans connexion internet. Le siège doit recevoir les validations automatiquement dès reconnexion pour facturer immédiatement."
            className="w-full bg-white border border-zinc-300 rounded-lg p-3 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Developer Brainstorm */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
            Vos idées, réflexions et modules pressentis <span className="text-orange-600">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={input.devBrainstorm}
            onChange={(e) => onChange({ ...input, devBrainstorm: e.target.value })}
            placeholder="Ex: Je prévois une app mobile en React Native (Expo) avec SQLite en cache local pour gérer le offline. Côté back : Node.js avec PostgreSQL et Drizzle ORM. Pour le dashboard web : React avec filtres et export PDF. J'ai un doute sur la résolution des conflits de synchro si deux techniciens modifient le même dossier."
            className="w-full bg-white border border-zinc-300 rounded-lg p-3 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Target Platforms */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-2">
            Plateformes ciblées
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'web' as const, label: 'Web Responsive', icon: Globe },
              { id: 'mobile-ios' as const, label: 'iOS (App Store)', icon: Smartphone },
              { id: 'mobile-android' as const, label: 'Android (Google Play)', icon: Smartphone },
              { id: 'desktop' as const, label: 'Desktop / PWA', icon: Monitor },
            ].map(({ id, label, icon: Icon }) => {
              const selected = input.targetPlatforms.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePlatform(id)}
                  className={`flex items-center space-x-2 p-2.5 rounded-lg border text-xs font-medium transition ${
                    selected
                      ? 'bg-orange-50 border-orange-500 text-orange-900'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${selected ? 'text-orange-600' : 'text-zinc-400'}`} />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Stack Technique */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-100">
          <div className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
            Stack Technique
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Frontend Web */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Frontend Web
            </label>
            <input
              type="text"
              value={input.techStack.frontend}
              onChange={(e) =>
                onChange({
                  ...input,
                  techStack: { ...input.techStack, frontend: e.target.value },
                })
              }
              placeholder="Ex: React 19 / Vite / Tailwind"
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Mobile (Framework)
            </label>
            <input
              type="text"
              value={input.techStack.mobile}
              onChange={(e) =>
                onChange({
                  ...input,
                  techStack: { ...input.techStack, mobile: e.target.value },
                })
              }
              placeholder="Ex: React Native (Expo) / Flutter"
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Backend */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Backend & API
            </label>
            <input
              type="text"
              value={input.techStack.backend}
              onChange={(e) =>
                onChange({
                  ...input,
                  techStack: { ...input.techStack, backend: e.target.value },
                })
              }
              placeholder="Ex: Node.js (Express / Fastify)"
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Database */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Base de Données
            </label>
            <input
              type="text"
              value={input.techStack.database}
              onChange={(e) =>
                onChange({
                  ...input,
                  techStack: { ...input.techStack, database: e.target.value },
                })
              }
              placeholder="Ex: PostgreSQL (Supabase)"
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* ORM */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              ORM
            </label>
            <input
              type="text"
              value={input.techStack.orm}
              onChange={(e) =>
                onChange({
                  ...input,
                  techStack: { ...input.techStack, orm: e.target.value },
                })
              }
              placeholder="Ex: Drizzle ORM / Prisma"
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Auth */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Authentification
            </label>
            <input
              type="text"
              value={input.techStack.auth}
              onChange={(e) =>
                onChange({
                  ...input,
                  techStack: { ...input.techStack, auth: e.target.value },
                })
              }
              placeholder="Ex: Supabase Auth / JWT"
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Grille Tarifaire */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide block">
            Grille Tarifaire du Développeur
          </span>
          <p className="text-xs text-zinc-600 mt-0.5">
            TJM : <span className="font-mono font-bold text-orange-600">{input.pricingGrid.tjm} {input.pricingGrid.currency}</span> / jour • Marge de sécurité aléas : +{input.pricingGrid.bufferPercentage}%
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenPricing}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-zinc-200 hover:border-orange-400 hover:bg-orange-50/50 text-xs font-medium text-zinc-800 transition"
        >
          Modifier mon tarif
        </button>
      </div>

      {/* CTA Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading || !input.clientObjective.trim() || !input.devBrainstorm.trim()}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Analyse technique en cours...</span>
            </>
          ) : (
            <>
              <span>Soumettre à l'analyse de l'Architecte</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
