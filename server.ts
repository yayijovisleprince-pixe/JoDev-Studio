import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialisation Gemini Server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint 1 : Analyse & Challenge par l'Architecte Logiciel
app.post('/api/architect/challenge', async (req, res) => {
  const { projectName, clientName, clientObjective, devBrainstorm, targetPlatforms, techStack, pricingGrid } = req.body;

  if (!clientObjective && !devBrainstorm) {
    return res.status(400).json({ error: 'Veuillez renseigner au moins les objectifs du client ou vos idées.' });
  }

  const prompt = `
Tu es un Architecte Logiciel Web & Mobile Expert au sein de JoDev Studio. Tu as conçu de nombreux systèmes scalables et robustes.
Un développeur web & mobile te consulte pour cadrer un projet client.

Voici les données du projet :
- Nom du projet : "${projectName || 'Projet sans nom'}"
- Client : "${clientName || 'Client'}"
- Ce que le client veut comme résultat / Objectif métier :
${clientObjective}

- Tout ce que le développeur a en tête (idées, modules, contraintes) :
${devBrainstorm}

- Plateformes ciblées : ${Array.isArray(targetPlatforms) ? targetPlatforms.join(', ') : 'Web & Mobile'}
- Stack technique envisagée :
  * Frontend Web : ${techStack?.frontend || 'React / Next.js'}
  * Mobile : ${techStack?.mobile || 'React Native Expo / Flutter'}
  * Backend : ${techStack?.backend || 'Node.js / Express / NestJS'}
  * Base de données : ${techStack?.database || 'PostgreSQL'}
  * ORM : ${techStack?.orm || 'Prisma / Drizzle'}
  * Auth : ${techStack?.auth || 'Supabase Auth / JWT'}
  * Hébergement : ${techStack?.hosting || 'Cloud Run / Supabase'}
  * Tiers / API : ${(techStack?.thirdParty || []).join(', ') || 'Aucun spécifié'}
- Grille tarifaire du dev : TJM ${pricingGrid?.tjm || 500} ${pricingGrid?.currency || '€'}, marge imprévus ${pricingGrid?.bufferPercentage || 15}%

TON OBJECTIF :
En tant qu'architecte logiciel, analyse ce dossier de façon claire, sobre et pragmatique.
Identifie les non-dits, les angles morts, les risques de dérive de périmètre, les failles d'architecture (offline-first, synchronisation, scalabilité, sécurité).
NE FAIS AUCUNE MENTION d'âge ou de nombre d'années d'expérience (pas de "20 ans"). N'utilise aucun emoji brillant.

Génère une réponse STRICTEMENT au format JSON avec la structure exacte suivante :
{
  "seniorVerdict": "Un paragraphe d'évaluation globale franc, rigoureux et pragmatique (forces, faiblesses, alertes immédiates)",
  "criticalRisks": [
    "3 à 5 risques majeurs concrets qui risquent d'impacter le budget ou la stabilité en production"
  ],
  "recommendations": [
    "3 à 4 préconisations architecturales fermes (pattern, découpage MVP vs V2, cache, sécurité)"
  ],
  "questions": [
    {
      "id": "q1",
      "category": "Architecture & Scalabilité" | "Mobile & Offline-First" | "Sécurité & Auth" | "Données & Performance" | "Périmètre & Dette Technique",
      "architectAdvice": "Ton conseil d'expert expliquant pourquoi cette question est critique et le piège classique à éviter",
      "question": "La question précise posée au développeur",
      "options": [
        {
          "label": "Titre court de l'option (ex: Approche Offline-First avec SQLite local + Sync)",
          "description": "Détail de cette approche et quand la choisir",
          "impactOnCost": "Faible (+0j)" | "Moyen (+2-4j)" | "Élevé (+5j+)",
          "recommended": true
        },
        {
          "label": "Titre court option 2",
          "description": "Détail et compromis",
          "impactOnCost": "Faible (+0j)" | "Moyen (+2-4j)" | "Élevé (+5j+)",
          "recommended": false
        }
      ]
    }
  ]
}

Génère entre 4 et 6 questions de challenge chirurgicales, parfaitement adaptées à la stack et aux spécificités web/mobile mentionnées. Ne renvoie rien d'autre que du JSON valide.
`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json(parsed);
    }
  } catch (err: any) {
    console.error('Gemini error, fallbacking to rule-based architect generator:', err?.message);
  }

  const fallback = generateFallbackChallenge(projectName, clientObjective, devBrainstorm, techStack, pricingGrid);
  return res.json(fallback);
});

