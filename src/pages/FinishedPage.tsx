import React from 'react';
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';

import { BookList } from '../components/books/BookList';
import { PageHeader } from '../components/PageHeader';
import { BookSearch } from '../components/books/BookSearch';
import { Button } from '../components/ui/button';
import { useBooksContext } from '../contexts/BooksContext';

export function FinishedPage() {
  const { books } = useBooksContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortDescending, setSortDescending] = React.useState(true);

  const finishedBooks = React.useMemo(() => books.filter((book) => book.status === 'finished'), [books]);

  const filteredBooks = React.useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const list = finishedBooks.filter((book) => {
      if (!normalized) return true;
      const haystack = [book.title, book.author, book.review].join(' ').toLowerCase();
      return haystack.includes(normalized);
    });

    return list.sort((a, b) => {
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;
      if (ratingA === ratingB) {
        return sortDescending
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
      return sortDescending ? ratingB - ratingA : ratingA - ratingB;
    });
  }, [finishedBooks, searchTerm, sortDescending]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <PageHeader
        title="Finished"
        description="Browse every finished book with ratings and highlights."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <BookSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search finished books" />
            <Button
              variant="outline"
              onClick={() => setSortDescending((value) => !value)}
              className="whitespace-nowrap"
            >
              {sortDescending ? (
                <>
                  <ArrowDownWideNarrow className="mr-2 h-4 w-4" />
                  Rating high → low
                </>
              ) : (
                <>
                  <ArrowUpWideNarrow className="mr-2 h-4 w-4" />
                  Rating low → high
                </>
              )}
            </Button>
          </div>
        }
      />

      <BookList
        books={filteredBooks}
        layout="grid"
        emptyTitle="No finished books yet"
        emptyDescription="Once you mark a book as finished in its markdown front matter, it will appear here."
      />
    </div>
  );
}
