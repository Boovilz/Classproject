/* ============================================================
   GAMIFIED CLASSROOM OS — Mock data (Thai classroom ป.4/2)
   Attached to window for cross-file access.
   ============================================================ */
(function () {
  // ---- attendance statuses ----
  const STATUSES = {
    present:  { key: 'present',  th: 'มาเรียน',     short: 'มา',  color: 'var(--st-present)',  icon: 'check' },
    absent:   { key: 'absent',   th: 'ขาด',         short: 'ขาด', color: 'var(--st-absent)',   icon: 'x' },
    sick:     { key: 'sick',     th: 'ลาป่วย',      short: 'ป่วย', color: 'var(--st-sick)',     icon: 'thermometer' },
    leave:    { key: 'leave',    th: 'ลากิจ',       short: 'กิจ', color: 'var(--st-leave)',    icon: 'note' },
    late:     { key: 'late',     th: 'มาสาย',       short: 'สาย', color: 'var(--st-late)',     icon: 'clock' },
    activity: { key: 'activity', th: 'ไปกิจกรรม',   short: 'กิจกรรม', color: 'var(--st-activity)', icon: 'flag' },
  };

  // ---- realtime live statuses ----
  const LIVE = {
    present:  { th: 'อยู่ในห้อง', color: 'var(--st-present)', icon: 'seat' },
    restroom: { th: 'เข้าห้องน้ำ', color: 'var(--st-late)', icon: 'door' },
    water:    { th: 'ดื่มน้ำ', color: 'var(--st-platinum, var(--st-leave))', icon: 'drop' },
    nurse:    { th: 'ห้องพยาบาล', color: 'var(--st-absent)', icon: 'cross' },
    sick:     { th: 'ไม่สบาย', color: 'var(--st-sick)', icon: 'thermometer' },
    leave:    { th: 'ลา', color: 'var(--muted)', icon: 'note' },
  };

  // ---- ranks ----
  const RANKS = [
    { key: 'bronze',   th: 'บรอนซ์',   color: 'var(--rk-bronze)' },
    { key: 'silver',   th: 'ซิลเวอร์', color: 'var(--rk-silver)' },
    { key: 'gold',     th: 'โกลด์',    color: 'var(--rk-gold)' },
    { key: 'platinum', th: 'แพลทินัม', color: 'var(--rk-platinum)' },
    { key: 'diamond',  th: 'ไดมอนด์',  color: 'var(--rk-diamond)' },
    { key: 'master',   th: 'มาสเตอร์', color: 'var(--rk-master)' },
  ];

  // ---- level tiers ----
  const TIERS = [
    { from: 1,  th: 'มือใหม่',   en: 'Novice' },
    { from: 5,  th: 'นักสำรวจ', en: 'Explorer' },
    { from: 10, th: 'นักรบ',     en: 'Warrior' },
    { from: 20, th: 'จอมยุทธ์',  en: 'Master' },
  ];
  function tierOf(level) {
    let t = TIERS[0];
    for (const x of TIERS) if (level >= x.from) t = x;
    return t;
  }

  // ---- 8 subject territories ----
  const SUBJECTS = [
    { key: 'thai',    th: 'ภาษาไทย',          realm: 'ป่าอักษรา',        icon: 'book',    hue: 12,  pos: [50, 18] },
    { key: 'math',    th: 'คณิตศาสตร์',       realm: 'อาณาจักรคณิต',     icon: 'calc',    hue: 265, pos: [70, 30] },
    { key: 'sci',     th: 'วิทยาศาสตร์',      realm: 'หุบเขาวิทยา',      icon: 'flask',   hue: 160, pos: [30, 34] },
    { key: 'social',  th: 'สังคมศึกษา',       realm: 'อารยธรรมสังคม',    icon: 'globe',   hue: 200, pos: [62, 50] },
    { key: 'eng',     th: 'ภาษาอังกฤษ',       realm: 'ท่าเรืออังกฤษ',     icon: 'lang',    hue: 305, pos: [34, 56] },
    { key: 'art',     th: 'ศิลปะ',            realm: 'เกาะศิลปะ',        icon: 'brush',   hue: 330, pos: [54, 70] },
    { key: 'pe',      th: 'สุขศึกษา · พลศึกษา', realm: 'ขุนเขาสุขภาพ',     icon: 'run',   hue: 88,  pos: [40, 80] },
    { key: 'career',  th: 'การงานอาชีพ',      realm: 'เมืองเทคโนโลยี',    icon: 'tool',    hue: 230, pos: [60, 88] },
  ];

  // ---- reward shop ----
  const REWARDS = [
    { id: 'r1', th: 'หัวหน้าห้อง 1 วัน',    cat: 'privilege', cost: 120, cur: 'coin', icon: 'crown', stock: 1 },
    { id: 'r2', th: 'เลือกที่นั่งเอง',       cat: 'privilege', cost: 80,  cur: 'coin', icon: 'seat',  stock: 3 },
    { id: 'r3', th: 'การ์ดข้ามการบ้าน 1 ครั้ง', cat: 'privilege', cost: 200, cur: 'coin', icon: 'card', stock: 5 },
    { id: 'r4', th: 'กรอบอวตารทองคำ',       cat: 'cosmetic',  cost: 15,  cur: 'star', icon: 'frame', stock: 99 },
    { id: 'r5', th: 'เอฟเฟกต์ออร่านีออน',   cat: 'cosmetic',  cost: 25,  cur: 'star', icon: 'spark', stock: 99 },
    { id: 'r6', th: 'ขนมพิเศษวันศุกร์',     cat: 'benefit',   cost: 60,  cur: 'coin', icon: 'gift',  stock: 8 },
    { id: 'r7', th: 'เลือกเพลงเปิดเช้า',     cat: 'benefit',   cost: 40,  cur: 'coin', icon: 'music', stock: 10 },
    { id: 'r8', th: 'ฉายาพิเศษในเกม',       cat: 'cosmetic',  cost: 30,  cur: 'star', icon: 'tag',   stock: 99 },
  ];

  // ---- students ----
  const NAMES = [
    ['ด.ช. ธนกร ศรีสุข', 'กร', 'm', 'present'],
    ['ด.ญ. พิมพ์ชนก ใจดี', 'พิม', 'f', 'present'],
    ['ด.ช. ภูริ วงศ์ทอง', 'ภู', 'm', 'late'],
    ['ด.ญ. ณัฐธิดา แก้วมณี', 'น้ำ', 'f', 'present'],
    ['ด.ช. กิตติพงษ์ มั่นคง', 'กิต', 'm', 'sick'],
    ['ด.ญ. ชญานิษฐ์ พูนสุข', 'ฟ้า', 'f', 'present'],
    ['ด.ช. ปุณณวิช ทองดี', 'ปุณ', 'm', 'present'],
    ['ด.ญ. อริสา จันทร์เพ็ญ', 'อร', 'f', 'leave'],
    ['ด.ช. ศุภกร เรืองศรี', 'ต้น', 'm', 'present'],
    ['ด.ญ. กานต์ธิดา สุขใจ', 'แก้ม', 'f', 'activity'],
    ['ด.ช. วรเมธ บุญมา', 'เมธ', 'm', 'absent'],
    ['ด.ญ. ปวีณ์ธิดา ศรีทอง', 'มุก', 'f', 'present'],
    ['ด.ช. อนุภัทร เพชรงาม', 'แบงค์', 'm', 'present'],
    ['ด.ญ. ธัญชนก คงเจริญ', 'ใบเฟิร์น', 'f', 'late'],
    ['ด.ช. รัชชานนท์ ดวงดี', 'นนท์', 'm', 'present'],
    ['ด.ญ. ศิรประภา ทองคำ', 'ดาว', 'f', 'present'],
  ];

  const liveKeys = ['present','present','present','restroom','sick','present','present','leave','present','present','sick','water','present','present','nurse','present'];

  function seeded(i, a, b) { // deterministic pseudo value in [a,b]
    const x = Math.sin(i * 99.13 + 7.7) * 10000;
    const f = x - Math.floor(x);
    return Math.round((a + f * (b - a)));
  }

  function growth(i, base, slope) {
    return ['ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'].map((m, k) => ({
      m, v: +(base + slope * k + (seeded(i + k * 3, -6, 6) / 10)).toFixed(1)
    }));
  }

  const STUDENTS = NAMES.map((n, i) => {
    const level = [12,18,7,15,5,21,9,11,24,8,3,16,13,6,19,10][i];
    const xp = seeded(i, 120, 940);
    const xpMax = 1000;
    const rankIdx = Math.min(5, Math.floor(level / 4.2));
    const h = +(118 + seeded(i, 0, 16) + i * 0.4).toFixed(0);
    const w = +(20 + seeded(i + 5, 0, 10) + i * 0.25).toFixed(1);
    const bmi = +(w / Math.pow(h / 100, 2)).toFixed(1);
    const nutrition = bmi < 14 ? 'ผอม' : bmi > 18.5 ? 'ท้วม' : 'สมส่วน';
    const terr = {};
    SUBJECTS.forEach((s, k) => { terr[s.key] = Math.max(0, Math.min(100, seeded(i * 8 + k, -20, 110))); });
    return {
      id: 'S' + (i + 1),
      no: i + 1,
      name: n[0], nick: n[1], gender: n[2],
      status: n[3], live: liveKeys[i],
      welfare: { milk: seeded(i, 0, 10) > 2, brush: seeded(i + 1, 0, 10) > 3, lunch: seeded(i + 2, 0, 10) > 1 },
      health: { w, h, bmi, nutrition,
        weightHist: growth(i, w - 1.6, 0.32),
        heightHist: growth(i + 2, h - 2.2, 0.45) },
      game: {
        level, xp, xpMax,
        rank: RANKS[rankIdx].key, rankIdx,
        stars: seeded(i + 3, 2, 48),
        coins: seeded(i + 7, 40, 620),
        tier: tierOf(level),
        territories: terr,
        hue: (i * 41) % 360,
      },
      badges: seeded(i, 1, 9),
    };
  });

  // class-level derived stats
  function countStatus(k) { return STUDENTS.filter(s => s.status === k).length; }
  const CLASS = {
    name: 'ป.4/2', room: 'อาคาร 2 ห้อง 204',
    teacher: 'ครูมานี รักเรียน', year: 'ปีการศึกษา 2568',
    total: STUDENTS.length,
    summary: {
      present: countStatus('present') + countStatus('late'),
      absent: countStatus('absent'),
      sick: countStatus('sick'),
      leave: countStatus('leave'),
      late: countStatus('late'),
      activity: countStatus('activity'),
    },
    welfare: {
      milk: STUDENTS.filter(s => s.welfare.milk).length,
      brush: STUDENTS.filter(s => s.welfare.brush).length,
      lunch: STUDENTS.filter(s => s.welfare.lunch).length,
    },
  };

  // weekly attendance trend (for dashboard chart)
  const WEEK_TREND = [
    { d: 'จ.', present: 15 }, { d: 'อ.', present: 14 }, { d: 'พ.', present: 16 },
    { d: 'พฤ.', present: 13 }, { d: 'ศ.', present: 15 },
  ];

  // ---- class total power / level ----
  const CLASS_XP = STUDENTS.reduce((a, s) => a + s.game.level * 1000 + s.game.xp, 0);
  const CLASS_LEVEL = Math.floor(CLASS_XP / 8000) + 1;

  // ---- season ----
  const SEASON = {
    no: 1, th: 'การเดินทางสู่อาณาจักรคณิต', en: 'The Math Kingdom Expedition',
    day: 18, days: 45, xp: CLASS_XP, goal: 260000, icon: 'calc', hue: 265,
  };

  // ---- class pet (mascot raised by the whole class) ----
  const PET = {
    name: 'มังกรน้อยเลขเก่ง', species: 'มังกร', level: 6, xp: 340, xpMax: 500,
    stage: 'วัยเด็ก', mood: 'ร่าเริง', icon: 'fire', hue: 150, fedToday: 11,
  };

  // ---- quests ----
  const QUESTS = {
    daily: [
      { id: 'd1', th: 'มาเรียนตรงเวลา',        icon: 'clock',  cur: 1, max: 1, reward: { xp: 20 } },
      { id: 'd2', th: 'ตอบคำถามในห้อง 3 ครั้ง',  icon: 'spark',  cur: 2, max: 3, reward: { xp: 30 } },
      { id: 'd3', th: 'ช่วยเหลือเพื่อน',         icon: 'heart',  cur: 1, max: 1, reward: { star: 1 } },
      { id: 'd4', th: 'ส่งการบ้านครบ',          icon: 'report', cur: 0, max: 1, reward: { coin: 15 } },
    ],
    weekly: [
      { id: 'w1', th: 'มาเรียนครบ 5 วัน',        icon: 'calendar', cur: 4, max: 5, reward: { xp: 120 } },
      { id: 'w2', th: 'อ่านหนังสือ 3 เล่ม',       icon: 'book',     cur: 2, max: 3, reward: { star: 5 } },
      { id: 'w3', th: 'สะสมแต้มกิจกรรม 200',      icon: 'bolt',     cur: 150, max: 200, reward: { coin: 80 } },
    ],
    season: [
      { id: 's1', th: 'พิชิตดินแดนคณิต 100%',     icon: 'calc',   cur: 64, max: 100, reward: { xp: 500 } },
      { id: 's2', th: 'ปราบบอสคณิตทั้งห้อง',      icon: 'shield', cur: 0, max: 1, reward: { badge: 'ตราปราบบอส' } },
      { id: 's3', th: 'มีสมาชิกขึ้น Hall of Fame', icon: 'trophy', cur: 1, max: 3, reward: { badge: 'ตราเกียรติยศ' } },
    ],
  };

  // ---- hall of fame achievement categories ----
  function topBy(fn) { return [...STUDENTS].sort((a, b) => fn(b) - fn(a))[0]; }
  const ACHIEVEMENTS = [
    { key: 'mvp',     th: 'MVP ประจำสัปดาห์', icon: 'crown',  hue: 50,  holder: topBy(s => s.game.level * 1000 + s.game.xp) },
    { key: 'helper',  th: 'ผู้ช่วยยอดเยี่ยม',  icon: 'heart',  hue: 350, holder: topBy(s => s.game.stars) },
    { key: 'reader',  th: 'นักอ่านแห่งปี',     icon: 'book',   hue: 200, holder: topBy(s => s.game.territories.thai) },
    { key: 'solver',  th: 'นักแก้ปัญหา',       icon: 'calc',   hue: 265, holder: topBy(s => s.game.territories.math) },
    { key: 'attend',  th: 'ฮีโร่มาเรียน',      icon: 'check',  hue: 150, holder: topBy(s => (s.status === 'present' ? 1 : 0) * 100 + s.badges) },
    { key: 'coder',   th: 'ฮีโร่โค้ดดิ้ง',     icon: 'tool',   hue: 230, holder: topBy(s => s.game.territories.career) },
  ];

  // ---- boss battle (cooperative classroom event) ----
  const BOSS = {
    name: 'ราชันย์สมการ', en: 'The Equation Tyrant', subject: 'คณิตศาสตร์',
    hp: 3120, hpMax: 5000, icon: 'fire', hue: 22, ends: 'อีก 2 วัน', element: 'อสูรพีชคณิต',
    // how the class deals damage
    attacks: [
      { th: 'ตอบถูกในคาบเรียน', dmg: 25, icon: 'spark' },
      { th: 'ส่งการบ้านครบทั้งกลุ่ม', dmg: 60, icon: 'report' },
      { th: 'ชนะมินิเกมคณิต', dmg: 40, icon: 'game' },
      { th: 'ช่วยติวเพื่อน', dmg: 35, icon: 'heart' },
    ],
    // recent damage feed (studentIdx into STUDENTS, dmg, action)
    feed: [
      { who: 2, dmg: 60, act: 'ส่งการบ้านครบทั้งกลุ่ม', t: 'เมื่อสักครู่' },
      { who: 5, dmg: 40, act: 'ชนะมินิเกมคณิต', t: '1 นาทีที่แล้ว' },
      { who: 0, dmg: 25, act: 'ตอบถูกในคาบเรียน', t: '3 นาทีที่แล้ว' },
      { who: 8, dmg: 35, act: 'ช่วยติวเพื่อน', t: '4 นาทีที่แล้ว' },
      { who: 3, dmg: 25, act: 'ตอบถูกในคาบเรียน', t: '6 นาทีที่แล้ว' },
    ],
    rewards: [
      { th: 'ทั้งห้อง +500 XP', icon: 'bolt', hue: 200 },
      { th: 'ตราปราบราชันย์', icon: 'shield', hue: 22 },
      { th: 'กล่องสมบัติฤดูกาล', icon: 'gift', hue: 88 },
    ],
  };

  // ---- seasons (progression belongs to a season) ----
  const SEASONS = [
    { no: 1, th: 'การเดินทางสู่อาณาจักรคณิต', en: 'The Math Kingdom Expedition', state: 'active',  icon: 'calc',  hue: 265 },
    { no: 2, th: 'ลีกนักสำรวจวิทยาศาสตร์',     en: 'Science Explorer League',     state: 'locked',  icon: 'spark', hue: 160 },
    { no: 3, th: 'มหาสมุทรภาษาแห่งโลกกว้าง',   en: 'Language Ocean Voyage',       state: 'locked',  icon: 'book',  hue: 200 },
  ];
  // milestones along the active season track (xp threshold -> reward)
  const SEASON_TRACK = [
    { at: 0,      th: 'เปิดฤดูกาล',          icon: 'flag',   reward: 'ปลดล็อกดินแดนคณิต' },
    { at: 60000,  th: 'ด่านที่ 1 สำเร็จ',     icon: 'star',   reward: '+สติกเกอร์ฤดูกาล' },
    { at: 120000, th: 'ปลุกสัตว์เลี้ยงห้อง',   icon: 'fire',   reward: 'มังกรเลื่อนขั้น' },
    { at: 180000, th: 'เปิดศึกบอสราชันย์',     icon: 'shield', reward: 'ปลดล็อกบอสใหญ่' },
    { at: 230000, th: 'รางวัลใหญ่ฤดูกาล',     icon: 'gift',   reward: 'กล่องสมบัติทองคำ' },
    { at: 260000, th: 'พิชิตฤดูกาล',          icon: 'crown',  reward: 'ตราแชมป์ฤดูกาล' },
  ];

  // ---- kingdom map zones ----
  const KINGDOM_ZONES = [
    { key: 'castle',    th: 'ปราสาทหลวง',    sub: 'ศูนย์กลางอาณาจักร', route: null,        icon: 'crown',  hue: 50,  pos: [50, 47], size: 'lg' },
    { key: 'status',    th: 'หอสังเกตการณ์', sub: 'สถานะสด',          route: 'status',    icon: 'bolt',   hue: 200, pos: [50, 16] },
    { key: 'territory', th: 'ดินแดนความรู้', sub: '8 วิชา',           route: 'territory', icon: 'map',    hue: 160, pos: [20, 28] },
    { key: 'arena',     th: 'สนามประลอง',    sub: 'มินิเกม',          route: 'games',     icon: 'game',   hue: 305, pos: [80, 28] },
    { key: 'quests',    th: 'กระดานเควสต์',  sub: 'ภารกิจ',           route: 'quests',    icon: 'report', hue: 25,  pos: [15, 64] },
    { key: 'hall',      th: 'หอเกียรติยศ',   sub: 'Hall of Fame',     route: 'hall',      icon: 'trophy', hue: 50,  pos: [85, 64] },
    { key: 'shop',      th: 'ตลาดรางวัล',    sub: 'ร้านค้า',          route: 'shop',      icon: 'shop',   hue: 88,  pos: [33, 82] },
    { key: 'guild',     th: 'หอสมาคม',       sub: 'การ์ดฮีโร่',        route: 'guild',     icon: 'users',  hue: 270, pos: [67, 82] },
  ];

  window.GC = {
    STATUSES, LIVE, RANKS, TIERS, tierOf, SUBJECTS, REWARDS,
    STUDENTS, CLASS, WEEK_TREND,
    CLASS_XP, CLASS_LEVEL, SEASON, PET, QUESTS, ACHIEVEMENTS, KINGDOM_ZONES,
    BOSS, SEASONS, SEASON_TRACK,
  };
})();
