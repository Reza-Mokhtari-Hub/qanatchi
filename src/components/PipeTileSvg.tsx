import type { CSSProperties } from 'react';
import { buildDirectionalWaterSegments } from '../animation/flowVisuals';
import { toPersianDigits } from '../engine/scoring';
import type { Direction, FlowTileStep, HintSuggestion, TileState } from '../engine/types';

interface PipeTileSvgProps {
  tile: TileState;
  flowStep: FlowTileStep | undefined;
  isWaterVisible: boolean;
  isFlowFront: boolean;
  rotationFlashSeq: number;
  isDisconnectedHighlight: boolean;
  showLeakHints: boolean;
  hint: HintSuggestion | null;
  animationsEnabled: boolean;
}

const LEAK_COORDS: Record<Direction, { cx: number; cy: number; dx: number; dy: number }> = {
  N: { cx: 50, cy: 11, dx: 0, dy: -4.5 },
  E: { cx: 89, cy: 50, dx: 4.5, dy: 0 },
  S: { cx: 50, cy: 89, dx: 0, dy: 4.5 },
  W: { cx: 11, cy: 50, dx: -4.5, dy: 0 },
};

/**
 * Renders carved Persian sandstone/terracotta pipe casing and brass joint collars
 * in base 0-degree orientation. Water itself is rendered separately in world-space
 * so directional flow strictly matches the BFS simulator without rotating dash axes.
 */
