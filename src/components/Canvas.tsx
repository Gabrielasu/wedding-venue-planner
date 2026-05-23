/**
 * Canvas — hosts the SVG: background image (if any), simplified floor plan,
 * and all placed items. Owns pointer interactions:
 *   - click on item → select; drag → move; orange handle → rotate
 *   - drag on empty canvas → pan
 *   - mouse wheel → zoom (centered on cursor)
 *   - zoom controls overlay → in, out, reset, fit-all
 */
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_VIEW, FIT_ALL_VIEW, usePlanStore } from '@/store/planStore';
import { useTranslation } from '@/i18n/useTranslation';
import { FloorPlan } from './FloorPlan';
import { PlacedItem } from './PlacedItem';

// World coordinate system — matches the original venue floor-plan image.
const WORLD_W = 2600;
const WORLD_H = 1271;

type DragMode = 'move' | 'rotate' | 'pan';
interface DragState {
  mode: DragMode;
  id?: number;
  offsetX: number;
  offsetY: number;
  lastClientX: number;
  lastClientY: number;
  hasMoved: boolean;
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
  const view = usePlanStore((s) => s.view);
  const select = usePlanStore((s) => s.select);
  const updateItem = usePlanStore((s) => s.updateItem);
  const deleteItem = usePlanStore((s) => s.deleteItem);
  const zoomAt = usePlanStore((s) => s.zoomAt);
  const panBy = usePlanStore((s) => s.panBy);
  const resetView = usePlanStore((s) => s.resetView);
  const fitAll = usePlanStore((s) => s.fitAll);

