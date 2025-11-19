# react-virtualization

A small demo project that implements a simple, custom virtualizer for long lists using React + TypeScript + Vite. The goal is to demonstrate the core idea behind windowing/virtualization (rendering only visible items) with a minimal implementation.

## Running locally
1. Install dependencies:
   - `yarn` or `npm install`
2. Start dev server:
   - `yarn dev` or `npm run dev`
3. Open the app (Vite will print the local URL, typically `http://localhost:5173/`).

## API sketch for `useVirtualizer`
The repository includes a `UseVirtualizerProps` interface as a starting point:

- `count: number` — total number of items
- `getScrollElement: () => HTMLElement | null` — accessor for the scroll container (used for reading `scrollTop`, attaching listeners)
- `estimateItemSize: () => number` — estimated height of an item (for fixed-height it returns the exact height)
- `overscan: number` — how many items to render before/after the visible range

The hook should return:
- `virtualItems` — list of { index, offset, size, key } for rendering
- `totalSize` — total scrollable height
- optional helpers: `scrollToIndex`, `measure`, etc.

## Performance notes & suggestions
- Fixed-height virtualization is the simplest and fastest approach.
- For variable heights, implement an index -> offset cache and update measurements on render.
- Consider recycling DOM nodes for very hot updates or expensive item mounts.
- Batch scroll updates with `requestAnimationFrame` or use a passive listener to avoid layout thrashing.

## Contributing
This project is a small learning/demo repo. Feel free to open issues or PRs to:
- Improve the `useVirtualizer` implementation.
- Add examples or documentation.
- Fix bugs and performance issues.
