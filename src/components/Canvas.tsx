/**
 * Canvas — hosts the SVG: background image (if any), simplified floor plan,
 * and all placed items. Owns pointer interactions (drag / rotate / select / delete).
 */
import { useEffect, useRef, useState } from 'react';
import { usePlanStore } from '@/store/planStore';
import { useTranslation } from '@/i18n/useTranslation';
import { FloorPlan } from './FloorPlan';
import { PlacedItem } from './PlacedItem';

const VIEWBOX_W = 2600;
const VIEWBOX_H = 1271;

type DragMode = 'move' | 'rotate';
interface DragState {
  id: number;
  mode: DragMode;
  offsetX: number;
  offsetY: number;
}

function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: clientX, y: clientY };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}

export function Canvas() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const { t } = useTranslation();

  const items = usePlanStore((s) => s.items);
  const selectedId = usePlanStore((s) => s.selectedId);
  const bgMode = usePlanStore((s) => s.bgMode);
  const bgImage = usePlanStore((s) => s.bgImage);
  const select = usePlanStore((s) => s.select);
  const updateItem = usePlanStore((s) => s.updateItem);
  const deleteItem = usePlanStore((s) => s.deleteItem);

  // Global pointer + keyboard listeners
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag || !svgRef.current) return;
      const item = usePlanStore.getState().items.find((i) => i.id === drag.id);
      if (!item) return;
      const p = clientToSvg(svgRef.current, e.clientX, e.clientY);
      if (drag.mode === 'move') {
        updateItem(drag.id, {
          x: Math.round(p.x - drag.offsetX),
          y: Math.round(p.y - drag.offsetY),
        } as Partial<typeof item>);
      } else {
        const dx = p.x - item.x;
        const dy = p.y - item.y;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        updateItem(drag.id, { rotation: Math.round(angle) } as Partial<typeof item>);
      }
    };
    const onUp = () => setDrag(null);
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const sid = usePlanStore.getState().selectedId;
      if ((e.key === 'Delete' || e.key === 'Backspace') && sid != null) {
        deleteItem(sid);
        e.preventDefault();
      }
      if (e.key === 'Escape') select(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('keydown', onKey);
    };
  }, [drag, updateItem, deleteItem, select]);

  function onSvgMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    const target = e.target as Element;
    const g = target.closest('.placed');
    if (g && svgRef.current) {
      const id = Number(g.getAttribute('data-id'));
      const item = items.find((i) => i.id === id);
      if (!item) return;
      select(id);
      const p = clientToSvg(svgRef.current, e.clientX, e.clientY);
      if (target.getAttribute('data-handle') === 'rotate') {
        setDrag({ id, mode: 'rotate', offsetX: 0, offsetY: 0 });
      } else {
        setDrag({
          id,
          mode: 'move',
          offsetX: p.x - item.x,
          offsetY: p.y - item.y,
        });
      }
      e.preventDefault();
    } else {
      // Click on empty canvas / room deselects
      if (!target.closest('.placed')) select(null);
    }
  }

  return (
    <div className="canvas-wrap">
      <svg
        ref={svgRef}
        id="svgRoot"
        className={'svg-root' + (drag ? ' dragging' : '')}
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        onMouseDown={onSvgMouseDown}
      >
        <g>
          {bgMode === 'image' && bgImage ? (
            <image
              href={bgImage}
              x={0}
              y={0}
              width={VIEWBOX_W}
              height={VIEWBOX_H}
              preserveAspectRatio="xMidYMid meet"
              opacity={0.85}
            />
          ) : (
            <FloorPlan />
          )}
        </g>
        <g>
          {items.map((item) => (
            <PlacedItem key={item.id} item={item} selected={item.id === selectedId} />
          ))}
        </g>
      </svg>
      {items.length === 0 && <div className="hint">{t('canvas_hint')}</div>}
    </div>
  );
}
