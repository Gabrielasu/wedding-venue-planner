/**
 * Export helpers — PNG and PDF. Also save/load JSON snapshots.
 *
 * For PNG and PDF we serialize the live SVG, inline a stylesheet so it renders
 * standalone, rasterize it to a canvas and either download or hand it to jsPDF.
 */
import jsPDF from 'jspdf';
import { usePlanStore } from '@/store/planStore';
import { tStandalone } from '@/i18n/useTranslation';
import { RoundTableItem, CoupleTableItem } from '@/types';

const VIEWBOX_W = 2600;
const VIEWBOX_H = 1271;

const INLINE_STYLE = `
  .room{fill:#ffffff;stroke:#1f1b16;stroke-width:1.4}
  .room.priority{fill:#fffbf0;stroke:#8a6d3b;stroke-width:2}
  .room-detail{fill:none;stroke:#8a6d3b;stroke-width:0.8;opacity:0.45}
  .room-secondary{fill:#fafaf4;stroke:#aaaaaa;stroke-width:1}
  .room-label{font-size:14px;font-weight:500;fill:#1f1b16;text-anchor:middle;letter-spacing:1.2px;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif}
  .room-label.small{font-size:11px;fill:#6b6358;letter-spacing:0.8px}
  .room-label.tiny{font-size:9px;fill:#6b6358;letter-spacing:0.6px}
  .terrace{fill:#f3ead7;stroke:#8a6d3b;stroke-width:1.8;stroke-dasharray:7 4}
  .wc-marker{fill:#1f1b16}
  .wc-text{fill:white;font-size:10px;font-weight:700;text-anchor:middle;font-family:Helvetica,Arial,sans-serif}
  .entrance-label{font-size:12px;fill:#1f1b16;font-weight:500;text-anchor:middle;font-family:Helvetica,Arial,sans-serif}
  .seat{fill:white;stroke:#8a6d3b;stroke-width:1.2}
  .seat.filled{fill:#f3ead7}
  .table-circle{fill:#f9e7c2;stroke:#8a6d3b;stroke-width:1.5}
  .table-couple{fill:#f5d4ce;stroke:#b54b3c;stroke-width:1.5}
  .block{fill:#e6dfd1;stroke:#5c5346;stroke-width:1.5}
  .dance{fill:#efe4f5;stroke:#6d4a89;stroke-width:1.5;stroke-dasharray:8 4}
  .baby-chair{fill:#e57b3a;stroke:#8a3f1a;stroke-width:1}
  .item-label{font-size:12px;fill:#1f1b16;text-anchor:middle;font-weight:700;font-family:Helvetica,Arial,sans-serif}
  .item-sub{font-size:10px;fill:#6b6358;text-anchor:middle;font-family:Helvetica,Arial,sans-serif}
`;

function isoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function downloadHref(href: string, filename: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 0);
}

