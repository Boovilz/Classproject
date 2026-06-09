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

  window.GC = {
    STATUSES, LIVE, RANKS, TIERS, tierOf, SUBJECTS, REWARDS,
    STUDENTS, CLASS, WEEK_TREND,
    CLASS_XP, CLASS_LEVEL, SEASON, PET, QUESTS, ACHIEVEMENTS, KINGDOM_ZONES,
    BOSS, SEASONS, SEASON_TRACK,
    getStudents, addStudent, deleteStudent, updateStudent,
    getClass, updateClass,
    getScoreLog, addScoreLog,
    getStudentAttendanceSummary, getClassTotals,
    getCustomRewards, addCustomReward,
    ATTENDANCE_HISTORY, getAttendance, saveAttendance, getSchoolDays,
    YEAR_START, YEAR_END, isSchoolDay, dateKey,
  };
})();
