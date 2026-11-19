import { isRotatableTile, tileKey } from '../engine/connections';
import { toPersianDigits } from '../engine/scoring';
import type { HintSuggestion, SimulationResult, TileState, TileType } from '../engine/types';
import { PipeTileSvg } from './PipeTileSvg';

interface GameBoardProps {
  grid: TileState[][];
  rows: number;
  cols: number;
  simulation: SimulationResult | null;
  visibleStep: number;
  lastRotatedKey?: string | null;
  lastRotatedSeq?: number;
  accentHex?: string;
  showDisconnected: boolean;
  showLeakHints: boolean;
  activeHint: HintSuggestion | null;
  animationsEnabled: boolean;
  disabled: boolean;
  onRotateTile: (row: number, col: number) => void;
}

const TILE_LABEL_FA: Record<TileType, string> = {
  straight: 'لوله مستقیم',
  corner: 'لوله زانویی',
  tee: 'لوله سه‌راهی',
  cross: 'لوله چهارراهی',
  source: 'سرچشمه آب',
  destination: 'مظهر قنات (مقصد)',
  blocked: 'سنگ مانع',
  empty: 'زمین خالی',
};

export function GameBoard({
  grid,
  rows,
  cols,
  simulation,
  visibleStep,
  lastRotatedKey = null,
  lastRotatedSeq = 0,
  accentHex = '#D99B26',
  showDisconnected,
  showLeakHints,
  activeHint,
  animationsEnabled,
  disabled,
  onRotateTile,
}: GameBoardProps) {
  const disconnectedSet = new Set<string>(
    showDisconnected && simulation
      ? simulation.disconnectedPipeTiles.map((pos) => tileKey(pos.row, pos.col))
      : [],
  );

  const isLargeGrid = cols >= 6 || rows >= 6;
  const isExtraLargeGrid = cols >= 7 || rows >= 7;
  const isVictoryActive = Boolean(
    simulation?.isValidSolution && visibleStep >= simulation.maxStep,
  );

  return (
    <div
      data-testid="game-board"
      dir="ltr"
      className={`relative mx-auto rounded-2xl bg-gradient-to-b from-[#1D1610] to-[#130F0B] border-2 shadow-[0_22px_54px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(242,201,107,0.18)] transition-colors duration-300 ${
        isExtraLargeGrid
          ? 'p-1.5 sm:p-2.5'
          : isLargeGrid
            ? 'p-2 sm:p-3'
            : 'p-2.5 sm:p-3.5'
      }`}
      style={{
        width: `min(${isExtraLargeGrid ? '96vw' : '94vw'}, calc((100dvh - 235px) * ${cols} / ${rows}), ${
          isExtraLargeGrid ? '516px' : '488px'
        })`,
        aspectRatio: `${cols} / ${rows}`,
        borderColor: isVictoryActive ? '#26C6D8' : `${accentHex}88`,
      }}
    >
      {/* Decorative Persian corner brass rivets (subtle architectural craftsmanship) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1.5 left-1.5 w-2 h-2 rotate-45 rounded-[1px] bg-[#E6BA5E]/70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1.5 right-1.5 w-2 h-2 rotate-45 rounded-[1px] bg-[#E6BA5E]/70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1.5 left-1.5 w-2 h-2 rotate-45 rounded-[1px] bg-[#E6BA5E]/70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1.5 right-1.5 w-2 h-2 rotate-45 rounded-[1px] bg-[#E6BA5E]/70"
      />

      {/* Recessed inner stone board tray */}
      <div
        className={`w-full h-full grid rounded-xl bg-[#110D0A]/85 p-1 ${
          isExtraLargeGrid
            ? 'gap-0.5'
            : isLargeGrid
              ? 'gap-0.5 sm:gap-1'
              : 'gap-1 sm:gap-1.5'
        }`}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((rowTiles, r) =>
          rowTiles.map((tile, c) => {
            const key = tileKey(r, c);
            const flowStep = simulation?.flowMap[key];
            const isWaterVisible = Boolean(flowStep && flowStep.step <= visibleStep);
            const isFlowFront = Boolean(flowStep && flowStep.step === visibleStep);
            const rotatable = isRotatableTile(tile.type, tile.locked);
            const isDisconnectedHighlight = disconnectedSet.has(key);
            const isRecentlyRotated = lastRotatedKey === key && lastRotatedSeq > 0;
            const tileHint =
              activeHint && activeHint.row === r && activeHint.col === c ? activeHint : null;

            const stateHintFa = isWaterVisible
              ? '، دارای جریان آب'
              : isDisconnectedHighlight
                ? '، قطع از مسیر'
                : '';

            const ariaLabel = `${TILE_LABEL_FA[tile.type]}، ردیف ${toPersianDigits(
              r + 1,
            )} ستون ${toPersianDigits(c + 1)}${rotatable ? '، برای چرخش لمس کنید' : '، ثابت'}${stateHintFa}`;

            if (!rotatable) {
              return (
                <div
                  key={key}
                  data-testid={`tile-${r}-${c}`}
                  data-tile-type={tile.type}
                  data-water={isWaterVisible ? 'true' : 'false'}
                  aria-label={ariaLabel}
                  className="relative w-full h-full rounded-lg overflow-hidden"
                >
                  <PipeTileSvg
                    tile={tile}
                    flowStep={flowStep}
                    isWaterVisible={isWaterVisible}
                    isFlowFront={isFlowFront}
                    rotationFlashSeq={0}
                    isDisconnectedHighlight={false}
                    showLeakHints={showLeakHints}
                    hint={null}
                    animationsEnabled={animationsEnabled}
                  />
                </div>
              );
            }

            return (
              <button
                key={key}
                type="button"
                data-testid={`tile-${r}-${c}`}
                data-tile-type={tile.type}
                data-rotation={tile.rotation}
                data-water={isWaterVisible ? 'true' : 'false'}
                disabled={disabled}
                onClick={() => onRotateTile(r, c)}
                aria-label={ariaLabel}
                className={`group relative w-full h-full ${
                  isExtraLargeGrid
                    ? 'min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px]'
                    : 'min-h-[44px] min-w-[44px]'
                } rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#14100C] active:scale-[0.95] transition-transform duration-150 disabled:cursor-default disabled:active:scale-100`}
              >
                <PipeTileSvg
                  tile={tile}
                  flowStep={flowStep}
                  isWaterVisible={isWaterVisible}
                  isFlowFront={isFlowFront}
                  rotationFlashSeq={isRecentlyRotated ? lastRotatedSeq : 0}
                  isDisconnectedHighlight={isDisconnectedHighlight}
                  showLeakHints={showLeakHints}
                  hint={tileHint}
                  animationsEnabled={animationsEnabled}
                />
                {/* Crisp hover/focus highlight on rotatable tiles */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-lg border border-transparent group-hover:border-[#F2C96B]/65 group-focus-visible:border-[#F2C96B]/85 transition-colors duration-150"
                />
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
