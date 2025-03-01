import { toast } from 'sonner';

// API base URL - change this to point to your Flask backend
const API_BASE_URL = 'http://localhost:5000/api';

// Types for our data
export interface IntensityData {
  intensity: number;
  count: number;
}

export interface LikelihoodData {
  likelihood: number;
  count: number;
}

export interface TopicData {
  name: string;
  value: number;
}

export interface CountryData {
  country: string;
  count: number;
}

export interface SectorData {
  name: string;
  value: number;
}

export interface RegionData {
  name: string;
  value: number;
}

export interface YearTrendData {
  year: number;
  avgIntensity: number;
  avgLikelihood: number;
  avgRelevance: number;
}

export interface DashboardStats {
  totalRecords: number;
  avgIntensity: number;
  topLikelihood: number;
  topicCount: number;
  countryCount: number;
}

export interface FilterParams {
  end_year?: string;
  topic?: string;
  sector?: string;
  region?: string;
  country?: string;
  pestle?: string;
  source?: string;
  swot?: string;
}

// Helper function to build URL with query parameters
const buildUrl = (endpoint: string, filters: FilterParams = {}) => {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  
  // Add filters as query parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

// Helper function to handle API errors
const handleApiError = (error: unknown, endpoint: string) => {
  console.error(`Error fetching ${endpoint}:`, error);
  toast.error(`Failed to load ${endpoint} data`);
  return [];
};

// Function to fetch data with proper error handling
const fetchData = async <T>(endpoint: string, filters: FilterParams = {}): Promise<T> => {
  try {
    const response = await fetch(buildUrl(endpoint, filters));
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    
    // For demonstration purposes, return mock data when backend is not available
    console.warn(`Returning mock data for ${endpoint} due to connection error`);
    return getMockData(endpoint) as T;
  }
};

// Mock data function for development when backend is not available
function getMockData(endpoint: string) {
  switch (endpoint) {
    case 'topic-distribution':
      return [
        { name: 'oil', value: 25 },
        { name: 'gas', value: 18 },
        { name: 'market', value: 15 },
        { name: 'gdp', value: 12 },
        { name: 'war', value: 10 },
        { name: 'production', value: 8 },
        { name: 'export', value: 7 },
        { name: 'consumption', value: 6 },
        { name: 'climate', value: 5 },
        { name: 'economic growth', value: 4 }
      ];
    case 'year-trend':
      return [
        { year: 2016, avgIntensity: 3.5, avgLikelihood: 2.1, avgRelevance: 2.8 },
        { year: 2017, avgIntensity: 4.2, avgLikelihood: 2.3, avgRelevance: 3.0 },
        { year: 2018, avgIntensity: 4.8, avgLikelihood: 2.5, avgRelevance: 3.2 },
        { year: 2019, avgIntensity: 5.1, avgLikelihood: 2.7, avgRelevance: 3.4 },
        { year: 2020, avgIntensity: 5.5, avgLikelihood: 2.9, avgRelevance: 3.5 },
        { year: 2021, avgIntensity: 5.8, avgLikelihood: 3.0, avgRelevance: 3.6 },
        { year: 2022, avgIntensity: 6.0, avgLikelihood: 3.1, avgRelevance: 3.7 },
        { year: 2023, avgIntensity: 6.2, avgLikelihood: 3.2, avgRelevance: 3.8 },
        { year: 2024, avgIntensity: 6.5, avgLikelihood: 3.3, avgRelevance: 3.9 },
      ];
    case 'intensity-distribution':
      return [
        { intensity: 1, count: 5 },
        { intensity: 2, count: 12 },
        { intensity: 3, count: 18 },
        { intensity: 4, count: 24 },
        { intensity: 5, count: 16 },
        { intensity: 6, count: 11 },
        { intensity: 7, count: 7 },
        { intensity: 8, count: 4 },
        { intensity: 9, count: 2 },
        { intensity: 10, count: 1 },
      ];
    case 'likelihood-distribution':
      return [
        { likelihood: 1, count: 7 },
        { likelihood: 2, count: 15 },
        { likelihood: 3, count: 25 },
        { likelihood: 4, count: 18 },
      ];
    case 'region-distribution':
      return [
        { name: 'Northern America', value: 35 },
        { name: 'Asia', value: 30 },
        { name: 'Western Europe', value: 25 },
        { name: 'Eastern Europe', value: 15 },
        { name: 'South America', value: 12 },
        { name: 'Africa', value: 10 },
        { name: 'Oceania', value: 8 },
        { name: 'Central America', value: 5 },
        { name: 'World', value: 10 }
      ];
    case 'sector-distribution':
      return [
        { name: 'Energy', value: 30 },
        { name: 'Environment', value: 25 },
        { name: 'Government', value: 20 },
        { name: 'Manufacturing', value: 15 },
        { name: 'Retail', value: 10 },
        { name: 'Financial services', value: 8 },
        { name: 'Healthcare', value: 7 }
      ];
    case 'country-distribution':
      return [
        { country: 'United States', count: 28 },
        { country: 'China', count: 22 },
        { country: 'Russia', count: 17 },
        { country: 'India', count: 14 },
        { country: 'Germany', count: 12 },
        { country: 'United Kingdom', count: 11 },
        { country: 'Japan', count: 9 },
        { country: 'Brazil', count: 7 },
        { country: 'France', count: 6 },
        { country: 'Canada', count: 5 }
      ];
    default:
      return [];
  }
}

// API functions for each endpoint
export const fetchIntensityDistribution = (filters = {}): Promise<IntensityData[]> => {
  return fetchData<IntensityData[]>('intensity-distribution', filters);
};

export const fetchLikelihoodDistribution = (filters = {}): Promise<LikelihoodData[]> => {
  return fetchData<LikelihoodData[]>('likelihood-distribution', filters);
};

export const fetchTopicDistribution = (filters = {}): Promise<TopicData[]> => {
  return fetchData<TopicData[]>('topic-distribution', filters);
};

export const fetchCountryDistribution = (filters = {}): Promise<CountryData[]> => {
  return fetchData<CountryData[]>('country-distribution', filters);
};

export const fetchSectorDistribution = (filters = {}): Promise<SectorData[]> => {
  return fetchData<SectorData[]>('sector-distribution', filters);
};

export const fetchRegionDistribution = (filters = {}): Promise<RegionData[]> => {
  return fetchData<RegionData[]>('region-distribution', filters);
};

export const fetchYearTrends = (filters = {}): Promise<YearTrendData[]> => {
  return fetchData<YearTrendData[]>('year-trend', filters);
};

export const fetchDashboardStats = (filters = {}): Promise<DashboardStats> => {
  try {
    return fetchData<DashboardStats>('dashboard-stats', filters);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    toast.error('Failed to load dashboard statistics');
    // Return a promise that resolves to the default stats object
    return Promise.resolve({
      totalRecords: 0,
      avgIntensity: 0,
      topLikelihood: 0,
      topicCount: 0,
      countryCount: 0
    });
  }
};

// Function to handle general data filtering
export const filterData = async (filters = {}): Promise<any[]> => {
  try {
    const response = await fetch(buildUrl('filter', filters));
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error filtering data:', error);
    toast.error('Failed to apply filters');
    return [];
  }
};
