
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { IndicatorData } from '../types';
import { Newspaper, RefreshCcw, ExternalLink, Loader2, AlertTriangle, Zap, Search } from 'lucide-react';

interface NewsFeedProps {
  indicator: IndicatorData;
}

interface NewsItem {
  text: string;
  sources: { title: string; uri: string }[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ indicator }) => {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // IMPORTANTE: Resetar o estado ao trocar de indicador para forçar o comando manual
  useEffect(() => {
    setNews(null);
    setError(null);
    setQuotaExceeded(false);
  }, [indicator.id]);

  const fetchNews = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setQuotaExceeded(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Traga as 3 notícias mais recentes e relevantes sobre o indicador econômico "${indicator.name}" (${indicator.region}). 
      Seja conciso e técnico. Use o Google Search para garantir atualidade absoluta (dados de 2025/2026).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] },
      });

      const text = (response.text || "Nenhuma notícia encontrada.").trim();
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title || "Fonte",
          uri: chunk.web.uri
        }));

      setNews({ text, sources });
    } catch (err: any) {
      if (err?.message?.includes('429')) {
        setQuotaExceeded(true);
        setError("Limite de cota de IA atingido.");
      } else {
        setError("Erro ao carregar notícias.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Zap className="w-3 h-3 text-amber-500" />
          IA Market Intelligence
        </h3>
        <button 
          onClick={fetchNews}
          disabled={loading}
          className={`p-1.5 rounded-lg transition-all ${loading ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          title="Buscar notícias com IA"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="min-h-[120px] relative flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-slate-600 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500/50" />
            <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Consultando Mercado Global...</span>
          </div>
        ) : quotaExceeded ? (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 bg-rose-500/5 border border-rose-500/20 rounded-xl w-full">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <p className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">Cota Excedida</p>
            <p className="text-[10px] text-slate-500">O limite de chamadas gratuitas foi atingido. Tente em 1 minuto.</p>
          </div>
        ) : news ? (
          <div className="space-y-4 animate-in fade-in duration-500 w-full">
            <div className="text-xs leading-relaxed text-slate-300 font-medium prose prose-invert max-w-none">
              {news.text.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
            
            {news.sources.length > 0 && (
              <div className="pt-4 border-t border-slate-800/50">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fontes Verificadas:</p>
                <div className="flex flex-wrap gap-2">
                  {news.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-amber-500 hover:text-white transition-all"
                    >
                      <span className="truncate max-w-[120px] font-bold uppercase">{source.title}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 flex flex-col items-center gap-4 group">
             <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                <Search className="w-5 h-5 text-slate-600 group-hover:text-amber-500" />
             </div>
             <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Clique no botão acima para buscar análises IA</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
