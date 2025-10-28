import React from 'react';
import { Menu, X } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { BooksProvider } from '../../contexts/BooksContext';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '../ui/sheet';
import { SidebarNav } from './SidebarNav';

export function AppLayout() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <BooksProvider>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden border-r bg-card/40 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[var(--sidebar-width)] lg:flex-col lg:overflow-y-auto">
          <SidebarNav />
        </aside>

        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 lg:hidden">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">My Library</p>
              <p className="text-xs text-muted-foreground">Track finished, active, and wishlisted reads</p>
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex h-full w-full max-w-sm flex-col overflow-y-auto p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Library navigation</SheetTitle>
                </SheetHeader>
                <div className="absolute right-4 top-4 z-10">
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close navigation">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                <SidebarNav onNavigate={() => setIsOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className={cn('flex-1 bg-background')}>
          <div className="mx-auto flex w-full max-w-5xl flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </BooksProvider>
  );
}
