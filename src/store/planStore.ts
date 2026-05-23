/**
 * Zustand store holding the editable plan.
 * Persisted to localStorage.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BackgroundMode,
  Item,
  ItemType,
  PlanSnapshot,
  PlanStats,
  RoundTableItem,
} from '@/types';

interface ItemDefaults {
  round:    Pick<RoundTableItem, 'seats' | 'name' | 'guests' | 'babies'>;
  couple:   { seats: 2; name: string; guests: [string, string] };
  babychair:{ name: string };
  bar:      { label: string; w: number; h: number };
  buffet:   { label: string; w: number; h: number };
  dj:       { label: string; w: number; h: number };
  dance:    { label: string; w: number; h: number };
}

// Default sizes use 1 SVG unit ≈ 5 cm so items match real-world dimensions.
// bar 4.5 m × 1.2 m, buffet 6 m × 1.5 m, DJ 3 m × 2.5 m, dance floor 8 × 7 m.
export const ITEM_DEFAULTS: ItemDefaults = {
  round:    { seats: 10, name: '', guests: [], babies: 0 },
  couple:   { seats: 2,  name: '__default_couple_name', guests: ['', ''] },
  babychair:{ name: '' },
  bar:      { label: '__default_bar',    w: 90,  h: 24 },
  buffet:   { label: '__default_buffet', w: 120, h: 30 },
  dj:       { label: '__default_dj',     w: 60,  h: 50 },
  dance:    { label: '__default_dance',  w: 160, h: 140 },
};

// Default viewBox = zoomed in on the priority rooms
// (Sala Lustrzana, Atrium, Sala Pod Aniołami, Sala Złota, Taras).
export const DEFAULT_VIEW: View = { x: 350, y: 20, w: 1050, h: 920 };

// "Fit all" preset = the whole venue.
export const FIT_ALL_VIEW: View = { x: 0, y: 0, w: 2600, h: 1271 };

export interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PlanState {
  items: Item[];
  selectedId: number | null;
  bgMode: BackgroundMode;
  bgImage: string | null;
  nextTableNum: number;
  nextId: number;
  view: View;

  addItem: (type: ItemType, x: number, y: number) => Item;
  updateItem: (id: number, patch: Partial<Item>) => void;
  deleteItem: (id: number) => void;
  duplicateItem: (id: number) => void;
  select: (id: number | null) => void;
  clearAll: () => void;
  setBackground: (mode?: BackgroundMode, image?: string | null) => void;
  loadSnapshot: (s: PlanSnapshot) => void;
  toSnapshot: () => PlanSnapshot;
  computeStats: () => PlanStats;

  // View / zoom / pan
  setView: (view: View) => void;
  zoomAt: (svgX: number, svgY: number, factor: number) => void;
  panBy: (dx: number, dy: number) => void;
  resetView: () => void;
  fitAll: () => void;
}

function buildItem(
  id: number,
  type: ItemType,
  x: number,
  y: number,
  tableNum: number,
): Item {
  const base = { id, x, y, rotation: 0 };
  switch (type) {
    case 'round':
      return {
        ...base,
        type,
        ...JSON.parse(JSON.stringify(ITEM_DEFAULTS.round)),
        number: tableNum,
        guests: new Array(ITEM_DEFAULTS.round.seats).fill(''),
      } as RoundTableItem;
    case 'couple':
      return {
        ...base,
        type,
        ...JSON.parse(JSON.stringify(ITEM_DEFAULTS.couple)),
      } as Item;
    case 'babychair':
      return {
        ...base,
        type,
        ...JSON.parse(JSON.stringify(ITEM_DEFAULTS.babychair)),
      } as Item;
    default:
      return {
        ...base,
        type,
        ...JSON.parse(JSON.stringify(ITEM_DEFAULTS[type])),
      } as Item;
  }
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedId: null,
      bgMode: 'simplified',
      bgImage: null,
      nextTableNum: 1,
      nextId: 1,
      view: { ...DEFAULT_VIEW },

      addItem: (type, x, y) => {
        const id = get().nextId;
        const tableNum = type === 'round' ? get().nextTableNum : 0;
        const item = buildItem(id, type, x, y, tableNum);
        set((s) => ({
          items: [...s.items, item],
          nextId: s.nextId + 1,
          nextTableNum: type === 'round' ? s.nextTableNum + 1 : s.nextTableNum,
          selectedId: id,
        }));
        return item;
      },

      updateItem: (id, patch) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id ? ({ ...it, ...patch } as Item) : it,
          ),
        })),

      deleteItem: (id) =>
        set((s) => ({
          items: s.items.filter((it) => it.id !== id),
          selectedId: s.selectedId === id ? null : s.selectedId,
        })),

      duplicateItem: (id) => {
        const src = get().items.find((it) => it.id === id);
        if (!src) return;
        const newId = get().nextId;
        const copy = JSON.parse(JSON.stringify(src)) as Item;
        copy.id = newId;
        copy.x += 40;
        copy.y += 40;
        let tableNum = get().nextTableNum;
        if (copy.type === 'round') {
          (copy as RoundTableItem).number = tableNum;
          tableNum += 1;
        }
        set((s) => ({
          items: [...s.items, copy],
          nextId: s.nextId + 1,
          nextTableNum: copy.type === 'round' ? tableNum : s.nextTableNum,
          selectedId: newId,
        }));
      },

      select: (id) => set({ selectedId: id }),

      clearAll: () =>
        set({
          items: [],
          selectedId: null,
          nextTableNum: 1,
          nextId: 1,
        }),

      setBackground: (mode, image) =>
        set((s) => ({
          bgMode: mode ?? s.bgMode,
          bgImage: image === undefined ? s.bgImage : image,
        })),

      loadSnapshot: (snap) =>
        set({
          items: snap.items,
          nextTableNum: snap.nextTableNum,
          nextId: snap.nextId,
          bgMode: snap.bgMode,
          bgImage: snap.bgImage,
          selectedId: null,
        }),

      toSnapshot: () => {
        const s = get();
        return {
          version: 2,
          items: s.items,
          nextTableNum: s.nextTableNum,
          nextId: s.nextId,
          bgMode: s.bgMode,
          bgImage: s.bgImage,
        };
      },

      setView: (view) => set({ view }),

      zoomAt: (svgX, svgY, factor) => {
        const v = get().view;
        // Clamp zoom so it never inverts. Allow up to 50× in, 1× out (full venue).
        const newW = Math.max(60, Math.min(4000, v.w * factor));
        const newH = Math.max(60, Math.min(4000, v.h * factor));
        const realFactor = newW / v.w; // re-derive to honour clamp
        const newX = svgX - (svgX - v.x) * realFactor;
        const newY = svgY - (svgY - v.y) * realFactor;
        set({ view: { x: newX, y: newY, w: newW, h: newH } });
      },

      panBy: (dx, dy) =>
        set((s) => ({
          view: { ...s.view, x: s.view.x + dx, y: s.view.y + dy },
        })),

      resetView: () => set({ view: { ...DEFAULT_VIEW } }),
      fitAll: () => set({ view: { ...FIT_ALL_VIEW } }),

      computeStats: () => {
        const items = get().items;
        const round = items.filter((i): i is RoundTableItem => i.type === 'round');
        const couples = items.filter((i) => i.type === 'couple');
        const babiesStandalone = items.filter((i) => i.type === 'babychair').length;
        const babiesAtTables = round.reduce((s, t) => s + (t.babies || 0), 0);
        const seats =
          round.reduce((s, t) => s + (t.seats || 0), 0) + couples.length * 2;
        const guests =
          round.reduce(
            (s, t) => s + (t.guests || []).filter((g) => g && g.trim()).length,
            0,
          ) +
          couples.reduce(
            (s, t) =>
              s +
              ((t as { guests?: string[] }).guests || []).filter(
                (g) => g && g.trim(),
              ).length,
            0,
          );
        const blocks = items.filter((i) =>
          ['bar', 'buffet', 'dj'].includes(i.type),
        ).length;
        return {
          roundCount: round.length,
          coupleCount: couples.length,
          seats,
          guests,
          babies: babiesStandalone + babiesAtTables,
          blocks,
        };
      },
    }),
    {
      name: 'wvp-state-v2',
      partialize: (s) => ({
        items: s.items,
        bgMode: s.bgMode,
        bgImage: s.bgImage,
        nextTableNum: s.nextTableNum,
        nextId: s.nextId,
        view: s.view,
      }),
    },
  ),
);
