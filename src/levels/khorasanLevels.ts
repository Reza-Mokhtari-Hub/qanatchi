import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Route 5: Khorasan — Cultural & Geographical Eastern Iranian Route (Levels 33–40)
 * Destinations:
 * - Gonabad (گناباد): Levels 33–34
 * - Ferdows (فردوس): Levels 35–36
 * - Tabas (طبس): Levels 37–38
 * - Birjand (بیرجند): Levels 39–40
 */
export const KHORASAN_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 33: 6x6 Expert — Gonabad Vertical Shaft
  {
    id: 33,
    regionId: 'khorasan',
    destinationId: 'gonabad',
    titleFa: 'چاه‌میله گناباد',
    subtitleFa: 'هدایت آب از مادرچاه مرکزی به سه دالان زیرزمینی',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 2 },
    destination: { row: 3, col: 0 },
    destinations: [
      { row: 3, col: 0 },
      { row: 3, col: 5 },
      { row: 5, col: 3 },
    ],
    // Moves: (1,1):2 (1,3):1 (1,4):2 | (2,0):2 (2,1):2 (2,2):1 (2,4):2 (2,5):2
    //        (3,1):2 (3,3):1 (3,4):2 | (4,2):2 (4,3):2 => 23
    expectedMinMoves: 23,
    parTimeSec: 165,
    grid: [
      [blk(), emp(), src(90), emp(), blk(), emp()],
      [emp(), cor(270, 90), crs(0), str(0, 90), cor(0, 180), blk()],
      [cor(270, 90), tee(90, 270), str(90, 0), blk(), tee(270, 90), cor(0, 180)],
      [dst(90), cor(180, 0), crs(0), str(0, 90), cor(90, 270), dst(90)],
      [blk(), emp(), cor(180, 0), cor(0, 180), emp(), blk()],
      [emp(), blk(), emp(), dst(90), blk(), emp()],
    ],
  },

  // LEVEL 34: 6x6 Expert — Ancient Qasabeh Qanat (Gonabad)
  {
    id: 34,
    regionId: 'khorasan',
    destinationId: 'gonabad',
    titleFa: 'قنات کهن قصبه',
    subtitleFa: 'دالان‌های تودرتو با سه تقاطع چهارراهی و جریان گرانشی پیوسته',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 5 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 5, col: 2 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,1):1 (0,2):2 | (1,2):2 (1,3):1 (1,4):2 (1,5):2 | (2,0):2 (2,1):1 (2,3):2 (2,4):1
    //        (3,0):2 (3,1):2 (3,2):1 (3,3):2 (3,5):2 | (4,1):2 (4,3):1 (4,4):2 (4,5):1 => 31
    expectedMinMoves: 31,
    parTimeSec: 180,
    grid: [
      [dst(180), str(0, 90), cor(0, 180), blk(), emp(), src(90)],
      [blk(), emp(), tee(270, 90), str(0, 90), tee(0, 180), cor(90, 270)],
      [cor(270, 90), str(0, 90), crs(0), cor(0, 180), str(90, 0), blk()],
      [cor(180, 0), cor(0, 180), str(90, 0), cor(180, 0), crs(0), cor(0, 180)],
      [blk(), cor(180, 0), crs(0), str(0, 90), cor(90, 270), str(90, 0)],
      [emp(), blk(), dst(90), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 35: 5x5 Expert — Ferdows Orchards (Dense symmetrical 5x5 tactical board)
  {
    id: 35,
    regionId: 'khorasan',
    destinationId: 'ferdows',
    titleFa: 'باغستان فردوس',
    subtitleFa: 'شبکه فشرده و متقارن ۵×۵ با سرچشمه مرکزی و سه باغستان',
    difficulty: 'expert',
    rows: 5,
    cols: 5,
    source: { row: 2, col: 2 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 4 },
      { row: 4, col: 2 },
    ],
    // Moves: (0,1):2 (0,3):2 | (1,0):2 (1,2):2 (1,4):2 | (2,0):1 (2,1):1 (2,3):1 (2,4):1
    //        (3,0):2 (3,1):2 (3,2):2 (3,3):1 (3,4):2 => 23
    expectedMinMoves: 23,
    parTimeSec: 150,
    grid: [
      [dst(180), cor(0, 180), blk(), cor(270, 90), dst(0)],
      [cor(270, 90), crs(0), tee(0, 180), crs(0), cor(0, 180)],
      [str(90, 0), str(90, 0), src(270), str(90, 0), str(90, 0)],
      [cor(180, 0), tee(180, 0), tee(0, 180), tee(270, 0), cor(90, 270)],
      [blk(), emp(), dst(90), emp(), blk()],
    ],
  },

  // LEVEL 36: 6x6 Expert — Baladeh Water Channel of Ferdows (4 destinations!)
  {
    id: 36,
    regionId: 'khorasan',
    destinationId: 'ferdows',
    titleFa: 'آبراهه بلده فردوس',
    subtitleFa: 'تقسیم هم‌زمان جریان آب به چهار باغ بدون کوچک‌ترین نشت',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 0, col: 5 },
      { row: 5, col: 1 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,4):2 | (1,1):2 (1,3):1 (1,4):2 | (2,2):2 (2,3):2 (2,4):1
    //        (3,1):1 (3,3):2 (3,4):2 | (4,1):2 (4,2):1 (4,3):1 (4,4):2 (4,5):2 => 25
    expectedMinMoves: 25,
    parTimeSec: 175,
    grid: [
      [blk(), emp(), dst(270), blk(), cor(270, 90), dst(0)],
      [emp(), cor(270, 90), crs(0), str(0, 90), tee(90, 270), blk()],
      [src(0), crs(0), tee(180, 0), cor(0, 180), str(90, 0), emp()],
      [blk(), str(90, 0), blk(), cor(180, 0), tee(90, 270), emp()],
      [emp(), tee(270, 90), str(0, 90), str(0, 90), tee(180, 0), cor(0, 180)],
      [blk(), dst(90), blk(), emp(), emp(), dst(90)],
    ],
  },

  // LEVEL 37: 6x6 Expert — Tabas Palm Oasis
  {
    id: 37,
    regionId: 'khorasan',
    destinationId: 'tabas',
    titleFa: 'نخلستان طبس',
    subtitleFa: 'حلقه‌های دوقلوی آب‌رسانی در حاشیه نخلستان‌های واحه طبس',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 3 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 3, col: 0 },
    ],
    // Moves: (0,1):1 (0,2):2 (0,3):2 (0,4):1 | (1,1):2 (1,2):2 (1,3):2 (1,4):2
    //        (2,0):2 (2,1):2 (2,2):2 (2,4):2 | (3,1):1 (3,3):1 | (4,1):2 (4,2):1 (4,3):2 => 29
    expectedMinMoves: 29,
    parTimeSec: 175,
    grid: [
      [dst(180), str(0, 90), cor(0, 180), cor(270, 90), str(0, 90), dst(0)],
      [blk(), cor(270, 90), tee(90, 270), tee(270, 90), cor(0, 180), blk()],
      [cor(270, 90), tee(90, 270), cor(180, 0), crs(0), cor(90, 270), emp()],
      [dst(90), str(90, 0), blk(), str(90, 0), emp(), blk()],
      [blk(), cor(180, 0), str(0, 90), tee(90, 270), emp(), emp()],
      [emp(), blk(), emp(), src(270), blk(), emp()],
    ],
  },

  // LEVEL 38: 6x6 Expert — Golshan Garden of Tabas (4 destinations!)
  {
    id: 38,
    regionId: 'khorasan',
    destinationId: 'tabas',
    titleFa: 'باغ گلشن طبس',
    subtitleFa: 'چهار جویبار هم‌زمان در باغ واحه‌ای طبس با دو تقاطع مرکزی',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 1 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 2, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 4 },
    ],
    // Moves: (0,3):2 (0,4):1 | (1,0):2 (1,2):1 (1,3):2 | (2,0):1 (2,1):2 (2,2):2 (2,3):2 (2,4):1
    //        (3,0):2 (3,1):2 (3,2):2 (3,4):2 | (4,0):1 (4,3):2 (4,4):2 => 29
    expectedMinMoves: 29,
    parTimeSec: 185,
    grid: [
      [blk(), src(90), blk(), cor(270, 90), str(0, 90), dst(0)],
      [cor(270, 90), crs(0), str(0, 90), tee(90, 270), blk(), emp()],
      [str(90, 0), tee(270, 90), cor(0, 180), tee(270, 90), str(0, 90), dst(0)],
      [tee(270, 90), cor(90, 270), cor(180, 0), crs(0), cor(0, 180), blk()],
      [str(90, 0), blk(), emp(), cor(180, 0), tee(90, 270), emp()],
      [dst(90), emp(), blk(), emp(), dst(90), blk()],
    ],
  },

  // LEVEL 39: 6x6 Expert — Birjand Terraced Gardens
  {
    id: 39,
    regionId: 'khorasan',
    destinationId: 'birjand',
    titleFa: 'پله‌های باغ بیرجند',
    subtitleFa: 'شبکه سه چهارراهی برای آبیاری پلکانی باغ‌های کوهپایه‌ای بیرجند',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 0 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,1):2 (0,3):2 (0,4):1 | (1,0):2 (1,2):1 (1,3):2 | (2,0):1 (2,1):2 (2,2):2 (2,3):2 (2,4):2
    //        (3,0):2 (3,1):1 (3,4):2 | (4,0):1 (4,2):2 (4,3):2 (4,4):1 (4,5):2 => 32
    expectedMinMoves: 32,
    parTimeSec: 190,
    grid: [
      [dst(180), cor(0, 180), blk(), cor(270, 90), str(0, 90), dst(0)],
      [cor(270, 90), crs(0), str(0, 90), tee(90, 270), blk(), emp()],
      [str(90, 0), cor(180, 0), cor(0, 180), tee(270, 90), cor(0, 180), blk()],
      [tee(270, 90), str(0, 90), crs(0), crs(0), cor(90, 270), emp()],
      [str(90, 0), blk(), cor(180, 0), tee(180, 0), str(0, 90), cor(0, 180)],
      [src(270), emp(), blk(), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 40: 6x6 Expert — The Eternal Pulse of Persian Water (Grand 40-Level Finale!)
  {
    id: 40,
    regionId: 'khorasan',
    destinationId: 'birjand',
    titleFa: 'نبض جاودان آب ایران',
    subtitleFa: 'آزمون نهایی استاد قنات‌چی؛ اتصال سرچشمه مرکزی به چهارگوشه سرزمین',
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
    // Moves: (0,1):2 (0,3):2 (0,4):1 | (1,0):2 (1,2):1 (1,4):2 | (2,0):1 (2,1):1 (2,3):2 (2,4):2 (2,5):2
    //        (3,0):2 (3,2):1 (3,4):2 (3,5):1 | (4,0):1 (4,1):2 (4,2):1 (4,3):2 (4,5):1 => 31
    expectedMinMoves: 31,
    parTimeSec: 200,
    grid: [
      [dst(180), cor(0, 180), blk(), cor(270, 90), str(0, 90), dst(0)],
      [cor(270, 90), crs(0), str(0, 90), crs(0), cor(0, 180), blk()],
      [str(90, 0), str(90, 0), src(0), tee(90, 270), tee(270, 90), cor(0, 180)],
      [tee(270, 90), crs(0), str(0, 90), crs(0), cor(90, 270), str(90, 0)],
      [str(90, 0), cor(180, 0), str(0, 90), cor(90, 270), blk(), str(90, 0)],
      [dst(90), blk(), emp(), emp(), blk(), dst(90)],
    ],
  },
];
