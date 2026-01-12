
import React, { useState } from 'react';
import { Measurement } from '../types';

interface MeasurementFormProps {
  onAdd: (measurement: Omit<Measurement, 'id'>) => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    weightLbs: '',
    bodyFatPercent: '',
    visceralFat: '',
    leanMassLbs: '',
    waistCm: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      date: new Date().toISOString(),
      weightLbs: parseFloat(formData.weightLbs),
      bodyFatPercent: parseFloat(formData.bodyFatPercent),
      visceralFat: parseFloat(formData.visceralFat),
      leanMassLbs: parseFloat(formData.leanMassLbs),
      waistCm: parseFloat(formData.waistCm)
    });
    setFormData({
      weightLbs: '',
      bodyFatPercent: '',
      visceralFat: '',
      leanMassLbs: '',
      waistCm: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg">+</div>
        <h3 className="text-lg font-black text-slate-800">Nueva Entrada</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Peso (lbs)</label>
          <input
            type="number"
            step="0.1"
            name="weightLbs"
            inputMode="decimal"
            value={formData.weightLbs}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-lg font-bold text-slate-700 outline-none"
            placeholder="0.0"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Grasa (%)</label>
          <input
            type="number"
            step="0.1"
            name="bodyFatPercent"
            inputMode="decimal"
            value={formData.bodyFatPercent}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-lg font-bold text-slate-700 outline-none"
            placeholder="0.0"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Visceral</label>
          <input
            type="number"
            step="1"
            name="visceralFat"
            inputMode="numeric"
            value={formData.visceralFat}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-lg font-bold text-slate-700 outline-none"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Magro (lbs)</label>
          <input
            type="number"
            step="0.1"
            name="leanMassLbs"
            inputMode="decimal"
            value={formData.leanMassLbs}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-lg font-bold text-slate-700 outline-none"
            placeholder="0.0"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Barriga (cm)</label>
          <input
            type="number"
            step="0.1"
            name="waistCm"
            inputMode="decimal"
            value={formData.waistCm}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-lg font-bold text-slate-700 outline-none"
            placeholder="0.0"
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 active:scale-95 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all uppercase tracking-widest text-sm"
      >
        Guardar Medidas
      </button>
    </form>
  );
};

export default MeasurementForm;
