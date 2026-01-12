
import React, { useState, useEffect } from 'react';
import { Measurement, UserGoals, FoodEntry } from './types';
import { getMotivationalMessage, getEasyWinSuggestion } from './services/geminiService';
import MeasurementForm from './components/MeasurementForm';
import GoalSetter from './components/GoalSetter';
import ProgressDashboard from './components/ProgressDashboard';
import FoodLogger from './components/FoodLogger';

const DEFAULT_GOALS: UserGoals = {
  intermediate: {
    weightLbs: 170,
    bodyFatPercent: 20,
    visceralFat: 8,
    leanMassLbs: 145,
    waistCm: 90
  },
  final: {
    weightLbs: 160,
    bodyFatPercent: 15,
    visceralFat: 5,
    leanMassLbs: 150,
    waistCm: 80
  },
  profile: {
    objective: 'Perder Grasa',
    conditions: 'Ninguna',
    age: 30,
    sex: 'Masculino',
    heightCm: 170
  }
};

const App: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [motivation, setMotivation] = useState<string>("¡Bienvenido! Registra tu perfil en Ajustes para un análisis preciso de BMI y salud.");
  const [easyWin, setEasyWin] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'food' | 'entry' | 'settings'>('dashboard');

  useEffect(() => {
    const savedMeasurements = localStorage.getItem('fitfocus_measurements');
    const savedGoals = localStorage.getItem('fitfocus_goals');
    const savedFood = localStorage.getItem('fitfocus_food');
    if (savedMeasurements) setMeasurements(JSON.parse(savedMeasurements));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedFood) setFoodEntries(JSON.parse(savedFood));
  }, []);

  useEffect(() => {
    if (measurements.length > 0) {
      localStorage.setItem('fitfocus_measurements', JSON.stringify(measurements));
      detectStagnation();
    }
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem('fitfocus_food', JSON.stringify(foodEntries));
  }, [foodEntries]);

  useEffect(() => {
    localStorage.setItem('fitfocus_goals', JSON.stringify(goals));
  }, [goals]);

  const detectStagnation = async () => {
    if (measurements.length < 3) return;
    
    const last3 = measurements.slice(-3);
    const weightTrend = last3[2].weightLbs - last3[0].weightLbs;

    if ((goals.profile.objective === 'Perder Grasa' && weightTrend >= -0.1) || weightTrend > 2) {
      if (!easyWin) {
        const res = await getEasyWinSuggestion('Peso/Grasa', weightTrend > 0 ? 'Retroceso' : 'Estancamiento', goals.profile);
        setEasyWin(res);
      }
    } else {
      setEasyWin(null);
    }
  };

  const handleAddMeasurement = async (newM: Omit<Measurement, 'id'>) => {
    const measurementWithId: Measurement = { ...newM, id: crypto.randomUUID() };
    const currentHistory = [...measurements];
    setMeasurements(prev => [...prev, measurementWithId]);
    setActiveTab('dashboard');
    
    setIsAiLoading(true);
    try {
      const msg = await getMotivationalMessage(measurementWithId, currentHistory, goals.intermediate, goals.final, goals.profile);
      setMotivation(msg);
    } catch (e) {
      setMotivation("Buen trabajo hoy. Sigue así.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddFood = (entry: Omit<FoodEntry, 'id' | 'date'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    setFoodEntries(prev => [...prev, newEntry]);
  };

  const handleUpdateGoals = (newGoals: UserGoals) => {
    setGoals(newGoals);
    alert("Perfil de salud actualizado.");
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl shadow-slate-200">
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 leading-tight">FitFocus</h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{goals.profile.objective}</p>
          </div>
        </div>
        <button onClick={() => setActiveTab('settings')} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 active:scale-90 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </button>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 pb-28 overflow-y-auto scrollbar-hide">
        
        {easyWin && activeTab === 'dashboard' && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-[2.5rem] shadow-sm animate-in zoom-in duration-500">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl animate-bounce">🔥</span>
              <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Hack de Motivación</h4>
            </div>
            <p className="text-amber-900 text-sm font-bold leading-tight">"{easyWin}"</p>
            <p className="text-[9px] text-amber-700 mt-2 font-medium opacity-80 italic">Pequeñas victorias, grandes cambios.</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] scale-150 rotate-12 transition-transform duration-1000">
             <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 17h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <div className="flex gap-4">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-xl shadow-indigo-100 relative">
              <span className="text-xl">🤖</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Entrenador IA</p>
              {isAiLoading ? (
                <div className="space-y-2 py-1">
                  <div className="h-3 w-full bg-slate-50 animate-pulse rounded-full"></div>
                  <div className="h-3 w-4/5 bg-slate-50 animate-pulse rounded-full"></div>
                </div>
              ) : (
                <p className="text-slate-700 text-sm leading-relaxed font-bold italic">
                  "{motivation}"
                </p>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProgressDashboard measurements={measurements} goals={goals} />
          </div>
        )}
        
        {activeTab === 'food' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FoodLogger entries={foodEntries} profile={goals.profile} onAdd={handleAddFood} />
          </div>
        )}
        
        {activeTab === 'entry' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <MeasurementForm onAdd={handleAddMeasurement} />
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <GoalSetter currentGoals={goals} onUpdate={handleUpdateGoals} />
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-3xl border-t border-slate-100 px-4 py-3 flex justify-between items-center z-30 pb-7 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 w-1/4 transition-all ${activeTab === 'dashboard' ? 'text-blue-600 scale-110' : 'text-slate-300'}`}>
          <div className={`p-2.5 rounded-xl ${activeTab === 'dashboard' ? 'bg-blue-50' : ''}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Panel</span>
        </button>

        <button onClick={() => setActiveTab('food')} className={`flex flex-col items-center gap-1 w-1/4 transition-all ${activeTab === 'food' ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}>
          <div className={`p-2.5 rounded-xl ${activeTab === 'food' ? 'bg-emerald-50' : ''}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Comida</span>
        </button>

        <div className="w-1/4 flex justify-center -mt-14">
          <button 
            onClick={() => setActiveTab('entry')} 
            className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-300 active:scale-90 transition-all border-4 border-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>

        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 w-1/4 transition-all ${activeTab === 'settings' ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}>
          <div className={`p-2.5 rounded-xl ${activeTab === 'settings' ? 'bg-indigo-50' : ''}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Ajustes</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
