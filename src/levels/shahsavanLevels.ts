import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Route 11: Shahsavan Heritage — From Moghan Plain to Mount Sabalan Slopes (Levels 81–90)
 * Destinations (5 destinations · 10 levels):
 * - Parsabad (پارس‌آباد): Levels 81–82
 * - Bileh Savar (بیله‌سوار): Levels 83–84
 * - Germi (گرمی): Levels 85–86
 * - Meshgin Shahr (مشگین‌شهر): Levels 87–88
 * - Ardabil and Sabalan region (اردبیل و دامنه سبلان): Levels 89–90
 */
export const SHAHSAVAN_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 81: 5x6 Challenging — Parsabad Moghan Winter Plain (قشلاق مغان)
  {
    id: 81,
    regionId: 'shahsavan',
    destinationId: 'parsabad',
    titleFa: 'دشت قشلاق پارس‌آباد',
    subtitleFa: 'گسترش جریان آب در دشت هموار مغان میان سه آبگیر پیرامونی',
    difficulty: 'challenging',
    rows: 5,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 3, col: 5 },
      { row: 4, col: 4 },
    ],
    expectedMinMoves: 30,
    parTimeSec: 155,
    grid: [
      [emp(), cor(270, 90), str(0, 90), cor(0, 180), blk(), dst(270)],
      [blk(), str(90, 0), blk(), cor(180, 0), str(0, 90), tee(90, 270)],
      [src(0), crs(0), str(0, 90), tee(0, 180), str(0, 90), cor(90, 270)],
      [cor(270, 90), cor(90, 270), blk(), tee(270, 90), str(0, 90), dst(0)],
      [cor(180, 0), str(0, 90), str(0, 90), tee(180, 0), dst(0), blk()],
    ],
  },

  // LEVEL 82: 6x5 Hard — Parsabad Aras Basin Conduits
  {
    id: 82,
    regionId: 'shahsavan',
    destinationId: 'parsabad',
    titleFa: 'آبراه‌های ارس و مغان',
    subtitleFa: 'تنظیم گذرگاه‌های شمالی به جنوبی برای سیراب کردن سه بخش دشت',
    difficulty: 'hard',
    rows: 6,
    cols: 5,
    source: { row: 0, col: 2 },
    destination: { row: 2, col: 4 },
    destinations: [
      { row: 2, col: 4 },
      { row: 5, col: 0 },
      { row: 5, col: 1 },
    ],
    expectedMinMoves: 25,
    parTimeSec: 165,
    grid: [
      [blk(), emp(), src(90), emp(), blk()],
      [cor(270, 90), str(0, 90), crs(0), cor(0, 180), blk()],
      [str(90, 0), blk(), str(90, 0), tee(270, 90), dst(0)],
      [tee(270, 90), str(0, 90), crs(0), tee(90, 270), blk()],
      [str(90, 0), blk(), str(90, 0), cor(180, 0), cor(0, 180)],
      [dst(90), dst(180), tee(180, 0), str(0, 90), cor(90, 270)],
    ],
  },

  // LEVEL 83: 6x6 Hard — Bileh Savar Meadow Crossing
  {
    id: 83,
    regionId: 'shahsavan',
    destinationId: 'bileh_savar',
    titleFa: 'گذرگاه چمنزار بیله‌سوار',
    subtitleFa: 'هدایت جریان از شمال‌غرب دشت میان سنگلاخ‌ها به سه آبشخور فصلی',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 3, col: 5 },
      { row: 5, col: 1 },
    ],
    expectedMinMoves: 29,
    parTimeSec: 175,
    grid: [
      [src(0), str(0, 90), tee(0, 180), str(0, 90), str(0, 90), dst(0)],
      [blk(), emp(), str(90, 0), blk(), cor(270, 90), cor(0, 180)],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), tee(90, 270), str(90, 0)],
      [str(90, 0), blk(), str(90, 0), blk(), str(90, 0), dst(90)],
      [cor(180, 0), tee(0, 180), tee(180, 0), str(0, 90), cor(90, 270), blk()],
      [blk(), dst(90), emp(), blk(), emp(), blk()],
    ],
  },

  // LEVEL 84: 6x6 Hard — Bileh Savar Four-Camp Watering Network
  {
    id: 84,
    regionId: 'shahsavan',
    destinationId: 'bileh_savar',
    titleFa: 'چهارآبخور دشت بیله‌سوار',
    subtitleFa: 'تقسیم هم‌زمان آب از چشمه شرقی میان چهار ایستگاه دشت',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 5 },
    destination: { row: 0, col: 1 },
    destinations: [
      { row: 0, col: 1 },
      { row: 0, col: 4 },
      { row: 5, col: 0 },
      { row: 5, col: 4 },
    ],
    expectedMinMoves: 25,
    parTimeSec: 185,
    grid: [
      [blk(), dst(270), emp(), blk(), dst(270), blk()],
      [cor(270, 90), crs(0), str(0, 90), str(0, 90), tee(90, 270), blk()],
      [str(90, 0), cor(180, 0), cor(0, 180), blk(), tee(270, 90), src(180)],
      [tee(270, 90), str(0, 90), crs(0), str(0, 90), tee(90, 270), emp()],
      [str(90, 0), blk(), cor(180, 0), str(0, 90), tee(90, 270), emp()],
      [dst(90), blk(), emp(), blk(), dst(90), blk()],
    ],
  },

  // LEVEL 85: 6x6 Hard — Germi Foothill Valleys
  {
    id: 85,
    regionId: 'shahsavan',
    destinationId: 'germi',
    titleFa: 'دره‌های کوهپایه گرمی',
    subtitleFa: 'صعود مسیرهای آب از جنوب به شمال در دره‌های پلکانی گرمی',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 3 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 3, col: 0 },
      { row: 3, col: 5 },
    ],
    expectedMinMoves: 26,
    parTimeSec: 185,
    grid: [
      [dst(270), blk(), emp(), blk(), emp(), dst(270)],
      [tee(270, 90), str(0, 90), cor(0, 180), cor(270, 90), str(0, 90), tee(90, 270)],
      [str(90, 0), blk(), cor(180, 0), crs(0), cor(0, 180), str(90, 0)],
      [dst(90), cor(270, 90), str(0, 90), crs(0), tee(90, 270), dst(90)],
      [emp(), cor(180, 0), str(0, 90), crs(0), cor(90, 270), blk()],
      [blk(), emp(), blk(), src(270), blk(), emp()],
    ],
  },

  // LEVEL 86: 6x7 Hard — Germi Winding Valley Pass
  {
    id: 86,
    regionId: 'shahsavan',
    destinationId: 'germi',
    titleFa: 'نهرهای پیچ‌درپیچ گرمی',
    subtitleFa: 'تخته مستطیلی ۶×۷ با انشعاب‌های طولانی در تنگه کوهپایه‌ای',
    difficulty: 'hard',
    rows: 6,
    cols: 7,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 0, col: 6 },
      { row: 5, col: 1 },
      { row: 5, col: 5 },
    ],
    expectedMinMoves: 35,
    parTimeSec: 205,
    grid: [
      [blk(), emp(), dst(270), blk(), emp(), blk(), dst(270)],
      [emp(), cor(270, 90), crs(0), str(0, 90), cor(0, 180), cor(270, 90), tee(90, 270)],
      [src(0), tee(90, 270), str(90, 0), blk(), cor(180, 0), crs(0), cor(90, 270)],
      [cor(270, 90), crs(0), tee(90, 270), emp(), blk(), str(90, 0), blk()],
      [cor(180, 0), crs(0), cor(90, 270), cor(270, 90), tee(0, 180), tee(90, 270), emp()],
      [blk(), dst(90), blk(), cor(180, 0), cor(90, 270), dst(90), blk()],
    ],
  },

  // LEVEL 87: 6x6 Expert — Meshgin Shahr Mountain Springs
  {
    id: 87,
    regionId: 'shahsavan',
    destinationId: 'meshgin_shahr',
    titleFa: 'چشمه‌های دامنه مشگین‌شهر',
    subtitleFa: 'شبکه پرتراکم با نقش‌مایه هندسی ورنی در دامنه‌های شمالی سبلان',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 1, col: 0 },
    destination: { row: 0, col: 3 },
    destinations: [
      { row: 0, col: 3 },
      { row: 2, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 4 },
    ],
    expectedMinMoves: 31,
    parTimeSec: 195,
    grid: [
      [blk(), emp(), blk(), dst(270), blk(), emp()],
      [src(0), tee(0, 180), str(0, 90), crs(0), cor(0, 180), blk()],
      [cor(270, 90), tee(90, 270), blk(), str(90, 0), tee(270, 90), dst(0)],
      [str(90, 0), cor(180, 0), str(0, 90), crs(0), tee(90, 270), blk()],
      [tee(270, 90), str(0, 90), cor(0, 180), tee(270, 90), tee(90, 270), emp()],
      [dst(90), blk(), cor(180, 0), cor(90, 270), dst(90), blk()],
    ],
  },

  // LEVEL 88: 7x6 Expert — Meshgin Shahr Highland Gorge
  {
    id: 88,
    regionId: 'shahsavan',
    destinationId: 'meshgin_shahr',
    titleFa: 'تنگه مرتفع مشگین‌شهر',
    subtitleFa: 'گذرگاه عمودی ۷×۶ در شیب دره‌های مرتفع با چهار مقصد هم‌زمان',
    difficulty: 'expert',
    rows: 7,
    cols: 6,
    source: { row: 0, col: 2 },
    destination: { row: 2, col: 5 },
    destinations: [
      { row: 2, col: 5 },
      { row: 4, col: 0 },
      { row: 6, col: 1 },
      { row: 6, col: 5 },
    ],
    expectedMinMoves: 34,
    parTimeSec: 215,
    grid: [
      [blk(), emp(), src(90), emp(), blk(), emp()],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), cor(0, 180), blk()],
      [str(90, 0), blk(), str(90, 0), blk(), tee(270, 90), dst(0)],
      [cor(180, 0), tee(0, 180), crs(0), str(0, 90), crs(0), cor(0, 180)],
      [dst(180), tee(90, 270), str(90, 0), blk(), str(90, 0), str(90, 0)],
      [emp(), tee(270, 90), cor(90, 270), cor(270, 90), crs(0), tee(90, 270)],
      [blk(), dst(90), blk(), cor(180, 0), cor(90, 270), dst(90)],
    ],
  },

  // LEVEL 89: 7x7 Expert — Sabalan Summer Pastures (ییلاق آلاچیق‌های سبلان)
  {
    id: 89,
    regionId: 'shahsavan',
    destinationId: 'ardabil_sabalan',
    titleFa: 'ییلاق آلاچیق‌های سبلان',
    subtitleFa: 'شبکه ۷×۷ الهام‌گرفته از هندسه ورنی برای آبرسانی چهار ییلاق دامنه سبلان',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 0, col: 3 },
    destination: { row: 0, col: 1 },
    destinations: [
      { row: 0, col: 1 },
      { row: 0, col: 5 },
      { row: 6, col: 1 },
      { row: 6, col: 5 },
    ],
    expectedMinMoves: 41,
    parTimeSec: 235,
    grid: [
      [blk(), dst(270), blk(), src(90), blk(), dst(270), blk()],
      [cor(270, 90), crs(0), str(0, 90), crs(0), str(0, 90), crs(0), cor(0, 180)],
      [str(90, 0), cor(180, 0), cor(0, 180), str(90, 0), cor(270, 90), cor(90, 270), str(90, 0)],
      [tee(270, 90), str(0, 90), crs(0), tee(180, 0), crs(0), str(0, 90), tee(90, 270)],
      [str(90, 0), blk(), str(90, 0), blk(), str(90, 0), blk(), str(90, 0)],
      [cor(180, 0), tee(0, 180), cor(90, 270), emp(), cor(180, 0), tee(0, 180), cor(90, 270)],
      [blk(), dst(90), blk(), emp(), blk(), dst(90), blk()],
    ],
  },

  // LEVEL 90: 7x7 Expert — Glory of Mount Sabalan Slopes (Route 11 Capstone — 5 Destinations)
  {
    id: 90,
    regionId: 'shahsavan',
    destinationId: 'ardabil_sabalan',
    titleFa: 'شکوه دامنه سبلان',
    subtitleFa: 'آزمون پایانی راه کوچ شاهسون؛ تقسیم آب کوهستان میان پنج ییلاق پیرامون سبلان',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 6, col: 3 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 3 },
      { row: 0, col: 6 },
      { row: 3, col: 0 },
      { row: 3, col: 6 },
    ],
    expectedMinMoves: 31,
    parTimeSec: 250,
    grid: [
      [dst(270), blk(), emp(), dst(270), emp(), blk(), dst(270)],
      [tee(270, 90), str(0, 90), tee(0, 180), crs(0), tee(0, 180), str(0, 90), tee(90, 270)],
      [str(90, 0), blk(), cor(180, 0), crs(0), cor(90, 270), blk(), str(90, 0)],
      [dst(90), cor(270, 90), str(0, 90), crs(0), str(0, 90), cor(0, 180), dst(90)],
      [emp(), str(90, 0), blk(), str(90, 0), blk(), str(90, 0), emp()],
      [blk(), cor(180, 0), str(0, 90), crs(0), str(0, 90), cor(90, 270), blk()],
      [emp(), blk(), emp(), src(270), emp(), blk(), emp()],
    ],
  },
];
