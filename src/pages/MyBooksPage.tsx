import React from 'react';

import { BookSearch } from '../components/books/BookSearch';
import { BookList } from '../components/books/BookList';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useBooksContext } from '../contexts/BooksContext';

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

  const handleTagToggle = (tag: string) => {
    setActiveTag((current) => (current === tag ? null : tag));
  };

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
            <div className="flex flex-1 flex-wrap gap-2">
              {tags.map(([tag, total]) => (
                <Button
                  key={tag}
                  variant={activeTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  className="capitalize"
                >
                  <span>{tag.replace(/-/g, ' ')}</span>
                  <Badge variant={activeTag === tag ? 'secondary' : 'outline'} className="ml-2">
                    {total}
                  </Badge>
                </Button>
              ))}
              {activeTag && (
                <Button variant="ghost" size="sm" onClick={() => setActiveTag(null)}>
                  Clear tag filter
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <BookList books={filteredBooks} />
    </div>
  );
}
