import React from 'react';
import { CalendarRange, CheckCircle2, Crown, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn, resolveAssetPath } from '../../lib/utils';
import { type BookRecord } from '../../types/book';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { RatingStars } from './RatingStars';

interface BookCardProps {
  book: BookRecord;
  layout?: 'list' | 'grid';
  highlightFavorite?: boolean;
}

export function BookCard({ book, layout = 'grid', highlightFavorite = true }: BookCardProps) {
  const isFavorite = Boolean(book.favorite && highlightFavorite);
  const coverImageSrc = resolveAssetPath(book.coverImage);

  return (
    <Link
      to={`/books/${book.slug}`}
      className={cn(
        'group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        layout === 'list' && 'sm:h-full'
      )}
    >
      <Card
        className={cn(
          'flex h-full flex-col overflow-hidden border border-border/70 transition group-hover:border-primary/60 group-hover:shadow-md',
          layout === 'list' && 'sm:flex-row'
        )}
      >
        {coverImageSrc && (
          <div
            className={cn(
              'relative aspect-[3/4] w-full overflow-hidden border-b border-border/80 bg-muted/60',
              layout === 'list' && 'sm:h-full sm:w-44 sm:flex-shrink-0 sm:border-b-0 sm:border-r sm:border-border/80'
            )}
          >
            <img
              src={coverImageSrc}
              alt={`Cover of ${book.title}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col">
          <CardHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold leading-tight">
              <span>{book.title}</span>
              {book.status === 'finished' && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="Finished" />
              )}
            </CardTitle>
            {isFavorite && (
              <Badge className="flex items-center gap-1" variant="secondary">
                <Crown className="h-3 w-3" aria-hidden="true" />
                Favorite
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm font-medium text-muted-foreground">
            {book.author}
          </CardDescription>
          {book.finishedDate && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarRange className="h-3 w-3" />
                Finished {book.finishedDate}
              </span>
            </div>
          )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <RatingStars rating={book.rating} />
            </div>
            {book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="inline-flex items-center gap-1">
                    <Tag className="h-3 w-3" aria-hidden="true" />
                    <span className="capitalize">{tag.replace(/-/g, ' ')}</span>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {book.hasReview && <Badge variant="secondary">Review available</Badge>}
              {book.pages && <span>{book.pages} pages</span>}
            </div>
          </CardContent>
          <CardFooter className="mt-auto flex flex-wrap gap-2 text-xs text-muted-foreground">
            {book.isbn && <span className="font-mono">ISBN {book.isbn}</span>}
            {book.updatedAt && <span>Updated {new Date(book.updatedAt).toLocaleDateString()}</span>}
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}
