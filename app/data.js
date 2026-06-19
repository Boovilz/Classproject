/* ============================================================
   CLASSROOM OS — data layer
   Static config + seed data stay local. Everything a teacher edits
   (roster, attendance, homework, finance, announcements, ...) is
   backed by Supabase (Postgres + Realtime) so it is shared across
   every device, not just one browser's localStorage.
   Attached to window for cross-file access — same window.GC shape
   as before, so no page/component needs to change.
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

  // statuses that count as "came to school" — used to gate the milk/brush/lunch welfare fields
  const PRESENT_LIKE = ['present', 'late', 'activity'];

  // ---- realtime live statuses ----
  const LIVE = {
    present:  { th: 'อยู่ในห้อง', color: 'var(--st-present)', icon: 'seat' },
    restroom: { th: 'เข้าห้องน้ำ', color: 'var(--st-late)', icon: 'door' },
    water:    { th: 'ดื่มน้ำ', color: 'var(--st-platinum, var(--st-leave))', icon: 'drop' },
    nurse:    { th: 'ห้องพยาบาล', color: 'var(--st-absent)', icon: 'cross' },
    sick:     { th: 'ไม่สบาย', color: 'var(--st-sick)', icon: 'thermometer' },
    leave:    { th: 'ลา', color: 'var(--muted)', icon: 'note' },
  };

  // ---- 8 subjects (academic performance by subject) ----
  const SUBJECTS = [
    { key: 'thai',    th: 'ภาษาไทย',          icon: 'book',  hue: 12,  pos: [50, 18] },
    { key: 'math',    th: 'คณิตศาสตร์',       icon: 'calc',  hue: 265, pos: [70, 30] },
    { key: 'sci',     th: 'วิทยาศาสตร์',      icon: 'flask', hue: 160, pos: [30, 34] },
    { key: 'social',  th: 'สังคมศึกษา',       icon: 'globe', hue: 200, pos: [62, 50] },
    { key: 'eng',     th: 'ภาษาอังกฤษ',       icon: 'lang',  hue: 305, pos: [34, 56] },
    { key: 'art',     th: 'ศิลปะ',            icon: 'brush', hue: 330, pos: [54, 70] },
    { key: 'pe',      th: 'สุขศึกษา · พลศึกษา', icon: 'run', hue: 88,  pos: [40, 80] },
    { key: 'career',  th: 'การงานอาชีพ',      icon: 'tool',  hue: 230, pos: [60, 88] },
  ];

  // ---- students (seed — used only to bootstrap a brand-new Supabase project) ----
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

  const SEED_STUDENTS = NAMES.map((n, i) => {
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
      territories: terr,
      custom: false,
      deleted: false,
    };
  });

  // class-level derived stats (from the seed roster)
  function countStatus(k) { return SEED_STUDENTS.filter(s => s.status === k).length; }
  const CLASS_SEED = {
    name: 'ป.4/2', room: 'อาคาร 2 ห้อง 204',
    teacher: 'ครูมานี รักเรียน', year: 'ปีการศึกษา 2568',
  };
  const CLASS = Object.assign({}, CLASS_SEED, {
    total: SEED_STUDENTS.length,
    summary: {
      present: countStatus('present') + countStatus('late'),
      absent: countStatus('absent'),
      sick: countStatus('sick'),
      leave: countStatus('leave'),
      late: countStatus('late'),
      activity: countStatus('activity'),
    },
    welfare: {
      milk: SEED_STUDENTS.filter(s => s.welfare.milk).length,
      brush: SEED_STUDENTS.filter(s => s.welfare.brush).length,
      lunch: SEED_STUDENTS.filter(s => s.welfare.lunch).length,
    },
  });

  // weekly attendance trend (for dashboard chart)
  const WEEK_TREND = [
    { d: 'จ.', present: 15 }, { d: 'อ.', present: 14 }, { d: 'พ.', present: 16 },
    { d: 'พฤ.', present: 13 }, { d: 'ศ.', present: 15 },
  ];

  /* ============================================================
     Supabase-backed table cache. Each store keeps an in-memory copy
     of one table, fetches it once on load (seeding the table from
     local mock data the very first time a fresh project is empty),
     and subscribes to Realtime so every open tab/device converges
     on the same data. Reads stay perfectly synchronous (components
     never had to know data moved to a real backend); writes update
     the cache immediately for instant UI feedback, then persist to
     Supabase in the background.
     ============================================================ */
  const ALL_STORES = [];

  function makeStore(table, keyFields, eventName, seedRows) {
    let rows = [];
    let seeded = false;

    function keyOf(row) { return keyFields.map(function (f) { return row[f]; }).join('::'); }
    function notify() { window.dispatchEvent(new CustomEvent(eventName)); }

    function applyAndNotify(data) { rows = data || []; notify(); }

    function load() {
      window.SB.from(table).select('*').then(function (res) {
        if (res.error) { console.error('[GC] load', table, res.error); return; }
        if (!seeded && (res.data || []).length === 0 && seedRows && seedRows.length) {
          seeded = true;
          window.SB.from(table).insert(seedRows).then(function (r2) {
            if (r2.error) { console.error('[GC] seed', table, r2.error); applyAndNotify([]); return; }
            window.SB.from(table).select('*').then(function (r3) { applyAndNotify(r3.data); });
          });
        } else {
          applyAndNotify(res.data);
        }
      });
    }

    load();

    window.SB.channel('rt:' + table)
      .on('postgres_changes', { event: '*', schema: 'public', table: table }, function (payload) {
        if (payload.eventType === 'DELETE') {
          const k = keyOf(payload.old);
          rows = rows.filter(function (r) { return keyOf(r) !== k; });
        } else {
          const row = payload.new;
          const k = keyOf(row);
          const idx = rows.findIndex(function (r) { return keyOf(r) === k; });
          if (idx >= 0) rows[idx] = row; else rows.push(row);
        }
        notify();
      })
      .subscribe();

    const store = {
      list: function () { return rows; },
      reload: load,
      upsert: function (row) {
        const k = keyOf(row);
        const idx = rows.findIndex(function (r) { return keyOf(r) === k; });
        if (idx >= 0) rows[idx] = Object.assign({}, rows[idx], row); else rows.push(row);
        notify();
        window.SB.from(table).upsert(row).then(function (r) { if (r.error) console.error('[GC] upsert', table, r.error); });
      },
      remove: function (match) {
        rows = rows.filter(function (r) { return !keyFields.every(function (f) { return r[f] === match[f]; }); });
        notify();
        window.SB.from(table).delete().match(match).then(function (r) { if (r.error) console.error('[GC] delete', table, r.error); });
      },
    };
    ALL_STORES.push(store);
    return store;
  }

  // RLS blocks reads until the teacher is signed in — the very first load()
  // call above (made while logged out) comes back empty, so re-fetch every
  // store right after sign-in to pick up the real data.
  window.SB.auth.onAuthStateChange(function (event) {
    if (event === 'SIGNED_IN') ALL_STORES.forEach(function (s) { s.reload(); });
  });

  // ---- class info ----
  const classesStore = makeStore('classes', ['id'], 'gc:class-changed', [Object.assign({ id: 'default' }, CLASS_SEED)]);

  function getClass() {
    const row = classesStore.list()[0];
    return row ? Object.assign({}, CLASS, row) : CLASS;
  }
  function updateClass(data) {
    const cur = getClass();
    const next = Object.assign({}, cur, data);
    classesStore.upsert({ id: 'default', name: next.name, room: next.room, teacher: next.teacher, year: next.year });
  }

  // ---- students ----
  const studentsStore = makeStore('students', ['id'], 'gc:students-changed', SEED_STUDENTS);

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
      territories: terr,
      custom: true,
      deleted: false,
    };
  }

  function getStudents() {
    return studentsStore.list().filter(function (s) { return !s.deleted; });
  }

  function addStudent(data) {
    const all = getStudents();
    data.no = all.length + 1;
    const row = makeStudent(data, all.length);
    studentsStore.upsert(row);
  }

  function deleteStudent(id) {
    const row = studentsStore.list().find(function (s) { return s.id === id; });
    if (!row) return;
    studentsStore.upsert(Object.assign({}, row, { deleted: true }));
  }

  function updateStudent(id, data) {
    const row = studentsStore.list().find(function (s) { return s.id === id; });
    if (!row) return;
    const next = Object.assign({}, row, data);
    if (data.health) next.health = Object.assign({}, row.health, data.health);
    if (data.welfare) next.welfare = Object.assign({}, row.welfare, data.welfare);
    studentsStore.upsert(next);
  }

  // ---- full academic year attendance history (deterministic seed, used as the default
  // for any school day the teacher has not explicitly edited/saved yet) ----
  const YEAR_START = new Date(2025, 4, 19);  // 19 May 2025
  const YEAR_END   = new Date(2026, 4, 29);  // 29 May 2026 (today)

  const HOLIDAYS = new Set([
    '05-05','06-03','07-28','08-12','10-13','10-23','12-05','12-10','12-31',
    '01-01','01-13','02-26','04-06','04-13','04-14','04-15','05-01','05-12',
  ]);

  function isSchoolDay(d) {
    const day = d.getDay();
    if (day === 0 || day === 6) return false;
    const mmdd = String(d.getMonth() + 1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    if (HOLIDAYS.has(mmdd)) return false;
    const m = d.getMonth() + 1, dt = d.getDate();
    if ((m === 10 && dt >= 11) || m === 11 && dt <= 2) return false;
    if ((m === 3 && dt >= 21) || m === 4 || (m === 5 && dt <= 18)) return false;
    return true;
  }

  function dateKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

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
  let _dayOffset = 0;
  const _iter = new Date(YEAR_START);
  while (_iter <= YEAR_END) {
    if (isSchoolDay(_iter)) {
      const key = dateKey(_iter);
      const off = _dayOffset;
      ATTENDANCE_HISTORY[key] = SEED_STUDENTS.map((s, i) => ({
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

  // ---- attendance overrides (teacher-saved days) ----
  const attendanceStore = makeStore('attendance', ['date', 'student_id'], 'gc:attendance-changed', []);

  function getAttendance(dateStr) {
    const overrideRows = attendanceStore.list().filter(function (r) { return r.date === dateStr; });
    if (overrideRows.length) {
      return overrideRows.map(function (r) { return { id: r.student_id, status: r.status, milk: r.milk, brush: r.brush, lunch: r.lunch }; });
    }
    const students = getStudents();
    const hist = ATTENDANCE_HISTORY[dateStr] || [];
    const histMap = Object.fromEntries(hist.map(r => [r.id, r]));
    return students.map(s => histMap[s.id] || { id: s.id, status: 'present', milk: true, brush: true, lunch: true });
  }

  function saveAttendance(dateStr, rows) {
    rows.forEach(function (r) {
      attendanceStore.upsert({ date: dateStr, student_id: r.id, status: r.status, milk: r.milk, brush: r.brush, lunch: r.lunch });
    });
  }

  // ---- student attendance summary (counts per status for the academic year) ----
  function getStudentAttendanceSummary(id) {
    const counts = { present: 0, late: 0, sick: 0, leave: 0, activity: 0, absent: 0 };
    const savedDates = new Set();
    attendanceStore.list().forEach(function (r) {
      if (r.student_id !== id) return;
      savedDates.add(r.date);
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    for (const dateStr in ATTENDANCE_HISTORY) {
      if (savedDates.has(dateStr)) continue;
      const r = ATTENDANCE_HISTORY[dateStr].find(x => x.id === id);
      if (r) counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return counts;
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

  // ---- consecutive present-day streak ----
  function getStudentStreak(studentId) {
    const present = new Set(['present', 'late', 'activity']);
    const all = {};
    Object.keys(ATTENDANCE_HISTORY).forEach(function(d) {
      const r = ATTENDANCE_HISTORY[d].find(function(x) { return x.id === studentId; });
      if (r) all[d] = r.status;
    });
    attendanceStore.list().forEach(function (r) {
      if (r.student_id === studentId) all[r.date] = r.status;
    });
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
      const avg = ss.length ? Math.round(ss.reduce(function (a, s) { return a + (s.territories[sub.key] || 0); }, 0) / ss.length) : 0;
      return Object.assign({}, sub, { avg: avg });
    });
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
  const FINANCE_SAVINGS_SEED = SEED_STUDENTS.map(function (s, i) {
    return { id: 'SV' + 'seed' + i, student_id: s.id, kind: 'deposit', amount: seeded(i + 60, 80, 650), at: Date.now() };
  });
  const financeSavingsStore = makeStore('finance_savings_txns', ['id'], 'gc:finance-changed', FINANCE_SAVINGS_SEED);
  function getSavingsTxns() { return financeSavingsStore.list(); }
  function addSavingsTxn(t) {
    financeSavingsStore.upsert(Object.assign({}, t, { id: 'SV' + Date.now(), at: Date.now() }));
  }
  function getSavingsBalances() {
    const ss = getStudents();
    const adj = {};
    getSavingsTxns().forEach(function (t) {
      adj[t.student_id] = (adj[t.student_id] || 0) + (t.kind === 'deposit' ? Number(t.amount) || 0 : -(Number(t.amount) || 0));
    });
    return ss.map(function (s) { return { student: s, balance: Math.max(0, adj[s.id] || 0) }; });
  }

  const LEDGER_SEED = [
    { id: 'L1', type: 'income',  category: 'fundraise', amount: 850, note: 'ขายของในงานกีฬาสี', date: '2026-05-10' },
    { id: 'L2', type: 'expense', category: 'supplies',  amount: 320, note: 'ซื้อสมุด-ดินสอกองกลาง', date: '2026-05-14' },
    { id: 'L3', type: 'income',  category: 'fee',       amount: 1600, note: 'เก็บค่าทัศนศึกษารอบแรก', date: '2026-05-20' },
    { id: 'L4', type: 'expense', category: 'reward',    amount: 240, note: 'ของรางวัลกล่องสุ่มประจำสัปดาห์', date: '2026-05-25' },
  ];
  const financeLedgerStore = makeStore('finance_ledger', ['id'], 'gc:finance-changed', LEDGER_SEED);
  function getLedger() { return [...financeLedgerStore.list()].sort(function (a, b) { return b.date.localeCompare(a.date); }); }
  function addLedgerEntry(entry) {
    financeLedgerStore.upsert(Object.assign({}, entry, { id: 'L' + Date.now() }));
  }
  function getFinanceSummary() {
    const ledger = getLedger();
    const income = ledger.filter(function (t) { return t.type === 'income'; }).reduce(function (a, t) { return a + (Number(t.amount) || 0); }, 0);
    const expense = ledger.filter(function (t) { return t.type === 'expense'; }).reduce(function (a, t) { return a + (Number(t.amount) || 0); }, 0);
    const totalSavings = getSavingsBalances().reduce(function (a, r) { return a + r.balance; }, 0);
    return { income: income, expense: expense, net: income - expense, totalSavings: totalSavings };
  }

  // ---- health: vaccination records (static reference data, no editing yet) ----
  const VACCINE_LIST = ['คอตีบ-บาดทะยัก-ไอกรน (DTP)', 'โปลิโอ (OPV)', 'หัด-คางทูม-หัดเยอรมัน (MMR)', 'ไข้สมองอักเสบเจอี (JE)', 'ไข้หวัดใหญ่ตามฤดูกาล'];
  const VACCINATIONS = SEED_STUDENTS.map(function (s, i) {
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
  const HOME_VISIT_SEED = [
    { id: 'HV1', student_id: SEED_STUDENTS[4].id,  date: '2026-05-12', purpose: 'ติดตามการขาดเรียนบ่อย',     notes: 'พบผู้ปกครอง แจ้งเหตุผลครอบครัวย้ายที่พัก ตกลงให้มาเรียนปกติสัปดาห์หน้า', status: 'เสร็จสิ้น' },
    { id: 'HV2', student_id: SEED_STUDENTS[10].id, date: '2026-05-20', purpose: 'ปัญหาด้านการเงินที่บ้าน',    notes: 'ประสานทุนการศึกษาเพิ่มเติมให้กับครอบครัว',                         status: 'ติดตามต่อ' },
    { id: 'HV3', student_id: SEED_STUDENTS[1].id,  date: '2026-06-02', purpose: 'เยี่ยมบ้านประจำภาคเรียน',     notes: '',                                                                  status: 'นัดหมายแล้ว' },
  ];
  const homeVisitsStore = makeStore('home_visits', ['id'], 'gc:homevisits-changed', HOME_VISIT_SEED);
  function getHomeVisits() {
    return [...homeVisitsStore.list()]
      .sort(function (a, b) { return b.date.localeCompare(a.date); })
      .map(function (v) { return Object.assign({}, v, { studentId: v.student_id }); });
  }
  function addHomeVisit(v) {
    const row = Object.assign({}, v, { id: 'HV' + Date.now() });
    if (row.studentId) { row.student_id = row.studentId; delete row.studentId; }
    homeVisitsStore.upsert(row);
  }

  // ---- documents ----
  const DOC_SEED = [
    { id: 'D1', name: 'รายชื่อนักเรียน ป.4-2568.xlsx',          cat: 'รายชื่อ',    date: '2026-05-15', size: '48 KB',  icon: 'report' },
    { id: 'D2', name: 'แบบฟอร์มขออนุญาตทัศนศึกษา.pdf',          cat: 'แบบฟอร์ม',   date: '2026-05-20', size: '212 KB', icon: 'note' },
    { id: 'D3', name: 'รายงานพัฒนาการนักเรียน เทอม 2.pdf',       cat: 'รายงาน',     date: '2026-05-22', size: '1.1 MB', icon: 'chart' },
    { id: 'D4', name: 'บันทึกการประชุมผู้ปกครอง.docx',          cat: 'บันทึก',     date: '2026-05-25', size: '96 KB',  icon: 'book' },
    { id: 'D5', name: 'แผนการสอนหน่วยที่ 5.pdf',                cat: 'แผนการสอน',  date: '2026-05-27', size: '640 KB', icon: 'book' },
  ];
  const documentsStore = makeStore('documents', ['id'], 'gc:documents-changed', DOC_SEED);
  function getDocuments() { return [...documentsStore.list()].sort(function (a, b) { return b.date.localeCompare(a.date); }); }
  function addDocument(d) {
    documentsStore.upsert(Object.assign({}, d, { id: 'D' + Date.now() }));
  }
  function deleteDocument(id) {
    documentsStore.remove({ id: id });
  }

  // ---- parent communication: announcements + homework ----
  const ANN_SEED = [
    { id: 'A1', title: 'ปิดเทอมภาคฤดูร้อน',                     body: 'แจ้งปิดภาคเรียนวันที่ 21 มี.ค. - 18 พ.ค. 2569 ขอให้นักเรียนเตรียมตัวเปิดเทอมใหม่', date: '2026-05-10', audience: 'ทุกคน' },
    { id: 'A2', title: 'นัดประชุมผู้ปกครองภาคเรียนที่ 1',        body: 'ขอเชิญผู้ปกครองเข้าร่วมประชุมวันเสาร์ที่ 6 มิ.ย. 2569 เวลา 09:00 น. ณ ห้องประชุมโรงเรียน', date: '2026-05-28', audience: 'ทุกคน' },
    { id: 'A3', title: 'แจ้งค่าธรรมเนียมกิจกรรมทัศนศึกษา',       body: 'กรุณาชำระเงินผ่านครูประจำชั้นภายในวันที่ 15 มิ.ย. 2569',                              date: '2026-06-01', audience: 'ทุกคน' },
  ];
  const announcementsStore = makeStore('announcements', ['id'], 'gc:announcements-changed', ANN_SEED);
  function getAnnouncements() { return [...announcementsStore.list()].sort(function (a, b) { return b.date.localeCompare(a.date); }); }
  function addAnnouncement(a) {
    announcementsStore.upsert(Object.assign({}, a, { id: 'A' + Date.now(), date: dateKey(new Date()) }));
  }

  const HW_SEED = [
    { id: 'H1', subject: 'คณิตศาสตร์',     title: 'แบบฝึกหัดเศษส่วน หน้า 24-26',     due: '2026-06-05' },
    { id: 'H2', subject: 'ภาษาไทย',        title: 'คัดลายมือบทอาขยาน',               due: '2026-06-03' },
    { id: 'H3', subject: 'วิทยาศาสตร์',    title: 'ใบงานวงจรชีวิตผีเสื้อ',           due: '2026-06-08' },
  ];
  const homeworkStore = makeStore('homework', ['id'], 'gc:homework-changed', HW_SEED);
  function getHomework() { return homeworkStore.list(); }
  function addHomework(h) {
    homeworkStore.upsert(Object.assign({}, h, { id: 'H' + Date.now() }));
  }

  // ---- homework submission tracking: teacher assigns work per day (title/subject/score)
  // then records each student's submitted/not-submitted status with a click ----
  const HWA_SEED = [
    { id: 'HA1', title: 'แบบฝึกหัดเศษส่วน หน้า 24-26', subject: 'คณิตศาสตร์',   score: 10, date: '2026-05-27' },
    { id: 'HA2', title: 'คัดลายมือบทอาขยาน',           subject: 'ภาษาไทย',      score: 10, date: '2026-05-28' },
    { id: 'HA3', title: 'ใบงานวงจรชีวิตผีเสื้อ',        subject: 'วิทยาศาสตร์',  score: 10, date: '2026-05-29' },
  ];
  const hwAssignStore = makeStore('homework_assignments', ['id'], 'gc:hwassign-changed', HWA_SEED);
  const hwSubmitStore = makeStore('homework_submissions', ['assignment_id', 'student_id'], 'gc:hwsubmit-changed', []);

  function getHomeworkAssignments() { return [...hwAssignStore.list()].sort(function (a, b) { return b.date.localeCompare(a.date); }); }
  function addHomeworkAssignment(h) {
    const id = 'HA' + Date.now();
    hwAssignStore.upsert(Object.assign({}, h, { id: id }));
    return id;
  }
  function deleteHomeworkAssignment(id) {
    hwAssignStore.remove({ id: id });
    hwSubmitStore.list().filter(function (r) { return r.assignment_id === id; })
      .forEach(function (r) { hwSubmitStore.remove({ assignment_id: id, student_id: r.student_id }); });
  }
  function getHomeworkSubmissions(hwId) {
    const subMap = {};
    hwSubmitStore.list().forEach(function (r) { if (r.assignment_id === hwId) subMap[r.student_id] = r.submitted; });
    return getStudents().map(function (s) { return { id: s.id, submitted: !!subMap[s.id] }; });
  }
  function saveHomeworkSubmissions(hwId, rows) {
    rows.forEach(function (r) {
      hwSubmitStore.upsert({ assignment_id: hwId, student_id: r.id, submitted: !!r.submitted });
    });
  }

  // ---- generic CSV export: builds a CSV string from headers+rows and triggers a browser download ----
  function exportCSV(filename, headers, rows) {
    function esc(v) {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }
    const lines = [headers.map(esc).join(',')].concat(rows.map(function(r) { return r.map(esc).join(','); }));
    const csv = '﻿' + lines.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  window.GC = {
    STATUSES, PRESENT_LIKE, LIVE, SUBJECTS,
    STUDENTS: SEED_STUDENTS, CLASS, WEEK_TREND,
    getStudentStreak,
    getStudents, addStudent, deleteStudent, updateStudent,
    getClass, updateClass,
    getStudentAttendanceSummary,
    ATTENDANCE_HISTORY, getAttendance, saveAttendance, getSchoolDays,
    YEAR_START, YEAR_END, isSchoolDay, dateKey,

    // Teacher Classroom OS additions
    getSubjectAverages,
    CALENDAR_EVENTS, getUpcomingEvents,
    FINANCE_CATEGORIES, getSavingsTxns, addSavingsTxn, getSavingsBalances,
    getLedger, addLedgerEntry, getFinanceSummary,
    VACCINE_LIST, getVaccinationRecord, getVaccinationCoverage,
    getHomeVisits, addHomeVisit,
    getDocuments, addDocument, deleteDocument,
    getAnnouncements, addAnnouncement, getHomework, addHomework,
    getHomeworkAssignments, addHomeworkAssignment, deleteHomeworkAssignment,
    getHomeworkSubmissions, saveHomeworkSubmissions,
    exportCSV,
  };
})();
