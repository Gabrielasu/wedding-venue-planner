# Wedding Venue Planner

An interactive seating-plan editor for a wedding venue. Drop round tables, a
rectangular couple's table, baby chairs, a bar, buffet, DJ booth, and a dance
floor onto a stylized floor plan of the venue. Each table tracks its own guest
list. Export the result as PNG or PDF.

Built for a specific venue (the rooms `Sala Lustrzana`, `Atrium`,
`Sala Pod Aniołami`, `Sala Złota` and `Taras` are drawn into the simplified
floor plan), but works fine with any uploaded floor-plan image as a background.

UI is available in **Polish** (default) and **English**.

---

## Stack

- **React 18** + **TypeScript**
- **Vite** for dev / build
- **Zustand** (with `persist` middleware) for app state and language preference
- **jsPDF** for PDF export
- Native SVG for rendering — no canvas / pixi / konva dependency

## Project layout

```
wedding-venue-planner/
├── index.html              # Vite entry
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx            # React root
│   ├── App.tsx
│   ├── components/
│   │   ├── Toolbar.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── Palette.tsx
│   │   ├── Canvas.tsx
│   │   ├── FloorPlan.tsx       # SVG of the venue (Sala Lustrzana, Atrium, etc.)
│   │   ├── PlacedItem.tsx
│   │   ├── Inspector.tsx       # Right-hand properties panel
│   │   └── GuestModal.tsx
│   ├── store/
│   │   └── planStore.ts        # Zustand store, persistence, stats
│   ├── i18n/
│   │   ├── translations.ts     # PL + EN dictionaries
│   │   └── useTranslation.ts   # t() hook + standalone tStandalone()
│   ├── lib/
│   │   └── export.ts           # PNG, PDF, JSON save/load
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── index.ts            # Discriminated-union item types
└── README.md
```

## Quick start

```bash
npm install
npm run dev
```

Vite will open the app at `http://localhost:5173`.

Other scripts:

```bash
npm run build       # tsc --noEmit && vite build → dist/
npm run preview     # serve the production build
npm run typecheck   # tsc --noEmit only
```

## Features

- **Floor plan** drawn as SVG, with the priority rooms highlighted in warm gold.
  Toggle between the simplified plan and an uploaded background image
  (`Toolbar → Upload floor plan`).
- **Palette** of items: round table (up to 10 seats), couple's rectangular
  table, baby chair, bar, buffet, DJ booth, dance floor. Click to drop one
  onto the canvas.
- **Drag** items to reposition. Click to select. Drag the orange handle above
  a selected item to rotate. `Delete` / `Backspace` removes the selection.
- **Inspector** (right panel) edits the selected item: table number, name,
  seat count, baby chairs at this table, per-seat guest names (via a modal),
  position, rotation, and the size of bar/buffet/DJ/dance floor.
- **Live stats** in the toolbar: tables, seats, named guests, baby chairs.
- **Save / load** plans as JSON. **Export** to PNG (single image) or PDF
  (A3 landscape, plus a second page with the full guest list per table).
- **Auto-save** to `localStorage` so closing the tab doesn't lose work.
- **Language toggle** (PL / EN) in the toolbar. Room names stay in Polish in
  both languages — they're the venue's proper nouns — but every UI string is
  translated. The main-entrance arrow swaps to English when EN is active.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Delete` / `Backspace` | Delete the selected item |
| `Escape` | Deselect / close modal |

## How the floor plan is drawn

The SVG in `src/components/FloorPlan.tsx` uses a `viewBox` of `0 0 2600 1271`
so its coordinate space matches the dimensions of the original floor-plan
image. Each room is a single `<path>` or `<rect>`. Priority rooms (the
five where guests are actually seated) get the `priority` class which
highlights them with a warm gold border.

If you have a different venue, you can replace the JSX in `FloorPlan.tsx`
with your own room geometry, or simply ignore the simplified plan and
upload your own floor-plan image via the toolbar.

## License

MIT — see [LICENSE](./LICENSE).
