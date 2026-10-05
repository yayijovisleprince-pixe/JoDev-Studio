import React from 'react';
import { FileText, HelpCircle, CheckCheck, FileCode2 } from 'lucide-react';

export type WorkflowStep = 'input' | 'challenge' | 'validation' | 'deliverables';

interface StepIndicatorProps {
  currentStep: WorkflowStep;
  onSelectStep: (step: WorkflowStep) => void;
  canNavigateTo: (step: WorkflowStep) => boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  canNavigateTo,
}) => {
  const steps: { id: WorkflowStep; label: string; sub: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'input',
      label: '1. Cadrage & Stack',
      sub: 'Besoins client et idées',
      icon: FileText,
    },
    {
      id: 'challenge',
      label: '2. Questions Ciblées',
      sub: 'Affinage et points critiques',
      icon: HelpCircle,
    },
    {
      id: 'validation',
      label: '3. Vos Arbitrages',
      sub: 'Validation des choix',
      icon: CheckCheck,
    },
    {
      id: 'deliverables',
      label: '4. Livrables & Prompts',
      sub: 'Cahier de charges & Archi',
      icon: FileCode2,
    },
  ];

  const getStepIndex = (s: WorkflowStep) => steps.findIndex((x) => x.id === s);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full bg-white border-b border-zinc-200 py-3 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = idx < currentIndex;
          const isAllowed = canNavigateTo(step.id);
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              disabled={!isAllowed}
              onClick={() => onSelectStep(step.id)}
              className={`flex items-center space-x-3 p-2.5 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-orange-50/70 border-orange-500 text-zinc-900 shadow-sm'
                  : isCompleted
                  ? 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700'
                  : 'bg-white border-zinc-100 text-zinc-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-orange-500 text-white font-bold'
                    : isCompleted
                    ? 'bg-zinc-200 text-zinc-800'
                    : 'bg-zinc-100 text-zinc-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-xs font-semibold truncate ${
                    isActive ? 'text-orange-600' : isCompleted ? 'text-zinc-900' : 'text-zinc-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-zinc-500 truncate hidden sm:block">
                  {step.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
