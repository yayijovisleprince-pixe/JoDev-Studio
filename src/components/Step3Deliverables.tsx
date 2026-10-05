import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Terminal,
  Download,
  Copy,
  Check,
  Printer,
  Calendar,
  Save,
  CheckCircle2,
  Smartphone,
  Server,
  Database,
} from 'lucide-react';
import { ProjectDeliverables, ProjectInput } from '../types/architect';
import { MermaidViewer } from './MermaidViewer';
import { generateMarkdownReport, downloadFile } from '../utils/export';

interface Step3DeliverablesProps {
  input: ProjectInput;
  deliverables: ProjectDeliverables;
  onSaveProject: () => void;
  onNewFraming: () => void;
}

export const Step3Deliverables: React.FC<Step3DeliverablesProps> = ({
  input,
  deliverables,
  onSaveProject,
  onNewFraming,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'architecture' | 'prompts'>('specs');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [copiedAllMd, setCopiedAllMd] = useState(false);
  const [projectSaved, setProjectSaved] = useState(false);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownReport(input, deliverables);
    navigator.clipboard.writeText(md);
    setCopiedAllMd(true);
    setTimeout(() => setCopiedAllMd(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport(input, deliverables);
    const filename = `${input.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-cahier-des-charges.md`;
    downloadFile(md, filename, 'text/markdown');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    onSaveProject();
    setProjectSaved(true);
    setTimeout(() => setProjectSaved(false), 3000);
  };

  const { specs, architecture, aiPrompts } = deliverables;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Banner */}
      <div className="rounded-xl bg-white border border-zinc-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
              <span>Livrables Validés</span>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-500 font-mono">
                {new Date(deliverables.generatedAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {input.projectName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
              Client : <strong>{input.clientName || 'Non spécifié'}</strong> • Chiffrage sur base d'un TJM de <strong className="text-zinc-900 font-mono">{specs.financialQuote.tjm} {specs.financialQuote.currency} HT</strong>
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition"
            >
              {projectSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-orange-600">Enregistré</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Enregistrer</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition"
            >
              {copiedAllMd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-orange-600">Markdown copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Copier MD</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs font-semibold text-white shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger (.md)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-3 border-t border-zinc-100 flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'specs'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-zinc-50 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Cahier des Charges & Devis</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'architecture'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-zinc-50 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Dossier d'Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              activeTab === 'prompts'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-zinc-50 text-zinc-600 hover:text-zinc-900 border border-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>3. Prompts IA ({aiPrompts.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1 : CAHIER DES CHARGES & DEVIS STRUCTURÉ */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          {/* Executive Pitch */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide flex items-center space-x-2">
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              <span>Résumé Exécutif & Cadrage Fonctionnel</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
              {specs.executivePitch}
            </p>
            <div className="pt-2 text-xs text-zinc-500 border-t border-zinc-100">
              <strong className="text-zinc-800">Public cible :</strong> {specs.targetAudience}
            </div>
          </div>

          {/* User Personas */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
              Personas & Besoins Utilisateurs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specs.userPersonas.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <span className="text-xs font-bold text-zinc-900">
                    {p.role}
                  </span>
                  <p className="text-xs text-zinc-700">
                    <strong>Besoin :</strong> {p.need}
                  </p>
                  <p className="text-xs text-zinc-500">
                    <strong>Frustration résolue :</strong> {p.painPoint}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Modules Fonctionnels */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  Découpage Fonctionnel & Chiffrage par Module
                </h2>
                <p className="text-xs text-zinc-500">
                  Estimations calculées en Jours/Homme (J/H)
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-orange-600 px-2.5 py-1 rounded bg-orange-50 border border-orange-200 self-start sm:self-auto">
                Total : {specs.financialQuote.totalDays} J/H
              </span>
            </div>

            <div className="space-y-3">
              {specs.functionalModules.map((mod, idx) => (
                <div
                  key={mod.id || idx}
                  className="rounded-lg border border-zinc-200 overflow-hidden bg-white"
                >
                  <div className="p-3.5 bg-zinc-50/70 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded bg-zinc-200 text-zinc-700 text-xs font-bold flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-900">{mod.name}</h3>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white text-zinc-600 border border-zinc-200">
                        {mod.complexity}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="text-zinc-600">{mod.estimatedDays} j</span>
                      <span className="text-zinc-900 font-bold">
                        {mod.cost.toLocaleString('fr-FR')} {specs.financialQuote.currency} HT
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {mod.description}
                    </p>
                    <div className="space-y-1 pt-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        User Stories :
                      </p>
                      {mod.userStories.map((us, uIdx) => (
                        <div key={uIdx} className="flex items-start space-x-1.5 text-xs text-zinc-600">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{us}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exigences Non-Fonctionnelles */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
              Exigences Non-Fonctionnelles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {specs.nonFunctionalRequirements.map((req, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 font-mono">
                    {req.category}
                  </span>
                  <p className="text-xs text-zinc-800 leading-relaxed">
                    {req.rule}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Synthèse Financière & Échéancier */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5 shadow-xs">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                Devis Structuré & Modalités de Règlement
              </h2>
              <p className="text-xs text-zinc-500">
                Sur la base de {specs.financialQuote.tjm} {specs.financialQuote.currency} HT / jour
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500">Développement net</span>
                <p className="text-lg font-bold text-zinc-900 font-mono mt-0.5">
                  {specs.financialQuote.subtotalHT.toLocaleString('fr-FR')} {specs.financialQuote.currency} HT
                </p>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {specs.financialQuote.totalDays} Jours/Homme
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500">
                  Marge Aléa (+{input.pricingGrid.bufferPercentage}%)
                </span>
                <p className="text-lg font-bold text-zinc-900 font-mono mt-0.5">
                  +{specs.financialQuote.bufferAmount.toLocaleString('fr-FR')} {specs.financialQuote.currency} HT
                </p>
                <span className="text-[11px] text-zinc-500 font-mono">
                  +{specs.financialQuote.bufferDays} j de marge technique
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-orange-50 border border-orange-200">
                <span className="text-xs font-semibold text-orange-900">Total Préconisé</span>
                <p className="text-xl font-extrabold text-orange-600 font-mono mt-0.5">
                  {specs.financialQuote.totalEstimatedHT.toLocaleString('fr-FR')} {specs.financialQuote.currency} HT
                </p>
                <span className="text-[11px] text-orange-800 font-mono">
                  {specs.financialQuote.totalDays + specs.financialQuote.bufferDays} j au global
                </span>
              </div>
            </div>

            {/* Payment Milestones */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
                Échéancier de règlement :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {specs.financialQuote.paymentSchedule.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-900">{step.milestone}</span>
                      <span className="font-mono text-orange-600 font-bold">{step.percentage}%</span>
                    </div>
                    <p className="text-xs font-bold font-mono text-zinc-900 pt-0.5">
                      {step.amount.toLocaleString('fr-FR')} {specs.financialQuote.currency} HT
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Roadmap */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-zinc-600" />
              <span>Planning Prévisionnel de Livraison</span>
            </h2>
            <div className="space-y-2">
              {specs.deliveryRoadmap.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-zinc-900">{p.phase}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-700">
                        {p.durationWeeks}
                      </span>
                    </div>
                    <p className="text-zinc-500">
                      Livrables : {p.deliverables.join(' • ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 : DOSSIER D'ARCHITECTURE TECHNIQUE */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Pattern Architectural */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                Pattern : {architecture.chosenPattern}
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-900">System Design & Justification</h2>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
              {architecture.systemDesignSummary}
            </p>
            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 leading-relaxed">
              <strong>Justification de choix :</strong> {architecture.patternJustification}
            </div>
          </div>

          {/* Interactive Topology & Mermaid Diagram */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
              Diagramme d'Architecture & Flux
            </h2>
            <MermaidViewer chart={architecture.mermaidDiagram} />
          </div>

          {/* Mobile & Offline Strategy */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-zinc-100 pb-2.5">
              <Smartphone className="w-4 h-4 text-orange-500" />
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                Stratégie Mobile & Offline-First
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-xs font-bold text-zinc-900">Mode Hors-Ligne & Cache</span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {architecture.mobileStrategy.offlineCapabilities}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-xs font-bold text-zinc-900">Gestion de l'État</span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {architecture.mobileStrategy.stateManagement}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-xs font-bold text-zinc-900">Notifications Push</span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {architecture.mobileStrategy.pushNotifications}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-xs font-bold text-zinc-900">Fonctions Périphériques</span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {architecture.mobileStrategy.deviceFeatures.join(' • ')}
                </p>
              </div>
            </div>
          </div>

          {/* API Design & Security */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-zinc-100 pb-2.5">
              <Server className="w-4 h-4 text-zinc-700" />
              <div>
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  Matrice d'API & Contrats ({architecture.apiDesign.protocol})
                </h2>
                <p className="text-[11px] text-zinc-500">{architecture.apiDesign.authFlow}</p>
              </div>
            </div>

            {/* Endpoints Table */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                Endpoints Clés :
              </span>
              {architecture.apiDesign.endpoints.map((ep, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center space-x-2 font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        ep.method === 'GET'
                          ? 'bg-zinc-200 text-zinc-800'
                          : ep.method === 'POST'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-zinc-200 text-zinc-800'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-zinc-900 font-semibold">{ep.path}</span>
                  </div>
                  <span className="text-zinc-600 text-[11px]">{ep.description}</span>
                </div>
              ))}
            </div>

            {/* Security Measures */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1.5">
                Sécurité appliquée :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {architecture.apiDesign.securityMeasures.map((sec, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded bg-zinc-50 border border-zinc-200 text-zinc-700"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Database Design */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-zinc-100 pb-2.5">
              <Database className="w-4 h-4 text-orange-500" />
              <div>
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  Modèle de Données ({architecture.databaseDesign.engine})
                </h2>
                <p className="text-[11px] text-zinc-500">Tables relationnelles et indexes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {architecture.databaseDesign.tables.map((table, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                    <span className="font-mono font-bold text-xs text-zinc-900">
                      table {table.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {table.fields.length} champs
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">{table.description}</p>
                  <div className="space-y-0.5 font-mono text-[11px] text-zinc-700 bg-white p-2 rounded border border-zinc-200">
                    {table.fields.map((f, fIdx) => (
                      <div key={fIdx} className="truncate">
                        • {f}
                      </div>
                    ))}
                  </div>
                  {table.indexes && table.indexes.length > 0 && (
                    <div className="text-[10px] font-mono text-zinc-500 space-y-0.5">
                      <span className="font-bold text-zinc-700">Indexes :</span>
                      {table.indexes.map((i, iIdx) => (
                        <div key={iIdx} className="truncate">
                          {i}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
              Infrastructure, CI/CD & Observabilité
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-xs font-bold text-zinc-900">Hébergement Cloud</span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {architecture.infrastructure.hosting}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-xs font-bold text-zinc-900">Pipeline CI/CD</span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {architecture.infrastructure.ciCd}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-xs font-bold text-zinc-900">Observabilité & Logs</span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {architecture.infrastructure.monitoring}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 : SUITE DE PROMPTS IA */}
      {activeTab === 'prompts' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white border border-zinc-200 p-6 space-y-2 shadow-xs">
            <h2 className="text-base font-bold text-zinc-900">
              Séquence de Prompts IA pour Implémentation
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Exécutez ces prompts séquentiellement dans <strong>Cursor, Claude 3.7, Windsurf ou Gemini</strong> pour mettre en place l'architecture sans régression.
            </p>
          </div>

          <div className="space-y-4">
            {aiPrompts.map((p) => {
              const isCopied = copiedPromptId === p.id;
              return (
                <div
                  key={p.id}
                  className="rounded-xl bg-white border border-zinc-200 overflow-hidden shadow-xs"
                >
                  {/* Card Header */}
                  <div className="p-4 bg-zinc-50/70 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded bg-orange-500 text-white font-bold text-xs flex items-center justify-center font-mono">
                        {p.stepNumber}
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-zinc-900">{p.title}</h3>
                        <p className="text-[11px] text-zinc-500">
                          Outil recommandé : <span className="font-mono text-zinc-700 font-semibold">{p.targetTool}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyPrompt(p.id, p.promptText)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        isCopied
                          ? 'bg-orange-600 text-white'
                          : 'bg-zinc-900 hover:bg-black text-white'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier ce Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div className="text-xs text-zinc-600 space-y-1">
                      <p><strong>Contexte :</strong> {p.context}</p>
                      <p className="text-orange-700 bg-orange-50 p-2 rounded border border-orange-100">
                        <strong>Conseil technique :</strong> {p.tipForDev}
                      </p>
                    </div>

                    <pre className="p-3.5 rounded-lg bg-zinc-900 font-mono text-xs text-zinc-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {p.promptText}
                    </pre>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Critères d'acceptation :
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        {p.acceptanceCriteria.map((crit, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-start space-x-1.5 p-1.5 rounded bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-700"
                          >
                            <CheckCircle2 className="w-3 h-3 text-orange-600 shrink-0 mt-0.5" />
                            <span>{crit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Action */}
      <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onNewFraming}
          className="px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition"
        >
          Nouveau cadrage
        </button>

        <button
          onClick={handleDownloadMarkdown}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exporter le dossier complet (.md)</span>
        </button>
      </div>
    </div>
  );
};
