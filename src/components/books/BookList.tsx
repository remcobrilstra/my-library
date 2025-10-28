import React from 'react';

import { type BookRecord } from '../../types/book';
import { Separator } from '../ui/separator';
import { BookCard } from './BookCard';

interface BookListProps {
  books: BookRecord[];
  layout?: 'grid' | 'list';
  emptyTitle?: string;
  emptyDescription?: string;
  highlightFavorite?: boolean;
}

export function BookList({
  books,
  layout = 'grid',
  emptyTitle = 'No books yet',
  emptyDescription = 'Add markdown files under content/books to populate your library.',
  highlightFavorite = true,
}: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-10 text-center">
        <div className="text-lg font-semibold">{emptyTitle}</div>
        <div className="mt-2 text-sm text-muted-foreground">{emptyDescription}</div>
      </div>
    );
  }

  return (
    <div className={layout === 'grid' ? 'space-y-6' : 'space-y-8'}>
      {layout === 'grid' ? (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} highlightFavorite={highlightFavorite} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {books.map((book, index) => (
            <React.Fragment key={book.id}>
              <BookCard book={book} layout="list" highlightFavorite={highlightFavorite} />
              {index < books.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
