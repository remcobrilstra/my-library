import React from 'react';
import { ArrowLeft, CalendarRange, ExternalLink, Hash, Tag } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { BookList } from '../components/books/BookList';
import { RatingStars } from '../components/books/RatingStars';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useBooksContext } from '../contexts/BooksContext';
import { resolveAssetPath, formatTag } from '../lib/utils';

export function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { books } = useBooksContext();

  const book = React.useMemo(() => books.find((entry) => entry.slug === slug), [books, slug]);

  React.useEffect(() => {
    if (!book) {
      navigate('/', { replace: true });
    }
  }, [book, navigate]);

  if (!book) {
    return null;
  }

  const coverImageSrc = resolveAssetPath(book.coverImage);
  const relatedBooks = books
    .filter((candidate) => candidate.slug !== book.slug && candidate.tags.some((tag) => book.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to library
        </Link>
      </Button>

      <PageHeader
        title={book.title}
        description={`${book.author} · ${book.status.toUpperCase()}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {book.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize">
                <Tag className="mr-1 h-3 w-3" />
                {formatTag(tag)}
              </Badge>
            ))}
          </div>
        }
      />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="space-y-6 rounded-lg border bg-card p-6">
          <div className="flex flex-wrap items-center gap-3">
            <RatingStars rating={book.rating} />
            {book.finishedDate && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarRange className="h-3 w-3" />
                Finished {book.finishedDate}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-semibold capitalize text-muted-foreground">
              <Hash className="h-3 w-3" />
              {book.status}
            </span>
          </div>

          <Separator />

          {book.review ? (
            <div className="prose-review">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{book.review}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No review yet.
            </p>
          )}
        </article>

        <aside className="space-y-4 rounded-lg border bg-card/80 p-6">
          {coverImageSrc && (
            <div className="overflow-hidden rounded-md border border-border/60">
              <img
                src={coverImageSrc}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {(book.amazonUrl || book.bolUrl) && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Buy</h3>
              <div className="flex flex-col gap-2">
                {book.amazonUrl && (
                  <Button asChild size="sm" variant="secondary" className="justify-start gap-2">
                    <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      Amazon.com
                    </a>
                  </Button>
                )}
                {book.bolUrl && (
                  <Button asChild size="sm" variant="secondary" className="justify-start gap-2">
                    <a href={book.bolUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      bol.com
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Details</h3>
            <dl className="space-y-2 text-sm text-muted-foreground">
              {book.isbn && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium text-foreground">ISBN</dt>
                  <dd className="font-mono text-xs text-muted-foreground">{book.isbn}</dd>
                </div>
              )}
              {book.pages && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium text-foreground">Pages</dt>
                  <dd>{book.pages}</dd>
                </div>
              )}
              {book.startedDate && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium text-foreground">Started</dt>
                  <dd>{book.startedDate}</dd>
                </div>
              )}
              {book.finishedDate && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium text-foreground">Finished</dt>
                  <dd>{book.finishedDate}</dd>
                </div>
              )}
              {book.updatedAt && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium text-foreground">Updated</dt>
                  <dd>{new Date(book.updatedAt).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </section>

      {relatedBooks.length > 0 && (
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Related reads</h3>
            <p className="text-sm text-muted-foreground">More titles sharing similar tags.</p>
          </div>
          <BookList books={relatedBooks} layout="grid" highlightFavorite={false} />
        </section>
      )}
    </div>
  );
}
