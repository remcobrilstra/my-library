import React from 'react';

import { BookList } from '../components/books/BookList';
import { PageHeader } from '../components/PageHeader';
import { BookSearch } from '../components/books/BookSearch';
import { useBooksContext } from '../contexts/BooksContext';

export function FavoritesPage() {
  const { books } = useBooksContext();
  const [searchTerm, setSearchTerm] = React.useState('');

  const favoriteBooks = React.useMemo(() => books.filter((book) => book.favorite), [books]);

  const filteredBooks = React.useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return favoriteBooks;

    return favoriteBooks.filter((book) => {
      const haystack = [book.title, book.author, book.review, book.tags.join(' ')].join(' ').toLowerCase();
      return haystack.includes(normalized);
    });
  }, [favoriteBooks, searchTerm]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <PageHeader
        title="Favorites"
        description="Books you recommend without hesitation."
        actions={<BookSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search favorites" />}
      />

      <BookList
        books={filteredBooks}
        layout="grid"
        emptyTitle="No favorites yet"
        emptyDescription="Star the books you love most to curate this short list of go-to recommendations."
      />
    </div>
  );
}
