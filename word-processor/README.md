# Inkwell

A browser-based word processor combining a Word-style formatting toolbar with a Pages-style paginated document canvas.

## Stack

- React + TypeScript + Vite
- [Tiptap](https://tiptap.dev) (ProseMirror) for rich text editing

## Features (v1)

- Rich text editing: bold, italic, underline, strikethrough, text color, highlight, headings (H1-H3), block quotes, bullet/numbered lists, text alignment, links, images, tables, undo/redo
- Paginated page canvas styled as US Letter paper (8.5in x 11in, 1in margins) with page-break guide lines and a live page count
- Editable document title
- Autosave to `localStorage` (debounced) with a save-status indicator
- "Export PDF" uses the browser's native print dialog; the print stylesheet (`@page` in `src/index.css`) reflows the single continuous document into correctly paginated physical pages

## Known limitations / next steps

- The on-screen page-break lines are visual guides computed from content height — text can run across a guide line in the live editor. Real print/PDF export via `window.print()` paginates correctly because it uses the browser's own page layout engine.
- Single document only; no multi-document library, folders, or cloud sync yet.
- No `.docx` import/export yet.
- No collaborative editing.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint
```
