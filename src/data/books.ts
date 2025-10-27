import booksPayload from './books.generated.json';
import { type BookRecord, type BooksPayload } from '../types/book';

const typedPayload = booksPayload as BooksPayload;

export const books: BookRecord[] = typedPayload.books;
export const generatedAt = typedPayload.generatedAt;

export function getBooksByStatus(status: BookRecord['status']) {
  return books.filter((book) => book.status === status);
}

export function getFavorites() {
  return books.filter((book) => book.favorite);
}

export function getTags() {
  const tagSet = new Set<string>();
  books.forEach((book) => book.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
