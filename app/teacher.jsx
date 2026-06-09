/* ============================================================
   TEACHER WORLD — shell (sidebar) + dashboard
   ============================================================ */
const TEACHER_NAV = [
  { key: 'dashboard',  th: 'แดชบอร์ด', icon: 'home' },
  { key: 'attendance', th: 'เช็กชื่อ',  icon: 'calendar' },
  { key: 'health',     th: 'สุขภาพ',    icon: 'heart' },
  { key: 'students',   th: 'นักเรียน',  icon: 'users' },
];

function TeacherShell({ route, setRoute, onPortal, onLogout, children }) {
  const { CLASS } = window.GC;
  const today = new Date(2026, 4, 29);
  const dstr = today.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div data-world="teacher" className="world row" style={{ position: 'absolute', inset: 0 }}>
      {/* sidebar */}
      <aside className="col" style={{ width: 250, flex: 'none', padding: 18, gap: 8, position: 'relative', zIndex: 2,
        borderRight: '1px solid var(--line)', background: 'var(--surface)', backdropFilter: 'blur(var(--glass-blur))' }}>
        <div className="row" style={{ gap: 11, padding: '8px 8px 16px' }}>
          <div className="center" style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--navy), var(--navy-2))' }}>
            <Icon name="shield" size={22} color="#fff" />
          </div>
          <div>
            <div className="display" style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1 }}>Classroom OS</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>ระบบบริหารชั้นเรียน</div>
          </div>
        </div>

        <div className="glass-2" style={{ borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: 8 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="display" style={{ fontSize: 22, color: 'var(--navy)' }}>{CLASS.name}</div>
            <span className="pill" style={{ background: 'color-mix(in oklch, var(--st-present) 16%, transparent)', color: 'var(--st-present)' }}>
              <span className="dot" style={{ background: 'var(--st-present)' }} /> สด
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{CLASS.total} คน · {CLASS.room}</div>
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
          <div className="center" style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--navy)', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-display)' }}>ค</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="nowrap" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{CLASS.teacher}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>ครูประจำชั้น</div>
          </div>
          <button onClick={onLogout} className="center" style={{ width: 30, height: 30, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
            <Icon name="logout" size={17} />
          </button>
        </div>
      </aside>

      {/* main */}
      <div className="col" style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
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
  const { CLASS, STUDENTS, STATUSES, WEEK_TREND } = window.GC;
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
            <h2 style={{ fontSize: 26, color: 'var(--ink)' }}>สวัสดีตอนเช้า คุณครูมานี 👋</h2>
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

Object.assign(window, { TeacherShell, TeacherDashboard, TEACHER_NAV });
