# My Library

My Library is an open-source React application for tracking the books you read, plan to read, and recommend to others. It combines Tailwind CSS styling with shadcn/ui components and uses statically generated markdown content so contributors can manage the library with simple text files.

- **My Books** – browse the full catalog with tag filters, rich metadata, and fast search.
- **Finished** – focus on the books you have completed, complete with ratings and notes.
- **Wishlist** – collect upcoming reads with quick context snippets.
- **Favorites** – highlight the titles you recommend most often.

## Getting Started

Follow these steps to run the project locally:

1. Fork the repository on GitHub, then clone your fork and install dependencies:
	```bash
	git clone https://github.com/<your-username>/my-library.git
	cd my-library
	npm install
	```
2. Update the `homepage` field in `package.json` to match your GitHub Pages URL (for example, `https://<your-username>.github.io/my-library`).
3. Start the development server (content is regenerated automatically before booting):
	```bash
	npm start
	```
	The app runs at `http://localhost:3000` by default.
4. Build a production bundle:
	```bash
	npm run build
	```
5. Deploy the site to GitHub Pages after your content is ready:
	```bash
	npm run deploy
	```

## Editing Book Content

All book entries live in the markdown files under `content/books`. Each file uses YAML front matter to describe the book and optional Markdown body content for notes or reviews. The filename format helps with ordering (for example, `2025-atomic-habits.md`).

```yaml
---
title: Atomic Habits
author: James Clear
status: finished       # finished | reading | wishlist
favorite: true         # optional boolean
rating: 5              # optional 1-5 scale
coverImage: /images/atomic-habits.jpg
tags:
  - self improvement
  - time management
---

Write your review or summary here.
```

- Remove the sample markdown files in `content/books` before adding your own collection.
- Add new books by creating markdown files that follow the same structure.
- Update existing records by editing the front matter or body text.

Whenever you add or modify content, run `npm run generate:content` to regenerate `src/data/books.generated.json`. This script is also executed automatically before `npm start` and `npm run build` so the UI always reflects the latest Markdown files.

Contributions are welcome—open an issue or submit a pull request with ideas for improvements.

