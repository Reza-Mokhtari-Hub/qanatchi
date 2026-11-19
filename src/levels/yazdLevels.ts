import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Region 1: Yazd — The Ancient Qanats (Levels 1–8)
 * Levels 1–6 preserved directly from Phase 1 with verified grids & solutions.
 * Levels 7–8 handcrafted to complete the Yazd arc.
 */
export const YAZD_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 1: 4x4 Easy
  {
    id: 1,
    regionId: 'yazd',
    destinationId: 'yazd',
    titleFa: 'چشمه نخست',
    subtitleFa: 'اتصال مستقیم سرچشمه به مظهر قنات',
    difficulty: 'easy',
    rows: 4,
    cols: 4,
    source: { row: 0, col: 0 },
    destination: { row: 3, col: 3 },
    destinations: [{ row: 3, col: 3 }],
    expectedMinMoves: 6,
    parTimeSec: 35,
    grid: [
      [src(0), str(0, 90), cor(0, 180), emp()],
      [emp(), blk(), str(90, 0), emp()],
      [emp(), blk(), cor(270, 0), cor(90, 180)],
      [blk(), emp(), emp(), dst(90)],
    ],
  },

  // LEVEL 2: 4x4 Easy
  {
    id: 2,
    regionId: 'yazd',
    destinationId: 'yazd',
    titleFa: 'کوچه خشتی',
    subtitleFa: 'عبور آب از پیچ‌وخم سنگ‌های کویر',
    difficulty: 'easy',
    rows: 4,
    cols: 4,
    source: { row: 0, col: 0 },
    destination: { row: 3, col: 1 },
    destinations: [{ row: 3, col: 1 }],
    expectedMinMoves: 11,
    parTimeSec: 50,
    grid: [
      [src(90), blk(), cor(0, 90), cor(90, 180)],
      [cor(180, 0), str(0, 90), cor(90, 270), str(90, 0)],
      [blk(), blk(), cor(0, 90), cor(180, 270)],
      [emp(), dst(180), cor(180, 270), emp()],
    ],
  },

  // LEVEL 3: 5x5 Easy
  {
    id: 3,
    regionId: 'yazd',
    destinationId: 'meybod',
    titleFa: 'انشعاب باغ',
    subtitleFa: 'تقسیم جریان آب به دو باغستان با سه‌راهی',
    difficulty: 'easy',
    rows: 5,
    cols: 5,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 4, col: 4 },
    ],
    expectedMinMoves: 11,
    parTimeSec: 65,
    grid: [
      [emp(), emp(), cor(270, 90), str(0, 90), dst(0)],
      [emp(), blk(), str(90, 0), blk(), emp()],
      [src(0), str(0, 90), tee(90, 270), emp(), blk()],
      [emp(), blk(), cor(180, 0), cor(90, 180), emp()],
      [emp(), emp(), emp(), cor(270, 0), dst(0)],
    ],
  },

  // LEVEL 4: 5x5 Easy
  {
    id: 4,
    regionId: 'yazd',
    destinationId: 'meybod',
    titleFa: 'چهارسوی قنات',
    subtitleFa: 'تقاطع چهارراهی و چرخش بسته بدون نشت',
    difficulty: 'easy',
    rows: 5,
    cols: 5,
    source: { row: 2, col: 0 },
    destination: { row: 4, col: 4 },
    destinations: [{ row: 4, col: 4 }],
    expectedMinMoves: 15,
    parTimeSec: 80,
    grid: [
      [emp(), emp(), cor(270, 90), str(0, 90), cor(0, 180)],
      [emp(), blk(), str(90, 0), blk(), str(90, 0)],
      [src(0), str(0, 90), crs(0), str(0, 90), cor(90, 270)],
      [emp(), blk(), str(90, 0), blk(), emp()],
      [emp(), emp(), cor(180, 0), str(0, 90), dst(0)],
    ],
  },

  // LEVEL 5: 5x5 Normal
  {
    id: 5,
    regionId: 'yazd',
    destinationId: 'ardakan',
    titleFa: 'حصار کویر',
    subtitleFa: 'شبکه متقارن آب‌رسانی به دو آب‌انبار',
    difficulty: 'normal',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 2 },
    destination: { row: 2, col: 0 },
    destinations: [
      { row: 2, col: 0 },
      { row: 2, col: 4 },
    ],
    expectedMinMoves: 14,
    parTimeSec: 90,
    grid: [
      [emp(), blk(), src(90), blk(), emp()],
      [emp(), cor(270, 90), tee(180, 0), cor(90, 180), emp()],
      [dst(180), tee(90, 270), blk(), tee(270, 90), dst(0)],
      [emp(), cor(180, 0), str(0, 90), cor(90, 270), emp()],
      [cor(0, 0), emp(), blk(), emp(), cor(90, 90)],
    ],
  },

  // LEVEL 6: 5x5 Normal
  {
    id: 6,
    regionId: 'yazd',
    destinationId: 'ardakan',
    titleFa: 'قلب قنات',
    subtitleFa: 'مهندسی کامل قنات با تقاطع‌ها و شاخه‌های هم‌زمان',
    difficulty: 'normal',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 4, col: 0 },
    ],
    expectedMinMoves: 21,
    parTimeSec: 115,
    grid: [
      [src(0), cor(0, 180), blk(), cor(270, 90), dst(0)],
      [blk(), tee(270, 90), cor(90, 180), str(90, 0), emp()],
      [emp(), cor(180, 0), crs(0), cor(90, 270), blk()],
      [blk(), emp(), tee(270, 90), cor(0, 180), blk()],
      [dst(180), str(0, 90), tee(180, 0), cor(90, 270), emp()],
    ],
  },

  // LEVEL 7: 5x5 Normal — Windcatcher Cistern
  {
    id: 7,
    regionId: 'yazd',
    destinationId: 'taft',
    titleFa: 'آب‌انبار بادگیر',
    subtitleFa: 'هدایت جریان از کنار سنگ‌بستر مرکزی به دو آب‌انبار',
    difficulty: 'normal',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 4, col: 4 },
    ],
    expectedMinMoves: 17,
    parTimeSec: 95,
    grid: [
      [src(90), blk(), cor(0, 90), str(0, 90), dst(0)],
      [str(90, 0), cor(270, 90), cor(90, 270), emp(), blk()],
      [cor(180, 0), tee(90, 270), blk(), blk(), emp()],
      [emp(), cor(270, 0), str(0, 90), cor(0, 180), emp()],
      [emp(), blk(), emp(), cor(180, 0), dst(0)],
    ],
  },

  // LEVEL 8: 5x5 Normal — Ancient Caravanserai (Yazd Finale)
  {
    id: 8,
    regionId: 'yazd',
    destinationId: 'taft',
    titleFa: 'کاروانسرای کهن',
    subtitleFa: 'آخرین قنات یزد با صحن بسته و دو مظهر هم‌زمان',
    difficulty: 'normal',
    rows: 5,
    cols: 5,
    source: { row: 4, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 4, col: 4 },
    ],
    expectedMinMoves: 17,
    parTimeSec: 105,
    grid: [
      [blk(), emp(), dst(270), emp(), blk()],
      [emp(), cor(0, 90), tee(180, 0), cor(90, 180), emp()],
      [blk(), tee(270, 90), tee(0, 180), cor(180, 270), blk()],
      [cor(270, 90), cor(90, 270), cor(180, 0), cor(90, 180), emp()],
      [src(270), emp(), blk(), cor(270, 0), dst(0)],
    ],
  },
];
