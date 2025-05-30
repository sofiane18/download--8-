"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import FilterSheet, { type Filters } from "@/components/filters/FilterSheet";
import { ProductCard } from "@/components/shared/ProductCard";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { StoreCard } from "@/components/shared/StoreCard";
import { mockProducts, mockServices, mockStores } from "@/lib/mockData";
import type { SelectedVehicle, CompatibleVehicle } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";

const MAX_PRICE_DEFAULT = 20000;

const isVehicleCompatible = (itemCompatibleVehicles: CompatibleVehicle[] | undefined, selectedVehicle?: SelectedVehicle): boolean => {
    if (!selectedVehicle || !selectedVehicle.brand) return true;
    if (!itemCompatibleVehicles || itemCompatibleVehicles.length === 0) return true;
    return itemCompatibleVehicles.some(comp => {
        if (comp.brand !== selectedVehicle.brand) return false;
        if (selectedVehicle.model && comp.model && comp.model !== selectedVehicle.model) return false;
        if (selectedVehicle.year && comp.years && !comp.years.includes(selectedVehicle.year)) return false;
        return true;
    });
};

export default function ExplorePageContent() {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'products' | 'services' | 'stores'>(
        (searchParams.get('tab') as 'products' | 'services' | 'stores') || 'products'
    );
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    const initialFilters: Filters = {
        mainCategory: searchParams.get('mainCategory') || undefined,
        subCategory: searchParams.get('subCategory') || undefined,
        priceRange: [0, MAX_PRICE_DEFAULT],
        rating: 0,
    };
    const [currentFilters, setCurrentFilters] = useState<Filters>(initialFilters);

    useEffect(() => {
        const tabFromParams = searchParams.get('tab') as 'products' | 'services' | 'stores';
        if (tabFromParams) setActiveTab(tabFromParams);
        const mainCatFromParams = searchParams.get('mainCategory');
        const subCatFromParams = searchParams.get('subCategory');
        setCurrentFilters(prev => ({
            ...prev,
            mainCategory: mainCatFromParams || prev.mainCategory,
            subCategory: subCatFromParams || prev.subCategory,
        }));
    }, [searchParams]);

    const handleApplyFilters = (newFilters: Filters) => {
        setCurrentFilters(newFilters);
    };

    const filteredAndSortedProducts = useMemo(() => {
        let products = mockProducts.filter(p => {
            const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.mainCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(searchTerm.toLowerCase());
            const vehicleMatch = isVehicleCompatible(p.compatibleVehicles, currentFilters.selectedVehicle);
            const mainCategoryMatch = currentFilters.mainCategory ? p.mainCategory === currentFilters.mainCategory : true;
            const subCategoryMatch = currentFilters.subCategory ? p.subCategory === currentFilters.subCategory : true;
            const priceMatch = currentFilters.priceRange ? (p.price >= currentFilters.priceRange[0] && p.price <= currentFilters.priceRange[1]) : true;
            const ratingMatch = currentFilters.rating ? p.reviews >= currentFilters.rating : true;
            return searchMatch && vehicleMatch && mainCategoryMatch && subCategoryMatch && priceMatch && ratingMatch;
        });
        if (currentFilters.sortOption === 'price_asc') products.sort((a, b) => a.price - b.price);
        if (currentFilters.sortOption === 'price_desc') products.sort((a, b) => b.price - a.price);
        if (currentFilters.sortOption === 'reviews_desc') products.sort((a, b) => b.reviews - a.reviews);
        return products;
    }, [searchTerm, currentFilters]);

    const filteredAndSortedServices = useMemo(() => {
        let services = mockServices.filter(s => {
            const searchMatch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.mainCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.location.toLowerCase().includes(searchTerm.toLowerCase());
            const vehicleMatch = isVehicleCompatible(s.compatibleVehicles, currentFilters.selectedVehicle);
            const mainCategoryMatch = currentFilters.mainCategory ? s.mainCategory === currentFilters.mainCategory : true;
            const subCategoryMatch = currentFilters.subCategory ? s.subCategory === currentFilters.subCategory : true;
            const priceMatch = currentFilters.priceRange ? (s.price >= currentFilters.priceRange[0] && s.price <= currentFilters.priceRange[1]) : true;
            const ratingMatch = currentFilters.rating ? s.reviews >= currentFilters.rating : true;
            return searchMatch && vehicleMatch && mainCategoryMatch && subCategoryMatch && priceMatch && ratingMatch;
        });
        if (currentFilters.sortOption === 'price_asc') services.sort((a, b) => a.price - b.price);
        if (currentFilters.sortOption === 'price_desc') services.sort((a, b) => b.price - a.price);
        if (currentFilters.sortOption === 'reviews_desc') services.sort((a, b) => b.reviews - a.reviews);
        return services;
    }, [searchTerm, currentFilters]);

    const filteredAndSortedStores = useMemo(() => {
        let stores = mockStores.filter(st => {
            const searchMatch = st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                st.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                st.type.toLowerCase().includes(searchTerm.toLowerCase());
            const wilayaMatch = currentFilters.wilaya ? st.wilaya === currentFilters.wilaya : true;
            const ratingMatch = currentFilters.rating ? st.rating >= currentFilters.rating : true;
            return searchMatch && wilayaMatch && ratingMatch;
        });
        if (currentFilters.sortOption === 'reviews_desc') stores.sort((a, b) => b.rating - a.rating);
        return stores;
    }, [searchTerm, currentFilters]);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search products, services, or stores..."
                        className="pl-9 sm:pl-10 w-full text-sm sm:text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" onClick={() => setIsFilterSheetOpen(true)} className="flex-shrink-0">
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters & Sort
                </Button>
            </div>
            <FilterSheet
                open={isFilterSheetOpen}
                onOpenChange={setIsFilterSheetOpen}
                currentFilters={currentFilters}
                onApplyFilters={handleApplyFilters}
                activeTab={activeTab}
            />
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">Explore Parts, Services & Stores</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Find exactly what your vehicle needs.</p>
                </div>
                <div className="w-full">
                    <div className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                        <button className={activeTab === 'products' ? 'font-bold' : ''} onClick={() => setActiveTab('products')}>Car Products</button>
                        <button className={activeTab === 'services' ? 'font-bold' : ''} onClick={() => setActiveTab('services')}>Car Services</button>
                        <button className={activeTab === 'stores' ? 'font-bold' : ''} onClick={() => setActiveTab('stores')}>Nearby Stores</button>
                    </div>
                    {activeTab === 'products' && (
                        filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
                                {filteredAndSortedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-6 text-center text-muted-foreground">No products found matching your criteria.</p>
                        )
                    )}
                    {activeTab === 'services' && (
                        filteredAndSortedServices.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
                                {filteredAndSortedServices.map((service) => (
                                    <ServiceCard key={service.id} service={service} />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-6 text-center text-muted-foreground">No services found matching your criteria.</p>
                        )
                    )}
                    {activeTab === 'stores' && (
                        filteredAndSortedStores.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
                                {filteredAndSortedStores.map((store) => (
                                    <StoreCard key={store.id} store={store} />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-6 text-center text-muted-foreground">No stores found matching your criteria.</p>
                        )
                    )}
                </div>
            </div>
        </>
    );
}
