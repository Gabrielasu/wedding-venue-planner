/**
 * Palette — left-hand list of items you can add to the plan.
 */
import { ItemType } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { usePlanStore } from '@/store/planStore';

interface Entry {
  type: ItemType;
  labelKey: string;
  hintKey?: string;
  icon: JSX.Element;
}

const TABLE_ENTRIES: Entry[] = [
  {
    type: 'round',
    labelKey: 'item_round',
    hintKey: 'item_round_hint',
    icon: (
      <circle cx={20} cy={20} r={13} fill="#f9e7c2" stroke="#8a6d3b" strokeWidth={1.5} />
    ),
  },
  {
    type: 'couple',
    labelKey: 'item_couple',
    hintKey: 'item_couple_hint',
    icon: (
      <rect x={6} y={14} width={28} height={12} fill="#f5d4ce" stroke="#b54b3c" strokeWidth={1.5} rx={2} />
    ),
  },
  {
    type: 'babychair',
    labelKey: 'item_babychair',
    hintKey: 'item_babychair_hint',
    icon: <rect x={14} y={14} width={12} height={12} rx={2} fill="#e57b3a" stroke="#8a3f1a" />,
  },
];

const BLOCK_ENTRIES: Entry[] = [
  {
    type: 'bar',
    labelKey: 'item_bar',
    icon: (
      <rect x={4} y={14} width={32} height={12} fill="#e6dfd1" stroke="#5c5346" strokeWidth={1.5} />
    ),
  },
  {
    type: 'buffet',
    labelKey: 'item_buffet',
    icon: (
      <rect x={4} y={16} width={32} height={8} fill="#e6dfd1" stroke="#5c5346" strokeWidth={1.5} />
    ),
  },
  {
    type: 'dj',
    labelKey: 'item_dj',
    icon: (
      <>
        <rect x={8} y={10} width={24} height={20} fill="#e6dfd1" stroke="#5c5346" strokeWidth={1.5} />
        <text x={20} y={24} textAnchor="middle" fontSize={9} fontWeight={700}>
          DJ
        </text>
      </>
    ),
  },
  {
    type: 'dance',
    labelKey: 'item_dance',
    hintKey: 'item_dance_hint',
    icon: (
      <rect
        x={4}
        y={6}
        width={32}
        height={28}
        fill="#efe4f5"
        stroke="#6d4a89"
        strokeWidth={1.5}
        strokeDasharray="3 2"
      />
    ),
  },
];

function PaletteRow({
  entry,
  onAdd,
  t,
}: {
  entry: Entry;
  onAdd: (type: ItemType) => void;
  t: (k: string) => string;
}) {
  return (
    <div
      className="palette-item"
      role="button"
      tabIndex={0}
      onClick={() => onAdd(entry.type)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onAdd(entry.type);
      }}
    >
      <div className="palette-icon">
        <svg viewBox="0 0 40 40">{entry.icon}</svg>
      </div>
      <div>
        <div className="palette-label">{t(entry.labelKey)}</div>
        {entry.hintKey && <div className="palette-hint">{t(entry.hintKey)}</div>}
      </div>
    </div>
  );
}

export function Palette() {
  const { t } = useTranslation();
  const addItem = usePlanStore((s) => s.addItem);

  function onAdd(type: ItemType) {
    // Drop in the priority area, with a small jitter so items don't stack.
    const cx = 1080 + (Math.random() - 0.5) * 80;
    const cy = 650 + (Math.random() - 0.5) * 80;
    addItem(type, cx, cy);
  }

  return (
    <aside className="palette">
      <h2>{t('palette_tables')}</h2>
      {TABLE_ENTRIES.map((e) => (
        <PaletteRow key={e.type} entry={e} onAdd={onAdd} t={t} />
      ))}

      <h2>{t('palette_blocks')}</h2>
      {BLOCK_ENTRIES.map((e) => (
        <PaletteRow key={e.type} entry={e} onAdd={onAdd} t={t} />
      ))}

      <h2>{t('palette_how_to_use')}</h2>
      <div className="howto">
        <b>{t('howto_click')}</b> {t('howto_click_what')}
        <br />
        <b>{t('howto_drag')}</b> {t('howto_drag_what')}
        <br />
        <b>{t('howto_orange')}</b> {t('howto_orange_what')}
        <br />
        <b>{t('howto_delete')}</b> — {t('howto_delete_what')}
      </div>
    </aside>
  );
}
