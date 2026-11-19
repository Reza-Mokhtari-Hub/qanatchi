import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Route 9: Northwestern Iran — Highland Foothills & Mountain Basins (Levels 65–72)
 * Destinations:
 * - Tabriz (تبریز): Levels 65–66
 * - Maragheh (مراغه): Levels 67–68
 * - Khoy (خوی): Levels 69–70
 * - Urmia (ارومیه): Levels 71–72
 */
export const NORTHWEST_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 65: 6x6 Hard — Tabriz Bazaar-Quarter Subterranean Conduits
  {
    id: 65,
    regionId: 'northwest',
    destinationId: 'tabriz',
    titleFa: 'دالان‌های کهن تبریز',
    subtitleFa: 'هدایت جریان از شمال‌غرب تبریز به سه محله و بازارچه زیرزمینی',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 1 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 3, col: 0 },
      { row: 5, col: 5 },
    ],
    // Moves: (1,0):2 (1,2):1 (1,3):2 (1,4):2 (1,5):2
    //        (2,0):2 (2,1):2 (2,2):2 (2,3):2 (2,4):2 (2,5):1
    //        (3,1):1 (3,3):2 (3,5):1
    //        (4,2):2 (4,3):2 (4,4):1 (4,5):2 => 31
    expectedMinMoves: 31,
    parTimeSec: 180,
    grid: [
      [blk(), src(90), blk(), emp(), dst(270), blk()],
      [cor(270, 90), crs(0), str(0, 90), cor(0, 180), tee(270, 90), cor(0, 180)],
      [cor(180, 0), tee(180, 0), cor(0, 180), tee(270, 90), cor(90, 270), str(90, 0)],
      [dst(180), str(0, 90), crs(0), tee(90, 270), blk(), str(90, 0)],
      [blk(), emp(), cor(180, 0), tee(180, 0), str(0, 90), tee(90, 270)],
      [emp(), blk(), emp(), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 66: 6x6 Expert — Tabriz Sahand-Slope Water Bridge
  {
    id: 66,
    regionId: 'northwest',
    destinationId: 'tabriz',
    titleFa: 'آبراهه دامنه سهند',
    subtitleFa: 'پخش جریان کوهستانی از غرب به چهار نقطه شهری با سه تقاطع کلیدی',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 5, col: 1 },
      { row: 5, col: 4 },
    ],
    // Moves: (0,1):1 (0,2):1 (0,3):2 | (1,1):2 (1,2):1 (1,4):1 (1,5):2
    //        (2,2):2 (2,3):1 (2,5):1 | (3,0):2 (3,1):2 (3,2):2 (3,4):1 (3,5):2
    //        (4,0):2 (4,1):2 (4,3):2 (4,4):2 => 31
    expectedMinMoves: 31,
    parTimeSec: 185,
    grid: [
      [dst(180), str(0, 90), str(0, 90), cor(0, 180), blk(), dst(270)],
      [blk(), cor(270, 90), str(0, 90), crs(0), str(0, 90), tee(90, 270)],
      [src(0), crs(0), cor(0, 180), str(90, 0), blk(), str(90, 0)],
      [cor(270, 90), tee(90, 270), cor(180, 0), crs(0), str(0, 90), cor(90, 270)],
      [cor(180, 0), tee(90, 270), blk(), cor(180, 0), cor(0, 180), blk()],
      [blk(), dst(90), emp(), blk(), dst(90), emp()],
    ],
  },

  // LEVEL 67: 6x6 Expert — Maragheh Terraced Hillside Orchards
  {
    id: 67,
    regionId: 'northwest',
    destinationId: 'maragheh',
    titleFa: 'باغ‌های پلکانی مراغه',
    subtitleFa: 'هدایت آب از جنوب به ارتفاعات باغ‌های سرسبز پیرامون مراغه',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 3 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 2, col: 5 },
      { row: 5, col: 0 },
    ],
    // Moves: (0,4):2 (0,5):2 | (1,0):2 (1,1):1 (1,3):1 (1,5):2
    //        (2,0):1 (2,2):2 (2,3):2 (2,4):2 | (3,0):2 (3,1):1 (3,2):2 (3,3):2 (3,4):2
    //        (4,0):2 (4,1):1 (4,2):1 (4,3):2 => 32
    expectedMinMoves: 32,
    parTimeSec: 185,
    grid: [
      [blk(), emp(), dst(270), blk(), cor(270, 90), cor(0, 180)],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), crs(0), cor(90, 270)],
      [str(90, 0), blk(), tee(270, 90), cor(0, 180), tee(270, 90), dst(0)],
      [tee(270, 90), str(0, 90), cor(90, 270), tee(270, 90), cor(90, 270), blk()],
      [tee(270, 90), str(0, 90), str(0, 90), tee(90, 270), blk(), emp()],
      [dst(90), blk(), emp(), src(270), emp(), blk()],
    ],
  },

  // LEVEL 68: 6x6 Expert — Maragheh Dual Cross-Junctions
  {
    id: 68,
    regionId: 'northwest',
    destinationId: 'maragheh',
    titleFa: 'دوچهارراه دره مراغه',
    subtitleFa: 'به‌کارگیری چهار تقاطع متوازن برای رساندن آب به چهار باغچه',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 3, col: 0 },
    destination: { row: 0, col: 1 },
    destinations: [
      { row: 0, col: 1 },
      { row: 0, col: 4 },
      { row: 5, col: 1 },
      { row: 5, col: 4 },
    ],
    // Moves: (1,0):2 (1,2):1 (1,3):1 (1,5):2 | (2,0):2 (2,1):2 (2,2):2 (2,3):2 (2,4):1 (2,5):1
    //        (3,2):2 (3,3):2 (3,5):2 | (4,1):2 (4,2):1 (4,3):1 (4,4):2 => 28
    expectedMinMoves: 28,
    parTimeSec: 185,
    grid: [
      [blk(), dst(270), blk(), emp(), dst(270), blk()],
      [cor(270, 90), crs(0), str(0, 90), str(0, 90), crs(0), cor(0, 180)],
      [cor(180, 0), tee(90, 270), cor(270, 90), cor(0, 180), str(90, 0), str(90, 0)],
      [src(0), crs(0), cor(90, 270), cor(180, 0), crs(0), cor(90, 270)],
      [blk(), tee(270, 90), str(0, 90), str(0, 90), tee(90, 270), blk()],
      [emp(), dst(90), blk(), emp(), dst(90), emp()],
    ],
  },

  // LEVEL 69: 6x6 Expert — Khoy Highland Plain Channels
  {
    id: 69,
    regionId: 'northwest',
    destinationId: 'khoy',
    titleFa: 'دشت مرتفع خوی',
    subtitleFa: 'هدایت جریان از سرچشمه شمالی به چهار مزرعه در دشت خوی',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 2 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 5, col: 2 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,3):2 (0,4):1 | (1,0):2 (1,1):1 (1,3):2
    //        (2,1):2 (2,2):2 (2,3):2 (2,4):1 (2,5):2
    //        (3,0):2 (3,2):2 (3,3):1 (3,5):1
    //        (4,0):2 (4,1):2 (4,2):2 (4,3):2 (4,4):1 (4,5):2 => 34
    expectedMinMoves: 34,
    parTimeSec: 190,
    grid: [
      [dst(270), blk(), src(90), cor(270, 90), str(0, 90), dst(0)],
      [cor(180, 0), str(0, 90), crs(0), tee(90, 270), blk(), emp()],
      [blk(), cor(270, 90), tee(90, 270), tee(270, 90), str(0, 90), cor(0, 180)],
      [cor(270, 90), crs(0), cor(90, 270), str(90, 0), blk(), str(90, 0)],
      [cor(180, 0), tee(180, 0), tee(0, 180), tee(180, 0), str(0, 90), tee(90, 270)],
      [blk(), emp(), dst(90), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 70: 7x7 Expert — Khoy Mountain-Pass Gateway
  {
    id: 70,
    regionId: 'northwest',
    destinationId: 'khoy',
    titleFa: 'گذرگاه کوهستانی خوی',
    subtitleFa: 'تخته ۷×۷ با چهار جهت اصلی؛ اتصال چشمه گوشه به چهار دروازه دشت',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 3 },
    destinations: [
      { row: 0, col: 3 },
      { row: 3, col: 0 },
      { row: 3, col: 6 },
      { row: 6, col: 3 },
    ],
    // Moves: (0,1):1 (0,2):2 (0,4):2 (0,5):1 (0,6):2
    //        (1,1):2 (1,4):2 (1,6):1
    //        (2,1):1 (2,2):2 (2,3):2 (2,4):2 (2,5):2 (2,6):2
    //        (3,1):2 (3,3):2 (3,4):1
    //        (4,1):2 (4,2):1 (4,3):2 (4,5):1
    //        (5,3):2 (5,4):1 (5,5):2 => 40
    expectedMinMoves: 40,
    parTimeSec: 225,
    grid: [
      [src(0), str(0, 90), cor(0, 180), dst(270), cor(270, 90), str(0, 90), cor(0, 180)],
      [blk(), cor(270, 90), crs(0), crs(0), tee(90, 270), blk(), str(90, 0)],
      [emp(), str(90, 0), cor(180, 0), cor(90, 270), cor(180, 0), tee(0, 180), cor(90, 270)],
      [dst(180), tee(90, 270), blk(), cor(270, 90), str(0, 90), crs(0), dst(0)],
      [blk(), cor(180, 0), str(0, 90), tee(90, 270), blk(), str(90, 0), blk()],
      [emp(), blk(), blk(), tee(270, 90), str(0, 90), cor(90, 270), emp()],
      [blk(), emp(), blk(), dst(90), blk(), emp(), blk()],
    ],
  },

  // LEVEL 71: 6x6 Expert — Urmia Vineyard-Belt Basin Network
  {
    id: 71,
    regionId: 'northwest',
    destinationId: 'urmia',
    titleFa: 'تاکستان‌های حوضه ارومیه',
    subtitleFa: 'هدایت جریان از سرچشمه میانی به چهار گوشه تاکستان‌های پیرامون ارومیه',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 2 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,1):1 (0,2):2 (0,3):2 (0,4):1 | (1,1):2 (1,2):2 (1,4):2
    //        (2,0):2 (2,1):2 (2,3):2 (2,4):2 (2,5):2
    //        (3,0):1 (3,1):2 (3,2):1 (3,3):2 (3,4):2 (3,5):1
    //        (4,0):2 (4,1):2 (4,4):2 (4,5):2 | (5,1):2 (5,4):2 => 43
    expectedMinMoves: 43,
    parTimeSec: 205,
    grid: [
      [dst(180), str(0, 90), cor(0, 180), cor(270, 90), str(0, 90), dst(0)],
      [blk(), cor(270, 90), tee(180, 0), crs(0), cor(0, 180), blk()],
      [cor(270, 90), tee(90, 270), src(0), tee(90, 270), tee(270, 90), cor(0, 180)],
      [str(90, 0), tee(270, 90), str(0, 90), tee(180, 0), tee(90, 270), str(90, 0)],
      [cor(180, 0), tee(90, 270), blk(), blk(), tee(270, 90), cor(90, 270)],
      [dst(180), cor(90, 270), emp(), emp(), cor(180, 0), dst(0)],
    ],
  },

  // LEVEL 72: 7x7 Expert — Urmia Lakeside Five-Garden Basin
  {
    id: 72,
    regionId: 'northwest',
    destinationId: 'urmia',
    titleFa: 'پنج‌باغ حوضه ارومیه',
    subtitleFa: 'آزمون پایانی شمال‌غرب؛ تغذیه هم‌زمان پنج مقصد در تخته متقارن ۷×۷',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 6, col: 3 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 3 },
      { row: 0, col: 6 },
      { row: 6, col: 1 },
      { row: 6, col: 5 },
    ],
    // Moves: (1,0):2 (1,1):2 (1,2):1 (1,4):1 (1,5):2 (1,6):2
    //        (2,1):1 (2,2):2 (2,3):2 (2,4):2 (2,5):1
    //        (3,0):2 (3,2):2 (3,4):2 (3,6):2
    //        (4,0):1 (4,1):1 (4,2):2 (4,3):1 (4,4):2 (4,5):1 (4,6):1
    //        (5,0):2 (5,2):2 (5,3):2 (5,4):2 (5,6):2 => 45
    expectedMinMoves: 45,
    parTimeSec: 245,
    grid: [
      [dst(270), blk(), emp(), dst(270), emp(), blk(), dst(270)],
      [cor(180, 0), tee(0, 180), str(0, 90), crs(0), str(0, 90), tee(0, 180), cor(90, 270)],
      [blk(), str(90, 0), cor(270, 90), tee(180, 0), cor(0, 180), str(90, 0), blk()],
      [cor(270, 90), crs(0), cor(90, 270), blk(), cor(180, 0), crs(0), cor(0, 180)],
      [str(90, 0), str(90, 0), cor(270, 90), str(0, 90), cor(0, 180), str(90, 0), str(90, 0)],
      [cor(180, 0), crs(0), tee(180, 0), tee(0, 180), tee(180, 0), crs(0), cor(90, 270)],
      [blk(), dst(90), emp(), src(270), emp(), dst(90), blk()],
    ],
  },
];
