import React, { useState } from 'react';
import { Copy, Check, Eye, Code, Smartphone, Globe, Server, Database, Shield, HardDrive } from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 bg-zinc-50/70">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'visual'
                ? 'bg-white text-zinc-900 border border-zinc-200 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            <span>Topologie Visuelle</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'code'
                ? 'bg-white text-zinc-900 border border-zinc-200 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-zinc-500" />
            <span>Code Mermaid</span>
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-zinc-50 text-xs text-zinc-700 border border-zinc-200 transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-orange-600 font-medium">Copié</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-500" />
              <span>Copier le diagramme</span>
            </>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5">
        {activeTab === 'visual' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
              {/* Column 1: Clients Web & Mobile */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 pb-1 border-b border-zinc-200">
                  1. Frontends
                </div>
                {/* Web card */}
                <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-zinc-900 font-semibold text-xs">
                    <Globe className="w-3.5 h-3.5 text-orange-500" />
                    <span>Client Web (React)</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Dashboard SPA réactif, validation Zod & cache TanStack Query.
                  </p>
                </div>
                {/* Mobile card */}
                <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-zinc-900 font-semibold text-xs">
                    <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                    <span>Client Mobile (React Native)</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    iOS / Android via Expo. Optimistic updates et synchronisation.
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-zinc-200 flex items-center space-x-1 text-[10px] text-zinc-600 font-mono">
                    <Database className="w-3 h-3 text-orange-500" />
                    <span>SQLite / AsyncStorage</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Gateway & Sécurité */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 pb-1 border-b border-zinc-200">
                  2. Gateway & Sécurité
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-zinc-900 font-semibold text-xs">
                    <Server className="w-3.5 h-3.5 text-zinc-700" />
                    <span>API Gateway</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Express / Fastify, rate limiting, en-têtes Helmet et routes versionnées.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-zinc-900 font-semibold text-xs">
                    <Shield className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Auth & RBAC</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Validation JWT, permissions utilisateurs et protection CSRF.
                  </p>
                </div>
              </div>

              {/* Column 3: Clean Architecture Use Cases */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 pb-1 border-b border-zinc-200">
                  3. Clean Architecture
                </div>
                <div className="p-3.5 rounded-lg bg-orange-50/40 border border-orange-200 space-y-1.5">
                  <div className="text-xs font-bold text-zinc-900">Use Cases Métier</div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Découplés de la base de données et des protocoles : testables unitairement.
                  </p>
                  <div className="space-y-1 text-[10px] text-zinc-600 pt-1 font-mono">
                    <div className="px-1.5 py-0.5 rounded bg-white border border-orange-100">
                      • Port Interfaces Repositories
                    </div>
                    <div className="px-1.5 py-0.5 rounded bg-white border border-orange-100">
                      • Validation schémas Zod
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 4: Persistence & Cloud */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 pb-1 border-b border-zinc-200">
                  4. Persistence & Cloud
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-zinc-900 font-semibold text-xs">
                    <Database className="w-3.5 h-3.5 text-orange-500" />
                    <span>PostgreSQL</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Schémas relationnels, clés étrangères, indexes B-Tree et PgBouncer.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-zinc-900 font-semibold text-xs">
                    <HardDrive className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Cloud Storage & Docker</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Stockage médias sécurisé et conteneurisation Cloud Run.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <pre className="p-4 rounded-lg bg-zinc-900 font-mono text-xs text-zinc-100 overflow-x-auto leading-relaxed">
              {chart}
            </pre>
            <p className="text-[11px] text-zinc-500">
              Compatible avec Mermaid Live Editor, GitHub Markdown, Notion et Obsidian.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
