
import type { Store } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Tag, Store as StoreIconLucide, Building, ArrowRight } from 'lucide-react'; 
import { StarRating } from './StarRating';

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  const StoreIcon = store.type.toLowerCase().includes('service') || store.type.toLowerCase().includes('garage') ? 
    <Building className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" /> : 
    <StoreIconLucide className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
         <div className="aspect-[3/2] relative w-full bg-muted flex items-center justify-center rounded-t-lg border-b p-2">
          {StoreIcon}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <CardTitle className="text-base sm:text-lg mb-1 line-clamp-2">{store.name}</CardTitle>
        <div className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> <span className="truncate">{store.location}, {store.wilaya}</span>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mb-2 flex items-center">
          <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> <span className="truncate">{store.type}</span>
        </div>
        <StarRating rating={store.rating} starClassName="w-3.5 h-3.5 sm:w-4 sm:w-4" />
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 mt-auto">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base h-9 sm:h-10">
          <Link href={`/stores/${store.id}`}>
            View Store <ArrowRight className="ml-1.5 h-4 w-4"/>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
