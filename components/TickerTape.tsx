
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity, RefreshCw, Clock, Globe, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
  category?: string;
}

interface MarketSource {
  title: string;
  uri: string;
}

const STORAGE_KEY = 'econo_terminal_ticker_smart_v2';

const INITIAL_TICKERS: TickerItem[] = [
  { category: 'AMÉRICA', symbol: 'S&P 500', price: '5,985.40', change: '+0.12%', isUp: true },
  { symbol: 'NASDAQ', price: '19,250.60', change: '+0.45%', isUp: true },
  { symbol: 'IBOVESPA', price: '128,450', change: '+0.22%', isUp: true },
  { category: 'MOEDAS', symbol: 'DXY', price: '106.42', change: '+0.15%', isUp: true },
  { symbol: 'USD/BRL', price: '5.7822', change: '+0.34%', isUp: true },
  { category: 'CRIPTOS', symbol: 'BTC/USD', price: '96,420.00', change: '+2.40%', isUp: true },
  { category: 'ENERGIA', symbol: 'BRENT', price: '75.25', change: '-0.70%', isUp: false },
];

const TickerTape: React.FC = () => {
  const [tickers, setTickers] = useState<TickerItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TICKERS;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(() => {
    const savedDate = localStorage.getItem(`${STORAGE_KEY}_time`);
    return savedDate || new Date().toLocaleTimeString();
  });
  const [marketSources, setMarketSources] = useState<MarketSource[]>([]);
  const [showSourcesPanel, setShowSourcesPanel] = useState(false);

  const tickersRef = useRef(tickers);
  useEffect(() => {
    tickersRef.current = tickers;
  }, [tickers]);

  const syncMarketPrices = useCallback(async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setMarketSources([]);
    try {
      // Create new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const symbolsList = tickersRef.current.map(t => t.symbol).join(', ');
      
      const prompt = `Aja como o módulo de Sincronização de Mercado do terminal PANORAMA JCI. Utilize o Google Search para encontrar os preços atuais REAIS de hoje para: ${symbolsList}. 
      Retorne o resultado no formato JSON puro: {"Nome do Ativo": "Preço"}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }] 
        },
      });

      let jsonStr = (response.text || '{}').trim();
      // Handle potential markdown backticks in response
      if (jsonStr.includes('{')) {
        jsonStr = jsonStr.substring(jsonStr.indexOf('{'), jsonStr.lastIndexOf('}') + 1);
      }
      
      try {
        const updatedData = JSON.parse(jsonStr);
        setTickers(prev => {
          const next = prev.map(item => {
            const rawNewPrice = updatedData[item.symbol];
            if (rawNewPrice) {
              const oldVal = parseFloat(item.price.replace(/,/g, '').replace('%', ''));
              const newVal = parseFloat(rawNewPrice.toString().replace(/,/g, '').replace('%', ''));
              return {
                ...item,
                price: rawNewPrice.toString(),
                isUp: newVal >= oldVal,
                change: oldVal === 0 ? '0.00%' : `${newVal > oldVal ? '+' : ''}${(((newVal - oldVal) / oldVal) * 100).toFixed(2)}%`
              };
            }
            return item;
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });

        // Always extract URLs from groundingChunks and list them as per guidelines
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const foundSources = chunks
          .filter((chunk: any) => chunk.web)
          .map((chunk: any) => ({
            title: chunk.web.title || "Market Data Source",
            uri: chunk.web.uri
          }));
        
        setMarketSources(foundSources);
        if (foundSources.length > 0) {
          setShowSourcesPanel(true);
          setTimeout(() => setShowSourcesPanel(false), 8000);
        }

        const now = new Date().toLocaleTimeString();
        setLastUpdate(now);
        localStorage.setItem(`${STORAGE_KEY}_time`, now);
      } catch (parseErr) {
        console.error("Erro ao processar dados da IA:", parseErr);
      }
    } catch (err: any) {
      console.error("Erro na Sincronização de Mercado:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      setTickers(prev => prev.map(item => {
        if (Math.random() > 0.98) {
          const val = parseFloat(item.price.replace(/,/g, '').replace('%', ''));
          const move = (Math.random() - 0.5) * (val * 0.0001);
          const newVal = val + move;
          return { ...item, price: newVal.toLocaleString('en-US', { minimumFractionDigits: 2 }) };
        }
        return item;
      }));
    }, 4000);
    return () => clearInterval(tickInterval);
  }, []);

  return (
    <div className="w-full bg-slate-950 border-b border-slate-900 overflow-hidden h-10 flex items-center relative z-50">
      <div className="absolute left-0 top-0 bottom-0 bg-slate-950 px-4 flex items-center gap-3 border-r border-slate-900 z-20 shadow-[8px_0_15px_rgba(0,0,0,0.9)]">
        <Activity className={`w-3.5 h-3.5 ${isSyncing ? 'text-amber-500 animate-spin' : 'text-slate-600'}`} />
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Market Intelligence</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="w-2 h-2 text-slate-700" />
            <span className="text-[7px] font-bold text-slate-700 uppercase tabular-nums">{lastUpdate}</span>
          </div>
        </div>
        <button 
          onClick={syncMarketPrices}
          disabled={isSyncing}
          className={`ml-1 flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-800 transition-all ${isSyncing ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-slate-900/50 hover:bg-slate-800 text-amber-500/80 hover:text-amber-500'}`}
        >
          <RefreshCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="text-[8px] font-black uppercase tracking-tighter">{isSyncing ? 'SYNCING...' : 'Update'}</span>
        </button>

        {showSourcesPanel && marketSources.length > 0 && (
          <div className="absolute top-10 left-0 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-300 z-50 min-w-[250px]">
            <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest border-b border-slate-800 pb-1">Fontes Verificadas:</p>
            <div className="flex flex-col gap-1.5">
              {marketSources.slice(0, 3).map((s, i) => (
                <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[8px] text-amber-500 hover:text-white truncate flex items-center gap-2 uppercase font-bold transition-colors">
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" /> {s.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex animate-scroll whitespace-nowrap pl-64">
        {[...tickers, ...tickers].map((item, idx) => (
          <React.Fragment key={idx}>
            {item.category && (
              <div className="inline-flex items-center px-4 bg-slate-900/40 h-full border-x border-slate-900/30">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] italic">
                   {item.category}
                </span>
              </div>
            )}
            <div className="inline-flex items-center gap-2.5 px-6 border-r border-slate-900/20 h-6">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{item.symbol}</span>
              <span className="text-xs font-mono font-bold text-white tracking-tighter">{item.price}</span>
              <div className={`flex items-center gap-0.5 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${item.isUp ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/5'}`}>
                {item.isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {item.change}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 150s linear infinite; }
        .animate-scroll:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default TickerTape;
