
import type { Service } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Wrench, Car, ShieldCheck, Settings, Droplets, ScanLine, PenToolIcon as Tool, Gauge, PaintRoller, CircleDotDashed, Bolt, Sparkles } from 'lucide-react';
import { StarRating } from './StarRating';

interface ServiceCardProps {
  service: Service;
}

// Updated to use mainCategory for icon selection
const getServiceIcon = (mainCategory: string) => {
  const catLower = mainCategory.toLowerCase();
  if (catLower.includes('mechanical')) return <Wrench className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  if (catLower.includes('electrical')) return <Bolt className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  if (catLower.includes('maintenance')) return <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  if (catLower.includes('custom')) return <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  // Fallbacks
  if (catLower.includes('wash') || catLower.includes('clean') || catLower.includes('detail')) return <Droplets className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
  return <Car className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />;
}


export function ServiceCard({ service }: ServiceCardProps) {
  const ServiceIcon = getServiceIcon(service.mainCategory);
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full bg-muted flex items-center justify-center rounded-t-lg border-b p-2">
          {ServiceIcon}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <CardTitle className="text-base sm:text-lg mb-1 line-clamp-2">{service.name}</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground mb-1">{service.subCategory}</p>
         <div className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center">
          <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> <span className="truncate">{service.store}</span>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mb-2 flex items-center">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> <span className="truncate">{service.location}{service.wilaya ? `, ${service.wilaya}` : ''}</span>
        </div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
            <StarRating rating={service.reviews} starClassName="w-3.5 h-3.5 sm:w-4 sm:w-4" />
            <span className="text-sm sm:text-base font-semibold text-foreground">{service.price} DZD</span>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 mt-auto">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base h-9 sm:h-10">
          <Link href={`/services/${service.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

