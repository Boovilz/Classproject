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
  { key: 'academic',   th: 'ผลการเรียน',        icon: 'book' },
  { key: 'homework',   th: 'การบ้าน',            icon: 'edit' },
  { key: 'finance',    th: 'การเงินห้องเรียน',   icon: 'coin' },
  { key: 'health',     th: 'สุขภาพ',             icon: 'heart' },
  { key: 'homevisit',  th: 'เยี่ยมบ้าน',         icon: 'door' },
  { key: 'documents',  th: 'เอกสาร',             icon: 'note' },
  { key: 'parent',     th: 'สื่อสารผู้ปกครอง',   icon: 'mail' },
  { key: 'settings',   th: 'ตั้งค่า',            icon: 'settings' },
];

function TeacherShell({ route, setRoute, onLogout, children }) {
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
  const subjectAvg = window.GC.getSubjectAverages();
  const events = window.GC.getUpcomingEvents(5);

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

      {/* stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <Stat icon="users" label="นักเรียนทั้งหมด" value={CLASS.total} sub={CLASS.name} color="var(--royal)" />
        <Stat icon="check" label="มาเรียนวันนี้" value={s.present} sub={`${presentPct}% ของห้อง`} color="var(--emerald)" />
        <Stat icon="bell" label="รายการที่ต้องติดตาม" value={alerts.length} sub="สุขภาพ / การมาเรียน" color="var(--orange)" />
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

      {/* quick actions */}
      <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
        <h3 style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>ดำเนินการด่วน</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
          <QuickActionBtn icon="check" label="เช็กชื่อวันนี้" color="var(--royal)" onClick={() => go('attendance')} />
          <QuickActionBtn icon="users" label="เพิ่มนักเรียน" color="var(--emerald)" onClick={() => go('students')} />
          <QuickActionBtn icon="coin" label="บันทึกการเงิน" color="var(--orange)" onClick={() => go('finance')} />
          <QuickActionBtn icon="mail" label="ส่งประกาศ" color="var(--royal)" onClick={() => go('parent')} />
          <QuickActionBtn icon="report" label="ออกรายงานผลการเรียน" color="var(--emerald)" onClick={() => go('academic')} />
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
Object.assign(window, { TeacherShell, TeacherDashboard, SettingsPage, TEACHER_NAV });
