import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Route 4: Zanjan — Highlands & Valleys of Northwestern Iran (Levels 25–32)
 * Destinations:
 * - Zanjan (زنجان): Levels 25–26
 * - Ijrud (ایجرود): Levels 27–28
 * - Soltaniyeh (سلطانیه): Levels 29–30
 * - Mahneshan (ماهنشان): Levels 31–32
 *
 * Puzzle settings are landscape-inspired gameplay chapters; no unverified historical
 * qanat monuments are claimed.
 */
export const ZANJAN_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 25: 5x5 Hard — Zanjan Plain (Dual-loop bridge)
  {
    id: 25,
    regionId: 'zanjan',
    destinationId: 'zanjan',
    titleFa: 'دشت زنجان',
    subtitleFa: 'دو حلقه متقارن پیرامون پل میانی در دشت کوهپایه‌ای',
    difficulty: 'hard',
    rows: 5,
    cols: 5,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 4, col: 4 },
    ],
    // Moves: (0,1):2 (0,2):1 (0,3):2 | (1,1):1 (1,3):1 | (2,2):1 (2,3):2 | (3,1):1 (3,3):1 | (4,1):2 (4,2):1 (4,3):2 => 17
    expectedMinMoves: 17,
    parTimeSec: 120,
    grid: [
      [blk(), cor(270, 90), str(0, 90), tee(0, 180), dst(0)],
      [emp(), str(90, 0), blk(), str(90, 0), blk()],
      [src(0), crs(0), str(0, 90), tee(90, 270), emp()],
      [blk(), str(90, 0), emp(), str(90, 0), blk()],
      [emp(), cor(180, 0), str(0, 90), tee(180, 0), dst(0)],
    ],
  },

  // LEVEL 26: 5x5 Hard — Foothill Passage (Zanjan, 3 destinations)
  {
    id: 26,
    regionId: 'zanjan',
    destinationId: 'zanjan',
    titleFa: 'گذرگاه کوهپایه',
    subtitleFa: 'انشعاب سه‌گانه در بستر سنگی دامنه زنجان',
    difficulty: 'hard',
    rows: 5,
    cols: 5,
    source: { row: 4, col: 0 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 4 },
      { row: 4, col: 4 },
    ],
    // Moves: (0,2):2 (0,3):1 | (1,0):1 (1,1):2 (1,2):2 | (2,0):2 (2,1):2 (2,2):1 (2,3):2 | (3,0):1 (3,3):2 (3,4):2 => 20
    expectedMinMoves: 20,
    parTimeSec: 130,
    grid: [
      [dst(270), blk(), cor(270, 90), str(0, 90), dst(0)],
      [str(90, 0), cor(270, 90), tee(90, 270), blk(), emp()],
      [tee(270, 90), tee(180, 0), tee(270, 0), cor(0, 180), blk()],
      [str(90, 0), blk(), emp(), cor(180, 0), cor(0, 180)],
      [src(270), emp(), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 27: 5x5 Hard — Ijrud Valley (Twin highland loops)
  {
    id: 27,
    regionId: 'zanjan',
    destinationId: 'ijrud',
    titleFa: 'دره ایجرود',
    subtitleFa: 'دو شاخه هم‌زمان در پیچ‌وخم دره سبز ایجرود',
    difficulty: 'hard',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 2 },
    destination: { row: 4, col: 1 },
    destinations: [
      { row: 4, col: 1 },
      { row: 4, col: 3 },
    ],
    // Moves: (1,0):2 (1,1):2 (1,2):2 (1,3):1 (1,4):2 | (2,0):1 (2,2):1 (2,4):2 | (3,1):1 (3,3):1 => 15
    expectedMinMoves: 15,
    parTimeSec: 125,
    grid: [
      [blk(), emp(), src(90), emp(), blk()],
      [cor(270, 90), tee(0, 180), tee(180, 0), tee(90, 180), cor(0, 180)],
      [cor(270, 0), crs(0), str(0, 90), crs(0), cor(90, 270)],
      [emp(), str(90, 0), blk(), str(90, 0), emp()],
      [blk(), dst(90), blk(), dst(90), blk()],
    ],
  },

  // LEVEL 28: 6x6 Hard — Ijrud Mountain Gorge (3 destinations)
  {
    id: 28,
    regionId: 'zanjan',
    destinationId: 'ijrud',
    titleFa: 'تنگه کوهستانی ایجرود',
    subtitleFa: 'عبور جریان از تنگه صخره‌ای به سه دشت پیرامون',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 3, col: 5 },
      { row: 5, col: 0 },
    ],
    // Moves: (0,1):2 (0,3):2 (0,4):1 | (1,1):2 (1,2):1 (1,3):2 | (2,0):2 (2,1):1 (2,2):2 (2,3):1 (2,4):2
    //        (3,0):1 (3,2):2 (3,3):1 (3,4):2 | (4,0):2 (4,1):1 (4,2):2 => 29
    expectedMinMoves: 29,
    parTimeSec: 155,
    grid: [
      [src(0), cor(0, 180), blk(), cor(270, 90), str(0, 90), dst(0)],
      [blk(), cor(180, 0), str(0, 90), tee(90, 270), blk(), emp()],
      [cor(270, 90), str(0, 90), cor(0, 180), cor(270, 0), cor(0, 180), blk()],
      [str(90, 0), blk(), tee(270, 90), str(0, 90), tee(180, 0), dst(0)],
      [tee(270, 90), str(0, 90), cor(90, 270), blk(), emp(), emp()],
      [dst(90), blk(), emp(), emp(), blk(), emp()],
    ],
  },

  // LEVEL 29: 6x6 Hard — Soltaniyeh Plain (Grand central ring)
  {
    id: 29,
    regionId: 'zanjan',
    destinationId: 'soltaniyeh',
    titleFa: 'دشت سلطانیه',
    subtitleFa: 'حلقه گسترده آب‌رسانی در پهنه‌ی دشت سلطانیه',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 2 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,1):2 (0,4):2 | (1,1):2 (1,2):1 (1,3):1 (1,4):2 | (2,1):1 (2,4):1
    //        (3,1):2 (3,2):2 (3,3):1 (3,4):2 | (4,2):1 (4,4):2 (4,5):2 => 24
    expectedMinMoves: 24,
    parTimeSec: 150,
    grid: [
      [dst(180), cor(0, 180), blk(), blk(), cor(270, 90), dst(0)],
      [emp(), tee(270, 90), str(0, 90), str(0, 90), tee(90, 270), emp()],
      [blk(), str(90, 0), blk(), blk(), str(90, 0), blk()],
      [emp(), cor(180, 0), tee(0, 180), str(0, 90), tee(90, 270), emp()],
      [blk(), emp(), str(90, 0), blk(), cor(180, 0), cor(0, 180)],
      [emp(), emp(), src(270), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 30: 6x6 Expert — Turquoise Dome Basin (Soltaniyeh)
  {
    id: 30,
    regionId: 'zanjan',
    destinationId: 'soltaniyeh',
    titleFa: 'حوضچه گنبد فیروزه',
    subtitleFa: 'توازن دو تقاطع چهارراهی و سه مدار هم‌مرکز',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 3, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 2, col: 5 },
      { row: 5, col: 2 },
    ],
    // Moves: (1,1):2 (1,3):1 (1,4):2 | (2,1):1 (2,2):2 (2,3):2 (2,4):2 | (3,2):2 (3,3):1 (3,4):2 | (4,1):2 (4,2):2 => 21
    expectedMinMoves: 21,
    parTimeSec: 155,
    grid: [
      [blk(), emp(), dst(270), emp(), blk(), emp()],
      [emp(), cor(270, 90), crs(0), str(0, 90), cor(0, 180), blk()],
      [blk(), str(90, 0), tee(270, 90), cor(0, 180), tee(270, 90), dst(0)],
      [src(0), crs(0), tee(180, 0), tee(270, 0), cor(90, 270), blk()],
      [blk(), cor(180, 0), cor(0, 180), blk(), emp(), emp()],
      [emp(), blk(), dst(90), emp(), emp(), blk()],
    ],
  },

  // LEVEL 31: 6x6 Expert — Mahneshan Colored Hills
  {
    id: 31,
    regionId: 'zanjan',
    destinationId: 'mahneshan',
    titleFa: 'تپه‌های رنگین ماهنشان',
    subtitleFa: 'مسیرهای پرپیچ در میان لایه‌های رسوبی ماهنشان',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 5 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 5, col: 0 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,1):2 (0,3):2 (0,4):1 | (1,1):2 (1,2):1 (1,3):2 | (2,0):2 (2,1):1 (2,2):2 (2,3):2 (2,4):2
    //        (3,0):1 (3,2):2 (3,4):2 | (4,0):2 (4,1):1 (4,2):1 (4,3):2 (4,4):1 (4,5):2 => 33
    expectedMinMoves: 33,
    parTimeSec: 175,
    grid: [
      [dst(180), cor(0, 180), blk(), cor(270, 90), str(0, 90), src(180)],
      [blk(), cor(180, 0), str(0, 90), tee(90, 270), blk(), emp()],
      [cor(270, 90), str(0, 90), cor(0, 180), tee(270, 90), cor(0, 180), blk()],
      [str(90, 0), blk(), cor(180, 0), crs(0), cor(90, 270), emp()],
      [tee(270, 90), str(0, 90), str(0, 90), tee(180, 0), str(0, 90), cor(0, 180)],
      [dst(90), blk(), emp(), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 32: 6x6 Expert — Qizil Ozan Gorge (Zanjan Route Finale)
  {
    id: 32,
    regionId: 'zanjan',
    destinationId: 'mahneshan',
    titleFa: 'دره قزل‌اوزن',
    subtitleFa: 'آزمون پایانی مسیر زنجان با سه مدار فشار و سه مقصد',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 0 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 3, col: 5 },
    ],
    // Moves: (0,2):2 (0,3):1 (0,4):1 | (1,0):1 (1,1):2 (1,2):2 (1,4):2 (1,5):2
    //        (2,0):2 (2,2):2 (2,3):2 (2,4):1 (2,5):2 | (3,0):2 (3,1):2 (3,3):2 (3,4):1
    //        (4,1):1 | (5,1):2 => 32
    expectedMinMoves: 32,
    parTimeSec: 180,
    grid: [
      [dst(270), blk(), cor(270, 90), str(0, 90), str(0, 90), dst(0)],
      [str(90, 0), cor(270, 90), tee(90, 270), blk(), cor(270, 90), cor(0, 180)],
      [tee(270, 90), crs(0), tee(180, 0), tee(0, 180), tee(270, 0), cor(90, 270)],
      [cor(180, 0), tee(90, 270), blk(), cor(180, 0), str(0, 90), dst(0)],
      [blk(), str(90, 0), emp(), blk(), emp(), blk()],
      [src(0), cor(90, 270), emp(), emp(), emp(), emp()],
    ],
  },
];
