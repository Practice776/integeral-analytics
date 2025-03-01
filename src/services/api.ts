
import { toast } from 'sonner';

// API base URL - point to your Flask backend
const API_BASE_URL = 'http://localhost:5000/api';

// Types for our data
export interface IntensityData {
  intensity: number | string;
  count: number;
}

export interface LikelihoodData {
  likelihood: number | string;
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

export interface RelevanceData {
  topic: string;
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
  
  console.log(`Calling API: ${url.toString()}`);
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
    console.log(`Fetching ${endpoint} with filters:`, filters);
    const response = await fetch(buildUrl(endpoint, filters), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // If you have auth, uncomment this:
      // credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json() as T;
    console.log(`Data received for ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    
    // For demonstration purposes, return mock data when backend is not available
    console.warn(`Returning mock data for ${endpoint} due to connection error`);
    return getMockData(endpoint, filters) as T;
  }
};

// Mock data function for development when backend is not available
function getMockData(endpoint: string, filters: FilterParams = {}) {
  console.log('Using mock data with filters:', filters);
  
  // Base mock data
  let mockData;
  
  switch (endpoint) {
    case 'topic-distribution':
      mockData = [
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
      break;
    case 'year-trend':
      mockData = [
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
      break;
    case 'intensity-distribution':
      mockData = [
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
      break;
    case 'likelihood-distribution':
      mockData = [
        { likelihood: 1, count: 7 },
        { likelihood: 2, count: 15 },
        { likelihood: 3, count: 25 },
        { likelihood: 4, count: 18 },
      ];
      break;
    case 'region-distribution':
      mockData = [
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
      break;
    case 'sector-distribution':
      mockData = [
        { name: 'Energy', value: 30 },
        { name: 'Environment', value: 25 },
        { name: 'Government', value: 20 },
        { name: 'Manufacturing', value: 15 },
        { name: 'Retail', value: 10 },
        { name: 'Financial services', value: 8 },
        { name: 'Healthcare', value: 7 }
      ];
      break;
    case 'country-distribution':
      mockData = [
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
      break;
    default:
      mockData = [];
  }
  
  // Apply filters to mock data (simple simulation of backend filtering)
  if (Object.keys(filters).length > 0) {
    // This is a simplified mock filtering - in real data this would be handled by the backend
    if (filters.sector && mockData.length > 0 && 'name' in mockData[0]) {
      // Reduce counts for non-matching sectors
      mockData = mockData.map(item => {
        if ('name' in item && item.name.toLowerCase() !== filters.sector?.toLowerCase()) {
          return { ...item, value: Math.floor(item.value * 0.5) };
        }
        return item;
      });
    }
    
    if (filters.country && mockData.length > 0 && 'country' in mockData[0]) {
      // Reduce counts for non-matching countries
      mockData = mockData.map(item => {
        if (item.country.toLowerCase() !== filters.country?.toLowerCase()) {
          return { ...item, count: Math.floor(item.count * 0.6) };
        }
        return item;
      });
    }
    
    // Simulate filtering effect on topic distribution
    if (filters.topic && endpoint === 'topic-distribution') {
      mockData = mockData.map(item => {
        if (item.name.toLowerCase() !== filters.topic?.toLowerCase()) {
          return { ...item, value: Math.floor(item.value * 0.4) };
        }
        return item;
      });
    }
    
    // Simulate filtering on region
    if (filters.region && endpoint === 'region-distribution') {
      mockData = mockData.map(item => {
        if (item.name.toLowerCase() !== filters.region?.toLowerCase()) {
          return { ...item, value: Math.floor(item.value * 0.3) };
        }
        return item;
      });
    }
  }
  
  return mockData;
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

export const fetchRelevanceChart = (filters = {}): Promise<RelevanceData[]> => {
  return fetchData<RelevanceData[]>('relevance-chart', filters);
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
    const response = await fetch(buildUrl('filter', filters), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
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

// Function to get paginated data (requires authentication)
export const getPaginatedData = async (page = 1, limit = 10): Promise<any[]> => {
  try {
    const url = new URL(`${API_BASE_URL}/data`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    
    // This endpoint requires authentication
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // You would need to include your auth token here
        // 'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching paginated data:', error);
    toast.error('Failed to load data - authentication may be required');
    return [];
  }
};
