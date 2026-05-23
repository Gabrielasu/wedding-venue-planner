/**
 * Inspector — right panel that edits the selected item's properties,
 * and shows the plan summary.
 */
import { useState } from 'react';
import { Item } from '@/types';
import { usePlanStore } from '@/store/planStore';
import { useTranslation } from '@/i18n/useTranslation';
import { GuestModal } from './GuestModal';

function resolveLabel(item: Item, t: (k: string) => string): string {
  if ('label' in item && typeof item.label === 'string') {
    if (item.label.startsWith('__')) return t(item.label.slice(2));
    return item.label;
  }
  return item.type;
}

export function Inspector() {
  const { t } = useTranslation();
  const items = usePlanStore((s) => s.items);
  const selectedId = usePlanStore((s) => s.selectedId);
  const updateItem = usePlanStore((s) => s.updateItem);
  const deleteItem = usePlanStore((s) => s.deleteItem);
  const duplicateItem = usePlanStore((s) => s.duplicateItem);
  const stats = usePlanStore((s) => s.computeStats());

  const [guestModalId, setGuestModalId] = useState<number | null>(null);
  const selected = items.find((i) => i.id === selectedId) || null;

  return (
    <>
      <aside className="inspector">
        {!selected ? (
          <div className="empty">
            <div className="icon">⌖</div>
            <b>{t('inspector_empty_title')}</b>
            <div style={{ marginTop: 6 }}>{t('inspector_empty_text')}</div>
          </div>
        ) : (
          <ItemForm
            item={selected}
            onChange={(patch) => updateItem(selected.id, patch)}
            onDelete={() => deleteItem(selected.id)}
            onDuplicate={() => duplicateItem(selected.id)}
            onOpenGuests={() => setGuestModalId(selected.id)}
          />
        )}

        <div style={{ marginTop: 24 }}>
          <h2>{t('summary_title')}</h2>
          <div className="summary">
            <div>
              <span>{t('summary_round')}</span>
              <b>{stats.roundCount}</b>
            </div>
            <div>
              <span>{t('summary_couple')}</span>
              <b>{stats.coupleCount}</b>
            </div>
            <div>
              <span>{t('summary_seats')}</span>
              <b>{stats.seats}</b>
            </div>
            <div>
              <span>{t('summary_guests')}</span>
              <b>{stats.guests}</b>
            </div>
            <div>
              <span>{t('summary_babies')}</span>
              <b>{stats.babies}</b>
            </div>
            <div>
              <span>{t('summary_blocks')}</span>
              <b>{stats.blocks}</b>
            </div>
          </div>
        </div>
      </aside>

      {guestModalId != null && (
        <GuestModal id={guestModalId} onClose={() => setGuestModalId(null)} />
      )}
    </>
  );

  // Note: this fragment uses resolveLabel for header text in BlockForm.
  void resolveLabel;
}

/* ------------------------------------------------------------------ */
/* Per-type forms                                                     */
/* ------------------------------------------------------------------ */

