/**
 * GuestModal — edits the full per-seat guest list for a round table.
 */
import { useEffect } from 'react';
import { usePlanStore } from '@/store/planStore';
import { useTranslation } from '@/i18n/useTranslation';

interface Props {
  id: number;
  onClose: () => void;
}

export function GuestModal({ id, onClose }: Props) {
  const { t } = useTranslation();
  const item = usePlanStore((s) => s.items.find((i) => i.id === id));
  const updateItem = usePlanStore((s) => s.updateItem);

  // Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item || item.type !== 'round') return null;

  const guests = item.guests.length === item.seats
    ? item.guests
    : (() => {
        const next = item.guests.slice();
        while (next.length < item.seats) next.push('');
        next.length = item.seats;
        return next;
      })();

  function setGuest(i: number, val: string) {
    if (!item || item.type !== 'round') return;
    const next = guests.slice();
    next[i] = val;
    updateItem(item.id, { guests: next });
  }

  function addSeat() {
    if (!item || item.type !== 'round') return;
    if (item.seats >= 14) return;
    const next = guests.slice();
    next.push('');
    updateItem(item.id, { seats: item.seats + 1, guests: next });
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          {t('guest_modal_title')} {item.number}
          {item.name ? ' · ' + item.name : ''}
        </h3>
        <div>
          {guests.map((g, i) => (
            <div key={i} className="guest-list-row">
              <span className="seat-num">{i + 1}.</span>
              <input
                type="text"
                value={g}
                placeholder={t('guest_modal_placeholder')}
                onChange={(e) => setGuest(i, e.target.value)}
              />
              <button
                type="button"
                className="clear"
                title={t('guest_modal_clear')}
                onClick={() => setGuest(i, '')}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={addSeat}>
            {t('guest_modal_add')}
          </button>
          <button className="btn primary" onClick={onClose}>
            {t('guest_modal_done')}
          </button>
        </div>
      </div>
    </div>
  );
}
