import type { PuzzleTemplateDefinition } from '../engine/types';
import { blk, cor, crs, dst, emp, src, str, tee } from '../levels/tileBuilders';

/**
 * Twelve handcrafted, verified square puzzle templates dedicated to Daily Challenges
 * and Friend Challenges (5x5 and 6x6 grids across Normal -> Expert difficulty).
 *
 * Each template has a stable ID and numeric index so deterministic daily & friend seeds
 * reproduce identical puzzles reliably across versions and devices.
 */
export const PUZZLE_TEMPLATES: readonly PuzzleTemplateDefinition[] = [
  // Template 01 (5x5, Normal): Single winding desert channel with blocked courtyard
  {
    id: 'tpl_01',
    numericIndex: 1,
    titleFa: 'قنات سحرگاه',
    introFa: 'جریان آب صبحگاهی را از کنار دیوارهای خشتی به حوضچه برسانید.',
    difficulty: 'normal',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 0 },
    destination: { row: 4, col: 4 },
    destinations: [{ row: 4, col: 4 }],
    parTimeSec: 55,
    grid: [
      [src(0), str(0, 90), cor(0, 180), emp(), emp()],
      [emp(), blk(), str(90, 0), emp(), emp()],
      [emp(), cor(180, 90), cor(90, 270), emp(), emp()],
      [emp(), str(90, 0), blk(), emp(), emp()],
      [emp(), cor(270, 0), str(0, 90), str(0, 90), dst(0)],
    ],
  },

  // Template 02 (5x5, Normal): Dual-branch oasis split with two destinations
  {
    id: 'tpl_02',
    numericIndex: 2,
    titleFa: 'انشعاب نخلستان',
    introFa: 'آب سرچشمه را با یک سه‌راهی میان دو نخلستان کویری تقسیم کنید.',
    difficulty: 'normal',
    rows: 5,
    cols: 5,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 4, col: 4 },
    ],
    parTimeSec: 60,
    grid: [
      [emp(), emp(), cor(0, 90), str(0, 90), dst(0)],
      [emp(), blk(), str(90, 0), blk(), emp()],
      [src(0), str(0, 90), tee(0, 270), emp(), emp()],
      [emp(), blk(), str(90, 0), blk(), emp()],
      [emp(), emp(), cor(90, 0), str(0, 90), dst(0)],
    ],
  },

  // Template 03 (5x5, Medium): Serpentine cistern loop avoiding sandstone ruins
  {
    id: 'tpl_03',
    numericIndex: 3,
    titleFa: 'چشمه خورشید',
    introFa: 'مسیر پرپیچ‌وخم آب را از میان بقایای آب‌انبار قدیمی بازسازی کنید.',
    difficulty: 'medium',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 2 },
    destination: { row: 4, col: 2 },
    destinations: [{ row: 4, col: 2 }],
    parTimeSec: 65,
    grid: [
      [cor(0, 90), str(0, 90), src(180), emp(), emp()],
      [str(90, 0), blk(), emp(), emp(), emp()],
      [cor(90, 0), str(0, 90), str(0, 90), str(0, 90), cor(0, 180)],
      [emp(), emp(), blk(), emp(), str(90, 0)],
      [emp(), emp(), dst(180), str(0, 90), cor(90, 270)],
    ],
  },

  // Template 04 (5x5, Medium): Symmetrical twin-garden cross-junction
  {
    id: 'tpl_04',
    numericIndex: 4,
    titleFa: 'چهارراه فیروزه',
    introFa: 'از تقاطع مرکزی قنات برای آبرسانی هم‌زمان به سه حوضچه استفاده کنید.',
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
    parTimeSec: 65,
    grid: [
      [emp(), blk(), dst(270), blk(), emp()],
      [emp(), emp(), str(90, 0), emp(), emp()],
      [src(0), str(0, 90), crs(0), str(0, 90), dst(0)],
      [emp(), emp(), str(90, 0), emp(), emp()],
      [emp(), blk(), dst(90), blk(), emp()],
    ],
  },

  // Template 05 (5x5, Medium): Dual-garden stepped irrigation channels
  {
    id: 'tpl_05',
    numericIndex: 5,
    titleFa: 'جویبار ماهتاب',
    introFa: 'شاخه‌های پلکانی قنات را بدون نشت به دو باغ پایینی هدایت کنید.',
    difficulty: 'medium',
    rows: 5,
    cols: 5,
    source: { row: 0, col: 0 },
    destination: { row: 2, col: 4 },
    destinations: [
      { row: 2, col: 4 },
      { row: 4, col: 2 },
    ],
    parTimeSec: 70,
    grid: [
      [src(0), str(0, 90), cor(0, 180), emp(), emp()],
      [blk(), emp(), str(90, 0), blk(), emp()],
      [emp(), emp(), tee(0, 90), str(0, 90), dst(0)],
      [emp(), blk(), str(90, 0), emp(), emp()],
      [emp(), emp(), dst(90), emp(), emp()],
    ],
  },

  // Template 06 (5x5, Challenging): Twin-tee irrigated desert courtyard
  {
    id: 'tpl_06',
    numericIndex: 6,
    titleFa: 'شبکه کهن',
    introFa: 'دو سه‌راهی اصلی را طوری تنظیم کنید که هیچ دهانه‌ای باز نماند.',
    difficulty: 'challenging',
    rows: 5,
    cols: 5,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 3 },
    destinations: [
      { row: 0, col: 3 },
      { row: 2, col: 4 },
      { row: 4, col: 3 },
    ],
    parTimeSec: 75,
    grid: [
      [emp(), cor(0, 90), str(0, 90), dst(0), emp()],
      [emp(), str(90, 0), blk(), emp(), emp()],
      [src(0), tee(180, 0), tee(90, 180), str(0, 90), dst(0)],
      [emp(), blk(), str(90, 0), blk(), emp()],
      [emp(), emp(), cor(90, 0), dst(0), emp()],
    ],
  },

  // Template 07 (6x6, Challenging): Grand U-turn qanat around fortress center
  {
    id: 'tpl_07',
    numericIndex: 7,
    titleFa: 'حصار کاروانسرا',
    introFa: 'آب را پیرامون دیوارهای کاروانسرا بچرخانید و به حوضخانه مرکزی برسانید.',
    difficulty: 'challenging',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 5, col: 5 },
    destinations: [{ row: 5, col: 5 }],
    parTimeSec: 85,
    grid: [
      [src(0), str(0, 90), str(0, 90), str(0, 90), cor(0, 180), emp()],
      [blk(), emp(), blk(), emp(), str(90, 0), emp()],
      [cor(0, 90), str(0, 90), str(0, 90), str(0, 90), cor(90, 270), emp()],
      [str(90, 0), blk(), emp(), blk(), emp(), emp()],
      [cor(90, 0), str(0, 90), cor(0, 180), emp(), emp(), emp()],
      [emp(), emp(), cor(90, 0), str(0, 90), str(0, 90), dst(0)],
    ],
  },

  // Template 08 (6x6, Challenging): Triple-oasis mountain aqueduct
  {
    id: 'tpl_08',
    numericIndex: 8,
    titleFa: 'کاروان آب',
    introFa: 'از آبراه کوهستانی سه آبادی پیرامون کویر را هم‌زمان سیراب کنید.',
    difficulty: 'challenging',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 2 },
    destination: { row: 2, col: 0 },
    destinations: [
      { row: 2, col: 0 },
      { row: 2, col: 5 },
      { row: 5, col: 2 },
    ],
    parTimeSec: 90,
    grid: [
      [emp(), blk(), src(90), blk(), emp(), emp()],
      [emp(), emp(), str(90, 0), emp(), emp(), emp()],
      [dst(180), str(0, 90), crs(0), str(0, 90), str(0, 90), dst(0)],
      [emp(), blk(), str(90, 0), blk(), emp(), emp()],
      [emp(), emp(), str(90, 0), emp(), emp(), emp()],
      [emp(), emp(), dst(90), emp(), emp(), emp()],
    ],
  },

  // Template 09 (6x6, Hard): Four-branch Persian garden fountains
  {
    id: 'tpl_09',
    numericIndex: 9,
    titleFa: 'باغ ستارگان',
    introFa: 'شبکه متقارن باغ ایرانی را برای روشن کردن هر سه فواره کامل کنید.',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 3, col: 0 },
    destination: { row: 0, col: 5 },
    destinations: [
      { row: 0, col: 5 },
      { row: 3, col: 5 },
      { row: 5, col: 5 },
    ],
    parTimeSec: 95,
    grid: [
      [emp(), emp(), cor(0, 90), str(0, 90), str(0, 90), dst(0)],
      [emp(), blk(), str(90, 0), blk(), emp(), emp()],
      [emp(), emp(), str(90, 0), emp(), emp(), emp()],
      [src(0), str(0, 90), crs(0), str(0, 90), str(0, 90), dst(0)],
      [emp(), blk(), str(90, 0), blk(), emp(), emp()],
      [emp(), emp(), cor(90, 0), str(0, 90), str(0, 90), dst(0)],
    ],
  },

  // Template 10 (6x6, Hard): Winding multi-branch manor channels
  {
    id: 'tpl_10',
    numericIndex: 10,
    titleFa: 'آیینه آب',
    introFa: 'مسیرهای پیچیده عمارت تاریخی را با دقت به دو حوض فیروزه‌ای وصل کنید.',
    difficulty: 'hard',
    rows: 6,
    cols: 6,
    source: { row: 0, col: 0 },
    destination: { row: 1, col: 5 },
    destinations: [
      { row: 1, col: 5 },
      { row: 5, col: 4 },
    ],
    parTimeSec: 95,
    grid: [
      [src(0), str(0, 90), cor(0, 180), emp(), emp(), emp()],
      [blk(), emp(), tee(0, 90), str(0, 90), str(0, 90), dst(0)],
      [emp(), emp(), str(90, 0), blk(), emp(), emp()],
      [emp(), cor(0, 90), cor(90, 270), emp(), blk(), emp()],
      [emp(), str(90, 0), blk(), emp(), emp(), emp()],
      [emp(), cor(90, 0), str(0, 90), str(0, 90), dst(0), emp()],
    ],
  },

  // Template 11 (6x6, Expert): Interlocking double-tee labyrinth with 3 reservoirs
  {
    id: 'tpl_11',
    numericIndex: 11,
    titleFa: 'حوض نگین',
    introFa: 'سه‌راهی‌های تو در تو را هماهنگ کنید تا آب بدون یک قطره هدررفت جریان یابد.',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 4 },
    destinations: [
      { row: 0, col: 4 },
      { row: 3, col: 1 },
      { row: 3, col: 5 },
    ],
    parTimeSec: 105,
    grid: [
      [emp(), cor(0, 90), str(0, 90), str(0, 90), dst(0), emp()],
      [emp(), str(90, 0), blk(), emp(), blk(), emp()],
      [src(0), tee(180, 0), str(0, 90), cor(0, 180), emp(), emp()],
      [emp(), dst(270), blk(), tee(0, 90), str(0, 90), dst(0)],
      [emp(), str(90, 0), blk(), str(90, 0), emp(), emp()],
      [emp(), cor(90, 0), str(0, 90), cor(90, 270), emp(), emp()],
    ],
  },

  // Template 12 (6x6, Expert): Grand Royal Qanat with 4 destinations
  {
    id: 'tpl_12',
    numericIndex: 12,
    titleFa: 'تپش زمین',
    introFa: 'چهار مظهر قنات را از یک سرچشمه مشترک با نهایت دقت مهندسی زنده کنید.',
    difficulty: 'expert',
    rows: 6,
    cols: 6,
    source: { row: 2, col: 0 },
    destination: { row: 0, col: 2 },
    destinations: [
      { row: 0, col: 2 },
      { row: 0, col: 5 },
      { row: 5, col: 2 },
      { row: 5, col: 5 },
    ],
    parTimeSec: 110,
    grid: [
      [emp(), emp(), dst(270), emp(), cor(0, 90), dst(0)],
      [emp(), blk(), str(90, 0), blk(), str(90, 0), emp()],
      [src(0), str(0, 90), crs(0), str(0, 90), tee(0, 270), emp()],
      [emp(), blk(), str(90, 0), blk(), str(90, 0), emp()],
      [emp(), emp(), str(90, 0), emp(), str(90, 0), emp()],
      [emp(), emp(), dst(90), emp(), cor(90, 0), dst(0)],
    ],
  },
];

export function getTemplateById(id: string): PuzzleTemplateDefinition | undefined {
  return PUZZLE_TEMPLATES.find((t) => t.id === id);
}

export function getTemplateByNumericIndex(numericIndex: number): PuzzleTemplateDefinition | undefined {
  return PUZZLE_TEMPLATES.find((t) => t.numericIndex === numericIndex);
}
