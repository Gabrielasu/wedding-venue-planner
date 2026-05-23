/**
 * FloorPlan — the simplified SVG drawing of the venue.
 *
 * The viewBox matches the original floor-plan image (2600×1271)
 * so coordinates here read directly off the venue map.
 *
 * Room names on the plan are Polish proper nouns and stay in Polish
 * in both languages. Only the main-entrance arrow is translated.
 *
 * Priority rooms (the ones the user actually plans seating in) are
 * highlighted: Sala Lustrzana, Atrium, Sala Pod Aniołami, Sala Złota, Taras.
 */
import { useTranslation } from '@/i18n/useTranslation';

export function FloorPlan() {
  const { t } = useTranslation();

  return (
    <g>
      <defs>
        <marker
          id="floorArrow"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="#1f1b16" opacity="0.6" />
        </marker>
      </defs>

      {/* Far-left service / kitchen area (muted context) */}
      <g opacity={0.55}>
        <path
          d="M 90 380 A 80 80 0 0 0 90 540 L 200 540 L 200 380 Z"
          className="room-secondary"
        />
        <path
          d="M 90 700 A 80 80 0 0 0 90 860 L 200 860 L 200 700 Z"
          className="room-secondary"
        />
        <rect x={200} y={340} width={240} height={540} className="room-secondary" rx={2} />
        <line x1={200} y1={540} x2={440} y2={540} stroke="#aaa" strokeWidth={0.6} />
        <line x1={200} y1={700} x2={440} y2={700} stroke="#aaa" strokeWidth={0.6} />
        <line x1={320} y1={540} x2={320} y2={700} stroke="#aaa" strokeWidth={0.6} />
      </g>

      {/* TARAS — curved terrace (priority) */}
      <g>
        <path
          d="M 940 380 L 940 280 Q 940 80 1310 80 Q 1690 80 1690 280 L 1690 380 Z"
          className="terrace"
        />
        <path d="M 980 360 Q 1310 130 1650 360" className="room-detail" />
        <path d="M 1010 360 Q 1310 170 1620 360" className="room-detail" />
        <text x={1310} y={220} className="room-label small" letterSpacing={3}>
          TARAS
        </text>
        <path
          d="M 1310 240 L 1310 270"
          stroke="#1f1b16"
          strokeWidth={1.4}
          opacity={0.6}
          markerEnd="url(#floorArrow)"
        />
      </g>

      {/* SALA LUSTRZANA (priority) — bay at top */}
      <g>
        <path
          d="M 460 380 L 460 320 L 540 320 L 540 280 A 50 40 0 0 1 660 280 L 660 320 L 720 320 L 720 670 L 460 670 Z"
          className="room priority"
        />
        <circle cx={535} cy={500} r={6} className="room-detail" strokeWidth={1.2} />
        <circle cx={645} cy={500} r={6} className="room-detail" strokeWidth={1.2} />
        <text x={590} y={475} className="room-label">
          <tspan x={590}>SALA</tspan>
          <tspan x={590} dy={22}>
            LUSTRZANA
          </tspan>
        </text>
        {/* Stairwell south of Sala Lustrzana */}
        <rect x={460} y={670} width={220} height={160} className="room" rx={2} />
        <path
          d="M 480 690 L 660 690 M 480 720 L 660 720 M 480 750 L 660 750 M 480 780 L 660 780 M 480 810 L 660 810"
          className="room-detail"
          stroke="#aaa"
        />
      </g>

      {/* LOBBY BAR */}
      <g>
        <rect x={740} y={320} width={220} height={220} className="room" rx={2} />
        <text x={850} y={438} className="room-label small">
          LOBBY BAR
        </text>
      </g>

      {/* ATRIUM (priority) — has spiral staircase */}
      <g>
        <rect x={740} y={540} width={220} height={340} className="room priority" rx={2} />
        <g transform="translate(820 750)" opacity={0.7}>
          <path
            d="M 0 0 Q 30 -20 40 0 Q 50 30 20 35 Q -10 35 -5 5 Q 0 -15 25 -10"
            className="room-detail"
            strokeWidth={1.5}
          />
          <circle r={3} fill="#8a6d3b" />
        </g>
        <text x={850} y={660} className="room-label">
          ATRIUM
        </text>
      </g>

      {/* SALA POD ANIOŁAMI (priority) */}
      <g>
        <path
          d="M 970 320 L 1170 320 L 1170 360 L 1195 360 L 1195 500 L 1170 500 L 1170 580 L 970 580 Z"
          className="room priority"
        />
        <text x={1075} y={438} className="room-label">
          <tspan x={1075}>SALA POD</tspan>
          <tspan x={1075} dy={22}>
            ANIOŁAMI
          </tspan>
        </text>
      </g>

      {/* BAR — narrow strip */}
      <g>
        <rect x={1195} y={380} width={80} height={200} className="room" rx={1} />
        <text
          x={1235}
          y={490}
          className="room-label tiny"
          transform="rotate(-90 1235 490)"
          letterSpacing={2}
        >
          BAR
        </text>
      </g>

      {/* SALA ZŁOTA (priority) — with bay at bottom */}
      <g>
        <path
          d="M 970 580 L 1170 580 L 1170 800 L 1130 800 L 1130 840 A 35 30 0 0 1 1010 840 L 1010 800 L 970 800 Z"
          className="room priority"
        />
        <text x={1070} y={685} className="room-label">
          <tspan x={1070}>SALA</tspan>
          <tspan x={1070} dy={22}>
            ZŁOTA
          </tspan>
        </text>
      </g>

      {/* ORANŻERIA — octagonal-ish with garden feature */}
      <g>
        <path
          d="M 1275 380 L 1700 380 L 1820 460 L 1820 740 L 1700 820 L 1275 820 Z"
          className="room"
        />
        <g transform="translate(1700 700)" opacity={0.5}>
          <circle r={40} className="room-detail" strokeWidth={1} />
          <circle r={28} className="room-detail" strokeWidth={0.8} />
          <circle cx={-22} cy={-18} r={14} className="room-detail" strokeWidth={0.8} />
          <circle cx={22} cy={-22} r={11} className="room-detail" strokeWidth={0.8} />
          <circle cx={-30} cy={10} r={10} className="room-detail" strokeWidth={0.8} />
          <circle cx={28} cy={8} r={9} className="room-detail" strokeWidth={0.8} />
        </g>
        <text x={1500} y={555} className="room-label small" letterSpacing={2}>
          ORANŻERIA
        </text>
      </g>

      {/* WC near Oranżeria / Recepcja */}
      <g>
        <circle cx={1838} cy={775} r={14} className="wc-marker" />
        <text x={1838} y={779} className="wc-text">
          WC
        </text>
      </g>

      {/* HOL MYŚLIWSKI — long corridor */}
      <g>
        <rect x={940} y={840} width={880} height={105} className="room" rx={2} />
        {[1140, 1290, 1440, 1590, 1740].map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy={892}
            r={5}
            className="room-detail"
            strokeWidth={0.8}
            fill="rgba(139,109,59,0.15)"
          />
        ))}
        <text x={1380} y={897} className="room-label small">
          HOL MYŚLIWSKI
        </text>
      </g>

      {/* SALA POŁUDNIOWA */}
      <g>
        <rect x={970} y={945} width={220} height={135} className="room" rx={2} />
        <text x={1080} y={1018} className="room-label small">
          SALA POŁUDNIOWA
        </text>
      </g>

      {/* WESTYBUL + WC */}
      <g>
        <rect x={740} y={880} width={220} height={200} className="room" rx={2} />
        <text x={850} y={985} className="room-label small">
          WESTYBUL
        </text>
        <circle cx={710} cy={900} r={14} className="wc-marker" />
        <text x={710} y={904} className="wc-text">
          WC
        </text>
      </g>

      {/* RECEPCJA — octagonal */}
      <g>
        <path
          d="M 1920 460 L 2110 460 L 2200 555 L 2200 725 L 2110 820 L 1920 820 L 1858 725 L 1858 555 Z"
          className="room"
        />
        <text x={2030} y={645} className="room-label small">
          RECEPCJA
        </text>
        <text x={2030} y={430} className="entrance-label">
          {t('entrance_label')}
        </text>
      </g>
    </g>
  );
}
