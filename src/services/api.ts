
import { toast } from 'sonner';

// Simulating API response data for our dashboard
// In a real application, these would be API calls to the Flask backend

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

// This would be an API call to your Flask backend
export const fetchIntensityDistribution = async (filters = {}): Promise<IntensityData[]> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    // In a real app, this would be:
    // const response = await fetch('/api/intensity-distribution', { 
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(filters)
    // });
    // return await response.json();

    // Mock data
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
  } catch (error) {
    console.error('Error fetching intensity distribution:', error);
    toast.error('Failed to load intensity data');
    return [];
  }
};

export const fetchLikelihoodDistribution = async (filters = {}): Promise<LikelihoodData[]> => {
  await new Promise(resolve => setTimeout(resolve, 900));

  try {
    // Mock data
    return [
      { likelihood: 1, count: 7 },
      { likelihood: 2, count: 15 },
      { likelihood: 3, count: 25 },
      { likelihood: 4, count: 18 },
    ];
  } catch (error) {
    console.error('Error fetching likelihood distribution:', error);
    toast.error('Failed to load likelihood data');
    return [];
  }
};

export const fetchTopicDistribution = async (filters = {}): Promise<TopicData[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Mock data
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
  } catch (error) {
    console.error('Error fetching topic distribution:', error);
    toast.error('Failed to load topic data');
    return [];
  }
};

export const fetchCountryDistribution = async (filters = {}): Promise<CountryData[]> => {
  await new Promise(resolve => setTimeout(resolve, 750));

  try {
    // Mock data
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
  } catch (error) {
    console.error('Error fetching country distribution:', error);
    toast.error('Failed to load country data');
    return [];
  }
};

export const fetchSectorDistribution = async (filters = {}): Promise<SectorData[]> => {
  await new Promise(resolve => setTimeout(resolve, 850));

  try {
    // Mock data
    return [
      { name: 'Energy', value: 30 },
      { name: 'Environment', value: 25 },
      { name: 'Government', value: 20 },
      { name: 'Manufacturing', value: 15 },
      { name: 'Retail', value: 10 },
      { name: 'Financial services', value: 8 },
      { name: 'Healthcare', value: 7 }
    ];
  } catch (error) {
    console.error('Error fetching sector distribution:', error);
    toast.error('Failed to load sector data');
    return [];
  }
};

export const fetchRegionDistribution = async (filters = {}): Promise<RegionData[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));

  try {
    // Mock data
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
  } catch (error) {
    console.error('Error fetching region distribution:', error);
    toast.error('Failed to load region data');
    return [];
  }
};

export const fetchYearTrends = async (filters = {}): Promise<YearTrendData[]> => {
  await new Promise(resolve => setTimeout(resolve, 1100));

  try {
    // Mock data
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
  } catch (error) {
    console.error('Error fetching year trends:', error);
    toast.error('Failed to load year trends data');
    return [];
  }
};

export const fetchDashboardStats = async (filters = {}): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    // Mock data
    return {
      totalRecords: 750,
      avgIntensity: 5.2,
      topLikelihood: 3.1,
      topicCount: 25,
      countryCount: 76
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    toast.error('Failed to load dashboard statistics');
    return {
      totalRecords: 0,
      avgIntensity: 0,
      topLikelihood: 0,
      topicCount: 0,
      countryCount: 0
    };
  }
};
