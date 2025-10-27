import React from 'react';

import { BookSearch } from '../components/books/BookSearch';
import { BookList } from '../components/books/BookList';
import { PageHeader } from '../components/PageHeader';
import { useBooksContext } from '../contexts/BooksContext';

export function WishlistPage() {
  const { books } = useBooksContext();
  const [searchTerm, setSearchTerm] = React.useState('');

  const wishlistBooks = React.useMemo(
    () => books.filter((book) => book.status === 'wishlist'),
    [books]
  );

  const filteredBooks = React.useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return wishlistBooks;

    return wishlistBooks.filter((book) => {
      const haystack = [book.title, book.author, book.review, book.tags.join(' ')].join(' ').toLowerCase();
      return haystack.includes(normalized);
    });
  }, [wishlistBooks, searchTerm]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <PageHeader
        title="Wishlist"
        description="Stories that caught your eye and deserve a place on your future reading list."
        actions={<BookSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search wishlist" />}
      />

      <BookList
        books={filteredBooks}
        layout="grid"
        emptyTitle="Wishlist is empty"
        emptyDescription="Track books you hope to read by adding them to your library."
        highlightFavorite={false}
      />
    </div>
  );
}
