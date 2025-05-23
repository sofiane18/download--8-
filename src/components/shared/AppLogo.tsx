import { Car } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <Car className="h-8 w-8" />
      <span className="text-2xl font-bold">AutoDinar</span>
    </Link>
  );
}
