import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 15000,
});

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  response: T;
};

export type Company = {
  id: string;
  symbol: string;
  name: string;
  sector: string | null;
  listingDate: string | null;
  isActive: boolean;
};

export type RoiChartPoint = {
  year: number;
  price: number;
  shares: number;
  return: number;
};

export type RoiDetail = {
  year: number;
  payoutType: string;
  faceValue: number | null;
  payoutPercentage: number | null;
  dividendPerShare: number | null;
  shares: number;
  dividendPaid: number;
  totalInvestment: number;
};

export type RoiResult = {
  symbol: string;
  initialYear: number;
  initialPrice: number;
  initialShares: number;
  initialInvestment: number;
  currentYear: number;
  currentPrice: number;
  currentShares: number;
  currentInvestment: number;
  totalDividend: number;
  totalReturn: number;
  profitReturn: number;
  cagr: number | null;
  reinvestDividend: boolean;
  chart: RoiChartPoint[];
  details: RoiDetail[];
};

export type RoiRequest = {
  symbol: string;
  initialYear: number;
  sharesBought: number;
  buyPrice?: number;
  reinvestDividend: boolean;
};

export async function searchCompanies(search: string, limit = 10) {
  const { data } = await api.get<ApiResponse<Company[]>>('/api/companies', {
    params: { search, limit },
  });
  return data.response;
}

export async function calculateRoi(payload: RoiRequest) {
  const { data } = await api.post<ApiResponse<RoiResult>>('/api/calculators/roi', payload);
  return data.response;
}

export default api;
