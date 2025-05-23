
import { getItemById, mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/shared/StarRating';
import { MapPin, Store as StoreIconLucide, Tag, CheckCircle, Info, Package, Car, Disc3, Settings2, Filter as FilterIcon, Lightbulb, CircleDotDashed, Cog, Cpu, Armchair } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

interface ProductPageProps {
  params: { id: string };
}

const getProductIconForPage = (mainCategory: string) => {
  const catLower = mainCategory.toLowerCase();
  if (catLower.includes('mechanical')) return <Cog className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
  if (catLower.includes('electronic')) return <Cpu className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
  if (catLower.includes('exterior')) return <Car className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
  if (catLower.includes('interior')) return <Armchair className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
  if (catLower.includes('consumables')) return <FilterIcon className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
  return <Package className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
}


export default async function ProductPage({ params }: ProductPageProps) {
  const product = getItemById(params.id, 'product') as Product | undefined;

  if (!product) {
    notFound();
  }
  
  const ProductIcon = getProductIconForPage(product.mainCategory);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-square bg-muted md:rounded-l-lg flex items-center justify-center border-b md:border-b-0 md:border-r p-4">
            {ProductIcon}
          </div>
          <div className="p-4 sm:p-6 md:p-8 flex flex-col">
            <CardHeader className="p-0 mb-3 sm:mb-4">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5 sm:mb-2">{product.name}</CardTitle>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <StarRating rating={product.reviews} starClassName="w-4 h-4 sm:w-5 sm:h-5" />
                <span>({product.reviews} reviews)</span>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-grow space-y-3 sm:space-y-4">
              <p className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">{product.price} DZD</p>
              
              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-semibold text-foreground flex items-center text-sm sm:text-base"><Info className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />Description</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{product.description}</p>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-semibold text-foreground flex items-center text-sm sm:text-base"><Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />Category</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{product.mainCategory} &gt; {product.subCategory}</p>
              </div>
              
              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-semibold text-foreground flex items-center text-sm sm:text-base"><StoreIconLucide className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />Store</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{product.store}</p>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-semibold text-foreground flex items-center text-sm sm:text-base"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />Location</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{product.location}{product.wilaya ? `, ${product.wilaya}` : ''} - {product.storeAddress}</p>
              </div>
              
              {/* Placeholder for compatibility info based on selected vehicle - would require context/state */}
              {product.compatibleVehicles && product.compatibleVehicles.length > 0 && (
                <div className="p-2 sm:p-3 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="text-xs sm:text-sm font-semibold text-green-700 mb-1">Sample Compatibility:</h4>
                    <ul className="list-disc list-inside text-xs text-green-600 space-y-0.5">
                    {product.compatibleVehicles.slice(0,2).map((v,i) => (
                        <li key={i}>{v.brand} {v.model || ''} {v.years?.join(', ') || ''}</li>
                    ))}
                    </ul>
                </div>
              )}


              <div className="h-32 sm:h-40 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground my-3 sm:my-4 border">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                <span className="text-xs sm:text-sm">Map Placeholder for {product.storeAddress}</span>
              </div>
            </CardContent>
            
            <div className="mt-auto pt-4 sm:pt-6">
              <Button 
                asChild 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base sm:text-lg py-2.5 sm:py-3"
              >
                <Link href={`/confirmation?itemId=${product.id}&itemType=product&itemName=${encodeURIComponent(product.name)}&price=${product.price}`}>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Buy Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

