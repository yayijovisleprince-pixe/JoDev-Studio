import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepIndicator, WorkflowStep } from './components/StepIndicator';
import { Step1Input } from './components/Step1Input';
import { Step2Challenge } from './components/Step2Challenge';
import { Step3Validation } from './components/Step3Validation';
import { Step3Deliverables } from './components/Step3Deliverables';
import { PricingModal } from './components/PricingModal';
import { SavedProjectsDrawer } from './components/SavedProjectsDrawer';
import {
  ProjectInput,
  PricingGrid,
  ChallengeReport,
  ProjectDeliverables,
  SavedProject,
} from './types/architect';
import { requestArchitectChallenge, requestDeliverablesGeneration } from './services/api';
import { AlertCircle } from 'lucide-react';

const DEFAULT_PRICING: PricingGrid = {
  tjm: 550,
  currency: '€',
  bufferPercentage: 15,
  vatPercentage: 20,
  paymentTerms: '30% à la signature, 40% livraison beta, 30% recette finale.',
};

const DEFAULT_INPUT: ProjectInput = {
  projectName: '',
  clientName: '',
  clientObjective: '',
  devBrainstorm: '',
  targetPlatforms: ['web', 'mobile-ios', 'mobile-android'],
  techStack: {
    frontend: 'React 19 / Vite / Tailwind CSS',
    mobile: 'React Native (Expo SDK 52)',
    backend: 'Node.js (Express / TypeScript)',
    database: 'PostgreSQL (Supabase)',
    orm: 'Drizzle ORM',
    auth: 'Supabase Auth / JWT',
    hosting: 'Cloud Run / Supabase',
    thirdParty: ['Stripe', 'Expo Push Notifications', 'Cloudflare R2'],
  },
  pricingGrid: DEFAULT_PRICING,
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('input');
  const [input, setInput] = useState<ProjectInput>(DEFAULT_INPUT);
  const [report, setReport] = useState<ChallengeReport | null>(null);
  const [decisions, setDecisions] = useState<
    Record<string, { selectedOption: string; customAnswer?: string; impact: string }>
  >({});
  const [deliverables, setDeliverables] = useState<ProjectDeliverables | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Drawers
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  // Load saved projects & pricing on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jodev_saved_projects');
      if (stored) {
        setSavedProjects(JSON.parse(stored));
      }
      const storedPricing = localStorage.getItem('jodev_default_pricing');
      if (storedPricing) {
        const p = JSON.parse(storedPricing);
        setInput((prev) => ({ ...prev, pricingGrid: p }));
      }
    } catch (e) {
      console.error('Error loading localStorage:', e);
    }
  }, []);

  const saveProjectsToStorage = (projects: SavedProject[]) => {
    setSavedProjects(projects);
    try {
      localStorage.setItem('jodev_saved_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving projects:', e);
    }
  };

  const handleSavePricing = (newPricing: PricingGrid) => {
    setInput((prev) => ({ ...prev, pricingGrid: newPricing }));
    try {
      localStorage.setItem('jodev_default_pricing', JSON.stringify(newPricing));
    } catch (e) {
      console.error('Error saving pricing:', e);
    }
  };

  // Step 1 -> Step 2
  const handleStartChallenge = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const challengeReport = await requestArchitectChallenge(input);
      setReport(challengeReport);

      // Pre-select recommended options
      const initialDecisions: Record<
        string,
        { selectedOption: string; customAnswer?: string; impact: string }
      > = {};
      challengeReport.questions.forEach((q) => {
        const recommended = q.options.find((o) => o.recommended) || q.options[0];
        if (recommended) {
          initialDecisions[q.id] = {
            selectedOption: recommended.label,
            impact: recommended.impactOnCost,
          };
        }
      });
      setDecisions(initialDecisions);
      setCurrentStep('challenge');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Impossible de contacter l’architecte.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: update decision
  const handleUpdateDecision = (
    questionId: string,
    selectedOption: string,
    impact: string,
    customAnswer?: string
  ) => {
    setDecisions((prev) => ({
      ...prev,
      [questionId]: {
        selectedOption,
        impact,
        customAnswer,
      },
    }));
  };

  // Step 2 -> Step 3
  const handleProceedToValidation = () => {
    setCurrentStep('validation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 -> Step 4
  const handleGenerateDeliverables = async () => {
    if (!report) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const formattedDecisions = report.questions.map((q) => ({
        questionId: q.id,
        question: q.question,
        decision: decisions[q.id]?.selectedOption || 'Par défaut',
        impact: decisions[q.id]?.impact || 'Faible',
        customAnswer: decisions[q.id]?.customAnswer,
      }));

      const res = await requestDeliverablesGeneration(input, formattedDecisions);
      setDeliverables(res);
      setCurrentStep('deliverables');

      // Auto-save project
      handleSaveProject(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la génération des livrables.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = (customDeliverables?: ProjectDeliverables) => {
    const projId = input.id || `proj_${Date.now()}`;
    const newSaved: SavedProject = {
      id: projId,
      title: input.projectName || 'Projet sans nom',
      createdAt: input.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      step: currentStep,
      input: { ...input, id: projId },
      challengeReport: report || undefined,
      deliverables: customDeliverables || deliverables || undefined,
    };

    const existingIndex = savedProjects.findIndex((p) => p.id === projId);
    let updated: SavedProject[];
    if (existingIndex >= 0) {
      updated = [...savedProjects];
      updated[existingIndex] = newSaved;
    } else {
      updated = [newSaved, ...savedProjects];
    }
    saveProjectsToStorage(updated);
  };

  const handleSelectSavedProject = (proj: SavedProject) => {
    setInput(proj.input);
    if (proj.challengeReport) setReport(proj.challengeReport);
    if (proj.deliverables) setDeliverables(proj.deliverables);
    setCurrentStep(proj.step || 'input');
  };

  const handleDeleteSavedProject = (id: string) => {
    const filtered = savedProjects.filter((p) => p.id !== id);
    saveProjectsToStorage(filtered);
  };

  const handleNewProject = () => {
    if (window.confirm('Voulez-vous réinitialiser le formulaire pour un nouveau cadrage ?')) {
      setInput({ ...DEFAULT_INPUT, pricingGrid: input.pricingGrid });
      setReport(null);
      setDecisions({});
      setDeliverables(null);
      setCurrentStep('input');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canNavigateTo = (step: WorkflowStep): boolean => {
    if (step === 'input') return true;
    if (step === 'challenge') return !!report;
    if (step === 'validation') return !!report;
    if (step === 'deliverables') return !!deliverables;
    return false;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <Header
        pricing={input.pricingGrid}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onNewProject={handleNewProject}
        savedCount={savedProjects.length}
      />

      {/* Stepper Navigation */}
      <StepIndicator
        currentStep={currentStep}
        onSelectStep={(s) => setCurrentStep(s)}
        canNavigateTo={canNavigateTo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-700 hover:text-red-900 underline font-semibold ml-4"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Workflow Steps */}
        {currentStep === 'input' && (
          <Step1Input
            input={input}
            onChange={setInput}
            onSubmit={handleStartChallenge}
            isLoading={isLoading}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}

        {currentStep === 'challenge' && report && (
          <Step2Challenge
            report={report}
            decisions={decisions}
            onUpdateDecision={handleUpdateDecision}
            onProceed={handleProceedToValidation}
            onBack={() => setCurrentStep('input')}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'validation' && report && (
          <Step3Validation
            input={input}
            report={report}
            decisions={decisions}
            onBack={() => setCurrentStep('challenge')}
            onGenerateDeliverables={handleGenerateDeliverables}
            onOpenPricing={() => setIsPricingOpen(true)}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'deliverables' && deliverables && (
          <Step3Deliverables
            input={input}
            deliverables={deliverables}
            onSaveProject={() => handleSaveProject()}
            onNewFraming={handleNewProject}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-zinc-700">
            JoDev Studio • Outil d'Architecture & Cadrage Web et Mobile
          </p>
          <p className="font-mono text-zinc-500 text-[11px]">
            Clean Architecture • Chiffrage TJM • Prompts IA
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        pricing={input.pricingGrid}
        onSave={handleSavePricing}
      />

      <SavedProjectsDrawer
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        projects={savedProjects}
        onSelectProject={handleSelectSavedProject}
        onDeleteProject={handleDeleteSavedProject}
      />
    </div>
  );
}
