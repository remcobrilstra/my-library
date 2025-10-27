/* eslint-disable no-console */
const fs = require('fs/promises');
const path = require('path');
const matter = require('gray-matter');
const { z } = require('zod');

const ROOT = path.join(__dirname, '..');
const BOOKS_DIR = path.join(ROOT, 'content', 'books');
const OUTPUT_DIR = path.join(ROOT, 'src', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'books.generated.json');

const frontMatterSchema = z
  .object({
    title: z.string(),
    author: z.string(),
    status: z.enum(['reading', 'finished', 'wishlist']).default('reading'),
    tags: z.array(z.string()).default([]),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    favorite: z.coerce.boolean().optional(),
    startedDate: z.union([z.string(), z.date()]).optional(),
    finishedDate: z.union([z.string(), z.date()]).optional(),
    isbn: z.string().optional(),
    coverImage: z.string().min(1).optional(),
    amazonUrl: z.string().url().optional(),
    bolUrl: z.string().url().optional(),
    published: z.string().optional(),
    pages: z.coerce.number().int().positive().optional(),
  })
  .strict();

async function readMarkdownFiles() {
  await fs.mkdir(BOOKS_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const entries = await fs.readdir(BOOKS_DIR, { withFileTypes: true });
  const mdFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md'));

  const books = [];

  for (const file of mdFiles) {
    const filePath = path.join(BOOKS_DIR, file.name);
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);

    const parsed = frontMatterSchema.safeParse(data);
    if (!parsed.success) {
      console.warn(
        `[generate-book-index] skipping ${file.name} because it failed validation:`,
        parsed.error.flatten().fieldErrors
      );
      continue;
    }

    const slug = file.name.replace(/\.md$/, '');
    const review = content.trim();

    books.push({
      id: slug,
      slug,
      ...normalizeDates(parsed.data),
      review,
      hasReview: review.length > 0,
      updatedAt: await getFileMTime(filePath),
    });
  }

  return books.sort((a, b) => a.title.localeCompare(b.title));
}

async function getFileMTime(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime.toISOString();
  } catch (error) {
    console.warn(`[generate-book-index] unable to read modified time for ${filePath}:`, error);
    return null;
  }
}

async function ensureSampleContent() {
  const entries = await fs.readdir(BOOKS_DIR);
  if (entries.some((entry) => entry.endsWith('.md'))) {
    return;
  }

  const samples = [
    {
      filename: 'project-hail-mary.md',
      body: `---
  title: Project Hail Mary
  author: Andy Weir
  status: finished
  rating: 5
  favorite: true
  tags:
    - science-fiction
    - adventure
  isbn: 9780593135204
  coverImage: https://placehold.co/400x600?text=Project+Hail+Mary
  amazonUrl: https://www.amazon.com/dp/0593135202
  bolUrl: https://www.bol.com/nl/nl/p/project-hail-mary/9300000028735596
  finishedDate: 2024-08-12
  ---
  ## A delightful return to hard sci-fi
  
  Andy Weir is at his best when he strands a scientist in an impossible situation. *Project Hail Mary* doubles down on that formula with earnest characters, clever problem solving, and a surprisingly heartfelt friendship.
  
  - Lots of crunchy science without getting bogged down.
  - The pacing never lets up even on a re-read.
  - The ending left me grinning for days.
  `,
    },
    {
      filename: 'legends-and-lattes.md',
      body: `---
  title: Legends & Lattes
  author: Travis Baldree
  status: finished
  rating: 4
  tags:
    - cozy-fantasy
    - slice-of-life
  favorite: true
  isbn: 9781250886088
  coverImage: https://placehold.co/400x600?text=Legends+%26+Lattes
  amazonUrl: https://www.amazon.com/dp/1250886081
  bolUrl: https://www.bol.com/nl/nl/p/legends-lattes/9300000059018247
  finishedDate: 2024-09-02
  ---
  A warm and cozy fantasy about opening a coffee shop. Perfect for rainy afternoons when you want low stakes comfort.
  `,
    },
    {
      filename: 'the-future-is-analog.md',
      body: `---
  title: The Future Is Analog
  author: David Sax
  status: reading
  tags:
    - non-fiction
    - technology
  isbn: 9781541701310
  coverImage: https://placehold.co/400x600?text=The+Future+Is+Analog
  amazonUrl: https://www.amazon.com/dp/1541701313
  bolUrl: https://www.bol.com/nl/nl/p/the-future-is-analog/9300000113614935
  ---
  Currently reading. So far it's a thoughtful look at the human side of digital transformation.
  `,
    },
    {
      filename: 'murderbot-diaries.md',
      body: `---
  title: The Murderbot Diaries
  author: Martha Wells
  status: wishlist
  favorite: false
  tags:
    - science-fiction
    - novellas
  isbn: 9781250214713
  coverImage: https://placehold.co/400x600?text=Murderbot+Diaries
  amazonUrl: https://www.amazon.com/dp/1250214718
  bolUrl: https://www.bol.com/nl/nl/p/the-murderbot-diaries/9300000027871278
  ---
  On the wishlist after hearing rave reviews from friends who love sarcastic protagonists.
  `,
    },
  ];

  await Promise.all(
    samples.map((sample) =>
      fs.writeFile(path.join(BOOKS_DIR, sample.filename), `${sample.body.trim()}\n`, 'utf8')
    )
  );

  console.log('[generate-book-index] Added starter markdown files to content/books');
}

async function writeOutput(books) {
  const payload = { generatedAt: new Date().toISOString(), books };
  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`[generate-book-index] Wrote ${books.length} book(s) to ${path.relative(ROOT, OUTPUT_FILE)}`);
}

function normalizeDates(data) {
  const convert = (value) => {
    if (!value) return undefined;
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    const text = String(value);
    if (!text) return undefined;
    return text;
  };

  return {
    ...data,
    startedDate: convert(data.startedDate),
    finishedDate: convert(data.finishedDate),
  };
}

async function main() {
  await ensureSampleContent();
  const books = await readMarkdownFiles();
  await writeOutput(books);
}

main().catch((error) => {
  console.error('[generate-book-index] Failed to build index');
  console.error(error);
  process.exitCode = 1;
});
