
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Search, 
  LayoutGrid, 
  Store as StoreIconLucide, 
  Sparkles, 
  Package, 
  Wrench,
  Cog, // For Mechanical Products
  Cpu, // For Electronic Products
  Car, // For Exterior Products
  Armchair, // For Interior Products
  Filter as FilterIcon, // For Consumables (already imported as Filter, aliasing for clarity if needed)
  Bolt, // For Electrical Services
  ShieldCheck, // For Maintenance Services
  type LucideIcon
} from 'lucide-react';
import { productCategories, serviceCategories } from '@/lib/mockData';
import type { Category } from '@/lib/types';

const iconMap: { [key: string]: LucideIcon } = {
  Cog, Cpu, Car, Armchair, FilterIcon, Wrench, Bolt, ShieldCheck, Sparkles, // For main categories
  Package, StoreIconLucide, Search, LayoutGrid, ArrowRight // Utility icons
};

const CategoryCard = ({ title, categories, type }: { title: string, categories: Category[], type: 'product' | 'service' }) => (
  <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow">
    <CardHeader>
      <CardTitle className="flex items-center text-lg sm:text-xl">
        {type === 'product' ? <Package className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" /> : <Wrench className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow space-y-1.5 overflow-y-auto max-h-60 custom-scrollbar">
      {categories.map(cat => {
        const IconComponent = iconMap[cat.iconName as string] || LayoutGrid; // Fallback icon
        return (
          <Link 
            key={cat.id} 
            // Link to explore with main category pre-selected
            href={`/explore?tab=${type}s&mainCategory=${encodeURIComponent(cat.name)}`}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted transition-colors"
            aria-label={`Explore ${cat.name}`}
          >
            <span className="flex items-center text-sm sm:text-base">
              <IconComponent className="mr-2.5 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" /> 
              {cat.name}
            </span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </Link>
        );
      })}
    </CardContent>
  </Card>
);

export default function NewHomePage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">Welcome to AutoDinar</h1>
        <p className="mt-1.5 text-md sm:text-lg text-muted-foreground">Your smart automotive companion in Algeria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <Link href="/explore" className="lg:col-span-3 block group">
          <Card className="h-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl">
                <Search className="mr-2.5 h-6 w-6 sm:h-7 sm:w-7" /> Explore All Products & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base opacity-90">Dive into our comprehensive catalog. Select your vehicle to find compatible parts and services.</p>
              <div className="mt-3 text-right">
                <span className="inline-flex items-center font-semibold group-hover:underline text-sm sm:text-base">
                  Start Exploring <ArrowRight className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5"/>
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <CategoryCard title="Product Categories" categories={productCategories} type="product" />
        <CategoryCard title="Service Categories" categories={serviceCategories} type="service" />

        <Link href="/explore?tab=stores" className="block group">
          <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <StoreIconLucide className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" /> Nearby Stores
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-xs sm:text-sm">Discover trusted auto part retailers and service centers in your area. Quality and convenience, guaranteed.</p>
            </CardContent>
             <CardContent className="mt-auto text-right pt-0">
                <span className="inline-flex items-center font-semibold text-primary group-hover:underline text-sm sm:text-base">
                  Find Stores <ArrowRight className="ml-1.5 h-4 w-4"/>
                </span>
              </CardContent>
          </Card>
        </Link>
        
        <Link href="/recommendations" className="md:col-span-2 lg:col-span-3 block group">
           <Card className="h-full bg-accent text-accent-foreground shadow-xl hover:bg-accent/90 transition-all transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl">
                <Sparkles className="mr-2.5 h-6 w-6 sm:h-7 sm:w-7" /> AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base opacity-90">Let our smart AI guide you to the best products and services tailored for your vehicle and past purchases.</p>
               <div className="mt-3 text-right">
                <span className="inline-flex items-center font-semibold group-hover:underline text-sm sm:text-base">
                  Get AI Picks <ArrowRight className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5"/>
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

