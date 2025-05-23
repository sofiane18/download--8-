
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Store as StoreIcon, Package, Car, Disc3, Settings2, Filter as FilterIcon, Lightbulb, CircleDotDashed, Cog, Cpu, Armchair } from 'lucide-react';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
}

// Updated to use mainCategory for icon selection
const getProductIcon = (mainCategory: string) => {
  const catLower = mainCategory.toLowerCase();
  if (catLower.includes('mechanical')) return <Cog className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  if (catLower.includes('electronic')) return <Cpu className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  if (catLower.includes('exterior')) return <Car className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  if (catLower.includes('interior')) return <Armchair className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  if (catLower.includes('consumables')) return <FilterIcon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  // Fallbacks based on subCategory if needed, or a generic icon
  return <Package className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
}


export function ProductCard({ product }: ProductCardProps) {
  const ProductIcon = getProductIcon(product.mainCategory);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full bg-muted flex items-center justify-center rounded-t-lg border-b p-2">
          {ProductIcon}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <CardTitle className="text-base sm:text-lg mb-1 line-clamp-2">{product.name}</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground mb-1">{product.subCategory}</p>
        <div className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center">
          <StoreIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> <span className="truncate">{product.store}</span>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mb-2 flex items-center">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> <span className="truncate">{product.location}{product.wilaya ? `, ${product.wilaya}` : ''}</span>
        </div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
           <StarRating rating={product.reviews} starClassName="w-3.5 h-3.5 sm:w-4 sm:w-4" />
           <span className="text-sm sm:text-base font-semibold text-foreground">{product.price} DZD</span>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 mt-auto">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base h-9 sm:h-10">
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

