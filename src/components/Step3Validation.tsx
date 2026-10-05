import React from 'react';
import {
  CheckCheck,
  ArrowRight,
  ArrowLeft,
  Sliders,
  FileCheck,
} from 'lucide-react';
import { ProjectInput, ChallengeReport } from '../types/architect';

interface Step3ValidationProps {
  input: ProjectInput;
  report: ChallengeReport;
  decisions: Record<string, { selectedOption: string; customAnswer?: string; impact: string }>;
  onBack: () => void;
  onGenerateDeliverables: () => void;
  onOpenPricing: () => void;
  isLoading: boolean;
}

export const Step3Validation: React.FC<Step3ValidationProps> = ({
  input,
  report,
  decisions,
  onBack,
  onGenerateDeliverables,
  onOpenPricing,
  isLoading,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="rounded-xl bg-white border border-zinc-200 p-6 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900">Validation Finale de vos Choix Techniques</h2>
            <p className="text-xs text-zinc-500">
              Vérifiez la cohérence de vos arbitrages avant de compiler le dossier de spécifications et les prompts IA.
            </p>
          </div>
        </div>
      </div>

      {/* Recap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Projet & Plateformes
            </span>
            <span className="text-xs font-mono font-semibold text-orange-600">
              {input.targetPlatforms.join(', ')}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900">{input.projectName}</h3>
            <p className="text-xs text-zinc-500">Client : <strong className="text-zinc-800">{input.clientName || 'Non spécifié'}</strong></p>
          </div>
          <p className="text-xs text-zinc-600 line-clamp-3 pt-1">
            {input.clientObjective}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Grille Tarifaire Appliquée
              </span>
              <button
                type="button"
                onClick={onOpenPricing}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Ajuster</span>
              </button>
            </div>
            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-zinc-900 font-mono">
                {input.pricingGrid.tjm} {input.pricingGrid.currency}
              </span>
              <span className="text-xs text-zinc-500">/ jour</span>
            </div>
            <div className="mt-2 text-xs text-zinc-500 space-y-0.5">
              <p>• Marge de sécurité : <strong className="text-zinc-700">+{input.pricingGrid.bufferPercentage}%</strong></p>
              <p>• Modalités : <span className="text-zinc-700">{input.pricingGrid.paymentTerms}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Arbitrated Decisions List */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 pb-2.5">
          Vos Choix Validés ({report.questions.length})
        </h3>

        <div className="space-y-2.5">
          {report.questions.map((q) => {
            const dec = decisions[q.id];
            return (
              <div
                key={q.id}
                className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 font-mono">
                      {q.category}
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {q.question}
                    </span>
                  </div>
                  <p className="text-orange-600 font-medium">
                    ➜ {dec?.selectedOption || 'Par défaut'}
                  </p>
                  {dec?.customAnswer && (
                    <p className="text-[11px] text-zinc-500 italic">
                      Note dev : "{dec.customAnswer}"
                    </p>
                  )}
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-zinc-600 border border-zinc-200 self-start sm:self-auto shrink-0">
                  {dec?.impact || 'Faible'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Modifier mes choix</span>
        </button>

        <button
          type="button"
          onClick={onGenerateDeliverables}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm shadow-sm transition cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Génération des livrables en cours...</span>
            </>
          ) : (
            <>
              <span>Générer le Cahier des Charges, l'Archi & les Prompts</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
