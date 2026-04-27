import { Stock, Model, Prediction, ChartDataPoint } from './types';

export const STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
];

export const MODELS: Model[] = [
  { id: 'lstm-v1', name: 'LSTM Neural Network', type: 'custom' },
  { id: 'transformer-main', name: 'GPT-Financial v4', type: 'web' },
  { id: 'prophet-basic', name: 'Facebook Prophet', type: 'web' },
  { id: 'xgboost-reg', name: 'XGBoost Regressor', type: 'custom' },
];

// Generate some semi-realistic mock data
const generateMockData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let basePrice = 150;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random walk
    basePrice += (Math.random() - 0.48) * 5;
    
    data.push({
      date: dateStr,
      actual: basePrice,
      predicted: basePrice * (1 + (Math.random() - 0.5) * 0.02)
    });
  }

  // Add 7 days of future predictions
  let lastPrice = basePrice;
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    lastPrice += (Math.random() - 0.45) * 4;
    data.push({
      date: dateStr,
      actual: null,
      predicted: lastPrice
    });
  }

  return data;
};

export const MOCK_CHART_DATA = generateMockData();

export const PREDICTION_HISTORY: Prediction[] = [
  { date: '2024-05-23', predicted: 147.20, actual: 148.12, accuracy: 98.2 },
  { date: '2024-05-22', predicted: 150.45, actual: 150.10, accuracy: 97.5 },
  { date: '2024-05-21', predicted: 155.00, actual: 152.40, accuracy: 91.2 },
  { date: '2024-05-20', predicted: 144.30, actual: 144.25, accuracy: 99.1 },
  { date: '2024-05-19', predicted: 142.10, actual: 143.50, accuracy: 96.8 },
];
