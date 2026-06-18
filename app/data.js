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

  // ---- guilds ----
  const GUILDS = [
    { key: 'fire',  th: 'กิลด์เพลิง', en: 'Fire Guild',  icon: 'fire',  hue: 22,  color: 'oklch(0.7 0.22 28)'  },
    { key: 'water', th: 'กิลด์น้ำ',   en: 'Water Guild', icon: 'drop',  hue: 220, color: 'oklch(0.7 0.18 225)' },
    { key: 'wind',  th: 'กิลด์ลม',    en: 'Wind Guild',  icon: 'spark', hue: 155, color: 'oklch(0.7 0.18 155)' },
    { key: 'earth', th: 'กิลด์ดิน',   en: 'Earth Guild', icon: 'map',   hue: 88,  color: 'oklch(0.7 0.18 88)'  },
  ];

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
      code: String(46201 + i),
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
      guild: GUILDS[i % 4].key,
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
      { id: 'd1', th: 'มาเรียนตรงเวลา',        icon: 'clock',  cur: 0, max: 1, reward: { xp: 20 } },
      { id: 'd2', th: 'ตอบคำถามในห้อง 3 ครั้ง',  icon: 'spark',  cur: 0, max: 3, reward: { xp: 30 } },
      { id: 'd3', th: 'ช่วยเหลือเพื่อน',         icon: 'heart',  cur: 0, max: 1, reward: { star: 1 } },
      { id: 'd4', th: 'ส่งการบ้านครบ',          icon: 'report', cur: 0, max: 1, reward: { coin: 15 } },
    ],
    weekly: [
      { id: 'w1', th: 'มาเรียนครบ 5 วัน',        icon: 'calendar', cur: 0, max: 5, reward: { xp: 120 } },
      { id: 'w2', th: 'อ่านหนังสือ 3 เล่ม',       icon: 'book',     cur: 0, max: 3, reward: { star: 5 } },
      { id: 'w3', th: 'สะสมแต้มกิจกรรม 200',      icon: 'bolt',     cur: 0, max: 200, reward: { coin: 80 } },
    ],
    season: [
      { id: 's1', th: 'พิชิตดินแดนคณิต 100%',     icon: 'calc',   cur: 0, max: 100, reward: { xp: 500 } },
      { id: 's2', th: 'ปราบบอสคณิตทั้งห้อง',      icon: 'shield', cur: 0, max: 1, reward: { badge: 'ตราปราบบอส' } },
      { id: 's3', th: 'มีสมาชิกขึ้น Hall of Fame', icon: 'trophy', cur: 0, max: 3, reward: { badge: 'ตราเกียรติยศ' } },
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

  // ---- pet mood (computed from real class data) ----
  const PET_MOODS = [
    { key: 'excited', th: 'ร่าเริงมาก', emoji: '🤩', hue: 88,  msg: 'พลังงานเต็มร้อย! ห้องเรียนยอดเยี่ยม' },
    { key: 'happy',   th: 'มีความสุข',  emoji: '😊', hue: 150, msg: 'อารมณ์ดี ทุกคนมาครบ' },
    { key: 'normal',  th: 'ปกติ',       emoji: '🙂', hue: 200, msg: 'สบายดี ไม่มีอะไรพิเศษ' },
    { key: 'hungry',  th: 'หิวโหย',    emoji: '😋', hue: 30,  msg: 'ยังไม่ได้รับ XP วันนี้เลย!' },
    { key: 'sleepy',  th: 'ง่วงนอน',   emoji: '😴', hue: 265, msg: 'มีคนขาดเรียนเยอะ...' },
    { key: 'sad',     th: 'เศร้า',      emoji: '😢', hue: 220, msg: 'ห้องเรียนเงียบเหงาจัง' },
  ];
  function getPetMood() {
    const ss = getStudents();
    const today = dateKey(new Date());
    const log = getScoreLog();
    const todayXP = log.filter(function(e) { return e.type === 'xp' && e.at && e.at.slice(0,10) === today; })
      .reduce(function(a,e) { return a + (Number(e.amount)||0); }, 0);
    const presentCount = ss.filter(function(s) { return s.status === 'present' || s.status === 'late' || s.status === 'activity'; }).length;
    const rate = ss.length ? presentCount / ss.length : 0;
    if (rate >= 0.9 && todayXP >= 100) return PET_MOODS[0];
    if (rate >= 0.7 && todayXP >= 20)  return PET_MOODS[1];
    if (rate < 0.5)                    return PET_MOODS[4];
    if (todayXP === 0)                 return PET_MOODS[3];
    if (rate < 0.6)                    return PET_MOODS[5];
    return PET_MOODS[2];
  }

  // ---- boss skills ----
  const BOSS_SKILLS = [
    { key: 'chaos_storm', th: 'พายุแห่งความโกลาหล', en: 'Chaos Storm',  desc: 'ลด HP ทีม 10% ทันที',      icon: 'spark',  hue: 305, duration: 0 },
    { key: 'shield_mode', th: 'โหมดโล่เหล็ก',       en: 'Shield Mode',  desc: 'ดาเมจลดครึ่งหนึ่ง 1 วัน',  icon: 'shield', hue: 200, duration: 1 },
    { key: 'rage',        th: 'ความพิโรธราชันย์',    en: 'Rage Mode',    desc: 'บอสโจมตีแรงขึ้น ×2',        icon: 'fire',   hue: 22,  duration: 2 },
    { key: 'heal',        th: 'ดูดกลืนชีวิต',        en: 'Life Drain',   desc: 'บอสฟื้น HP 15%',            icon: 'heart',  hue: 350, duration: 0 },
  ];
  const LS_BOSS_SKILL = 'gcos.boss.skill';
  function getActiveBossSkill() {
    try {
      var d = JSON.parse(localStorage.getItem(LS_BOSS_SKILL));
      if (!d) return null;
      if (d.expiresAt && new Date() > new Date(d.expiresAt)) { localStorage.removeItem(LS_BOSS_SKILL); return null; }
      return d;
    } catch(e) { return null; }
  }
  function triggerBossSkill(skillKey) {
    var skill = BOSS_SKILLS.find(function(s){ return s.key === skillKey; });
    if (!skill) return;
    var expiresAt = skill.duration > 0 ? new Date(Date.now() + skill.duration * 86400000).toISOString() : null;
    localStorage.setItem(LS_BOSS_SKILL, JSON.stringify(Object.assign({}, skill, { triggeredAt: new Date().toISOString(), expiresAt: expiresAt })));
    window.dispatchEvent(new CustomEvent('gc:students-changed'));
  }
  function clearBossSkill() {
    localStorage.removeItem(LS_BOSS_SKILL);
    window.dispatchEvent(new CustomEvent('gc:students-changed'));
  }

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

  // ---- class info CRUD with localStorage persistence ----
  const LS_CLASS = 'gcos.class.info';
  const CLASS_BASE = { name: CLASS.name, room: CLASS.room, teacher: CLASS.teacher, year: CLASS.year };

  function getClass() {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_CLASS));
      return saved ? { ...CLASS, ...saved } : CLASS;
    } catch { return CLASS; }
  }

  function updateClass(data) {
    const cur = getClass();
    const next = { ...cur, ...data };
    localStorage.setItem(LS_CLASS, JSON.stringify({ name: next.name, room: next.room, teacher: next.teacher, year: next.year }));
    window.dispatchEvent(new CustomEvent('gc:class-changed'));
  }

  // ---- student CRUD with localStorage persistence ----
  const LS_DEL = 'gcos.students.deleted';
  const LS_ADD = 'gcos.students.added';

  function loadDeleted() { try { return new Set(JSON.parse(localStorage.getItem(LS_DEL)) || []); } catch { return new Set(); } }
  function loadAdded()   { try { return JSON.parse(localStorage.getItem(LS_ADD)) || []; } catch { return []; } }

  // ---- score log ----
  const LS_SCORE = 'gcos.score.log';
  function getScoreLog() { try { return JSON.parse(localStorage.getItem(LS_SCORE)) || []; } catch { return []; } }
  function addScoreLog(entry) {
    const log = getScoreLog();
    log.unshift({ ...entry, at: Date.now() });
    localStorage.setItem(LS_SCORE, JSON.stringify(log.slice(0, 200)));
    // update student game stats so all modules stay in sync
    if (entry.studentId) {
      const all = getStudents();
      const s = all.find(x => x.id === entry.studentId);
      if (s) {
        const game = { ...s.game };
        const amt = Number(entry.amount) || 0;
        if (entry.type === 'xp') {
          game.xp = (game.xp || 0) + amt;
          while (game.xp >= (game.xpMax || 1000)) {
            game.xp -= (game.xpMax || 1000);
            game.level = (game.level || 1) + 1;
            game.tier = tierOf(game.level);
            game.rankIdx = Math.min(5, Math.floor(game.level / 4.2));
            game.rank = RANKS[game.rankIdx].key;
          }
        } else if (entry.type === 'coin') {
          game.coins = (game.coins || 0) + amt;
        } else if (entry.type === 'star') {
          game.stars = (game.stars || 0) + amt;
        }
        const ov = getOverrides();
        ov[entry.studentId] = { ...(ov[entry.studentId] || {}), game };
        localStorage.setItem(LS_OVERRIDES, JSON.stringify(ov));
      }
    }
    window.dispatchEvent(new CustomEvent('gc:score-added', { detail: entry }));
    window.dispatchEvent(new CustomEvent('gc:students-changed'));
  }

  // ---- student overrides (for updateStudent) ----
  const LS_OVERRIDES = 'gcos.students.overrides';
  function getOverrides() { try { return JSON.parse(localStorage.getItem(LS_OVERRIDES)) || {}; } catch { return {}; } }
  function updateStudent(id, data) {
    const ov = getOverrides();
    ov[id] = { ...(ov[id] || {}), ...data };
    localStorage.setItem(LS_OVERRIDES, JSON.stringify(ov));
    window.dispatchEvent(new CustomEvent('gc:students-changed'));
  }

  function makeStudent(data, idx) {
    const h = +(data.h || 130); const w = +(data.w || 28);
    const bmi = +(w / Math.pow(h / 100, 2)).toFixed(1);
    const nutrition = bmi < 14 ? 'ผอม' : bmi > 18.5 ? 'ท้วม' : 'สมส่วน';
    const terr = {};
    SUBJECTS.forEach(s => { terr[s.key] = 0; });
    return {
      id: data.id || ('C' + Date.now() + idx),
      no: data.no,
      code: data.code || String(50000 + Date.now() % 9999),
      name: data.name, nick: data.nick, gender: data.gender || 'm',
      status: 'present', live: 'present',
      welfare: { milk: false, brush: false, lunch: false },
      health: { w, h, bmi, nutrition, weightHist: [], heightHist: [] },
      game: { level: 1, xp: 0, xpMax: 1000, rank: 'bronze', rankIdx: 0,
        stars: 0, coins: 0, tier: tierOf(1), territories: terr,
        hue: Math.floor(Math.random() * 360) },
      badges: 0,
      _custom: true,
    };
  }

  function getStudents() {
    const deleted = loadDeleted();
    const added = loadAdded();
    const overrides = getOverrides();
    const base = STUDENTS.filter(s => !deleted.has(s.id)).map(s =>
      overrides[s.id] ? { ...s, ...overrides[s.id],
        health: { ...s.health, ...(overrides[s.id].health || {}) } } : s
    );
    const custom = added.map((d, i) => {
      const s = makeStudent(d, i);
      return overrides[s.id] ? { ...s, ...overrides[s.id] } : s;
    });
    return [...base, ...custom];
  }

  function addStudent(data) {
    const added = loadAdded();
    const all = getStudents();
    data.no = all.length + 1;
    data.id = 'C' + Date.now();
    added.push(data);
    localStorage.setItem(LS_ADD, JSON.stringify(added));
    window.dispatchEvent(new CustomEvent('gc:students-changed'));
  }

  function deleteStudent(id) {
    const deleted = loadDeleted();
    deleted.add(id);
    localStorage.setItem(LS_DEL, JSON.stringify([...deleted]));
    // also remove from added list if it's a custom student
    const added = loadAdded().filter(d => d.id !== id);
    localStorage.setItem(LS_ADD, JSON.stringify(added));
    window.dispatchEvent(new CustomEvent('gc:students-changed'));
  }

  // ---- full academic year attendance history ----
  // ปีการศึกษา 2568: เทอม 1 = 19 พ.ค. 68 - 10 ต.ค. 68
  //                   เทอม 2 = 3 พ.ย. 68 - 20 มี.ค. 69 (= CE 2025-2026)
  // Today in app = 29 May 2026 (CE) = first weeks of next academic year
  const YEAR_START = new Date(2025, 4, 19);  // 19 May 2025
  const YEAR_END   = new Date(2026, 4, 29);  // 29 May 2026 (today)

  // Thai public holidays to skip (MM-DD format, year-agnostic)
  const HOLIDAYS = new Set([
    '05-05','06-03','07-28','08-12','10-13','10-23','12-05','12-10','12-31',
    '01-01','01-13','02-26','04-06','04-13','04-14','04-15','05-01','05-12',
  ]);

  function isSchoolDay(d) {
    const day = d.getDay();
    if (day === 0 || day === 6) return false;
    const mmdd = String(d.getMonth() + 1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    if (HOLIDAYS.has(mmdd)) return false;
    // semester break: Oct 11 - Nov 2, and Mar 21 - May 18
    const m = d.getMonth() + 1, dt = d.getDate();
    if ((m === 10 && dt >= 11) || m === 11 && dt <= 2) return false;
    if ((m === 3 && dt >= 21) || m === 4 || (m === 5 && dt <= 18)) return false;
    return true;
  }

  function dateKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  // deterministic seeded status per student per day
  const STATUS_POOL = ['present','present','present','present','present','present','present','late','absent','sick','leave','activity'];
  function seededStatus(studentIdx, dayOffset) {
    const x = Math.sin(studentIdx * 127.1 + dayOffset * 311.7) * 43758.5453;
    return STATUS_POOL[Math.abs(Math.floor(x * 1000) % STATUS_POOL.length)];
  }
  function seededBool(studentIdx, dayOffset, salt) {
    const x = Math.sin(studentIdx * 91.3 + dayOffset * 173.1 + salt) * 43758.5453;
    return (x - Math.floor(x)) > 0.25;
  }

  const ATTENDANCE_HISTORY = {};
  const LS_ATT = 'gcos.att';

  let _dayOffset = 0;
  const _iter = new Date(YEAR_START);
  while (_iter <= YEAR_END) {
    if (isSchoolDay(_iter)) {
      const key = dateKey(_iter);
      const off = _dayOffset;
      ATTENDANCE_HISTORY[key] = STUDENTS.map((s, i) => ({
        id: s.id,
        status: seededStatus(i, off),
        milk:  seededBool(i, off, 1),
        brush: seededBool(i, off, 2),
        lunch: seededBool(i, off, 3),
      }));
      _dayOffset++;
    }
    _iter.setDate(_iter.getDate() + 1);
  }

  function getAttendance(dateStr) {
    const LS_KEY = LS_ATT + '.' + dateStr;
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // merge history with current students (add new, drop deleted)
    const students = getStudents();
    const hist = ATTENDANCE_HISTORY[dateStr] || [];
    const histMap = Object.fromEntries(hist.map(r => [r.id, r]));
    return students.map(s => histMap[s.id] || { id: s.id, status: 'present', milk: true, brush: true, lunch: true });
  }

  function saveAttendance(dateStr, rows) {
    try { localStorage.setItem(LS_ATT + '.' + dateStr, JSON.stringify(rows)); } catch {}
  }

  // ---- student attendance summary (counts per status for the academic year) ----
  function getStudentAttendanceSummary(id) {
    const counts = { present: 0, late: 0, sick: 0, leave: 0, activity: 0, absent: 0 };
    // saved localStorage dates take precedence over seeded data for that date
    const savedDates = new Set();
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LS_ATT + '.')) {
        const dateStr = k.replace(LS_ATT + '.', '');
        savedDates.add(dateStr);
        try {
          const rows = JSON.parse(localStorage.getItem(k)) || [];
          const r = rows.find(x => x.id === id);
          if (r) counts[r.status] = (counts[r.status] || 0) + 1;
        } catch {}
      }
    }
    // seeded history for dates not overridden
    for (const dateStr in ATTENDANCE_HISTORY) {
      if (savedDates.has(dateStr)) continue;
      const r = ATTENDANCE_HISTORY[dateStr].find(x => x.id === id);
      if (r) counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return counts;
  }

  // ---- class-wide totals (reactive — reads from getStudents) ----
  function getClassTotals() {
    const ss = getStudents();
    return {
      stars: ss.reduce((a, s) => a + (s.game.stars || 0), 0),
      coins: ss.reduce((a, s) => a + (s.game.coins || 0), 0),
      medals: ss.reduce((a, s) => a + (s.badges || 0), 0),
      classXP: ss.reduce((a, s) => a + s.game.level * 1000 + s.game.xp, 0),
    };
  }

  // ---- custom rewards (teacher-created) ----
  const LS_CUSTOM_REWARDS = 'gcos.rewards.custom';
  function getCustomRewards() { try { return JSON.parse(localStorage.getItem(LS_CUSTOM_REWARDS)) || []; } catch { return []; } }
  function addCustomReward(r) {
    const list = getCustomRewards();
    list.push({ ...r, id: 'cr' + Date.now() });
    localStorage.setItem(LS_CUSTOM_REWARDS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('gc:rewards-changed'));
  }

  // list all school days between two dates
  function getSchoolDays(from, to) {
    const days = [];
    const d = new Date(from);
    while (d <= to) {
      if (isSchoolDay(d)) days.push(dateKey(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }

  // ---- daily random event (deterministic per date) ----
  const DAILY_EVENTS = [
    { key: 'xp2',      th: '🌈 Rainbow Day',   desc: 'XP ทุกกิจกรรมวันนี้ ×2',     icon: 'spark',  hue: 305 },
    { key: 'treasure', th: '💎 Treasure Day',   desc: 'สุ่มเหรียญพิเศษเมื่อเช็คชื่อ', icon: 'coin',   hue: 50  },
    { key: 'stars',    th: '⭐ Star Shower',     desc: 'ดาวทุกรางวัลเพิ่มเป็น 2×',    icon: 'star',   hue: 88  },
    { key: 'quest',    th: '📜 Quest Blitz',     desc: 'เควสต์วันนี้ให้ XP +50%',      icon: 'report', hue: 160 },
    { key: 'boss',     th: '🐉 Boss Rush',       desc: 'HP บอสลดลง 30% วันนี้',        icon: 'fire',   hue: 22  },
    null, null, null, null,
  ];
  function getDailyEvent() {
    const today = dateKey(new Date());
    const parts = today.split('-').map(Number);
    const hash = (parts[0] * 31 + parts[1] * 7 + parts[2]) % DAILY_EVENTS.length;
    return DAILY_EVENTS[hash];
  }

  // ---- guild stats (reactive) ----
  function getGuildStats() {
    const ss = getStudents();
    return GUILDS.map(function(g) {
      const members = ss.filter(function(s) { return s.guild === g.key; });
      const xp = members.reduce(function(a, s) { return a + s.game.level * 1000 + s.game.xp; }, 0);
      const stars = members.reduce(function(a, s) { return a + s.game.stars; }, 0);
      const coins = members.reduce(function(a, s) { return a + s.game.coins; }, 0);
      const sorted = [...members].sort(function(a, b) { return (b.game.level * 1000 + b.game.xp) - (a.game.level * 1000 + a.game.xp); });
      return Object.assign({}, g, { members: sorted, xp: xp, stars: stars, coins: coins, mvp: sorted[0] });
    }).sort(function(a, b) { return b.xp - a.xp; });
  }

  // ---- class-level achievements ----
  const LS_CLASS_ACH = 'gcos.class.achievements';
  const CLASS_ACHIEVEMENTS = [
    { key: 'attend_all',  th: 'เข้าเรียนครบทั้งห้อง',          icon: 'check',  hue: 150, badge: 'Perfect Attendance', reward: '+500 XP ห้อง', condition: function(ss) { return ss.every(function(s) { return s.status !== 'absent'; }); } },
    { key: 'stars100',    th: 'ดาวรวม 100 ดวง',                 icon: 'star',   hue: 50,  badge: 'Star Collective',    reward: '+300 XP ห้อง', condition: function(ss) { return ss.reduce(function(a,s) { return a+s.game.stars; },0) >= 100; } },
    { key: 'level10x5',   th: 'นักเรียน 5 คน ขึ้น Lv.10+',     icon: 'crown',  hue: 265, badge: 'Rising Stars',       reward: '+200 XP ห้อง', condition: function(ss) { return ss.filter(function(s){ return s.game.level >= 10; }).length >= 5; } },
    { key: 'nogap',       th: 'ไม่มีใครขาด (วันนี้)',           icon: 'shield', hue: 88,  badge: 'Shield of Unity',    reward: '+400 XP ห้อง', condition: function(ss) { return ss.every(function(s) { return s.status !== 'absent'; }); } },
    { key: 'coins5000',   th: 'เหรียญรวม 5,000+',               icon: 'coin',   hue: 50,  badge: 'Treasure Vault',     reward: 'กล่องสมบัติ',   condition: function(ss) { return ss.reduce(function(a,s){return a+s.game.coins;},0) >= 5000; } },
    { key: 'territory50', th: 'ทุกดินแดนเฉลี่ย 50%+',           icon: 'map',    hue: 200, badge: 'World Explorers',    reward: 'ตราสำรวจโลก',   condition: function(ss) { return SUBJECTS.every(function(sub) { return ss.reduce(function(a,s){return a+(s.game.territories[sub.key]||0);},0)/ss.length >= 50; }); } },
    { key: 'allguild',    th: 'ทุกกิลด์มีสมาชิก Lv.5+',        icon: 'fire',   hue: 22,  badge: 'Alliance of Power',  reward: '+250 XP ทุกคน', condition: function(ss) { return GUILDS.every(function(g) { return ss.filter(function(s){ return s.guild===g.key && s.game.level>=5; }).length >= 1; }); } },
    { key: 'badges20',    th: 'เหรียญตราสะสม 20+',              icon: 'trophy', hue: 280, badge: 'Badge Hunters',      reward: 'ของรางวัลพิเศษ', condition: function(ss) { return ss.reduce(function(a,s){return a+(s.badges||0);},0) >= 20; } },
  ];
  function getClassAchievements() {
    const ss = getStudents();
    var claimed = [];
    try { claimed = JSON.parse(localStorage.getItem(LS_CLASS_ACH)) || []; } catch(e) {}
    return CLASS_ACHIEVEMENTS.map(function(a) {
      return Object.assign({}, a, { done: a.condition(ss), claimed: claimed.includes(a.key) });
    });
  }
  function claimClassAchievement(key) {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(LS_CLASS_ACH)) || []; } catch(e) {}
    if (!list.includes(key)) {
      list.push(key);
      localStorage.setItem(LS_CLASS_ACH, JSON.stringify(list));
    }
    window.dispatchEvent(new CustomEvent('gc:students-changed'));
  }

  // ---- titles (earned by meeting conditions, highest match wins) ----
  const TITLES = [
    { key: 'newcomer',   th: 'นักสำรวจรุ่นใหม่',    en: 'New Explorer',       hue: 200, icon: 'map',    condition: s => s.game.level >= 1 },
    { key: 'reader',     th: 'ราชานักอ่าน',          en: 'Reading King',        hue: 12,  icon: 'book',   condition: s => (s.game.territories?.thai  || 0) >= 60 },
    { key: 'mathwizard', th: 'จอมเวทคณิตศาสตร์',    en: 'Math Wizard',         hue: 265, icon: 'calc',   condition: s => (s.game.territories?.math  || 0) >= 60 },
    { key: 'helper',     th: 'ผู้พิทักษ์มิตรภาพ',    en: 'Guardian of Friends', hue: 350, icon: 'heart',  condition: s => (s.game.stars  || 0) >= 20 },
    { key: 'guardian',   th: 'ผู้พิทักษ์ความรู้',    en: 'Knowledge Guardian',  hue: 150, icon: 'shield', condition: s => s.game.level >= 10 },
    { key: 'champion',   th: 'แชมป์แห่งอาณาจักร',   en: 'Kingdom Champion',    hue: 50,  icon: 'crown',  condition: s => s.game.level >= 20 },
    { key: 'grandmaster',th: 'มหาจอมยุทธ์',          en: 'Grand Master',        hue: 280, icon: 'spark',  condition: s => s.game.level >= 20 && (s.game.xp || 0) >= 800 },
  ];
  function getTitleForStudent(s) {
    const matched = TITLES.filter(t => t.condition(s));
    return matched[matched.length - 1] || TITLES[0];
  }

  // ---- consecutive present-day streak ----
  function getStudentStreak(studentId) {
    const present = new Set(['present', 'late', 'activity']);
    const saved = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(LS_ATT + '.')) continue;
      const dateStr = k.replace(LS_ATT + '.', '');
      try {
        const rows = JSON.parse(localStorage.getItem(k)) || [];
        const r = rows.find(function(x) { return x.id === studentId; });
        if (r) saved[dateStr] = r.status;
      } catch (e) {}
    }
    // merge seeded history (not overridden by saved)
    const all = {};
    Object.keys(ATTENDANCE_HISTORY).forEach(function(d) {
      const r = ATTENDANCE_HISTORY[d].find(function(x) { return x.id === studentId; });
      if (r) all[d] = r.status;
    });
    Object.keys(saved).forEach(function(d) { all[d] = saved[d]; });
    const sorted = Object.keys(all).sort(function(a, b) { return b.localeCompare(a); });
    let streak = 0, prev = null;
    for (let i = 0; i < sorted.length; i++) {
      const date = sorted[i];
      if (!present.has(all[date])) break;
      if (prev) {
        const diff = Math.round((new Date(prev) - new Date(date)) / 86400000);
        if (diff > 3) break;
      }
      streak++;
      prev = date;
    }
    return streak;
  }

  // ---- dashboard summary helpers ----
  function getSubjectAverages() {
    const ss = getStudents();
    return SUBJECTS.map(function (sub) {
      const avg = ss.length ? Math.round(ss.reduce(function (a, s) { return a + (s.game.territories[sub.key] || 0); }, 0) / ss.length) : 0;
      return Object.assign({}, sub, { avg: avg });
    });
  }

  function getBehaviorSummary() {
    const ss = getStudents();
    const totalStars = ss.reduce(function (a, s) { return a + (s.game.stars || 0); }, 0);
    return { totalStars: totalStars, avgStars: ss.length ? +(totalStars / ss.length).toFixed(1) : 0, maxStars: 50 };
  }

  function getXPCoinTotals() {
    const ss = getStudents();
    return {
      xp: ss.reduce(function (a, s) { return a + (s.game.xp || 0); }, 0),
      coins: ss.reduce(function (a, s) { return a + (s.game.coins || 0); }, 0),
    };
  }

  const CALENDAR_EVENTS = [
    { date: '2026-05-30', th: 'ส่งแบบฝึกหัดคณิตศาสตร์', icon: 'book',     kind: 'academic' },
    { date: '2026-06-02', th: 'เยี่ยมบ้านนักเรียน',        icon: 'door',     kind: 'visit' },
    { date: '2026-06-06', th: 'ประชุมผู้ปกครองภาคเรียนที่ 1', icon: 'users', kind: 'meeting' },
    { date: '2026-06-10', th: 'สอบกลางภาค',                icon: 'report',  kind: 'exam' },
    { date: '2026-06-15', th: 'กำหนดชำระค่าทัศนศึกษา',     icon: 'coin',    kind: 'finance' },
    { date: '2026-06-20', th: 'กิจกรรมวันไหว้ครู',         icon: 'heart',   kind: 'event' },
  ];
  function getUpcomingEvents(limit) {
    const today = dateKey(YEAR_END); // app "today" = 2026-05-29
    return CALENDAR_EVENTS.filter(function (e) { return e.date >= today; }).slice(0, limit || 5);
  }

  // ---- classroom finance: student savings + class income/expense ledger ----
  const FINANCE_CATEGORIES = {
    income:  [{ key: 'fundraise', th: 'กิจกรรมระดมทุน' }, { key: 'donation', th: 'เงินบริจาค' }, { key: 'fee', th: 'ค่าธรรมเนียมกิจกรรม' }],
    expense: [{ key: 'supplies', th: 'อุปกรณ์การเรียน' }, { key: 'snack', th: 'ขนม/อาหารกิจกรรม' }, { key: 'fieldtrip', th: 'ทัศนศึกษา' }, { key: 'reward', th: 'ของรางวัล' }],
  };
  const FINANCE_SAVINGS_SEED = STUDENTS.map(function (s, i) { return { studentId: s.id, base: seeded(i + 60, 80, 650) }; });
  const LS_FIN_SAVE = 'gcos.finance.savings';
  const LS_FIN_LEDGER = 'gcos.finance.ledger';
  const LEDGER_SEED = [
    { id: 'L1', type: 'income',  category: 'fundraise', amount: 850, note: 'ขายของในงานกีฬาสี', date: '2026-05-10' },
    { id: 'L2', type: 'expense', category: 'supplies',  amount: 320, note: 'ซื้อสมุด-ดินสอกองกลาง', date: '2026-05-14' },
    { id: 'L3', type: 'income',  category: 'fee',       amount: 1600, note: 'เก็บค่าทัศนศึกษารอบแรก', date: '2026-05-20' },
    { id: 'L4', type: 'expense', category: 'reward',    amount: 240, note: 'ของรางวัลกล่องสุ่มประจำสัปดาห์', date: '2026-05-25' },
  ];
  function getSavingsTxns() { try { return JSON.parse(localStorage.getItem(LS_FIN_SAVE)) || []; } catch (e) { return []; } }
  function addSavingsTxn(t) {
    const list = getSavingsTxns();
    list.unshift(Object.assign({}, t, { id: 'SV' + Date.now(), at: Date.now() }));
    localStorage.setItem(LS_FIN_SAVE, JSON.stringify(list.slice(0, 400)));
    window.dispatchEvent(new CustomEvent('gc:finance-changed'));
  }
  function getSavingsBalances() {
    const ss = getStudents();
    const seedMap = {}; FINANCE_SAVINGS_SEED.forEach(function (f) { seedMap[f.studentId] = f.base; });
    const adj = {};
    getSavingsTxns().forEach(function (t) {
      adj[t.studentId] = (adj[t.studentId] || 0) + (t.kind === 'deposit' ? Number(t.amount) || 0 : -(Number(t.amount) || 0));
    });
    return ss.map(function (s) { return { student: s, balance: Math.max(0, (seedMap[s.id] || 0) + (adj[s.id] || 0)) }; });
  }
  function getLedger() { try { return JSON.parse(localStorage.getItem(LS_FIN_LEDGER)) || LEDGER_SEED; } catch (e) { return LEDGER_SEED; } }
  function addLedgerEntry(entry) {
    const list = getLedger();
    localStorage.setItem(LS_FIN_LEDGER, JSON.stringify([Object.assign({}, entry, { id: 'L' + Date.now() }), ...list]));
    window.dispatchEvent(new CustomEvent('gc:finance-changed'));
  }
  function getFinanceSummary() {
    const ledger = getLedger();
    const income = ledger.filter(function (t) { return t.type === 'income'; }).reduce(function (a, t) { return a + (Number(t.amount) || 0); }, 0);
    const expense = ledger.filter(function (t) { return t.type === 'expense'; }).reduce(function (a, t) { return a + (Number(t.amount) || 0); }, 0);
    const totalSavings = getSavingsBalances().reduce(function (a, r) { return a + r.balance; }, 0);
    return { income: income, expense: expense, net: income - expense, totalSavings: totalSavings };
  }

  // ---- health: vaccination records ----
  const VACCINE_LIST = ['คอตีบ-บาดทะยัก-ไอกรน (DTP)', 'โปลิโอ (OPV)', 'หัด-คางทูม-หัดเยอรมัน (MMR)', 'ไข้สมองอักเสบเจอี (JE)', 'ไข้หวัดใหญ่ตามฤดูกาล'];
  const VACCINATIONS = STUDENTS.map(function (s, i) {
    return {
      studentId: s.id,
      records: VACCINE_LIST.map(function (v, k) {
        const done = seeded(i * 7 + k, 0, 10) > 2;
        return { vaccine: v, done: done, date: done ? ('25' + (65 + (k % 3)) + '-0' + ((k % 9) + 1) + '-1' + k) : null };
      }),
    };
  });
  function getVaccinationRecord(studentId) { return VACCINATIONS.find(function (v) { return v.studentId === studentId; }); }
  function getVaccinationCoverage() {
    const total = VACCINATIONS.length * VACCINE_LIST.length;
    const done = VACCINATIONS.reduce(function (a, v) { return a + v.records.filter(function (r) { return r.done; }).length; }, 0);
    return { total: total, done: done, pct: total ? Math.round(done / total * 100) : 0 };
  }

  // ---- home visits ----
  const LS_HOME_VISIT = 'gcos.homevisits';
  const HOME_VISIT_SEED = [
    { id: 'HV1', studentId: STUDENTS[4].id,  date: '2026-05-12', purpose: 'ติดตามการขาดเรียนบ่อย',     notes: 'พบผู้ปกครอง แจ้งเหตุผลครอบครัวย้ายที่พัก ตกลงให้มาเรียนปกติสัปดาห์หน้า', status: 'เสร็จสิ้น' },
    { id: 'HV2', studentId: STUDENTS[10].id, date: '2026-05-20', purpose: 'ปัญหาด้านการเงินที่บ้าน',    notes: 'ประสานทุนการศึกษาเพิ่มเติมให้กับครอบครัว',                         status: 'ติดตามต่อ' },
    { id: 'HV3', studentId: STUDENTS[1].id,  date: '2026-06-02', purpose: 'เยี่ยมบ้านประจำภาคเรียน',     notes: '',                                                                  status: 'นัดหมายแล้ว' },
  ];
  function getHomeVisits() { try { return JSON.parse(localStorage.getItem(LS_HOME_VISIT)) || HOME_VISIT_SEED; } catch (e) { return HOME_VISIT_SEED; } }
  function addHomeVisit(v) {
    const list = getHomeVisits();
    localStorage.setItem(LS_HOME_VISIT, JSON.stringify([Object.assign({}, v, { id: 'HV' + Date.now() }), ...list]));
    window.dispatchEvent(new CustomEvent('gc:homevisits-changed'));
  }

  // ---- documents ----
  const LS_DOCS = 'gcos.documents';
  const DOC_SEED = [
    { id: 'D1', name: 'รายชื่อนักเรียน ป.4-2568.xlsx',          cat: 'รายชื่อ',    date: '2026-05-15', size: '48 KB',  icon: 'report' },
    { id: 'D2', name: 'แบบฟอร์มขออนุญาตทัศนศึกษา.pdf',          cat: 'แบบฟอร์ม',   date: '2026-05-20', size: '212 KB', icon: 'note' },
    { id: 'D3', name: 'รายงานพัฒนาการนักเรียน เทอม 2.pdf',       cat: 'รายงาน',     date: '2026-05-22', size: '1.1 MB', icon: 'chart' },
    { id: 'D4', name: 'บันทึกการประชุมผู้ปกครอง.docx',          cat: 'บันทึก',     date: '2026-05-25', size: '96 KB',  icon: 'book' },
    { id: 'D5', name: 'แผนการสอนหน่วยที่ 5.pdf',                cat: 'แผนการสอน',  date: '2026-05-27', size: '640 KB', icon: 'book' },
  ];
  function getDocuments() { try { return JSON.parse(localStorage.getItem(LS_DOCS)) || DOC_SEED; } catch (e) { return DOC_SEED; } }
  function addDocument(d) {
    const list = getDocuments();
    localStorage.setItem(LS_DOCS, JSON.stringify([Object.assign({}, d, { id: 'D' + Date.now() }), ...list]));
    window.dispatchEvent(new CustomEvent('gc:documents-changed'));
  }
  function deleteDocument(id) {
    localStorage.setItem(LS_DOCS, JSON.stringify(getDocuments().filter(function (d) { return d.id !== id; })));
    window.dispatchEvent(new CustomEvent('gc:documents-changed'));
  }

  // ---- parent communication: announcements + homework ----
  const LS_ANN = 'gcos.announcements';
  const ANN_SEED = [
    { id: 'A1', title: 'ปิดเทอมภาคฤดูร้อน',                     body: 'แจ้งปิดภาคเรียนวันที่ 21 มี.ค. - 18 พ.ค. 2569 ขอให้นักเรียนเตรียมตัวเปิดเทอมใหม่', date: '2026-05-10', audience: 'ทุกคน' },
    { id: 'A2', title: 'นัดประชุมผู้ปกครองภาคเรียนที่ 1',        body: 'ขอเชิญผู้ปกครองเข้าร่วมประชุมวันเสาร์ที่ 6 มิ.ย. 2569 เวลา 09:00 น. ณ ห้องประชุมโรงเรียน', date: '2026-05-28', audience: 'ทุกคน' },
    { id: 'A3', title: 'แจ้งค่าธรรมเนียมกิจกรรมทัศนศึกษา',       body: 'กรุณาชำระเงินผ่านครูประจำชั้นภายในวันที่ 15 มิ.ย. 2569',                              date: '2026-06-01', audience: 'ทุกคน' },
  ];
  function getAnnouncements() { try { return JSON.parse(localStorage.getItem(LS_ANN)) || ANN_SEED; } catch (e) { return ANN_SEED; } }
  function addAnnouncement(a) {
    const list = getAnnouncements();
    localStorage.setItem(LS_ANN, JSON.stringify([Object.assign({}, a, { id: 'A' + Date.now(), date: dateKey(new Date()) }), ...list]));
    window.dispatchEvent(new CustomEvent('gc:announcements-changed'));
  }

  const LS_HW = 'gcos.homework';
  const HW_SEED = [
    { id: 'H1', subject: 'คณิตศาสตร์',     title: 'แบบฝึกหัดเศษส่วน หน้า 24-26',     due: '2026-06-05' },
    { id: 'H2', subject: 'ภาษาไทย',        title: 'คัดลายมือบทอาขยาน',               due: '2026-06-03' },
    { id: 'H3', subject: 'วิทยาศาสตร์',    title: 'ใบงานวงจรชีวิตผีเสื้อ',           due: '2026-06-08' },
  ];
  function getHomework() { try { return JSON.parse(localStorage.getItem(LS_HW)) || HW_SEED; } catch (e) { return HW_SEED; } }
  function addHomework(h) {
    const list = getHomework();
    localStorage.setItem(LS_HW, JSON.stringify([Object.assign({}, h, { id: 'H' + Date.now() }), ...list]));
    window.dispatchEvent(new CustomEvent('gc:homework-changed'));
  }

  // ---- reactive achievements (computed from live student data) ----
  function getAchievements() {
    const ss = getStudents();
    function topBy(fn) { return [...ss].sort(function(a, b) { return fn(b) - fn(a); })[0]; }
    const log = getScoreLog();
    const entriesById = {};
    log.forEach(function(e) { if (e.studentId) entriesById[e.studentId] = (entriesById[e.studentId] || 0) + 1; });
    const topEntries = [...ss].sort(function(a, b) { return (entriesById[b.id] || 0) - (entriesById[a.id] || 0); })[0];
    // compute streaks once per student to avoid redundant localStorage scans
    const streakMap = {};
    ss.forEach(function(s) { streakMap[s.id] = getStudentStreak(s.id); });
    const topStreak = [...ss].sort(function(a, b) { return (streakMap[b.id] || 0) - (streakMap[a.id] || 0); })[0];
    return [
      { key: 'mvp',        th: 'MVP แห่งฤดูกาล',    icon: 'crown',  hue: 50,  holder: topBy(function(s) { return s.game.level * 1000 + s.game.xp; }) },
      { key: 'helper',     th: 'ผู้ช่วยยอดเยี่ยม',   icon: 'heart',  hue: 350, holder: topBy(function(s) { return s.game.stars; }) },
      { key: 'reader',     th: 'ราชานักอ่าน',        icon: 'book',   hue: 12,  holder: topBy(function(s) { return s.game.territories.thai; }) },
      { key: 'mathwizard', th: 'จอมเวทคณิตศาสตร์',  icon: 'calc',   hue: 265, holder: topBy(function(s) { return s.game.territories.math; }) },
      { key: 'attend',     th: 'ฮีโร่มาเรียน',       icon: 'check',  hue: 150, holder: topBy(function(s) { return (s.status === 'present' ? 100 : 0) + s.badges; }) },
      { key: 'coder',      th: 'ฮีโร่เทคโนโลยี',    icon: 'tool',   hue: 230, holder: topBy(function(s) { return s.game.territories.career; }) },
      { key: 'quester',    th: 'นักล่าเควสต์',       icon: 'report', hue: 88,  holder: topEntries },
      { key: 'streak',     th: 'ราชาสายขยัน',        icon: 'fire',   hue: 22,  holder: topStreak },
    ];
  }

  window.GC = {
    STATUSES, LIVE, RANKS, TIERS, tierOf, SUBJECTS, REWARDS,
    STUDENTS, CLASS, WEEK_TREND,
    CLASS_XP, CLASS_LEVEL, SEASON, PET, QUESTS, ACHIEVEMENTS, KINGDOM_ZONES,
    BOSS, SEASONS, SEASON_TRACK,
    GUILDS, DAILY_EVENTS, CLASS_ACHIEVEMENTS, BOSS_SKILLS, PET_MOODS,
    getDailyEvent, getGuildStats, getClassAchievements, claimClassAchievement,
    getPetMood, getActiveBossSkill, triggerBossSkill, clearBossSkill,
    TITLES, getTitleForStudent, getStudentStreak, getAchievements,
    getStudents, addStudent, deleteStudent, updateStudent,
    getClass, updateClass,
    getScoreLog, addScoreLog,
    getStudentAttendanceSummary, getClassTotals,
    getCustomRewards, addCustomReward,
    ATTENDANCE_HISTORY, getAttendance, saveAttendance, getSchoolDays,
    YEAR_START, YEAR_END, isSchoolDay, dateKey,

    // Teacher Classroom OS additions
    getSubjectAverages, getBehaviorSummary, getXPCoinTotals,
    CALENDAR_EVENTS, getUpcomingEvents,
    FINANCE_CATEGORIES, getSavingsTxns, addSavingsTxn, getSavingsBalances,
    getLedger, addLedgerEntry, getFinanceSummary,
    VACCINE_LIST, getVaccinationRecord, getVaccinationCoverage,
    getHomeVisits, addHomeVisit,
    getDocuments, addDocument, deleteDocument,
    getAnnouncements, addAnnouncement, getHomework, addHomework,
  };
})();