interface FormProps<T extends Item> {
  item: T;
  onChange: (patch: Partial<T>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onOpenGuests: () => void;
}

function ItemForm(props: FormProps<Item>) {
  const { item } = props;
  if (item.type === 'round') return <RoundForm {...(props as FormProps<typeof item>)} />;
  if (item.type === 'couple') return <CoupleForm {...(props as FormProps<typeof item>)} />;
  if (item.type === 'babychair') return <BabyChairForm {...(props as FormProps<typeof item>)} />;
  return <BlockForm {...(props as FormProps<typeof item>)} />;
}

function PositionFields({
  item,
  onChange,
}: {
  item: Item;
  onChange: (patch: Partial<Item>) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="field-row">
      <div className="field">
        <label>{t('form_x')}</label>
        <input
          type="number"
          value={Math.round(item.x)}
          onChange={(e) => onChange({ x: Number(e.target.value) } as Partial<Item>)}
        />
      </div>
      <div className="field">
        <label>{t('form_y')}</label>
        <input
          type="number"
          value={Math.round(item.y)}
          onChange={(e) => onChange({ y: Number(e.target.value) } as Partial<Item>)}
        />
      </div>
      <div className="field">
        <label>{t('form_rotation')}</label>
        <input
          type="number"
          value={Math.round(item.rotation || 0)}
          onChange={(e) =>
            onChange({ rotation: Number(e.target.value) } as Partial<Item>)
          }
        />
      </div>
    </div>
  );
}

function Actions({
  onDuplicate,
  onDelete,
}: {
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="inspector-actions">
      <button className="btn" onClick={onDuplicate}>
        {t('form_duplicate')}
      </button>
      <button className="btn danger" onClick={onDelete}>
        {t('form_delete')}
      </button>
    </div>
  );
}

function RoundForm({
  item,
  onChange,
  onDelete,
  onDuplicate,
  onOpenGuests,
}: FormProps<Extract<Item, { type: 'round' }>>) {
  const { t } = useTranslation();
  const filled = (item.guests || []).filter((g) => g && g.trim()).length;
  return (
    <>
      <h2>
        {t('form_round_table')}{' '}
        <span className="badge">
          {t('table_short')}
          {item.number}
        </span>
      </h2>
      <div className="field">
        <label>{t('form_table_name')}</label>
        <input
          type="text"
          value={item.name || ''}
          placeholder={t('form_table_name_placeholder')}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label>{t('form_table_number')}</label>
          <input
            type="number"
            value={item.number}
            min={1}
            onChange={(e) => onChange({ number: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>{t('form_seats')}</label>
          <input
            type="number"
            value={item.seats}
            min={1}
            max={14}
            onChange={(e) => {
              const seats = Math.max(1, Math.min(14, Number(e.target.value)));
              const guests = (item.guests || []).slice();
              while (guests.length < seats) guests.push('');
              guests.length = seats;
              onChange({ seats, guests });
            }}
          />
        </div>
      </div>
      <div className="field">
        <label>{t('form_babies_at_table')}</label>
        <input
          type="number"
          value={item.babies || 0}
          min={0}
          max={6}
          onChange={(e) => onChange({ babies: Number(e.target.value) })}
        />
      </div>
      <div className="field">
        <label>
          {t('form_guests_count')} ({filled}/{item.seats})
        </label>
        <button className="btn" style={{ width: '100%' }} onClick={onOpenGuests}>
          {t('form_edit_guests')}
        </button>
      </div>
      <PositionFields item={item} onChange={onChange as (p: Partial<Item>) => void} />
      <Actions onDelete={onDelete} onDuplicate={onDuplicate} />
    </>
  );
}

function CoupleForm({
  item,
  onChange,
  onDelete,
  onDuplicate,
}: FormProps<Extract<Item, { type: 'couple' }>>) {
  const { t } = useTranslation();
  return (
    <>
      <h2>
        {t('form_couple_table')} <span className="badge">♥</span>
      </h2>
      <div className="field-row">
        <div className="field">
          <label>{t('form_partner1')}</label>
          <input
            type="text"
            value={(item.guests || ['', ''])[0]}
            onChange={(e) => {
              const guests: [string, string] = [e.target.value, item.guests[1] || ''];
              onChange({ guests });
            }}
          />
        </div>
        <div className="field">
          <label>{t('form_partner2')}</label>
          <input
            type="text"
            value={(item.guests || ['', ''])[1]}
            onChange={(e) => {
              const guests: [string, string] = [item.guests[0] || '', e.target.value];
              onChange({ guests });
            }}
          />
        </div>
      </div>
      <PositionFields item={item} onChange={onChange as (p: Partial<Item>) => void} />
      <Actions onDelete={onDelete} onDuplicate={onDuplicate} />
    </>
  );
}

function BabyChairForm({
  item,
  onChange,
  onDelete,
  onDuplicate,
}: FormProps<Extract<Item, { type: 'babychair' }>>) {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('form_babychair')}</h2>
      <div className="field">
        <label>{t('form_babychair_note')}</label>
        <input
          type="text"
          value={item.name || ''}
          placeholder={t('form_babychair_note_placeholder')}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label>{t('form_x')}</label>
          <input
            type="number"
            value={Math.round(item.x)}
            onChange={(e) => onChange({ x: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>{t('form_y')}</label>
          <input
            type="number"
            value={Math.round(item.y)}
            onChange={(e) => onChange({ y: Number(e.target.value) })}
          />
        </div>
      </div>
      <Actions onDelete={onDelete} onDuplicate={onDuplicate} />
    </>
  );
}

function BlockForm({
  item,
  onChange,
  onDelete,
  onDuplicate,
}: FormProps<Extract<Item, { type: 'bar' | 'buffet' | 'dj' | 'dance' }>>) {
  const { t } = useTranslation();
  const labelDisplay = item.label && item.label.startsWith('__') ? t(item.label.slice(2)) : item.label;
  return (
    <>
      <h2>{labelDisplay}</h2>
      <div className="field">
        <label>{t('form_label')}</label>
        <input
          type="text"
          value={labelDisplay}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label>{t('form_width')}</label>
          <input
            type="number"
            value={item.w}
            min={20}
            onChange={(e) => onChange({ w: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label>{t('form_height')}</label>
          <input
            type="number"
            value={item.h}
            min={20}
            onChange={(e) => onChange({ h: Number(e.target.value) })}
          />
        </div>
      </div>
      <PositionFields item={item} onChange={onChange as (p: Partial<Item>) => void} />
      <Actions onDelete={onDelete} onDuplicate={onDuplicate} />
    </>
  );
}
