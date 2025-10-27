import React from 'react';
import { Menu } from 'lucide-react';
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
        <aside className="hidden border-r bg-card/40 lg:flex lg:h-screen lg:w-[var(--sidebar-width)] lg:flex-col">
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
                <SidebarNav onNavigate={() => setIsOpen(false)} />
                <div className="border-t bg-background/80 p-4">
                  <SheetClose asChild>
                    <Button className="w-full" variant="ghost">
                      Close
                    </Button>
                  </SheetClose>
                </div>
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
