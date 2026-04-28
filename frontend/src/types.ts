/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StockData {
  date: string;
  price: number;
  predicted?: number;
}

export interface StockSelection {
  id: string;
  name: string;
  symbol: string;
}

export type ModelType = 'own' | 'internet';

export interface Prediction {
  id: string;
  stockId: string;
  stockSymbol: string;
  date: string;
  predictionPrice: number;
  actualPrice?: number;
  model: ModelType;
  status: 'pending' | 'completed';
}

export const STOCKS: StockSelection[] = [
  { id: '1', name: 'Apple Inc.', symbol: 'AAPL' },
  { id: '2', name: 'Alphabet Inc. (Google)', symbol: 'GOOGL' },
  { id: '3', name: 'Tesla, Inc.', symbol: 'TSLA' },
  { id: '4', name: 'Nvidia Corp.', symbol: 'NVDA' },
  { id: '5', name: 'Microsoft Corp.', symbol: 'MSFT' },
];

export const PERIODS = [
  { label: '7Д', days: 7 },
  { label: '1М', days: 30 },
  { label: '3М', days: 90 },
  { label: '1Г', days: 365 },
];
