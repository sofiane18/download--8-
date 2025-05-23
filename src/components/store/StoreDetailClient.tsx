
"use client";

import { useMemo, useState } from 'react';
import { productCategories, serviceCategories, allWilayas } from '@/lib/mockData'; 
import type { Store as StoreType, Product, Service, SelectedVehicle, CompatibleVehicle } from '@/lib/types';
import { ProductCard } from '@/components/shared/ProductCard';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, SlidersHorizontal, MapPin, Tag } from 'lucide-react';
import FilterSheet, { type Filters } from '@/components/filters/FilterSheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/shared/StarRating';

const MAX_PRICE_DEFAULT = 20000;

// Helper function to check vehicle compatibility
const isVehicleCompatible = (itemCompatibleVehicles: CompatibleVehicle[] | undefined, selectedVehicle?: SelectedVehicle): boolean => {
  if (!selectedVehicle || !selectedVehicle.brand) return true; // No vehicle selected, so everything is "compatible"
  if (!itemCompatibleVehicles || itemCompatibleVehicles.length === 0) return true; // Item has no compatibility defined, assume universal

  return itemCompatibleVehicles.some(comp => {
    if (comp.brand !== selectedVehicle.brand) return false;
    if (selectedVehicle.model && comp.model && comp.model !== selectedVehicle.model) return false;
    if (selectedVehicle.year && comp.years && !comp.years.includes(selectedVehicle.year)) return false;
    // Engine check can be added if needed and if data supports it well
    // if (selectedVehicle.engine && comp.engine && comp.engine !== selectedVehicle.engine) return false;
    return true;
  });
};

interface StoreDetailClientProps {
  store: StoreType;
  initialProducts: Product[];
  initialServices: Service[];
}

export default function StoreDetailClient({ store, initialProducts, initialServices }: StoreDetailClientProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const initialFiltersState: Filters = { 
    priceRange: [0, MAX_PRICE_DEFAULT],
    rating: 0,
  };
  const [currentFilters, setCurrentFilters] = useState<Filters>(initialFiltersState);

  const handleApplyFilters = (newFilters: Filters) => {
    setCurrentFilters(newFilters);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products = initialProducts.filter(p => {
      const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.mainCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
      const vehicleMatch = isVehicleCompatible(p.compatibleVehicles, currentFilters.selectedVehicle);
      const mainCategoryMatch = currentFilters.mainCategory ? p.mainCategory === currentFilters.mainCategory : true;
      const subCategoryMatch = currentFilters.subCategory ? p.subCategory === currentFilters.subCategory : true;
      const priceMatch = currentFilters.priceRange ? (p.price >= currentFilters.priceRange[0] && p.price <= currentFilters.priceRange[1]) : true;
      const ratingMatch = currentFilters.rating ? p.reviews >= currentFilters.rating : true;
      
      return searchMatch && vehicleMatch && mainCategoryMatch && subCategoryMatch && priceMatch && ratingMatch;
    });

    if (currentFilters.sortOption === 'price_asc') products.sort((a,b) => a.price - b.price);
    if (currentFilters.sortOption === 'price_desc') products.sort((a,b) => b.price - a.price);
    if (currentFilters.sortOption === 'reviews_desc') products.sort((a,b) => b.reviews - a.reviews);
    // 'newest' sorting would require a timestamp on products
    
    return products;
  }, [searchTerm, currentFilters, initialProducts]);

  const filteredAndSortedServices = useMemo(() => {
    let services = initialServices.filter(s => {
      const searchMatch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.mainCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
      const vehicleMatch = isVehicleCompatible(s.compatibleVehicles, currentFilters.selectedVehicle);
      const mainCategoryMatch = currentFilters.mainCategory ? s.mainCategory === currentFilters.mainCategory : true;
      const subCategoryMatch = currentFilters.subCategory ? s.subCategory === currentFilters.subCategory : true;
      const priceMatch = currentFilters.priceRange ? (s.price >= currentFilters.priceRange[0] && s.price <= currentFilters.priceRange[1]) : true;
      const ratingMatch = currentFilters.rating ? s.reviews >= currentFilters.rating : true;

      return searchMatch && vehicleMatch && mainCategoryMatch && subCategoryMatch && priceMatch && ratingMatch;
    });
    
    if (currentFilters.sortOption === 'price_asc') services.sort((a,b) => a.price - b.price);
    if (currentFilters.sortOption === 'price_desc') services.sort((a,b) => b.price - a.price);
    if (currentFilters.sortOption === 'reviews_desc') services.sort((a,b) => b.reviews - a.reviews);
    // 'newest' sorting would require a timestamp on services

    return services;
  }, [searchTerm, currentFilters, initialServices]);


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">{store.name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            {store.address}, {store.location}, {store.wilaya}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Tag className="w-4 h-4 mr-2 text-primary" />
            {store.type}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <StarRating rating={store.rating} />
            <span className="ml-2">({store.rating} stars)</span>
          </div>
        </CardHeader>
        <CardContent>
           {/* Placeholder for Map */}
           <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground my-4 border">
            <MapPin className="w-8 h-8 mr-2" />
            <span>Map Placeholder for {store.address}</span>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-4">
          {activeTab === 'products' ? "Products at this Store" : "Services at this Store"}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder={`Search ${activeTab}...`}
              className="pl-9 sm:pl-10 w-full text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setIsFilterSheetOpen(true)} className="flex-shrink-0">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters & Sort
          </Button>
        </div>
      </div>
      
      <FilterSheet 
        open={isFilterSheetOpen} 
        onOpenChange={setIsFilterSheetOpen}
        currentFilters={currentFilters}
        onApplyFilters={handleApplyFilters}
        activeTab={activeTab} 
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'products' | 'services')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="products">Products ({filteredAndSortedProducts.length})</TabsTrigger>
          <TabsTrigger value="services">Services ({filteredAndSortedServices.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-center text-muted-foreground">No products found at this store matching your criteria.</p>
          )}
        </TabsContent>
        <TabsContent value="services">
           {filteredAndSortedServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {filteredAndSortedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
             <p className="mt-6 text-center text-muted-foreground">No services found at this store matching your criteria.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
