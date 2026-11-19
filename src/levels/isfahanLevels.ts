import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Route 6: Isfahan Plateau — Central Iranian River-Basin & Plateau Route (Levels 41–48)
 * Destinations:
 * - Isfahan (اصفهان): Levels 41–42
 * - Ardestan (اردستان): Levels 43–44
 * - Nain (نائین): Levels 45–46
 * - Natanz (نطنز): Levels 47–48
 */
export const ISFAHAN_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 41: 5x5 Medium — Isfahan Madi Channels
  {
    id: 41,
    regionId: 'isfahan',
    destinationId: 'isfahan',
    titleFa: 'مادی‌های زاینده‌رود',
    subtitleFa: 'انشعاب نخست آب در فلات اصفهان و هدایت آرام آن به دو باغ',
    difficulty: 'medium',
    rows: 5,
    cols: 5,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 4, col: 4 },
    ],
    // Moves: (0,1):1 (0,2):1 (0,3):1 | (1,1):2 (1,2):1 (1,3):1
    //        (2,1):2 (2,3):1 (2,4):2 | (3,1):2 (3,2):1 (3,3):1 (3,4):1 => 17
    expectedMinMoves: 17,
    parTimeSec: 110,
    grid: [
      [blk(), cor(0, 90), str(0, 90), str(0, 90), dst(0)],
      [emp(), tee(270, 90), str(0, 90), cor(90, 180), blk()],
      [src(0), tee(90, 270), blk(), tee(0, 90), cor(0, 180)],
      [emp(), cor(180, 0), str(0, 90), cor(180, 270), str(90, 0)],
      [blk(), emp(), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 42: 5x6 Challenging — Chaharbagh Waterway Lattice
  {
    id: 42,
    regionId: 'isfahan',
    destinationId: 'isfahan',
    titleFa: 'گذرگاه آب چهارباغ',
    subtitleFa: 'تنظیم شبکه مستطیلی جویبارها برای سیراب‌سازی سه بخش باغ',
    difficulty: 'challenging',
    rows: 5,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 2, col: 5 },
      { row: 4, col: 0 },
    ],
    // Moves: (0,1):1 (0,2):2 (0,3):1 (0,4):1 | (1,1):2 (1,2):1 (1,4):1 (1,5):2
    //        (2,0):2 (2,1):1 (2,3):2 (2,4):2 | (3,0):1 (3,2):1 (3,3):2 => 22
    expectedMinMoves: 22,
    parTimeSec: 135,
    grid: [
      [src(0), str(0, 90), tee(0, 180), str(0, 90), str(0, 90), dst(0)],
      [blk(), cor(270, 90), tee(180, 270), blk(), cor(0, 90), cor(0, 180)],
      [cor(270, 90), tee(270, 0), crs(0), tee(0, 180), cor(90, 270), dst(90)],
      [str(90, 0), blk(), cor(270, 0), cor(90, 270), blk(), emp()],
      [dst(90), emp(), blk(), emp(), blk(), emp()],
    ],
  },

  // LEVEL 43: 5x6 Challenging — Ardestan Foothill Channels
  {
    id: 43,
    regionId: 'isfahan',
    destinationId: 'ardestan',
    titleFa: 'دالان دامنه اردستان',
    subtitleFa: 'بهره‌گیری از دو حلقه هم‌تراز در گذرگاه کوهپایه‌ای اردستان',
    difficulty: 'challenging',
    rows: 5,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 4, col: 1 },
      { row: 4, col: 5 },
    ],
    // Moves: (0,4):2 (0,5):1 | (1,1):1 (1,3):1 (1,4):2 (1,5):1
    //        (2,1):2 (2,2):2 (2,3):1 (2,4):2 (2,5):1
    //        (3,1):1 (3,2):1 (3,3):1 (3,4):2 (3,5):2 => 23
    expectedMinMoves: 23,
    parTimeSec: 140,
    grid: [
      [blk(), emp(), dst(270), blk(), cor(270, 90), cor(90, 180)],
      [emp(), cor(0, 90), crs(0), str(0, 90), cor(90, 270), str(90, 0)],
      [src(0), tee(90, 270), cor(180, 0), str(0, 90), cor(0, 180), str(90, 0)],
      [blk(), tee(0, 90), str(0, 90), str(0, 90), tee(180, 0), tee(90, 270)],
      [emp(), dst(90), blk(), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 44: 6x5 Challenging — Ardestan Stepped Conduits
  {
    id: 44,
    regionId: 'isfahan',
    destinationId: 'ardestan',
    titleFa: 'آبراهه پلکانی اردستان',
    subtitleFa: 'توزیع عمودی جریان در شیب ملایم فلات مرکزی به سه آب‌انبار',
    difficulty: 'challenging',
    rows: 6,
    cols: 5,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 5, col: 0 },
      { row: 5, col: 4 },
    ],
    // Moves: (0,2):2 (0,3):1 | (1,0):2 (1,1):1 (1,2):2 | (2,1):1 (2,3):1 (2,4):2
    //        (3,0):2 (3,1):2 (3,2):1 (3,4):1 | (4,0):1 (4,1):2 (4,2):2 (4,3):1 (4,4):1 => 25
    expectedMinMoves: 25,
    parTimeSec: 145,
    grid: [
      [src(90), blk(), cor(270, 90), str(0, 90), dst(0)],
      [cor(180, 0), str(0, 90), tee(90, 270), blk(), emp()],
      [blk(), cor(0, 90), crs(0), str(0, 90), cor(0, 180)],
      [cor(270, 90), tee(90, 270), str(90, 0), blk(), str(90, 0)],
      [str(90, 0), cor(180, 0), tee(180, 0), str(0, 90), tee(180, 270)],
      [dst(90), blk(), emp(), blk(), dst(90)],
    ],
  },

  // LEVEL 45: 6x6 Challenging — Nain Desert Cistern Hub
  {
    id: 45,
    regionId: 'isfahan',
    destinationId: 'nain',
    titleFa: 'آب‌انبار کویری نائین',
    subtitleFa: 'بالا آوردن جریان از جنوب و پخش دقیق آن در حاشیه کویر نائین',
    difficulty: 'challenging',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 0 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 5, col: 3 },
    ],
    // Moves: (0,1):1 (0,2):2 | (1,1):2 (1,2):2 (1,4):1 (1,5):2
    //        (2,0):1 (2,2):2 (2,3):1 (2,4):2 (2,5):1
    //        (3,0):1 (3,1):2 (3,2):1 (3,3):2 (3,5):1
    //        (4,0):2 (4,1):1 (4,3):2 (4,4):1 (4,5):2 => 32
    expectedMinMoves: 32,
    parTimeSec: 165,
    grid: [
      [dst(180), str(0, 90), cor(0, 180), blk(), emp(), dst(270)],
      [blk(), cor(270, 90), tee(90, 270), blk(), cor(0, 90), tee(90, 270)],
      [cor(0, 90), crs(0), tee(180, 0), str(0, 90), cor(90, 270), str(90, 0)],
      [str(90, 0), tee(270, 90), str(0, 90), cor(0, 180), blk(), str(90, 0)],
      [tee(270, 90), cor(180, 270), blk(), tee(270, 90), str(0, 90), cor(90, 270)],
      [src(270), blk(), emp(), dst(90), emp(), blk()],
    ],
  },

  // LEVEL 46: 6x6 Hard — Nain Subterranean Galleries
  {
    id: 46,
    regionId: 'isfahan',
    destinationId: 'nain',
    titleFa: 'دالان‌های خنک نائین',
    subtitleFa: 'عبور از سنگلاخ مرکزی با یک چهارراه کلیدی و سه خروجی هم‌زمان',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 3, col: 5 },
      { row: 5, col: 1 },
    ],
    // Moves: (0,1):2 (0,2):1 (0,3):2 (0,4):1 | (1,1):1 (1,3):2 (1,4):2
    //        (2,2):1 (2,3):1 (2,4):1 | (3,1):1 (3,2):2 (3,3):2 (3,4):2
    //        (4,1):2 (4,2):2 (4,3):1 (4,4):2 => 28
    expectedMinMoves: 28,
    parTimeSec: 170,
    grid: [
      [blk(), cor(270, 90), str(0, 90), tee(0, 180), str(0, 90), dst(0)],
      [emp(), str(90, 0), blk(), tee(270, 90), cor(0, 180), blk()],
      [src(0), crs(0), str(0, 90), tee(180, 270), str(90, 0), emp()],
      [blk(), str(90, 0), cor(270, 90), cor(90, 270), tee(270, 90), dst(0)],
      [emp(), tee(270, 90), tee(180, 0), str(0, 90), cor(90, 270), blk()],
      [blk(), dst(90), blk(), emp(), emp(), emp()],
    ],
  },

  // LEVEL 47: 6x6 Hard — Natanz Foothill Orchard Split
  {
    id: 47,
    regionId: 'isfahan',
    destinationId: 'natanz',
    titleFa: 'باغستان‌های دامنه نطنز',
    subtitleFa: 'آبرسانی از چشمه مرکزی به چهارگوشه باغ‌های کوهپایه کرکس',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 3, col: 2 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 5 },
    ],
    // Moves: (0,1):1 (0,2):2 | (1,0):2 (1,1):1 (1,3):1 (1,4):1 (1,5):2
    //        (2,0):1 (2,2):2 (2,3):1 (2,4):2 (2,5):1
    //        (3,0):2 (3,1):2 (3,4):1 (3,5):1
    //        (4,0):1 (4,1):2 (4,2):1 (4,3):1 (4,4):2 (4,5):2 => 32
    expectedMinMoves: 32,
    parTimeSec: 175,
    grid: [
      [dst(180), str(0, 90), cor(0, 180), blk(), emp(), dst(270)],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), str(0, 90), tee(90, 270)],
      [str(90, 0), blk(), tee(270, 90), str(0, 90), cor(0, 180), str(90, 0)],
      [tee(270, 90), cor(0, 180), src(270), blk(), str(90, 0), str(90, 0)],
      [str(90, 0), cor(180, 0), str(0, 90), str(0, 90), tee(180, 0), tee(90, 270)],
      [dst(90), blk(), emp(), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 48: 6x6 Hard — Natanz Highland Reservoir Loop
  {
    id: 48,
    regionId: 'isfahan',
    destinationId: 'natanz',
    titleFa: 'چهارراه آب‌رسانی نطنز',
    subtitleFa: 'آزمون پایانی فلات اصفهان با چهار تقاطع هم‌پوشان و چهار مقصد',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 5 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 2, col: 5 },
      { row: 4, col: 0 },
      { row: 5, col: 2 },
    ],
    // Moves: (1,0):2 (1,1):1 (1,3):1 (1,4):2 (1,5):2
    //        (2,0):1 (2,2):1 (2,3):2 | (3,0):2 (3,1):1 (3,3):2 (3,4):1
    //        (4,1):1 (4,3):1 (4,4):2 => 22
    expectedMinMoves: 22,
    parTimeSec: 170,
    grid: [
      [blk(), emp(), dst(270), blk(), emp(), src(90)],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), tee(0, 180), cor(90, 270)],
      [str(90, 0), blk(), str(90, 0), cor(270, 90), crs(0), dst(0)],
      [cor(180, 0), str(0, 90), crs(0), cor(90, 270), str(90, 0), blk()],
      [dst(180), str(0, 90), crs(0), str(0, 90), cor(90, 270), emp()],
      [blk(), emp(), dst(90), blk(), emp(), blk()],
    ],
  },
];
