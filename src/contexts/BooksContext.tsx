import React from 'react';

import { books, generatedAt } from '../data/books';
import { type BookRecord } from '../types/book';

interface BooksContextValue {
  books: BookRecord[];
  generatedAt: string;
  counts: {
    total: number;
    finished: number;
    reading: number;
    wishlist: number;
    favorites: number;
  };
}

const BooksContext = React.createContext<BooksContextValue | undefined>(undefined);

export const BooksProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const value = React.useMemo(() => {
    const finished = books.filter((book) => book.status === 'finished').length;
    const reading = books.filter((book) => book.status === 'reading').length;
    const wishlist = books.filter((book) => book.status === 'wishlist').length;
    const favorites = books.filter((book) => book.favorite).length;

    return {
      books,
      generatedAt,
      counts: {
        total: books.length,
        finished,
        reading,
        wishlist,
        favorites,
      },
    };
  }, []);

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};

export function useBooksContext() {
  const ctx = React.useContext(BooksContext);
  if (!ctx) {
    throw new Error('useBooksContext must be used within a BooksProvider');
  }
  return ctx;
}
