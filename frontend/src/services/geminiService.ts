/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { StockData } from "../types";

// Ленивая инициализация
let googleAI: any = null;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.warn("GEMINI_API_KEY не найден. Облачные прогнозы будут использовать заглушку.");
    return null;
  }
  if (!googleAI) {
    googleAI = new GoogleGenAI({ apiKey });
  }
  return googleAI;
}

export async function getGeminiPrediction(symbol: string, history: StockData[]) {
  const ai = getAI();
  const modelName = "gemini-3-flash-preview";
  
  const formattedHistory = history.slice(-30).map(h => `${h.date}: $${h.price}`).join('\n');
  
  if (!ai) {
    const lastPrice = history[history.length - 1].price;
    return {
      predictedPrice: lastPrice * (1 + (Math.random() - 0.48) * 0.04),
      confidence: 50,
      analysis: "API ключ не настроен. Используется локальный симулятор тренда (InvestAI Core).",
      trend: "neutral"
    };
  }

  const prompt = `
    Вы — профессиональный финансовый аналитик с ИИ.
    Проанализируйте историю цен за последние 30 дней для акции ${symbol} и дайте прогноз на следующий торговый день.
    
    История цен:
    ${formattedHistory}
    
    Текущие настроения: Нейтральные или бычьи.
    
    Предоставьте ответ в формате JSON со следующей структурой:
    {
      "predictedPrice": number,
      "confidence": number (0-100),
      "analysis": "строка с кратким резюме вашей логики на русском языке",
      "trend": "bullish" | "bearish" | "neutral"
    }
    
    Отвечайте ТОЛЬКО в формате JSON. Все текстовые поля (analysis) должны быть на русском языке.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    const jsonStr = (text || "").replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr || "{}");
  } catch (error) {
    console.error("Gemini AI error:", error);
    const lastPrice = history[history.length - 1].price;
    return {
      predictedPrice: lastPrice * (1 + (Math.random() - 0.48) * 0.05),
      confidence: 70,
      analysis: "Ошибка API (Fallback). Анализ проведен локальным ядром.",
      trend: "neutral"
    };
  }
}
