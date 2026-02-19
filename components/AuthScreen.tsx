
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Lock, User, UserPlus, LogIn, ShieldCheck, AlertCircle, TrendingUp, ChevronLeft, ChevronRight, Globe, BarChart3, Landmark, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { UserAccount } from '../types';

interface AuthScreenProps {
  onLogin: (user: UserAccount) => void;
}

const MARKET_SCENES = [
  {
    id: 'globe',
    title: 'Conectividade Global',
    prompt: 'A futuristic golden terrestrial globe with glowing latitude lines on a dark blue tech background with bokeh lights, cinematic lighting, 8k resolution, premium financial aesthetic.',
    icon: <Globe className="w-4 h-4" />
  },
  {
    id: 'trader',
    title: 'Centro de Inteligência',
    prompt: 'A professional trader from behind looking at a massive wall of financial screens showing world maps and complex candlestick charts, futuristic office, blue and orange lighting, high-tech Bloomberg style.',
    icon: <LayoutDashboard className="w-4 h-4" />
  },
  {
    id: 'strategy',
    title: 'Estratégia de Ativos',
    prompt: 'Macro photography of stacked golden coins on a digital financial chart background, with "BUY" and "SELL" metallic dice, bokeh effect, warm golden and cold blue tones, sharp focus.',
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    id: 'ny_office',
    title: 'Visão de Wall Street',
    prompt: 'Interior of a high-tech glass skyscraper office overlooking a futuristic Chrysler building in New York, massive digital data screens, sleek reflections, dusk lighting.',
    icon: <Landmark className="w-4 h-4" />
  }
];

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [marketImage, setMarketImage] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  const MASTER_ADMIN_PASS = "JCI_MASTER_2025";

  const generateMarketArt = async () => {
    if (isGeneratingImg) return;
    setIsGeneratingImg(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: MARKET_SCENES[currentScene].prompt }]
        }
      });
      
      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setMarketImage(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
    } catch (err) {
      console.error("Erro ao gerar arte IA:", err);
      setError("Falha ao gerar imagem IA. Verifique sua conexão.");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const nextScene = () => {
    setCurrentScene((prev) => (prev + 1) % MARKET_SCENES.length);
    // Nota: marketImage não é resetado para manter a anterior enquanto não gera nova
  };

  const prevScene = () => {
    setCurrentScene((prev) => (prev - 1 + MARKET_SCENES.length) % MARKET_SCENES.length);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const users: UserAccount[] = JSON.parse(localStorage.getItem('jci_db_users') || '[]');

      if (isLogin && username === 'admin_master' && password === MASTER_ADMIN_PASS) {
        const adminObj: UserAccount = { 
          username: 'Master Admin', 
          password: MASTER_ADMIN_PASS, 
          role: 'ADMIN', 
          status: 'APPROVED',
          createdAt: new Date().toISOString()
        };
        onLogin(adminObj);
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
          setError('Credenciais inválidas.');
        } else if (user.status === 'PENDING') {
          setError('Acesso pendente de aprovação pelo Administrador Master.');
        } else if (user.status === 'BLOCKED') {
          setError('Sua conta foi bloqueada.');
        } else {
          onLogin(user);
        }
      } else {
        if (users.find(u => u.username === username)) {
          setError('Usuário já existente.');
        } else {
          const newUser: UserAccount = {
            username,
            password,
            status: 'PENDING',
            role: 'USER',
            createdAt: new Date().toISOString()
          };
          users.push(newUser);
          localStorage.setItem('jci_db_users', JSON.stringify(users));
          setSuccessMsg('Solicitação enviada! Aguarde aprovação do Admin.');
          setIsLogin(true);
        }
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-['Inter'] overflow-hidden">
      <div className="hidden lg:flex w-3/5 relative bg-black border-r border-slate-800 overflow-hidden">
        {marketImage ? (
          <img 
            key={currentScene}
            src={marketImage} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 animate-in fade-in duration-1000" 
            alt="AI Market Scene" 
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
             <div className="text-center p-8 border border-slate-800/50 rounded-[3rem] bg-slate-900/10 backdrop-blur-sm">
                <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Aguardando Comando IA</p>
             </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-amber-500/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <div className="relative z-10 p-16 mt-auto w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex gap-2">
              {MARKET_SCENES.map((_, idx) => (
                <div key={idx} className={`h-1 rounded-full transition-all ${idx === currentScene ? 'w-8 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'w-2 bg-slate-700'}`} />
              ))}
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Modo Manual Ativado</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
              {MARKET_SCENES[currentScene].icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Cenário: {MARKET_SCENES[currentScene].title}</span>
          </div>

          <h2 className="text-6xl font-black text-white leading-[0.9] mb-6 tracking-tighter uppercase">
            A NOVA ERA DA<br /><span className="text-amber-500">INTELIGÊNCIA</span><br />FINANCEIRA
          </h2>

          <div className="flex items-center gap-4 mt-12">
            <button onClick={prevScene} className="p-3 rounded-full border border-white/10 hover:bg-white/10 text-white transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextScene} className="p-3 rounded-full border border-white/10 hover:bg-white/10 text-white transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <button 
              onClick={generateMarketArt}
              disabled={isGeneratingImg}
              className="ml-4 flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isGeneratingImg ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGeneratingImg ? 'Gerando...' : 'Gerar Visão IA'}
            </button>
          </div>
        </div>

        <div className="absolute top-16 right-16 flex flex-col items-end gap-1 opacity-40">
           <span className="text-4xl font-black text-white font-mono">128.450</span>
           <span className="text-xs font-bold text-emerald-500 font-mono">+0.22% IBOV</span>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 relative bg-slate-950">
        <div className="w-full max-w-sm relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500 rounded-2xl shadow-2xl shadow-amber-500/20 mb-6 group hover:rotate-12 transition-transform">
              <LayoutDashboard className="w-7 h-7 text-slate-950" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">PANORAMA JCI</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Ambiente Seguro & Monitorado</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 p-8 rounded-[2.5rem] shadow-2xl relative">
            <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            
            <div className="flex gap-4 mb-8 bg-black/40 p-1 rounded-2xl border border-slate-800">
              <button 
                onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <LogIn className="w-3.5 h-3.5" /> Entrar
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Registrar
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Identificação</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/40 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all placeholder:text-slate-800"
                    placeholder="Nome de usuário"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all placeholder:text-slate-800"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-500 text-[10px] font-black uppercase">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-500 text-[10px] font-black uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  {successMsg}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 py-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-500/10 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Autenticar Acesso' : 'Solicitar Cadastro'}
                    <TrendingUp className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <p className="mt-10 text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
            Security Protocol JCI 7.4.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
