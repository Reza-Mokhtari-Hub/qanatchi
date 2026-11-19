import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Region 2: Kerman — Gardens of the Desert (Levels 9–16)
 * Levels 9–12: Medium (5x5)
 * Levels 13–16: Challenging (5x5 and 6x6)
 */
export const KERMAN_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 9: 5x5 Medium — Mountain Spring
  {
    id: 9,
    regionId: 'kerman',
    destinationId: 'kerman',
    titleFa: 'چشمه کوهستان',
    subtitleFa: 'تقسیم آب کوهسار در دو جویبار پلکانی',
    difficulty: 'medium',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 2 },
    destination: { row: 4, col: 0 },
    destinations: [
      { row: 4, col: 0 },
      { row: 4, col: 4 },
    ],
    expectedMinMoves: 19,
    parTimeSec: 100,
    grid: [
      [blk(), emp(), src(90), emp(), blk()],
      [cor(270, 90), str(0, 90), tee(180, 0), cor(0, 180), emp()],
      [cor(180, 0), cor(90, 180), blk(), cor(270, 0), cor(90, 180)],
      [blk(), str(90, 0), blk(), cor(0, 90), cor(180, 270)],
      [dst(180), cor(90, 270), emp(), cor(180, 0), dst(0)],
    ],
  },

  // LEVEL 10: 5x5 Medium — Bam Palm Grove (3 Destinations!)
  {
    id: 10,
    regionId: 'kerman',
    destinationId: 'kerman',
    titleFa: 'نخلستان بم',
    subtitleFa: 'آبیاری هم‌زمان سه نخلستان از تقاطع مرکزی',
    difficulty: 'medium',
    rows: 5,
    cols: 5,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 2, col: 4 },
      { row: 4, col: 2 },
    ],
    expectedMinMoves: 15,
    parTimeSec: 95,
    grid: [
      [blk(), cor(270, 90), dst(0), blk(), emp()],
      [emp(), cor(180, 0), cor(0, 180), cor(0, 90), cor(90, 180)],
      [src(0), str(0, 90), crs(0), cor(90, 270), dst(90)],
      [emp(), blk(), cor(180, 0), cor(90, 180), emp()],
      [blk(), emp(), dst(180), cor(180, 270), blk()],
    ],
  },

  // LEVEL 11: 5x5 Medium — Shazdeh Garden
  {
    id: 11,
    regionId: 'kerman',
    destinationId: 'mahan',
    titleFa: 'باغ شاهزاده',
    subtitleFa: 'چرخش آب پیرامون حوضچه مرکزی باغ ماهان',
    difficulty: 'medium',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 0 },
    destination: { row: 2, col: 4 },
    destinations: [
      { row: 2, col: 4 },
      { row: 4, col: 0 },
    ],
    expectedMinMoves: 18,
    parTimeSec: 105,
    grid: [
      [src(0), str(0, 90), cor(90, 180), emp(), blk()],
      [blk(), cor(270, 90), tee(180, 0), cor(0, 180), emp()],
      [emp(), str(90, 0), blk(), tee(270, 90), dst(0)],
      [emp(), tee(270, 90), str(0, 90), cor(90, 270), emp()],
      [dst(180), cor(90, 270), emp(), blk(), blk()],
    ],
  },

  // LEVEL 12: 5x5 Medium — Mahan Stream
  {
    id: 12,
    regionId: 'kerman',
    destinationId: 'mahan',
    titleFa: 'جویبار ماهان',
    subtitleFa: 'دو حلقه متقارن در کنار تقاطع مرکزی',
    difficulty: 'medium',
    rows: 5,
    cols: 5,
    source: { row: 4, col: 2 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 4 },
    ],
    expectedMinMoves: 14,
    parTimeSec: 95,
    grid: [
      [dst(180), cor(90, 180), blk(), cor(270, 90), dst(0)],
      [emp(), tee(270, 90), tee(0, 180), tee(90, 270), emp()],
      [emp(), cor(180, 0), crs(0), cor(90, 270), emp()],
      [blk(), emp(), str(90, 0), emp(), blk()],
      [blk(), emp(), src(270), emp(), blk()],
    ],
  },

  // LEVEL 13: 5x5 Challenging — Jupar Qanat
  {
    id: 13,
    regionId: 'kerman',
    destinationId: 'bam',
    titleFa: 'قنات جوپار',
    subtitleFa: 'آبرسانی به سه دهستان با یک حلقه فشار و سه مظهر',
    difficulty: 'challenging',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 4 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 4, col: 0 },
      { row: 4, col: 4 },
    ],
    expectedMinMoves: 21,
    parTimeSec: 120,
    grid: [
      [dst(180), str(0, 90), tee(0, 180), str(0, 90), src(180)],
      [blk(), emp(), str(90, 0), emp(), blk()],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), cor(0, 180)],
      [tee(270, 90), cor(0, 180), str(90, 0), blk(), str(90, 0)],
      [dst(90), cor(180, 0), cor(90, 270), blk(), dst(90)],
    ],
  },

  // LEVEL 14: 5x5 Challenging — Rayen Citadel
  {
    id: 14,
    regionId: 'kerman',
    destinationId: 'bam',
    titleFa: 'قلعه راین',
    subtitleFa: 'خندق دوقلوی آب‌رسانی از سرچشمه میانی ارگ',
    difficulty: 'challenging',
    rows: 5,
    cols: 5,
    source: { row: 2, col: 2 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 4, col: 4 },
    ],
    expectedMinMoves: 19,
    parTimeSec: 115,
    grid: [
      [dst(180), cor(90, 180), emp(), blk(), blk()],
      [emp(), tee(270, 90), str(0, 90), cor(0, 180), emp()],
      [blk(), str(90, 0), src(0), tee(90, 270), blk()],
      [emp(), tee(270, 90), str(0, 90), crs(0), cor(0, 180)],
      [blk(), cor(180, 0), str(0, 90), cor(90, 270), dst(90)],
    ],
  },

  // LEVEL 15: 6x6 Challenging — Sirjan Gardens
  {
    id: 15,
    regionId: 'kerman',
    destinationId: 'rayen',
    titleFa: 'باغ‌های سیرجان',
    subtitleFa: 'نخستین شبکه گسترده ۶×۶ با حلقه آب‌انبار غربی',
    difficulty: 'challenging',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 2, col: 5 },
    destinations: [
      { row: 2, col: 5 },
      { row: 5, col: 5 },
    ],
    expectedMinMoves: 23,
    parTimeSec: 130,
    grid: [
      [src(0), str(0, 90), cor(90, 180), emp(), blk(), emp()],
      [blk(), emp(), tee(270, 90), str(0, 90), cor(0, 180), emp()],
      [blk(), emp(), str(90, 0), blk(), tee(270, 90), dst(0)],
      [emp(), cor(270, 90), crs(0), str(0, 90), tee(90, 270), emp()],
      [emp(), cor(180, 0), cor(90, 270), emp(), cor(180, 0), cor(0, 180)],
      [blk(), emp(), emp(), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 16: 6x6 Challenging — Kerman Water Caravan (Kerman Finale)
  {
    id: 16,
    regionId: 'kerman',
    destinationId: 'rayen',
    titleFa: 'کاروان آب کرمان',
    subtitleFa: 'آزمون پایانی کرمان برای گشودن دروازه کاشان',
    difficulty: 'challenging',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 5, col: 2 },
      { row: 5, col: 5 },
    ],
    expectedMinMoves: 23,
    parTimeSec: 140,
    grid: [
      [blk(), emp(), blk(), emp(), cor(270, 90), dst(0)],
      [emp(), cor(270, 90), str(0, 90), tee(0, 180), cor(90, 270), emp()],
      [src(0), tee(90, 270), blk(), str(90, 0), emp(), blk()],
      [emp(), cor(180, 0), str(0, 90), crs(0), cor(0, 180), emp()],
      [blk(), emp(), cor(0, 90), cor(90, 270), str(90, 0), blk()],
      [blk(), emp(), dst(90), emp(), cor(180, 0), dst(0)],
    ],
  },
];
