import type { RegionId } from '../engine/types';

interface RegionArtworkSvgProps {
  regionId: RegionId;
  locked?: boolean;
}

/**
 * Custom lightweight inline SVG architectural & landscape illustrations for all 12 Iranian routes.
 * Zero external image dependencies; works 100% offline and crisp at all screen densities.
 */
export function RegionArtworkSvg({ regionId, locked = false }: RegionArtworkSvgProps) {
  const filterClass = locked ? 'grayscale opacity-55' : '';

  if (regionId === 'yazd') {
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="yazdSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2639" />
            <stop offset="58%" stopColor="#5C3B24" />
            <stop offset="100%" stopColor="#A66B36" />
          </linearGradient>
          <linearGradient id="yazdWater" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0E6F7D" />
            <stop offset="50%" stopColor="#26C6D8" />
            <stop offset="100%" stopColor="#0E6F7D" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#yazdSky)" />
        <circle cx="48" cy="24" r="1.2" fill="#FBE6B2" opacity="0.8" />
        <circle cx="112" cy="18" r="1" fill="#FBE6B2" opacity="0.65" />
        <circle cx="290" cy="22" r="1.4" fill="#FBE6B2" opacity="0.75" />
        <path d="M0 102 Q78 72 162 98 T360 88 L360 150 L0 150 Z" fill="#8C592D" />
        <path d="M0 118 Q110 92 220 112 T360 104 L360 150 L0 150 Z" fill="#5D3B1E" />

        {/* Yazd Mudbrick Windcatchers & Ab-Anbar */}
        <g fill="#422916" stroke="#C78A42" strokeOpacity="0.35" strokeWidth="1">
          <rect x="44" y="46" width="32" height="58" rx="1" />
          <rect x="49" y="51" width="4" height="22" fill="#23160C" />
          <rect x="57" y="51" width="4" height="22" fill="#23160C" />
          <rect x="65" y="51" width="4" height="22" fill="#23160C" />
          <rect x="86" y="64" width="24" height="44" rx="1" />
          <rect x="91" y="69" width="3.5" height="16" fill="#23160C" />
          <rect x="98" y="69" width="3.5" height="16" fill="#23160C" />
          <path d="M250 105 Q278 58 306 105 Z" fill="#4D3019" />
          <rect x="236" y="74" width="12" height="32" />
          <rect x="308" y="74" width="12" height="32" />
        </g>

        <path d="M142 150 L142 78 Q180 42 218 78 L218 150 Z" fill="#322013" stroke="#D99B26" strokeWidth="1.5" />
        <path d="M154 150 L154 88 Q180 62 206 88 L206 150 Z" fill="#1C140E" />
        <polygon points="160,150 168,108 192,108 200,150" fill="url(#yazdWater)" />
        <line x1="175" y1="116" x2="185" y2="116" stroke="#B6FAFF" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="170" y1="128" x2="190" y2="128" stroke="#B6FAFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        <line x1="166" y1="140" x2="194" y2="140" stroke="#B6FAFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
      </svg>
    );
  }

  if (regionId === 'kerman') {
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="kermanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#142334" />
            <stop offset="55%" stopColor="#27474E" />
            <stop offset="100%" stopColor="#466957" />
          </linearGradient>
          <linearGradient id="kermanStream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4CE5EC" />
            <stop offset="100%" stopColor="#137E8B" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#kermanSky)" />
        <polygon points="0,112 72,44 148,96 225,36 308,88 360,54 360,150 0,150" fill="#21383D" />
        <polygon points="225,36 250,56 232,58 214,50" fill="#D5EAEB" opacity="0.35" />
        <polygon points="0,118 95,84 210,114 360,92 360,150 0,150" fill="#2B3E2E" />

        <polygon points="158,88 202,88 224,150 136,150" fill="#1A2C27" stroke="#3FA883" strokeWidth="1.2" />
        <polygon points="168,92 192,92 208,150 152,150" fill="url(#kermanStream)" />
        <line x1="164" y1="106" x2="196" y2="106" stroke="#C4FBFF" strokeWidth="2" opacity="0.85" />
        <line x1="158" y1="124" x2="202" y2="124" stroke="#C4FBFF" strokeWidth="2" opacity="0.7" />
        <line x1="152" y1="141" x2="208" y2="141" stroke="#C4FBFF" strokeWidth="2" opacity="0.55" />

        <g stroke="#1C291E" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M74 148 Q70 112 82 78" />
          <path d="M288 148 Q292 110 278 74" />
        </g>
        <g fill="#2E7D5E">
          <path d="M82 78 Q56 68 48 84 Q66 80 82 78 Z" />
          <path d="M82 78 Q68 54 54 60 Q70 68 82 78 Z" />
          <path d="M82 78 Q94 52 110 62 Q94 68 82 78 Z" />
          <path d="M82 78 Q106 72 114 88 Q96 82 82 78 Z" />
          <path d="M278 74 Q252 64 244 80 Q262 76 278 74 Z" />
          <path d="M278 74 Q264 50 250 56 Q266 64 278 74 Z" />
          <path d="M278 74 Q292 48 308 58 Q292 64 278 74 Z" />
          <path d="M278 74 Q304 68 312 84 Q294 78 278 74 Z" />
        </g>
      </svg>
    );
  }

  if (regionId === 'kashan') {
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="kashanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E1E2B" />
            <stop offset="60%" stopColor="#164354" />
            <stop offset="100%" stopColor="#266473" />
          </linearGradient>
          <linearGradient id="kashanPool" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#35DCE8" />
            <stop offset="100%" stopColor="#0C6978" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#kashanSky)" />
        <g fill="#12312E">
          <path d="M46 112 Q56 44 66 112 Z" />
          <path d="M78 114 Q86 58 94 114 Z" />
          <path d="M266 114 Q274 58 282 114 Z" />
          <path d="M294 112 Q304 44 314 112 Z" />
        </g>
        <path d="M150 62 Q180 26 210 62 Z" fill="#188C9E" stroke="#E6BA5E" strokeWidth="1.4" />
        <rect x="118" y="62" width="124" height="50" fill="#29221C" stroke="#D99B26" strokeWidth="1.2" />
        <path d="M130 112 L130 82 Q142 70 154 82 L154 112 Z" fill="#162933" />
        <path d="M164 112 L164 76 Q180 62 196 76 L196 112 Z" fill="#1A3945" stroke="#E6BA5E" strokeWidth="1" />
        <path d="M206 112 L206 82 Q218 70 230 82 L230 112 Z" fill="#162933" />
        <rect x="0" y="112" width="360" height="38" fill="#1A2428" />
        <polygon points="130,150 152,114 208,114 230,150" fill="url(#kashanPool)" stroke="#E6BA5E" strokeWidth="1.5" />
        <path d="M180 128 Q174 112 168 124" fill="none" stroke="#C5FDFF" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M180 128 Q186 112 192 124" fill="none" stroke="#C5FDFF" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="180" y1="130" x2="180" y2="112" stroke="#E8FEFF" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="180" cy="132" rx="14" ry="3.5" fill="none" stroke="#B6FAFF" strokeWidth="1.2" opacity="0.8" />
      </svg>
    );
  }

  if (regionId === 'zanjan') {
    // Route 4: Zanjan — Highland valleys, Soltaniyeh turquoise dome silhouette, colorful hills & meandering creek
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="zanjanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#122234" />
            <stop offset="52%" stopColor="#264C61" />
            <stop offset="100%" stopColor="#46736E" />
          </linearGradient>
          <linearGradient id="zanjanRiver" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#72F0EC" />
            <stop offset="100%" stopColor="#1C8C96" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#zanjanSky)" />
        {/* Crisp highland clouds / mist bands */}
        <path d="M24 34 Q52 26 84 34" stroke="#B8DCE6" strokeWidth="2" strokeLinecap="round" opacity="0.25" fill="none" />
        <path d="M266 26 Q302 20 336 28" stroke="#B8DCE6" strokeWidth="2" strokeLinecap="round" opacity="0.22" fill="none" />

        {/* Distant Alborz-west & Ijrud mountain ridges */}
        <polygon points="0,98 54,48 118,86 184,42 252,80 318,46 360,72 360,150 0,150" fill="#1F3B47" />
        {/* Mahneshan warm striated hills on left */}
        <path d="M0 112 Q48 76 112 104 T214 114 L214 150 L0 150 Z" fill="#6B4A38" opacity="0.72" />
        <path d="M0 120 Q56 90 124 112 L124 150 L0 150 Z" fill="#8D5A3E" opacity="0.6" />
        {/* Green-slate highland valley floor */}
        <path d="M0 116 Q102 96 196 114 T360 100 L360 150 L0 150 Z" fill="#234740" />

        {/* Iconic octagonal turquoise dome silhouette (Soltaniyeh plain horizon) */}
        <g>
          <path d="M244 74 Q268 32 292 74 Z" fill="#1F99B0" stroke="#E6C26E" strokeWidth="1.2" />
          <rect x="234" y="74" width="68" height="34" fill="#3B3126" stroke="#C59D56" strokeWidth="1" />
          <path d="M248 108 L248 86 Q256 78 264 86 L264 108 Z" fill="#1D2B30" />
          <path d="M272 108 L272 86 Q280 78 288 86 L288 108 Z" fill="#1D2B30" />
          <line x1="238" y1="62" x2="238" y2="74" stroke="#E6C26E" strokeWidth="2" />
          <line x1="298" y1="62" x2="298" y2="74" stroke="#E6C26E" strokeWidth="2" />
        </g>

        {/* Meandering highland stream through valley */}
        <path
          d="M174 104 Q142 118 168 130 T146 150 L196 150 Q218 134 190 122 T196 104 Z"
          fill="url(#zanjanRiver)"
        />
        <path d="M176 112 Q168 118 178 124" stroke="#D8FEFF" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M168 134 Q182 140 166 146" stroke="#D8FEFF" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }

  if (regionId === 'khorasan') {
    // Route 5: Khorasan — Deep amethyst-indigo twilight, vertical qanat shaft cross-section, eastern mountain & palm oasis
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="khorasanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#161026" />
            <stop offset="56%" stopColor="#3B2552" />
            <stop offset="100%" stopColor="#7C4B48" />
          </linearGradient>
          <linearGradient id="khorasanVein" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1998A8" />
            <stop offset="50%" stopColor="#65F2FA" />
            <stop offset="100%" stopColor="#1998A8" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#khorasanSky)" />
        {/* Eastern desert stars & golden crescent */}
        <circle cx="52" cy="24" r="1.4" fill="#FCE5AE" opacity="0.85" />
        <circle cx="132" cy="18" r="1.1" fill="#FCE5AE" opacity="0.7" />
        <circle cx="236" cy="26" r="1.2" fill="#FCE5AE" opacity="0.8" />
        <path d="M310 18 A12 12 0 1 0 322 34 A9.5 9.5 0 1 1 310 18 Z" fill="#F2C96B" opacity="0.85" />

        {/* Eastern Iranian plateau ridges */}
        <polygon points="0,98 84,54 176,84 264,48 360,82 360,150 0,150" fill="#2A1C33" />
        <path d="M0 100 Q110 82 220 96 T360 88 L360 150 L0 150 Z" fill="#462C2B" />

        {/* Subterranean Qanat cross-section with vertical access shafts (Gonabad heritage motif) */}
        <rect x="0" y="106" width="360" height="44" fill="#23161B" />
        <g stroke="#B8874A" strokeWidth="1.2" fill="#3A2524">
          <rect x="74" y="88" width="10" height="40" />
          <rect x="148" y="92" width="10" height="36" />
          <rect x="222" y="94" width="10" height="34" />
          <rect x="296" y="90" width="10" height="38" />
        </g>
        {/* Shaft rim mounds */}
        <g fill="#7A5236">
          <ellipse cx="79" cy="88" rx="14" ry="3.5" />
          <ellipse cx="153" cy="92" rx="13" ry="3" />
          <ellipse cx="227" cy="94" rx="13" ry="3" />
          <ellipse cx="301" cy="90" rx="14" ry="3.5" />
        </g>
        {/* Glowing horizontal underground water gallery */}
        <rect x="0" y="125" width="360" height="12" fill="#12313B" />
        <rect x="0" y="128" width="360" height="6" fill="url(#khorasanVein)" />
        <line x1="22" y1="131" x2="72" y2="131" stroke="#E0FEFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
        <line x1="162" y1="131" x2="218" y2="131" stroke="#E0FEFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
        <line x1="268" y1="131" x2="328" y2="131" stroke="#E0FEFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />

        {/* Small Tabas palm silhouette on horizon */}
        <g stroke="#1C1520" strokeWidth="3" fill="none">
          <path d="M36 106 Q34 84 42 66" />
        </g>
        <g fill="#2F7F6B">
          <path d="M42 66 Q24 60 20 70 Q32 68 42 66 Z" />
          <path d="M42 66 Q32 52 24 56 Q34 60 42 66 Z" />
          <path d="M42 66 Q54 54 62 62 Q52 64 42 66 Z" />
          <path d="M42 66 Q58 66 64 76 Q52 70 42 66 Z" />
        </g>
      </svg>
    );
  }

  if (regionId === 'isfahan') {
    // Route 6: Isfahan Plateau — Iconic arched stone bridge, royal turquoise dome & Zayandehrud reflections
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="isfahanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0C1C30" />
            <stop offset="56%" stopColor="#17486B" />
            <stop offset="100%" stopColor="#28768C" />
          </linearGradient>
          <linearGradient id="isfahanRiver" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0D5C70" />
            <stop offset="50%" stopColor="#35DAE8" />
            <stop offset="100%" stopColor="#0D5C70" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#isfahanSky)" />
        {/* Royal turquoise dome & twin slender minarets in background */}
        <path d="M148 76 Q180 28 212 76 Z" fill="#189AB4" stroke="#F0C86E" strokeWidth="1.4" />
        <rect x="116" y="42" width="10" height="44" fill="#1D5B74" stroke="#E5B95C" strokeWidth="0.9" />
        <rect x="234" y="42" width="10" height="44" fill="#1D5B74" stroke="#E5B95C" strokeWidth="0.9" />
        <circle cx="121" cy="40" r="3" fill="#F0C86E" />
        <circle cx="239" cy="40" r="3" fill="#F0C86E" />

        {/* Multi-arch river bridge spanning horizon */}
        <rect x="0" y="74" width="360" height="36" fill="#473628" stroke="#D9A85B" strokeOpacity="0.5" />
        <g fill="#163E52">
          <path d="M18 110 L18 90 Q32 78 46 90 L46 110 Z" />
          <path d="M68 110 L68 90 Q82 78 96 90 L96 110 Z" />
          <path d="M118 110 L118 90 Q132 78 146 90 L146 110 Z" />
          <path d="M166 110 L166 86 Q180 74 194 86 L194 110 Z" />
          <path d="M214 110 L214 90 Q228 78 242 90 L242 110 Z" />
          <path d="M264 110 L264 90 Q278 78 292 90 L292 110 Z" />
          <path d="M314 110 L314 90 Q328 78 342 90 L342 110 Z" />
        </g>
        {/* Warm lanterns inside bridge arches */}
        <g fill="#F8D277" opacity="0.85">
          <circle cx="32" cy="92" r="2.2" />
          <circle cx="82" cy="92" r="2.2" />
          <circle cx="132" cy="92" r="2.2" />
          <circle cx="180" cy="89" r="2.8" />
          <circle cx="228" cy="92" r="2.2" />
          <circle cx="278" cy="92" r="2.2" />
          <circle cx="328" cy="92" r="2.2" />
        </g>

        {/* Glowing river & arch reflections */}
        <rect x="0" y="110" width="360" height="40" fill="url(#isfahanRiver)" />
        <line x1="22" y1="122" x2="90" y2="122" stroke="#D9FEFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <line x1="142" y1="130" x2="218" y2="130" stroke="#F8D277" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
        <line x1="262" y1="122" x2="334" y2="122" stroke="#D9FEFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }

  if (regionId === 'fars') {
    // Route 7: Fars — Rose-twilight garden sky, tall Persian cypresses, pavilion & stepped turquoise water rill
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="farsSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D162C" />
            <stop offset="56%" stopColor="#5C2D45" />
            <stop offset="100%" stopColor="#9C574B" />
          </linearGradient>
          <linearGradient id="farsRill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5BF0F7" />
            <stop offset="100%" stopColor="#117E8E" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#farsSky)" />
        {/* Southern Zagros silhouettes */}
        <polygon points="0,104 68,54 152,92 238,48 318,86 360,64 360,150 0,150" fill="#2A1E2F" />
        {/* Persian cypress garden flanking central pavilion */}
        <g fill="#173D35">
          <path d="M36 112 Q46 38 56 112 Z" />
          <path d="M74 114 Q82 54 90 114 Z" />
          <path d="M270 114 Q278 54 286 114 Z" />
          <path d="M304 112 Q314 38 324 112 Z" />
        </g>
        {/* Garden pavilion */}
        <rect x="122" y="64" width="116" height="44" fill="#3B2724" stroke="#E5B763" strokeWidth="1.2" />
        <path d="M142 64 Q180 42 218 64 Z" fill="#6D3342" stroke="#E5B763" strokeWidth="1.1" />
        <path d="M164 108 L164 78 Q180 66 196 78 L196 108 Z" fill="#1E2C36" stroke="#E5B763" strokeWidth="1" />
        {/* Stepped garden terrace & central reflecting water channel */}
        <rect x="0" y="108" width="360" height="42" fill="#1D2B27" />
        <polygon points="146,150 162,108 198,108 214,150" fill="url(#farsRill)" stroke="#E5B763" strokeWidth="1.2" />
        <line x1="166" y1="120" x2="194" y2="120" stroke="#E4FEFF" strokeWidth="1.7" strokeLinecap="round" />
        <line x1="160" y1="136" x2="200" y2="136" stroke="#E4FEFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        {/* Citrus/blossom accents */}
        <g fill="#F0A362" opacity="0.85">
          <circle cx="106" cy="122" r="2.8" />
          <circle cx="118" cy="134" r="2.2" />
          <circle cx="244" cy="124" r="2.8" />
          <circle cx="256" cy="134" r="2.2" />
        </g>
      </svg>
    );
  }

  if (regionId === 'semnan') {
    // Route 8: Semnan — Southern Alborz ridge meeting ochre desert edge, mudbrick gateway & twin oasis pools
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="semnanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B2133" />
            <stop offset="56%" stopColor="#69462E" />
            <stop offset="100%" stopColor="#B87A40" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#semnanSky)" />
        {/* Southern Alborz escarpment */}
        <polygon points="0,98 76,38 158,82 246,32 324,78 360,54 360,150 0,150" fill="#3B2B26" />
        <path d="M0 104 Q96 86 196 102 T360 92 L360 150 L0 150 Z" fill="#634025" />
        {/* Mudbrick Silk-Road gateway portal */}
        <rect x="128" y="54" width="104" height="54" fill="#4C301C" stroke="#E0B15A" strokeWidth="1.2" />
        <path d="M156 108 L156 72 Q180 54 204 72 L204 108 Z" fill="#1F1815" stroke="#E0B15A" strokeWidth="1" />
        <rect x="136" y="44" width="14" height="12" fill="#4C301C" stroke="#E0B15A" strokeWidth="0.9" />
        <rect x="210" y="44" width="14" height="12" fill="#4C301C" stroke="#E0B15A" strokeWidth="0.9" />
        {/* Twin oasis water channels converging toward desert edge */}
        <rect x="0" y="108" width="360" height="42" fill="#2E2016" />
        <rect x="34" y="122" width="118" height="10" rx="5" fill="#27C2D1" />
        <rect x="208" y="122" width="118" height="10" rx="5" fill="#27C2D1" />
        <circle cx="180" cy="127" r="13" fill="#1791A0" stroke="#E0B15A" strokeWidth="1.5" />
        <circle cx="180" cy="127" r="6" fill="#9BF9FF" />
      </svg>
    );
  }

  if (regionId === 'northwest') {
    // Route 9: Northwestern Iran — Cool sapphire-slate Sahand peaks, red-brick vaulted arches & shimmering highland basin
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nwSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#101D33" />
            <stop offset="56%" stopColor="#244369" />
            <stop offset="100%" stopColor="#4A6F8C" />
          </linearGradient>
          <linearGradient id="nwBasin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1D6885" />
            <stop offset="50%" stopColor="#5CD8E8" />
            <stop offset="100%" stopColor="#1D6885" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#nwSky)" />
        {/* Snow-dusted highland peaks (Sahand / Sabalan horizon) */}
        <polygon points="0,100 66,34 134,84 214,26 292,78 360,44 360,150 0,150" fill="#23374F" />
        <polygon points="214,26 238,48 218,52 198,42" fill="#E8F4FA" opacity="0.65" />
        <polygon points="66,34 86,52 68,54 52,46" fill="#E8F4FA" opacity="0.45" />
        {/* Red-brick vaulted arcade (Tabriz/Maragheh architectural motif) */}
        <rect x="64" y="68" width="232" height="40" fill="#6E3B2E" stroke="#DFAC6C" strokeOpacity="0.5" />
        <g fill="#1D2B3B">
          <path d="M84 108 L84 82 Q100 70 116 82 L116 108 Z" />
          <path d="M158 108 L158 78 Q180 64 202 78 L202 108 Z" />
          <path d="M244 108 L244 82 Q260 70 276 82 L276 108 Z" />
        </g>
        {/* Cool highland basin & shimmering water */}
        <rect x="0" y="108" width="360" height="42" fill="url(#nwBasin)" />
        <line x1="42" y1="124" x2="132" y2="124" stroke="#E2FCFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="210" y1="134" x2="318" y2="134" stroke="#E2FCFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }

  if (regionId === 'razavi_khorasan') {
    // Route 10: Razavi Khorasan — Deep lapis sky, Binalud peaks, turquoise gem domes, saffron plateau & radiant pulse
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="razaviSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D1630" />
            <stop offset="56%" stopColor="#1D4363" />
            <stop offset="100%" stopColor="#4F3D66" />
          </linearGradient>
          <linearGradient id="razaviPulse" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#199CB0" />
            <stop offset="50%" stopColor="#7DF7FF" />
            <stop offset="100%" stopColor="#199CB0" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#razaviSky)" />
        <circle cx="48" cy="22" r="1.5" fill="#FBE4A4" opacity="0.9" />
        <circle cx="118" cy="16" r="1.2" fill="#FBE4A4" opacity="0.8" />
        <circle cx="246" cy="20" r="1.5" fill="#FBE4A4" opacity="0.9" />
        <circle cx="314" cy="28" r="1.3" fill="#FBE4A4" opacity="0.75" />

        {/* Binalud mountain horizon */}
        <polygon points="0,98 78,46 154,84 242,40 318,80 360,56 360,150 0,150" fill="#1F2C45" />
        {/* Nishapur turquoise dome & golden-rimmed finial */}
        <path d="M148 76 Q180 28 212 76 Z" fill="#20B7C9" stroke="#F4CE74" strokeWidth="1.6" />
        <rect x="134" y="76" width="92" height="32" fill="#2D2838" stroke="#E8BF62" strokeWidth="1.2" />
        <path d="M164 108 L164 84 Q180 72 196 84 L196 108 Z" fill="#163547" stroke="#F4CE74" strokeWidth="1" />
        {/* Saffron plateau terrace & radiant turquoise channel */}
        <rect x="0" y="108" width="360" height="42" fill="#231D30" />
        <g fill="#D59AF2" opacity="0.85">
          <circle cx="46" cy="118" r="2.6" />
          <circle cx="72" cy="126" r="2.2" />
          <circle cx="288" cy="118" r="2.6" />
          <circle cx="316" cy="126" r="2.2" />
        </g>
        <rect x="24" y="128" width="312" height="9" rx="4.5" fill="url(#razaviPulse)" />
        <circle cx="180" cy="132" r="9" fill="#F4CE74" stroke="#123A4A" strokeWidth="2" />
        <circle cx="180" cy="132" r="3.5" fill="#7DF7FF" />
      </svg>
    );
  }

  if (regionId === 'shahsavan') {
    // Route 11: Shahsavan Heritage — Snow-capped Sabalan highlands, Moghan plain, traditional felt alachiq & Varni-inspired geometric trim
    return (
      <svg
        viewBox="0 0 360 150"
        className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="shahsavanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E1D24" />
            <stop offset="56%" stopColor="#1D4446" />
            <stop offset="100%" stopColor="#35685C" />
          </linearGradient>
          <linearGradient id="shahsavanStream" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#26A69A" />
            <stop offset="50%" stopColor="#6AF5DF" />
            <stop offset="100%" stopColor="#26A69A" />
          </linearGradient>
        </defs>
        <rect width="360" height="150" fill="url(#shahsavanSky)" />

        {/* Snow-capped Mount Sabalan massif */}
        <polygon points="0,98 62,56 122,82 182,22 246,78 308,52 360,84 360,150 0,150" fill="#1C3639" />
        <polygon points="182,22 204,44 190,46 178,39 164,46" fill="#EAF7F8" opacity="0.72" />
        <polygon points="62,56 76,68 62,70 50,66" fill="#DDF0F2" opacity="0.38" />

        {/* Verdant Moghan & piedmont grazing hills */}
        <path d="M0 102 Q88 76 176 98 T360 88 L360 150 L0 150 Z" fill="#234A3F" />
        <path d="M0 116 Q116 98 228 114 T360 106 L360 150 L0 150 Z" fill="#1A352F" />

        {/* Traditional domed Shahsavan felt tents (Alachiq) */}
        <g stroke="#E6BA5E" strokeOpacity="0.65" strokeWidth="1.1">
          <path d="M74 114 Q96 84 118 114 Z" fill="#593A2B" />
          <path d="M90 114 L90 103 Q96 98 102 103 L102 114 Z" fill="#1C1917" />
          <path d="M236 112 Q262 78 288 112 Z" fill="#633F2E" />
          <path d="M254 112 L254 100 Q262 94 270 100 L270 112 Z" fill="#1C1917" />
        </g>

        {/* Alpine river channel */}
        <path d="M180 68 Q168 92 184 112 T174 136" stroke="url(#shahsavanStream)" strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* Subtle Varni flatweave diamond border strip at base */}
        <rect x="0" y="135" width="360" height="15" fill="#231819" />
        <g fill="#E07A54" stroke="#43C2A8" strokeWidth="0.9">
          <polygon points="24,142 34,137 44,142 34,147" />
          <polygon points="72,142 82,137 92,142 82,147" />
          <polygon points="120,142 130,137 140,142 130,147" />
          <polygon points="170,142 180,137 190,142 180,147" />
          <polygon points="220,142 230,137 240,142 230,147" />
          <polygon points="268,142 278,137 288,142 278,147" />
          <polygon points="316,142 326,137 336,142 326,147" />
        </g>
      </svg>
    );
  }

  // Route 12: Turkmen Sahra Heritage — Open golden steppe, Gorgan-Rud & Caspian horizon, Turkmen brick tower silhouette, subtle octagonal gol carpet border
  return (
    <svg
      viewBox="0 0 360 150"
      className={`w-full h-32 sm:h-36 block object-cover ${filterClass}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="turkmenSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B1324" />
          <stop offset="55%" stopColor="#5C2D32" />
          <stop offset="100%" stopColor="#C47E38" />
        </linearGradient>
        <linearGradient id="turkmenRiver" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#167B8E" />
          <stop offset="50%" stopColor="#5BE9F4" />
          <stop offset="100%" stopColor="#167B8E" />
        </linearGradient>
      </defs>
      <rect width="360" height="150" fill="url(#turkmenSky)" />
      {/* Warm setting sun over Turkmen steppe */}
      <circle cx="284" cy="46" r="18" fill="#F8CD6B" opacity="0.82" />

      {/* Rolling Turkmen Sahra steppe hills & Maraveh ridges */}
      <path d="M0 94 Q84 72 178 90 T360 80 L360 150 L0 150 Z" fill="#462C22" />
      <path d="M0 108 Q106 94 218 106 T360 98 L360 150 L0 150 Z" fill="#2E1E1B" />

      {/* Tall Brick Minaret / Monument Tower Silhouette on plain */}
      <polygon points="168,96 173,28 187,28 192,96" fill="#633D28" stroke="#E5A83B" strokeWidth="1" />
      <polygon points="171,28 180,12 189,28" fill="#8C5432" stroke="#E5A83B" strokeWidth="0.9" />

      {/* Stylized steppe horse silhouettes */}
      <g fill="#1D1213">
        <path d="M74 102 Q82 93 90 95 L96 89 L100 91 L95 98 L98 108 L94 108 L92 101 L80 101 L78 108 L74 108 Z" />
        <path d="M254 103 Q262 94 270 96 L276 90 L280 92 L275 99 L278 109 L274 109 L272 102 L260 102 L258 109 L254 109 Z" />
      </g>

      {/* Meandering Gorgan-Rud & Caspian coastal pulse */}
      <path d="M0 120 Q92 110 180 121 T360 118" stroke="url(#turkmenRiver)" strokeWidth="7" fill="none" />
      <line x1="36" y1="118" x2="112" y2="118" stroke="#DCFEFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      <line x1="226" y1="119" x2="312" y2="119" stroke="#DCFEFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />

      {/* Authentic Turkmen octagonal gol carpet border at base */}
      <rect x="0" y="135" width="360" height="15" fill="#3B161B" />
      <g fill="#E5A83B" stroke="#C84B4B" strokeWidth="1">
        <polygon points="28,138 38,138 42,142 38,147 28,147 24,142" />
        <polygon points="92,138 102,138 106,142 102,147 92,147 88,142" />
        <polygon points="175,138 185,138 189,142 185,147 175,147 171,142" />
        <polygon points="258,138 268,138 272,142 268,147 258,147 254,142" />
        <polygon points="322,138 332,138 336,142 332,147 322,147 318,142" />
      </g>
    </svg>
  );
}
