export type BookStatus = 'reading' | 'finished' | 'wishlist';

export interface BookRecord {
  id: string;
  slug: string;
  title: string;
  author: string;
  status: BookStatus;
  tags: string[];
  rating?: number;
  favorite?: boolean;
  startedDate?: string;
  finishedDate?: string;
  isbn?: string;
  published?: string;
  pages?: number;
  review: string;
  hasReview: boolean;
  updatedAt: string | null;
}

export interface BooksPayload {
  generatedAt: string;
  books: BookRecord[];
}
