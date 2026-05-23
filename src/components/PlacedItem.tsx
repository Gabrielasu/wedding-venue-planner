/**
 * PlacedItem — renders one placed item on the canvas.
 */
import { Item } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { ITEM_DEFAULTS } from '@/store/planStore';

interface Props {
  item: Item;
  selected: boolean;
}

function resolveLabel(label: string, t: (k: string) => string): string {
  if (label && label.startsWith('__')) return t(label.slice(2));
  return label;
}

export function PlacedItem({ item, selected }: Props) {
  const { t } = useTranslation();
  const rot = -(item.rotation || 0);

  return (
    <g
      className={'placed' + (selected ? ' selected' : '')}
      data-id={item.id}
      transform={`translate(${item.x},${item.y}) rotate(${item.rotation || 0})`}
    >
      {selected && (
        <>
          <line x1={0} y1={0} x2={0} y2={-70} className="rotate-line" />
          <circle
            cx={0}
            cy={-78}
            r={8}
            className="rotate-handle"
            data-handle="rotate"
          />
        </>
      )}

      {item.type === 'round' && <RoundBody item={item} rot={rot} tableShort={t('table_short')} />}
      {item.type === 'couple' && <CoupleBody item={item} rot={rot} />}
      {item.type === 'babychair' && <BabyChairBody rot={rot} />}
      {item.type === 'dance' && (
        <DanceBody item={item} rot={rot} label={resolveLabel(item.label, t)} />
      )}
      {(item.type === 'bar' || item.type === 'buffet' || item.type === 'dj') && (
        <BlockBody item={item} rot={rot} label={resolveLabel(item.label, t)} />
      )}
    </g>
  );
}

function RoundBody({
  item,
  rot,
  tableShort,
}: {
  item: Extract<Item, { type: 'round' }>;
  rot: number;
  tableShort: string;
}) {
  const r = 42;
  const seatR = 9;
  const seats = item.seats || 10;
  const guests = item.guests || [];
  const filledCount = guests.filter((g) => g && g.trim()).length;
  const seatNodes: JSX.Element[] = [];
  for (let i = 0; i < seats; i++) {
    const a = (i / seats) * Math.PI * 2 - Math.PI / 2;
    const sx = Math.cos(a) * (r + seatR + 2);
    const sy = Math.sin(a) * (r + seatR + 2);
    const filled = !!(guests[i] && guests[i].trim());
    seatNodes.push(
      <circle
        key={i}
        cx={Number(sx.toFixed(2))}
        cy={Number(sy.toFixed(2))}
        r={seatR}
        className={'seat' + (filled ? ' filled' : '')}
      />,
    );
  }

  return (
    <>
      {seatNodes}
      <circle r={r} className="table-circle selectable" />
      <text className="item-label" y={-4} transform={`rotate(${rot})`}>
        {tableShort}
        {item.number}
      </text>
      {item.name ? (
        <>
          <text className="item-sub" y={11} transform={`rotate(${rot})`}>
            {item.name.slice(0, 18)}
          </text>
          <text className="item-sub" y={24} transform={`rotate(${rot})`}>
            {filledCount}/{item.seats}
          </text>
        </>
      ) : (
        <text className="item-sub" y={13} transform={`rotate(${rot})`}>
          {filledCount}/{item.seats}
        </text>
      )}
      {item.babies > 0 && (
        <g transform={`translate(${r - 10},${-r - 4})`}>
          <rect x={-12} y={-12} width={24} height={24} rx={4} className="baby-chair" />
          <text
            textAnchor="middle"
            y={5}
            fontSize={14}
            fontWeight={700}
            fill="white"
            transform={`rotate(${rot})`}
          >
            {item.babies}
          </text>
        </g>
      )}
    </>
  );
}

function CoupleBody({
  item,
  rot,
}: {
  item: Extract<Item, { type: 'couple' }>;
  rot: number;
}) {
  const w = 110;
  const h = 40;
  return (
    <>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={4}
        className="table-couple selectable"
      />
      <circle
        cx={-28}
        cy={-h / 2 - 12}
        r={9}
        className={'seat' + ((item.guests || [])[0] ? ' filled' : '')}
      />
      <circle
        cx={28}
        cy={-h / 2 - 12}
        r={9}
        className={'seat' + ((item.guests || [])[1] ? ' filled' : '')}
      />
      <text className="item-label" y={6} fontSize={18} transform={`rotate(${rot})`}>
        ♥
      </text>
    </>
  );
}

function BabyChairBody({ rot }: { rot: number }) {
  return (
    <>
      <rect x={-12} y={-12} width={24} height={24} rx={4} className="baby-chair selectable" />
      <text
        textAnchor="middle"
        y={5}
        fontSize={14}
        fill="white"
        fontWeight={700}
        transform={`rotate(${rot})`}
      >
        ♚
      </text>
    </>
  );
}

function DanceBody({
  item,
  rot,
  label,
}: {
  item: Extract<Item, { type: 'dance' }>;
  rot: number;
  label: string;
}) {
  const w = item.w || ITEM_DEFAULTS.dance.w;
  const h = item.h || ITEM_DEFAULTS.dance.h;
  return (
    <>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={6}
        className="dance selectable"
      />
      <text className="item-label" y={6} fontSize={14} transform={`rotate(${rot})`}>
        {label.toUpperCase()}
      </text>
    </>
  );
}

function BlockBody({
  item,
  rot,
  label,
}: {
  item: Extract<Item, { type: 'bar' | 'buffet' | 'dj' }>;
  rot: number;
  label: string;
}) {
  const def = ITEM_DEFAULTS[item.type];
  const w = item.w || def.w;
  const h = item.h || def.h;
  return (
    <>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={3}
        className="block selectable"
      />
      <text className="item-label" y={5} transform={`rotate(${rot})`}>
        {label.toUpperCase()}
      </text>
    </>
  );
}
