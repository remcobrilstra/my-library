import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveAssetPath(assetPath?: string) {
  if (!assetPath) {
    return undefined;
  }

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const base = process.env.PUBLIC_URL ?? '';
  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;

  if (!normalizedBase) {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
}

export function formatTag(tag: string) {
  return tag.replace(/-/g, ' ');
}
