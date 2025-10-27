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
  const hasCoverImage = Boolean(coverImageSrc);
  const isListLayout = layout === 'list';

  const titleRow = (
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
  );

  const authorRow = (
    <CardDescription className="text-sm font-medium text-muted-foreground">
      {book.author}
    </CardDescription>
  );

  const finishedRow = book.finishedDate ? (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <CalendarRange className="h-3 w-3" />
        Finished {book.finishedDate}
      </span>
    </div>
  ) : null;

  const ratingRow = (
    <div className="flex items-center">
      <RatingStars rating={book.rating} />
    </div>
  );

  const tagsRow = book.tags.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {book.tags.map((tag) => (
        <Badge key={tag} variant="outline" className="inline-flex items-center gap-1">
          <Tag className="h-3 w-3" aria-hidden="true" />
          <span className="capitalize">{tag.replace(/-/g, ' ')}</span>
        </Badge>
      ))}
    </div>
  ) : null;

  const statsRow = book.hasReview || book.pages ? (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {book.hasReview && <Badge variant="secondary">Review available</Badge>}
      {book.pages && <span>{book.pages} pages</span>}
    </div>
  ) : null;

  const hasFooter = Boolean(book.isbn || book.updatedAt);

  return (
    <Link
      to={`/books/${book.slug}`}
      className={cn(
        'group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isListLayout ? 'h-full sm:h-full' : 'aspect-[3/4] sm:aspect-[7/10]'
      )}
    >
      <Card
        className={cn(
          'relative flex h-full flex-col overflow-hidden border border-border/70 bg-card transition group-hover:border-primary/60 group-hover:shadow-md',
          isListLayout && 'sm:flex-row',
          !isListLayout && hasCoverImage && 'justify-end'
        )}
      >
        {hasCoverImage && (
          isListLayout ? (
            <div
              className={cn(
                'relative aspect-[3/4] w-full overflow-hidden border-b border-border/80 bg-muted/60',
                'sm:h-full sm:w-44 sm:flex-shrink-0 sm:border-b-0 sm:border-r sm:border-border/80'
              )}
            >
              <img
                src={coverImageSrc}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <>
              <img
                src={coverImageSrc}
                alt={`Cover of ${book.title}`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
            </>
          )
        )}
  {(isListLayout || !hasCoverImage) && (
          <div className="flex flex-1 flex-col">
            <CardHeader className="space-y-3 pb-4">
              {titleRow}
              {authorRow}
              {finishedRow}
            </CardHeader>
            <CardContent className="space-y-4">
              {ratingRow}
              {tagsRow}
              {statsRow}
            </CardContent>
            {hasFooter && (
              <CardFooter className="mt-auto flex flex-wrap gap-2 text-xs text-muted-foreground">
                {book.isbn && <span className="font-mono">ISBN {book.isbn}</span>}
                {book.updatedAt && (
                  <span>Updated {new Date(book.updatedAt).toLocaleDateString()}</span>
                )}
              </CardFooter>
            )}
          </div>
        )}
        {!isListLayout && hasCoverImage && (
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 z-10 h-full translate-y-[calc(100%-6.5rem)] transition-transform duration-500 ease-out',
              'sm:translate-y-[calc(100%-7rem)]',
              'group-hover:translate-y-1/2 group-focus-visible:translate-y-1/2'
            )}
          >
            <div className="flex h-full flex-col overflow-hidden bg-white/95 shadow-[0_-24px_48px_-24px_rgba(15,23,42,0.55)] backdrop-blur-sm">
              <div className="border-t border-border/60 bg-white px-5 py-4 text-sm text-foreground">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-base font-semibold leading-tight">
                      <span>{book.title}</span>
                      {book.status === 'finished' && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="Finished" />
                      )}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {book.author}
                    </div>
                  </div>
                  {isFavorite && (
                    <Badge className="flex items-center gap-1" variant="secondary">
                      <Crown className="h-3 w-3" aria-hidden="true" />
                      Favorite
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto px-5 pt-4 pb-5 text-sm text-muted-foreground">
                <div
                  className={cn(
                    'grid gap-3 transition-opacity duration-300 ease-out',
                    'group-hover:opacity-100 group-focus:opacity-100',
                    'opacity-0'
                  )}
                >
                  {finishedRow}
                  {ratingRow}
                  {tagsRow}
                  {statsRow}
                  {hasFooter && (
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground/90">
                      {book.isbn && <span className="font-mono text-[0.7rem]">ISBN {book.isbn}</span>}
                      {book.updatedAt && (
                        <span>Updated {new Date(book.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}
