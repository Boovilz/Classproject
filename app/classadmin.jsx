/* ============================================================
   TEACHER — Classroom Administrative System (milk / teeth-brushing / lunch)
   data is the same per-day attendance row used by Attendance, filtered
   to students whose attendance status counts as "came to school"
   ============================================================ */
const PRESENT_LIKE = ['present', 'late', 'activity'];

function ClassroomAdmin({ openStudent }) {
  const STUDENTS = useStudents();
  const { STATUSES, getAttendance, saveAttendance, isSchoolDay, dateKey, YEAR_START, YEAR_END } = window.GC;

  const TODAY = new Date(2026, 4, 29);

  const [selDate, setSelDate] = React.useState(() => {
    const d = new Date(TODAY);
    while (!isSchoolDay(d) && d >= YEAR_START) d.setDate(d.getDate() - 1);
    return dateKey(d);
  });

  const [allRows, setAllRows] = React.useState(() => getAttendance(selDate));
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    setAllRows(getAttendance(selDate));
    setDirty(false);
  }, [selDate]);

  React.useEffect(() => {
    setAllRows(prev => {
      const prevMap = Object.fromEntries(prev.map(r => [r.id, r]));
      return STUDENTS.map(s => prevMap[s.id] || { id: s.id, status: 'present', milk: true, brush: true, lunch: true });
    });
  }, [STUDENTS]);

  const student = id => STUDENTS.find(s => s.id === id);
  const presentRows = allRows.filter(r => PRESENT_LIKE.includes(r.status));
  const absentRows = allRows.filter(r => !PRESENT_LIKE.includes(r.status));

  const toggle = (id, key) => {
    setAllRows(r => r.map(x => x.id === id ? { ...x, [key]: !x[key] } : x));
    setDirty(true);
  };
  const bulkToggle = (key) => {
    const all = presentRows.every(x => x[key]);
    setAllRows(r => r.map(x => PRESENT_LIKE.includes(x.status) ? { ...x, [key]: !all } : x));
    setDirty(true);
  };
  const save = () => { saveAttendance(selDate, allRows); setDirty(false); };

  function shiftDay(dir) {
    const d = new Date(selDate);
    d.setDate(d.getDate() + dir);
    while (!isSchoolDay(d) && d >= YEAR_START && d <= YEAR_END) d.setDate(d.getDate() + dir);
    if (d >= YEAR_START && d <= YEAR_END) setSelDate(dateKey(d));
  }

  const dstr = new Date(selDate).toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const METRICS = [
    { key: 'milk',  th: 'ดื่มนม',     icon: 'drop',  color: 'var(--st-leave)' },
    { key: 'brush', th: 'แปรงฟัน',    icon: 'brush', color: 'var(--accent)' },
    { key: 'lunch', th: 'อาหารกลางวัน', icon: 'gift', color: 'var(--st-present)' },
  ];

  // 5-school-day trend per metric (ending at selDate)
  const trendDays = React.useMemo(() => {
    const days = [];
    const d = new Date(selDate);
    while (days.length < 5 && d >= YEAR_START) {
      if (isSchoolDay(d)) days.unshift(dateKey(d));
      d.setDate(d.getDate() - 1);
    }
    return days;
  }, [selDate]);

  const trendData = React.useMemo(() => {
    const out = {};
    METRICS.forEach(m => { out[m.key] = []; });
    trendDays.forEach(day => {
      const rows = day === selDate ? allRows : getAttendance(day);
      const present = rows.filter(r => PRESENT_LIKE.includes(r.status));
      const dd = new Date(day);
      const label = dd.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
      METRICS.forEach(m => {
        const pct = present.length ? Math.round((present.filter(r => r[m.key]).length / present.length) * 100) : 0;
        out[m.key].push({ d: label, v: pct });
      });
    });
    return out;
  }, [trendDays, allRows]);

  return (
    <div className="col" style={{ gap: 18 }}>
      {/* header / date nav */}
      <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '18px 24px', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h3 style={{ fontSize: 17, color: 'var(--ink)' }}>ธุรการชั้นเรียนรายวัน</h3>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>เชื่อมข้อมูลกับการเช็กชื่อ — แสดงเฉพาะนักเรียนที่มาเรียน</div>
        </div>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <button onClick={() => shiftDay(-1)} className="btn btn-ghost" style={{ padding: '8px 10px' }}>
            <Icon name="arrowLeft" size={16} />
          </button>
          <div className="pill tech" style={{ fontSize: 13, padding: '7px 14px' }}>{dstr}</div>
          <button onClick={() => shiftDay(1)} className="btn btn-ghost" style={{ padding: '8px 10px' }}>
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
        <button onClick={save} className="btn" style={{ padding: '9px 16px', fontSize: 13.5,
          background: dirty ? 'linear-gradient(120deg,var(--navy),var(--navy-2))' : 'var(--surface-2)',
          color: dirty ? '#fff' : 'var(--muted)' }}>
          <Icon name="download" size={16} color={dirty ? '#fff' : 'var(--muted)'} />
          {dirty ? 'บันทึก *' : 'บันทึกแล้ว'}
        </button>
      </div>

      {/* note about excluded students */}
      {absentRows.length > 0 && (
        <div className="glass row" style={{ borderRadius: 'var(--r-md)', padding: '12px 18px', gap: 10, alignItems: 'center' }}>
          <Icon name="note" size={16} color="var(--muted)" />
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            ไม่นับ {absentRows.length} คนที่ไม่ได้มาเรียนวันนี้ ({absentRows.map(r => student(r.id)?.nick).filter(Boolean).join(', ')})
          </span>
        </div>
      )}

      {/* summary stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {METRICS.map(m => {
          const cnt = presentRows.filter(r => r[m.key]).length;
          const pct = presentRows.length ? Math.round((cnt / presentRows.length) * 100) : 0;
          return (
            <Stat key={m.key} icon={m.icon} label={m.th} value={`${cnt}/${presentRows.length}`}
              sub={`${pct}% ของนักเรียนที่มาเรียน`} color={m.color} />
          );
        })}
      </div>

      {/* table */}
      <div className="glass" style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div className="row" style={{ padding: '12px 18px', borderBottom: '1px solid var(--line)', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>นักเรียนที่มาเรียน ({presentRows.length} คน)</div>
          {METRICS.map(m => (
            <div key={m.key} className="center col" style={{ width: 84, gap: 4 }}>
              <Icon name={m.icon} size={15} color={m.color} />
              <span onClick={() => bulkToggle(m.key)} style={{ cursor: 'pointer', fontSize: 12, color: 'var(--ink-soft)' }}>{m.th}</span>
            </div>
          ))}
        </div>
        <div className="col" style={{ maxHeight: 520, overflowY: 'auto' }}>
          {presentRows.map(r => {
            const s = student(r.id);
            if (!s) return null;
            return (
              <div key={r.id} className="row" style={{ padding: '9px 18px', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)' }}>
                <button onClick={() => openStudent && openStudent(s.id)} className="row" style={{ flex: 1, gap: 10, alignItems: 'center', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  <HeroAvatar student={s} size={34} />
                  <div style={{ minWidth: 0 }}>
                    <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{s.nick}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>เลขที่ {s.no}</div>
                  </div>
                </button>
                {METRICS.map(m => (
                  <div key={m.key} className="center" style={{ width: 84 }}>
                    <button onClick={() => toggle(r.id, m.key)} className="center"
                      style={{ width: 30, height: 30, borderRadius: 9, cursor: 'pointer', border: 'none',
                        background: r[m.key] ? 'var(--st-present)' : 'var(--surface-2)',
                        color: r[m.key] ? '#fff' : 'var(--muted)',
                        transition: 'all .2s', transform: r[m.key] ? 'scale(1)' : 'scale(.95)' }}>
                      <Icon name={r[m.key] ? 'check' : 'minus'} size={16} color={r[m.key] ? '#fff' : 'var(--muted)'} sw={2.4} />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
          {presentRows.length === 0 && (
            <div className="center" style={{ padding: 30, fontSize: 13, color: 'var(--muted)' }}>ไม่มีนักเรียนมาเรียนในวันนี้</div>
          )}
        </div>
      </div>

      {/* trend charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {METRICS.map(m => (
          <div key={m.key} className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '18px 22px' }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
              <h4 style={{ fontSize: 14, color: 'var(--ink)' }}>แนวโน้ม{m.th} (% 5 วันล่าสุด)</h4>
              <Icon name={m.icon} size={17} color={m.color} />
            </div>
            <LineChart data={trendData[m.key] || []} color={m.color} h={150} />
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ClassroomAdmin });
