import type { DestinationDefinition, DestinationId, RegionId } from '../engine/types';

/**
 * Complete 50-destination campaign atlas across 12 Iranian regional & cultural routes.
 * Historical qanat mentions are bounded to verified heritage contexts (UNESCO Persian Qanat
 * and Encyclopaedia Iranica); where specific local historical documentation is absent,
 * descriptions are framed honestly as landscape- and culture-inspired puzzle storytelling.
 */
export const DESTINATIONS: readonly DestinationDefinition[] = [
  // =========================================================================
  // ROUTE 1 — YAZD (Levels 1–8)
  // =========================================================================
  {
    id: 'yazd',
    regionId: 'yazd',
    order: 1,
    nameFa: 'یزد',
    nameEn: 'Yazd',
    taglineFa: 'بادگیرها و قنات‌های کهن',
    descriptionFa:
      'خاستگاه شبکه‌های دیرینه آب‌رسانی زیرزمینی و آب‌انبارهای خشتی در دل کویر مرکزی ایران.',
    levelIds: [1, 2],
    accentHex: '#D99B26',
    secondaryHex: '#19A7B8',
  },
  {
    id: 'meybod',
    regionId: 'yazd',
    order: 2,
    nameFa: 'میبد',
    nameEn: 'Meybod',
    taglineFa: 'یخچال خشتی و باغ‌های کویری',
    descriptionFa:
      'شهر کهن خشت و گل در حاشیه کویر؛ جایی که آبراه‌های زیرزمینی باغ‌ها و آب‌انبارها را زنده نگاه می‌دارند.',
    levelIds: [3, 4],
    accentHex: '#C9843B',
    secondaryHex: '#22B1C2',
  },
  {
    id: 'ardakan',
    regionId: 'yazd',
    order: 3,
    nameFa: 'اردکان',
    nameEn: 'Ardakan',
    taglineFa: 'دشت کویری و چاه‌میله‌های آب',
    descriptionFa:
      'آبادی باستانی در گستره‌ی کویری یزد با مسیرهای قنات کهن که آب را با نیروی گرانش به مزارع می‌رسانند.',
    levelIds: [5, 6],
    accentHex: '#B97834',
    secondaryHex: '#25B8C8',
  },
  {
    id: 'taft',
    regionId: 'yazd',
    order: 4,
    nameFa: 'تفت',
    nameEn: 'Taft',
    taglineFa: 'باغ‌شهر کوهپایه شیرکوه',
    descriptionFa:
      'انارستان‌ها و باغ‌های دامنه شیرکوه که آب زلال کوهستان را از جویبارها و قنات‌های دامنه‌ای دریافت می‌کنند.',
    levelIds: [7, 8],
    accentHex: '#C28A32',
    secondaryHex: '#2AB38B',
  },

  // =========================================================================
  // ROUTE 2 — KERMAN (Levels 9–16)
  // =========================================================================
  {
    id: 'kerman',
    regionId: 'kerman',
    order: 5,
    nameFa: 'کرمان',
    nameEn: 'Kerman',
    taglineFa: 'گذرگاه آب در حاشیه کویر',
    descriptionFa:
      'مرکز پیوند کوهستان و کویر؛ شبکه‌های آب‌رسانی دامنه‌ای برای هدایت جریان به آبادی‌ها و باغ‌ها.',
    levelIds: [9, 10],
    accentHex: '#2AB38B',
    secondaryHex: '#D99B26',
  },
  {
    id: 'mahan',
    regionId: 'kerman',
    order: 6,
    nameFa: 'ماهان',
    nameEn: 'Mahan',
    taglineFa: 'باغ پلکانی و جویبارهای کوهستانی',
    descriptionFa:
      'واحه سرسبز دامنه کوه‌های جوپار که در آن آب قنات از میان حوضچه‌ها و آبشارهای پلکانی باغ می‌گذرد.',
    levelIds: [11, 12],
    accentHex: '#25A894',
    secondaryHex: '#52DCE6',
  },
  {
    id: 'bam',
    regionId: 'kerman',
    order: 7,
    nameFa: 'بم',
    nameEn: 'Bam',
    taglineFa: 'نخلستان‌ها و قنات‌های واحه‌ای',
    descriptionFa:
      'سرزمین نخلستان‌های گسترده در شرق کرمان با پیشینه‌ای دیرینه در بهره‌برداری از قنات‌های ژرف کویری.',
    levelIds: [13, 14],
    accentHex: '#35A872',
    secondaryHex: '#E0A338',
  },
  {
    id: 'rayen',
    regionId: 'kerman',
    order: 8,
    nameFa: 'راین',
    nameEn: 'Rayen',
    taglineFa: 'ارگ خشتی و دامنه‌های مرتفع',
    descriptionFa:
      'مقصدی در دامنه‌های خنک کوه هزار با معماری خشتی و شبکه‌های آبیاری الهام‌گرفته از شیب کوهپایه.',
    levelIds: [15, 16],
    accentHex: '#3D9F8A',
    secondaryHex: '#D49A42',
  },

  // =========================================================================
  // ROUTE 3 — KASHAN AND SURROUNDINGS (Levels 17–24)
  // =========================================================================
  {
    id: 'kashan',
    regionId: 'kashan',
    order: 9,
    nameFa: 'کاشان',
    nameEn: 'Kashan',
    taglineFa: 'عمارت‌های تاریخی و حوض‌های فیروزه‌ای',
    descriptionFa:
      'شهر باغ‌ها و عمارت‌های اصیل با هندسه دقیق آب‌نماها، شترگلوها و جریان پیوسته آب در حیاط‌ها.',
    levelIds: [17, 18],
    accentHex: '#1FAEC0',
    secondaryHex: '#E6BA5E',
  },
  {
    id: 'abuzeydabad',
    regionId: 'kashan',
    order: 10,
    nameFa: 'ابوزیدآباد',
    nameEn: 'Abuzeydabad',
    taglineFa: 'واحه کویری و رمل‌های طلایی',
    descriptionFa:
      'واحه‌ای دیرینه در حاشیه کویر کاشان که کشاورزی و زیست مردمان آن پیوندی تاریخی با آب قنات و تپه‌های شنی داشته است.',
    levelIds: [19, 20],
    accentHex: '#E59A38',
    secondaryHex: '#22C2D4',
  },
  {
    id: 'niasar',
    regionId: 'kashan',
    order: 11,
    nameFa: 'نیاسر',
    nameEn: 'Niasar',
    taglineFa: 'چشمه کوهستانی و باغ‌های پلکانی',
    descriptionFa:
      'دیار چشمه‌های پرآب و دره‌های سرسبز در غرب کاشان با مسیرهای آبیاری پلکانی در شیب کوهستان.',
    levelIds: [21, 22],
    accentHex: '#25B3A6',
    secondaryHex: '#7BE8C6',
  },
  {
    id: 'qamsar',
    regionId: 'kashan',
    order: 12,
    nameFa: 'قمصر',
    nameEn: 'Qamsar',
    taglineFa: 'دره گلستان‌ها و جویبارهای کوهسار',
    descriptionFa:
      'دره‌ای خوش‌آب‌وهوا در کوهپایه‌های کرکس که باغستان‌های آن با شبکه‌ای ظریف از جوی‌های کوهستانی آبیاری می‌شوند.',
    levelIds: [23, 24],
    accentHex: '#D8758F',
    secondaryHex: '#35C4D4',
  },

  // =========================================================================
  // ROUTE 4 — ZANJAN (Levels 25–32)
  // =========================================================================
  {
    id: 'zanjan',
    regionId: 'zanjan',
    order: 13,
    nameFa: 'زنجان',
    nameEn: 'Zanjan',
    taglineFa: 'دشت مرتفع و کوهپایه‌های شمال‌غرب',
    descriptionFa:
      'آغاز مسیر زنجان؛ معماهای آب‌رسانی الهام‌گرفته از دره‌های خنک، کوهپایه‌ها و معماری آجری شمال‌غرب ایران.',
    levelIds: [25, 26],
    accentHex: '#5BA3C9',
    secondaryHex: '#E0B45A',
  },
  {
    id: 'ijrud',
    regionId: 'zanjan',
    order: 14,
    nameFa: 'ایجرود',
    nameEn: 'Ijrud',
    taglineFa: 'دره‌های سبز و تنگه‌های کوهستانی',
    descriptionFa:
      'منطقه‌ای کوهستانی با تپه‌های پیوسته و دره‌های پرپیچ‌وخم در مسیر زنجان؛ طراحی مراحل این مقصد برداشتی داستانی و الهام‌گرفته از چشم‌انداز طبیعی ایجرود است.',
    levelIds: [27, 28],
    accentHex: '#4BB39A',
    secondaryHex: '#8AD4C2',
  },
  {
    id: 'soltaniyeh',
    regionId: 'zanjan',
    order: 15,
    nameFa: 'سلطانیه',
    nameEn: 'Soltaniyeh',
    taglineFa: 'دشت پهناور و افق گنبد فیروزه‌ای',
    descriptionFa:
      'دشت تاریخی و گشاده سلطانیه؛ مراحل این ایستگاه با الهام از هندسه هشت‌ضلعی و پهنه‌ی دشت طراحی شده‌اند.',
    levelIds: [29, 30],
    accentHex: '#2FA6C9',
    secondaryHex: '#E6C26E',
  },
  {
    id: 'mahneshan',
    regionId: 'zanjan',
    order: 16,
    nameFa: 'ماهنشان',
    nameEn: 'Mahneshan',
    taglineFa: 'تپه‌های رنگین و ژرف‌دره‌های کوهستانی',
    descriptionFa:
      'چشم‌انداز منحصربه‌فرد تپه‌های رسوبی رنگین و دره‌های عمیق؛ معماهای پایانی مسیر زنجان با الهام از این بستر پرشیب شکل گرفته‌اند.',
    levelIds: [31, 32],
    accentHex: '#D17C47',
    secondaryHex: '#4CB7C4',
  },

  // =========================================================================
  // ROUTE 5 — KHORASAN (Levels 33–40)
  // Cultural & geographical eastern Iranian route across Razavi & South Khorasan
  // =========================================================================
  {
    id: 'gonabad',
    regionId: 'khorasan',
    order: 17,
    nameFa: 'گناباد',
    nameEn: 'Gonabad',
    taglineFa: 'قنات‌های عمیق و چاه‌میله‌های تاریخی',
    descriptionFa:
      'میزبان قنات تاریخی قصبه گناباد در فهرست میراث جهانی یونسکو؛ نمادی شکوهمند از حفر چاه‌های ژرف و انتقال گرانشی آب.',
    levelIds: [33, 34],
    accentHex: '#A67CE2',
    secondaryHex: '#44D2E0',
  },
  {
    id: 'ferdows',
    regionId: 'khorasan',
    order: 18,
    nameFa: 'فردوس',
    nameEn: 'Ferdows',
    taglineFa: 'باغستان‌های شرق و آبراه‌های کهن بلده',
    descriptionFa:
      'دیار باغستان‌های سرسبز در شرق ایران با پیشینه دیرینه در تقسیم دقیق آب از طریق قنات تاریخی بلده.',
    levelIds: [35, 36],
    accentHex: '#C282D6',
    secondaryHex: '#F0BC5E',
  },
  {
    id: 'tabas',
    regionId: 'khorasan',
    order: 19,
    nameFa: 'طبس',
    nameEn: 'Tabas',
    taglineFa: 'واحه نخلستان‌ها و باغ گلشن در دل کویر',
    descriptionFa:
      'واحه‌ای سرسبز میان کویرهای شرقی که جریان پیوسته آب زیرزمینی، نخلستان‌ها و باغ‌های آن را سیراب می‌کند.',
    levelIds: [37, 38],
    accentHex: '#3EB89A',
    secondaryHex: '#E8B14E',
  },
  {
    id: 'birjand',
    regionId: 'khorasan',
    order: 20,
    nameFa: 'بیرجند',
    nameEn: 'Birjand',
    taglineFa: 'باغ‌های کوهپایه‌ای و پایان مسیر خراسان',
    descriptionFa:
      'واپسین مقصد این مسیر فرهنگی در شرق ایران؛ باغ‌های پلکانی و شبکه‌های دقیق آب‌رسانی در دامنه‌های باقران.',
    levelIds: [39, 40],
    accentHex: '#E09D3E',
    secondaryHex: '#52DCE6',
  },

  // =========================================================================
  // ROUTE 6 — ISFAHAN PLATEAU (Levels 41–48)
  // =========================================================================
  {
    id: 'isfahan',
    regionId: 'isfahan',
    order: 21,
    nameFa: 'اصفهان',
    nameEn: 'Isfahan',
    taglineFa: 'پل‌های تاریخی و باغ‌شهر زاینده‌رود',
    descriptionFa:
      'آغاز مسیر فلات اصفهان؛ شبکه‌های هندسی آب‌رسانی الهام‌گرفته از پل‌های قوسی زاینده‌رود، حوض‌های فیروزه‌ای و مادی‌های تاریخی شهر.',
    levelIds: [41, 42],
    accentHex: '#25B8D9',
    secondaryHex: '#E8B84E',
  },
  {
    id: 'ardestan',
    regionId: 'isfahan',
    order: 22,
    nameFa: 'اردستان',
    nameEn: 'Ardestan',
    taglineFa: 'قنات دوطبقه مون و معماری کویری',
    descriptionFa:
      'شهر کهن در حاشیه کویر اصفهان که با قنات تاریخی دوطبقه مون در فهرست میراث جهانی یونسکو و شبکه‌های دقیق تقسیم آب شناخته می‌شود.',
    levelIds: [43, 44],
    accentHex: '#D8963E',
    secondaryHex: '#30C4D4',
  },
  {
    id: 'nain',
    regionId: 'isfahan',
    order: 23,
    nameFa: 'نائین',
    nameEn: 'Nain',
    taglineFa: 'بادگیرهای کویری و آب‌انبارهای خشتی',
    descriptionFa:
      'دیار معماری خشتی در شرق استان اصفهان با شبکه‌های سنتی آب‌رسانی زیرزمینی که آب را در اقلیم خشک فلات مرکزی حفظ می‌کنند.',
    levelIds: [45, 46],
    accentHex: '#C78342',
    secondaryHex: '#46CBD6',
  },
  {
    id: 'natanz',
    regionId: 'isfahan',
    order: 24,
    nameFa: 'نطنز',
    nameEn: 'Natanz',
    taglineFa: 'باغستان‌های دامنه کوه کرکس',
    descriptionFa:
      'باغ‌شهر کوهپایه‌ای در دامنه کرکس با چشمه‌های خنک و جویبارهای پلکانی که باغ‌های میوه را سیراب می‌کنند.',
    levelIds: [47, 48],
    accentHex: '#3BB892',
    secondaryHex: '#E2B45A',
  },

  // =========================================================================
  // ROUTE 7 — FARS (Levels 49–56)
  // =========================================================================
  {
    id: 'shiraz',
    regionId: 'fars',
    order: 25,
    nameFa: 'شیراز',
    nameEn: 'Shiraz',
    taglineFa: 'باغ‌های ایرانی، سروها و حوض‌های فیروزه',
    descriptionFa:
      'شهر باغ‌های تاریخی در دل فارس؛ جایی که جریان آرام آب در جوی‌های سنگی و حوض‌های چهارباغ طراوت ویژه‌ای به حیاط‌ها می‌بخشد.',
    levelIds: [49, 50],
    accentHex: '#E07A68',
    secondaryHex: '#35C4A0',
  },
  {
    id: 'neyriz',
    regionId: 'fars',
    order: 26,
    nameFa: 'نی‌ریز',
    nameEn: 'Neyriz',
    taglineFa: 'انارستان‌های شرق فارس و جویبارهای دامنه',
    descriptionFa:
      'شهرستان کوهپایه‌ای در شرق فارس با باغ‌های انار و انجیر که شبکه‌های سنتی آبیاری دامنه‌ای، آب را میان باغات تقسیم می‌کنند.',
    levelIds: [51, 52],
    accentHex: '#D96B5C',
    secondaryHex: '#42C7B5',
  },
  {
    id: 'estahban',
    regionId: 'fars',
    order: 27,
    nameFa: 'استهبان',
    nameEn: 'Estahban',
    taglineFa: 'دامنه‌های پلکانی و انجیرستان‌های کوهستان',
    descriptionFa:
      'دیار باغ‌های پلکانی در دامنه‌های کوهستانی فارس؛ معماهای این ایستگاه با الهام از شیب دره‌ها و تقسیم دقیق آب طراحی شده‌اند.',
    levelIds: [53, 54],
    accentHex: '#63B87B',
    secondaryHex: '#E5B65A',
  },
  {
    id: 'abadeh',
    regionId: 'fars',
    order: 28,
    nameFa: 'آباده',
    nameEn: 'Abadeh',
    taglineFa: 'فلات مرتفع شمال فارس و عمارت‌های کهن',
    descriptionFa:
      'دشت بلند و خوش‌آب‌وهوای شمال فارس میان شیراز و فلات مرکزی با معماری سنتی و آبراه‌های دشتی.',
    levelIds: [55, 56],
    accentHex: '#C98C4E',
    secondaryHex: '#3BC5D4',
  },

  // =========================================================================
  // ROUTE 8 — SEMNAN (Levels 57–64)
  // =========================================================================
  {
    id: 'garmsar',
    regionId: 'semnan',
    order: 29,
    nameFa: 'گرمسار',
    nameEn: 'Garmsar',
    taglineFa: 'دروازه کویر و انشعاب نهرهای دشت',
    descriptionFa:
      'آغاز مسیر سمنان در حاشیه دشت کویر؛ جایی که آب‌های دامنه‌ای از طریق شبکه نهرهای منشعب به مزارع و آبادی‌های دشت می‌رسند.',
    levelIds: [57, 58],
    accentHex: '#E09A42',
    secondaryHex: '#2EB7C9',
  },
  {
    id: 'semnan',
    regionId: 'semnan',
    order: 30,
    nameFa: 'سمنان',
    nameEn: 'Semnan',
    taglineFa: 'دروازه تاریخی و استخرهای تقسیم آب',
    descriptionFa:
      'شهر کهن در مسیر تاریخی خراسان که نظام سنتی استخرها و تقسیم نوبتی آب در محله‌های آن بخشی از هویت شهری آن بوده است.',
    levelIds: [59, 60],
    accentHex: '#D1893B',
    secondaryHex: '#46D4DE',
  },
  {
    id: 'damghan',
    regionId: 'semnan',
    order: 31,
    nameFa: 'دامغان',
    nameEn: 'Damghan',
    taglineFa: 'چشمه کوهستانی و باغ‌های پسته',
    descriptionFa:
      'شهر باستانی دامنه جنوبی البرز با چشمه‌های پرآب کوهستانی و باغستان‌های سرسبز در حاشیه دشت.',
    levelIds: [61, 62],
    accentHex: '#4CB38B',
    secondaryHex: '#E6B34C',
  },
  {
    id: 'shahroud',
    regionId: 'semnan',
    order: 32,
    nameFa: 'شاهرود',
    nameEn: 'Shahroud',
    taglineFa: 'باغستان‌های دامنه شاهوار و دره‌های خنک',
    descriptionFa:
      'ایستگاه پایانی مسیر سمنان در دامنه کوه‌های شاهوار با باغ‌های میوه و آبراه‌های کوهپایه‌ای پیوسته.',
    levelIds: [63, 64],
    accentHex: '#35A8A3',
    secondaryHex: '#DF9B46',
  },

  // =========================================================================
  // ROUTE 9 — NORTHWESTERN IRAN (Levels 65–72)
  // =========================================================================
  {
    id: 'tabriz',
    regionId: 'northwest',
    order: 33,
    nameFa: 'تبریز',
    nameEn: 'Tabriz',
    taglineFa: 'دامنه‌های سهند و معماری آجری شمال‌غرب',
    descriptionFa:
      'آغاز مسیر شمال‌غرب ایران در دامنه سهند؛ معماهای این ایستگاه با الهام از طاق‌های آجری، حوض‌های باغی و دشت‌های سردسیر طراحی شده‌اند.',
    levelIds: [65, 66],
    accentHex: '#52A8E0',
    secondaryHex: '#E0A854',
  },
  {
    id: 'maragheh',
    regionId: 'northwest',
    order: 34,
    nameFa: 'مراغه',
    nameEn: 'Maragheh',
    taglineFa: 'دره صوفی‌چای و تپه‌های کوهپایه‌ای',
    descriptionFa:
      'باغ‌شهر تاریخی دامنه جنوبی سهند با تپه‌های رصدی و باغستان‌های پیوسته در امتداد رودخانه و جویبارهای دره.',
    levelIds: [67, 68],
    accentHex: '#4EC49B',
    secondaryHex: '#7EC4E8',
  },
  {
    id: 'khoy',
    regionId: 'northwest',
    order: 35,
    nameFa: 'خوی',
    nameEn: 'Khoy',
    taglineFa: 'دشت محصور در کوهستان و مزارع آفتابگردان',
    descriptionFa:
      'دشت حاصلخیز و کوهستانی در شمال آذربایجان غربی که جویبارهای کوهستان از پیرامون آن به سوی زمین‌های کشاورزی سرازیر می‌شوند.',
    levelIds: [69, 70],
    accentHex: '#E3B448',
    secondaryHex: '#4BAFD4',
  },
  {
    id: 'urmia',
    regionId: 'northwest',
    order: 36,
    nameFa: 'ارومیه',
    nameEn: 'Urmia',
    taglineFa: 'باغستان‌های دامنه و افق دریاچه ارومیه',
    descriptionFa:
      'پایان مسیر شمال‌غرب؛ سرزمین باغ‌های گسترده و رودهای کوهستانی که از ارتفاعات غربی به سوی پهنه دشت و دریاچه جریان می‌یابند.',
    levelIds: [71, 72],
    accentHex: '#35A2D4',
    secondaryHex: '#63D4B0',
  },

  // =========================================================================
  // ROUTE 10 — RAZAVI KHORASAN (Levels 73–80)
  // Clearly distinct northern/central Razavi Khorasan route culminating at Level 80
  // =========================================================================
  {
    id: 'nishapur',
    regionId: 'razavi_khorasan',
    order: 37,
    nameFa: 'نیشابور',
    nameEn: 'Nishapur',
    taglineFa: 'دامنه بینالود و سرزمین فیروزه',
    descriptionFa:
      'آغاز مسیر خراسان رضوی در دامنه جنوبی بینالود؛ پیوند فیروزه، باغ‌های کوهپایه‌ای و شبکه‌های دقیق آب‌رسانی شرق ایران.',
    levelIds: [73, 74],
    accentHex: '#2CC9C2',
    secondaryHex: '#E8B84E',
  },
  {
    id: 'sabzevar',
    regionId: 'razavi_khorasan',
    order: 38,
    nameFa: 'سبزوار',
    nameEn: 'Sabzevar',
    taglineFa: 'دشت پهناور غرب خراسان رضوی و مناره‌های آجری',
    descriptionFa:
      'شهر کهن در گذرگاه غربی خراسان رضوی با افق دشتی، معماری آجری و مسیرهای طولانی آب‌رسانی در حاشیه کویر.',
    levelIds: [75, 76],
    accentHex: '#D89A46',
    secondaryHex: '#36C8D4',
  },
  {
    id: 'kashmar',
    regionId: 'razavi_khorasan',
    order: 39,
    nameFa: 'کاشمر',
    nameEn: 'Kashmar',
    taglineFa: 'تاکستان‌ها، سروهای کهن و جویبارهای دره',
    descriptionFa:
      'دره‌ای سرسبز در جنوب‌غرب خراسان رضوی که باغ‌های انگور و انار آن با شبکه‌ای منظم از جویبارها و آبراه‌ها آبیاری می‌شوند.',
    levelIds: [77, 78],
    accentHex: '#4AC28E',
    secondaryHex: '#D69A52',
  },
  {
    id: 'torbat_heydarieh',
    regionId: 'razavi_khorasan',
    order: 40,
    nameFa: 'تربت حیدریه',
    nameEn: 'Torbat-e Heydarieh',
    taglineFa: 'دشت‌های زعفران و ایستگاه پایانی مسیر خراسان رضوی',
    descriptionFa:
      'ایستگاه پایانی مسیر خراسان رضوی در بلندی‌های شرق ایران؛ گذرگاهی پرچالش که دروازه دو مسیر فرهنگی پایانی را می‌گشاید.',
    levelIds: [79, 80],
    accentHex: '#B680E0',
    secondaryHex: '#F0BD56',
  },

  // =========================================================================
  // ROUTE 11 — SHAHSAVAN HERITAGE (Levels 81–90)
  // Cultural & geographical interpretation from Moghan plain to Sabalan slopes
  // =========================================================================
  {
    id: 'parsabad',
    regionId: 'shahsavan',
    order: 41,
    nameFa: 'پارس‌آباد',
    nameEn: 'Parsabad',
    taglineFa: 'دشت حاصلخیز مغان و حوضه رود ارس',
    descriptionFa:
      'آغاز راه کوچ شاهسون در شمال دشت مغان؛ جایی که سرزمین‌های قشلاقی و کشتزارهای گسترده کنار رود ارس الهام‌بخش شبکه‌های آب‌رسانی این ایستگاه هستند.',
    levelIds: [81, 82],
    accentHex: '#43C2A8',
    secondaryHex: '#E09A48',
  },
  {
    id: 'bileh_savar',
    regionId: 'shahsavan',
    order: 42,
    nameFa: 'بیله‌سوار',
    nameEn: 'Bileh Savar',
    taglineFa: 'چمنزارهای مغان و گذرگاه‌های فصلی دشت',
    descriptionFa:
      'دشت‌های باز و تپه‌ماهورهای شرق مغان در مسیر حرکت فصلی از قشلاق به سوی ارتفاعات؛ معماهای این مقصد با الهام از جغرافیای دشت و آبشخورهای فصلی طراحی شده‌اند.',
    levelIds: [83, 84],
    accentHex: '#3EB89A',
    secondaryHex: '#D97452',
  },
  {
    id: 'germi',
    regionId: 'shahsavan',
    order: 43,
    nameFa: 'گرمی',
    nameEn: 'Germi',
    taglineFa: 'دره‌های سرسبز و کوهپایه‌های میانی مغان',
    descriptionFa:
      'گذرگاه کوهپایه‌ای میان دشت مغان و بلندی‌های اردبیل با دره‌های پیوسته و چشم‌اندازهای روستایی و عشایری متنوع منطقه.',
    levelIds: [85, 86],
    accentHex: '#56B87A',
    secondaryHex: '#4CCAD6',
  },
  {
    id: 'meshgin_shahr',
    regionId: 'shahsavan',
    order: 44,
    nameFa: 'مشگین‌شهر',
    nameEn: 'Meshgin Shahr',
    taglineFa: 'دامنه‌های شمالی سبلان، دره‌ها و چشمه‌های کوهستانی',
    descriptionFa:
      'بلندی‌های خوش‌آب‌وهوای دامنه سبلان با چشمه‌های طبیعی، دره‌های عمیق و هنر بافته‌های هندسی ورنی که الهام‌بخش طراحی این مراحل‌اند.',
    levelIds: [87, 88],
    accentHex: '#48A9D6',
    secondaryHex: '#E27D58',
  },
  {
    id: 'ardabil_sabalan',
    regionId: 'shahsavan',
    order: 45,
    nameFa: 'اردبیل و دامنه سبلان',
    nameEn: 'Ardabil & Sabalan Highlands',
    taglineFa: 'ییلاق‌های بلند سبلان و چشم‌انداز دشت اردبیل',
    descriptionFa:
      'ایستگاه پایانی راه کوچ شاهسون در دامنه‌های خنک و مرتفع سبلان و پهنه‌ی اردبیل؛ جایی که آب‌های کوهستانی در شبکه‌ای گسترده میان ییلاق‌ها جریان می‌یابند.',
    levelIds: [89, 90],
    accentHex: '#3DC2C9',
    secondaryHex: '#F0B65A',
  },

  // =========================================================================
  // ROUTE 12 — TURKMEN SAHRA HERITAGE (Levels 91–100)
  // Cultural & geographical interpretation from Turkmen plains to Caspian coast
  // =========================================================================
  {
    id: 'gonbad_kavus',
    regionId: 'turkmen_sahra',
    order: 46,
    nameFa: 'گنبد کاووس',
    nameEn: 'Gonbad-e Kavus',
    taglineFa: 'پهنه‌ی دشت ترکمن‌صحرا و حوضه گرگان‌رود',
    descriptionFa:
      'آغاز راه ترکمن‌صحرا در دل دشت‌های گسترده شمال‌شرق گلستان؛ معماهایی الهام‌گرفته از هندسه فرش‌های ترکمنی، چشم‌انداز دشت و مسیرهای گرگان‌رود.',
    levelIds: [91, 92],
    accentHex: '#E5A83B',
    secondaryHex: '#C84B4B',
  },
  {
    id: 'aq_qala',
    regionId: 'turkmen_sahra',
    order: 47,
    nameFa: 'آق‌قلا',
    nameEn: 'Aq Qala',
    taglineFa: 'گذرگاه گرگان‌رود و دشت‌های پیرامون',
    descriptionFa:
      'شهر دشتی در کناره گرگان‌رود با پیشینه‌ای از زندگی در کنار آب و دشت‌های کشاورزی؛ طراحی مراحل این مقصد بر پایه انشعاب‌های منظم رودخانه‌ای است.',
    levelIds: [93, 94],
    accentHex: '#D88F3C',
    secondaryHex: '#35C4D4',
  },
  {
    id: 'bandar_torkaman',
    regionId: 'turkmen_sahra',
    order: 48,
    nameFa: 'بندر ترکمن',
    nameEn: 'Bandar Torkaman',
    taglineFa: 'کرانه خلیج گرگان و افق دریای خزر',
    descriptionFa:
      'سکونتگاه ساحلی در پیوند دشت ترکمن‌صحرا با آب‌های خلیج گرگان و دریای خزر؛ الهام‌بخش شبکه‌های آب‌رسانی گسترده به سوی کرانه.',
    levelIds: [95, 96],
    accentHex: '#2FAAC9',
    secondaryHex: '#E6B24C',
  },
  {
    id: 'gomishan',
    regionId: 'turkmen_sahra',
    order: 49,
    nameFa: 'گمیشان / گمیش‌تپه',
    nameEn: 'Gomishan / Gomish Tappeh',
    taglineFa: 'تالاب ساحلی، معماری بومی و دشت‌های شمال‌غرب گلستان',
    descriptionFa:
      'شهر تاریخی و ساحلی در حاشیه تالاب بین‌المللی گمیشان و دشت‌های نزدیک خزر؛ آبراه‌های این ایستگاه با الهام از گذرگاه‌های پیرامون تالاب شکل گرفته‌اند.',
    levelIds: [97, 98],
    accentHex: '#3FB89D',
    secondaryHex: '#D97B48',
  },
  {
    id: 'maraveh_tappeh',
    regionId: 'turkmen_sahra',
    order: 50,
    nameFa: 'مراوه‌تپه',
    nameEn: 'Maraveh Tappeh',
    taglineFa: 'تپه‌ماهورهای شرق ترکمن‌صحرا و حوضه رود اترک',
    descriptionFa:
      'ایستگاه پنجاهم و پایانی سفر صدمرحله‌ای قنات‌چی در تپه‌های سرسبز و دشت‌های شرقی حوضه رود اترک؛ آزمون نهایی مهارت و برنامه‌ریزی در نبض آب ایران.',
    levelIds: [99, 100],
    accentHex: '#E8B64C',
    secondaryHex: '#3AD4E2',
  },
];

export function getDestinationById(destinationId: DestinationId): DestinationDefinition {
  return DESTINATIONS.find((d) => d.id === destinationId) ?? DESTINATIONS[0];
}

export function getDestinationsByRegion(regionId: RegionId): readonly DestinationDefinition[] {
  return DESTINATIONS.filter((d) => d.regionId === regionId);
}

export function getDestinationForLevelId(levelId: number): DestinationDefinition {
  return DESTINATIONS.find((d) => d.levelIds.includes(levelId)) ?? DESTINATIONS[0];
}
