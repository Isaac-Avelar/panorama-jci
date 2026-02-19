
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from './lib/supabase';
import { INITIAL_INDICATORS, MOCK_HISTORY } from './constants';
import { IndicatorData, MonthlyRecord, UserAccount } from './types';
import IndicatorCard from './components/IndicatorCard';
import ComparisonChart from './components/ComparisonChart';
import DataEntryForm from './components/DataEntryForm';
import AutomationSection from './components/AutomationSection';
import TickerTape from './components/TickerTape';
import NewsFeed from './components/NewsFeed';
import AuthScreen from './components/AuthScreen';
import AdminPanel from './components/AdminPanel';
import { 
  LayoutDashboard, 
  Zap, 
  PlusCircle,
  PieChart,
  RefreshCw,
  Terminal as TerminalIcon,
  LogOut,
  ShieldAlert,
  Loader2
} from 'lucide-react';

const STORAGE_KEYS = {
  INDICATORS: 'jci_local_ind',
  HISTORY: 'jci_local_hist'
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [history, setHistory] = useState<Record<string, MonthlyRecord[]>>({});
  const [activeTab, setActiveTab] = useState<'dashboard' | 'automation' | 'admin'>('dashboard');
  const [selectedId, setSelectedId] = useState('');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<{msg: string, type: 'info' | 'success' | 'error'}[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        if (supabase) {
          const { data: indData } = await supabase.from('indicators').select('*').order('id');
          if (indData && indData.length > 0) {
            setIndicators(indData);
            setSelectedId(indData[0].id);
          } else {
            setIndicators(INITIAL_INDICATORS);
            setSelectedId(INITIAL_INDICATORS[0].id);
          }

          const { data: histData } = await supabase.from('history').select('*');
          if (histData) {
            const grouped = histData.reduce((acc: any, curr: any) => {
              if (!acc[curr.indicator_id]) acc[curr.indicator_id] = [];
              acc[curr.indicator_id].push(curr);
              return acc;
            }, {});
            setHistory(grouped);
          } else {
            setHistory(MOCK_HISTORY);
          }
        } else {
          const savedInd = localStorage.getItem(STORAGE_KEYS.INDICATORS);
          const savedHist = localStorage.getItem(STORAGE_KEYS.HISTORY);
          setIndicators(savedInd ? JSON.parse(savedInd) : INITIAL_INDICATORS);
          setHistory(savedHist ? JSON.parse(savedHist) : MOCK_HISTORY);
          setSelectedId(INITIAL_INDICATORS[0].id);
        }
      } catch (e) {
        console.error("Erro na carga de dados:", e);
        setIndicators(INITIAL_INDICATORS);
        setHistory(MOCK_HISTORY);
        setSelectedId(INITIAL_INDICATORS[0].id);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const activeIndicator = useMemo(() => 
    indicators.find(i => i.id === selectedId) || indicators[0]
  , [indicators, selectedId]);

  // Sync logic using Gemini 3 and Google Search grounding
  const syncWithMarket = async () => {
    if (isSyncing || !selectedId) return;
    setIsSyncing(true);
    setShowTerminal(true);
    setSyncLogs([{msg: `[${new Date().toLocaleTimeString()}] Consultando Inteligência de Mercado...`, type: 'info'}]);

    try {
      // Use process.env.API_KEY directly when initializing the @google/genai client instance
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Qual o valor numérico RECENTE e exato do indicador econômico "${activeIndicator.name}" (${activeIndicator.region})? Responda apenas o número bruto.`,
        config: { 
          tools: [{ googleSearch: {} }] 
        },
      });

      const textOutput = response.text || '';
      // Attempt to find a numeric value in the potentially non-JSON response text
      const numericMatch = textOutput.match(/[-+]?\d*\.?\d+/);
      const value = numericMatch ? parseFloat(numericMatch[0]) : null;

      if (value !== null) {
        const updated = indicators.map(ind => ind.id === selectedId ? { 
          ...ind, 
          currentValue: value, 
          previousValue: ind.currentValue,
          trend: value > ind.currentValue ? 'up' : 'down'
        } : ind);
        
        setIndicators(updated as IndicatorData[]);
        
        if (supabase) {
          await supabase.from('indicators').update({ 
            current_value: value, 
            previous_value: activeIndicator.currentValue,
            trend: value > activeIndicator.currentValue ? 'up' : 'down'
          }).eq('id', selectedId);
        } else {
          localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(updated));
        }

        setSyncLogs(prev => [...prev, {msg: `Sucesso: Valor ${value} detectado.`, type: 'success'}]);
        
        // Extract website URLs from groundingChunks and list them as required by search grounding rules
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sourceUrls = chunks
          .filter((chunk: any) => chunk.web)
          .map((chunk: any) => chunk.web.uri);
          
        if (sourceUrls.length > 0) {
          setSyncLogs(prev => [...prev, {msg: `Fontes: ${sourceUrls.join(' | ')}`, type: 'info'}]);
        }
      } else {
        setSyncLogs(prev => [...prev, {msg: "Não foi possível extrair um valor numérico válido da análise.", type: 'error'}]);
      }
    } catch (err) {
      setSyncLogs(prev => [...prev, {msg: "Falha na sincronização via API. Verifique sua chave API.", type: 'error'}]);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setShowTerminal(false), 15000); // Longer timeout to allow source reading
    }
  };

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('jci_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jci_session');
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
        </div>
        <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Iniciando JCI Terminal...</p>
      </div>
    );
  }

  if (!currentUser) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="app-height bg-slate-950 text-slate-200 flex flex-col relative overflow-hidden">
      <div className="hidden md:block">
        <TickerTape />
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        <nav className="hidden md:flex w-20 lg:w-64 border-r border-slate-900 flex-col items-center py-8 bg-slate-950 shrink-0">
          <div className="flex items-center gap-3 px-6 mb-12">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <LayoutDashboard className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter hidden lg:block uppercase">JCI TERMINAL</span>
          </div>

          <div className="flex-1 w-full space-y-2 px-3">
            {[
              { id: 'dashboard', icon: PieChart, label: 'Dashboard' },
              { id: 'automation', icon: Zap, label: 'Estratégia IA' },
              { id: 'admin', icon: ShieldAlert, label: 'Admin Master', adminOnly: true }
            ].map((item) => (
              (!item.adminOnly || currentUser.role === 'ADMIN') && (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="font-bold text-sm hidden lg:block uppercase tracking-widest">{item.label}</span>
                </button>
              )
            ))}
          </div>

          <div className="mt-auto px-4 w-full">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all font-black text-[10px] uppercase tracking-widest">
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:block">Desconectar</span>
            </button>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-8">
          <div className="p-4 md:p-12 max-w-7xl mx-auto w-full space-y-8 animate-fade">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">PANORAMA JCI</h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic">Terminal de Inteligência Econômica</p>
              </div>
              <button 
                onClick={syncWithMarket}
                disabled={isSyncing}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-amber-500 text-slate-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/10"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Atualizar com IA'}
              </button>
            </header>

            {activeTab === 'dashboard' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {indicators.map((ind) => (
                    <IndicatorCard key={ind.id} data={ind} isActive={selectedId === ind.id} onClick={() => { setSelectedId(ind.id); }} />
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-4 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-bold text-white uppercase tracking-tight">{activeIndicator?.name}</h2>
                       <button onClick={() => setShowEntryModal(true)} className="p-3 bg-slate-800 text-white rounded-xl active:scale-90 transition-transform"><PlusCircle className="w-6 h-6" /></button>
                    </div>
                    <div className="h-[300px] md:h-[450px]">
                      <ComparisonChart data={history[selectedId] || []} indicatorName={activeIndicator?.name || ''} unit={activeIndicator?.unit || ''} />
                    </div>
                  </div>
                  <NewsFeed indicator={activeIndicator} />
                </div>
              </>
            ) : activeTab === 'automation' ? (
              <AutomationSection />
            ) : <AdminPanel />}
          </div>
        </main>
      </div>

      {showTerminal && (
        <div className="fixed bottom-24 md:bottom-8 right-4 left-4 md:left-auto md:w-80 bg-black/95 border border-slate-800 rounded-2xl p-4 shadow-2xl z-[60] overflow-hidden">
           <div className="max-h-60 overflow-y-auto custom-scrollbar">
             {syncLogs.map((log, i) => (
               <p key={i} className={`text-[10px] font-mono mb-1 break-words ${log.type === 'error' ? 'text-rose-500' : log.type === 'success' ? 'text-emerald-500' : 'text-slate-400'}`}>{log.msg}</p>
             ))}
           </div>
        </div>
      )}

      {showEntryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl bg-slate-900 rounded-[3rem] p-8 shadow-2xl">
            <DataEntryForm indicator={activeIndicator} onSave={() => setShowEntryModal(false)} onCancel={() => setShowEntryModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
