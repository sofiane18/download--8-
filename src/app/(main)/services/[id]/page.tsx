
import { getItemById, mockServices } from '@/lib/mockData';
import type { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/shared/StarRating';
import { MapPin, Store as StoreIconLucide, Tag, CheckCircle, Info, Wrench, Car, ShieldCheck, Settings, Droplets, ScanLine, PenToolIcon as Tool, Gauge, PaintRoller, CircleDotDashed, Bolt, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return mockServices.map((service) => ({
    id: service.id,
  }));
}

interface ServicePageProps {
  params: { id: string };
}

const getServiceIconForPage = (mainCategory: string) => {
  const catLower = mainCategory.toLowerCase();
  if (catLower.includes('mechanical')) return <Wrench className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
  if (catLower.includes('electrical')) return <Bolt className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
  if (catLower.includes('maintenance')) return <ShieldCheck className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
  if (catLower.includes('custom')) return <Sparkles className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
  return <Car className="w-20 h-20 sm:w-28 sm:h-28 text-muted-foreground" />;
}


export default async function ServicePage({ params }: ServicePageProps) {
  const service = getItemById(params.id, 'service') as Service | undefined;

  if (!service) {
    notFound();
  }

  const ServiceIcon = getServiceIconForPage(service.mainCategory);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-square bg-muted md:rounded-l-lg flex items-center justify-center border-b md:border-b-0 md:border-r p-4">
            {ServiceIcon}
          </div>
          <div className="p-4 sm:p-6 md:p-8 flex flex-col">
            <CardHeader className="p-0 mb-3 sm:mb-4">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5 sm:mb-2">{service.name}</CardTitle>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <StarRating rating={service.reviews} starClassName="w-4 h-4 sm:w-5 sm:h-5" />
                <span>({service.reviews} reviews)</span>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-grow space-y-3 sm:space-y-4">
              <p className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">{service.price} DZD</p>
              
              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-semibold text-foreground flex items-center text-sm sm:text-base"><Info className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />Description</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{service.description}</p>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-semibold text-foreground flex items-center text-sm sm:text-base"><Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />Category</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{service.mainCategory} &gt; {service.subCategory}</p>
              </div>
              
              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-semibold text-foreground flex items-center text-sm sm:text-base"><Wrench className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />Service Provider</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{service.store}</p>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="font-semibold text-foreground flex items-center text-sm sm:text-base"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />Location</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{service.location}{service.wilaya ? `, ${service.wilaya}` : ''} - {service.storeAddress}</p>
              </div>
              
               {/* Placeholder for compatibility info - services are often less specific but can be */}
               {service.compatibleVehicles && service.compatibleVehicles.length > 0 && (
                <div className="p-2 sm:p-3 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="text-xs sm:text-sm font-semibold text-green-700 mb-1">Sample Compatibility:</h4>
                    <ul className="list-disc list-inside text-xs text-green-600 space-y-0.5">
                    {service.compatibleVehicles.slice(0,1).map((v,i) => ( // Show fewer for services
                        <li key={i}>{v.brand} {v.model || ''} {v.years?.join(', ') || ''}</li>
                    ))}
                    {service.compatibleVehicles.length === 0 && <li>Applicable to most vehicles</li>}
                    </ul>
                </div>
              )}


              <div className="h-32 sm:h-40 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground my-3 sm:my-4 border">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                <span className="text-xs sm:text-sm">Map Placeholder for {service.storeAddress}</span>
              </div>
            </CardContent>
            
            <div className="mt-auto pt-4 sm:pt-6">
               <Button 
                asChild 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base sm:text-lg py-2.5 sm:py-3"
              >
                <Link href={`/confirmation?itemId=${service.id}&itemType=service&itemName=${encodeURIComponent(service.name)}&price=${service.price}`}>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Book Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

