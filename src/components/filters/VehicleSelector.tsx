
"use client";

import type { Brand, Model, Engine, SelectedVehicle } from '@/lib/types';
import { carBrandsData } from '@/lib/types'; // Assuming carBrandsData is exported from types.ts or mockData.ts
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

interface VehicleSelectorProps {
  onVehicleChange: (vehicle: SelectedVehicle) => void;
  initialVehicle?: SelectedVehicle;
}

export default function VehicleSelector({ onVehicleChange, initialVehicle }: VehicleSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(
    initialVehicle?.brand ? carBrandsData.find(b => b.name === initialVehicle.brand) : undefined
  );
  const [selectedModel, setSelectedModel] = useState<Model | undefined>(
    initialVehicle?.model && selectedBrand ? selectedBrand.models.find(m => m.name === initialVehicle.model) : undefined
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(initialVehicle?.year);
  const [selectedEngine, setSelectedEngine] = useState<string | undefined>(initialVehicle?.engine); // Engine is now a string

  const [models, setModels] = useState<Model[]>(selectedBrand?.models || []);
  const [years, setYears] = useState<number[]>(selectedModel?.years || []);
  const [engines, setEngines] = useState<Engine[]>(selectedModel?.engines || []); // Engine[] is now string[]

  useEffect(() => {
    if (initialVehicle?.brand) {
        const brand = carBrandsData.find(b => b.name === initialVehicle.brand);
        setSelectedBrand(brand);
        if (brand) {
            setModels(brand.models);
            if (initialVehicle.model) {
                const model = brand.models.find(m => m.name === initialVehicle.model);
                setSelectedModel(model);
                if (model) {
                    setYears(model.years);
                    setEngines(model.engines);
                    if (initialVehicle.year) setSelectedYear(initialVehicle.year);
                    if (initialVehicle.engine) setSelectedEngine(initialVehicle.engine);
                }
            }
        }
    }
  }, [initialVehicle]);


  const handleBrandChange = (brandName: string) => {
    const brand = carBrandsData.find(b => b.name === brandName);
    setSelectedBrand(brand);
    setSelectedModel(undefined);
    setSelectedYear(undefined);
    setSelectedEngine(undefined);
    setModels(brand?.models || []);
    setYears([]);
    setEngines([]);
    onVehicleChange({ brand: brand?.name });
  };

  const handleModelChange = (modelName: string) => {
    const model = selectedBrand?.models.find(m => m.name === modelName);
    setSelectedModel(model);
    setSelectedYear(undefined);
    setSelectedEngine(undefined);
    setYears(model?.years || []);
    setEngines(model?.engines || []);
    onVehicleChange({ brand: selectedBrand?.name, model: model?.name });
  };

  const handleYearChange = (yearStr: string) => {
    const year = parseInt(yearStr, 10);
    setSelectedYear(year);
    setSelectedEngine(undefined); // Reset engine if year changes, though typically engines are tied to model/year ranges
    onVehicleChange({ brand: selectedBrand?.name, model: selectedModel?.name, year });
  };

  const handleEngineChange = (engineName: string) => {
    setSelectedEngine(engineName);
    onVehicleChange({ brand: selectedBrand?.name, model: selectedModel?.name, year: selectedYear, engine: engineName });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="brand-select">Car Brand</Label>
        <Select onValueChange={handleBrandChange} value={selectedBrand?.name}>
          <SelectTrigger id="brand-select">
            <SelectValue placeholder="Select Brand" />
          </SelectTrigger>
          <SelectContent>
            {carBrandsData.map(brand => (
              <SelectItem key={brand.name} value={brand.name}>{brand.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedBrand && (
        <div>
          <Label htmlFor="model-select">Model</Label>
          <Select onValueChange={handleModelChange} value={selectedModel?.name} disabled={!selectedBrand}>
            <SelectTrigger id="model-select">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model.name} value={model.name}>{model.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedModel && (
        <div>
          <Label htmlFor="year-select">Year</Label>
          <Select onValueChange={handleYearChange} value={selectedYear?.toString()} disabled={!selectedModel}>
            <SelectTrigger id="year-select">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedModel && engines.length > 0 && ( // Only show engine if model has engine types defined
        <div>
          <Label htmlFor="engine-select">Engine Type (Optional)</Label>
          <Select onValueChange={handleEngineChange} value={selectedEngine} disabled={!selectedModel || !selectedYear}>
            <SelectTrigger id="engine-select">
              <SelectValue placeholder="Select Engine Type" />
            </SelectTrigger>
            <SelectContent>
              {engines.map(engineName => ( // engine is now engineName (a string)
                <SelectItem key={engineName} value={engineName}>{engineName}</SelectItem> // Use engineName directly
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

    
