/**
 * Domain types for items placed on the venue floor plan.
 */

export type ItemType =
  | 'round'
  | 'couple'
  | 'babychair'
  | 'bar'
  | 'buffet'
  | 'dj'
  | 'dance';

interface BaseItem {
  id: number;
  type: ItemType;
  x: number;
  y: number;
  rotation: number;
}

export interface RoundTableItem extends BaseItem {
  type: 'round';
  number: number;
  seats: number;
  name: string;
  guests: string[];
  babies: number;
}

export interface CoupleTableItem extends BaseItem {
  type: 'couple';
  seats: 2;
  name: string;
  guests: [string, string];
}

export interface BabyChairItem extends BaseItem {
  type: 'babychair';
  name: string;
}

interface BlockBase extends BaseItem {
  label: string; // user-editable; may start with `__` for translation key
  w: number;
  h: number;
}
export interface BarItem    extends BlockBase { type: 'bar' }
export interface BuffetItem extends BlockBase { type: 'buffet' }
export interface DJItem     extends BlockBase { type: 'dj' }
export interface DanceItem  extends BlockBase { type: 'dance' }

export type BlockItem = BarItem | BuffetItem | DJItem | DanceItem;

export type Item = RoundTableItem | CoupleTableItem | BabyChairItem | BlockItem;

export type BackgroundMode = 'simplified' | 'image';

export interface PlanSnapshot {
  version: number;
  items: Item[];
  nextTableNum: number;
  nextId: number;
  bgMode: BackgroundMode;
  bgImage: string | null;
}

export interface PlanStats {
  roundCount: number;
  coupleCount: number;
  seats: number;
  guests: number;
  babies: number;
  blocks: number;
}
