import type { Difficulty, RegionDefinition, RegionId, StoryMoment } from '../engine/types';

export const DIFFICULTY_LABELS_FA: Record<Difficulty, string> = {
  easy: 'آسان',
  normal: 'معمولی',
  medium: 'متوسط',
  challenging: 'چالش‌برانگیز',
  hard: 'سخت',
  expert: 'استاد',
};

export const REGIONS: readonly RegionDefinition[] = [
  {
    id: 'yazd',
    order: 1,
    nameFa: 'یزد',
    titleFa: 'مسیر یزد — قنات‌های کهن',
    subtitleFa: 'یزد، میبد، اردکان و تفت · بادگیرها و آب‌انبارهای کویر',
    storyFa:
      'سفر شما در دل کویر یزد آغاز می‌شود؛ از بادگیرهای یزد تا میبد، اردکان و باغ‌شهر تفت. با بازسازی مسیرهای زیرزمینی، دوباره نبض آب را به آبادی‌های خشتی بازگردانید.',
    unlockRequirementFa: 'مسیر آغازین سفر',
    completionStoryFa:
      'آب زلال دوباره از یزد تا تفت جاری شد و آب‌انبارهای کویر جان تازه گرفتند. اکنون راه کاروان به سوی مسیر کرمان گشوده است.',
    destinationIds: ['yazd', 'meybod', 'ardakan', 'taft'],
    levelIds: [1, 2, 3, 4, 5, 6, 7, 8],
    requiredCompletedLevelId: null,
    theme: {
      accentHex: '#D99B26',
      secondaryHex: '#19A7B8',
      surfaceClass: 'bg-[#211A13]',
      borderClass: 'border-[#7C5E3B]',
    },
  },
  {
    id: 'kerman',
    order: 2,
    nameFa: 'کرمان',
    titleFa: 'مسیر کرمان — باغ‌های کویر',
    subtitleFa: 'کرمان، ماهان، بم و راین · نخلستان‌ها و باغ‌های پلکانی',
    storyFa:
      'پس از احیای یزد، به مسیر کرمان می‌رسید؛ شبکه‌ای پیچیده‌تر از قنات‌های دامنه‌ای که آب را میان کرمان، ماهان، نخلستان‌های بم و دامنه‌های راین تقسیم می‌کند.',
    unlockRequirementFa: 'با تکمیل مرحله ۸ (تفت) باز می‌شود',
    completionStoryFa:
      'باغ‌های ماهان، نخلستان‌های بم و دامنه‌های راین سیراب شدند و زمزمه آب در مسیر کرمان پیچید. اکنون دروازه کاشان و پیرامون آن پیش روی شماست.',
    destinationIds: ['kerman', 'mahan', 'bam', 'rayen'],
    levelIds: [9, 10, 11, 12, 13, 14, 15, 16],
    requiredCompletedLevelId: 8,
    theme: {
      accentHex: '#2AB38B',
      secondaryHex: '#D99B26',
      surfaceClass: 'bg-[#17211E]',
      borderClass: 'border-[#336E5B]',
    },
  },
  {
    id: 'kashan',
    order: 3,
    nameFa: 'کاشان و پیرامون',
    titleFa: 'مسیر کاشان و پیرامون — باغ‌ها و واحه‌های کویر',
    subtitleFa: 'کاشان، ابوزیدآباد، نیاسر و قمصر · از حوض‌های فیروزه‌ای تا واحه رمل‌ها',
    storyFa:
      'در سومین مسیر سفر، از عمارت‌های تاریخی کاشان به واحه کویری ابوزیدآباد، چشمه‌های نیاسر و گلستان‌های قمصر می‌روید تا شبکه‌های دقیق آب‌رسانی را احیا کنید.',
    unlockRequirementFa: 'با تکمیل مرحله ۱۶ (راین) باز می‌شود',
    completionStoryFa:
      'از حوض‌های کاشان و واحه ابوزیدآباد تا نیاسر و قمصر، آب دوباره جاری شد. اکنون کاروان به سوی کوهپایه‌های مسیر زنجان حرکت می‌کند.',
    destinationIds: ['kashan', 'abuzeydabad', 'niasar', 'qamsar'],
    levelIds: [17, 18, 19, 20, 21, 22, 23, 24],
    requiredCompletedLevelId: 16,
    theme: {
      accentHex: '#1FAEC0',
      secondaryHex: '#E6BA5E',
      surfaceClass: 'bg-[#142026]',
      borderClass: 'border-[#2B7080]',
    },
  },
  {
    id: 'zanjan',
    order: 4,
    nameFa: 'زنجان',
    titleFa: 'مسیر زنجان — دره‌ها و کوهپایه‌های شمال‌غرب',
    subtitleFa: 'زنجان، ایجرود، سلطانیه و ماهنشان · دشت‌های مرتفع و تپه‌های رنگین',
    storyFa:
      'چهارمین مسیر سفر شما را به چشم‌اندازهای کوهستانی و دشت‌های مرتفع زنجان، دره‌های ایجرود، پهنه‌ی سلطانیه و تپه‌های رنگین ماهنشان می‌برد؛ معماهایی داستانی با الهام از جغرافیای شمال‌غرب ایران.',
    unlockRequirementFa: 'با تکمیل مرحله ۲۴ (قمصر) باز می‌شود',
    completionStoryFa:
      'تمام گذرگاه‌های آب در دشت زنجان، ایجرود، سلطانیه و ماهنشان با موفقیت متصل شدند. اکنون پنجمین مسیر سفر، مسیر فرهنگی خراسان، در برابر شما گشوده شده است.',
    destinationIds: ['zanjan', 'ijrud', 'soltaniyeh', 'mahneshan'],
    levelIds: [25, 26, 27, 28, 29, 30, 31, 32],
    requiredCompletedLevelId: 24,
    theme: {
      accentHex: '#4BB39A',
      secondaryHex: '#5BA3C9',
      surfaceClass: 'bg-[#142022]',
      borderClass: 'border-[#336D73]',
    },
  },
  {
    id: 'khorasan',
    order: 5,
    nameFa: 'خراسان',
    titleFa: 'مسیر خراسان — سرزمین قنات‌های بزرگ شرق',
    subtitleFa: 'گناباد، فردوس، طبس و بیرجند · مسیر فرهنگی و جغرافیایی شرق ایران',
    storyFa:
      'پنجمین مسیر فرهنگی و جغرافیایی سفر در پهنه‌ی شرق ایران؛ از چاه‌میله‌های ژرف گناباد و باغستان‌های فردوس تا واحه طبس و باغ‌های کوهپایه‌ای بیرجند.',
    unlockRequirementFa: 'با تکمیل مرحله ۳۲ (ماهنشان) باز می‌شود',
    completionStoryFa:
      'از قنات کهن قصبه گناباد تا فردوس، طبس و بیرجند، سرزمین قنات‌های شرق دوباره جان گرفت. اکنون کاروان آب به سوی «فلات اصفهان» رهسپار می‌شود.',
    destinationIds: ['gonabad', 'ferdows', 'tabas', 'birjand'],
    levelIds: [33, 34, 35, 36, 37, 38, 39, 40],
    requiredCompletedLevelId: 32,
    theme: {
      accentHex: '#B684E6',
      secondaryHex: '#E09D3E',
      surfaceClass: 'bg-[#1C1624]',
      borderClass: 'border-[#5B4578]',
    },
  },
  {
    id: 'isfahan',
    order: 6,
    nameFa: 'فلات اصفهان',
    titleFa: 'مسیر فلات اصفهان — پل‌ها و قنات‌های فلات مرکزی',
    subtitleFa: 'اصفهان، اردستان، نائین و نطنز · از زاینده‌رود تا دامنه‌های کرکس',
    storyFa:
      'ششمین مسیر سفر از پل‌ها و باغ‌های اصفهان آغاز می‌شود، از اردستان و آب‌انبارهای خشتی نائین می‌گذرد و به باغستان‌های کوهپایه‌ای نطنز می‌رسد.',
    unlockRequirementFa: 'با تکمیل مرحله ۴۰ (بیرجند) باز می‌شود',
    completionStoryFa:
      'آبراه‌های فلات مرکزی از اصفهان و اردستان تا نائین و نطنز دوباره جریان یافتند. اکنون مسیر سرسبز «فارس» پیش روی شماست.',
    destinationIds: ['isfahan', 'ardestan', 'nain', 'natanz'],
    levelIds: [41, 42, 43, 44, 45, 46, 47, 48],
    requiredCompletedLevelId: 40,
    theme: {
      accentHex: '#25B8D9',
      secondaryHex: '#E8B84E',
      surfaceClass: 'bg-[#122029]',
      borderClass: 'border-[#2D6E85]',
    },
  },
  {
    id: 'fars',
    order: 7,
    nameFa: 'فارس',
    titleFa: 'مسیر فارس — باغ‌شهرها و دشت‌های زاگرس جنوبی',
    subtitleFa: 'شیراز، نی‌ریز، استهبان و آباده · از باغ‌های شیراز تا فلات آباده',
    storyFa:
      'در هفتمین مسیر سفر، آب را از باغ‌های شیراز و باغستان‌های نی‌ریز تا دامنه‌های پلکانی استهبان و دشت مرتفع آباده هدایت کنید.',
    unlockRequirementFa: 'با تکمیل مرحله ۴۸ (نطنز) باز می‌شود',
    completionStoryFa:
      'جویبارها و حوض‌های فارس از شیراز تا آباده سرشار از زندگی شدند. اکنون گذرگاه حاشیه کویر در مسیر «سمنان» گشوده است.',
    destinationIds: ['shiraz', 'neyriz', 'estahban', 'abadeh'],
    levelIds: [49, 50, 51, 52, 53, 54, 55, 56],
    requiredCompletedLevelId: 48,
    theme: {
      accentHex: '#E07A68',
      secondaryHex: '#35C4A0',
      surfaceClass: 'bg-[#221719]',
      borderClass: 'border-[#7A4441]',
    },
  },
  {
    id: 'semnan',
    order: 8,
    nameFa: 'سمنان',
    titleFa: 'مسیر سمنان — گذرگاه آب در دامنه البرز و کویر',
    subtitleFa: 'گرمسار، سمنان، دامغان و شاهرود · نهرهای دشت و چشمه‌های دامنه',
    storyFa:
      'هشتمین مسیر سفر در امتداد دامنه جنوبی البرز و حاشیه دشت کویر می‌گذرد؛ از نهرهای گرمسار و آب‌انبارهای سمنان تا چشمه دامغان و باغ‌های شاهرود.',
    unlockRequirementFa: 'با تکمیل مرحله ۵۶ (آباده) باز می‌شود',
    completionStoryFa:
      'مسیر سمنان از گرمسار تا شاهرود احیا شد و واحه‌های حاشیه کویر سیراب شدند. اکنون دروازه کوهستان‌های «شمال‌غرب ایران» باز شده است.',
    destinationIds: ['garmsar', 'semnan', 'damghan', 'shahroud'],
    levelIds: [57, 58, 59, 60, 61, 62, 63, 64],
    requiredCompletedLevelId: 56,
    theme: {
      accentHex: '#E09A42',
      secondaryHex: '#2EB7C9',
      surfaceClass: 'bg-[#211A12]',
      borderClass: 'border-[#7D5930]',
    },
  },
  {
    id: 'northwest',
    order: 9,
    nameFa: 'شمال‌غرب ایران',
    titleFa: 'مسیر شمال‌غرب ایران — دامنه‌های سهند تا دریاچه ارومیه',
    subtitleFa: 'تبریز، مراغه، خوی و ارومیه · دره‌های سردسیر و باغ‌های کوهپایه‌ای',
    storyFa:
      'نهمین مسیر سفر شما را به کوهپایه‌های خنک و دره‌های پرآب شمال‌غرب می‌برد؛ از تبریز و باغ‌های مراغه تا دشت خوی و باغستان‌های پیرامون ارومیه.',
    unlockRequirementFa: 'با تکمیل مرحله ۶۴ (شاهرود) باز می‌شود',
    completionStoryFa:
      'دره‌ها و دشت‌های شمال‌غرب از تبریز تا ارومیه با شبکه‌های دقیق آب‌رسانی پیوند خوردند. اکنون دهمین مسیر، «خراسان رضوی»، پیش روی شماست.',
    destinationIds: ['tabriz', 'maragheh', 'khoy', 'urmia'],
    levelIds: [65, 66, 67, 68, 69, 70, 71, 72],
    requiredCompletedLevelId: 64,
    theme: {
      accentHex: '#52A8E0',
      secondaryHex: '#4EC49B',
      surfaceClass: 'bg-[#131E29]',
      borderClass: 'border-[#336485]',
    },
  },
  {
    id: 'razavi_khorasan',
    order: 10,
    nameFa: 'خراسان رضوی',
    titleFa: 'مسیر خراسان رضوی — دامنه‌های بینالود و دشت‌های فیروزه',
    subtitleFa: 'نیشابور، سبزوار، کاشمر و تربت حیدریه · از بینالود تا بلندی‌های خراسان رضوی',
    storyFa:
      'دهمین مسیر سفر در پهنه‌ی خراسان رضوی؛ از دامنه‌های بینالود در نیشابور و دشت سبزوار تا تاکستان‌های کاشمر و بلندی‌های تربت حیدریه.',
    unlockRequirementFa: 'با تکمیل مرحله ۷۲ (ارومیه) باز می‌شود',
    completionStoryFa:
      'از نیشابور و سبزوار تا کاشمر و تربت حیدریه، شبکه‌های آب‌رسانی خراسان رضوی دوباره جاری شدند. اکنون نخستین مسیر فرهنگی ویژه، «راه کوچ شاهسون»، پیش روی شما گشوده است.',
    destinationIds: ['nishapur', 'sabzevar', 'kashmar', 'torbat_heydarieh'],
    levelIds: [73, 74, 75, 76, 77, 78, 79, 80],
    requiredCompletedLevelId: 72,
    theme: {
      accentHex: '#2CC9C2',
      secondaryHex: '#F0BD56',
      surfaceClass: 'bg-[#122224]',
      borderClass: 'border-[#2E7A78]',
    },
  },
  {
    id: 'shahsavan',
    order: 11,
    nameFa: 'راه کوچ شاهسون',
    titleFa: 'راه کوچ شاهسون — از مغان تا دامنه سبلان',
    subtitleFa: 'پارس‌آباد، بیله‌سوار، گرمی، مشگین‌شهر و اردبیل و دامنه سبلان · از قشلاق مغان تا ییلاق دامنه سبلان',
    storyFa:
      'یازدهمین مسیر با الهام از جغرافیای دشت مغان تا کوهپایه‌های سبلان و میراث فرهنگی متنوع شاهسون (ایلسون) طراحی شده است؛ از دشت‌های پارس‌آباد و بیله‌سوار و دره‌های گرمی تا مشگین‌شهر و ییلاق‌های دامنه سبلان با نقش‌مایه‌های هندسی ورنی و زندگی کوچ‌نشینی و یکجانشینی منطقه.',
    unlockRequirementFa: 'با تکمیل مرحله ۸۰ (تربت حیدریه) باز می‌شود',
    completionStoryFa:
      'آب زلال در سراسر مسیر ده مرحله‌ای از دشت مغان تا دامنه‌های سبلان جریان یافت. اکنون دوازدهمین و پایانی‌ترین مسیر، «راه ترکمن‌صحرا»، در انتظار شماست.',
    destinationIds: ['parsabad', 'bileh_savar', 'germi', 'meshgin_shahr', 'ardabil_sabalan'],
    levelIds: [81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
    requiredCompletedLevelId: 80,
    theme: {
      accentHex: '#43C2A8',
      secondaryHex: '#E07A54',
      surfaceClass: 'bg-[#13201F]',
      borderClass: 'border-[#347568]',
    },
  },
  {
    id: 'turkmen_sahra',
    order: 12,
    nameFa: 'راه ترکمن‌صحرا',
    titleFa: 'راه ترکمن‌صحرا — از دشت‌های ترکمن تا کرانه‌های خزر',
    subtitleFa: 'گنبد کاووس، آق‌قلا، بندر ترکمن، گمیشان / گمیش‌تپه و مراوه‌تپه · حوضه گرگان‌رود، اترک و کرانه خزر',
    storyFa:
      'دوازدهمین و واپسین مسیر سفر صدمرحله‌ای با الهام از چشم‌اندازهای ترکمن‌صحرا، حوضه‌های گرگان‌رود و اترک، کرانه‌های خزر و میراث هنری و فرهنگی گوناگون این دیار؛ از گنبد کاووس و آق‌قلا تا بندر ترکمن، گمیشان و تپه‌ماهورهای مراوه‌تپه.',
    unlockRequirementFa: 'با تکمیل مرحله ۹۰ (اردبیل و دامنه سبلان) باز می‌شود',
    completionStoryFa:
      'از گنبد کاووس تا کرانه‌های خزر و مراوه‌تپه، هر ۱۲ مسیر، ۵۰ مقصد و ۱۰۰ مرحله قنات‌چی را با استادی کامل به پایان رساندید و نبض آب ایران را جاودانه ساختید.',
    destinationIds: ['gonbad_kavus', 'aq_qala', 'bandar_torkaman', 'gomishan', 'maraveh_tappeh'],
    levelIds: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
    requiredCompletedLevelId: 90,
    theme: {
      accentHex: '#E5A83B',
      secondaryHex: '#C84B4B',
      surfaceClass: 'bg-[#211618]',
      borderClass: 'border-[#824B42]',
    },
  },
];

export function getRegionById(regionId: RegionId): RegionDefinition {
  return REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
}

export function getRegionForLevelId(levelId: number): RegionDefinition {
  return REGIONS.find((r) => r.levelIds.includes(levelId)) ?? REGIONS[0];
}

export const STORY_MOMENTS: Record<string, StoryMoment> = {
  enter_yazd: {
    id: 'enter_yazd',
    kind: 'region_enter',
    regionId: 'yazd',
    titleFa: 'ورود به مسیر یزد — قنات‌های کهن',
    bodyFa:
      'در سکوت گرگ‌ومیش کویر یزد، قنات‌های باستانی چشم‌انتظار دستان شما هستند. لوله‌های خشتی را بچرخانید تا نخستین جریان آب بدون نشت به مظهر قنات برسد.',
    ctaFa: 'آغاز بازسازی',
  },
  first_qanat_restored: {
    id: 'first_qanat_restored',
    kind: 'first_level',
    regionId: 'yazd',
    titleFa: 'نخستین قنات جان گرفت!',
    bodyFa:
      'آفرین! نخستین آبراهه یزد دوباره جاری شد و مظهر قنات شکوفا گردید. در ادامه، مسیر شما از میبد و اردکان تا تفت و سراسر ایران ادامه می‌یابد.',
    ctaFa: 'ادامه مسیر',
  },
  unlock_kerman: {
    id: 'unlock_kerman',
    kind: 'region_unlocked',
    regionId: 'kerman',
    titleFa: 'مسیر یزد احیا شد · سفر به کرمان!',
    bodyFa:
      'هر هشت مرحله مسیر یزد از یزد تا تفت بازسازی شدند. اکنون مسیر جدید «کرمان — باغ‌های کویر» با مقاصد کرمان، ماهان، بم و راین گشوده شده است.',
    ctaFa: 'ورود به مسیر کرمان',
  },
  unlock_kashan: {
    id: 'unlock_kashan',
    kind: 'region_unlocked',
    regionId: 'kashan',
    titleFa: 'مسیر کرمان سیراب شد · دروازه کاشان گشوده شد!',
    bodyFa:
      'باغ‌ها و نخلستان‌های مسیر کرمان دوباره سرسبز شدند. اکنون می‌توانید وارد مسیر «کاشان و پیرامون» با مقاصد کاشان، ابوزیدآباد، نیاسر و قمصر شوید.',
    ctaFa: 'ورود به مسیر کاشان',
  },
  unlock_zanjan: {
    id: 'unlock_zanjan',
    kind: 'region_unlocked',
    regionId: 'zanjan',
    titleFa: 'کاشان و پیرامون احیا شد · سفر به مسیر زنجان!',
    bodyFa:
      'از کاشان و واحه ابوزیدآباد تا نیاسر و قمصر، آب در تمام جویبارها جاری شد. اکنون مسیر چهارم «زنجان» با مقاصد زنجان، ایجرود، سلطانیه و ماهنشان پیش روی شماست.',
    ctaFa: 'ورود به مسیر زنجان',
  },
  unlock_khorasan: {
    id: 'unlock_khorasan',
    kind: 'region_unlocked',
    regionId: 'khorasan',
    titleFa: 'مسیر زنجان تکمیل شد · دروازه خراسان گشوده شد!',
    bodyFa:
      'دره‌ها و دشت‌های زنجان، ایجرود، سلطانیه و ماهنشان سیراب شدند. اکنون مسیر پنجم «خراسان» از گناباد و فردوس تا طبس و بیرجند گشوده شده است.',
    ctaFa: 'ورود به مسیر خراسان',
  },
  unlock_isfahan: {
    id: 'unlock_isfahan',
    kind: 'region_unlocked',
    regionId: 'isfahan',
    titleFa: 'مسیر خراسان احیا شد · ورود به فلات اصفهان!',
    bodyFa:
      'از گناباد تا بیرجند جریان آب برقرار شد. اکنون نیمه دوم سفر ایران با مسیر ششم «فلات اصفهان» در اصفهان، اردستان، نائین و نطنز آغاز می‌شود.',
    ctaFa: 'ورود به فلات اصفهان',
  },
  unlock_fars: {
    id: 'unlock_fars',
    kind: 'region_unlocked',
    regionId: 'fars',
    titleFa: 'فلات اصفهان سیراب شد · سفر به فارس!',
    bodyFa:
      'آبراه‌های اصفهان، اردستان، نائین و نطنز با موفقیت متصل شدند. اکنون مسیر هفتم «فارس» با مقاصد شیراز، نی‌ریز، استهبان و آباده گشوده شده است.',
    ctaFa: 'ورود به مسیر فارس',
  },
  unlock_semnan: {
    id: 'unlock_semnan',
    kind: 'region_unlocked',
    regionId: 'semnan',
    titleFa: 'مسیر فارس تکمیل شد · گذرگاه سمنان گشوده شد!',
    bodyFa:
      'باغ‌شهرهای فارس از شیراز تا آباده سرسبز شدند. اکنون مسیر هشتم «سمنان» با مقاصد گرمسار، سمنان، دامغان و شاهرود در انتظار شماست.',
    ctaFa: 'ورود به مسیر سمنان',
  },
  unlock_northwest: {
    id: 'unlock_northwest',
    kind: 'region_unlocked',
    regionId: 'northwest',
    titleFa: 'مسیر سمنان احیا شد · سفر به شمال‌غرب ایران!',
    bodyFa:
      'نهرها و واحه‌های گرمسار، سمنان، دامغان و شاهرود دوباره جاری شدند. اکنون مسیر نهم «شمال‌غرب ایران» از تبریز و مراغه تا خوی و ارومیه باز شده است.',
    ctaFa: 'ورود به شمال‌غرب ایران',
  },
  unlock_razavi_khorasan: {
    id: 'unlock_razavi_khorasan',
    kind: 'region_unlocked',
    regionId: 'razavi_khorasan',
    titleFa: 'شمال‌غرب احیا شد · ورود به خراسان رضوی!',
    bodyFa:
      'دامنه‌های سهند و دشت‌های تبریز، مراغه، خوی و ارومیه سیراب شدند. اکنون مسیر دهم، «خراسان رضوی»، از نیشابور تا تربت حیدریه گشوده است.',
    ctaFa: 'ورود به خراسان رضوی',
  },
  unlock_shahsavan: {
    id: 'unlock_shahsavan',
    kind: 'region_unlocked',
    regionId: 'shahsavan',
    titleFa: 'خراسان رضوی احیا شد · گشایش راه کوچ شاهسون!',
    bodyFa:
      'هشتاد مرحله نخست با موفقیت به پایان رسید. اکنون مسیر فرهنگی یازدهم، «راه کوچ شاهسون» با ۱۰ مرحله و ۵ مقصد از قشلاق مغان تا ییلاق دامنه سبلان باز شده است.',
    ctaFa: 'ورود به راه کوچ شاهسون',
  },
  unlock_turkmen_sahra: {
    id: 'unlock_turkmen_sahra',
    kind: 'region_unlocked',
    regionId: 'turkmen_sahra',
    titleFa: 'راه کوچ شاهسون تکمیل شد · گشایش راه ترکمن‌صحرا!',
    bodyFa:
      'از دشت مغان تا دامنه‌های سبلان جریان آب برقرار شد. اکنون دوازدهمین و پایانی‌ترین مسیر، «راه ترکمن‌صحرا» با ۱۰ مرحله از گنبد کاووس و کرانه‌های خزر تا مراوه‌تپه پیش روی شماست.',
    ctaFa: 'ورود به راه ترکمن‌صحرا',
  },
  campaign_complete: {
    id: 'campaign_complete',
    kind: 'campaign_complete',
    regionId: 'turkmen_sahra',
    titleFa: 'استاد بزرگ قنات‌چی — هر ۱۰۰ مرحله ایران زنده شد!',
    bodyFa:
      'شگفت‌انگیز است! هر ۱۰۰ مرحله و هر ۵۰ مقصد در ۱۲ مسیر ایران، از قنات‌های کهن یزد تا راه کوچ شاهسون و دشت‌های ترکمن‌صحرا را با استادی کامل به پایان رساندید.',
    ctaFa: 'بازگشت به نقشه',
  },
};
