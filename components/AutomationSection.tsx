
import React from 'react';
import { AUTOMATION_STEPS } from '../constants';
import { Bot, Code, Cpu, Database, Layout, MessageSquare, ExternalLink, Copy } from 'lucide-react';

const icons = [Code, Cpu, Database, MessageSquare, Bot, Layout];

const AutomationSection: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Prompt copiado para a área de transferência!');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Automação com IA</h2>
          <p className="text-slate-400 mt-2 max-w-2xl text-lg">
            Aprenda a transformar seu fluxo de trabalho manual em um pipeline automatizado de inteligência econômica em 6 etapas.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
          <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Arquitetura de Agentes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {AUTOMATION_STEPS.map((step, index) => {
          const Icon = icons[index];
          return (
            <div key={step.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all duration-300">
              <div className="absolute -right-4 -top-4 text-8xl font-black text-slate-800/10 group-hover:text-indigo-500/5 transition-colors pointer-events-none">
                0{step.id}
              </div>
              
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-indigo-500 text-xs font-black uppercase tracking-[0.2em]">Passo {step.id}</span>
                    <h3 className="text-2xl font-bold text-white mt-1">{step.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Ferramenta:</span>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">{step.tool}</span>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prompt Sugerido</span>
                      <button 
                        onClick={() => copyToClipboard(step.prompt)}
                        className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500 hover:text-white transition-all"
                        title="Copiar prompt"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <code className="block text-xs text-indigo-300/80 leading-relaxed font-mono italic">
                      "{step.prompt}"
                    </code>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-10 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">Pronto para escalar seu terminal?</h3>
        <p className="text-slate-400 max-w-xl mx-auto">
          Ao integrar estas 6 camadas, você reduz o tempo de coleta de 2 horas diárias para 0, permitindo focar 100% na análise estratégica e execução de trades.
        </p>
        <button className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-white/5">
          Baixar Blueprint Completo
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AutomationSection;
