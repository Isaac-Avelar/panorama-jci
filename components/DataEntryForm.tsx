
import React, { useState } from 'react';
import { IndicatorData } from '../types';
import { MONTHS } from '../constants';
import { Save, X } from 'lucide-react';

interface DataEntryFormProps {
  indicator: IndicatorData;
  onSave: (month: string, value: number) => void;
  onCancel: () => void;
}

const DataEntryForm: React.FC<DataEntryFormProps> = ({ indicator, onSave, onCancel }) => {
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === '') return;
    onSave(month, parseFloat(value));
  };

  return (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Inserir Dados: {indicator.name}</h3>
          <p className="text-slate-400 text-sm mt-1">{indicator.description}</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Mês de Referência (2026)</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              {MONTHS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Valor Atual ({indicator.unit})</label>
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Ex: ${indicator.currentValue}`}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white font-mono focus:outline-none focus:border-indigo-500 transition-colors"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            Salvar Registro
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataEntryForm;
