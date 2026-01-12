
import { GoogleGenAI } from "@google/genai";
import { Measurement, Goal, MealType, FoodEntry, HealthProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMotivationalMessage = async (
  current: Measurement,
  history: Measurement[],
  intermediateGoal: Goal,
  finalGoal: Goal,
  profile: HealthProfile
): Promise<string> => {
  const recentHistory = history.slice(-5);
  
  const historyText = recentHistory.map(m => 
    `- Fecha: ${new Date(m.date).toLocaleDateString()}, Peso: ${m.weightLbs}lbs, Grasa: ${m.bodyFatPercent}%, Cintura: ${m.waistCm}cm`
  ).join('\n');

  const prompt = `
    Actúa como un experto en salud y fitness. 
    PERFIL DEL USUARIO: 
    - Edad: ${profile.age} años, Sexo: ${profile.sex}, Estatura: ${profile.heightCm} cm.
    - Objetivo: ${profile.objective}, Condiciones: ${profile.conditions}.
    
    DATOS ACTUALES (HOY):
    - Peso: ${current.weightLbs} lbs, Grasa: ${current.bodyFatPercent}%, Visceral: ${current.visceralFat}, Cintura: ${current.waistCm} cm.
    
    HISTORIAL RECIENTE:
    ${historyText || 'No hay registros anteriores.'}
    
    INSTRUCCIONES:
    1. ANALIZA TENDENCIAS considerando su edad, sexo y objetivos.
    2. Si tiene "${profile.conditions}", da un consejo específico y empático.
    3. Evalúa si el progreso es saludable para su perfil demográfico.
    
    Formato: Un párrafo directo en ESPAÑOL. Máximo 100 palabras.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "¡Excelente registro! Sigue así.";
  } catch (error) {
    return "Consistencia es la clave. ¡Sigue adelante!";
  }
};

export const getFoodSuggestion = async (mealType: MealType, profile: HealthProfile): Promise<string> => {
  const prompt = `
    Como un nutricionista salvadoreño experto, sugiere un plato típico de El Salvador para el tiempo de: ${mealType}.
    PERFIL: ${profile.sex}, ${profile.age} años, Objetivo: ${profile.objective}, Condición: ${profile.conditions}.
    
    La sugerencia debe considerar su edad y objetivo metabólico.
    Máximo 2 frases en ESPAÑOL.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Un casamiento con huevo picado y aguacate.";
  } catch (error) {
    return "Un casamiento con huevo picado y aguacate.";
  }
};

export const analyzeDiet = async (entries: FoodEntry[], profile: HealthProfile): Promise<string> => {
  const entriesText = entries.map(e => `${e.type}: ${e.description}`).join(', ');
  const prompt = `
    Analiza esta dieta salvadoreña de hoy: ${entriesText}.
    PERFIL: ${profile.sex}, ${profile.age} años, Objetivo: ${profile.objective}.
    Da un consejo rápido sobre nutrientes clave para su edad y meta.
    Máximo 2 frases en ESPAÑOL.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Vas por buen camino, intenta asegurar suficiente proteína.";
  } catch (error) {
    return "Sigue registrando tus comidas.";
  }
};

export const getEasyWinSuggestion = async (metric: string, trend: string, profile: HealthProfile): Promise<string> => {
  const prompt = `
    El usuario (${profile.sex}, ${profile.age} años) muestra un estancamiento en ${metric}.
    Sugiere una "Meta de Fácil Cumplimiento" muy visual para recuperar motivación.
    Máximo 1 frase corta en ESPAÑOL.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Bebe un vaso de agua antes de cada comida.";
  } catch (error) {
    return "Bebe un vaso de agua antes de cada comida.";
  }
};
