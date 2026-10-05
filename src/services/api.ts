import { ChallengeReport, ProjectDeliverables, ProjectInput } from '../types/architect';

export async function requestArchitectChallenge(input: ProjectInput): Promise<ChallengeReport> {
  const response = await fetch('/api/architect/challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: input.projectName,
      clientName: input.clientName,
      clientObjective: input.clientObjective,
      devBrainstorm: input.devBrainstorm,
      targetPlatforms: input.targetPlatforms,
      techStack: input.techStack,
      pricingGrid: input.pricingGrid,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erreur lors de l’analyse par l’architecte.');
  }

  return response.json();
}

export async function requestDeliverablesGeneration(
  input: ProjectInput,
  decisions: { questionId: string; question: string; decision: string; impact: string }[]
): Promise<ProjectDeliverables> {
  const response = await fetch('/api/architect/generate-deliverables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input,
      decisions,
      pricingGrid: input.pricingGrid,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erreur lors de la génération des livrables.');
  }

  return response.json();
}
