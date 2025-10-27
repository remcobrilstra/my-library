import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/layout/AppLayout';
import { BookDetailPage } from './pages/BookDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { FinishedPage } from './pages/FinishedPage';
import { MyBooksPage } from './pages/MyBooksPage';
import { WishlistPage } from './pages/WishlistPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<MyBooksPage />} />
          <Route path="finished" element={<FinishedPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="books/:slug" element={<BookDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
