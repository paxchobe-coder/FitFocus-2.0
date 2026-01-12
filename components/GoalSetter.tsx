
import React, { useState } from 'react';
import { UserGoals, Goal, HealthObjective, Sex } from '../types';

interface GoalSetterProps {
  currentGoals: UserGoals;
  onUpdate: (goals: UserGoals) => void;
}

const GoalSetter: React.FC<GoalSetterProps> = ({ currentGoals, onUpdate }) => {
  const [goals, setGoals] = useState<UserGoals>(currentGoals);

  const handleChange = (type: 'intermediate' | 'final', field: keyof Goal, value: string) => {
    setGoals(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleProfileChange = (field: keyof UserGoals['profile'], value: any) => {
    setGoals(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Health Profile Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Perfil de Salud</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Edad</label>
              <input
                type="number"
                value={goals.profile.age}
                onChange={(e) => handleProfileChange('age', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Estatura (cm)</label>
              <input
                type="number"
                value={goals.profile.heightCm}
                onChange={(e) => handleProfileChange('heightCm', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-700 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Sexo</label>
            <div className="flex gap-2">
              {(['Masculino', 'Femenino', 'Otro'] as Sex[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleProfileChange('sex', s)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${goals.profile.sex === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Objetivo Principal</label>
            <div className="grid grid-cols-2 gap-2">
              {['Perder Grasa', 'Ganar Músculo', 'Mantenimiento', 'Salud General'].map((obj) => (
                <button
                  key={obj}
                  onClick={() => handleProfileChange('objective', obj as HealthObjective)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${goals.profile.objective === obj ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Condiciones de Salud</label>
            <input
              type="text"
              value={goals.profile.conditions}
              onChange={(e) => handleProfileChange('conditions', e.target.value)}
              className="w-full bg-slate-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-700 outline-none"
              placeholder="Ej: Ninguna, Hígado Graso..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Medidas Objetivo</h3>
          <button
            onClick={() => onUpdate(goals)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-emerald-100"
          >
            Guardar Todo
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">1</span>
              Próximo Hito (Intermedio)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(goals.intermediate) as Array<keyof Goal>).map((key) => (
                <div key={`int-${key}`}>
                  <label className="block text-[10px] text-slate-400 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="number"
                    value={goals.intermediate[key]}
                    onChange={(e) => handleChange('intermediate', key, e.target.value)}
                    className="w-full text-sm font-bold bg-slate-50 px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">2</span>
              Visión Final (Objetivo)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(goals.final) as Array<keyof Goal>).map((key) => (
                <div key={`fin-${key}`}>
                  <label className="block text-[10px] text-slate-400 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="number"
                    value={goals.final[key]}
                    onChange={(e) => handleChange('final', key, e.target.value)}
                    className="w-full text-sm font-bold bg-slate-50 px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSetter;
