import type { LevelDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from './tileBuilders';

/**
 * Region 3: Kashan — The Persian Garden (Levels 17–24)
 * Levels 17–20: Hard (6x6)
 * Levels 21–24: Expert (6x6)
 */
export const KASHAN_LEVELS: readonly LevelDefinition[] = [
  // LEVEL 17: 6x6 Hard — Turquoise Pool
  {
    id: 17,
    regionId: 'kashan',
    destinationId: 'kashan',
    titleFa: 'حوض فیروزه',
    subtitleFa: 'دو آبشار موازی با گذرگاه میانی در صحن عمارت',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 2 },
    destination: { row: 5, col: 1 },
    destinations: [
      { row: 5, col: 1 },
      { row: 5, col: 4 },
    ],
    expectedMinMoves: 25,
    parTimeSec: 145,
    grid: [
      [blk(), emp(), src(90), emp(), emp(), blk()],
      [emp(), cor(270, 90), tee(180, 0), str(0, 90), cor(90, 180), emp()],
      [blk(), tee(270, 90), cor(0, 180), cor(0, 90), tee(90, 270), blk()],
      [emp(), str(90, 0), cor(180, 0), cor(90, 270), str(90, 0), emp()],
      [emp(), tee(270, 90), str(0, 90), str(0, 90), tee(90, 270), emp()],
      [blk(), dst(90), emp(), emp(), dst(90), blk()],
    ],
  },

  // LEVEL 18: 6x6 Hard — Ameri Mansion
  {
    id: 18,
    regionId: 'kashan',
    destinationId: 'kashan',
    titleFa: 'سرای عامری',
    subtitleFa: 'دو حیاط تاریخی متصل با دو تقاطع چهارراهی',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 3, col: 5 },
    ],
    expectedMinMoves: 19,
    parTimeSec: 135,
    grid: [
      [blk(), blk(), emp(), emp(), cor(270, 90), dst(0)],
      [blk(), emp(), cor(270, 90), str(0, 90), tee(90, 270), emp()],
      [emp(), emp(), str(90, 0), blk(), str(90, 0), emp()],
      [cor(270, 90), str(0, 90), crs(0), str(0, 90), crs(0), dst(0)],
      [str(90, 0), emp(), cor(180, 0), str(0, 90), cor(90, 270), emp()],
      [src(270), emp(), emp(), blk(), emp(), blk()],
    ],
  },

  // LEVEL 19: 6x6 Hard — Soleymaniyeh Fountain
  {
    id: 19,
    regionId: 'kashan',
    destinationId: 'abuzeydabad',
    titleFa: 'فواره سلیمانیه',
    subtitleFa: 'آبرسانی چهارفصلی به سه فواره در چهارگوشه باغ',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 5 },
    ],
    expectedMinMoves: 27,
    parTimeSec: 155,
    grid: [
      [src(90), emp(), blk(), emp(), emp(), dst(270)],
      [cor(180, 0), str(0, 90), tee(0, 180), str(0, 90), tee(0, 180), cor(90, 270)],
      [blk(), emp(), str(90, 0), blk(), str(90, 0), emp()],
      [blk(), emp(), tee(270, 90), str(0, 90), tee(90, 270), blk()],
      [emp(), cor(270, 90), cor(90, 270), emp(), cor(180, 0), cor(0, 180)],
      [dst(180), cor(90, 270), emp(), blk(), emp(), dst(90)],
    ],
  },

  // LEVEL 20: 6x6 Hard — Chaharbagh of Fin
  {
    id: 20,
    regionId: 'kashan',
    destinationId: 'abuzeydabad',
    titleFa: 'چهارباغ فین',
    subtitleFa: 'هندسه اصیل چهارباغ ایرانی با دو محور متقاطع',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 3 },
    destinations: [
      { row: 0, col: 3 },
      { row: 5, col: 3 },
    ],
    expectedMinMoves: 19,
    parTimeSec: 140,
    grid: [
      [blk(), emp(), emp(), dst(270), emp(), blk()],
      [emp(), cor(270, 90), str(0, 90), crs(0), cor(0, 180), emp()],
      [src(0), tee(90, 270), blk(), str(90, 0), str(90, 0), blk()],
      [emp(), str(90, 0), cor(270, 90), crs(0), cor(90, 270), emp()],
      [emp(), cor(180, 0), cor(90, 270), str(90, 0), emp(), emp()],
      [blk(), emp(), emp(), dst(90), emp(), blk()],
    ],
  },

  // LEVEL 21: 6x6 Expert — Hall of Mirrors
  {
    id: 21,
    regionId: 'kashan',
    destinationId: 'niasar',
    titleFa: 'تالار آینه',
    subtitleFa: 'تقارن آینه‌ای آبراه‌ها با سه مظهر و دو چهارراهی',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 3 },
    destination: { row: 2, col: 0 },
    destinations: [
      { row: 2, col: 0 },
      { row: 2, col: 5 },
      { row: 5, col: 3 },
    ],
    expectedMinMoves: 23,
    parTimeSec: 155,
    grid: [
      [blk(), emp(), emp(), src(90), emp(), blk()],
      [blk(), emp(), cor(270, 90), tee(180, 0), cor(0, 180), emp()],
      [dst(180), str(0, 90), tee(180, 0), tee(0, 180), tee(180, 0), dst(0)],
      [blk(), cor(270, 90), str(0, 90), crs(0), cor(0, 180), blk()],
      [emp(), cor(180, 0), str(0, 90), crs(0), cor(90, 270), emp()],
      [blk(), emp(), emp(), dst(90), emp(), blk()],
    ],
  },

  // LEVEL 22: 6x6 Expert — Shatargalu Siphon
  {
    id: 22,
    regionId: 'kashan',
    destinationId: 'niasar',
    titleFa: 'شترگلو',
    subtitleFa: 'مهندسی صعود فشار آب در گذرگاه‌های تودرتو',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 5, col: 0 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
    ],
    expectedMinMoves: 27,
    parTimeSec: 165,
    grid: [
      [dst(180), str(0, 90), cor(0, 180), emp(), blk(), dst(270)],
      [emp(), cor(270, 90), tee(90, 270), emp(), blk(), str(90, 0)],
      [blk(), str(90, 0), str(90, 0), emp(), cor(270, 90), cor(90, 270)],
      [emp(), cor(180, 0), crs(0), str(0, 90), tee(90, 270), emp()],
      [blk(), emp(), tee(270, 90), str(0, 90), cor(90, 270), emp()],
      [src(0), str(0, 90), cor(90, 270), emp(), blk(), blk()],
    ],
  },

  // LEVEL 23: 6x6 Expert — Tabatabaei House
  {
    id: 23,
    regionId: 'kashan',
    destinationId: 'qamsar',
    titleFa: 'خانه طباطبایی',
    subtitleFa: 'شبکه پیچیده حوضخانه‌ها و انشعاب‌های چندگانه',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 5, col: 0 },
      { row: 5, col: 5 },
    ],
    expectedMinMoves: 28,
    parTimeSec: 170,
    grid: [
      [src(0), cor(0, 180), emp(), blk(), cor(270, 90), dst(0)],
      [emp(), tee(270, 90), str(0, 90), tee(0, 180), cor(90, 270), emp()],
      [blk(), str(90, 0), blk(), str(90, 0), emp(), blk()],
      [cor(270, 90), crs(0), str(0, 90), crs(0), cor(0, 180), emp()],
      [str(90, 0), cor(180, 0), str(0, 90), tee(180, 0), tee(90, 270), emp()],
      [dst(90), emp(), blk(), emp(), cor(180, 0), dst(0)],
    ],
  },

  // LEVEL 24: 6x6 Expert — Fin Garden of Kashan (Grand Campaign Finale!)
  {
    id: 24,
    regionId: 'kashan',
    destinationId: 'qamsar',
    titleFa: 'باغ فین کاشان',
    subtitleFa: 'شاهکار پایانی؛ احیای شبکه کامل فواره‌های باغ ایرانی',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 2 },
    destination: { row: 0, col: 0 },
    destinations: [
      { row: 0, col: 0 },
      { row: 0, col: 5 },
      { row: 5, col: 3 },
    ],
    expectedMinMoves: 23,
    parTimeSec: 180,
    grid: [
      [dst(180), cor(0, 180), src(90), blk(), blk(), dst(270)],
      [emp(), tee(270, 90), crs(0), str(0, 90), tee(0, 180), cor(90, 270)],
      [blk(), str(90, 0), tee(270, 90), cor(0, 180), str(90, 0), emp()],
      [emp(), cor(180, 0), crs(0), crs(0), tee(90, 270), blk()],
      [blk(), emp(), cor(180, 0), crs(0), cor(90, 270), emp()],
      [blk(), emp(), emp(), dst(90), emp(), blk()],
    ],
  },
];
