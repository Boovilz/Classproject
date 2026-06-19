/* ============================================================
   TEACHER — Classroom Administrative System (milk / teeth-brushing / lunch)
   Same look as the Attendance page: always-visible calendar (supports
   backdating) + legend card. Data is the same per-day attendance row
   used by Attendance, filtered to students whose attendance status
   counts as "came to school" — marking a student present-like there
   auto-ticks these welfare fields, since attending implies receiving them.
   ============================================================ */
function ClassroomAdmin({ openStudent }) {
  const STUDENTS = useStudents();
  const { PRESENT_LIKE, getAttendance, saveAttendance, isSchoolDay, dateKey, YEAR_START, YEAR_END } = window.GC;

  const TODAY = new Date(2026, 4, 29);

  const [selDate, setSelDate] = React.useState(() => {
    const d = new Date(TODAY);
    while (!isSchoolDay(d) && d >= YEAR_START) d.setDate(d.getDate() - 1);
    return dateKey(d);
  });

  const [calMonth, setCalMonth] = React.useState(() => {
    const d = new Date(selDate); return { y: d.getFullYear(), m: d.getMonth() };
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
  const tickAll = () => {
    setAllRows(r => r.map(x => PRESENT_LIKE.includes(x.status) ? { ...x, milk: true, brush: true, lunch: true } : x));
    setDirty(true);
  };
  const save = () => { saveAttendance(selDate, allRows); setDirty(false); };

  // jump to any date (past or future within the school year) — enables backdated edits,
  // same calendar pattern as the Attendance page
  function jumpToDate(dateStr) {
    setSelDate(dateStr);
    const d = new Date(dateStr);
    setCalMonth({ y: d.getFullYear(), m: d.getMonth() });
  }

  const TH_MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

  function calDays(y, m) {
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startDow = (first.getDay() + 6) % 7; // Mon=0
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(y, m, d));
    return cells;
  }

  const selDateObj = new Date(selDate);

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
      {/* ── calendar + welfare legend ── */}
      <div className="row" style={{ gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* calendar — pick any school day, including past ones, to record/correct welfare data */}
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: 16, width: 300 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <button onClick={() => setCalMonth(({y,m}) => m === 0 ? {y:y-1,m:11} : {y,m:m-1})}
              className="btn btn-ghost" style={{ padding: '2px 9px', fontSize: 18 }}>‹</button>
            <span className="display" style={{ fontSize: 14.5, color: 'var(--ink)' }}>
              {TH_MONTHS_FULL[calMonth.m]} {calMonth.y}
            </span>
            <button onClick={() => setCalMonth(({y,m}) => m === 11 ? {y:y+1,m:0} : {y,m:m+1})}
              className="btn btn-ghost" style={{ padding: '2px 9px', fontSize: 18 }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 4 }}>
            {['จ','อ','พ','พฤ','ศ','ส','อา'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
            {calDays(calMonth.y, calMonth.m).map((d, i) => {
              if (!d) return <div key={i} />;
              const k = dateKey(d);
              const school = isSchoolDay(d);
              const isSel = k === selDate;
              const isToday = k === dateKey(TODAY);
              const hasDot = !!window.GC.ATTENDANCE_HISTORY[k];
              return (
                <button key={i} onClick={() => school && jumpToDate(k)}
                  style={{ border: 'none', borderRadius: 8, padding: '6px 2px', cursor: school ? 'pointer' : 'default',
                    background: isSel ? 'linear-gradient(160deg,var(--navy),var(--navy-2))' : isToday ? 'var(--surface-2)' : 'transparent',
                    color: isSel ? '#fff' : school ? 'var(--ink-soft)' : 'var(--muted)',
                    opacity: school ? 1 : 0.4,
                    outline: isToday && !isSel ? '1.5px solid var(--navy)' : 'none',
                    fontSize: 13, textAlign: 'center', position: 'relative' }}>
                  {d.getDate()}
                  {hasDot && !isSel && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: 'var(--st-present)' }} />}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
            คลิกวันที่ในปฏิทินเพื่อบันทึกย้อนหลังได้
          </div>
        </div>

        {/* legend — the 3 welfare metrics, linked to attendance */}
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: 18, flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 4 }}>เกณฑ์ข้อมูลธุรการ</div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 12 }}>เชื่อมข้อมูลกับการเช็กชื่อ — มาเรียนแล้วถือว่าได้รับครบทั้ง 3 อย่าง แก้ไขรายคนได้ที่ตาราง</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {METRICS.map(m => (
              <div key={m.key} className="row" style={{ gap: 9, alignItems: 'center' }}>
                <div className="center" style={{ width: 30, height: 30, borderRadius: 9, background: 'color-mix(in oklch,' + m.color + ' 16%,transparent)' }}>
                  <Icon name={m.icon} size={15} color={m.color} />
                </div>
                <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{m.th}</span>
              </div>
            ))}
          </div>

          {/* selected date + bulk actions */}
          <div className="row" style={{ gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <div className="display" style={{ fontSize: 15, color: 'var(--ink)', flex: 1 }}>
              {selDateObj.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            {isSchoolDay(selDateObj)
              ? <span className="pill" style={{ background: 'color-mix(in oklch,var(--st-present) 16%,transparent)', color: 'var(--st-present)', fontSize: 11 }}>วันเรียน</span>
              : <span className="pill" style={{ background: 'var(--surface-2)', color: 'var(--muted)', fontSize: 11 }}>หยุด</span>}
            <button onClick={tickAll} className="btn"
              style={{ padding: '7px 12px', fontSize: 12.5, background: 'color-mix(in oklch,var(--st-present) 16%,transparent)', color: 'var(--st-present)' }}>
              <Icon name="check" size={15} color="var(--st-present)" /> ติ๊กครบทั้งห้อง
            </button>
            <button onClick={save} className="btn"
              style={{ padding: '7px 14px', fontSize: 12.5,
                background: dirty ? 'linear-gradient(120deg,var(--navy),var(--navy-2))' : 'var(--surface-2)',
                color: dirty ? '#fff' : 'var(--muted)' }}>
              <Icon name="download" size={15} color={dirty ? '#fff' : 'var(--muted)'} />
              {dirty ? 'บันทึก *' : 'บันทึกแล้ว'}
            </button>
          </div>

          {/* summary chips */}
          <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            {METRICS.map(m => {
              const cnt = presentRows.filter(r => r[m.key]).length;
              const pct = presentRows.length ? Math.round((cnt / presentRows.length) * 100) : 0;
              return (
                <div key={m.key} className="row glass-2" style={{ gap: 7, padding: '6px 12px', borderRadius: 99 }}>
                  <span className="dot" style={{ background: m.color }} />
                  <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{m.th}</span>
                  <span className="display" style={{ fontSize: 14, color: 'var(--ink)' }}>{cnt}/{presentRows.length}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
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

      {/* table — one checkbox per welfare metric, per present student */}
      <div className="glass" style={{ borderRadius: 'var(--r-lg)', overflow: 'visible' }}>
        <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>
          <div style={{ width: 38 }}>เลข</div>
          <div style={{ flex: 1 }}>นักเรียนที่มาเรียน ({presentRows.length} คน)</div>
          {METRICS.map(m => (
            <div key={m.key} className="center" style={{ width: 84, flexDirection: 'column', gap: 4 }}>
              <Icon name={m.icon} size={15} color={m.color} />
              <span onClick={() => bulkToggle(m.key)} style={{ cursor: 'pointer' }}>{m.th}</span>
            </div>
          ))}
        </div>
        <div>
          {presentRows.map((r, i) => {
            const s = student(r.id);
            if (!s) return null;
            return (
              <div key={r.id} className="row"
                style={{ padding: '10px 20px', borderBottom: i < presentRows.length - 1 ? '1px solid var(--line-soft)' : 'none',
                  background: i % 2 ? 'transparent' : 'var(--surface-2)' }}>
                <div className="tech" style={{ width: 38, color: 'var(--muted)', fontSize: 14 }}>{String(s.no).padStart(2, '0')}</div>
                <div className="row" style={{ flex: 1, gap: 11, cursor: 'pointer' }} onClick={() => openStudent && openStudent(s.id)}>
                  <HeroAvatar student={s} size={38} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{s.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>"{s.nick}" {s.code ? '· #'+s.code : ''}</div>
                  </div>
                </div>
                {METRICS.map(m => {
                  const on = !!r[m.key];
                  return (
                    <div key={m.key} className="center" style={{ width: 84 }}>
                      <button onClick={() => toggle(r.id, m.key)} className="center"
                        style={{ width: 30, height: 30, borderRadius: 9, cursor: 'pointer', border: 'none',
                          background: on ? m.color : 'var(--surface-2)',
                          color: on ? '#fff' : 'var(--muted)',
                          transition: 'all .2s', transform: on ? 'scale(1)' : 'scale(.95)' }}>
                        <Icon name={on ? 'check' : 'minus'} size={15} color={on ? '#fff' : 'var(--muted)'} sw={2.4} />
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {presentRows.length === 0 && (
            <div className="center" style={{ padding: 30, fontSize: 13, color: 'var(--muted)' }}>ไม่มีนักเรียนมาเรียนในวันนี้</div>
          )}
        </div>
      </div>

      <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
        แตะช่องเพื่อแก้ไข · เลือกวันที่ในปฏิทินด้านบนเพื่อบันทึกหรือแก้ไขข้อมูลย้อนหลัง
      </p>

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
