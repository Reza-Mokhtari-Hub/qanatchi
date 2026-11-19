import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Route 10: Razavi Khorasan — Northeastern Iranian Plateau & Finale Route (Levels 73–80)
 * Destinations:
 * - Nishapur (نیشابور): Levels 73–74
 * - Sabzevar (سبزوار): Levels 75–76
 * - Kashmar (کاشمر): Levels 77–78
 * - Torbat Heydarieh (تربت حیدریه): Levels 79–80
 */
export const RAZAVI_KHORASAN_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 73: 6x6 Expert — Nishapur Turquoise-Foothill Channels
  {
    id: 73,
    regionId: 'razavi_khorasan',
    destinationId: 'nishapur',
    titleFa: 'دامنه فیروزه‌ای نیشابور',
    subtitleFa: 'هدایت آب از شمال‌شرق دشت نیشابور به چهار آب‌انبار پیرامونی',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 5 },
    destination: { row: 0, col: 1 },
    destinations: [
      { row: 0, col: 1 },
      { row: 2, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 4 },
    ],
    // Moves: (0,3):2 (0,4):2 | (1,0):2 (1,2):1 (1,4):2 (1,5):2
    //        (2,0):1 (2,1):1 (2,3):2 (2,4):2
    //        (3,0):2 (3,2):1 (3,3):2 (3,4):2
    //        (4,0):1 (4,1):2 (4,2):1 (4,3):1 (4,4):2 => 31
    expectedMinMoves: 31,
    parTimeSec: 195,
    grid: [
      [blk(), dst(270), blk(), cor(270, 90), cor(0, 180), src(90)],
      [cor(270, 90), crs(0), str(0, 90), crs(0), tee(180, 0), cor(90, 270)],
      [str(90, 0), str(90, 0), blk(), tee(270, 90), tee(0, 180), dst(0)],
      [tee(270, 90), crs(0), str(0, 90), tee(180, 0), tee(90, 270), blk()],
      [str(90, 0), cor(180, 0), str(0, 90), str(0, 90), tee(90, 270), emp()],
      [dst(90), blk(), emp(), blk(), dst(90), blk()],
    ],
  },

  // LEVEL 74: 7x7 Expert — Nishapur Binalud Watershed Grid
  {
    id: 74,
    regionId: 'razavi_khorasan',
    destinationId: 'nishapur',
    titleFa: 'آبریز بینالود نیشابور',
    subtitleFa: 'شبکه ۷×۷ با پنج چهارراه کلیدی در شیب کوهپایه‌های بینالود',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 3, col: 0 },
    destination: { row: 0, col: 1 },
    destinations: [
      { row: 0, col: 1 },
      { row: 0, col: 6 },
      { row: 6, col: 0 },
      { row: 6, col: 5 },
    ],
    // Moves: (1,0):2 (1,2):1 (1,3):2 (1,4):2 (1,5):1 (1,6):2
    //        (2,0):2 (2,1):2 (2,3):2 (2,5):2 (2,6):1
    //        (3,2):1 (3,4):2 (3,5):1 (3,6):1
    //        (4,0):2 (4,1):2 (4,2):2 (4,3):2 (4,4):1 (4,6):2
    //        (5,0):1 (5,2):2 (5,3):1 (5,4):1 (5,5):2 => 42
    expectedMinMoves: 42,
    parTimeSec: 235,
    grid: [
      [blk(), dst(270), blk(), emp(), blk(), emp(), dst(270)],
      [cor(270, 90), crs(0), str(0, 90), cor(0, 180), cor(270, 90), str(0, 90), tee(90, 270)],
      [cor(180, 0), tee(90, 270), blk(), tee(270, 90), crs(0), cor(0, 180), str(90, 0)],
      [src(0), crs(0), str(0, 90), crs(0), cor(90, 270), str(90, 0), str(90, 0)],
      [cor(270, 90), tee(180, 0), cor(0, 180), cor(180, 0), str(0, 90), crs(0), cor(90, 270)],
      [str(90, 0), blk(), cor(180, 0), str(0, 90), str(0, 90), tee(90, 270), blk()],
      [dst(90), emp(), blk(), emp(), blk(), dst(90), emp()],
    ],
  },

  // LEVEL 75: 6x6 Expert — Sabzevar Desert-Corridor Qanat Network
  {
    id: 75,
    regionId: 'razavi_khorasan',
    destinationId: 'sabzevar',
    titleFa: 'گذرگاه کویری سبزوار',
    subtitleFa: 'هدایت جریان از جنوب‌شرق از میان چهار تقاطع متوالی در دشت سبزوار',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 5 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 3 },
      { row: 3, col: 5 },
      { row: 5, col: 2 },
    ],
    // Moves: (1,0):2 (1,1):2 (1,2):1 (1,4):2
    //        (2,0):2 (2,2):2 (2,3):2 (2,4):2
    //        (3,0):1 (3,1):2 (3,3):1
    //        (4,0):2 (4,1):1 (4,3):1 (4,4):2 (4,5):2 => 27
    expectedMinMoves: 27,
    parTimeSec: 195,
    grid: [
      [dst(270), blk(), emp(), dst(270), blk(), emp()],
      [cor(180, 0), tee(0, 180), str(0, 90), crs(0), cor(0, 180), blk()],
      [cor(270, 90), crs(0), cor(0, 180), cor(180, 0), tee(90, 270), emp()],
      [str(90, 0), cor(180, 0), crs(0), str(0, 90), crs(0), dst(0)],
      [cor(180, 0), str(0, 90), crs(0), str(0, 90), tee(180, 0), cor(0, 180)],
      [blk(), emp(), dst(90), blk(), emp(), src(270)],
    ],
  },

  // LEVEL 76: 7x7 Expert — Sabzevar Twin-Ridge Subterranean Loop
  {
    id: 76,
    regionId: 'razavi_khorasan',
    destinationId: 'sabzevar',
    titleFa: 'دوحلقه زیرزمینی سبزوار',
    subtitleFa: 'تنظیم تخته ۷×۷ با پنج تقاطع برای تعادل جریان میان چهار آب‌گیر',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 3, col: 6 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 0, col: 5 },
      { row: 6, col: 1 },
      { row: 6, col: 6 },
    ],
    // Moves: (1,0):2 (1,1):1 (1,3):1 (1,4):1 (1,6):2
    //        (2,0):1 (2,2):2 (2,3):2 (2,5):2 (2,6):2
    //        (3,0):2 (3,1):2 (3,2):2 (3,4):1
    //        (4,0):1 (4,1):2 (4,2):2 (4,3):1 (4,5):2 (4,6):2
    //        (5,0):2 (5,2):1 (5,3):2 (5,4):1 (5,5):1 (5,6):2 => 42
    expectedMinMoves: 42,
    parTimeSec: 235,
    grid: [
      [blk(), emp(), dst(270), blk(), emp(), dst(270), blk()],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), str(0, 90), crs(0), cor(0, 180)],
      [str(90, 0), blk(), cor(180, 0), cor(0, 180), blk(), tee(270, 90), cor(90, 270)],
      [tee(270, 90), cor(0, 180), cor(270, 90), crs(0), str(0, 90), crs(0), src(180)],
      [str(90, 0), tee(270, 90), cor(90, 270), str(90, 0), blk(), cor(180, 0), cor(0, 180)],
      [cor(180, 0), crs(0), str(0, 90), tee(180, 0), str(0, 90), str(0, 90), tee(90, 270)],
      [blk(), dst(90), emp(), blk(), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 77: 6x6 Expert — Kashmar Highland Vineyard Conduits
  {
    id: 77,
    regionId: 'razavi_khorasan',
    destinationId: 'kashmar',
    titleFa: 'تاکستان‌های مرتفع کاشمر',
    subtitleFa: 'شبکه پرتراکم کاشمر با سه چهارراه هم‌خط و چهار باغ هدف',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 0, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 3 },
    ],
    // Moves: (1,1):2 (1,3):2 (1,4):2 (1,5):2
    //        (2,2):2 (2,4):2 (2,5):2
    //        (3,0):2 (3,1):2 (3,3):2 (3,4):1 (3,5):2
    //        (4,0):2 (4,1):2 (4,3):2 (4,4):1 (4,5):2 => 32
    expectedMinMoves: 32,
    parTimeSec: 200,
    grid: [
      [blk(), emp(), dst(270), blk(), emp(), dst(270)],
      [emp(), cor(270, 90), crs(0), cor(0, 180), cor(270, 90), tee(90, 270)],
      [src(0), crs(0), tee(180, 0), crs(0), tee(180, 0), cor(90, 270)],
      [cor(270, 90), tee(90, 270), blk(), tee(270, 90), str(0, 90), cor(0, 180)],
      [tee(270, 90), cor(90, 270), blk(), tee(270, 90), str(0, 90), cor(90, 270)],
      [dst(90), blk(), emp(), dst(90), blk(), emp()],
    ],
  },

  // LEVEL 78: 7x7 Expert — Kashmar Five-Terrace Mountain Irrigation
  {
    id: 78,
    regionId: 'razavi_khorasan',
    destinationId: 'kashmar',
    titleFa: 'پنج‌تراس آبیاری کاشمر',
    subtitleFa: 'ارسال هم‌زمان آب از چشمه شمالی به پنج باغچه پلکانی در تخته ۷×۷',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 0, col: 3 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 6 },
      { row: 3, col: 6 },
      { row: 6, col: 0 },
      { row: 6, col: 4 },
    ],
    // Moves: (1,0):2 (1,1):1 (1,2):2 (1,4):2 (1,5):1 (1,6):2
    //        (2,0):2 (2,1):1 (2,2):2 (2,3):1 (2,4):2 (2,5):2
    //        (3,0):1 (3,2):2 (3,4):1
    //        (4,0):2 (4,1):1 (4,2):2 (4,3):2 (4,5):1
    //        (5,0):1 (5,3):2 (5,4):2 (5,5):2 => 39
    expectedMinMoves: 39,
    parTimeSec: 245,
    grid: [
      [dst(270), blk(), emp(), src(90), emp(), blk(), dst(270)],
      [cor(180, 0), str(0, 90), tee(0, 180), crs(0), tee(0, 180), str(0, 90), cor(90, 270)],
      [cor(270, 90), str(0, 90), cor(90, 270), str(90, 0), cor(180, 0), cor(0, 180), blk()],
      [str(90, 0), blk(), cor(270, 90), crs(0), str(0, 90), crs(0), dst(0)],
      [tee(270, 90), str(0, 90), tee(180, 0), tee(90, 270), blk(), str(90, 0), blk()],
      [str(90, 0), blk(), emp(), cor(180, 0), tee(0, 180), cor(90, 270), blk()],
      [dst(90), emp(), blk(), emp(), dst(90), blk(), emp()],
    ],
  },

  // LEVEL 79: 7x7 Expert — Torbat Heydarieh Saffron-Plateau Labyrinth
  {
    id: 79,
    regionId: 'razavi_khorasan',
    destinationId: 'torbat_heydarieh',
    titleFa: 'هزارتوی فلات تربت حیدریه',
    subtitleFa: 'هفت تقاطع چهارراهی در شبکه متقارن دشت زعفران با پنج مقصد هم‌زمان',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 3, col: 6 },
    destination: { row: 0, col: 1 },
    destinations: [
      { row: 0, col: 1 },
      { row: 0, col: 5 },
      { row: 3, col: 0 },
      { row: 6, col: 1 },
      { row: 6, col: 5 },
    ],
    // Moves: (1,0):2 (1,2):1 (1,3):2 (1,4):2 (1,6):2
    //        (2,0):2 (2,1):2 (2,3):2 (2,4):2 (2,5):2 (2,6):2
    //        (3,2):1 (3,4):1
    //        (4,0):2 (4,1):2 (4,3):2 (4,4):2 (4,5):2 (4,6):2
    //        (5,0):2 (5,2):1 (5,3):2 (5,4):2 (5,6):2 => 44
    expectedMinMoves: 44,
    parTimeSec: 255,
    grid: [
      [blk(), dst(270), blk(), emp(), blk(), dst(270), blk()],
      [cor(270, 90), crs(0), str(0, 90), cor(0, 180), cor(270, 90), crs(0), cor(0, 180)],
      [cor(180, 0), tee(90, 270), blk(), tee(270, 90), cor(90, 270), tee(270, 90), cor(90, 270)],
      [dst(180), crs(0), str(0, 90), crs(0), str(0, 90), crs(0), src(180)],
      [cor(270, 90), tee(90, 270), blk(), tee(270, 90), cor(0, 180), tee(270, 90), cor(0, 180)],
      [cor(180, 0), crs(0), str(0, 90), cor(90, 270), cor(180, 0), crs(0), cor(90, 270)],
      [blk(), dst(90), blk(), emp(), blk(), dst(90), blk()],
    ],
  },

  // LEVEL 80: 7x7 Expert — The Turquoise Heart of Iran (Grand 80-Level Campaign Finale!)
  {
    id: 80,
    regionId: 'razavi_khorasan',
    destinationId: 'torbat_heydarieh',
    titleFa: 'قلب فیروزه‌ای ایران',
    subtitleFa: 'آزمون بزرگ مرحله هشتادم؛ تپش آب از قلب شبکه ۷×۷ به پنج مقصد سرزمین',
    difficulty: 'expert',
    rows: 7,
    cols: 7,
    source: { row: 3, col: 3 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 3 },
      { row: 0, col: 6 },
      { row: 6, col: 0 },
      { row: 6, col: 6 },
    ],
    // Moves: (1,0):2 (1,1):1 (1,2):2 (1,4):2 (1,5):1 (1,6):2
    //        (2,0):2 (2,1):1 (2,3):2 (2,5):1 (2,6):2
    //        (3,0):1 (3,2):1 (3,4):1 (3,6):1
    //        (4,0):2 (4,1):1 (4,5):1 (4,6):2
    //        (5,0):1 (5,2):2 (5,3):2 (5,4):2 (5,6):1 => 36
    expectedMinMoves: 36,
    parTimeSec: 260,
    grid: [
      [dst(270), blk(), emp(), dst(270), emp(), blk(), dst(270)],
      [cor(180, 0), str(0, 90), tee(0, 180), crs(0), tee(0, 180), str(0, 90), cor(90, 270)],
      [cor(270, 90), str(0, 90), crs(0), tee(180, 0), crs(0), str(0, 90), cor(0, 180)],
      [str(90, 0), blk(), str(90, 0), src(90), str(90, 0), blk(), str(90, 0)],
      [tee(270, 90), str(0, 90), crs(0), crs(0), crs(0), str(0, 90), tee(90, 270)],
      [str(90, 0), blk(), cor(180, 0), tee(180, 0), cor(90, 270), blk(), str(90, 0)],
      [dst(90), emp(), blk(), emp(), blk(), emp(), dst(90)],
    ],
  },
];
