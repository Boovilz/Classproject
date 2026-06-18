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
  { key: 'dashboard',  th: 'แดชบอร์ด',          icon: 'home' },
  { key: 'students',   th: 'นักเรียน',           icon: 'users' },
  { key: 'attendance', th: 'เช็กชื่อ',           icon: 'calendar' },
  { key: 'classadmin', th: 'ธุรการชั้นเรียน',    icon: 'report' },
  { key: 'behavior',   th: 'ความประพฤติ & XP',  icon: 'bolt' },
  { key: 'academic',   th: 'ผลการเรียน',        icon: 'book' },
  { key: 'finance',    th: 'การเงินห้องเรียน',   icon: 'coin' },
  { key: 'health',     th: 'สุขภาพ',             icon: 'heart' },
  { key: 'homevisit',  th: 'เยี่ยมบ้าน',         icon: 'door' },
  { key: 'documents',  th: 'เอกสาร',             icon: 'note' },
  { key: 'parent',     th: 'สื่อสารผู้ปกครอง',   icon: 'mail' },
  { key: 'settings',   th: 'ตั้งค่า',            icon: 'settings' },
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
      <aside className="col" style={{ width: 250, flex: 'none', alignSelf: 'stretch', padding: 18, gap: 8, position: 'relative', zIndex: 2,
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
      <div className="col" style={{ flex: 1, alignSelf: 'stretch', minWidth: 0, minHeight: 0, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
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

function MiniMetric({ icon, label, value, color }) {
  return (
    <div className="row" style={{ gap: 10, flex: 1, minWidth: 0 }}>
      <div className="center" style={{ width: 36, height: 36, borderRadius: 10, background: 'color-mix(in oklch,' + color + ' 16%,transparent)', color, flexShrink: 0 }}>
        <Icon name={icon} size={17} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="display nowrap" style={{ fontSize: 19, color: 'var(--ink)', lineHeight: 1.1 }}>{value}</div>
        <div className="nowrap" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{label}</div>
      </div>
    </div>
  );
}

function QuickActionBtn({ icon, label, color, onClick }) {
  return (
    <button onClick={onClick} className="col center glass-2" style={{ borderRadius: 'var(--r-md)', padding: '16px 10px', gap: 8, cursor: 'pointer', border: 'none', transition: 'transform .15s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
      <div className="center" style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,' + color + ',' + color + ')', color: '#fff' }}>
        <Icon name={icon} size={19} color="#fff" />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', textAlign: 'center' }}>{label}</span>
    </button>
  );
}

function TeacherDashboard({ openStudent, setRoute }) {
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
  const behavior = window.GC.getBehaviorSummary();
  const xpCoin = window.GC.getXPCoinTotals();
  const subjectAvg = window.GC.getSubjectAverages();
  const events = window.GC.getUpcomingEvents(5);
  const leaders = [...STUDENTS].sort((a, b) => (b.game.level * 1000 + b.game.xp) - (a.game.level * 1000 + a.game.xp)).slice(0, 5);
  const medal = ['var(--rk-gold)', 'var(--rk-silver)', 'var(--rk-bronze)'];

  const go = (key) => { if (setRoute) setRoute(key); };

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      {/* greeting */}
      <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '22px 26px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'var(--halo)', filter: 'blur(20px)' }} />
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
          <div>
            <h2 style={{ fontSize: 26, color: 'var(--ink)' }}>สวัสดีตอนเช้า {CLASS.teacher} 👋</h2>
            <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>วันนี้มีนักเรียนมาเรียน {s.present} จาก {CLASS.total} คน · มาเรียน {presentPct}%</p>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <button onClick={() => go('attendance')} className="btn btn-primary"><Icon name="check" size={18} color="#fff" /> เช็กชื่อวันนี้</button>
            <button onClick={() => go('academic')} className="btn btn-ghost"><Icon name="report" size={18} /> ออกรายงาน</button>
          </div>
        </div>
      </div>

      {/* 1-4: stat row — Total Students / Attendance / Behavior / XP & Coins */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <Stat icon="users" label="นักเรียนทั้งหมด" value={CLASS.total} sub={CLASS.name} color="var(--royal)" />
        <Stat icon="check" label="มาเรียนวันนี้" value={s.present} sub={`${presentPct}% ของห้อง`} color="var(--emerald)" />
        <Stat icon="star" label="คะแนนความประพฤติเฉลี่ย" value={behavior.avgStars} sub={`จาก ${behavior.maxStars} ดาว`} color="var(--orange)" />
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '18px 20px' }}>
          <div className="nowrap" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>XP & เหรียญรวมห้อง</div>
          <div className="row" style={{ gap: 10 }}>
            <MiniMetric icon="bolt" label="XP สะสม" value={xpCoin.xp.toLocaleString()} color="var(--royal)" />
            <MiniMetric icon="coin" label="เหรียญสะสม" value={xpCoin.coins.toLocaleString()} color="var(--orange)" />
          </div>
        </div>
      </div>

      {/* 7-8: charts row — Student Performance / Attendance Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, color: 'var(--ink)' }}>ผลการเรียนเฉลี่ยรายวิชา</h3>
            <button onClick={() => go('academic')} className="pill" style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: 'none', cursor: 'pointer' }}>ดูทั้งหมด</button>
          </div>
          <div className="col" style={{ gap: 10 }}>
            {subjectAvg.map((sub, i) => (
              <div key={sub.key} className="col" style={{ gap: 5 }}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="nowrap" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{sub.th}</span>
                  <span className="display" style={{ fontSize: 12.5, color: 'var(--ink)' }}>{sub.avg}%</span>
                </div>
                <Bar value={sub.avg} max={100} color={i % 2 ? 'var(--emerald)' : 'var(--royal)'} height={7} />
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{ fontSize: 16, color: 'var(--ink)' }}>กราฟวิเคราะห์การมาเรียน · สัปดาห์นี้</h3>
            <span className="pill" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>เต็ม {CLASS.total} คน</span>
          </div>
          <LineChart data={WEEK_TREND.map(d => ({ m: d.d, v: d.present }))} color="var(--royal)" h={190} />
        </div>
      </div>

      {/* 5-6: calendar / notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>ปฏิทิน & กิจกรรมที่จะมาถึง</h3>
          <div className="col" style={{ gap: 10 }}>
            {events.map((e, i) => {
              const d = new Date(e.date);
              return (
                <div key={i} className="row glass-2" style={{ gap: 12, padding: 10, borderRadius: 'var(--r-md)' }}>
                  <div className="center col" style={{ width: 44, height: 44, borderRadius: 10, background: 'color-mix(in oklch,var(--orange) 14%,transparent)', flexShrink: 0 }}>
                    <span className="display" style={{ fontSize: 15, color: 'var(--orange)', lineHeight: 1 }}>{d.getDate()}</span>
                    <span style={{ fontSize: 9.5, color: 'var(--orange)' }}>{d.toLocaleDateString('th-TH', { month: 'short' })}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{e.th}</div>
                  </div>
                  <Icon name={e.icon} size={17} color="var(--muted)" />
                </div>
              );
            })}
          </div>
        </div>

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
            {alerts.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', padding: 12 }}>ไม่มีรายการที่ต้องติดตามวันนี้ 🎉</div>}
          </div>
        </div>
      </div>

      {/* 9-10: leaderboard / quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, color: 'var(--ink)' }}>กระดานผู้นำนักเรียนยอดเยี่ยม</h3>
            <button onClick={() => go('behavior')} className="pill" style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: 'none', cursor: 'pointer' }}>ดูทั้งหมด</button>
          </div>
          <div className="col" style={{ gap: 8 }}>
            {leaders.map((st, i) => (
              <div key={st.id} onClick={() => openStudent(st.id)} className="row" style={{ gap: 12, padding: '8px 4px', borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
                <span className="center display" style={{ width: 26, height: 26, borderRadius: 8, fontSize: 13, flexShrink: 0,
                  background: i < 3 ? 'color-mix(in oklch,' + medal[i] + ' 22%,transparent)' : 'var(--surface-2)',
                  color: i < 3 ? medal[i] : 'var(--muted)' }}>{i + 1}</span>
                <HeroAvatar student={st} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{st.nick} · {st.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>เลเวล {st.game.level} · {st.game.tier.th}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="display" style={{ fontSize: 13.5, color: 'var(--royal)' }}>{st.game.xp.toLocaleString()} XP</div>
                  <div style={{ fontSize: 11, color: 'var(--orange)' }}>{st.game.coins.toLocaleString()} เหรียญ</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
          <h3 style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>ดำเนินการด่วน</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            <QuickActionBtn icon="check" label="เช็กชื่อวันนี้" color="var(--royal)" onClick={() => go('attendance')} />
            <QuickActionBtn icon="bolt" label="มอบ XP/เหรียญ" color="var(--orange)" onClick={() => go('behavior')} />
            <QuickActionBtn icon="users" label="เพิ่มนักเรียน" color="var(--emerald)" onClick={() => go('students')} />
            <QuickActionBtn icon="coin" label="บันทึกการเงิน" color="var(--orange)" onClick={() => go('finance')} />
            <QuickActionBtn icon="mail" label="ส่งประกาศ" color="var(--royal)" onClick={() => go('parent')} />
            <QuickActionBtn icon="report" label="ออกรายงานผลการเรียน" color="var(--emerald)" onClick={() => go('academic')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [cls, setCls] = React.useState(() => window.GC.getClass());
  const [form, setForm] = React.useState({ name: cls.name, room: cls.room, teacher: cls.teacher, year: cls.year });
  const [notif, setNotif] = React.useState({ attendance: true, health: true, finance: false, parent: true });
  const [saved, setSaved] = React.useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '10px 13px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  function save(e) {
    e.preventDefault();
    window.GC.updateClass(form);
    setCls(window.GC.getClass());
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="col stagger" style={{ gap: 20, maxWidth: 720 }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 24, gap: 16 }}>
        <div className="row" style={{ gap: 10 }}>
          <div className="center" style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,var(--royal),var(--royal-2))' }}>
            <Icon name="tool" size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>ข้อมูลห้องเรียน</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>แก้ไขชื่อห้อง อาคาร และข้อมูลครูประจำชั้น</div>
          </div>
        </div>
        <form onSubmit={save} className="col" style={{ gap: 13 }}>
          <div className="row" style={{ gap: 12 }}>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่อห้องเรียน</label>
              <input {...inp} value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ห้อง / อาคาร</label>
              <input {...inp} value={form.room} onChange={e => set('room', e.target.value)} />
            </div>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่อครูประจำชั้น</label>
              <input {...inp} value={form.teacher} onChange={e => set('teacher', e.target.value)} />
            </div>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ปีการศึกษา</label>
              <input {...inp} value={form.year} onChange={e => set('year', e.target.value)} />
            </div>
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            {saved && <span style={{ fontSize: 13, color: 'var(--emerald)', alignSelf: 'center' }}>✓ บันทึกแล้ว</span>}
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="check" size={15} /> บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </form>
      </div>

      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 24, gap: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>การแจ้งเตือน</div>
        {[['attendance', 'แจ้งเตือนการเช็กชื่อรายวัน'], ['health', 'แจ้งเตือนสุขภาพและภาวะโภชนาการ'], ['finance', 'แจ้งเตือนรายรับ-รายจ่ายห้องเรียน'], ['parent', 'แจ้งเตือนข้อความจากผู้ปกครอง']].map(([k, l]) => (
          <div key={k} className="row" style={{ justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line-soft)' }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{l}</span>
            <button onClick={() => setNotif(n => ({ ...n, [k]: !n[k] }))}
              style={{ width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer', position: 'relative',
                background: notif[k] ? 'var(--emerald)' : 'var(--surface-2)', transition: 'background .2s' }}>
              <span style={{ position: 'absolute', top: 3, left: notif[k] ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
            </button>
          </div>
        ))}
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

function BehaviorXP({ openStudent }) {
  const STUDENTS = useStudents();
  const [sortBy, setSortBy] = React.useState('xp'); // xp | coins | stars
  const SORTS = [
    { key: 'xp',    th: 'XP',     icon: 'bolt',  color: 'var(--royal)'  },
    { key: 'coins', th: 'เหรียญ', icon: 'coin',  color: 'var(--orange)' },
    { key: 'stars', th: 'ดาว',    icon: 'star',  color: 'var(--emerald)' },
  ];
  const ranked = [...STUDENTS].sort((a, b) => (b.game[sortBy] || 0) - (a.game[sortBy] || 0));
  const medal = ['var(--rk-gold)', 'var(--rk-silver)', 'var(--rk-bronze)'];
  const active = SORTS.find(s => s.key === sortBy);

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 24, gap: 16 }}>
        <div className="row" style={{ gap: 10, alignItems: 'center', marginBottom: 4 }}>
          <div className="center" style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,var(--royal),var(--royal-2))' }}>
            <Icon name="bolt" size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>มอบ XP / เหรียญ / ดาว</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>สแกนหรือพิมพ์รหัสนักเรียนเพื่อให้รางวัลความประพฤติ</div>
          </div>
        </div>
        <BarcodePanel autoFocus={false} compact />
      </div>

      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 24, gap: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: 16, color: 'var(--ink)' }}>กระดานผู้นำความประพฤติ & XP</h3>
          <div className="row" style={{ gap: 6 }}>
            {SORTS.map(s => (
              <button key={s.key} onClick={() => setSortBy(s.key)} className="btn"
                style={{ padding: '7px 14px', gap: 6, fontSize: 12.5, boxShadow: 'none',
                  background: sortBy === s.key ? s.color : 'var(--surface-2)',
                  color: sortBy === s.key ? '#fff' : 'var(--ink-soft)' }}>
                <Icon name={s.icon} size={13} /> {s.th}
              </button>
            ))}
          </div>
        </div>
        <div className="col" style={{ gap: 8 }}>
          {ranked.map((st, i) => (
            <div key={st.id} onClick={() => openStudent && openStudent(st.id)} className="row glass-2"
              style={{ gap: 12, padding: '10px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
              <span className="center display" style={{ width: 26, height: 26, borderRadius: 8, fontSize: 13, flexShrink: 0,
                background: i < 3 ? 'color-mix(in oklch,' + medal[i] + ' 22%,transparent)' : 'var(--surface-2)',
                color: i < 3 ? medal[i] : 'var(--muted)' }}>{i + 1}</span>
              <HeroAvatar student={st} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{st.nick} · {st.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>เลเวล {st.game.level} · {st.game.tier.th} · เหรียญตรา {st.badges} ตรา</div>
              </div>
              <div className="display" style={{ fontSize: 16, color: active.color, flexShrink: 0 }}>
                {(st.game[sortBy] || 0).toLocaleString()} {active.th}
              </div>
            </div>
          ))}
        </div>
      </div>
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

Object.assign(window, { TeacherShell, TeacherDashboard, BarcodeScore, BarcodePanel, BehaviorXP, SettingsPage, TEACHER_NAV });
