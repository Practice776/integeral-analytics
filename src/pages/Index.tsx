
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import TopicChart from "../components/charts/TopicChart";
import YearTrendsChart from "../components/charts/YearTrendsChart";
import IntensityChart from "../components/charts/IntensityChart";
import LikelihoodChart from "../components/charts/LikelihoodChart";
import RegionDonutChart from "../components/charts/RegionDonutChart";
import SectorPieChart from "../components/charts/SectorPieChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Gauge, BarChart3, TrendingUp, Database, Globe, Activity, RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Import API service
import {
  fetchTopicDistribution,
  fetchYearTrends,
  fetchIntensityDistribution,
  fetchLikelihoodDistribution,
  fetchRegionDistribution,
  fetchSectorDistribution,
  fetchCountryDistribution,
  TopicData,
  YearTrendData,
  IntensityData,
  LikelihoodData,
  RegionData,
  SectorData,
  CountryData,
  FilterParams
} from "../services/api";

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [topicData, setTopicData] = useState<TopicData[]>([]);
  const [yearTrendData, setYearTrendData] = useState<YearTrendData[]>([]);
  const [intensityData, setIntensityData] = useState<IntensityData[]>([]);
  const [likelihoodData, setLikelihoodData] = useState<LikelihoodData[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  
  // Filter states
  const [endYearFilter, setEndYearFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [pestleFilter, setPestleFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [swotFilter, setSwotFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update active filters display
  useEffect(() => {
    const filters: string[] = [];
    if (endYearFilter) filters.push(`End Year: ${endYearFilter}`);
    if (topicFilter) filters.push(`Topic: ${topicFilter}`);
    if (sectorFilter) filters.push(`Sector: ${sectorFilter}`);
    if (regionFilter) filters.push(`Region: ${regionFilter}`);
    if (pestleFilter) filters.push(`PESTLE: ${pestleFilter}`);
    if (sourceFilter) filters.push(`Source: ${sourceFilter}`);
    if (swotFilter) filters.push(`SWOT: ${swotFilter}`);
    if (countryFilter) filters.push(`Country: ${countryFilter}`);
    
    setActiveFilters(filters);
  }, [
    endYearFilter,
    topicFilter,
    sectorFilter,
    regionFilter,
    pestleFilter,
    sourceFilter,
    swotFilter,
    countryFilter
  ]);

  // Fetch data with filters
  useEffect(() => {
    let isMounted = true;
    
    async function loadData() {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        // Using filters object to pass to API functions
        const filters: FilterParams = {
          end_year: endYearFilter,
          topic: topicFilter,
          sector: sectorFilter,
          region: regionFilter,
          pestle: pestleFilter,
          source: sourceFilter,
          swot: swotFilter,
          country: countryFilter
        };

        console.log("Applying filters:", filters);

        // Fetch all data with the filters applied
        const [topics, yearTrends, intensities, likelihoods, regions, sectors, countries] = await Promise.all([
          fetchTopicDistribution(filters),
          fetchYearTrends(filters),
          fetchIntensityDistribution(filters),
          fetchLikelihoodDistribution(filters),
          fetchRegionDistribution(filters),
          fetchSectorDistribution(filters),
          fetchCountryDistribution(filters)
        ]);

        if (!isMounted) return;

        // Set state with fetched data
        setTopicData(topics);
        setYearTrendData(yearTrends);
        setIntensityData(intensities);
        setLikelihoodData(likelihoods);
        setRegionData(regions);
        setSectorData(sectors);
        setCountryData(countries);
        
        // Show success toast when filters are applied
        if (Object.values(filters).some(f => f)) {
          toast({
            title: "Filters Applied",
            description: "Dashboard data has been filtered successfully.",
          });
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load dashboard data. Please try again.",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [
    // Dependencies for filters
    endYearFilter,
    topicFilter,
    sectorFilter,
    regionFilter,
    pestleFilter,
    sourceFilter,
    swotFilter,
    countryFilter,
    toast
  ]);

  const handleApplyFilters = () => {
    // The useEffect will handle data fetching because the filter state variables are dependencies
    toast({
      title: "Applying filters...",
      description: "Updating dashboard data with the selected filters.",
    });
  };

  const handleClearFilters = () => {
    setEndYearFilter("");
    setTopicFilter("");
    setSectorFilter("");
    setRegionFilter("");
    setPestleFilter("");
    setSourceFilter("");
    setSwotFilter("");
    setCountryFilter("");
    
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Data Visualization Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            {!isMobile && activeFilters.length > 0 && (
              <div className="text-sm text-gray-500 mr-2">
                <span className="font-medium">Active filters:</span> {activeFilters.length}
              </div>
            )}
            <Button variant="outline" size="sm" className="flex items-center" onClick={handleApplyFilters} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters Section */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2 text-blue-600" />
              Dashboard Filters
            </CardTitle>
            <CardDescription>Filter the dashboard data by different parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">End Year</label>
                <Input
                  value={endYearFilter}
                  onChange={(e) => setEndYearFilter(e.target.value)}
                  placeholder="e.g. 2025"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Topic</label>
                <Input
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  placeholder="e.g. oil"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Sector</label>
                <Input
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  placeholder="e.g. Energy"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Region</label>
                <Input
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  placeholder="e.g. Northern America"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">PESTLE</label>
                <Input
                  value={pestleFilter}
                  onChange={(e) => setPestleFilter(e.target.value)}
                  placeholder="e.g. Economic"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Source</label>
                <Input
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  placeholder="e.g. Source name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">SWOT</label>
                <Input
                  value={swotFilter}
                  onChange={(e) => setSwotFilter(e.target.value)}
                  placeholder="e.g. Strength"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Country</label>
                <Input
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  placeholder="e.g. United States"
                />
              </div>
            </div>
            
            {activeFilters.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                    {filter}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={handleClearFilters} disabled={isLoading || activeFilters.length === 0}>
                Clear Filters
              </Button>
              <Button onClick={handleApplyFilters} disabled={isLoading}>
                {isLoading ? "Loading..." : "Apply Filters"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-36 mt-1" />
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-36"></div>
                      <div className="h-4 bg-gray-200 rounded w-60"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-36 mt-1" />
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-36"></div>
                      <div className="h-4 bg-gray-200 rounded w-60"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Topic Distribution */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Topic Distribution
                  </CardTitle>
                  <CardDescription>Distribution of topics by count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {topicData.length > 0 ? (
                      <TopicChart data={topicData} height={400} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No topic data available with current filters
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Year Trends */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Year Trends
                  </CardTitle>
                  <CardDescription>Trends of intensity, likelihood, and relevance by year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {yearTrendData.length > 0 ? (
                      <YearTrendsChart data={yearTrendData} height={400} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No year trend data available with current filters
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Charts Section */}
            <Tabs defaultValue="intensity" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="intensity">Intensity</TabsTrigger>
                <TabsTrigger value="likelihood">Likelihood</TabsTrigger>
                <TabsTrigger value="region">Region</TabsTrigger>
                <TabsTrigger value="sector">Sector</TabsTrigger>
              </TabsList>

              <TabsContent value="intensity">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gauge className="h-5 w-5 mr-2 text-blue-600" />
                      Intensity Distribution
                    </CardTitle>
                    <CardDescription>Distribution of data by intensity values</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      {intensityData.length > 0 ? (
                        <IntensityChart data={intensityData} height={350} />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          No intensity data available with current filters
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="likelihood">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600" />
                      Likelihood Distribution
                    </CardTitle>
                    <CardDescription>Distribution of data by likelihood values</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      {likelihoodData.length > 0 ? (
                        <LikelihoodChart data={likelihoodData} height={350} />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          No likelihood data available with current filters
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="region">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-blue-600" />
                      Region Distribution
                    </CardTitle>
                    <CardDescription>Distribution of data by regions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      {regionData.length > 0 ? (
                        <RegionDonutChart data={regionData} height={350} />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          No region data available with current filters
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sector">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                      Sector Distribution
                    </CardTitle>
                    <CardDescription>Distribution of data by sectors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      {sectorData.length > 0 ? (
                        <SectorPieChart data={sectorData} height={350} />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          No sector data available with current filters
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{topicData.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Years Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {yearTrendData.length > 0 
                      ? `${Math.min(...yearTrendData.map(d => d.year))} - ${Math.max(...yearTrendData.map(d => d.year))}` 
                      : "N/A"}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Max Intensity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {intensityData.length > 0 && intensityData.some(d => d.intensity !== "") 
                      ? Math.max(...intensityData.filter(d => d.intensity !== "").map(d => +d.intensity)) 
                      : "N/A"}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Regions Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regionData.length}</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
        
        {/* Active Filters Summary */}
        {activeFilters.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Filter className="h-4 w-4 mr-2 text-blue-600" />
                Active Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                    {filter}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleClearFilters} className="text-xs h-6">
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Footer */}
        <footer className="text-center text-gray-500 mt-10 pb-6">
          <p>Data Visualization Dashboard &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