// Endpoint 2 : Génération des 3 Livrables (Cahier des charges & Devis, Dossier Architecture, Prompts IA)
app.post('/api/architect/generate-deliverables', async (req, res) => {
  const { input, decisions, pricingGrid } = req.body;

  const prompt = `
Tu es un Architecte Logiciel Senior au sein de JoDev Studio.
Tu dois générer les 3 LIVRABLES COMPLETS, DÉTAILLÉS ET EXPLOITABLES IMMÉDIATEMENT pour ce projet :
NE METS AUCUNE MENTION DE "20 ans" OU SIMILAIRE. Le ton est professionnel, technique, direct et minimaliste.

FICHE PROJET :
- Titre : "${input?.projectName || 'Application Pro'}"
- Client : "${input?.clientName || 'Client'}"
- Attentes Client : ${input?.clientObjective}
- Idées & Brainstorming Dev : ${input?.devBrainstorm}
- Plateformes : ${(input?.targetPlatforms || ['web', 'mobile']).join(', ')}
- Stack Technique :
  * Web : ${input?.techStack?.frontend || 'React / Vite / Tailwind CSS'}
  * Mobile : ${input?.techStack?.mobile || 'React Native (Expo SDK 52)'}
  * Backend : ${input?.techStack?.backend || 'Node.js / Express / TypeScript'}
  * DB : ${input?.techStack?.database || 'PostgreSQL'}
  * ORM : ${input?.techStack?.orm || 'Prisma / Drizzle'}
  * Auth : ${input?.techStack?.auth || 'JWT / Refresh Token / Supabase Auth'}
  * Infra : ${input?.techStack?.hosting || 'Cloud Run / Supabase'}

GRILLE TARIFAIRE DU DÉVELOPPEUR :
- TJM : ${pricingGrid?.tjm || 500} ${pricingGrid?.currency || '€'}
- Marge imprévus/aléa : ${pricingGrid?.bufferPercentage || 15}%
- Modalités de règlement : ${pricingGrid?.paymentTerms || '30% à la signature, 40% jalon beta, 30% recette finale'}

ARBITRAGES ET DÉCISIONS DU DÉVELOPPEUR :
${JSON.stringify(decisions || [], null, 2)}

INSTRUCTIONS DE SORTIE (STRICTEMENT FORMAT JSON) :
Génère un JSON respectant exactement cette structure :
{
  "specs": {
    "executivePitch": "Résumé exécutif du projet, valeur métier pour le client et positionnement technique",
    "targetAudience": "Publics cibles et profils utilisateurs",
    "userPersonas": [
      { "role": "Nom du persona", "need": "Besoin principal", "painPoint": "Frustration actuelle résolue" }
    ],
    "functionalModules": [
      {
        "id": "mod-1",
        "name": "Nom du module (ex: Authentification sécurisée & Gestion des Rôles RBAC)",
        "description": "Description fonctionnelle précise",
        "userStories": [
          "En tant que ..., je souhaite ... afin de ...",
          "En tant que ..., je peux ..."
        ],
        "complexity": "Faible" | "Moyenne" | "Élevée" | "Critique",
        "estimatedDays": 4,
        "cost": 2000
      }
    ],
    "nonFunctionalRequirements": [
      { "category": "Sécurité / Performance / RGPD / Disponibilité", "rule": "Exigence technique mesurable" }
    ],
    "financialQuote": {
      "totalDays": 24,
      "subtotalHT": 12000,
      "bufferDays": 4,
      "bufferAmount": 2000,
      "totalEstimatedHT": 14000,
      "tjm": 500,
      "currency": "€",
      "paymentSchedule": [
        { "milestone": "Signature & Lancement du sprint 1", "percentage": 30, "amount": 4200 },
        { "milestone": "Livraison version Beta testable (Web & Mobile)", "percentage": 40, "amount": 5600 },
        { "milestone": "Recette finale, déploiement stores & prod", "percentage": 30, "amount": 4200 }
      ]
    },
    "deliveryRoadmap": [
      { "phase": "Phase 1 - Fondations & Data Model", "durationWeeks": "2 semaines", "deliverables": ["Repo initialisé", "Auth & DB prête"] },
      { "phase": "Phase 2 - Cœur métier & API", "durationWeeks": "3 semaines", "deliverables": ["Endpoints", "Écrans principaux"] },
      { "phase": "Phase 3 - Mobile Sync & Stores", "durationWeeks": "2 semaines", "deliverables": ["Tests e2e", "Builds Release"] }
    ]
  },
  "architecture": {
    "systemDesignSummary": "Vision architecturale globale (modularité, séparation des responsabilités)",
    "chosenPattern": "Ex: Clean Architecture Modulaire & Ports/Adapters",
    "patternJustification": "Pourquoi ce pattern garantit la maintenabilité et évite la dette technique",
    "mobileStrategy": {
      "offlineCapabilities": "Gestion fine du offline (cache local, file d'attente de requêtes)",
      "stateManagement": "State manager préconisé (ex: Zustand + TanStack Query) et politique de cache",
      "pushNotifications": "Architecture push (FCM / APNs) et gestion des tokens",
      "deviceFeatures": ["Biométrie", "Stockage sécurisé (SecureStore / Keychain)", "Camera / Fichiers"]
    },
    "apiDesign": {
      "protocol": "RESTful / JSON API avec validation Zod stricte",
      "authFlow": "Flux d'authentification détaillé (Access Token court + Refresh Token HttpOnly + RBAC middleware)",
      "securityMeasures": ["Rate limiting Redis", "Helmet", "CORS restreint", "Validation runtime des payloads"],
      "endpoints": [
        { "method": "POST", "path": "/api/v1/auth/login", "description": "Authentification & délivrance tokens", "payload": "{\\"email\\": \\"string\\", \\"password\\": \\"string\\"}" },
        { "method": "GET", "path": "/api/v1/resources", "description": "Liste paginée avec filtre et cache ETag" },
        { "method": "POST", "path": "/api/v1/resources", "description": "Création sécurisée avec idempotency key" }
      ]
    },
    "databaseDesign": {
      "engine": "PostgreSQL 16",
      "tables": [
        {
          "name": "users",
          "description": "Comptes utilisateurs et statuts",
          "fields": ["id: UUID PRIMARY KEY", "email: VARCHAR UNIQUE", "role: user_role_enum", "created_at: TIMESTAMPTZ"],
          "indexes": ["idx_users_email", "idx_users_role"]
        },
        {
          "name": "resources",
          "description": "Entités métier principales",
          "fields": ["id: UUID PRIMARY KEY", "user_id: UUID REFERENCES users(id)", "data: JSONB", "updated_at: TIMESTAMPTZ"],
          "indexes": ["idx_resources_user_id"]
        }
      ]
    },
    "infrastructure": {
      "hosting": "Cloud Run / Docker multi-stage pour le backend, Vercel/Cloudflare pour le web, Expo Application Services (EAS) pour le mobile",
      "ciCd": "GitHub Actions (Lint, Typecheck, Tests unitaires, Build automatisé, Déploiement continu)",
      "monitoring": "Sentry pour le crash reporting + métriques API"
    },
    "mermaidDiagram": "graph TD\\n  ClientWeb[Client Web - React/Vite] -->|HTTPS/REST| APIGateway[API Gateway / Express Server]\\n  ClientMobile[Client Mobile - React Native/Expo] -->|HTTPS/REST| APIGateway\\n  ClientMobile -.->|Local Cache| LocalStorage[(SQLite / Storage)]\\n  APIGateway -->|JWT Verify| AuthMiddleware[Auth & RBAC Middleware]\\n  AuthMiddleware --> BusinessServices[Domain Services & Use Cases]\\n  BusinessServices --> DB[(PostgreSQL Database)]\\n  BusinessServices --> Cache[(Redis Cache)]\\n  BusinessServices --> CloudStorage[S3/Cloud Storage]"
  },
  "aiPrompts": [
    {
      "id": "prompt-1",
      "stepNumber": 1,
      "title": "Initialisation du Repository & Clean Scaffolding Full-Stack",
      "targetTool": "Cursor / Windsurf / Claude Code",
      "context": "Mise en place de la fondation du projet avec la stack validée",
      "promptText": "Le prompt intégral, ultra-précis, avec la commande d'init, l'arbre de dossiers clean architecture, les configs tsconfig/eslint/docker et les règles d'or de développement",
      "acceptanceCriteria": ["Repo compile sans warning", "Alias @/ configurés", "Variables d'environnement typées avec Zod"],
      "tipForDev": "Recommandation concrète pour guider l'IA lors de cette exécution"
    },
    {
      "id": "prompt-2",
      "stepNumber": 2,
      "title": "Modélisation de Données, Migrations ORM & Seed de Recette",
      "targetTool": "Cursor / Windsurf / Claude 3.7",
      "context": "Création du schéma DB, des relations et du script de seed",
      "promptText": "Prompt complet pour générer les schémas Prisma/Drizzle avec contraintes d'intégrité, indexes et script de seeding réaliste",
      "acceptanceCriteria": ["Migrations générées sans erreur", "Relations 1-N et N-N sécurisées", "Seed prêt pour les tests"],
      "tipForDev": "Vérifier que les index correspondents aux requêtes de filtrage fréquentes"
    },
    {
      "id": "prompt-3",
      "stepNumber": 3,
      "title": "Cœur Backend API, Use Cases & Sécurité Auth/RBAC",
      "targetTool": "Cursor / Windsurf / Claude Code",
      "context": "Implémentation de la couche métier découplée",
      "promptText": "Prompt complet décrivant la Clean Architecture (Ports, Adapters, Repositories, Middlewares d'auth et de validation)",
      "acceptanceCriteria": ["Contrôleurs minces, Use Cases testables sans DB", "Middlewares de validation Zod stricts", "Gestion centralisée des erreurs avec codes HTTP idoines"],
      "tipForDev": "Demander à l'IA d'isoler la logique métier dans des use cases purs sans dépendre d'Express"
    },
    {
      "id": "prompt-4",
      "stepNumber": 4,
      "title": "Application Mobile & Frontend Web : State, Navigation & Offline",
      "targetTool": "Cursor / Windsurf / Claude 3.7",
      "context": "Mise en place du client avec TanStack Query, Zustand et gestion hors-ligne",
      "promptText": "Prompt complet pour générer les écrans clés, la synchronisation réseau et la gestion des états de chargement/erreur",
      "acceptanceCriteria": ["Navigation fluide avec protection de routes", "Cache réactif avec optimistic updates", "Feedback visuel en mode hors-ligne"],
      "tipForDev": "Tester immédiatement le comportement avec throttling réseau 3G et mode avion"
    },
    {
      "id": "prompt-5",
      "stepNumber": 5,
      "title": "Hardening Sécurité, Tests E2E & Préparation Déploiement Stores",
      "targetTool": "Cursor / Windsurf / Claude Code",
      "context": "Finalisation du livrable pour mise en production industrielle",
      "promptText": "Prompt de sécurisation finale : scan de vulnérabilités, tests critiques, configuration CI/CD et bundle mobile de production",
      "acceptanceCriteria": ["Tests unitaires des calculs critiques au vert", "Dockerfile multi-stage allégé", "Config EAS / Store compliance validée"],
      "tipForDev": "Garder ce prompt pour l'étape de pré-recette client avant la livraison finale"
    }
  ]
}

Assure-toi que les calculs financiers correspondent au TJM fourni (${pricingGrid?.tjm} ${pricingGrid?.currency}).
Retourne EXCLUSIVEMENT le JSON valide.
`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json({
        ...parsed,
        generatedAt: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    console.error('Gemini deliverable generation error, fallbacking:', err?.message);
  }

  const fallback = generateFallbackDeliverables(input, decisions, pricingGrid);
  return res.json({
    ...fallback,
    generatedAt: new Date().toISOString(),
  });
});

function generateFallbackChallenge(
  projectName: string,
  clientObjective: string,
  devBrainstorm: string,
  techStack: any,
  pricingGrid: any
) {
  return {
    seniorVerdict: `Projet "${projectName || 'Application Pro'}" : les bases métier sont claires mais présentent des défis notables sur la synchronisation et la gestion des états offline. L'enjeu est de verrouiller un MVP strict afin de respecter votre budget et votre TJM de ${pricingGrid?.tjm || 500} ${pricingGrid?.currency || '€'} sans dérive de périmètre.`,
    criticalRisks: [
      "Gestion asynchrone complexe entre les clients Web et Mobile en cas d'écriture hors-ligne",
      "Sous-évaluation des règles d'acceptation et des délais de validation sur les stores d'applications",
      "Manque de formalisation du modèle de droits d'accès (RBAC) risquant de fragiliser les API",
      "Absence de politique de cache serveur, menant à des requêtes redondantes sur la base",
    ],
    recommendations: [
      "Adopter une Clean Architecture modulaire dès l'initialisation pour découpler le cœur métier",
      "Définir une stratégie Cache-First avec Optimistic UI sur le client mobile",
      "Partager les contrats et schémas de validation (Zod) entre le backend et les frontends",
      "Conserver une marge d'aléa contractuelle de minimum 15% pour absorber les ajustements de recette",
    ],
    questions: [
      {
        id: "q-arch-1",
        category: "Mobile & Offline-First",
        architectAdvice: "En environnement mobile réel, la perte de connectivité est fréquente. Une application qui bloque ou perd des saisies dégrade immédiatement la confiance utilisateur.",
        question: "Comment l'application mobile doit-elle réagir en cas d'absence de réseau ?",
        options: [
          {
            label: "Lecture hors-ligne + File d'attente d'écriture (Mutation Queue)",
            description: "Les données locales restent consultables. Les actions en écriture sont stockées et rejouées dès retour du réseau.",
            impactOnCost: "Moyen (+2-4j)",
            recommended: true,
          },
          {
            label: "Mode connecté strict avec écran de statut réseau",
            description: "L'application signale la coupure et restreint les écritures. Approche plus simple et rapide pour une V1.",
            impactOnCost: "Faible (+0j)",
            recommended: false,
          },
        ],
      },
      {
        id: "q-arch-2",
        category: "Sécurité & Auth",
        architectAdvice: "La gestion d'authentification maison est sujette à failles. Il est préférable de s'appuyer sur des briques standardisées avec tokens à courte durée.",
        question: "Quelle stratégie d'authentification et de gouvernance retenir ?",
        options: [
          {
            label: "Auth managée (Supabase Auth / Clerk) avec rôles stockés en DB",
            description: "Tokens JWT courts, refresh tokens gérés en standard et table de permissions maîtrisée.",
            impactOnCost: "Faible (+0j)",
            recommended: true,
          },
          {
            label: "JWT custom sécurisé avec révocation Redis",
            description: "Contrôle intégral mais demande la maintenance d'une instance Redis dédiée aux sessions.",
            impactOnCost: "Moyen (+2-4j)",
            recommended: false,
          },
        ],
      },
      {
        id: "q-arch-3",
        category: "Architecture & Scalabilité",
        architectAdvice: "Un monolithe modulaire bien typé est généralement plus rapide à développer et plus économique à héberger qu'une constellation de microservices.",
        question: "Quelle typologie d'architecture backend souhaitez-vous implémenter ?",
        options: [
          {
            label: "Monolithe Modulaire en Clean Architecture (Domain / Use Cases / Infra)",
            description: "Séparation stricte des responsabilités métier, déploiement conteneurisé simple et testabilité maximale.",
            impactOnCost: "Faible (+0j)",
            recommended: true,
          },
          {
            label: "Architecture Serverless (Cloud Functions / Edge)",
            description: "Maintenance serveur réduite, mais nécessite une gestion attentive des démarrages à froid (cold starts).",
            impactOnCost: "Faible (+0j)",
            recommended: false,
          },
        ],
      },
      {
        id: "q-arch-4",
        category: "Périmètre & Dette Technique",
        architectAdvice: "Pour préserver votre rentabilité et garantir la date de livraison, le périmètre de la première version doit être rigoureusement délimité.",
        question: "Quel découpage de périmètre souhaitez-vous fixer contractuellement ?",
        options: [
          {
            label: "MVP Cœur Métier (V1) + Roadmap V2 chiffrée séparément",
            description: "Focus sur les flux à forte valeur ajoutée. Les fonctionnalités secondaires sont formalisées pour une phase ultérieure.",
            impactOnCost: "Faible (+0j)",
            recommended: true,
          },
          {
            label: "Périmètre global étendu avec marge d'aléa renforcée",
            description: "Intègre l'ensemble des modules dès la V1 avec une marge d'imprévus proportionnelle aux risques.",
            impactOnCost: "Élevé (+5j+)",
            recommended: false,
          },
        ],
      },
    ],
  };
}

function generateFallbackDeliverables(input: any, decisions: any, pricingGrid: any) {
  const tjm = Number(pricingGrid?.tjm) || 500;
  const currency = pricingGrid?.currency || '€';
  const bufferPercent = Number(pricingGrid?.bufferPercentage) || 15;

  const modules = [
    {
      id: "mod-1",
      name: "Socle Technique, Auth Sécurisée & Permissions (RBAC)",
      description: "Architecture de base, authentification multi-plateforme (Web & Mobile), gestion des sessions et permissions utilisateurs.",
      userStories: [
        "En tant qu'utilisateur, je peux créer un compte et m'authentifier de façon sécurisée",
        "En tant qu'administrateur, je peux gérer les rôles et permissions",
        "En tant que système, je valide chaque requête via des schémas stricts",
      ],
      complexity: "Moyenne" as const,
      estimatedDays: 4,
      cost: 4 * tjm,
    },
    {
      id: "mod-2",
      name: "Cœur Métier & Modèle de Données Principal",
      description: "Gestion des entités métier fondamentales, règles de calcul, filtres et intégrité relationnelle.",
      userStories: [
        "En tant qu'utilisateur, je peux créer, consulter et modifier les dossiers métier",
        "En tant qu'utilisateur, je recherche et filtre rapidement mes données",
        "En tant que système, j'applique les règles d'intégrité avant sauvegarde",
      ],
      complexity: "Élevée" as const,
      estimatedDays: 7,
      cost: 7 * tjm,
    },
    {
      id: "mod-3",
      name: "Application Mobile : Navigation, UI Réactive & Mode Hors-Ligne",
      description: "Développement des écrans mobiles (iOS & Android) avec React Native, persistance locale et synchronisation.",
      userStories: [
        "En tant qu'utilisateur mobile, je consulte mes données même sans connexion",
        "En tant qu'utilisateur mobile, mes actions hors-ligne se synchronisent automatiquement",
        "En tant qu'utilisateur mobile, je reçois les notifications push importantes",
      ],
      complexity: "Élevée" as const,
      estimatedDays: 6,
      cost: 6 * tjm,
    },
    {
      id: "mod-4",
      name: "Interface Web & Dashboard de Suivi",
      description: "Tableau de bord de gestion avec indicateurs clés, filtres et exports de données.",
      userStories: [
        "En tant que gestionnaire, je visualise les indicateurs en temps réel",
        "En tant que gestionnaire, j'exporte les rapports au format PDF ou tableur",
      ],
      complexity: "Moyenne" as const,
      estimatedDays: 4,
      cost: 4 * tjm,
    },
    {
      id: "mod-5",
      name: "Sécurisation, Pipeline CI/CD & Déploiement Production",
      description: "Tests automatisés, conteneurisation Docker, configuration du serveur Cloud et builds mobiles de release.",
      userStories: [
        "En tant que développeur, chaque commit déclenche les vérifications automatisées",
        "En tant que client, l'application est déployée sur un environnement haute disponibilité",
      ],
      complexity: "Moyenne" as const,
      estimatedDays: 3,
      cost: 3 * tjm,
    },
  ];

  const totalDays = modules.reduce((acc, m) => acc + m.estimatedDays, 0);
  const subtotalHT = totalDays * tjm;
  const bufferDays = Math.ceil(totalDays * (bufferPercent / 100));
  const bufferAmount = bufferDays * tjm;
  const totalEstimatedHT = subtotalHT + bufferAmount;

  return {
    specs: {
      executivePitch: `Ce cahier des charges formalise la conception et l'implémentation de "${input?.projectName || 'l\'Application Pro'}" pour le compte de ${input?.clientName || 'notre client'}. L'objectif est de délivrer une solution web et mobile fiable, rapide et sécurisée, basée sur des standards techniques éprouvés.`,
      targetAudience: "Utilisateurs finaux et équipes opérationnelles recherchant réactivité, fiabilité et accessibilité permanente.",
      userPersonas: [
        { role: "Utilisateur Terrain / Mobile", need: "Consulter et saisir des informations rapidement même en déplacement.", painPoint: "Réseau instable et perte de temps sur des interfaces lentes." },
        { role: "Responsable Opérationnel", need: "Disposer d'une vue d'ensemble fiable et centralisée des activités.", painPoint: "Données fragmentées et délais de transmission." },
      ],
      functionalModules: modules,
      nonFunctionalRequirements: [
        { category: "Performance", rule: "Temps de réponse API sous les 200ms au 95e percentile (p95)." },
        { category: "Disponibilité", rule: "Taux de disponibilité cible de 99.9% avec monitoring proactif." },
        { category: "Sécurité", rule: "Chiffrement TLS en transit, chiffrement des données au repos, conformité RGPD." },
        { category: "Mobilité", rule: "Support iOS et Android récents, compatibilité offline-first et conformité stores." },
      ],
      financialQuote: {
        totalDays,
        subtotalHT,
        bufferDays,
        bufferAmount,
        totalEstimatedHT,
        tjm,
        currency,
        paymentSchedule: [
          { milestone: "Acompte à la signature & Démarrage", percentage: 30, amount: Math.round(totalEstimatedHT * 0.3) },
          { milestone: "Livraison de la version Beta testable (Web & Mobile)", percentage: 40, amount: Math.round(totalEstimatedHT * 0.4) },
          { milestone: "Recette finale validée & Déploiement en production", percentage: 30, amount: Math.round(totalEstimatedHT * 0.3) },
        ],
      },
      deliveryRoadmap: [
        { phase: "Sprint 1 : Socle Technique & Schéma DB", durationWeeks: "2 semaines", deliverables: ["Repository & CI/CD", "Base de données & Auth", "Documentation d'API"] },
        { phase: "Sprint 2 : Cœur Métier & API REST", durationWeeks: "3 semaines", deliverables: ["Endpoints métier", "Validation Zod", "Dashboard web"] },
        { phase: "Sprint 3 : Application Mobile & Cache Offline", durationWeeks: "3 semaines", deliverables: ["Écrans mobiles", "Sync locale", "Notifications push"] },
        { phase: "Sprint 4 : Recette & Déploiement Stores", durationWeeks: "2 semaines", deliverables: ["Tests d'acceptation", "Builds Release", "Passation technique"] },
      ],
    },
    architecture: {
      systemDesignSummary: "Architecture modulaire associant une API backend structurée en Clean Architecture, une application Web React performante et une application mobile React Native (Expo) partageant les mêmes schémas de typage.",
      chosenPattern: "Clean Architecture Modulaire (Domain / Use Cases / Adapters / Frameworks)",
      patternJustification: "Cette structure isole strictement la logique métier des détails technologiques (framework web, base de données). Elle facilite les tests unitaires et pérennise le code dans le temps.",
      mobileStrategy: {
        offlineCapabilities: "Stratégie Cache-First avec TanStack Query et persistance locale. Les requêtes en écriture sont enregistrées dans une file d'attente locale et transmises automatiquement dès retour du réseau.",
        stateManagement: "Zustand pour l'état d'interface UI et TanStack Query pour les états serveurs avec politique d'invalidation ciblée.",
        pushNotifications: "Service de notifications push avec jetons chiffrés et gestion des autorisations système.",
        deviceFeatures: ["Biométrie (TouchID / FaceID)", "Stockage sécurisé (Keychain / Keystore)", "Accès caméra et compression d'images"],
      },
      apiDesign: {
        protocol: "RESTful JSON API versionnée (/api/v1) avec validation contractuelle Zod",
        authFlow: "Authentification JWT avec Access Token court en mémoire et Refresh Token sécurisé.",
        securityMeasures: [
          "Rate Limiting par IP et identifiant",
          "Protection CORS stricte et en-têtes Helmet",
          "Sanitisation systématique des entrées",
          "Clés d'idempotence sur les créations sensibles",
        ],
        endpoints: [
          { method: "POST", path: "/api/v1/auth/login", description: "Authentification et délivrance des tokens", payload: '{"email": "string", "password": "string"}' },
          { method: "POST", path: "/api/v1/auth/refresh", description: "Renouvellement du token d'accès" },
          { method: "GET", path: "/api/v1/items", description: "Récupération paginée des entités avec filtres" },
          { method: "POST", path: "/api/v1/items", description: "Création d'une entité métier avec validation Zod", payload: '{"title": "string", "details": "object"}' },
          { method: "GET", path: "/api/v1/items/:id", description: "Détail complet d'une entité avec contrôle des accès" },
        ],
      },
      databaseDesign: {
        engine: "PostgreSQL 16 avec pooling de connexions",
        tables: [
          {
            name: "users",
            description: "Table centrale des comptes et authentifications",
            fields: ["id: UUID PRIMARY KEY DEFAULT gen_random_uuid()", "email: VARCHAR(255) NOT NULL UNIQUE", "password_hash: VARCHAR(255)", "role: VARCHAR(50) DEFAULT 'user'", "created_at: TIMESTAMPTZ DEFAULT now()", "updated_at: TIMESTAMPTZ DEFAULT now()"],
            indexes: ["CREATE UNIQUE INDEX idx_users_email ON users(email);", "CREATE INDEX idx_users_role ON users(role);"],
          },
          {
            name: "profiles",
            description: "Informations de profil et préférences utilisateur",
            fields: ["user_id: UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE", "full_name: VARCHAR(150)", "avatar_url: TEXT", "push_token: VARCHAR(255)", "preferences: JSONB DEFAULT '{}'"],
            indexes: ["CREATE INDEX idx_profiles_push_token ON profiles(push_token);"],
          },
          {
            name: "business_items",
            description: "Entités métier principales",
            fields: ["id: UUID PRIMARY KEY DEFAULT gen_random_uuid()", "owner_id: UUID NOT NULL REFERENCES users(id)", "title: VARCHAR(255) NOT NULL", "status: VARCHAR(50) DEFAULT 'draft'", "metadata: JSONB DEFAULT '{}'", "created_at: TIMESTAMPTZ DEFAULT now()"],
            indexes: ["CREATE INDEX idx_items_owner ON business_items(owner_id);", "CREATE INDEX idx_items_status ON business_items(status);"],
          },
        ],
      },
      infrastructure: {
        hosting: "Conteneurisation Docker déployée sur Cloud Run. Base PostgreSQL managée. Hébergement Web sur CDN et compilation mobile via EAS.",
        ciCd: "GitHub Actions : validation du code TypeScript, exécution des tests unitaires et intégration continue.",
        monitoring: "Suivi des erreurs applicatives avec Sentry et surveillance de la disponibilité serveur.",
      },
      mermaidDiagram: `graph TD
  ClientWeb[Client Web - React / Tailwind] -->|HTTPS REST| APIGateway[API Express / Node.js]
  ClientMobile[Client Mobile - React Native Expo] -->|HTTPS REST| APIGateway
  ClientMobile -.->|Cache Offline| SQLite[(Stockage Local SQLite)]
  APIGateway -->|Contrôle Token| AuthGuard[Auth & RBAC Middleware]
  AuthGuard --> UseCases[Use Cases - Logique Métier]
  UseCases --> RepoAdapters[Adapteurs Repositories]
  RepoAdapters --> Postgres[(PostgreSQL Database)]
  RepoAdapters --> CloudStorage[Stockage Objets Cloud]
  APIGateway --> SentryLogger[Observabilité & Sentry]`,
    },
    aiPrompts: [
      {
        id: "prompt-1",
        stepNumber: 1,
        title: "Prompt 1 : Initialisation & Scaffolding Clean Architecture",
        targetTool: "Cursor / Windsurf / Claude Code",
        context: "Mise en place de la structure projet avec la stack sélectionnée.",
        promptText: `Tu es un Ingénieur Logiciel Senior expert TypeScript et architecture modulaire.
Initialise la structure du projet avec la configuration suivante :
- Backend : Node.js avec Express, TypeScript strict, Clean Architecture (dossiers: domain/, application/usecases/, infrastructure/controllers/, infrastructure/repositories/, infrastructure/database/)
- Configuration : Variables d'environnement validées par Zod
- Outils : ESLint strict, Prettier, scripts npm (dev, build, lint).

Génère l'arborescence complète, le fichier package.json avec dépendances exactes, le tsconfig.json optimisé avec alias (@/ -> src/), et un fichier healthcheck.ts opérationnel.
Le code doit compiler sans aucun avertissement.`,
        acceptanceCriteria: [
          "Le projet démarre avec npm run dev sans erreur",
          "Les alias TypeScript fonctionnent correctement",
          "Les variables d'environnement sont validées par Zod",
        ],
        tipForDev: "Exécuter ce prompt dans un répertoire vierge ou avec le mode Agent activé.",
      },
      {
        id: "prompt-2",
        stepNumber: 2,
        title: "Prompt 2 : Schéma de Base de Données, Migrations & Seed",
        targetTool: "Cursor / Windsurf / Claude 3.7",
        context: "Création du modèle relationnel avec contraintes d'intégrité et données de test.",
        promptText: `Tu es un Database Architect expert PostgreSQL et ORM (Prisma / Drizzle).
Génère le schéma de base de données complet pour ce projet :
1. Tables requises :
   - users (id UUID, email unique, password_hash, role, dates)
   - profiles (user_id FK cascade, full_name, avatar, push_token, preferences JSONB)
   - business_items (id UUID, owner_id FK, title, status, metadata JSONB, dates)
2. Définis les relations, les clés étrangères avec actions ON DELETE appropriées et les index de performance B-Tree.
3. Rédige un script de seed (seed.ts) créant un compte administrateur et 10 entités de test cohérentes.
4. Fournis les commandes exactes de migration.`,
        acceptanceCriteria: [
          "Le schéma passe la validation de l'ORM",
          "Le script seed.ts s'exécute sans erreur",
          "Les index requis sont bien appliqués sur les colonnes de filtrage",
        ],
        tipForDev: "Vérifier le schéma généré directement avec votre outil de gestion de base de données.",
      },
      {
        id: "prompt-3",
        stepNumber: 3,
        title: "Prompt 3 : API Backend, Use Cases Métier & Contrôle des Accès",
        targetTool: "Cursor / Windsurf / Claude Code",
        context: "Développement du cœur fonctionnel en Clean Architecture.",
        promptText: `Tu es un Ingénieur Backend Senior. Implémente la couche métier et les endpoints API en respectant la Clean Architecture :
1. Repositories : Crée les interfaces IUserRepository et IItemRepository, puis leurs implémentations avec l'ORM.
2. Use Cases : Implémente LoginUserUseCase, RegisterUserUseCase, CreateItemUseCase, GetItemsListUseCase avec validation runtime via Zod.
3. Middlewares :
   - authMiddleware : Vérification du token JWT
   - rbacMiddleware : Vérification des rôles requis
   - errorHandler : Centralisation des erreurs et renvoi des statuts HTTP appropriés.
4. Routes : Configure les routes /api/v1/auth et /api/v1/items avec typage strict.`,
        acceptanceCriteria: [
          "Les use cases sont indépendants du framework HTTP",
          "Toutes les entrées API sont validées par Zod",
          "Les mots de passe sont hashés avec un algorithme robuste (argon2 ou bcrypt)",
        ],
        tipForDev: "Tester les endpoints avec un client HTTP dès la fin de la génération.",
      },
      {
        id: "prompt-4",
        stepNumber: 4,
        title: "Prompt 4 : Clients Web & Mobile, Synchronisation & Offline-First",
        targetTool: "Cursor / Windsurf / Claude 3.7",
        context: "Interface utilisateur réactive avec persistance locale et synchronisation réseau.",
        promptText: `Tu es un Développeur Frontend & Mobile Senior (React / React Native Expo).
Mets en place le socle client de l'application :
1. Navigation : Structure les flux d'authentification et les écrans protégés.
2. Gestion d'état & Cache :
   - Configure TanStack Query avec persistance locale.
   - Implémente la mise à jour optimiste (Optimistic UI) pour une réactivité immédiate.
3. Mode Hors-Ligne :
   - Détection de la connectivité réseau.
   - Enregistrement des actions locales en cas de coupure et synchronisation automatique au retour du réseau.
4. Interface : Composants épurés, responsives et contrastés.`,
        acceptanceCriteria: [
          "L'application reste opérationnelle hors connexion",
          "Les modifications locales sont reflétées immédiatement à l'écran",
          "La synchronisation s'exécute dès le rétablissement de la connexion",
        ],
        tipForDev: "Valider le comportement en simulant une coupure réseau dans les outils de développement.",
      },
      {
        id: "prompt-5",
        stepNumber: 5,
        title: "Prompt 5 : Tests d'Intégration, Sécurisation & Déploiement",
        targetTool: "Cursor / Windsurf / Claude Code",
        context: "Finalisation technique pour le déploiement en production.",
        promptText: `Tu es un Ingénieur DevOps et Sécurité.
Prépare le projet pour la mise en production :
1. Tests : Rédige une suite de tests d'intégration avec Vitest couvrant le flux d'authentification et de gestion des données.
2. Sécurité :
   - En-têtes Helmet
   - Limitation de débit (rate limiting)
   - Configuration CORS restrictive
3. Docker & Déploiement :
   - Dockerfile multi-stage allégé
   - Workflow CI/CD GitHub Actions pour l'exécution des tests et le déploiement.
4. Rédige un fichier README.md clair avec instructions de déploiement.`,
        acceptanceCriteria: [
          "Les tests automatisés s'exécutent avec succès",
          "L'image Docker est optimisée et sécurisée",
          "La documentation permet une prise en main immédiate",
        ],
        tipForDev: "Ce prompt sert d'ultime validation avant la livraison au client.",
      },
    ],
  };
}

async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JoDev Studio server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
