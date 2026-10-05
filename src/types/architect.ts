export interface PricingGrid {
  tjm: number; // Taux Journalier Moyen (ex: 500)
  currency: string; // '€' | '$' | 'FCFA' | 'CHF'
  bufferPercentage: number; // Marge aléa/imprévus (ex: 15%)
  vatPercentage: number; // TVA (ex: 20% ou 0%)
  hourlyRate?: number;
  paymentTerms: string;
}

export interface TechStackConfig {
  frontend: string;
  mobile: string;
  backend: string;
  database: string;
  orm: string;
  auth: string;
  hosting: string;
  thirdParty: string[];
}

export interface ProjectInput {
  id?: string;
  projectName: string;
  clientName: string;
  clientObjective: string; // Ce que le client veut comme résultat / Business value
  devBrainstorm: string; // Tout ce que le dev a en tête
  targetPlatforms: ('web' | 'mobile-ios' | 'mobile-android' | 'desktop')[];
  techStack: TechStackConfig;
  pricingGrid: PricingGrid;
  deadlineWeeks?: number;
  createdAt?: string;
}

export interface ChallengeOption {
  label: string;
  description: string;
  impactOnCost: 'Faible (+0j)' | 'Moyen (+2-4j)' | 'Élevé (+5j+)';
  recommended?: boolean;
}

export interface ChallengeQuestion {
  id: string;
  category: 'Architecture & Scalabilité' | 'Mobile & Offline-First' | 'Sécurité & Auth' | 'Données & Performance' | 'Périmètre & Dette Technique';
  architectAdvice: string; // Recommandation technique de l'architecte
  question: string;
  options: ChallengeOption[];
  selectedOption?: string;
  customDevAnswer?: string;
}

export interface ChallengeReport {
  seniorVerdict: string;
  criticalRisks: string[];
  recommendations: string[];
  questions: ChallengeQuestion[];
}

export interface FunctionalModule {
  id: string;
  name: string;
  description: string;
  userStories: string[];
  complexity: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique';
  estimatedDays: number;
  cost: number;
}

export interface SpecsDeliverable {
  executivePitch: string;
  targetAudience: string;
  userPersonas: { role: string; need: string; painPoint: string }[];
  functionalModules: FunctionalModule[];
  nonFunctionalRequirements: { category: string; rule: string }[];
  financialQuote: {
    totalDays: number;
    subtotalHT: number;
    bufferDays: number;
    bufferAmount: number;
    totalEstimatedHT: number;
    tjm: number;
    currency: string;
    paymentSchedule: { milestone: string; percentage: number; amount: number }[];
  };
  deliveryRoadmap: { phase: string; durationWeeks: string; deliverables: string[] }[];
}

export interface ArchitectureDeliverable {
  systemDesignSummary: string;
  chosenPattern: string;
  patternJustification: string;
  mobileStrategy: {
    offlineCapabilities: string;
    stateManagement: string;
    pushNotifications: string;
    deviceFeatures: string[];
  };
  apiDesign: {
    protocol: string;
    authFlow: string;
    securityMeasures: string[];
    endpoints: { method: string; path: string; description: string; payload?: string }[];
  };
  databaseDesign: {
    engine: string;
    tables: { name: string; description: string; fields: string[]; indexes: string[] }[];
  };
  infrastructure: {
    hosting: string;
    ciCd: string;
    monitoring: string;
  };
  mermaidDiagram: string;
}

export interface AiPromptDeliverable {
  id: string;
  stepNumber: number;
  title: string;
  targetTool: string;
  context: string;
  promptText: string;
  acceptanceCriteria: string[];
  tipForDev: string;
}

export interface ProjectDeliverables {
  specs: SpecsDeliverable;
  architecture: ArchitectureDeliverable;
  aiPrompts: AiPromptDeliverable[];
  generatedAt: string;
}

export interface SavedProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  step: 'input' | 'challenge' | 'validation' | 'deliverables';
  input: ProjectInput;
  challengeReport?: ChallengeReport;
  deliverables?: ProjectDeliverables;
}