function PipeCasingGeometry({
  type,
  hasWater,
  animationsEnabled,
}: {
  type: TileState['type'];
  hasWater: boolean;
  animationsEnabled: boolean;
}) {
  if (type === 'straight') {
    return (
      <>
        {/* Deep drop-relief casing border */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="#5E4025" strokeWidth="36" strokeLinecap="butt" />
        {/* Warm carved terracotta sandstone pipe walls */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="#A67A4B" strokeWidth="31" strokeLinecap="butt" />
        {/* Inner bevel rim */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="#7A5634" strokeWidth="24" strokeLinecap="butt" />
        {/* Deep recessed water channel */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1E1712" strokeWidth="19" strokeLinecap="butt" />
        {/* Brass port joint collars with specular gold edge */}
        <rect x="32" y="1.5" width="36" height="6.5" rx="2" fill="#B8832A" />
        <rect x="35" y="2.5" width="30" height="2" rx="1" fill="#F2CA70" fillOpacity="0.65" />
        <rect x="32" y="92" width="36" height="6.5" rx="2" fill="#B8832A" />
        <rect x="35" y="93" width="30" height="2" rx="1" fill="#F2CA70" fillOpacity="0.65" />
        {/* Glazed Persian turquoise decorative center band */}
        <rect
          x="36"
          y="44"
          width="28"
          height="12"
          rx="2.5"
          fill={hasWater ? '#125F6C' : '#183C47'}
          stroke={hasWater ? '#6CECF5' : '#D99B26'}
          strokeWidth="1.2"
        />
        <polygon
          points="50,46.5 53.5,50 50,53.5 46.5,50"
          fill={hasWater ? '#8CF7FF' : '#E6BA5E'}
        />
      </>
    );
  }

  if (type === 'corner') {
    // Base 0 deg connects N (50,0) -> E (100,50)
    const d = 'M 50 0 L 50 40 Q 50 50 60 50 L 100 50';
    return (
      <>
        <path d={d} fill="none" stroke="#5E4025" strokeWidth="36" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#A67A4B" strokeWidth="31" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#7A5634" strokeWidth="24" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#1E1712" strokeWidth="19" strokeLinejoin="round" />
        {/* Brass joint collars */}
        <rect x="32" y="1.5" width="36" height="6.5" rx="2" fill="#B8832A" />
        <rect x="35" y="2.5" width="30" height="2" rx="1" fill="#F2CA70" fillOpacity="0.65" />
        <rect x="92" y="32" width="6.5" height="36" rx="2" fill="#B8832A" />
        <rect x="93" y="35" width="2" height="30" rx="1" fill="#F2CA70" fillOpacity="0.65" />
        {/* Outer corner ceramic boss */}
        <circle
          cx="48"
          cy="52"
          r="6.2"
          fill={hasWater ? '#125F6C' : '#183C47'}
          stroke={hasWater ? '#6CECF5' : '#D99B26'}
          strokeWidth="1.2"
        />
      </>
    );
  }

  if (type === 'tee') {
    // Base 0 deg connects N (50,0), E (100,50), W (0,50)
    return (
      <>
        <line x1="0" y1="50" x2="100" y2="50" stroke="#5E4025" strokeWidth="36" />
        <line x1="50" y1="0" x2="50" y2="56" stroke="#5E4025" strokeWidth="36" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#A67A4B" strokeWidth="31" />
        <line x1="50" y1="0" x2="50" y2="55" stroke="#A67A4B" strokeWidth="31" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#7A5634" strokeWidth="24" />
        <line x1="50" y1="0" x2="50" y2="53" stroke="#7A5634" strokeWidth="24" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#1E1712" strokeWidth="19" />
        <line x1="50" y1="0" x2="50" y2="52" stroke="#1E1712" strokeWidth="19" />
        {/* Brass port collars */}
        <rect x="32" y="1.5" width="36" height="6.5" rx="2" fill="#B8832A" />
        <rect x="35" y="2.5" width="30" height="2" rx="1" fill="#F2CA70" fillOpacity="0.65" />
        <rect x="92" y="32" width="6.5" height="36" rx="2" fill="#B8832A" />
        <rect x="93" y="35" width="2" height="30" rx="1" fill="#F2CA70" fillOpacity="0.65" />
        <rect x="1.5" y="32" width="6.5" height="36" rx="2" fill="#B8832A" />
        <rect x="2.5" y="35" width="2" height="30" rx="1" fill="#F2CA70" fillOpacity="0.65" />
        {/* Junction medallion frame */}
        <circle
          cx="50"
          cy="50"
          r="11.5"
          fill={hasWater ? '#105B68' : '#183C47'}
          stroke={hasWater ? '#6CECF5' : '#D99B26'}
          strokeWidth="1.5"
        />
      </>
    );
  }

  if (type === 'cross') {
    return (
      <>
        <line x1="0" y1="50" x2="100" y2="50" stroke="#5E4025" strokeWidth="36" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#5E4025" strokeWidth="36" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#A67A4B" strokeWidth="31" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#A67A4B" strokeWidth="31" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#7A5634" strokeWidth="24" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#7A5634" strokeWidth="24" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#1E1712" strokeWidth="19" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1E1712" strokeWidth="19" />
        <rect x="32" y="1.5" width="36" height="6.5" rx="2" fill="#B8832A" />
        <rect x="32" y="92" width="36" height="6.5" rx="2" fill="#B8832A" />
        <rect x="92" y="32" width="6.5" height="36" rx="2" fill="#B8832A" />
        <rect x="1.5" y="32" width="6.5" height="36" rx="2" fill="#B8832A" />
        {/* Octagonal Persian crossroads medallion */}
        <polygon
          points="50,35 61,39 65,50 61,61 50,65 39,61 35,50 39,39"
          fill={hasWater ? '#105B68' : '#183C47'}
          stroke={hasWater ? '#6CECF5' : '#D99B26'}
          strokeWidth="1.6"
        />
      </>
    );
  }

  if (type === 'source') {
    // Base 0 deg outputs East (100, 50)
    return (
      <>
        <line x1="50" y1="50" x2="100" y2="50" stroke="#5E4025" strokeWidth="36" />
        <line x1="50" y1="50" x2="100" y2="50" stroke="#A67A4B" strokeWidth="31" />
        <line x1="50" y1="50" x2="100" y2="50" stroke="#1E1712" strokeWidth="19" />
        <rect x="92" y="32" width="6.5" height="36" rx="2" fill="#E3B14B" />
        {/* Subtle source exit arrow */}
        <polygon points="84,50 75,44 75,56" fill={hasWater ? '#E8FEFF' : '#F4D078'} />
        {/* Persian Mother-Well Spring (سرچشمه) — rendered on top of water exit in overlay */}
        {hasWater && animationsEnabled && (
          <circle
            cx="50"
            cy="50"
            r="26"
            fill="none"
            stroke="#5BE8F5"
            strokeWidth="2"
            className="animate-water-ripple"
          />
        )}
      </>
    );
  }

  if (type === 'destination') {
    // Base 0 deg receives from West (0, 50)
    return (
      <>
        <line x1="0" y1="50" x2="50" y2="50" stroke="#5E4025" strokeWidth="36" />
        <line x1="0" y1="50" x2="50" y2="50" stroke="#A67A4B" strokeWidth="31" />
        <line x1="0" y1="50" x2="50" y2="50" stroke="#1E1712" strokeWidth="19" />
        <rect x="1.5" y="32" width="6.5" height="36" rx="2" fill="#E3B14B" />
        <polygon points="22,50 13,44 13,56" fill={hasWater ? '#D4FDFF' : '#E6BA5E'} />
      </>
    );
  }

  return null;
}

/**
 * Top architectural emblems for Source (mother-well) and Destination (oasis pool)
 * rendered above the directional water stream so water cleanly emerges from or enters them.
 */
function EndpointEmblemOverlay({
  type,
  hasWater,
  animationsEnabled,
}: {
  type: TileState['type'];
  hasWater: boolean;
  animationsEnabled: boolean;
}) {
  if (type === 'source') {
    return (
      <g>
        <polygon
          points="50,14 75,25 86,50 75,75 50,86 25,75 14,50 25,25"
          fill="#103240"
          stroke="#E8BD62"
          strokeWidth="3"
        />
        <polygon
          points="50,20 71,29 80,50 71,71 50,80 29,71 20,50 29,29"
          fill="none"
          stroke="#26B9CA"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
        <circle cx="50" cy="50" r="21" fill="#0D7E8E" stroke="#85F5FF" strokeWidth="2" />
        <circle cx="50" cy="50" r="12.5" fill="#2AD9E8" />
        <circle cx="46" cy="45" r="4" fill="#C9FCFF" fillOpacity="0.7" />
        {/* Output direction pointer (rotates with tile) */}
        <polygon points="79,50 68,43.5 68,56.5" fill="#FBF4E4" />
      </g>
    );
  }

  if (type === 'destination') {
    return (
      <g>
        {hasWater && animationsEnabled && (
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="#69F0FB"
            strokeWidth="2.2"
            className="animate-water-ripple"
          />
        )}
        {/* Persian Ab-Anbar / Garden Oasis Basin (مظهر قنات) */}
        <rect
          x="21"
          y="21"
          width="58"
          height="58"
          rx="13"
          fill={hasWater ? '#0E5D6B' : '#292019'}
          stroke={hasWater ? '#78F4FF' : '#D39F44'}
          strokeWidth="3"
        />
        <rect
          x="29"
          y="29"
          width="42"
          height="42"
          rx="8"
          fill={hasWater ? '#16B8C9' : '#1B1510'}
          stroke={hasWater ? '#D0FDFF' : '#8A6238'}
          strokeWidth="1.6"
          className={hasWater && animationsEnabled ? 'animate-oasis-bloom' : ''}
        />
        {/* Oasis lotus / garden emblem */}
        <g className={hasWater && animationsEnabled ? 'animate-oasis-bloom' : ''}>
          <path
            d="M50 34 C55.5 42.5 55.5 57.5 50 66 C44.5 57.5 44.5 42.5 50 34 Z"
            fill={hasWater ? '#8AFAD0' : '#7D6346'}
          />
          <path
            d="M34 50 C42.5 44.5 57.5 44.5 66 50 C57.5 55.5 42.5 55.5 34 50 Z"
            fill={hasWater ? '#4CE3A8' : '#6A533A'}
          />
          <circle cx="50" cy="50" r="4.8" fill={hasWater ? '#FBF4E4' : '#D39F44'} />
        </g>
      </g>
    );
  }

  return null;
}

export function PipeTileSvg({
  tile,
  flowStep,
  isWaterVisible,
  isFlowFront,
  rotationFlashSeq,
  isDisconnectedHighlight,
  showLeakHints,
  hint,
  animationsEnabled,
}: PipeTileSvgProps) {
  const leaks = isWaterVisible && flowStep ? flowStep.leakDirections : [];
  const waterSegments =
    isWaterVisible && flowStep
      ? buildDirectionalWaterSegments(tile.type, flowStep)
      : [];

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full block select-none overflow-visible"
      aria-hidden="true"
    >
      {/* Tile Base Surface */}
      {tile.type === 'blocked' ? (
        <g>
          <rect
            x="2.5"
            y="2.5"
            width="95"
            height="95"
            rx="11"
            fill="#231D19"
            stroke="#4C3C2F"
            strokeWidth="2"
          />
          {/* Carved desert basalt rock facets */}
          <polygon points="16,75 29,26 55,16 82,33 85,75 62,85 26,83" fill="#3B2F27" />
          <polygon points="29,26 55,16 61,48 33,54" fill="#564538" />
          <polygon points="55,16 82,33 61,48" fill="#47382D" />
          <polygon points="16,75 33,54 61,48 62,85 26,83" fill="#2D241E" />
          {/* Engraved fracture & non-color lock mark */}
          <path d="M35 53 L54 46 L69 63" fill="none" stroke="#19130F" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M44 33 L52 38" fill="none" stroke="#6E5A49" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ) : tile.type === 'empty' ? (
        <g>
          <rect
            x="3.5"
            y="3.5"
            width="93"
            height="93"
            rx="10"
            fill="#191410"
            stroke="#2B221A"
            strokeWidth="1.5"
          />
          {/* Quiet engraved Persian sand-tile diamond motif */}
          <polygon
            points="50,34 66,50 50,66 34,50"
            fill="none"
            stroke="#34281E"
            strokeWidth="1.4"
          />
          <circle cx="50" cy="50" r="2.2" fill="#3C2F23" />
        </g>
      ) : (
        <g>
          {/* Sandstone / Glazed Lapis Tile Bed */}
          <rect
            x="2.5"
            y="2.5"
            width="95"
            height="95"
            rx="11"
            fill={isWaterVisible ? '#162831' : '#292018'}
            stroke={
              isWaterVisible
                ? isFlowFront
                  ? '#69F0FB'
                  : '#1DAFC1'
                : isDisconnectedHighlight
                  ? '#E59524'
                  : '#5A4430'
            }
            strokeWidth={isWaterVisible || isDisconnectedHighlight ? '2.4' : '1.6'}
            strokeDasharray={isDisconnectedHighlight ? '6 4' : undefined}
          />
          {/* Subtle inner beveled Persian ceramic corner highlights */}
          <rect
            x="6.5"
            y="6.5"
            width="87"
            height="87"
            rx="8"
            fill="none"
            stroke={isWaterVisible ? '#5BE8F5' : '#D99B26'}
            strokeOpacity={isWaterVisible ? '0.18' : '0.1'}
            strokeWidth="1"
          />

          {/* Smoothly Rotating Pipe Casing Layer */}
          <g
            style={{
              transform: `rotate(${tile.visualRotation}deg)`,
              transformOrigin: '50px 50px',
              transition: animationsEnabled
                ? 'transform 190ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'none',
            }}
          >
            <PipeCasingGeometry
              type={tile.type}
              hasWater={isWaterVisible}
              animationsEnabled={animationsEnabled}
            />
          </g>

          {/* World-Space Directional Water Flow Layer (travels along exact BFS direction) */}
          {isWaterVisible && waterSegments.length > 0 && (
            <g>
              {waterSegments.map((seg) => {
                const drawClass = !animationsEnabled
                  ? ''
                  : seg.phase === 'exit' && tile.type !== 'source'
                    ? 'animate-water-draw-delayed'
                    : 'animate-water-draw';
                const styleVars = { '--water-len': seg.length } as CSSProperties;

                return (
                  <g key={seg.id}>
                    {/* Deep Persian turquoise stream body */}
                    <path
                      d={seg.d}
                      fill="none"
                      stroke="#14B8C9"
                      strokeWidth="14"
                      strokeLinecap="butt"
                      strokeLinejoin="round"
                      style={styleVars}
                      className={drawClass}
                    />
                    {/* Luminous inner current core */}
                    <path
                      d={seg.d}
                      fill="none"
                      stroke="#5CE8F5"
                      strokeWidth="7.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity="0.65"
                      style={styleVars}
                      className={drawClass}
                    />
                    {/* Animated flowing foam shimmer */}
                    <path
                      d={seg.d}
                      fill="none"
                      stroke="#C6FCFF"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={animationsEnabled ? 'animate-water-shimmer' : ''}
                    />
                  </g>
                );
              })}
              {/* Center water pool bead on junctions so branching joints look seamless */}
              {(tile.type === 'tee' || tile.type === 'cross') && (
                <circle cx="50" cy="50" r="8" fill="#2AD9E8" />
              )}
            </g>
          )}

          {/* Source & Destination Architectural Medallions on top of water port */}
          {(tile.type === 'source' || tile.type === 'destination') && (
            <g
              style={{
                transform: `rotate(${tile.visualRotation}deg)`,
                transformOrigin: '50px 50px',
              }}
            >
              <EndpointEmblemOverlay
                type={tile.type}
                hasWater={isWaterVisible}
                animationsEnabled={animationsEnabled}
              />
            </g>
          )}

          {/* Tactile Rotation Selection Feedback Flash */}
          {rotationFlashSeq > 0 && animationsEnabled && (
            <rect
              key={`flash-${rotationFlashSeq}`}
              x="4"
              y="4"
              width="92"
              height="92"
              rx="10"
              fill="none"
              stroke="#F2C96B"
              strokeWidth="2.8"
              className="animate-tile-select"
            />
          )}

          {/* Non-color disconnected corner cue (for color-blind clarity) */}
          {isDisconnectedHighlight && !isWaterVisible && (
            <g>
              <circle cx="17" cy="17" r="7.5" fill="#92400E" stroke="#FCD34D" strokeWidth="1.4" />
              <path
                d="M14 14 L20 20 M20 14 L14 20"
                stroke="#FEF3C7"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>
      )}

      {/* World-Aligned Water Leak Indicators (shape + exclamation + droplet, not color alone) */}
      {showLeakHints &&
        leaks.map((dir) => {
          const pt = LEAK_COORDS[dir];
          return (
            <g
              key={dir}
              className={animationsEnabled ? 'animate-leak-pulse' : ''}
            >
              <circle cx={pt.cx} cy={pt.cy} r="11" fill="#EF4444" fillOpacity="0.26" />
              <circle
                cx={pt.cx}
                cy={pt.cy}
                r="7"
                fill="#DC2626"
                stroke="#FEF2F2"
                strokeWidth="1.6"
              />
              <line
                x1={pt.cx}
                y1={pt.cy - 3}
                x2={pt.cx}
                y2={pt.cy + 0.8}
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx={pt.cx} cy={pt.cy + 3.4} r="1" fill="#FFFFFF" />
              <circle
                cx={pt.cx + pt.dx * 1.9}
                cy={pt.cy + pt.dy * 1.9}
                r="2.4"
                fill="#85F5FF"
              />
            </g>
          );
        })}

      {/* Active Hint Overlay */}
      {hint && (
        <g className={animationsEnabled ? 'animate-hint-glow' : ''}>
          <rect
            x="4.5"
            y="4.5"
            width="91"
            height="91"
            rx="10"
            fill="#F59E0B"
            fillOpacity="0.16"
            stroke="#FCD34D"
            strokeWidth="3.5"
          />
          <circle cx="80" cy="20" r="13.5" fill="#B45309" stroke="#FEF3C7" strokeWidth="2" />
          <text
            x="80"
            y="25"
            textAnchor="middle"
            fill="#FFFBEB"
            fontSize="14"
            fontWeight="700"
          >
            {toPersianDigits(hint.rotationsNeeded)}
          </text>
        </g>
      )}
    </svg>
  );
}
