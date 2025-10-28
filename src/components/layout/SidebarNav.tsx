import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpenCheck, Heart, ListChecks, Sparkles, Clock } from 'lucide-react';

import { useBooksContext } from '../../contexts/BooksContext';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

interface NavItem {
  to: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  count?: number;
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { counts } = useBooksContext();

  const navItems = React.useMemo<NavItem[]>(
    () => [
      {
        to: '/',
        label: 'Timeline',
        description: 'Your reading journey over time',
        icon: <Clock className="h-4 w-4" aria-hidden="true" />,
      },
      {
        to: '/my-books',
        label: 'My Books',
        description: 'All titles in your personal stacks',
        icon: <BookOpenCheck className="h-4 w-4" aria-hidden="true" />,
        count: counts.total,
      },
      {
        to: '/finished',
        label: 'Finished',
        description: 'Books you have completed with ratings',
        icon: <ListChecks className="h-4 w-4" aria-hidden="true" />,
        count: counts.finished,
      },
      {
        to: '/wishlist',
        label: 'Wishlist',
        description: 'Stories queued up for future reading',
        icon: <Sparkles className="h-4 w-4" aria-hidden="true" />,
        count: counts.wishlist,
      },
      {
        to: '/favorites',
        label: 'Favorites',
        description: 'The titles you recommend most often',
        icon: <Heart className="h-4 w-4" aria-hidden="true" />,
        count: counts.favorites,
      },
    ],
    [counts]
  );

  return (
    <div className="flex h-full min-h-full flex-1 flex-col justify-between gap-6 p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Library
          </div>
          <h1 className="text-2xl font-bold">Reading Companion</h1>
          <p className="text-sm text-muted-foreground">
            Organize the books you love, the ones you are exploring, and the adventures still waiting in your queue.
          </p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onNavigate}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'group flex items-center justify-between rounded-lg border border-transparent px-3 py-2 transition hover:border-border hover:bg-muted',
                  isActive && 'border-primary bg-primary/5 text-primary'
                )
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <div className="flex w-full items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-md border bg-card text-muted-foreground transition group-hover:text-foreground',
                      isActive && 'border-primary bg-primary text-primary-foreground'
                    )}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                  {typeof item.count === 'number' && (
                    <Badge variant={isActive ? 'default' : 'secondary'}>{item.count}</Badge>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-1 rounded-lg border bg-card p-4 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">Made by Remco Brilstra</div>
        <p>
          Read more at{' '}
          <a className="text-primary underline" href="https://remcobrilstra.com" target="_blank" rel="noreferrer">
            remcobrilstra.com
          </a>
          . View the code on{' '}
          <a
            className="text-primary underline"
            href="https://github.com/remcobrilstra/my-library"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
