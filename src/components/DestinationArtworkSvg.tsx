import type { DestinationId } from '../engine/types';

interface DestinationArtworkSvgProps {
  destinationId: DestinationId;
  locked?: boolean;
}

/**
 * 20 distinctive lightweight local SVG destination scenes (zero external dependencies).
 * Special visual care is given to:
 * - Abuzeydabad: golden-hour desert dunes, earthen caravanserai/oasis arch, palms & glowing qanat vein.
 * - Ijrud: cool slate-emerald highland ridges, rolling green valley slopes & winding canyon creek.
 * Every destination has its own unique architectural/landscape composition.
 */
export function DestinationArtworkSvg({
  destinationId,
  locked = false,
}: DestinationArtworkSvgProps) {
  const cls = `w-full h-24 sm:h-28 block object-cover ${locked ? 'grayscale opacity-55' : ''}`;

  switch (destinationId) {
    // =========================================================================
    // ROUTE 1 — YAZD
    // =========================================================================
    case 'yazd':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-yazd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B283C" />
              <stop offset="65%" stopColor="#6D4426" />
              <stop offset="100%" stopColor="#A96E36" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-yazd)" />
          <path d="M0 72 Q65 56 138 70 T240 64 L240 96 L0 96 Z" fill="#5D3A1F" />
          {/* Tall Badgir & Ab-Anbar dome */}
          <rect x="46" y="24" width="24" height="50" fill="#3B2413" stroke="#D99B26" strokeOpacity="0.45" />
          <rect x="51" y="29" width="3" height="16" fill="#1C1108" />
          <rect x="57" y="29" width="3" height="16" fill="#1C1108" />
          <rect x="63" y="29" width="3" height="16" fill="#1C1108" />
          <path d="M138 74 Q166 34 194 74 Z" fill="#462B17" stroke="#D99B26" strokeOpacity="0.4" />
          <polygon points="104,96 112,72 128,72 136,96" fill="#23B9CB" />
          <line x1="114" y1="82" x2="126" y2="82" stroke="#C4FBFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'meybod':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-meybod" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#222338" />
              <stop offset="65%" stopColor="#7A4C2C" />
              <stop offset="100%" stopColor="#B87A42" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-meybod)" />
          <path d="M0 72 L240 72 L240 96 L0 96 Z" fill="#54351E" />
          {/* Iconic stepped Yakhchal conical icehouse */}
          <path d="M90 74 Q120 14 150 74 Z" fill="#8C5932" stroke="#E5B36A" strokeWidth="1.2" />
          <line x1="101" y1="54" x2="139" y2="54" stroke="#5E391D" strokeWidth="1.5" />
          <line x1="108" y1="40" x2="132" y2="40" stroke="#5E391D" strokeWidth="1.5" />
          <path d="M112 74 L112 60 Q120 53 128 60 L128 74 Z" fill="#1D140E" />
          {/* Shade wall & water basin */}
          <rect x="44" y="54" width="44" height="20" fill="#684124" />
          <rect x="154" y="58" width="46" height="16" fill="#684124" />
          <rect x="82" y="80" width="76" height="8" rx="4" fill="#1FAEC0" />
        </svg>
      );

    case 'ardakan':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-ardakan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B2232" />
              <stop offset="60%" stopColor="#5C3B29" />
              <stop offset="100%" stopColor="#94603B" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-ardakan)" />
          {/* Desert plain horizon & earthen towers */}
          <path d="M0 68 Q90 54 168 68 T240 62 L240 96 L0 96 Z" fill="#4C301E" />
          <rect x="34" y="42" width="18" height="30" fill="#6E462A" />
          <rect x="188" y="42" width="18" height="30" fill="#6E462A" />
          <rect x="52" y="54" width="136" height="18" fill="#5D3B23" />
          {/* Qanat access shafts line */}
          <g fill="#22C1D4">
            <circle cx="72" cy="82" r="3.5" />
            <circle cx="104" cy="82" r="3.5" />
            <circle cx="136" cy="82" r="3.5" />
            <circle cx="168" cy="82" r="3.5" />
          </g>
          <line x1="72" y1="82" x2="168" y2="82" stroke="#64ECF6" strokeWidth="2" strokeDasharray="5 4" />
        </svg>
      );

    case 'taft':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-taft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A293B" />
              <stop offset="62%" stopColor="#4F4432" />
              <stop offset="100%" stopColor="#7C5E39" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-taft)" />
          {/* Shir Kuh foothill peaks */}
          <polygon points="0,72 58,24 122,62 182,18 240,58 240,96 0,96" fill="#3B312B" />
          <path d="M0 74 Q80 62 160 74 T240 68 L240 96 L0 96 Z" fill="#2A4231" />
          {/* Pomegranate orchard circles & mountain channel */}
          <circle cx="52" cy="70" r="10" fill="#2E6B47" />
          <circle cx="76" cy="74" r="8" fill="#387D54" />
          <circle cx="182" cy="70" r="10" fill="#2E6B47" />
          <circle cx="204" cy="74" r="8" fill="#387D54" />
          <path d="M120 46 Q112 70 124 96 L142 96 Q130 70 132 46 Z" fill="#2CC7D6" />
        </svg>
      );

    // =========================================================================
    // ROUTE 2 — KERMAN
    // =========================================================================
    case 'kerman':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-kerman" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#162638" />
              <stop offset="60%" stopColor="#2B4E53" />
              <stop offset="100%" stopColor="#496B59" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-kerman)" />
          <polygon points="0,72 68,32 142,64 202,28 240,56 240,96 0,96" fill="#21383D" />
          {/* Twin Bazaar Portal Arches */}
          <rect x="64" y="48" width="112" height="32" fill="#3C3226" stroke="#D99B26" strokeOpacity="0.5" />
          <path d="M80 80 L80 60 Q94 48 108 60 L108 80 Z" fill="#17272D" />
          <path d="M132 80 L132 60 Q146 48 160 60 L160 80 Z" fill="#17272D" />
          <rect x="0" y="80" width="240" height="16" fill="#192924" />
          <rect x="64" y="84" width="112" height="6" rx="3" fill="#28C3CF" />
        </svg>
      );

    case 'mahan':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-mahan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#122736" />
              <stop offset="65%" stopColor="#1E5252" />
              <stop offset="100%" stopColor="#2B6B56" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-mahan)" />
          {/* Shazdeh stepped garden water cascades & cypresses */}
          <g fill="#163E32">
            <path d="M46 84 Q54 32 62 84 Z" />
            <path d="M72 86 Q78 46 84 86 Z" />
            <path d="M156 86 Q162 46 168 86 Z" />
            <path d="M178 84 Q186 32 194 84 Z" />
          </g>
          <polygon points="104,34 136,34 156,96 84,96" fill="#173236" stroke="#3FD2BA" strokeWidth="1" />
          <polygon points="110,38 130,38 144,96 96,96" fill="#2ED0DE" />
          <line x1="106" y1="54" x2="134" y2="54" stroke="#E0FEFF" strokeWidth="2" />
          <line x1="101" y1="72" x2="139" y2="72" stroke="#E0FEFF" strokeWidth="2" />
          <line x1="96" y1="88" x2="144" y2="88" stroke="#E0FEFF" strokeWidth="2" />
        </svg>
      );

    case 'bam':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-bam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#202236" />
              <stop offset="55%" stopColor="#5D4732" />
              <stop offset="100%" stopColor="#8F673B" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-bam)" />
          {/* Stepped Adobe Citadel Silhouette */}
          <path d="M84 74 L92 48 L108 48 L112 34 L128 34 L132 48 L148 48 L156 74 Z" fill="#523722" stroke="#D89E52" strokeOpacity="0.45" />
          <rect x="0" y="74" width="240" height="22" fill="#253624" />
          {/* Dense Date Palms */}
          <g stroke="#291E14" strokeWidth="3" fill="none">
            <path d="M44 94 Q40 70 48 48" />
            <path d="M196 94 Q200 70 192 48" />
          </g>
          <g fill="#2E8558">
            <path d="M48 48 Q28 42 24 52 Q36 50 48 48 Z" />
            <path d="M48 48 Q40 34 32 38 Q42 42 48 48 Z" />
            <path d="M48 48 Q64 42 70 52 Q58 50 48 48 Z" />
            <path d="M192 48 Q174 42 168 52 Q180 50 192 48 Z" />
            <path d="M192 48 Q200 34 208 38 Q198 42 192 48 Z" />
            <path d="M192 48 Q212 42 216 52 Q204 50 192 48 Z" />
          </g>
          <rect x="78" y="82" width="84" height="6" rx="3" fill="#2BC7D6" />
        </svg>
      );

    case 'rayen':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-rayen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#182738" />
              <stop offset="60%" stopColor="#3B4952" />
              <stop offset="100%" stopColor="#6D5842" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-rayen)" />
          {/* Mount Hezar snowy silhouette behind highland fortress */}
          <polygon points="0,70 76,18 156,58 212,24 240,48 240,96 0,96" fill="#2A3A44" />
          <polygon points="76,18 92,32 76,34 62,30" fill="#DCECF0" opacity="0.5" />
          {/* Crenellated Adobe Fortress Wall */}
          <path d="M68 78 L68 52 L78 52 L78 58 L90 58 L90 50 L150 50 L150 58 L162 58 L162 52 L172 52 L172 78 Z" fill="#5D442F" stroke="#C99B63" strokeOpacity="0.45" />
          <rect x="0" y="78" width="240" height="18" fill="#2C2722" />
          <path d="M40 86 Q120 80 200 86" stroke="#32CBD9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </svg>
      );

    // =========================================================================
    // ROUTE 3 — KASHAN AND SURROUNDINGS (Special distinct Abuzeydabad desert oasis!)
    // =========================================================================
    case 'kashan':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-kashan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E2030" />
              <stop offset="62%" stopColor="#164B5E" />
              <stop offset="100%" stopColor="#266E7C" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-kashan)" />
          {/* Turquoise Pavilion & Reflecting Fountain */}
          <path d="M98 42 Q120 18 142 42 Z" fill="#1C97AB" stroke="#E6BA5E" strokeWidth="1.2" />
          <rect x="74" y="42" width="92" height="30" fill="#28211B" stroke="#D99B26" strokeWidth="1" />
          <path d="M108 72 L108 52 Q120 42 132 52 L132 72 Z" fill="#173845" stroke="#E6BA5E" strokeWidth="0.9" />
          <rect x="0" y="72" width="240" height="24" fill="#172328" />
          <polygon points="88,96 102,74 138,74 152,96" fill="#32D6E4" stroke="#E6BA5E" strokeWidth="1.2" />
          <line x1="120" y1="84" x2="120" y2="70" stroke="#E5FEFF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'abuzeydabad':
      // DISTINCTIVE DESERT-OASIS IDENTITY: Golden-hour dunes, earthen mudbrick arch, oasis palms & underground qanat vein
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-abuzeyd-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#231630" />
              <stop offset="48%" stopColor="#8F4A24" />
              <stop offset="100%" stopColor="#E3973B" />
            </linearGradient>
            <linearGradient id="dest-abuzeyd-dune" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D68C3A" />
              <stop offset="100%" stopColor="#7C441D" />
            </linearGradient>
            <linearGradient id="dest-abuzeyd-qanat" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#168D9C" />
              <stop offset="50%" stopColor="#6AF4FC" />
              <stop offset="100%" stopColor="#168D9C" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-abuzeyd-sky)" />
          {/* Warm golden-hour desert sun & dusk stars */}
          <circle cx="192" cy="24" r="11" fill="#FBE094" opacity="0.9" />
          <circle cx="38" cy="18" r="1.1" fill="#FFF2CA" opacity="0.8" />
          <circle cx="88" cy="14" r="0.9" fill="#FFF2CA" opacity="0.7" />
          {/* Sweeping Rig-e Maranjab / Abuzeydabad sand dunes */}
          <path d="M0 64 Q58 34 128 58 T240 46 L240 96 L0 96 Z" fill="url(#dest-abuzeyd-dune)" />
          <path d="M0 74 Q88 52 174 70 T240 62 L240 96 L0 96 Z" fill="#633519" />

          {/* Earthen oasis vault / caravanserai arch */}
          <path d="M96 74 L96 46 Q120 26 144 46 L144 74 Z" fill="#472613" stroke="#F0BE66" strokeWidth="1.2" />
          <path d="M106 74 L106 53 Q120 40 134 53 L134 74 Z" fill="#1E130D" />
          {/* Oasis Palm Cluster beside earthen arch */}
          <g stroke="#2B190E" strokeWidth="2.6" fill="none">
            <path d="M62 76 Q58 58 66 42" />
            <path d="M174 76 Q178 60 170 46" />
          </g>
          <g fill="#2F8E65">
            <path d="M66 42 Q48 38 44 47 Q56 44 66 42 Z" />
            <path d="M66 42 Q58 29 50 33 Q60 36 66 42 Z" />
            <path d="M66 42 Q80 35 86 44 Q74 43 66 42 Z" />
            <path d="M170 46 Q154 42 150 50 Q160 48 170 46 Z" />
            <path d="M170 46 Q178 34 186 38 Q176 41 170 46 Z" />
            <path d="M170 46 Q186 45 190 54 Q178 50 170 46 Z" />
          </g>

          {/* Glowing subterranean qanat channel nourishing the desert oasis */}
          <rect x="0" y="76" width="240" height="20" fill="#2A170D" />
          <rect x="0" y="83" width="240" height="6" fill="url(#dest-abuzeyd-qanat)" />
          <line x1="28" y1="86" x2="76" y2="86" stroke="#E2FEFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
          <line x1="156" y1="86" x2="210" y2="86" stroke="#E2FEFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
        </svg>
      );

    case 'niasar':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-niasar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#122833" />
              <stop offset="60%" stopColor="#205259" />
              <stop offset="100%" stopColor="#2E6F64" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-niasar)" />
          {/* Rocky hillside cliff & Niasar mountain spring waterfall */}
          <polygon points="0,44 94,38 112,96 0,96" fill="#3B4540" />
          <polygon points="146,38 240,46 240,96 128,96" fill="#323D39" />
          {/* Cascading mountain waterfall into terraced basin */}
          <path d="M96 38 L144 38 L138 82 L102 82 Z" fill="#29CAD8" />
          <line x1="112" y1="44" x2="110" y2="76" stroke="#DCFDFD" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <line x1="128" y1="42" x2="130" y2="78" stroke="#DCFDFD" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <ellipse cx="120" cy="84" rx="34" ry="7" fill="#5CEAF2" opacity="0.7" />
        </svg>
      );

    case 'qamsar':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-qamsar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#211A30" />
              <stop offset="58%" stopColor="#58344D" />
              <stop offset="100%" stopColor="#854E63" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-qamsar)" />
          {/* Mountain valley rosewater garden terraces */}
          <path d="M0 64 Q60 40 120 62 T240 54 L240 96 L0 96 Z" fill="#2A463B" />
          <path d="M0 78 Q72 64 144 76 T240 70 L240 96 L0 96 Z" fill="#1F372E" />
          {/* Subtle damask rose blossoms along stone channel */}
          <g fill="#E589A5">
            <circle cx="44" cy="68" r="3" />
            <circle cx="62" cy="74" r="2.5" />
            <circle cx="176" cy="68" r="3" />
            <circle cx="196" cy="74" r="2.5" />
          </g>
          <polygon points="104,60 136,60 148,96 92,96" fill="#2BC9D9" />
          <line x1="108" y1="74" x2="132" y2="74" stroke="#D8FEFF" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    // =========================================================================
    // ROUTE 4 — ZANJAN (Distinct non-desert highland identity, special focus on Ijrud!)
    // =========================================================================
    case 'zanjan':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-zanjan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#142538" />
              <stop offset="60%" stopColor="#2C5269" />
              <stop offset="100%" stopColor="#46727A" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-zanjan)" />
          <polygon points="0,66 64,26 132,56 196,24 240,52 240,96 0,96" fill="#223E4D" />
          {/* Traditional Brick Vaulted Arches of Zanjan */}
          <rect x="44" y="54" width="152" height="26" fill="#594032" stroke="#D4A45B" strokeOpacity="0.45" />
          <path d="M56 80 L56 64 Q68 54 80 64 L80 80 Z" fill="#1A2C35" />
          <path d="M108 80 L108 62 Q120 52 132 62 L132 80 Z" fill="#1E3C47" />
          <path d="M160 80 L160 64 Q172 54 184 64 L184 80 Z" fill="#1A2C35" />
          <rect x="0" y="80" width="240" height="16" fill="#1C3130" />
          <rect x="50" y="85" width="140" height="5" rx="2.5" fill="#4FDCE6" />
        </svg>
      );

    case 'ijrud':
      // DISTINCTIVE HIGHLAND VALLEY & GORGE LANDSCAPE FOR IJRUD (ایجرود) — non-desert green-slate mountain terrain
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-ijrud-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F2633" />
              <stop offset="56%" stopColor="#1F5661" />
              <stop offset="100%" stopColor="#3B7B72" />
            </linearGradient>
            <linearGradient id="dest-ijrud-river" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#83F7EF" />
              <stop offset="100%" stopColor="#1E95A0" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-ijrud-sky)" />
          {/* Cool misty alpine ridge lines */}
          <polygon points="0,62 46,24 98,54 156,18 212,48 240,34 240,96 0,96" fill="#1D4047" />
          {/* Layered emerald-slate rolling valley hills of Ijrud */}
          <path d="M0 62 Q52 40 108 64 L108 96 L0 96 Z" fill="#2A5E52" />
          <path d="M132 62 Q186 38 240 58 L240 96 L132 96 Z" fill="#235248" />
          <path d="M0 78 Q58 62 114 82 L114 96 L0 96 Z" fill="#1C4039" />
          <path d="M126 80 Q184 62 240 76 L240 96 L126 96 Z" fill="#183832" />
          {/* Winding highland gorge stream through valley center */}
          <path
            d="M114 52 Q96 64 114 74 T102 96 L138 96 Q152 80 132 70 T126 52 Z"
            fill="url(#dest-ijrud-river)"
          />
          <path d="M116 62 Q112 68 120 73" stroke="#E5FEFF" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.85" />
          <path d="M122 82 Q130 88 118 92" stroke="#E5FEFF" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.75" />
        </svg>
      );

    case 'soltaniyeh':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-soltaniyeh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#12243A" />
              <stop offset="60%" stopColor="#24536E" />
              <stop offset="100%" stopColor="#467A7C" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-soltaniyeh)" />
          {/* Wide open highland plain */}
          <rect x="0" y="70" width="240" height="26" fill="#26433C" />
          {/* Iconic Octagonal Turquoise Dome of Soltaniyeh */}
          <path d="M98 48 Q120 10 142 48 Z" fill="#23A6BF" stroke="#ECC772" strokeWidth="1.3" />
          <rect x="88" y="48" width="64" height="26" fill="#4A3D30" stroke="#D2A760" strokeWidth="1" />
          <line x1="92" y1="36" x2="92" y2="48" stroke="#ECC772" strokeWidth="2" />
          <line x1="148" y1="36" x2="148" y2="48" stroke="#ECC772" strokeWidth="2" />
          <path d="M111 74 L111 56 Q120 48 129 56 L129 74 Z" fill="#182C33" />
          {/* Reflecting plain channel */}
          <rect x="76" y="82" width="88" height="6" rx="3" fill="#4CE2EE" />
        </svg>
      );

    case 'mahneshan':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-mahneshan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A2236" />
              <stop offset="56%" stopColor="#5B3A3B" />
              <stop offset="100%" stopColor="#8C5942" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-mahneshan)" />
          {/* Striated colorful geological hills of Mahneshan (terracotta, ochre, sage) */}
          <path d="M0 68 Q48 26 102 58 T194 42 L240 58 L240 96 L0 96 Z" fill="#9C4D3B" />
          <path d="M0 74 Q58 42 122 66 T240 58 L240 96 L0 96 Z" fill="#C28142" />
          <path d="M0 82 Q74 60 152 78 T240 72 L240 96 L0 96 Z" fill="#5D4437" />
          {/* Deep Qizil Ozan canyon stream */}
          <path d="M0 87 Q64 80 124 88 T240 84" stroke="#3FD2DF" strokeWidth="4" fill="none" />
        </svg>
      );

    // =========================================================================
    // ROUTE 5 — KHORASAN (Eastern Iranian Cultural & Geographical Route)
    // =========================================================================
    case 'gonabad':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-gonabad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19122B" />
              <stop offset="58%" stopColor="#42295C" />
              <stop offset="100%" stopColor="#7C4E4B" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-gonabad)" />
          <path d="M0 54 Q80 42 160 52 T240 48 L240 96 L0 96 Z" fill="#3B2428" />
          {/* Deep vertical qanat shafts & glowing underground gallery */}
          <g fill="#5C3B30" stroke="#D29E56" strokeWidth="1">
            <rect x="48" y="48" width="9" height="32" />
            <rect x="115" y="45" width="10" height="35" />
            <rect x="182" y="48" width="9" height="32" />
          </g>
          <rect x="0" y="76" width="240" height="8" fill="#3EE2F0" />
          <line x1="24" y1="80" x2="72" y2="80" stroke="#E4FEFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="150" y1="80" x2="208" y2="80" stroke="#E4FEFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'ferdows':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-ferdows" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B1530" />
              <stop offset="58%" stopColor="#4F2D59" />
              <stop offset="100%" stopColor="#8C5949" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-ferdows)" />
          <path d="M0 68 Q90 52 170 66 T240 60 L240 96 L0 96 Z" fill="#2A4435" />
          {/* Saffron-bloom & orchard arches */}
          <rect x="76" y="44" width="88" height="28" fill="#462F2A" stroke="#E0A955" strokeOpacity="0.5" />
          <path d="M90 72 L90 55 Q100 47 110 55 L110 72 Z" fill="#1D222B" />
          <path d="M130 72 L130 55 Q140 47 150 55 L150 72 Z" fill="#1D222B" />
          <g fill="#D998F2">
            <circle cx="38" cy="74" r="2.8" />
            <circle cx="52" cy="78" r="2.5" />
            <circle cx="192" cy="74" r="2.8" />
            <circle cx="206" cy="78" r="2.5" />
          </g>
          <rect x="64" y="82" width="112" height="6" rx="3" fill="#3AD4E2" />
        </svg>
      );

    case 'tabas':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-tabas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#151D30" />
              <stop offset="58%" stopColor="#2C5257" />
              <stop offset="100%" stopColor="#7C5E38" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-tabas)" />
          <path d="M0 68 Q80 54 160 66 T240 58 L240 96 L0 96 Z" fill="#243E32" />
          {/* Golshan Oasis Palms & Reflecting Pool */}
          <g stroke="#2B1F16" strokeWidth="3" fill="none">
            <path d="M56 84 Q52 60 60 38" />
            <path d="M184 84 Q188 60 180 38" />
          </g>
          <g fill="#2E8C68">
            <path d="M60 38 Q38 32 34 42 Q48 40 60 38 Z" />
            <path d="M60 38 Q50 24 42 28 Q52 32 60 38 Z" />
            <path d="M60 38 Q76 32 82 42 Q70 40 60 38 Z" />
            <path d="M180 38 Q162 32 156 42 Q168 40 180 38 Z" />
            <path d="M180 38 Q190 24 198 28 Q188 32 180 38 Z" />
            <path d="M180 38 Q202 32 206 42 Q192 40 180 38 Z" />
          </g>
          <polygon points="92,96 104,70 136,70 148,96" fill="#2ED3E1" stroke="#E8B85A" strokeWidth="1" />
        </svg>
      );

    case 'birjand':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-birjand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19132E" />
              <stop offset="56%" stopColor="#4D2D4D" />
              <stop offset="100%" stopColor="#9C6238" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-birjand)" />
          {/* Bagheran mountain ridge & golden Persian octagonal pavilion */}
          <polygon points="0,70 68,26 140,60 198,28 240,56 240,96 0,96" fill="#2E2036" />
          <path d="M98 44 Q120 20 142 44 Z" fill="#D99B26" stroke="#FCE5AE" strokeWidth="1.1" />
          <rect x="86" y="44" width="68" height="28" fill="#3B2524" stroke="#E6BA5E" strokeWidth="1" />
          <path d="M110 72 L110 53 Q120 44 130 53 L130 72 Z" fill="#183D47" />
          <rect x="0" y="72" width="240" height="24" fill="#1F1926" />
          <rect x="30" y="81" width="180" height="6" rx="3" fill="#3CE2EF" />
          <circle cx="120" cy="84" r="6" fill="#F2C96B" stroke="#183D47" strokeWidth="1.5" />
        </svg>
      );

    // =========================================================================
    // ROUTE 6 — ISFAHAN PLATEAU
    // =========================================================================
    case 'isfahan':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-isfahan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E2036" />
              <stop offset="58%" stopColor="#185175" />
              <stop offset="100%" stopColor="#2A7F94" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-isfahan)" />
          <path d="M98 44 Q120 16 142 44 Z" fill="#1FA7C2" stroke="#F0C86E" strokeWidth="1.2" />
          <rect x="0" y="48" width="240" height="24" fill="#4B392A" stroke="#DFB062" strokeOpacity="0.45" />
          <g fill="#163F54">
            <path d="M20 72 L20 58 Q30 50 40 58 L40 72 Z" />
            <path d="M64 72 L64 58 Q74 50 84 58 L84 72 Z" />
            <path d="M108 72 L108 55 Q120 47 132 55 L132 72 Z" />
            <path d="M156 72 L156 58 Q166 50 176 58 L176 72 Z" />
            <path d="M200 72 L200 58 Q210 50 220 58 L220 72 Z" />
          </g>
          <rect x="0" y="72" width="240" height="24" fill="#1D9CB3" />
          <line x1="34" y1="84" x2="104" y2="84" stroke="#D8FEFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <line x1="140" y1="84" x2="206" y2="84" stroke="#D8FEFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </svg>
      );

    case 'ardestan':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-ardestan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A263A" />
              <stop offset="60%" stopColor="#634530" />
              <stop offset="100%" stopColor="#9E6E3E" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-ardestan)" />
          <polygon points="0,68 62,28 134,58 198,26 240,54 240,96 0,96" fill="#463225" />
          {/* Two-tier stepped foothill channels */}
          <rect x="0" y="64" width="240" height="32" fill="#322319" />
          <rect x="20" y="70" width="200" height="6" rx="3" fill="#2BC2D4" />
          <rect x="36" y="83" width="168" height="6" rx="3" fill="#63ECF7" />
          <rect x="116" y="56" width="8" height="33" fill="#7D5432" stroke="#E0B15E" strokeWidth="0.8" />
        </svg>
      );

    case 'nain':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-nain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D2234" />
              <stop offset="58%" stopColor="#69462A" />
              <stop offset="100%" stopColor="#B27A40" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-nain)" />
          <path d="M0 68 Q84 52 162 66 T240 60 L240 96 L0 96 Z" fill="#52351F" />
          {/* Mudbrick cistern dome & twin desert towers */}
          <rect x="52" y="34" width="14" height="38" fill="#3E2616" stroke="#D9A352" strokeOpacity="0.45" />
          <rect x="174" y="34" width="14" height="38" fill="#3E2616" stroke="#D9A352" strokeOpacity="0.45" />
          <path d="M84 72 Q120 24 156 72 Z" fill="#684326" stroke="#E5B664" strokeWidth="1.2" />
          <rect x="64" y="80" width="112" height="7" rx="3.5" fill="#2DC8D9" />
        </svg>
      );

    case 'natanz':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-natanz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#122438" />
              <stop offset="58%" stopColor="#265460" />
              <stop offset="100%" stopColor="#457B6B" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-natanz)" />
          {/* Karkas mountain ridge & octagonal turquoise-tiled cupola */}
          <polygon points="0,68 72,20 144,58 206,24 240,52 240,96 0,96" fill="#233E44" />
          <polygon points="104,48 120,18 136,48" fill="#23B2C7" stroke="#ECC66E" strokeWidth="1.1" />
          <rect x="96" y="48" width="48" height="24" fill="#3A2F25" stroke="#D8A756" strokeWidth="1" />
          <path d="M0 72 Q80 62 160 72 T240 68 L240 96 L0 96 Z" fill="#1F4236" />
          <rect x="46" y="81" width="148" height="6" rx="3" fill="#46DFEC" />
        </svg>
      );

    // =========================================================================
    // ROUTE 7 — FARS
    // =========================================================================
    case 'shiraz':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-shiraz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#201730" />
              <stop offset="58%" stopColor="#63324D" />
              <stop offset="100%" stopColor="#9C5658" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-shiraz)" />
          {/* Cypresses & Persian garden pavilion */}
          <g fill="#194238">
            <path d="M36 74 Q44 26 52 74 Z" />
            <path d="M188 74 Q196 26 204 74 Z" />
          </g>
          <rect x="78" y="42" width="84" height="30" fill="#3B2626" stroke="#E5B763" strokeWidth="1.1" />
          <path d="M108 72 L108 52 Q120 42 132 52 L132 72 Z" fill="#1D2E3B" stroke="#E5B763" strokeWidth="0.9" />
          <rect x="0" y="72" width="240" height="24" fill="#1B2A26" />
          <polygon points="94,96 106,72 134,72 146,96" fill="#3BE2F0" />
        </svg>
      );

    case 'neyriz':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-neyriz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#201B32" />
              <stop offset="58%" stopColor="#66393A" />
              <stop offset="100%" stopColor="#A66542" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-neyriz)" />
          <polygon points="0,70 58,34 128,64 192,30 240,58 240,96 0,96" fill="#3A2624" />
          <path d="M0 74 L240 74 L240 96 L0 96 Z" fill="#273A2B" />
          {/* Pomegranate orchard globes */}
          <g fill="#C9444B">
            <circle cx="48" cy="68" r="4" />
            <circle cx="68" cy="72" r="3.5" />
            <circle cx="174" cy="68" r="4" />
            <circle cx="194" cy="72" r="3.5" />
          </g>
          <path d="M30 85 Q120 77 210 85" stroke="#35D2E0" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'estahban':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-estahban" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#162638" />
              <stop offset="58%" stopColor="#3B544F" />
              <stop offset="100%" stopColor="#6D7A56" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-estahban)" />
          {/* Terraced mountain orchard slopes */}
          <path d="M0 54 Q76 32 152 52 T240 44 L240 96 L0 96 Z" fill="#344B3C" />
          <path d="M0 70 Q84 56 168 70 T240 64 L240 96 L0 96 Z" fill="#253A2E" />
          <g fill="#3E6E47">
            <circle cx="54" cy="62" r="9" />
            <circle cx="86" cy="66" r="8" />
            <circle cx="158" cy="66" r="8" />
            <circle cx="188" cy="62" r="9" />
          </g>
          <polygon points="108,46 132,46 142,96 98,96" fill="#2ED0DE" />
        </svg>
      );

    case 'abadeh':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-abadeh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1C2236" />
              <stop offset="58%" stopColor="#5C4434" />
              <stop offset="100%" stopColor="#946D46" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-abadeh)" />
          {/* Highland plateau & circular stone-brick pavilion */}
          <path d="M0 68 Q120 56 240 66 L240 96 L0 96 Z" fill="#463324" />
          <rect x="86" y="42" width="68" height="30" rx="2" fill="#5D422E" stroke="#E0B462" strokeWidth="1.1" />
          <path d="M98 42 Q120 26 142 42 Z" fill="#7A5638" stroke="#E0B462" strokeWidth="1" />
          <path d="M110 72 L110 54 Q120 46 130 54 L130 72 Z" fill="#1C242C" />
          <rect x="34" y="80" width="172" height="6" rx="3" fill="#32CFE0" />
        </svg>
      );

    // =========================================================================
    // ROUTE 8 — SEMNAN
    // =========================================================================
    case 'garmsar':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-garmsar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#202033" />
              <stop offset="56%" stopColor="#7C4E2E" />
              <stop offset="100%" stopColor="#C48543" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-garmsar)" />
          {/* Salt-rimmed desert plain & sunlit ridges */}
          <path d="M0 64 Q72 38 148 58 T240 48 L240 96 L0 96 Z" fill="#7D502C" />
          <path d="M0 76 Q90 66 180 76 T240 72 L240 96 L0 96 Z" fill="#54361F" />
          <path d="M18 85 Q80 78 140 86 T224 82" stroke="#36D3E3" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'semnan':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-semnan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B2134" />
              <stop offset="56%" stopColor="#61422C" />
              <stop offset="100%" stopColor="#A6713C" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-semnan)" />
          {/* Semnan Mudbrick Gateway Portal & Twin Channels */}
          <rect x="74" y="34" width="92" height="40" fill="#4E321E" stroke="#E3B562" strokeWidth="1.2" />
          <path d="M100 74 L100 48 Q120 34 140 48 L140 74 Z" fill="#1C1816" stroke="#E3B562" strokeWidth="1" />
          <rect x="0" y="74" width="240" height="22" fill="#2D2016" />
          <rect x="28" y="82" width="76" height="6" rx="3" fill="#2ECAD9" />
          <rect x="136" y="82" width="76" height="6" rx="3" fill="#2ECAD9" />
          <circle cx="120" cy="85" r="7" fill="#63F0FA" />
        </svg>
      );

    case 'damghan':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-damghan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#182536" />
              <stop offset="58%" stopColor="#4E4332" />
              <stop offset="100%" stopColor="#856A43" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-damghan)" />
          <polygon points="0,68 74,26 154,58 214,28 240,54 240,96 0,96" fill="#39312A" />
          {/* Brick cylindrical tower silhouette & pistachio groves */}
          <rect x="112" y="24" width="16" height="48" fill="#6E4E34" stroke="#E0B462" strokeWidth="1" />
          <g fill="#2C5E41">
            <circle cx="56" cy="70" r="10" />
            <circle cx="80" cy="74" r="8" />
            <circle cx="162" cy="74" r="8" />
            <circle cx="186" cy="70" r="10" />
          </g>
          <rect x="0" y="76" width="240" height="20" fill="#222E24" />
          <rect x="44" y="83" width="152" height="6" rx="3" fill="#32D4E4" />
        </svg>
      );

    case 'shahroud':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-shahroud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#132436" />
              <stop offset="56%" stopColor="#35525C" />
              <stop offset="100%" stopColor="#7A6546" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-shahroud)" />
          {/* High mountain escarpment transitioning to desert basin */}
          <polygon points="0,64 60,18 128,54 190,16 240,48 240,96 0,96" fill="#273944" />
          <polygon points="190,16 206,30 190,32 174,28" fill="#E3F2F7" opacity="0.55" />
          <rect x="0" y="72" width="240" height="24" fill="#2E261E" />
          <rect x="26" y="81" width="188" height="6" rx="3" fill="#46E4F0" />
          <circle cx="120" cy="84" r="5" fill="#F2CA6E" />
        </svg>
      );

    // =========================================================================
    // ROUTE 9 — NORTHWESTERN IRAN
    // =========================================================================
    case 'tabriz':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-tabriz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#122138" />
              <stop offset="58%" stopColor="#2B496E" />
              <stop offset="100%" stopColor="#5D6B7D" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-tabriz)" />
          <polygon points="0,68 78,24 166,58 240,34 240,96 0,96" fill="#273A50" />
          {/* Iconic Red-Brick Vaulted Bazaar Arcade */}
          <rect x="44" y="46" width="152" height="30" fill="#733D2E" stroke="#E0AE6E" strokeWidth="1" />
          <path d="M58 76 L58 58 Q70 48 82 58 L82 76 Z" fill="#1C2938" />
          <path d="M106 76 L106 54 Q120 44 134 54 L134 76 Z" fill="#1E394B" />
          <path d="M158 76 L158 58 Q170 48 182 58 L182 76 Z" fill="#1C2938" />
          <rect x="0" y="76" width="240" height="20" fill="#1D2B36" />
          <rect x="48" y="83" width="144" height="6" rx="3" fill="#47DCEB" />
        </svg>
      );

    case 'maragheh':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-maragheh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#101E36" />
              <stop offset="56%" stopColor="#234868" />
              <stop offset="100%" stopColor="#3F6E6E" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-maragheh)" />
          {/* Sahand southern slope & observatory-hill brick tower */}
          <path d="M0 68 Q68 34 138 62 T240 52 L240 96 L0 96 Z" fill="#244743" />
          <rect x="104" y="32" width="32" height="38" fill="#784434" stroke="#E0B16A" strokeWidth="1.1" />
          <polygon points="100,32 120,16 140,32" fill="#5D3529" stroke="#E0B16A" strokeWidth="1" />
          <path d="M24 84 Q120 74 216 84" stroke="#4FE2EE" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'khoy':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-khoy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#132238" />
              <stop offset="58%" stopColor="#2D5270" />
              <stop offset="100%" stopColor="#587C78" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-khoy)" />
          {/* Mountain pass valley & bright highland sunflower meadow */}
          <polygon points="0,66 64,22 120,58 176,20 240,56 240,96 0,96" fill="#243E52" />
          <path d="M0 72 Q120 62 240 72 L240 96 L0 96 Z" fill="#27473B" />
          <g fill="#F0C64F">
            <circle cx="42" cy="76" r="3" />
            <circle cx="60" cy="80" r="2.6" />
            <circle cx="182" cy="76" r="3" />
            <circle cx="198" cy="80" r="2.6" />
          </g>
          <polygon points="104,58 136,58 148,96 92,96" fill="#4AE0EE" />
        </svg>
      );

    case 'urmia':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-urmia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#102038" />
              <stop offset="54%" stopColor="#224F73" />
              <stop offset="100%" stopColor="#3B8296" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-urmia)" />
          <polygon points="0,62 64,26 138,54 202,24 240,48 240,96 0,96" fill="#213D54" />
          {/* Shimmering lakeside basin & vineyard hills */}
          <rect x="0" y="64" width="240" height="32" fill="#1D7B96" />
          <line x1="28" y1="74" x2="110" y2="74" stroke="#CFFAFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
          <line x1="132" y1="84" x2="212" y2="84" stroke="#CFFAFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          <path d="M0 64 Q42 52 84 64 L0 64 Z" fill="#2A5E4B" />
          <path d="M156 64 Q198 52 240 64 L156 64 Z" fill="#2A5E4B" />
        </svg>
      );

    // =========================================================================
    // ROUTE 10 — RAZAVI KHORASAN
    // =========================================================================
    case 'nishapur':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-nishapur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E1B34" />
              <stop offset="58%" stopColor="#1A4F6B" />
              <stop offset="100%" stopColor="#2A8499" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-nishapur)" />
          <polygon points="0,66 72,22 146,56 212,24 240,48 240,96 0,96" fill="#1E354D" />
          {/* Nishapur Turquoise Gem Dome */}
          <path d="M98 52 Q120 18 142 52 Z" fill="#28C8DC" stroke="#F4CE74" strokeWidth="1.4" />
          <rect x="90" y="52" width="60" height="22" fill="#2A2B38" stroke="#E5BE64" strokeWidth="1" />
          <rect x="0" y="74" width="240" height="22" fill="#162936" />
          <rect x="38" y="82" width="164" height="6" rx="3" fill="#63F2FC" />
        </svg>
      );

    case 'sabzevar':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-sabzevar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#161A32" />
              <stop offset="58%" stopColor="#4E3B4A" />
              <stop offset="100%" stopColor="#946744" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-sabzevar)" />
          <path d="M0 66 Q80 48 164 64 T240 56 L240 96 L0 96 Z" fill="#46302A" />
          {/* Brick minaret tower & subterranean desert corridor */}
          <rect x="114" y="20" width="12" height="48" fill="#6E4A32" stroke="#E5B763" strokeWidth="1" />
          <rect x="0" y="72" width="240" height="24" fill="#261C1D" />
          <rect x="24" y="81" width="192" height="6" rx="3" fill="#3CD9E8" />
          <circle cx="72" cy="70" r="3" fill="#E5B763" />
          <circle cx="168" cy="70" r="3" fill="#E5B763" />
        </svg>
      );

    case 'kashmar':
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-kashmar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#181933" />
              <stop offset="58%" stopColor="#3C3B59" />
              <stop offset="100%" stopColor="#6D5858" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-kashmar)" />
          {/* Highland vineyard terraces */}
          <path d="M0 58 Q74 36 148 56 T240 48 L240 96 L0 96 Z" fill="#2A4A3E" />
          <path d="M0 72 Q86 58 172 72 T240 66 L240 96 L0 96 Z" fill="#1F3930" />
          <g fill="#7A4C8C" opacity="0.85">
            <circle cx="48" cy="68" r="3" />
            <circle cx="62" cy="72" r="2.8" />
            <circle cx="178" cy="68" r="3" />
            <circle cx="192" cy="72" r="2.8" />
          </g>
          <polygon points="104,56 136,56 148,96 92,96" fill="#3BE0EE" />
        </svg>
      );

    case 'torbat_heydarieh':
    default:
      return (
        <svg viewBox="0 0 240 96" className={cls} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dest-torbat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#121430" />
              <stop offset="56%" stopColor="#3E2A5C" />
              <stop offset="100%" stopColor="#7C4E69" />
            </linearGradient>
          </defs>
          <rect width="240" height="96" fill="url(#dest-torbat)" />
          {/* Saffron plateau & radiant turquoise finale medallion */}
          <polygon points="0,68 70,28 144,58 206,24 240,52 240,96 0,96" fill="#281E3B" />
          <path d="M98 44 Q120 18 142 44 Z" fill="#24BFD4" stroke="#F6D47A" strokeWidth="1.3" />
          <rect x="86" y="44" width="68" height="28" fill="#34253B" stroke="#F0C66B" strokeWidth="1" />
          <rect x="0" y="72" width="240" height="24" fill="#1E172E" />
          <g fill="#DFA2F7">
            <circle cx="34" cy="78" r="2.6" />
            <circle cx="50" cy="84" r="2.2" />
            <circle cx="190" cy="78" r="2.6" />
            <circle cx="206" cy="84" r="2.2" />
          </g>
          <rect x="26" y="81" width="188" height="6" rx="3" fill="#68F4FF" />
          <circle cx="120" cy="84" r="6.5" fill="#F6D47A" stroke="#153B4A" strokeWidth="1.6" />
        </svg>
      );
  }
}
