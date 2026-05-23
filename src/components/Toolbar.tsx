/**
 * Toolbar — top bar with title, language toggle, file actions, exports, stats.
 */
import { ChangeEvent, useRef } from 'react';
import { usePlanStore } from '@/store/planStore';
import { useTranslation } from '@/i18n/useTranslation';
import { LanguageToggle } from './LanguageToggle';
import { exportPng, exportPdf, saveJson, loadJsonFile } from '@/lib/export';

export function Toolbar() {
  const { t } = useTranslation();
  const fileImageRef = useRef<HTMLInputElement>(null);
  const fileJsonRef = useRef<HTMLInputElement>(null);

  const bgMode = usePlanStore((s) => s.bgMode);
  const bgImage = usePlanStore((s) => s.bgImage);
  const setBackground = usePlanStore((s) => s.setBackground);
  const clearAll = usePlanStore((s) => s.clearAll);
  const items = usePlanStore((s) => s.items);
  const stats = usePlanStore((s) => s.computeStats());

  const bgLabel =
    bgMode === 'image' && bgImage ? t('bg_uploaded') : t('bg_simplified');

  function onToggleBg() {
    if (bgMode === 'simplified') {
      if (!bgImage) {
        alert(t('bg_upload_first'));
        return;
      }
      setBackground('image');
    } else {
      setBackground('simplified');
    }
  }

  function onUploadImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setBackground('image', url);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function onLoadJson(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    loadJsonFile(file).catch((err) => {
      alert(t('error_load') + ': ' + err.message);
    });
    e.target.value = '';
  }

  function onClearAll() {
    if (items.length === 0) return;
    if (confirm(t('clear_confirm'))) clearAll();
  }

  return (
    <header className="toolbar">
      <h1>
        {t('app_title_main')} <span className="accent">{t('app_title_sub')}</span>
      </h1>

      <LanguageToggle />

      <button className="btn" onClick={onToggleBg}>
        {bgLabel}
      </button>

      <button
        className="btn"
        onClick={() => fileImageRef.current?.click()}
        title={t('upload_floor_plan')}
      >
        {t('upload_floor_plan')}
      </button>
      <input
        ref={fileImageRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onUploadImage}
      />

      <div className="toolbar-sep" />
      <button className="btn" onClick={() => saveJson()}>
        {t('save_plan')}
      </button>
      <button className="btn" onClick={() => fileJsonRef.current?.click()}>
        {t('load_plan')}
      </button>
      <input
        ref={fileJsonRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={onLoadJson}
      />

      <div className="toolbar-sep" />
      <button
        className="btn primary"
        onClick={() => exportPng().catch((err) => alert(t('error_png') + ': ' + err.message))}
      >
        {t('export_png')}
      </button>
      <button
        className="btn primary"
        onClick={() => exportPdf().catch((err) => alert(t('error_pdf') + ': ' + err.message))}
      >
        {t('export_pdf')}
      </button>

      <div className="toolbar-sep" />
      <button className="btn danger" onClick={onClearAll}>
        {t('clear_all')}
      </button>

      <div className="toolbar-stats">
        <span>
          {t('stat_tables')}: <b>{stats.roundCount}</b>
        </span>
        <span>
          {t('stat_seats')}: <b>{stats.seats}</b>
        </span>
        <span>
          {t('stat_guests')}: <b>{stats.guests}</b>
        </span>
        <span>
          {t('stat_baby_chairs')}: <b>{stats.babies}</b>
        </span>
      </div>
    </header>
  );
}
