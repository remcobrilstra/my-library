import React from 'react';
import { Star } from 'lucide-react';

import { cn } from '../../lib/utils';

interface RatingStarsProps {
  rating?: number;
  outOf?: number;
  compact?: boolean;
}

export function RatingStars({ rating, outOf = 5, compact = false }: RatingStarsProps) {
  if (!rating) {
    return null;
  }

  return (
    <div
      className={cn('flex items-center gap-1 text-amber-500', compact && 'text-xs')}
      aria-label={`Rated ${rating} out of ${outOf} stars`}
    >
      {Array.from({ length: outOf }, (_, index) => {
        const value = index + 1;
        const isFilled = value <= rating;
        return (
          <Star
            key={value}
            className={cn(
              'h-4 w-4 sm:h-5 sm:w-5 transition-colors',
              isFilled ? 'fill-current' : 'text-muted-foreground'
            )}
          />
        );
      })}
      {!compact && (
        <span className="ml-1 text-xs font-medium text-muted-foreground">{rating}</span>
      )}
    </div>
  );
}
