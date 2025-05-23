import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  className?: string;
  starClassName?: string;
}

export function StarRating({ rating, maxStars = 5, className, starClassName }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5 text-yellow-400', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" className={cn('w-4 h-4', starClassName)} />
      ))}
      {hasHalfStar && <StarHalf fill="currentColor" className={cn('w-4 h-4', starClassName)} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn('w-4 h-4 text-gray-300', starClassName)} />
      ))}
    </div>
  );
}
