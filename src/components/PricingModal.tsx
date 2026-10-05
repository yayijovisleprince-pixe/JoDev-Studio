import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { PricingGrid } from '../types/architect';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricing: PricingGrid;
  onSave: (pricing: PricingGrid) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  pricing,
  onSave,
}) => {
  const [form, setForm] = useState<PricingGrid>(pricing);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold text-zinc-900 text-sm">Paramètres de la Grille Tarifaire</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* TJM */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                TJM (Taux Journalier Moyen)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="25"
                  value={form.tjm}
                  onChange={(e) => setForm({ ...form, tjm: Number(e.target.value) || 0 })}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm font-mono text-zinc-900 focus:outline-none focus:border-orange-500 transition"
                  required
                />
                <span className="absolute right-3 top-2 text-xs text-zinc-400 font-mono">
                  {form.currency}/j
                </span>
              </div>
            </div>

            {/* Devise */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Devise</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-orange-500 transition"
              >
                <option value="€">Euro (€)</option>
                <option value="$">US Dollar ($)</option>
                <option value="FCFA">Franc CFA (FCFA)</option>
                <option value="CHF">Franc Suisse (CHF)</option>
                <option value="CAD">Dollar Canadien (CAD)</option>
              </select>
            </div>
          </div>

          {/* Marge Aléa / Imprévus */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-zinc-700">
                Marge d'aléa et imprévus ({form.bufferPercentage}%)
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">Recommandé : 15%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={form.bufferPercentage}
              onChange={(e) => setForm({ ...form, bufferPercentage: Number(e.target.value) })}
              className="w-full accent-orange-500 cursor-pointer h-1.5 bg-zinc-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
              <span>0%</span>
              <span>15%</span>
              <span>35%</span>
            </div>
          </div>

          {/* Modalités de paiement */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Modalités de Facturation
            </label>
            <textarea
              rows={2}
              value={form.paymentTerms}
              onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
              className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 focus:outline-none focus:border-orange-500 transition"
              placeholder="Ex: 30% à la signature, 40% livraison beta, 30% recette finale."
            />
          </div>

          <div className="p-3 rounded-lg bg-orange-50 border border-orange-100 text-xs text-orange-900 leading-relaxed">
            Cette grille sert de base de calcul automatique pour le tableau d'estimations et l'échéancier du cahier des charges.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
