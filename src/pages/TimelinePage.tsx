import React from 'react';
import { BookOpen, Calendar, Clock, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useBooksContext } from '../contexts/BooksContext';
import { BookRecord } from '../types/book';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { cn } from '../lib/utils';

function TimelineItem({ book, isReading }: { book: BookRecord; isReading: boolean }) {
  const displayDate = book.finishedDate || book.startedDate;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="group relative flex gap-6 pb-12">
      {/* Timeline line and dot */}
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            'z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background shadow-lg transition-all duration-300 group-hover:scale-110',
            isReading
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 group-hover:from-amber-300 group-hover:to-orange-400'
              : book.favorite
                ? 'bg-gradient-to-br from-pink-400 to-rose-500 group-hover:from-pink-300 group-hover:to-rose-400'
                : 'bg-gradient-to-br from-blue-400 to-indigo-500 group-hover:from-blue-300 group-hover:to-indigo-400'
          )}
        >
          {isReading ? (
            <BookOpen className="h-6 w-6 text-white" />
          ) : book.favorite ? (
            <Star className="h-6 w-6 fill-white text-white" />
          ) : (
            <Clock className="h-6 w-6 text-white" />
          )}
        </div>
        <div className="absolute top-12 h-full w-0.5 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
      </div>

      {/* Content card */}
      <Link
        to={`/books/${book.slug}`}
        className="flex-1 transition-transform group-hover:-translate-y-1"
      >
        <Card
          className={cn(
            'overflow-hidden border-2 transition-all duration-300 group-hover:border-primary group-hover:shadow-xl',
            isReading && 'border-amber-400/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20'
          )}
        >
          <div className="flex gap-4 p-5">
            {/* Book cover */}
            {book.coverImage && (
              <div className="flex-shrink-0">
                <div className="relative h-32 w-24 overflow-hidden rounded-lg border shadow-md transition-transform group-hover:scale-105">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Book details */}
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">by {book.author}</p>
                </div>
                {isReading && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    Currently Reading
                  </Badge>
                )}
              </div>

              {formattedDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              )}

              {book.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const rating = book.rating || 0;
                    return (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-muted text-muted'
                        )}
                      />
                    );
                  })}
                  <span className="ml-2 text-sm font-medium">{book.rating}/5</span>
                </div>
              )}

              {book.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="capitalize">
                      {tag.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

export function TimelinePage() {
  const { books } = useBooksContext();

  const sortedBooks = React.useMemo(() => {
    // Separate reading books and finished books
    const readingBooks = books.filter((b) => b.status === 'reading');
    const finishedBooks = books
      .filter((b) => b.status === 'finished')
      .sort((a, b) => {
        const dateA = a.finishedDate || a.startedDate || a.updatedAt || '';
        const dateB = b.finishedDate || b.startedDate || b.updatedAt || '';
        return dateB.localeCompare(dateA); // Most recent first
      });

    // Reading books first, then finished books
    return [...readingBooks, ...finishedBooks];
  }, [books]);

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Hero header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-4 shadow-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400">
          My Reading Journey
        </h1>
        <p className="text-lg text-muted-foreground">
          A timeline of books that have shaped my thinking and sparked my curiosity
        </p>
      </div>

      {/* Timeline */}
      <div className="mx-auto w-full max-w-3xl">
        {sortedBooks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-muted p-12 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              No books in your library yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Start adding books to see your reading journey
            </p>
          </div>
        ) : (
          <div className="relative">
            {sortedBooks.map((book) => (
              <TimelineItem
                key={book.id}
                book={book}
                isReading={book.status === 'reading'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
