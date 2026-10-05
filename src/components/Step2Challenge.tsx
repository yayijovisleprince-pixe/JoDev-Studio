import React from 'react';
import {
  AlertCircle,
  HelpCircle,
  Check,
  ArrowRight,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { ChallengeReport } from '../types/architect';

interface Step2ChallengeProps {
  report: ChallengeReport;
  decisions: Record<string, { selectedOption: string; customAnswer?: string; impact: string }>;
  onUpdateDecision: (questionId: string, selectedOption: string, impact: string, customAnswer?: string) => void;
  onProceed: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const Step2Challenge: React.FC<Step2ChallengeProps> = ({
  report,
  decisions,
  onUpdateDecision,
  onProceed,
  onBack,
  isLoading,
}) => {
  const answeredCount = Object.keys(decisions).length;
  const totalQuestions = report.questions.length;
  const isAllAnswered = answeredCount === totalQuestions;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Architect Verdict Box */}
      <div className="rounded-xl bg-white border border-zinc-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-orange-600">
          <span>Diagnostic de l'Architecte Logiciel</span>
        </div>
        <p className="text-sm sm:text-base text-zinc-900 leading-relaxed font-normal">
          "{report.seniorVerdict}"
        </p>

        {/* Critical Risks */}
        <div className="pt-3 border-t border-zinc-100 space-y-2">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
            Points de vigilance majeurs identifiés :
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {report.criticalRisks.map((risk, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-800"
              >
                <AlertCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Counter */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
            Questions d'Affinage Technique ({answeredCount}/{totalQuestions})
          </h2>
          <p className="text-xs text-zinc-500">
            Tranchez chaque point pour fixer l'architecture et calibrer le devis.
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-orange-600 font-semibold">
          <span>{Math.round((answeredCount / totalQuestions) * 100)}% complété</span>
        </div>
      </div>

      {/* Questions Cards */}
      <div className="space-y-4">
        {report.questions.map((q, qIndex) => {
          const currentDecision = decisions[q.id];
          return (
            <div
              key={q.id}
              className={`rounded-xl border bg-white transition-all shadow-xs ${
                currentDecision
                  ? 'border-zinc-300'
                  : 'border-zinc-200'
              }`}
            >
              {/* Question Header */}
              <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-200/70 text-zinc-700">
                    {q.category}
                  </span>
                  {currentDecision ? (
                    <span className="text-[11px] font-semibold text-orange-600 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Validé</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-400 font-medium">À définir</span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-zinc-900 mb-2">
                  {qIndex + 1}. {q.question}
                </h3>

                <p className="text-xs text-zinc-600 bg-white p-3 rounded-lg border border-zinc-200 leading-relaxed">
                  <strong className="text-zinc-800">Recommandation :</strong> {q.architectAdvice}
                </p>
              </div>

              {/* Options */}
              <div className="p-5 space-y-2.5">
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Options techniques :
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = currentDecision?.selectedOption === opt.label;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() =>
                          onUpdateDecision(q.id, opt.label, opt.impactOnCost, currentDecision?.customAnswer)
                        }
                        className={`w-full text-left p-3.5 rounded-lg border transition flex items-start justify-between space-x-3 ${
                          isSelected
                            ? 'bg-orange-50/70 border-orange-500 text-zinc-900 shadow-xs'
                            : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-orange-500 bg-orange-500 text-white'
                                : 'border-zinc-300 bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs sm:text-sm font-semibold text-zinc-900">
                                {opt.label}
                              </span>
                              {opt.recommended && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                                  Recommandé
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                              {opt.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 shrink-0">
                          {opt.impactOnCost}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Dev Decision */}
                <div className="pt-2">
                  <input
                    type="text"
                    value={currentDecision?.customAnswer || ''}
                    onChange={(e) =>
                      onUpdateDecision(
                        q.id,
                        currentDecision?.selectedOption || q.options[0]?.label || '',
                        currentDecision?.impact || q.options[0]?.impactOnCost || 'Faible (+0j)',
                        e.target.value
                      )
                    }
                    placeholder="Précision ou arbitrage sur-mesure du développeur (optionnel)"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition"
        >
          Retour au Brief
        </button>

        <button
          type="button"
          onClick={onProceed}
          disabled={!isAllAnswered || isLoading}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Génération des livrables...</span>
            </>
          ) : (
            <>
              <span>Valider mes arbitrages</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
