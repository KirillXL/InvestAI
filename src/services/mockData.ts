/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StockData } from '../types';

export function generateMockHistory(days: number, volatility: number = 0.02): StockData[] {
  const data: StockData[] = [];
  let currentPrice = 150 + Math.random() * 100;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Random walk with a slight upward drift
    const change = currentPrice * (Math.random() - 0.45) * volatility;
    currentPrice += change;

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }

  return data;
}

export function generatePrediction(history: StockData[], modelType: 'own' | 'internet'): number {
  const lastPrice = history[history.length - 1].price;
  
  if (modelType === 'internet') {
    // internet model is "smarter" (simulated)
    const trend = (history[history.length - 1].price - history[0].price) / history.length;
    return parseFloat((lastPrice + trend * 2 + (Math.random() - 0.5) * 5).toFixed(2));
  } else {
    // own model is a bit more volatile
    return parseFloat((lastPrice + (Math.random() - 0.5) * 10).toFixed(2));
  }
}
