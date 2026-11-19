import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Route 8: Semnan — Northern Desert-Edge & Southern Alborz Route (Levels 57–64)
 * Destinations:
 * - Garmsar (گرمسار): Levels 57–58
 * - Semnan (سمنان): Levels 59–60
 * - Damghan (دامغان): Levels 61–62
 * - Shahroud (شاهرود): Levels 63–64
 */
export const SEMNAN_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 57: 5x6 Hard — Garmsar Foothill Desert-Edge Intake
  {
    id: 57,
    regionId: 'semnan',
    destinationId: 'garmsar',
    titleFa: 'آبگیر دشت گرمسار',
    subtitleFa: 'هدایت جریان از شمال‌غرب دشت گرمسار به سه کانال حاشیه کویر',
    difficulty: 'hard',
    rows: 5,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 2, col: 0 },
      { row: 4, col: 5 },
    ],
    // Moves: (0,1):1 (0,2):2 | (1,1):2 (1,3):1 (1,4):2
    //        (2,1):2 (2,2):1 (2,4):2 (2,5):2
    //        (3,1):2 (3,3):1 (3,4):2 (3,5):1
    //        (4,2):2 (4,3):1 (4,4):2 => 26
    expectedMinMoves: 26,
    parTimeSec: 165,
    grid: [
      [src(0), str(0, 90), cor(0, 180), blk(), dst(270), emp()],
      [blk(), cor(270, 90), crs(0), str(0, 90), tee(90, 270), blk()],
      [dst(180), tee(90, 270), str(90, 0), blk(), tee(270, 90), cor(0, 180)],
      [emp(), cor(180, 0), crs(0), str(0, 90), tee(90, 270), str(90, 0)],
      [blk(), emp(), cor(180, 0), str(0, 90), cor(90, 270), dst(90)],
    ],
  },

  // LEVEL 58: 6x6 Hard — Garmsar Plain Distribution
  {
    id: 58,
    regionId: 'semnan',
    destinationId: 'garmsar',
    titleFa: 'انشعاب دشت گرمسار',
    subtitleFa: 'تنظیم دو تقاطع میانی برای انتقال آب از شمال‌شرق به جنوب دشت',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 5 },
    destination: { row: 0, col: 3 },
    destinations: [
      { row: 0, col: 3 },
      { row: 5, col: 0 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,4):2 | (1,0):2 (1,1):1 (1,2):1 (1,4):2
    //        (2,0):1 (2,2):2 (2,3):2 (2,4):2 (2,5):2
    //        (3,0):2 (3,1):1 (3,3):1 (3,4):2 (3,5):1
    //        (4,0):1 (4,2):2 (4,3):1 (4,4):1 (4,5):2 => 31
    expectedMinMoves: 31,
    parTimeSec: 175,
    grid: [
      [blk(), emp(), blk(), dst(270), cor(270, 90), src(180)],
      [cor(270, 90), str(0, 90), str(0, 90), crs(0), tee(90, 270), blk()],
      [str(90, 0), blk(), cor(270, 90), cor(90, 270), tee(270, 90), cor(0, 180)],
      [tee(270, 90), str(0, 90), crs(0), str(0, 90), cor(90, 270), str(90, 0)],
      [str(90, 0), blk(), cor(180, 0), str(0, 90), str(0, 90), tee(90, 270)],
      [dst(90), emp(), blk(), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 59: 6x5 Hard — Semnan Oasis Pool Dividers
  {
    id: 59,
    regionId: 'semnan',
    destinationId: 'semnan',
    titleFa: 'استخرهای آب سمنان',
    subtitleFa: 'تقسیم هم‌زمان آب در شبکه ستونی فشرده به چهار گوشه شهر',
    difficulty: 'hard',
    rows: 6,
    cols: 5,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 4 },
      { row: 5, col: 0 },
      { row: 5, col: 4 },
    ],
    // Moves: (1,0):2 (1,1):1 (1,2):2 (1,3):1 (1,4):2
    //        (2,1):2 (2,3):2 (2,4):2
    //        (3,0):2 (3,1):2 (3,2):1 (3,3):2 (3,4):2
    //        (4,0):2 (4,1):2 (4,2):2 (4,3):2 (4,4):2 => 33
    expectedMinMoves: 33,
    parTimeSec: 175,
    grid: [
      [dst(270), blk(), emp(), blk(), dst(270)],
      [cor(180, 0), str(0, 90), tee(0, 180), str(0, 90), tee(90, 270)],
      [src(0), tee(0, 180), crs(0), tee(0, 180), cor(90, 270)],
      [cor(270, 90), tee(90, 270), str(90, 0), tee(270, 90), cor(0, 180)],
      [tee(270, 90), cor(90, 270), cor(180, 0), tee(180, 0), tee(90, 270)],
      [dst(90), blk(), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 60: 6x6 Hard — Semnan Southern-Alborz Twin Loops
  {
    id: 60,
    regionId: 'semnan',
    destinationId: 'semnan',
    titleFa: 'دالان‌های البرز جنوبی سمنان',
    subtitleFa: 'ورود جریان از شرق و بستن دو حلقه موازی برای چهار مقصد پیرامونی',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 3, col: 5 },
    destination: { row: 0, col: 1 },
    destinations: [
      { row: 0, col: 1 },
      { row: 0, col: 5 },
      { row: 4, col: 0 },
      { row: 5, col: 3 },
    ],
    // Moves: (1,0):2 (1,2):1 (1,3):2 (1,4):2 (1,5):2
    //        (2,0):1 (2,1):1 (2,3):2 (2,4):2
    //        (3,0):2 (3,2):1 (3,4):2
    //        (4,1):2 (4,2):1 (4,3):2 => 25
    expectedMinMoves: 25,
    parTimeSec: 180,
    grid: [
      [blk(), dst(270), blk(), emp(), blk(), dst(270)],
      [cor(270, 90), crs(0), str(0, 90), cor(0, 180), cor(270, 90), cor(90, 270)],
      [str(90, 0), str(90, 0), blk(), tee(270, 90), tee(90, 270), blk()],
      [cor(180, 0), crs(0), str(0, 90), crs(0), tee(180, 0), src(180)],
      [dst(180), tee(180, 0), str(0, 90), tee(90, 270), blk(), emp()],
      [blk(), emp(), blk(), dst(90), emp(), blk()],
    ],
  },

  // LEVEL 61: 6x6 Hard — Damghan Spring-Fed Pistachio Channels
  {
    id: 61,
    regionId: 'semnan',
    destinationId: 'damghan',
    titleFa: 'چشمه‌سار دامغان',
    subtitleFa: 'هدایت آب چشمه‌های کوهپایه به باغ‌های پسته و دشت دامغان',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 3 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 2, col: 5 },
      { row: 5, col: 2 },
    ],
    // Moves: (0,1):1 (0,2):2 | (1,0):2 (1,1):1 (1,3):2 (1,4):2
    //        (2,0):1 (2,2):1 (2,3):2 | (3,0):2 (3,1):2 (3,2):2 (3,3):2 (3,4):1
    //        (4,1):2 (4,3):1 (4,4):2 => 28
    expectedMinMoves: 28,
    parTimeSec: 180,
    grid: [
      [dst(180), str(0, 90), cor(0, 180), src(90), blk(), emp()],
      [cor(270, 90), str(0, 90), crs(0), tee(180, 0), cor(0, 180), blk()],
      [str(90, 0), blk(), str(90, 0), cor(270, 90), crs(0), dst(0)],
      [cor(180, 0), cor(0, 180), tee(270, 90), cor(90, 270), str(90, 0), blk()],
      [blk(), cor(180, 0), crs(0), str(0, 90), cor(90, 270), emp()],
      [emp(), blk(), dst(90), blk(), emp(), blk()],
    ],
  },

  // LEVEL 62: 6x6 Expert — Damghan Cistern Crossroads
  {
    id: 62,
    regionId: 'semnan',
    destinationId: 'damghan',
    titleFa: 'چهارراه آب‌انبار دامغان',
    subtitleFa: 'عبور دقیق از سه تقاطع هم‌زمان در گذرگاه تاریخی دامغان',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 3, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 1, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 5 },
    ],
    // Moves: (1,0):2 (1,1):1 (1,3):1 (1,4):2 | (2,0):2 (2,1):2 (2,2):2 (2,4):2 (2,5):2
    //        (3,2):1 (3,3):1 (3,5):2 | (4,0):2 (4,1):2 (4,4):2 (4,5):2 => 28
    expectedMinMoves: 28,
    parTimeSec: 185,
    grid: [
      [blk(), emp(), dst(270), blk(), emp(), blk()],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), tee(0, 180), dst(0)],
      [cor(180, 0), tee(0, 180), cor(90, 270), blk(), tee(270, 90), cor(0, 180)],
      [src(0), crs(0), str(0, 90), str(0, 90), crs(0), tee(90, 270)],
      [cor(270, 90), cor(90, 270), blk(), blk(), cor(180, 0), tee(90, 270)],
      [dst(90), blk(), emp(), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 63: 6x6 Expert — Shahroud Mountain-Basin Cascade
  {
    id: 63,
    regionId: 'semnan',
    destinationId: 'shahroud',
    titleFa: 'آبگیر کوهپایه شاهرود',
    subtitleFa: 'بالا آوردن جریان از جنوب‌شرق برای سیراب‌سازی چهار بخش شاهرود',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 4 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 4 },
      { row: 3, col: 5 },
      { row: 5, col: 1 },
    ],
    // Moves: (1,0):2 (1,1):2 (1,2):1 (1,3):1 (1,4):2
    //        (2,0):2 (2,2):2 (2,3):2 (2,4):2
    //        (3,0):1 (3,1):1 (3,2):2 (3,3):2 (3,4):2
    //        (4,0):2 (4,2):1 (4,3):1 (4,4):2 => 30
    expectedMinMoves: 30,
    parTimeSec: 190,
    grid: [
      [dst(270), blk(), emp(), blk(), dst(270), emp()],
      [cor(180, 0), tee(0, 180), str(0, 90), str(0, 90), tee(90, 270), blk()],
      [cor(270, 90), crs(0), cor(0, 180), cor(270, 90), tee(90, 270), blk()],
      [str(90, 0), str(90, 0), cor(180, 0), cor(90, 270), tee(270, 90), dst(0)],
      [cor(180, 0), crs(0), str(0, 90), str(0, 90), tee(90, 270), blk()],
      [blk(), dst(90), emp(), blk(), src(270), emp()],
    ],
  },

  // LEVEL 64: 7x7 Expert — Shahroud Grand Desert-Edge Nexus
  {
    id: 64,
    regionId: 'semnan',
    destinationId: 'shahroud',
    titleFa: 'گذرگاه بزرگ شاهرود',
    subtitleFa: 'نخستین تخته ۷×۷؛ رساندن آب از چشمه مرکزی به چهارگوشه حاشیه کویر',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 3, col: 3 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 6 },
      { row: 6, col: 0 },
      { row: 6, col: 6 },
    ],
    // Moves: (0,1):1 (0,2):2 | (1,0):2 (1,1):1 (1,3):1 (1,4):1 (1,5):1 (1,6):2
    //        (2,0):1 (2,2):2 (2,3):2 (2,4):2 (2,6):1
    //        (3,0):2 (3,1):1 (3,2):2 (3,4):2 (3,5):1 (3,6):2
    //        (4,0):1 (4,2):2 (4,3):1 (4,4):2 (4,6):1
    //        (5,0):2 (5,1):1 (5,2):1 (5,3):1 (5,4):2 (5,5):1 (5,6):2 => 46
    expectedMinMoves: 46,
    parTimeSec: 230,
    grid: [
      [dst(180), str(0, 90), cor(0, 180), blk(), emp(), blk(), dst(270)],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), str(0, 90), str(0, 90), tee(90, 270)],
      [str(90, 0), blk(), cor(180, 0), tee(0, 180), cor(0, 180), blk(), str(90, 0)],
      [tee(270, 90), str(0, 90), cor(0, 180), src(270), tee(270, 90), str(0, 90), tee(90, 270)],
      [str(90, 0), blk(), cor(180, 0), str(0, 90), tee(90, 270), blk(), str(90, 0)],
      [tee(270, 90), str(0, 90), str(0, 90), str(0, 90), tee(180, 0), str(0, 90), tee(90, 270)],
      [dst(90), blk(), emp(), blk(), emp(), blk(), dst(90)],
    ],
  },
];