  /* ------------------- Wheel zoom (cursor-centered) ------------------- */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = clientToSvg(svg, e.clientX, e.clientY);
      const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      zoomAt(p.x, p.y, factor);
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  /* ------------------- Global pointer + keyboard ------------------- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag || !svgRef.current) return;
      const svg = svgRef.current;
      if (drag.mode === 'pan') {
        // Convert pixel delta to SVG-space delta using the current viewBox scale.
        const rect = svg.getBoundingClientRect();
        const v = usePlanStore.getState().view;
        // The SVG uses xMidYMid meet, so the effective scale is min(rect.w/v.w, rect.h/v.h)
        const scale = Math.min(rect.width / v.w, rect.height / v.h);
        const dx = (e.clientX - drag.lastClientX) / scale;
        const dy = (e.clientY - drag.lastClientY) / scale;
        if (Math.abs(e.clientX - drag.lastClientX) + Math.abs(e.clientY - drag.lastClientY) > 1) {
          panBy(-dx, -dy);
          setDrag({
            ...drag,
            lastClientX: e.clientX,
            lastClientY: e.clientY,
            hasMoved: true,
          });
        }
        return;
      }
      const item = usePlanStore.getState().items.find((i) => i.id === drag.id);
      if (!item) return;
      const p = clientToSvg(svg, e.clientX, e.clientY);
      if (drag.mode === 'move') {
        updateItem(drag.id!, {
          x: Math.round(p.x - drag.offsetX),
          y: Math.round(p.y - drag.offsetY),
        } as Partial<typeof item>);
      } else {
        const dx = p.x - item.x;
        const dy = p.y - item.y;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        updateItem(drag.id!, { rotation: Math.round(angle) } as Partial<typeof item>);
      }
    };
    const onUp = () => {
      // If we started a "pan" but never actually moved, treat as a click → deselect.
      if (drag && drag.mode === 'pan' && !drag.hasMoved) select(null);
      setDrag(null);
    };
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const sid = usePlanStore.getState().selectedId;
      if ((e.key === 'Delete' || e.key === 'Backspace') && sid != null) {
        deleteItem(sid);
        e.preventDefault();
      }
      if (e.key === 'Escape') select(null);
      // Keyboard zoom shortcuts
      if ((e.key === '+' || e.key === '=') && !e.metaKey && !e.ctrlKey) {
        const v = usePlanStore.getState().view;
        zoomAt(v.x + v.w / 2, v.y + v.h / 2, 1 / 1.2);
      }
      if (e.key === '-' && !e.metaKey && !e.ctrlKey) {
        const v = usePlanStore.getState().view;
        zoomAt(v.x + v.w / 2, v.y + v.h / 2, 1.2);
      }
      if (e.key === '0' && !e.metaKey && !e.ctrlKey) resetView();
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('keydown', onKey);
    };
  }, [drag, updateItem, deleteItem, select, panBy, zoomAt, resetView]);

  function onSvgMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    const target = e.target as Element;
    const g = target.closest('.placed');
    if (g && svgRef.current) {
      // Clicked on a placed item
      const id = Number(g.getAttribute('data-id'));
      const item = items.find((i) => i.id === id);
      if (!item) return;
      select(id);
      const p = clientToSvg(svgRef.current, e.clientX, e.clientY);
      if (target.getAttribute('data-handle') === 'rotate') {
        setDrag({
          id, mode: 'rotate',
          offsetX: 0, offsetY: 0,
          lastClientX: e.clientX, lastClientY: e.clientY,
          hasMoved: false,
        });
      } else {
        setDrag({
          id, mode: 'move',
          offsetX: p.x - item.x, offsetY: p.y - item.y,
          lastClientX: e.clientX, lastClientY: e.clientY,
          hasMoved: false,
        });
      }
      e.preventDefault();
    } else {
      // Empty canvas — start a pan (and deselect on mouseup if no movement).
      setDrag({
        mode: 'pan',
        offsetX: 0, offsetY: 0,
        lastClientX: e.clientX, lastClientY: e.clientY,
        hasMoved: false,
      });
    }
  }

  const cursorClass =
    drag?.mode === 'pan'
      ? drag.hasMoved
        ? 'panning'
        : 'panning-hover'
      : drag
      ? 'dragging'
      : '';

  return (
    <div className="canvas-wrap">
      <svg
        ref={svgRef}
        id="svgRoot"
        className={'svg-root ' + cursorClass}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
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
              width={WORLD_W}
              height={WORLD_H}
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

      {/* Zoom controls overlay */}
      <ZoomControls
        view={view}
        defaultView={DEFAULT_VIEW}
        fitAllView={FIT_ALL_VIEW}
        onZoomIn={() => zoomAt(view.x + view.w / 2, view.y + view.h / 2, 1 / 1.25)}
        onZoomOut={() => zoomAt(view.x + view.w / 2, view.y + view.h / 2, 1.25)}
        onReset={resetView}
        onFitAll={fitAll}
      />

      {items.length === 0 && <div className="hint">{t('canvas_hint')}</div>}
    </div>
  );
}

/* -------------------- Zoom controls panel -------------------- */
interface ZoomControlsProps {
  view: { x: number; y: number; w: number; h: number };
  defaultView: { w: number };
  fitAllView: { w: number };
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFitAll: () => void;
}

function ZoomControls({
  view,
  defaultView,
  onZoomIn,
  onZoomOut,
  onReset,
  onFitAll,
}: ZoomControlsProps) {
  // Display the zoom level as a percentage relative to the default zoomed view.
  const pct = Math.round((defaultView.w / view.w) * 100);
  return (
    <div className="zoom-controls" role="group" aria-label="Zoom controls">
      <button onClick={onZoomOut} title="Zoom out (−)" aria-label="Zoom out">−</button>
      <button onClick={onReset} title="Reset zoom (0)" className="zoom-pct">
        {pct}%
      </button>
      <button onClick={onZoomIn} title="Zoom in (+)" aria-label="Zoom in">+</button>
      <button onClick={onFitAll} title="Fit whole venue" className="zoom-fit" aria-label="Fit whole venue">
        ⤢
      </button>
    </div>
  );
}
