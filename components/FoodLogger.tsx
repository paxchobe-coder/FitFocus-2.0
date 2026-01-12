
import React, { useState, useEffect } from 'react';
import { FoodEntry, MealType, HealthProfile } from '../types';
import { getFoodSuggestion, analyzeDiet } from '../services/geminiService';

interface FoodLoggerProps {
  entries: FoodEntry[];
  profile: HealthProfile;
  onAdd: (entry: Omit<FoodEntry, 'id' | 'date'>) => void;
}

const FoodLogger: React.FC<FoodLoggerProps> = ({ entries, profile, onAdd }) => {
  const [description, setDescription] = useState('');
  const [mealType, setMealType] = useState<MealType>('Desayuno');
  const [suggestion, setSuggestion] = useState('');
  const [dietAnalysis, setDietAnalysis] = useState('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    let currentMeal: MealType = 'Snack';
    if (hour >= 5 && hour < 10) currentMeal = 'Desayuno';
    else if (hour >= 11 && hour < 15) currentMeal = 'Almuerzo';
    else if (hour >= 18 && hour < 22) currentMeal = 'Cena';
    
    setMealType(currentMeal);
    fetchSuggestion(currentMeal);
  }, [profile]);

  const fetchSuggestion = async (type: MealType) => {
    setLoadingSuggestion(true);
    const res = await getFoodSuggestion(type, profile);
    setSuggestion(res);
    setLoadingSuggestion(false);
  };

  const handleAdd = () => {
    if (!description.trim()) return;
    onAdd({ type: mealType, description });
    setDescription('');
  };

  const todayEntries = entries.filter(e => 
    new Date(e.date).toDateString() === new Date().toDateString()
  );

  const triggerAnalysis = async () => {
    if (todayEntries.length === 0) return;
    const res = await analyzeDiet(todayEntries, profile);
    setDietAnalysis(res);
  };

  return (
    <div className="space-y-6">
      {/* Suggestion Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1">Plan Nutricional: {profile.conditions}</p>
        <h4 className="text-xl font-black mb-3 leading-tight">Sugerencia para tu {mealType}</h4>
        {loadingSuggestion ? (
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/20 animate-pulse rounded-full"></div>
            <div className="h-3 w-4/5 bg-white/20 animate-pulse rounded-full"></div>
          </div>
        ) : (
          <p className="text-sm font-medium leading-relaxed text-blue-50/90 italic">
            "{suggestion}"
          </p>
        )}
      </div>

      {/* Entry Form */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          Registro de Alimentos
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Desayuno', 'Almuerzo', 'Cena', 'Snack'].map((t) => (
              <button
                key={t}
                onClick={() => setMealType(t as MealType)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${mealType === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-slate-700 text-sm font-medium outline-none h-28"
            placeholder="Ej: Tres pupusas de loroco con poco aceite, curtido y café sin azúcar..."
          />
          <button
            onClick={handleAdd}
            disabled={!description.trim()}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl active:scale-95 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            Añadir a mi dieta
          </button>
        </div>
      </div>

      {/* Today's Log */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Comidas de Hoy</h3>
          <button 
            onClick={triggerAnalysis} 
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline active:scale-95 transition-transform"
          >
            Analizar Hoy
          </button>
        </div>
        
        {dietAnalysis && (
          <div className="bg-blue-50/50 p-5 rounded-[1.5rem] border border-blue-100 text-blue-800 text-xs font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex gap-2 mb-1">
              <span className="text-base">🔬</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Análisis Nutricional</span>
            </div>
            {dietAnalysis}
          </div>
        )}

        <div className="space-y-3">
          {todayEntries.length > 0 ? todayEntries.map(e => (
            <div key={e.id} className="bg-white p-4 rounded-2xl border border-slate-50 flex items-center gap-4 shadow-sm group hover:border-blue-100 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl group-hover:bg-blue-50 transition-colors">
                {e.type === 'Desayuno' ? '🍳' : e.type === 'Almuerzo' ? '🍱' : e.type === 'Cena' ? '🥗' : '🍎'}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{e.type}</p>
                <p className="text-sm font-bold text-slate-700">{e.description}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <p className="text-slate-300 text-sm italic font-medium">No has registrado alimentos hoy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodLogger;
