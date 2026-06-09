/* ============================================================
   TEACHER WORLD — shell (sidebar) + dashboard
   ============================================================ */
function EditClassModal({ cls, onClose }) {
  const [form, setForm] = React.useState({ name: cls.name, room: cls.room, teacher: cls.teacher, year: cls.year });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  function submit(e) {
    e.preventDefault();
    window.GC.updateClass(form);
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 18, width: 380, maxWidth: '90vw' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            <Icon name="tool" size={17} /> ข้อมูลห้องเรียน
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        <form onSubmit={submit} className="col" style={{ gap: 13 }}>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่อห้องเรียน</label>
            <input {...inp} placeholder="เช่น ป.4/2" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ห้อง / อาคาร</label>
            <input {...inp} placeholder="เช่น อาคาร 2 ห้อง 204" value={form.room} onChange={e => set('room', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่อครูประจำชั้น</label>
            <input {...inp} placeholder="เช่น ครูมานี รักเรียน" value={form.teacher} onChange={e => set('teacher', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ปีการศึกษา</label>
            <input {...inp} placeholder="เช่น ปีการศึกษา 2568" value={form.year} onChange={e => set('year', e.target.value)} />
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--navy),var(--navy-2))', color: '#fff' }}>
              <Icon name="check" size={15} /> บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
const TEACHER_NAV = [
  { key: 'dashboard',  th: 'แดชบอร์ด',    icon: 'home' },
  { key: 'attendance', th: 'เช็กชื่อ',     icon: 'calendar' },
  { key: 'health',     th: 'สุขภาพ',       icon: 'heart' },
  { key: 'students',   th: 'นักเรียน',     icon: 'users' },
  { key: 'barcode',    th: 'บาร์โค้ดคะแนน', icon: 'report' },
];

function TeacherShell({ route, setRoute, onPortal, onLogout, children }) {
  const [cls, setCls] = React.useState(() => window.GC.getClass());
  const [showEdit, setShowEdit] = React.useState(false);
  const CLASS = cls;

  React.useEffect(() => {
    const refresh = () => setCls(window.GC.getClass());
    window.addEventListener('gc:class-changed', refresh);
    return () => window.removeEventListener('gc:class-changed', refresh);
  }, []);

  const today = new Date(2026, 4, 29);
  const dstr = today.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div data-world="teacher" className="world row" style={{ position: 'absolute', inset: 0 }}>
      {/* sidebar */}
      <aside className="col" style={{ width: 250, flex: 'none', padding: 18, gap: 8, position: 'relative', zIndex: 2,
        borderRight: '1px solid var(--line)', background: 'var(--surface)', backdropFilter: 'blur(var(--glass-blur))', overflowY: 'auto' }}>
        <div className="row" style={{ gap: 11, padding: '8px 8px 16px' }}>
          <div className="center" style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--navy), var(--navy-2))' }}>
            <Icon name="shield" size={22} color="#fff" />
          </div>
          <div>
            <div className="display" style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1 }}>Classroom OS</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>ระบบบริหารชั้นเรียน</div>
          </div>
        </div>

        <div className="glass-2" style={{ borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: 8, position: 'relative' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="display" style={{ fontSize: 22, color: 'var(--navy)' }}>{CLASS.name}</div>
            <div className="row" style={{ gap: 6 }}>
              <span className="pill" style={{ background: 'color-mix(in oklch, var(--st-present) 16%, transparent)', color: 'var(--st-present)' }}>
                <span className="dot" style={{ background: 'var(--st-present)' }} /> สด
              </span>
              <button onClick={() => setShowEdit(true)} title="แก้ไขข้อมูลห้องเรียน"
                style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: 'var(--surface-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                <Icon name="tool" size={14} />
              </button>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{window.GC.getStudents().length} คน · {CLASS.room}</div>
        </div>

        <nav className="col" style={{ gap: 4 }}>
          {TEACHER_NAV.map(n => {
            const on = route === n.key;
            return (
              <button key={n.key} onClick={() => setRoute(n.key)} className="btn"
                style={{ justifyContent: 'flex-start', padding: '11px 14px', borderRadius: 'var(--r-md)', fontSize: 14.5,
                  background: on ? 'linear-gradient(120deg, var(--navy), var(--navy-2))' : 'transparent',
                  color: on ? '#fff' : 'var(--ink-soft)', boxShadow: on ? '0 8px 20px -10px var(--navy)' : 'none' }}>
                <Icon name={n.icon} size={19} /> {n.th}
              </button>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        <button onClick={onPortal} className="btn" style={{ justifyContent: 'flex-start', padding: '12px 14px',
          background: 'linear-gradient(120deg, oklch(0.62 0.2 305), oklch(0.55 0.2 270))', color: '#fff' }}>
          <Icon name="game" size={19} /> ไปโลกเกม <Icon name="arrowRight" size={16} color="#fff" style={{ marginLeft: 'auto' }} />
        </button>

        <div className="row glass-2" style={{ gap: 10, padding: 10, borderRadius: 'var(--r-md)', marginTop: 4 }}>
          <div className="center" style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--navy)', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            {CLASS.teacher.slice(-2, -1) || 'ค'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="nowrap" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{CLASS.teacher}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{CLASS.year}</div>
          </div>
          <button onClick={onLogout} className="center" style={{ width: 30, height: 30, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
            <Icon name="logout" size={17} />
          </button>
        </div>
      </aside>
      {showEdit && <EditClassModal cls={cls} onClose={() => setShowEdit(false)} />}

      {/* main */}
      <div className="col" style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <header className="row" style={{ padding: '16px 28px', justifyContent: 'space-between', gap: 16,
          borderBottom: '1px solid var(--line)', background: 'var(--surface-2)', backdropFilter: 'blur(8px)' }}>
          <div>
            <div className="display" style={{ fontSize: 19, color: 'var(--ink)' }}>{TEACHER_NAV.find(n => n.key === route)?.th}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{dstr}</div>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div className="row glass-2" style={{ borderRadius: 99, padding: '8px 14px', gap: 8, width: 240 }}>
              <Icon name="search" size={17} color="var(--muted)" />
              <input placeholder="ค้นหานักเรียน…" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5, color: 'var(--ink)', width: '100%', fontFamily: 'var(--font-body)' }} />
            </div>
            <button className="center glass-2" style={{ width: 42, height: 42, borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
              <Icon name="bell" size={19} color="var(--ink-soft)" />
              <span className="dot" style={{ position: 'absolute', top: 9, right: 10, background: 'var(--st-absent)' }} />
            </button>
          </div>
        </header>
        <main className="scroll" style={{ flex: 1, padding: '28px 28px 96px' }}>{children}</main>
      </div>
    </div>
  );
}

function TeacherDashboard({ openStudent }) {
  const [cls, setCls] = React.useState(() => window.GC.getClass());
  React.useEffect(() => {
    const r = () => setCls(window.GC.getClass());
    window.addEventListener('gc:class-changed', r);
    return () => window.removeEventListener('gc:class-changed', r);
  }, []);
  const STUDENTS = useStudents();
  const { STATUSES, WEEK_TREND } = window.GC;
  const CLASS = { ...cls, total: STUDENTS.length, summary: window.GC.CLASS.summary, welfare: window.GC.CLASS.welfare };
  const s = CLASS.summary;
  const presentPct = Math.round((s.present / CLASS.total) * 100);
  const alerts = STUDENTS.filter(st => st.health.nutrition !== 'สมส่วน' || st.status === 'sick' || st.status === 'absent');
  const breakdown = [
    ['present', s.present - s.late], ['late', s.late], ['sick', s.sick], ['leave', s.leave], ['activity', s.activity], ['absent', s.absent],
  ].filter(b => b[1] > 0);

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      {/* greeting + quick actions */}
      <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '22px 26px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'var(--halo)', filter: 'blur(20px)' }} />
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
          <div>
            <h2 style={{ fontSize: 26, color: 'var(--ink)' }}>สวัสดีตอนเช้า {CLASS.teacher} 👋</h2>
            <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>วันนี้มีนักเรียนมาเรียน {s.present} จาก {CLASS.total} คน · มาเรียน {presentPct}%</p>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <button className="btn btn-primary"><Icon name="check" size={18} color="#fff" /> เช็กชื่อวันนี้</button>
            <button className="btn btn-ghost"><Icon name="report" size={18} /> ออกรายงาน</button>
          </div>
        </div>
      </div>

      {/* stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <Stat icon="users" label="นักเรียนทั้งหมด" value={CLASS.total} sub="ป.4/2" color="var(--navy)" />
        <Stat icon="check" label="มาเรียน" value={s.present} sub={`${presentPct}% ของห้อง`} color="var(--st-present)" />
        <Stat icon="thermometer" label="ลาป่วย" value={s.sick} sub="ติดตามอาการ" color="var(--st-sick)" />
        <Stat icon="x" label="ขาด/ลา" value={s.absent + s.leave} sub="ต้องติดตาม" color="var(--st-absent)" />
      </div>

      {/* charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{ fontSize: 16, color: 'var(--ink)' }}>แนวโน้มการมาเรียน · สัปดาห์นี้</h3>
            <span className="pill" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>เต็ม {CLASS.total} คน</span>
          </div>
          <LineChart data={WEEK_TREND.map(d => ({ m: d.d, v: d.present }))} color="var(--navy)" h={190} />
        </div>

        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>สถานะวันนี้</h3>
          {/* stacked bar */}
          <div className="row" style={{ height: 16, borderRadius: 99, overflow: 'hidden', marginBottom: 16 }}>
            {breakdown.map(([k, n]) => (
              <div key={k} title={STATUSES[k].th} style={{ width: (n / CLASS.total * 100) + '%', background: STATUSES[k].color }} />
            ))}
          </div>
          <div className="col" style={{ gap: 9 }}>
            {breakdown.map(([k, n]) => (
              <div key={k} className="row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: 8, minWidth: 0 }}>
                  <span className="dot" style={{ background: STATUSES[k].color }} />
                  <span className="nowrap" style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{STATUSES[k].th}</span>
                </div>
                <span className="display" style={{ fontSize: 15, color: 'var(--ink)' }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* alerts + welfare */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, color: 'var(--ink)' }}>การแจ้งเตือน & ติดตาม</h3>
            <span className="pill" style={{ background: 'color-mix(in oklch,var(--st-absent) 14%,transparent)', color: 'var(--st-absent)' }}>{alerts.length} รายการ</span>
          </div>
          <div className="col" style={{ gap: 8 }}>
            {alerts.slice(0, 5).map(st => {
              const sick = st.status === 'sick', absent = st.status === 'absent';
              const tag = absent ? ['ขาดเรียนวันนี้', 'var(--st-absent)'] : sick ? ['ลาป่วย — ติดตามอาการ', 'var(--st-sick)'] : [`ภาวะโภชนาการ: ${st.health.nutrition}`, 'var(--st-late)'];
              return (
                <div key={st.id} onClick={() => openStudent(st.id)} className="row glass-2" style={{ gap: 12, padding: 10, borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
                  <HeroAvatar student={st} size={42} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="nowrap" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{st.name}</div>
                    <div style={{ fontSize: 12, color: tag[1] }}>{tag[0]}</div>
                  </div>
                  <Icon name="chevR" size={18} color="var(--muted)" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 16 }}>สุขภาวะวันนี้</h3>
          {[['ดื่มนม', CLASS.welfare.milk, 'var(--st-leave)', 'drop'], ['แปรงฟัน', CLASS.welfare.brush, 'var(--st-present)', 'spark'], ['ทานข้าวกลางวัน', CLASS.welfare.lunch, 'var(--st-late)', 'gift']].map(([t, n, c, ic]) => (
            <div key={t} className="col" style={{ gap: 7, marginBottom: 16 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: 8, minWidth: 0 }}><Icon name={ic} size={16} color={c} /><span className="nowrap" style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{t}</span></div>
                <span className="display" style={{ fontSize: 14, color: 'var(--ink)' }}>{n}/{CLASS.total}</span>
              </div>
              <Bar value={n} max={CLASS.total} color={c} />
            </div>
          ))}
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>บันทึกสุขภาวะ</button>
        </div>
      </div>
    </div>
  );
}

/* ── shared compact barcode scanner panel ─────────────────── */
const SCORE_TYPES = [
  { key: 'xp',   label: 'XP',   color: 'var(--navy)',         icon: 'bolt'  },
  { key: 'coin', label: 'Coin', color: 'var(--rk-gold)',      icon: 'star'  },
  { key: 'star', label: 'Star', color: 'oklch(0.78 0.2 55)',  icon: 'spark' },
];

function BarcodePanel({ autoFocus = true, compact = false, onAward }) {
  const [input,    setInput]    = React.useState('');
  const [found,    setFound]    = React.useState(null);
  const [notFound, setNotFound] = React.useState(false);
  const [award,    setAward]    = React.useState({ type: 'xp', amount: '10', note: '' });
  const [flash,    setFlash]    = React.useState(null);
  const [recentLog, setRecentLog] = React.useState(() => window.GC.getScoreLog().slice(0, 5));
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
    const refresh = () => setRecentLog(window.GC.getScoreLog().slice(0, 5));
    window.addEventListener('gc:score-added', refresh);
    return () => window.removeEventListener('gc:score-added', refresh);
  }, []);

  function lookup(val) {
    const code = val.trim();
    if (!code) return;
    const st = window.GC.getStudents().find(s => s.code === code || s.id === code);
    if (st) { setFound(st); setNotFound(false); }
    else { setFound(null); setNotFound(true); setTimeout(() => setNotFound(false), 2000); }
    setInput('');
  }

  function giveScore() {
    if (!found) return;
    const amt = +award.amount || 0;
    if (!amt) return;
    const entry = { studentId: found.id, studentCode: found.code, name: found.name, nick: found.nick, type: award.type, amount: amt, note: award.note };
    window.GC.addScoreLog(entry);
    setFlash({ nick: found.nick, type: award.type, amount: amt });
    setTimeout(() => setFlash(null), 2500);
    setFound(null);
    setAward(a => ({ ...a, note: '' }));
    inputRef.current?.focus();
    if (onAward) onAward(entry);
  }

  const inp = (extra) => ({ style: { padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', ...extra } });

  return (
    <div className="col" style={{ gap: 12 }}>

      {/* scan bar */}
      <div className="row" style={{ gap: 8 }}>
        <div className="center" style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,var(--navy),var(--navy-2))', flexShrink: 0 }}>
          <Icon name="report" size={20} color="#fff" />
        </div>
        <input ref={inputRef} {...inp({ flex: 1, fontSize: compact ? 14 : 18, padding: compact ? '8px 12px' : '10px 14px',
          outline: notFound ? '2px solid var(--st-absent)' : found ? '2px solid var(--st-present)' : 'none' })}
          placeholder="สแกนหรือพิมพ์รหัสนักเรียน แล้วกด Enter…"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && lookup(input)}
          autoComplete="off" />
        <button className="btn" style={{ padding: '8px 16px', background: 'linear-gradient(120deg,var(--navy),var(--navy-2))', color: '#fff', flexShrink: 0 }}
          onClick={() => lookup(input)}>
          <Icon name="search" size={16} />
        </button>
      </div>
      {notFound && <div style={{ color: 'var(--st-absent)', fontSize: 13, fontWeight: 600, paddingLeft: 48 }}>⚠️ ไม่พบรหัสนักเรียนนี้</div>}

      {/* found: compact award row */}
      {found && (
        <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '12px 16px', gap: 12, alignItems: 'center', flexWrap: 'wrap', outline: '1.5px solid var(--st-present)' }}>
          <HeroAvatar student={found} size={44} />
          <div style={{ minWidth: 100 }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 15, fontFamily: 'var(--font-display)' }}>{found.nick}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>#{found.code} · Lv.{found.game.level}</div>
          </div>
          {/* type pills */}
          <div className="row" style={{ gap: 6 }}>
            {SCORE_TYPES.map(t => (
              <button key={t.key} onClick={() => setAward(a => ({ ...a, type: t.key }))} className="btn"
                style={{ padding: '6px 13px', gap: 5, fontSize: 12.5, boxShadow: 'none',
                  background: award.type === t.key ? t.color : 'var(--surface-2)',
                  color: award.type === t.key ? '#fff' : 'var(--ink-soft)' }}>
                <Icon name={t.icon} size={13} /> {t.label}
              </button>
            ))}
          </div>
          {/* amount */}
          <input {...inp({ width: 70, textAlign: 'center', fontWeight: 700 })} type="number" min="1" max="9999"
            value={award.amount} onChange={e => setAward(a => ({ ...a, amount: e.target.value }))} />
          {/* note */}
          <input {...inp({ flex: 1, minWidth: 100, fontSize: 13 })} placeholder="หมายเหตุ…"
            value={award.note} onChange={e => setAward(a => ({ ...a, note: e.target.value }))} />
          {/* give */}
          <button className="btn" style={{ padding: '8px 18px', background: SCORE_TYPES.find(t => t.key === award.type)?.color, color: '#fff', fontWeight: 700, flexShrink: 0 }}
            onClick={giveScore}>
            <Icon name="bolt" size={15} /> มอบ
          </button>
          <button className="btn btn-ghost" style={{ padding: '8px 12px', flexShrink: 0 }} onClick={() => setFound(null)}>×</button>
        </div>
      )}

      {/* recent mini log */}
      {recentLog.length > 0 && (
        <div className="col" style={{ gap: 4 }}>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600, paddingLeft: 2 }}>รางวัลล่าสุด</div>
          {recentLog.map((e, i) => {
            const t = SCORE_TYPES.find(x => x.key === e.type) || SCORE_TYPES[0];
            return (
              <div key={i} className="row" style={{ gap: 9, padding: '7px 10px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', alignItems: 'center' }}>
                <Icon name={t.icon} size={14} color={t.color} />
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{e.nick}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{e.note || ''}</span>
                <span style={{ fontWeight: 800, color: t.color, fontSize: 13 }}>+{e.amount} {t.label}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(e.at).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* award flash toast */}
      {flash && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 500, padding: '14px 22px', borderRadius: 'var(--r-lg)',
          background: 'linear-gradient(120deg,var(--navy),var(--navy-2))', color: '#fff', fontWeight: 700, fontSize: 16,
          boxShadow: '0 8px 32px -8px var(--navy)', animation: 'portalText .4s ease-out', pointerEvents: 'none' }}>
          ✅ {flash.nick} +{flash.amount} {flash.type.toUpperCase()}
        </div>
      )}
    </div>
  );
}

function BarcodeScore() {
  const [log, setLog] = React.useState(() => window.GC.getScoreLog());

  React.useEffect(() => {
    const refresh = () => setLog(window.GC.getScoreLog());
    window.addEventListener('gc:score-added', refresh);
    return () => window.removeEventListener('gc:score-added', refresh);
  }, []);

  return (
    <div className="col" style={{ gap: 20, maxWidth: 820 }}>
      <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>
        สแกนบาร์โค้ดหรือพิมพ์รหัสนักเรียน แล้วกด Enter เพื่อค้นหา
      </div>

      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 24, gap: 16 }}>
        <div className="row" style={{ gap: 10, alignItems: 'center', marginBottom: 4 }}>
          <div className="center" style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,var(--navy),var(--navy-2))' }}>
            <Icon name="report" size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>สแกนรหัสนักเรียน</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>รองรับเครื่องสแกนบาร์โค้ด USB และการพิมพ์ด้วยมือ</div>
          </div>
        </div>
        <BarcodePanel autoFocus={true} />
      </div>

      {/* full score log */}
      {log.length > 0 && (
        <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 20, gap: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>ประวัติการมอบรางวัลทั้งหมด</div>
          <div className="col" style={{ gap: 6, maxHeight: 360, overflowY: 'auto' }}>
            {log.map((e, i) => {
              const t = SCORE_TYPES.find(x => x.key === e.type) || SCORE_TYPES[0];
              const dt = new Date(e.at);
              return (
                <div key={i} className="row" style={{ gap: 12, padding: '9px 12px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', alignItems: 'center' }}>
                  <div className="center" style={{ width: 36, height: 36, borderRadius: 10, background: 'color-mix(in oklch,' + t.color + ' 16%,transparent)', color: t.color, flexShrink: 0 }}>
                    <Icon name={t.icon} size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ gap: 6 }}>
                      <span style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 13.5 }}>{e.nick}</span>
                      <span style={{ color: 'var(--muted)', fontSize: 12 }}>#{e.studentCode}</span>
                    </div>
                    {e.note && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{e.note}</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, color: t.color, fontSize: 15 }}>+{e.amount} {t.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{dt.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn btn-ghost" style={{ alignSelf: 'flex-start', fontSize: 12.5 }}
            onClick={() => { localStorage.removeItem('gcos.score.log'); setLog([]); }}>
            ล้างประวัติ
          </button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TeacherShell, TeacherDashboard, BarcodeScore, BarcodePanel, TEACHER_NAV });
