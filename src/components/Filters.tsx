
import React, { useEffect, useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  onFilterChange: (filterName: string, value: string) => void;
  activeFilters: Record<string, string>;
  clearFilters: () => void;
}

export const Filters: React.FC<FilterProps> = ({ 
  onFilterChange, 
  activeFilters,
  clearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [endYearOptions, setEndYearOptions] = useState<FilterOption[]>([]);
  const [topicOptions, setTopicOptions] = useState<FilterOption[]>([]);
  const [sectorOptions, setSectorOptions] = useState<FilterOption[]>([]);
  const [regionOptions, setRegionOptions] = useState<FilterOption[]>([]);
  const [pestleOptions, setPestleOptions] = useState<FilterOption[]>([]);
  const [sourceOptions, setSourceOptions] = useState<FilterOption[]>([]);
  const [swotOptions, setSwotOptions] = useState<FilterOption[]>([]);
  const [countryOptions, setCountryOptions] = useState<FilterOption[]>([]);
  const [cityOptions, setCityOptions] = useState<FilterOption[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  // For this demo, let's create mock filter options
  useEffect(() => {
    // Simulating API loading
    setTimeout(() => {
      setEndYearOptions([
        { value: "", label: "All" },
        { value: "2018", label: "2018" },
        { value: "2019", label: "2019" },
        { value: "2020", label: "2020" },
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
      ]);
      
      setTopicOptions([
        { value: "", label: "All" },
        { value: "oil", label: "Oil" },
        { value: "gas", label: "Gas" },
        { value: "market", label: "Market" },
        { value: "gdp", label: "GDP" },
        { value: "war", label: "War" },
        { value: "production", label: "Production" },
        { value: "export", label: "Export" },
        { value: "consumption", label: "Consumption" },
        { value: "climate", label: "Climate" },
      ]);
      
      setSectorOptions([
        { value: "", label: "All" },
        { value: "Energy", label: "Energy" },
        { value: "Environment", label: "Environment" },
        { value: "Government", label: "Government" },
        { value: "Manufacturing", label: "Manufacturing" },
        { value: "Retail", label: "Retail" },
        { value: "Financial services", label: "Financial Services" },
        { value: "Healthcare", label: "Healthcare" },
      ]);
      
      setRegionOptions([
        { value: "", label: "All" },
        { value: "Northern America", label: "Northern America" },
        { value: "Central America", label: "Central America" },
        { value: "South America", label: "South America" },
        { value: "Western Europe", label: "Western Europe" },
        { value: "Eastern Europe", label: "Eastern Europe" },
        { value: "Asia", label: "Asia" },
        { value: "Oceania", label: "Oceania" },
        { value: "Africa", label: "Africa" },
        { value: "World", label: "World" },
      ]);
      
      setPestleOptions([
        { value: "", label: "All" },
        { value: "Political", label: "Political" },
        { value: "Economic", label: "Economic" },
        { value: "Social", label: "Social" },
        { value: "Technological", label: "Technological" },
        { value: "Environmental", label: "Environmental" },
      ]);
      
      setSourceOptions([
        { value: "", label: "All" },
        { value: "EIA", label: "EIA" },
        { value: "IMF", label: "IMF" },
        { value: "World Bank", label: "World Bank" },
        { value: "IEA", label: "IEA" },
        { value: "BP", label: "BP" },
      ]);
      
      setSwotOptions([
        { value: "", label: "All" },
        { value: "Strength", label: "Strength" },
        { value: "Weakness", label: "Weakness" },
        { value: "Opportunity", label: "Opportunity" },
        { value: "Threat", label: "Threat" },
      ]);
      
      setCountryOptions([
        { value: "", label: "All" },
        { value: "United States", label: "United States" },
        { value: "China", label: "China" },
        { value: "Russia", label: "Russia" },
        { value: "Germany", label: "Germany" },
        { value: "India", label: "India" },
        { value: "United Kingdom", label: "United Kingdom" },
        { value: "Japan", label: "Japan" },
        { value: "Brazil", label: "Brazil" },
      ]);
      
      setCityOptions([
        { value: "", label: "All" },
        { value: "New York", label: "New York" },
        { value: "London", label: "London" },
        { value: "Beijing", label: "Beijing" },
        { value: "Moscow", label: "Moscow" },
        { value: "Tokyo", label: "Tokyo" },
        { value: "Delhi", label: "Delhi" },
        { value: "Paris", label: "Paris" },
      ]);
      
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, []);

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== "");
  
  return (
    <div className="bg-white border-b border-border">
      <div className="container mx-auto">
        <div className="py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5"
            >
              <FilterIcon size={14} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {Object.values(activeFilters).filter(v => v !== "").length}
                </span>
              )}
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} className="mr-1" />
                Clear all
              </Button>
            )}
          </div>
          
          <div className="flex items-center">
            <SlidersHorizontal size={16} className="mr-2 text-muted-foreground" />
            <span className="text-sm font-medium hidden md:inline-block">Dashboard Controls</span>
          </div>
        </div>
        
        <div 
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 pb-4 transition-all duration-300",
            isOpen ? "max-h-[800px] opacity-100 py-3" : "max-h-0 opacity-0 overflow-hidden py-0"
          )}
        >
          <FilterSelect
            label="End Year"
            options={endYearOptions}
            value={activeFilters.end_year || ""}
            onChange={(value) => onFilterChange("end_year", value)}
            isLoading={isLoading}
          />
          
          <FilterSelect
            label="Topic"
            options={topicOptions}
            value={activeFilters.topic || ""}
            onChange={(value) => onFilterChange("topic", value)}
            isLoading={isLoading}
          />
          
          <FilterSelect
            label="Sector"
            options={sectorOptions}
            value={activeFilters.sector || ""}
            onChange={(value) => onFilterChange("sector", value)}
            isLoading={isLoading}
          />
          
          <FilterSelect
            label="Region"
            options={regionOptions}
            value={activeFilters.region || ""}
            onChange={(value) => onFilterChange("region", value)}
            isLoading={isLoading}
          />
          
          <FilterSelect
            label="PESTLE"
            options={pestleOptions}
            value={activeFilters.pestle || ""}
            onChange={(value) => onFilterChange("pestle", value)}
            isLoading={isLoading}
          />
          
          <FilterSelect
            label="Source"
            options={sourceOptions}
            value={activeFilters.source || ""}
            onChange={(value) => onFilterChange("source", value)}
            isLoading={isLoading}
          />
          
          <FilterSelect
            label="SWOT"
            options={swotOptions}
            value={activeFilters.swot || ""}
            onChange={(value) => onFilterChange("swot", value)}
            isLoading={isLoading}
          />
          
          <FilterSelect
            label="Country"
            options={countryOptions}
            value={activeFilters.country || ""}
            onChange={(value) => onFilterChange("country", value)}
            isLoading={isLoading}
          />
          
          <FilterSelect
            label="City"
            options={cityOptions}
            value={activeFilters.city || ""}
            onChange={(value) => onFilterChange("city", value)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  isLoading,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={label} className="text-xs font-medium mb-1.5 text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger id={label} className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value || 'empty'} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
