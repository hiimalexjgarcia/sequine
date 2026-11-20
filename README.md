# Sequine

Sequine is a browser-based note-taking board arranged as a full-viewport 3-by-3 grid:

| FACTS | MERITS | PEOPLE |
| --- | --- | --- |
| THOUGHTS | FOCUS | ACTIONS |
| FEELINGS | NEEDS | TOPICS |

Double-click a region to edit its notes. Drag the dividers to resize rows and columns. The board fills the viewport and adjusts its layout when the window is resized.

The **Save** button becomes active when notes or divider positions change. Saving downloads an editable HTML copy that includes the notes, divider positions, and viewport dimensions. If the copy is opened at a different viewport size, the dividers are adjusted proportionally. The filename starts with `Sequine: `, followed by the FOCUS text and the save time in ISO 8601 format.

## Development

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Create a production build with:

```sh
npm run build
```
