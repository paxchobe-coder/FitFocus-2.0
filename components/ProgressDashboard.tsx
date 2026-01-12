
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Measurement, UserGoals, MetricKey, METRIC_LABELS } from '../types';

interface ProgressDashboardProps {
  measurements: Measurement[];
  goals: UserGoals;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ measurements, goals }) => {
  const chartData = measurements.map(m => ({
    ...m,
    dateLabel: new Date(m.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  }));

  const latest = measurements[measurements.length - 1];
  const first = measurements[0];

  const calculateBMI = (weightLbs: number, heightCm: number) => {
    if (!heightCm) return 0;
    const weightKg = weightLbs * 0.453592;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-emerald-400' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-amber-400' };
    return { label: 'Obesidad', color: 'text-rose-400' };
  };

  const bmi = latest ? calculateBMI(latest.weightLbs, goals.profile.heightCm) : 0;
  const bmiInfo = getBMICategory(bmi);

  const renderMetricChart = (metric: MetricKey, color: string, gradientId: string) => {
    return (
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4 px-2">
          <h4 className="text-sm font-bold text-slate-700">{METRIC_LABELS[metric]}</h4>
          <span className="text-xs font-medium text-slate-400">Tendencia</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="dateLabel" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8'}}
                minTickGap={20}
              />
              <YAxis 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8'}}
                domain={['auto', 'auto']} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey={metric} 
                stroke={color} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill={`url(#${gradientId})`}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const getProgress = (current: number, start: number, goal: number) => {
    if (start === goal) return 100;
    const totalDiff = start - goal;
    const currentDiff = start - current;
    const percentage = (currentDiff / totalDiff) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* BMI & Resumen Card */}
      <div className="grid grid-cols-1 gap-4">
        {latest && (
          <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Estado Físico Actual</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{bmi.toFixed(1)}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest ${bmiInfo.color}`}>{bmiInfo.label}</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-1 font-bold uppercase tracking-tighter">Índice de Masa Corporal (BMI)</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                ⚖️
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-white/10 pt-6">
              <div className="border-l-2 border-blue-500 pl-3">
                <p className="text-2xl font-black">{latest.weightLbs}<span className="text-xs font-medium opacity-50 ml-1">lbs</span></p>
                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Peso</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-3">
                <p className="text-2xl font-black">{latest.bodyFatPercent}<span className="text-xs font-medium opacity-50 ml-1">%</span></p>
                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Grasa Corp.</p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3">
                <p className="text-xl font-black">{latest.leanMassLbs}<span className="text-xs font-medium opacity-50 ml-1">lbs</span></p>
                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Masa Magra</p>
              </div>
              <div className="border-l-2 border-purple-500 pl-3">
                <p className="text-xl font-black">{latest.waistCm}<span className="text-xs font-medium opacity-50 ml-1">cm</span></p>
                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Cintura</p>
              </div>
            </div>
          </div>
        )}

        {latest && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Progreso hacia la Meta Final</h3>
            <div className="grid grid-cols-1 gap-5">
              {(['weightLbs', 'bodyFatPercent', 'waistCm'] as MetricKey[]).map(metric => {
                const progress = getProgress(latest[metric], first[metric], goals.final[metric]);
                return (
                  <div key={metric} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase">{METRIC_LABELS[metric]}</span>
                      <span className="text-sm font-black text-blue-600">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-50 rounded-full h-2.5 overflow-hidden border border-slate-100">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Gráficos Detallados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderMetricChart('weightLbs', '#3b82f6', 'colorWeight')}
        {renderMetricChart('bodyFatPercent', '#f59e0b', 'colorFat')}
        {renderMetricChart('waistCm', '#10b981', 'colorWaist')}
        {renderMetricChart('leanMassLbs', '#8b5cf6', 'colorLean')}
      </div>
    </div>
  );
};

export default ProgressDashboard;
