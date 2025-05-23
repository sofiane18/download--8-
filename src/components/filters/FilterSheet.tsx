
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import VehicleSelector from "./VehicleSelector";
import type { SelectedVehicle, Category, SubCategory } from "@/lib/types";
import { productCategories, serviceCategories, allWilayas } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export interface Filters {
  selectedVehicle?: SelectedVehicle;
  mainCategory?: string;
  subCategory?: string;
  storeName?: string; // Already handled by searchTerm on ExplorePage, but could be added here
  wilaya?: string;
  priceRange?: [number, number];
  rating?: number;
  sortOption?: string;
}

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: Filters;
  onApplyFilters: (filters: Filters) => void;
  activeTab: 'products' | 'services' | 'stores';
}

const MAX_PRICE = 20000; // Example max price for slider

export default function FilterSheet({ open, onOpenChange, currentFilters, onApplyFilters, activeTab }: FilterSheetProps) {
  const [internalFilters, setInternalFilters] = useState<Filters>(currentFilters);

  useEffect(() => {
    setInternalFilters(currentFilters);
  }, [currentFilters, open]);

  const handleVehicleChange = (vehicle: SelectedVehicle) => {
    setInternalFilters(prev => ({ ...prev, selectedVehicle: vehicle }));
  };

  const handleMainCategoryChange = (mainCatName: string) => {
    setInternalFilters(prev => ({ ...prev, mainCategory: mainCatName, subCategory: undefined }));
  };

  const handleSubCategoryChange = (subCatName: string) => {
    setInternalFilters(prev => ({ ...prev, subCategory: subCatName }));
  };
  
  const handleWilayaChange = (wilayaName: string) => {
    setInternalFilters(prev => ({ ...prev, wilaya: wilayaName }));
  };

  const handlePriceChange = (value: [number, number]) => {
    setInternalFilters(prev => ({ ...prev, priceRange: value }));
  };
  
  const handleRatingChange = (ratingStr: string) => {
    setInternalFilters(prev => ({ ...prev, rating: parseInt(ratingStr,10) }));
  };

  const handleSortChange = (sortValue: string) => {
    setInternalFilters(prev => ({ ...prev, sortOption: sortValue }));
  };

  const applyAndClose = () => {
    onApplyFilters(internalFilters);
    onOpenChange(false);
  };

  const resetFilters = () => {
    const emptyFilters: Filters = { priceRange: [0, MAX_PRICE], rating: 0 };
    setInternalFilters(emptyFilters);
    onApplyFilters(emptyFilters); // Optionally apply reset immediately or wait for "Apply"
  }

  const currentCategories = activeTab === 'products' ? productCategories : serviceCategories;
  const selectedMainCat = currentCategories.find(c => c.name === internalFilters.mainCategory);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Filters & Sort</SheetTitle>
          <SheetDescription>
            Refine your search for {activeTab}.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto space-y-6 p-1 custom-scrollbar pr-3">
          {activeTab !== 'stores' && (
            <>
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">Vehicle Compatibility</h3>
                <VehicleSelector 
                  initialVehicle={internalFilters.selectedVehicle}
                  onVehicleChange={handleVehicleChange} 
                />
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <div>
                  <Label htmlFor="main-cat-select">Main Category</Label>
                  <Select onValueChange={handleMainCategoryChange} value={internalFilters.mainCategory}>
                    <SelectTrigger id="main-cat-select"><SelectValue placeholder="Select Main Category" /></SelectTrigger>
                    <SelectContent>
                      {currentCategories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {selectedMainCat && selectedMainCat.subCategories.length > 0 && (
                  <div className="mt-3">
                    <Label htmlFor="sub-cat-select">Sub Category</Label>
                    <Select onValueChange={handleSubCategoryChange} value={internalFilters.subCategory} disabled={!internalFilters.mainCategory}>
                      <SelectTrigger id="sub-cat-select"><SelectValue placeholder="Select Sub Category" /></SelectTrigger>
                      <SelectContent>
                        {selectedMainCat.subCategories.map(subCat => <SelectItem key={subCat.id} value={subCat.name}>{subCat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">Price Range (DZD)</h3>
                <Slider
                  defaultValue={[0, MAX_PRICE]}
                  value={internalFilters.priceRange || [0, MAX_PRICE]}
                  max={MAX_PRICE}
                  step={100}
                  onValueChange={handlePriceChange}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{internalFilters.priceRange?.[0] || 0} DZD</span>
                  <span>{internalFilters.priceRange?.[1] || MAX_PRICE} DZD</span>
                </div>
              </div>

              <div>
                <Label htmlFor="rating-select">Minimum Rating</Label>
                <Select onValueChange={handleRatingChange} value={internalFilters.rating?.toString()}>
                  <SelectTrigger id="rating-select"><SelectValue placeholder="Any Rating" /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(r => <SelectItem key={r} value={r.toString()}>{r} Star{r>1?'s':''} & Up</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {activeTab === 'stores' && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Location (Wilaya)</h3>
              <Select onValueChange={handleWilayaChange} value={internalFilters.wilaya}>
                <SelectTrigger id="wilaya-select"><SelectValue placeholder="Select Wilaya" /></SelectTrigger>
                <SelectContent>
                  {allWilayas.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
           <div>
            <Label htmlFor="sort-select">Sort By</Label>
            <Select onValueChange={handleSortChange} value={internalFilters.sortOption}>
              <SelectTrigger id="sort-select"><SelectValue placeholder="Default" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="reviews_desc">Most Reviewed</SelectItem>
                <SelectItem value="newest_desc">Newest</SelectItem>
                {/* Add "closest" if location services are implemented */}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <SheetFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">Reset</Button>
          <SheetClose asChild>
            <Button onClick={applyAndClose} className="w-full sm:w-auto">Apply Filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

