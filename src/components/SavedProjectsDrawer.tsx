import React from 'react';
import { X, FolderKanban, Trash2, ArrowRight, Clock, Layers } from 'lucide-react';
import { SavedProject } from '../types/architect';

interface SavedProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SavedProject[];
  onSelectProject: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
}

export const SavedProjectsDrawer: React.FC<SavedProjectsDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onDeleteProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-900/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
            <div className="flex items-center space-x-2">
              <FolderKanban className="w-4 h-4 text-orange-500" />
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm">Projets Enregistrés</h3>
                <p className="text-xs text-zinc-500">{projects.length} projet(s) en mémoire</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Layers className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-zinc-600">Aucun projet enregistré</p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Vos cadrages validés seront conservés automatiquement ici.
                </p>
              </div>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-lg bg-white border border-zinc-200 hover:border-orange-300 hover:shadow-xs transition group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-zinc-900 text-sm group-hover:text-orange-600 transition">
                        {proj.title || 'Projet sans nom'}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Client : {proj.input.clientName || 'Non spécifié'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      className="p-1 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 rounded transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-100 pt-2.5">
                    <span className="flex items-center space-x-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span>{new Date(proj.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </span>
                    <button
                      onClick={() => {
                        onSelectProject(proj);
                        onClose();
                      }}
                      className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium transition"
                    >
                      <span>Ouvrir</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
