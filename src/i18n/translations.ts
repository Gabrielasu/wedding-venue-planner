/**
 * UI translations — Polish (default) and English.
 * Room names on the floor plan are Polish proper nouns and stay in Polish
 * in both languages; only the main-entrance arrow is translated.
 */

export type Lang = 'pl' | 'en';

export const LANGS: Lang[] = ['pl', 'en'];

export type Dictionary = Record<string, string>;

const pl: Dictionary = {
  app_title_main: 'Planer Sali',
  app_title_sub: 'Weselnej',

  bg_simplified: 'Tło: plan uproszczony',
  bg_uploaded: 'Tło: wgrany obraz',
  bg_upload_first: 'Najpierw wgraj plan sali jako obraz.',
  upload_floor_plan: 'Wgraj plan sali',
  save_plan: 'Zapisz plan (JSON)',
  load_plan: 'Wczytaj plan',
  export_png: 'Eksportuj PNG',
  export_pdf: 'Eksportuj PDF',
  clear_all: 'Wyczyść wszystko',
  clear_confirm:
    'Usunąć wszystkie elementy z planu? Tła i listy gości też zostaną wyczyszczone.',

  stat_tables: 'Stoły',
  stat_seats: 'Miejsca',
  stat_guests: 'Goście',
  stat_baby_chairs: 'Krzesełka dziec.',

  palette_tables: 'Stoły',
  palette_blocks: 'Elementy',
  palette_how_to_use: 'Jak używać',
  item_round: 'Stół okrągły',
  item_round_hint: 'do 10 miejsc',
  item_couple: 'Stół młodej pary',
  item_couple_hint: 'prostokątny, 2 miejsca',
  item_babychair: 'Krzesełko dziecięce',
  item_babychair_hint: 'znacznik obok stołu',
  item_bar: 'Bar',
  item_buffet: 'Bufet',
  item_dj: 'Stanowisko DJ',
  item_dance: 'Parkiet',
  item_dance_hint: 'rozmiar zmienisz w panelu',
  howto_click: 'Kliknij',
  howto_drag: 'Przeciągnij',
  howto_orange: 'Pomarańczowy uchwyt',
  howto_delete: 'Delete / Backspace',
  howto_click_what: 'element po lewej, aby dodać go do planu.',
  howto_drag_what: 'element, aby zmienić jego pozycję, lub kliknij, aby zaznaczyć.',
  howto_orange_what: 'nad zaznaczonym elementem obraca go.',
  howto_delete_what: 'usuwa zaznaczony element.',

  inspector_empty_title: 'Wybierz element',
  inspector_empty_text:
    'Kliknij element na planie, aby go edytować, lub kliknij element po lewej, aby dodać go do sali.',
  summary_title: 'Podsumowanie planu',
  summary_round: 'Stoły okrągłe',
  summary_couple: 'Stół młodej pary',
  summary_seats: 'Miejsca razem',
  summary_guests: 'Nazwiska gości',
  summary_babies: 'Krzesełka dziecięce',
  summary_blocks: 'Bar / bufet / DJ',

  form_round_table: 'Stół okrągły',
  form_couple_table: 'Stół młodej pary',
  form_babychair: 'Krzesełko dziecięce',
  form_table_name: 'Nazwa stołu (opcjonalnie)',
  form_table_name_placeholder: 'np. „Rodzina od strony Anny”',
  form_table_number: 'Numer stołu',
  form_seats: 'Miejsca',
  form_babies_at_table: 'Krzesełka dziecięce przy stole',
  form_guests_count: 'Goście',
  form_edit_guests: 'Edytuj listę gości…',
  form_x: 'X',
  form_y: 'Y',
  form_rotation: 'Obrót°',
  form_partner1: 'Osoba 1',
  form_partner2: 'Osoba 2',
  form_babychair_note: 'Notatka (opcjonalnie)',
  form_babychair_note_placeholder: 'np. dla Niny (stół 3)',
  form_label: 'Etykieta',
  form_width: 'Szerokość',
  form_height: 'Wysokość',
  form_duplicate: 'Duplikuj',
  form_delete: 'Usuń',

  default_couple_name: 'Para młoda',
  default_bar: 'Bar',
  default_buffet: 'Bufet',
  default_dj: 'DJ',
  default_dance: 'Parkiet',

  canvas_hint:
    'Kliknij element po lewej, aby dodać go do planu. Przeciągnij, aby ustawić.',

  guest_modal_title: 'Lista gości — Stół',
  guest_modal_placeholder: 'Imię i nazwisko gościa',
  guest_modal_add: '+ Dodaj miejsce',
  guest_modal_done: 'Gotowe',
  guest_modal_clear: 'Wyczyść',
  guest_modal_table: 'Stół',

  export_pdf_title: 'Plan Sali Weselnej',
  export_pdf_summary: 'Podsumowanie',
  export_pdf_round_tables: 'Stoły okrągłe',
  export_pdf_seats: 'Miejsca',
  export_pdf_named_guests: 'Nazwiska gości',
  export_pdf_baby_chairs: 'Krzesełka dziec.',
  export_pdf_couple_table: 'Stół młodej pary',
  export_pdf_guest_list: 'Lista gości według stołów',
  export_pdf_couple_heading: '♥ Stół młodej pary',
  export_pdf_baby_extra: 'krzesełka dziecięce',
  export_pdf_empty_seat: '—',

  error_png: 'Eksport PNG nie powiódł się',
  error_pdf: 'Eksport PDF nie powiódł się',
  error_load: 'Nie udało się wczytać pliku',

  table_short: 'S',
  entrance_label: '↓ GŁÓWNE WEJŚCIE',
};

