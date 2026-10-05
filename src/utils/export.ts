import { ProjectDeliverables, ProjectInput } from '../types/architect';

export function generateMarkdownReport(input: ProjectInput, deliverables: ProjectDeliverables): string {
  const { specs, architecture, aiPrompts } = deliverables;

  let md = `# CAHIER DES CHARGES & DOSSIER D'ARCHITECTURE TECHNIQUE\n`;
  md += `**Projet :** ${input.projectName} | **Client :** ${input.clientName}\n`;
  md += `**Date :** ${new Date(deliverables.generatedAt).toLocaleDateString('fr-FR')} | **Généré par :** JoDev Studio\n\n`;

  md += `--- \n\n`;
  md += `## 1. CAHIER DES CHARGES FONCTIONNEL & DEVIS STRUCTURÉ\n\n`;
  md += `### 1.1 Résumé Exécutif & Vision\n${specs.executivePitch}\n\n`;
  md += `**Public Cible :** ${specs.targetAudience}\n\n`;

  md += `### 1.2 Personas Utilisateurs\n`;
  specs.userPersonas.forEach((p) => {
    md += `- **${p.role}** : Besoin : *${p.need}* (Point de douleur : *${p.painPoint}*)\n`;
  });
  md += `\n`;

  md += `### 1.3 Modules Fonctionnels & Chiffrage\n\n`;
  md += `| Module | Complexité | Estimation (J/H) | Montant HT (${specs.financialQuote.currency}) |\n`;
  md += `| :--- | :---: | :---: | :---: |\n`;
  specs.functionalModules.forEach((m) => {
    md += `| **${m.name}** | ${m.complexity} | ${m.estimatedDays} j | ${m.cost.toLocaleString('fr-FR')} ${specs.financialQuote.currency} |\n`;
  });
  md += `\n`;

  md += `#### Détail des User Stories par Module :\n`;
  specs.functionalModules.forEach((m) => {
    md += `\n**${m.name}** (${m.estimatedDays} j - ${m.cost.toLocaleString('fr-FR')} ${specs.financialQuote.currency})\n`;
    md += `*${m.description}*\n`;
    m.userStories.forEach((us) => {
      md += `  - ${us}\n`;
    });
  });
  md += `\n`;

  md += `### 1.4 Exigences Non-Fonctionnelles\n`;
  specs.nonFunctionalRequirements.forEach((req) => {
    md += `- **[${req.category}]** : ${req.rule}\n`;
  });
  md += `\n`;

  md += `### 1.5 Synthèse Financière & Échéancier de Facturation\n\n`;
  md += `- **Taux Journalier Moyen (TJM) :** ${specs.financialQuote.tjm} ${specs.financialQuote.currency} HT / jour\n`;
  md += `- **Charge de développement estimée :** ${specs.financialQuote.totalDays} Jours/Homme (${specs.financialQuote.subtotalHT.toLocaleString('fr-FR')} ${specs.financialQuote.currency} HT)\n`;
  md += `- **Marge d'aléa / Imprévus (${input.pricingGrid.bufferPercentage}%) :** +${specs.financialQuote.bufferDays} j (${specs.financialQuote.bufferAmount.toLocaleString('fr-FR')} ${specs.financialQuote.currency} HT)\n`;
  md += `- **TOTAL ESTIMÉ :** **${specs.financialQuote.totalEstimatedHT.toLocaleString('fr-FR')} ${specs.financialQuote.currency} HT**\n\n`;

  md += `**Modalités de règlement préconisées :**\n`;
  specs.financialQuote.paymentSchedule.forEach((step) => {
    md += `- **${step.milestone}** : ${step.percentage}% (${step.amount.toLocaleString('fr-FR')} ${specs.financialQuote.currency} HT)\n`;
  });
  md += `\n`;

  md += `### 1.6 Planning Prévisionnel & Jalons\n`;
  specs.deliveryRoadmap.forEach((phase) => {
    md += `- **${phase.phase}** (${phase.durationWeeks}) : ${phase.deliverables.join(', ')}\n`;
  });
  md += `\n---\n\n`;

  md += `## 2. DOSSIER D'ARCHITECTURE TECHNIQUE\n\n`;
  md += `### 2.1 Pattern Architectural\n`;
  md += `**Pattern Retenu :** ${architecture.chosenPattern}\n\n`;
  md += `**Justification :**\n${architecture.patternJustification}\n\n`;

  md += `### 2.2 Stratégie Web & Mobile\n`;
  md += `- **Gestion du Mode Hors-Ligne (Offline-First) :** ${architecture.mobileStrategy.offlineCapabilities}\n`;
  md += `- **State Management & Caching :** ${architecture.mobileStrategy.stateManagement}\n`;
  md += `- **Notifications Push :** ${architecture.mobileStrategy.pushNotifications}\n`;
  md += `- **Fonctionnalités Périphériques :** ${architecture.mobileStrategy.deviceFeatures.join(', ')}\n\n`;

  md += `### 2.3 Matrice API & Sécurité\n`;
  md += `- **Protocole :** ${architecture.apiDesign.protocol}\n`;
  md += `- **Flux d'Authentification :** ${architecture.apiDesign.authFlow}\n`;
  md += `- **Mesures de Sécurité :** ${architecture.apiDesign.securityMeasures.join(', ')}\n\n`;

  md += `**Endpoints Clés :**\n`;
  architecture.apiDesign.endpoints.forEach((ep) => {
    md += `- \`${ep.method} ${ep.path}\` : ${ep.description}\n`;
  });
  md += `\n`;

  md += `### 2.4 Schéma de Base de Données (${architecture.databaseDesign.engine})\n\n`;
  architecture.databaseDesign.tables.forEach((t) => {
    md += `#### Table \`${t.name}\`\n*${t.description}*\n`;
    md += `Champs :\n`;
    t.fields.forEach((f) => (md += `- \`${f}\`\n`));
    if (t.indexes && t.indexes.length > 0) {
      md += `Index :\n`;
      t.indexes.forEach((i) => (md += `- \`${i}\`\n`));
    }
    md += `\n`;
  });

  md += `### 2.5 Infrastructure, CI/CD & Observabilité\n`;
  md += `- **Hébergement :** ${architecture.infrastructure.hosting}\n`;
  md += `- **Pipeline CI/CD :** ${architecture.infrastructure.ciCd}\n`;
  md += `- **Monitoring & Logs :** ${architecture.infrastructure.monitoring}\n\n`;

  md += `### 2.6 Diagramme d'Architecture (Mermaid)\n\n\`\`\`mermaid\n${architecture.mermaidDiagram}\n\`\`\`\n\n`;

  md += `\n---\n\n`;
  md += `## 3. SUITE DE PROMPTS ACTIONNABLES POUR IA DE CODE (Cursor, Claude, Windsurf, Gemini)\n\n`;
  md += `*Ces prompts sont conçus pour être exécutés séquentiellement par une IA de génération de code pour implémenter fidèlement cette architecture.*\n\n`;

  aiPrompts.forEach((p) => {
    md += `### Étape ${p.stepNumber} : ${p.title}\n`;
    md += `- **Outil cible :** \`${p.targetTool}\`\n`;
    md += `- **Contexte :** ${p.context}\n`;
    md += `- **Conseil technique :** *${p.tipForDev}*\n\n`;
    md += `#### Prompt à Copier-Coller :\n\`\`\`text\n${p.promptText}\n\`\`\`\n\n`;
    md += `**Critères d'acceptation du prompt :**\n`;
    p.acceptanceCriteria.forEach((crit) => (md += `- [ ] ${crit}\n`));
    md += `\n---\n\n`;
  });

  return md;
}

export function downloadFile(content: string, filename: string, type = 'text/plain') {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