async function rasterize(scale = 2): Promise<HTMLCanvasElement> {
  const svg = document.getElementById('svgRoot') as SVGSVGElement | null;
  if (!svg) throw new Error('SVG not mounted');

  const clone = svg.cloneNode(true) as SVGSVGElement;
  // Strip selection state and rotate handles
  clone.querySelectorAll('.placed.selected').forEach((g) => g.classList.remove('selected'));
  clone.querySelectorAll('.rotate-handle, .rotate-line').forEach((n) => n.remove());

  clone.setAttribute('style', 'background:#faf7f2');
  const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = INLINE_STYLE;
  clone.insertBefore(styleEl, clone.firstChild);

  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = (e) => rej(e instanceof Error ? e : new Error('image load failed'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = VIEWBOX_W * scale;
    canvas.height = VIEWBOX_H * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D context');
    ctx.fillStyle = '#faf7f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function exportPng(): Promise<void> {
  const canvas = await rasterize(2);
  downloadHref(canvas.toDataURL('image/png'), `wedding-plan-${isoDate()}.png`);
}

export async function exportPdf(): Promise<void> {
  const canvas = await rasterize(2);
  const pngData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text(tStandalone('export_pdf_title'), 14, 16);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(110);
  pdf.text(new Date().toLocaleDateString(), pageW - 14, 16, { align: 'right' });
  pdf.setTextColor(30);

  // Plan image
  const ratio = canvas.width / canvas.height;
  const maxW = pageW - 28;
  const maxH = pageH - 80;
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  pdf.addImage(pngData, 'PNG', 14, 22, w, h);

  // Summary line
  const stats = usePlanStore.getState().computeStats();
  let y = 22 + h + 8;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(tStandalone('export_pdf_summary'), 14, y);
  y += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const sumLine =
    `${tStandalone('export_pdf_round_tables')}: ${stats.roundCount}    ` +
    `${tStandalone('export_pdf_seats')}: ${stats.seats}    ` +
    `${tStandalone('export_pdf_named_guests')}: ${stats.guests}    ` +
    `${tStandalone('export_pdf_baby_chairs')}: ${stats.babies}    ` +
    `${tStandalone('export_pdf_couple_table')}: ${stats.coupleCount}`;
  pdf.text(sumLine, 14, y);

  // Guest list page
  const items = usePlanStore.getState().items;
  const round = items.filter((i): i is RoundTableItem => i.type === 'round');
  const couples = items.filter((i): i is CoupleTableItem => i.type === 'couple');

  if (round.length > 0 || couples.length > 0) {
    pdf.addPage('a3', 'landscape');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text(tStandalone('export_pdf_guest_list'), 14, 16);

    let cy = 28;
    pdf.setFontSize(10);
    const cols = 3;
    const colW = (pageW - 28) / cols;
    let col = 0;
    const blockHeight = 64;
    const sorted = [...round].sort((a, b) => (a.number || 0) - (b.number || 0));

    for (const tbl of sorted) {
      const x = 14 + col * colW;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text(
        `${tStandalone('guest_modal_table')} ${tbl.number}${tbl.name ? ' · ' + tbl.name : ''}`,
        x,
        cy,
      );
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const guests = tbl.guests || [];
      let ly = cy + 5;
      for (let i = 0; i < tbl.seats; i++) {
        const g = guests[i] && guests[i].trim() ? guests[i] : tStandalone('export_pdf_empty_seat');
        pdf.text(`${i + 1}. ${g}`, x, ly);
        ly += 4.2;
      }
      if (tbl.babies > 0) {
        pdf.setFont('helvetica', 'italic');
        pdf.text(
          `+ ${tbl.babies} ${tStandalone('export_pdf_baby_extra')}`,
          x,
          ly,
        );
        pdf.setFont('helvetica', 'normal');
      }
      col++;
      if (col >= cols) {
        col = 0;
        cy += blockHeight;
        if (cy > pageH - blockHeight) {
          pdf.addPage('a3', 'landscape');
          cy = 16;
        }
      }
    }

    for (const c of couples) {
      const x = 14 + col * colW;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text(tStandalone('export_pdf_couple_heading'), x, cy);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`1. ${c.guests[0] || tStandalone('export_pdf_empty_seat')}`, x, cy + 5);
      pdf.text(`2. ${c.guests[1] || tStandalone('export_pdf_empty_seat')}`, x, cy + 9.5);
      col++;
      if (col >= cols) {
        col = 0;
        cy += blockHeight;
      }
    }
  }

  pdf.save(`wedding-plan-${isoDate()}.pdf`);
}

/* ----------------------- JSON save/load ----------------------- */

export function saveJson(): void {
  const data = JSON.stringify(usePlanStore.getState().toSnapshot(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadHref(url, `wedding-plan-${isoDate()}.json`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function loadJsonFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        usePlanStore.getState().loadSnapshot(data);
        resolve();
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsText(file);
  });
}
