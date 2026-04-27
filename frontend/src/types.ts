export interface Stock {
  symbol: string;
  name: string;
}

export interface Prediction {
  date: string;
  predicted: number;
  actual?: number;
  accuracy?: number;
}

export interface Model {
  id: string;
  name: string;
  type: 'custom' | 'web';
}

export interface ChartDataPoint {
  date: string;
  actual?: number | null;
  predicted?: number | null;
}
