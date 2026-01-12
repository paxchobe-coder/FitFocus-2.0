
export interface Measurement {
  id: string;
  date: string;
  weightLbs: number;
  bodyFatPercent: number;
  visceralFat: number;
  leanMassLbs: number;
  waistCm: number;
}

export type MealType = 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';

export interface FoodEntry {
  id: string;
  date: string;
  type: MealType;
  description: string;
}

export type HealthObjective = 'Perder Grasa' | 'Ganar Músculo' | 'Mantenimiento' | 'Salud General';
export type Sex = 'Masculino' | 'Femenino' | 'Otro';

export interface HealthProfile {
  objective: HealthObjective;
  conditions: string;
  age: number;
  sex: Sex;
  heightCm: number;
}

export interface Goal {
  weightLbs: number;
  bodyFatPercent: number;
  visceralFat: number;
  leanMassLbs: number;
  waistCm: number;
}

export interface UserGoals {
  intermediate: Goal;
  final: Goal;
  profile: HealthProfile;
}

export type MetricKey = keyof Goal;

export const METRIC_LABELS: Record<MetricKey, string> = {
  weightLbs: 'Peso (lbs)',
  bodyFatPercent: 'Grasa Corporal (%)',
  visceralFat: 'Grasa Visceral',
  leanMassLbs: 'Peso Magro (lbs)',
  waistCm: 'Barriga (cm)'
};
