import React from 'react';

import { BookSearch } from '../components/books/BookSearch';
import { BookList } from '../components/books/BookList';
import { PageHeader } from '../components/PageHeader';
import { Separator } from '../components/ui/separator';
import { useBooksContext } from '../contexts/BooksContext';
import { formatTag } from '../lib/utils';

export function MyBooksPage() {
  const { books, counts } = useBooksContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  const tags = React.useMemo(() => {
    const map = new Map<string, number>();
    books.forEach((book) => {
      book.tags.forEach((tag) => map.set(tag, (map.get(tag) ?? 0) + 1));
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [books]);

  const filteredBooks = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return books.filter((book) => {
      const matchesTag = activeTag ? book.tags.includes(activeTag) : true;
      if (!matchesTag) return false;

      if (!normalizedSearch) return true;

      const haystack = [
        book.title,
        book.author,
        book.tags.join(' '),
        book.review,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [books, searchTerm, activeTag]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <PageHeader
        title="My Books"
        description="Browse every book in your personal stacks. Filter by tag or search across reviews."
        actions={<BookSearch value={searchTerm} onChange={setSearchTerm} />}
      />

      <section className="mb-6 rounded-lg border bg-card/60 p-5">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Overview</p>
            <div className="flex flex-wrap gap-4 font-medium text-foreground">
              <span>Total: {counts.total}</span>
              <span>Finished: {counts.finished}</span>
              <span>Reading: {counts.reading}</span>
              <span>Wishlist: {counts.wishlist}</span>
              <span>Favorites: {counts.favorites}</span>
            </div>
          </div>
          {tags.length > 0 && <Separator className="hidden h-8 sm:block" orientation="vertical" />}
          {tags.length > 0 && (
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <label htmlFor="tag-filter" className="text-xs uppercase tracking-wide text-muted-foreground">
                Filter by tag
              </label>
              <select
                id="tag-filter"
                value={activeTag ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  setActiveTag(value === '' ? null : value);
                }}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All tags</option>
                {tags.map(([tag, total]) => (
                  <option key={tag} value={tag} className="capitalize">
                    {`${formatTag(tag)} (${total})`}
                  </option>
                ))}
              </select>
              {activeTag && (
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <BookList books={filteredBooks} />
    </div>
  );
}