const en: Dictionary = {
  app_title_main: 'Wedding',
  app_title_sub: 'Venue Planner',

  bg_simplified: 'Background: simplified plan',
  bg_uploaded: 'Background: uploaded image',
  bg_upload_first: 'Upload a floor plan image first.',
  upload_floor_plan: 'Upload floor plan',
  save_plan: 'Save plan (JSON)',
  load_plan: 'Load plan',
  export_png: 'Export PNG',
  export_pdf: 'Export PDF',
  clear_all: 'Clear all',
  clear_confirm:
    'Remove all items from the plan? Background and guest lists will also be cleared.',

  stat_tables: 'Tables',
  stat_seats: 'Seats',
  stat_guests: 'Guests',
  stat_baby_chairs: 'Baby chairs',

  palette_tables: 'Tables',
  palette_blocks: 'Blocks',
  palette_how_to_use: 'How to use',
  item_round: 'Round table',
  item_round_hint: 'up to 10 seats',
  item_couple: "Couple's table",
  item_couple_hint: 'rectangular, 2 seats',
  item_babychair: 'Baby chair',
  item_babychair_hint: 'marker beside a table',
  item_bar: 'Bar',
  item_buffet: 'Buffet',
  item_dj: 'DJ booth',
  item_dance: 'Dance floor',
  item_dance_hint: 'resize in the right panel',
  howto_click: 'Click',
  howto_drag: 'Drag',
  howto_orange: 'Orange handle',
  howto_delete: 'Delete / Backspace',
  howto_click_what: 'an item on the left to add it to the plan.',
  howto_drag_what: 'an item to reposition, or click to select.',
  howto_orange_what: 'above a selected item rotates it.',
  howto_delete_what: 'removes the selected item.',

  inspector_empty_title: 'Select an item',
  inspector_empty_text:
    'Click a placed item to edit it, or click a palette item on the left to add one.',
  summary_title: 'Plan summary',
  summary_round: 'Round tables',
  summary_couple: "Couple's table",
  summary_seats: 'Seats total',
  summary_guests: 'Named guests',
  summary_babies: 'Baby chairs',
  summary_blocks: 'Bar / buffet / DJ',

  form_round_table: 'Round table',
  form_couple_table: "Couple's table",
  form_babychair: 'Baby chair',
  form_table_name: 'Table name (optional)',
  form_table_name_placeholder: 'e.g. "Family — Anna’s side"',
  form_table_number: 'Table number',
  form_seats: 'Seats',
  form_babies_at_table: 'Baby chairs at this table',
  form_guests_count: 'Guests',
  form_edit_guests: 'Edit guest list…',
  form_x: 'X',
  form_y: 'Y',
  form_rotation: 'Rotation°',
  form_partner1: 'Partner 1',
  form_partner2: 'Partner 2',
  form_babychair_note: 'Note (optional)',
  form_babychair_note_placeholder: 'e.g. for Nina (Table 3)',
  form_label: 'Label',
  form_width: 'Width',
  form_height: 'Height',
  form_duplicate: 'Duplicate',
  form_delete: 'Delete',

  default_couple_name: 'Couple',
  default_bar: 'Bar',
  default_buffet: 'Buffet',
  default_dj: 'DJ',
  default_dance: 'Dance floor',

  canvas_hint: 'Click any palette item to add it, then drag it where you want it.',

  guest_modal_title: 'Guest list — Table',
  guest_modal_placeholder: 'Guest name',
  guest_modal_add: '+ Add seat',
  guest_modal_done: 'Done',
  guest_modal_clear: 'Clear',
  guest_modal_table: 'Table',

  export_pdf_title: 'Wedding Venue Plan',
  export_pdf_summary: 'Summary',
  export_pdf_round_tables: 'Round tables',
  export_pdf_seats: 'Seats',
  export_pdf_named_guests: 'Named guests',
  export_pdf_baby_chairs: 'Baby chairs',
  export_pdf_couple_table: "Couple's table",
  export_pdf_guest_list: 'Guest list by table',
  export_pdf_couple_heading: "♥ Couple's table",
  export_pdf_baby_extra: 'baby chairs',
  export_pdf_empty_seat: '—',

  error_png: 'PNG export failed',
  error_pdf: 'PDF export failed',
  error_load: 'Could not load file',

  table_short: 'T',
  entrance_label: '↓ MAIN ENTRANCE (Główne wejście)',
};

export const dictionaries: Record<Lang, Dictionary> = { pl, en };

export type TranslationKey = keyof typeof pl;
