import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Route 7: Fars — Southern Iranian Gardens & Mountain-Edge Route (Levels 49–56)
 * Destinations:
 * - Shiraz (شیراز): Levels 49–50
 * - Neyriz (نی‌ریز): Levels 51–52
 * - Estahban (استهبان): Levels 53–54
 * - Abadeh (آباده): Levels 55–56
 */
export const FARS_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 49: 5x6 Challenging — Shiraz Cypress Garden Rills
  {
    id: 49,
    regionId: 'fars',
    destinationId: 'shiraz',
    titleFa: 'جویبار باغ‌های شیراز',
    subtitleFa: 'هدایت آب از حوضچه جنوبی به سه گذرگاه باغ‌های سرسبز شیراز',
    difficulty: 'challenging',
    rows: 5,
    cols: 6,
    source: { row: 4, col: 0 },
    destination: { row: 0, col: 1 },
    destinations: [
      { row: 0, col: 1 },
      { row: 3, col: 5 },
      { row: 4, col: 3 },
    ],
    // Moves: (0,3):2 (0,4):1 (0,5):2 | (1,0):1 (1,2):1 (1,3):2 (1,5):1
    //        (2,0):1 (2,1):2 (2,2):1 (2,4):2 (2,5):2
    //        (3,0):2 (3,1):2 (3,3):1 (3,4):2 => 25
    expectedMinMoves: 25,
    parTimeSec: 150,
    grid: [
      [blk(), dst(270), emp(), cor(270, 90), str(0, 90), cor(0, 180)],
      [cor(0, 90), crs(0), str(0, 90), tee(90, 270), blk(), str(90, 0)],
      [str(90, 0), tee(270, 90), str(0, 90), crs(0), tee(0, 180), cor(90, 270)],
      [tee(270, 90), cor(90, 270), blk(), tee(0, 90), tee(180, 0), dst(0)],
      [src(270), blk(), emp(), dst(90), blk(), emp()],
    ],
  },

  // LEVEL 50: 6x6 Hard — Shiraz Terraced Pools
  {
    id: 50,
    regionId: 'fars',
    destinationId: 'shiraz',
    titleFa: 'حوض‌های پلکانی شیراز',
    subtitleFa: 'تنظیم دو تقاطع کلیدی برای تقسیم متعادل جریان میان سه باغچه',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 2 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 4 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,1):2 | (1,1):2 (1,3):1 (1,4):2 | (2,0):2 (2,1):2 (2,2):1 (2,4):1 (2,5):2
    //        (3,0):1 (3,1):2 (3,3):1 (3,4):2 (3,5):1
    //        (4,0):2 (4,1):1 (4,2):2 (4,3):1 (4,4):1 (4,5):2 => 31
    expectedMinMoves: 31,
    parTimeSec: 170,
    grid: [
      [dst(180), cor(0, 180), src(90), blk(), dst(270), emp()],
      [blk(), tee(270, 90), crs(0), str(0, 90), tee(90, 270), blk()],
      [cor(270, 90), tee(90, 270), str(90, 0), blk(), tee(0, 90), cor(0, 180)],
      [str(90, 0), cor(180, 0), crs(0), str(0, 90), cor(90, 270), str(90, 0)],
      [cor(180, 0), str(0, 90), tee(180, 0), str(0, 90), str(0, 90), tee(90, 270)],
      [blk(), emp(), blk(), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 51: 6x5 Hard — Neyriz Pomegranate Valley Conduits
  {
    id: 51,
    regionId: 'fars',
    destinationId: 'neyriz',
    titleFa: 'انارستان دره نی‌ریز',
    subtitleFa: 'شبکه ستونی فشرده با سه چهارراه در مسیر دره‌های پیرامون نی‌ریز',
    difficulty: 'hard',
    rows: 6,
    cols: 5,
    source: { row: 5, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 2, col: 4 },
      { row: 5, col: 2 },
    ],
    // Moves: (1,0):2 (1,1):1 (1,3):2 | (2,0):1 (2,2):2 (2,3):2
    //        (3,0):1 (3,1):1 (3,3):1 (3,4):2 | (4,0):2 (4,1):1 (4,3):1 (4,4):2 => 21
    expectedMinMoves: 21,
    parTimeSec: 155,
    grid: [
      [blk(), emp(), dst(270), blk(), emp()],
      [cor(270, 90), str(0, 90), crs(0), cor(0, 180), blk()],
      [str(90, 0), blk(), tee(270, 90), tee(180, 0), dst(0)],
      [tee(0, 90), str(0, 90), crs(0), str(0, 90), cor(0, 180)],
      [tee(270, 90), str(0, 90), crs(0), str(0, 90), cor(90, 270)],
      [src(270), blk(), dst(90), blk(), emp()],
    ],
  },

  // LEVEL 52: 6x6 Hard — Neyriz Desert-Margin Distribution Grid
  {
    id: 52,
    regionId: 'fars',
    destinationId: 'neyriz',
    titleFa: 'مقسم آب حاشیه نی‌ریز',
    subtitleFa: 'ورود جریان از شرق و پخش هم‌زمان به چهار باغ بدون نشت',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 5 },
    destination: { row: 0, col: 1 },
    destinations: [
      { row: 0, col: 1 },
      { row: 0, col: 5 },
      { row: 5, col: 1 },
      { row: 5, col: 4 },
    ],
    // Moves: (0,3):2 (0,4):1 | (1,0):2 (1,2):1 (1,3):2
    //        (2,0):1 (2,1):1 (2,3):2 (2,4):1
    //        (3,0):2 (3,2):1 (3,4):2
    //        (4,1):2 (4,2):1 (4,3):2 (4,4):2 => 25
    expectedMinMoves: 25,
    parTimeSec: 170,
    grid: [
      [blk(), dst(270), blk(), cor(270, 90), str(0, 90), dst(0)],
      [cor(270, 90), crs(0), str(0, 90), tee(90, 270), blk(), emp()],
      [str(90, 0), str(90, 0), blk(), tee(270, 90), str(0, 90), src(180)],
      [cor(180, 0), crs(0), str(0, 90), crs(0), cor(0, 180), blk()],
      [blk(), tee(270, 90), str(0, 90), tee(180, 0), tee(90, 270), emp()],
      [emp(), dst(90), blk(), emp(), dst(90), blk()],
    ],
  },

  // LEVEL 53: 6x6 Hard — Estahban Mountain-Slope Cisterns
  {
    id: 53,
    regionId: 'fars',
    destinationId: 'estahban',
    titleFa: 'دامنه کوهستان استهبان',
    subtitleFa: 'عبور از دیواره صخره‌ای مرکز و رساندن آب به سه آب‌گیر کوهستانی',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 3, col: 0 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,2):2 (0,3):1 (0,4):1 | (1,0):2 (1,1):1 (1,3):2
    //        (2,1):2 (2,2):2 (2,3):1 (2,4):1 (2,5):2
    //        (3,1):2 (3,3):1 (3,5):1
    //        (4,1):2 (4,2):1 (4,3):2 (4,4):1 (4,5):2 => 29
    expectedMinMoves: 29,
    parTimeSec: 175,
    grid: [
      [src(90), blk(), cor(270, 90), str(0, 90), str(0, 90), dst(0)],
      [cor(180, 0), str(0, 90), crs(0), cor(0, 180), blk(), emp()],
      [blk(), cor(270, 90), cor(90, 270), tee(0, 90), str(0, 90), cor(0, 180)],
      [dst(180), tee(90, 270), blk(), str(90, 0), blk(), str(90, 0)],
      [emp(), cor(180, 0), str(0, 90), tee(180, 0), str(0, 90), tee(90, 270)],
      [blk(), emp(), blk(), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 54: 6x6 Hard — Estahban Fig-Grove Branching Channels
  {
    id: 54,
    regionId: 'fars',
    destinationId: 'estahban',
    titleFa: 'انجیرستان‌های استهبان',
    subtitleFa: 'انشعاب‌های پی‌درپی برای آبیاری چهار بخش باغ‌های دامنه‌ای',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 3, col: 0 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 4 },
      { row: 5, col: 2 },
      { row: 5, col: 5 },
    ],
    // Moves: (1,0):2 (1,1):1 (1,2):2 (1,3):1 (1,4):2
    //        (2,1):2 (2,2):2 (2,3):1 (2,4):2 (2,5):2
    //        (3,2):1 (3,3):2 (3,5):1
    //        (4,1):2 (4,2):2 (4,3):1 (4,4):1 (4,5):2 => 29
    expectedMinMoves: 29,
    parTimeSec: 180,
    grid: [
      [dst(270), blk(), emp(), blk(), dst(270), emp()],
      [cor(180, 0), str(0, 90), tee(0, 180), tee(90, 180), tee(90, 270), blk()],
      [blk(), cor(270, 90), cor(90, 270), str(90, 0), cor(180, 0), cor(0, 180)],
      [src(0), crs(0), str(0, 90), cor(90, 270), blk(), str(90, 0)],
      [emp(), cor(180, 0), tee(0, 180), str(0, 90), str(0, 90), tee(90, 270)],
      [blk(), emp(), dst(90), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 55: 6x6 Hard — Abadeh Northern Fars Highland Network
  {
    id: 55,
    regionId: 'fars',
    destinationId: 'abadeh',
    titleFa: 'فلات شمالی آباده',
    subtitleFa: 'هدایت آب از جنوب مرکزی به چهار نقطه دشت مرتفع آباده',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 2 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 1, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 4 },
    ],
    // Moves: (1,0):2 (1,1):1 (1,3):1 (1,4):2 | (2,0):1 (2,2):2 (2,3):2 (2,4):1
    //        (3,0):2 (3,1):1 (3,2):2 (3,3):2 (3,4):2
    //        (4,0):1 (4,2):2 (4,3):2 (4,4):2 => 28
    expectedMinMoves: 28,
    parTimeSec: 180,
    grid: [
      [blk(), emp(), dst(270), blk(), emp(), blk()],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), tee(0, 180), dst(0)],
      [str(90, 0), blk(), cor(180, 0), cor(0, 180), str(90, 0), blk()],
      [tee(270, 90), str(0, 90), cor(0, 180), tee(270, 90), cor(90, 270), emp()],
      [str(90, 0), blk(), tee(270, 90), tee(180, 0), cor(0, 180), blk()],
      [dst(90), emp(), src(270), blk(), dst(90), emp()],
    ],
  },

  // LEVEL 56: 6x6 Expert — Abadeh Four-Gate Caravan Reservoir
  {
    id: 56,
    regionId: 'fars',
    destinationId: 'abadeh',
    titleFa: 'چهاردروازه کاروان‌سرای آباده',
    subtitleFa: 'آزمون پایانی مسیر فارس؛ رساندن آب از مرکز به چهارگوشه شهر',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 3 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,2):2 (0,3):1 (0,4):2 | (1,0):2 (1,1):1 (1,2):2 (1,4):2 (1,5):2
    //        (2,1):2 (2,2):2 (2,4):1 | (3,0):2 (3,2):1 (3,3):1 (3,5):2
    //        (4,0):2 (4,1):2 (4,4):2 (4,5):2 => 33
    expectedMinMoves: 33,
    parTimeSec: 190,
    grid: [
      [dst(270), blk(), cor(270, 90), str(0, 90), cor(0, 180), dst(270)],
      [cor(180, 0), str(0, 90), tee(90, 270), blk(), tee(270, 90), cor(90, 270)],
      [blk(), cor(270, 90), tee(180, 0), src(180), str(90, 0), blk()],
      [cor(270, 90), crs(0), str(0, 90), str(0, 90), crs(0), cor(0, 180)],
      [tee(270, 90), cor(90, 270), blk(), blk(), cor(180, 0), tee(90, 270)],
      [dst(90), emp(), blk(), emp(), blk(), dst(90)],
    ],
  },
];
