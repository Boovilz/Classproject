/* ============================================================
   TEACHER — Attendance + Welfare table (interactive)
   ============================================================ */
function Attendance({ openStudent }) {
  const STUDENTS = useStudents();
  const { STATUSES, CLASS } = window.GC;
  const order = ['present', 'late', 'sick', 'leave', 'activity', 'absent'];
  const [rows, setRows] = React.useState(() => STUDENTS.map(s => ({
    id: s.id, status: s.status, milk: s.welfare.milk, brush: s.welfare.brush, lunch: s.welfare.lunch,
  })));
  const [picker, setPicker] = React.useState(null);
  const [dayIdx, setDayIdx] = React.useState(4);

  React.useEffect(() => {
    setRows(prev => {
      const prevMap = Object.fromEntries(prev.map(r => [r.id, r]));
      return STUDENTS.map(s => prevMap[s.id] || {
        id: s.id, status: s.status, milk: s.welfare.milk, brush: s.welfare.brush, lunch: s.welfare.lunch,
      });
    });
  }, [STUDENTS]);

  const setStatus = (id, status) => { setRows(r => r.map(x => x.id === id ? { ...x, status } : x)); setPicker(null); };
  const toggle = (id, key) => setRows(r => r.map(x => x.id === id ? { ...x, [key]: !x[key] } : x));
  const bulkAll = (status) => setRows(r => r.map(x => ({ ...x, status })));
  const bulkWelfare = (key) => { const all = rows.every(x => x[key]); setRows(r => r.map(x => ({ ...x, [key]: !all }))); };

  const counts = order.map(k => [k, rows.filter(r => r.status === k).length]);
  const days = [['จ', '26'], ['อ', '27'], ['พ', '28'], ['พฤ', '29'], ['ศ', '30']];

  const student = id => STUDENTS.find(s => s.id === id);

  return (
    <div className="col" style={{ gap: 18 }}>
      {/* date strip + bulk */}
      <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '14px 18px', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 8 }}>
          <button className="center glass-2" style={{ width: 38, height: 38, borderRadius: 10, cursor: 'pointer' }}><Icon name="arrowLeft" size={18} color="var(--ink-soft)" /></button>
          {days.map((d, i) => (
            <button key={i} onClick={() => setDayIdx(i)} className="center col" style={{ width: 50, height: 56, borderRadius: 12, cursor: 'pointer', gap: 2, border: 'none',
              background: dayIdx === i ? 'linear-gradient(160deg,var(--navy),var(--navy-2))' : 'var(--surface-2)',
              color: dayIdx === i ? '#fff' : 'var(--ink-soft)' }}>
              <span style={{ fontSize: 11 }}>{d[0]}</span>
              <span className="display" style={{ fontSize: 18 }}>{d[1]}</span>
            </button>
          ))}
          <button className="center glass-2" style={{ width: 38, height: 38, borderRadius: 10, cursor: 'pointer' }}><Icon name="arrowRight" size={18} color="var(--ink-soft)" /></button>
          <div className="row" style={{ gap: 7, marginLeft: 10 }}>
            <Icon name="calendar" size={16} color="var(--muted)" />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>พฤษภาคม 2569 · ปฏิทินการศึกษา</span>
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span style={{ fontSize: 12.5, color: 'var(--muted)', alignSelf: 'center' }}>เช็กรวดเร็ว:</span>
          <button onClick={() => bulkAll('present')} className="btn" style={{ padding: '8px 13px', fontSize: 13, background: 'color-mix(in oklch,var(--st-present) 16%,transparent)', color: 'var(--st-present)' }}>
            <Icon name="check" size={16} color="var(--st-present)" /> มาทั้งห้อง
          </button>
          <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 13 }}><Icon name="download" size={16} color="#fff" /> บันทึก</button>
        </div>
      </div>

      {/* summary chips */}
      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        {counts.map(([k, n]) => (
          <div key={k} className="row glass-2" style={{ gap: 8, padding: '8px 14px', borderRadius: 99 }}>
            <span className="dot" style={{ background: STATUSES[k].color }} />
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{STATUSES[k].th}</span>
            <span className="display" style={{ fontSize: 15, color: 'var(--ink)' }}>{n}</span>
          </div>
        ))}
      </div>

      {/* table */}
      <div className="glass" style={{ borderRadius: 'var(--r-lg)', overflow: 'visible' }}>
        {/* header */}
        <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>
          <div style={{ width: 38 }}>เลข</div>
          <div style={{ flex: 1 }}>นักเรียน</div>
          <div style={{ width: 200, textAlign: 'center' }}>สถานะ</div>
          <div className="center" style={{ width: 70, flexDirection: 'column', gap: 4 }}>
            <Icon name="drop" size={16} color="var(--st-leave)" /><span onClick={() => bulkWelfare('milk')} style={{ cursor: 'pointer' }}>นม</span>
          </div>
          <div className="center" style={{ width: 70, flexDirection: 'column', gap: 4 }}>
            <Icon name="spark" size={16} color="var(--st-present)" /><span onClick={() => bulkWelfare('brush')} style={{ cursor: 'pointer' }}>แปรงฟัน</span>
          </div>
          <div className="center" style={{ width: 70, flexDirection: 'column', gap: 4 }}>
            <Icon name="gift" size={16} color="var(--st-late)" /><span onClick={() => bulkWelfare('lunch')} style={{ cursor: 'pointer' }}>กลางวัน</span>
          </div>
        </div>
        {/* rows */}
        <div>
          {rows.map((r, i) => {
            const st = student(r.id); const stat = STATUSES[r.status];
            return (
              <div key={r.id} className="row" style={{ padding: '10px 20px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-soft)' : 'none',
                background: i % 2 ? 'transparent' : 'var(--surface-2)' }}>
                <div className="tech" style={{ width: 38, color: 'var(--muted)', fontSize: 14 }}>{String(st.no).padStart(2, '0')}</div>
                <div className="row" style={{ flex: 1, gap: 11, cursor: 'pointer' }} onClick={() => openStudent(st.id)}>
                  <HeroAvatar student={st} size={38} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{st.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>"{st.nick}"</div>
                  </div>
                </div>
                {/* status picker */}
                <div className="center" style={{ width: 200, position: 'relative' }}>
                  <button onClick={() => setPicker(picker === r.id ? null : r.id)} className="pill" style={{ cursor: 'pointer', border: 'none',
                    background: 'color-mix(in oklch,' + stat.color + ' 16%,transparent)', color: stat.color, padding: '6px 14px', fontSize: 13 }}>
                    <span className="dot" style={{ background: stat.color }} /> {stat.th} <Icon name="chevD" size={14} color={stat.color} />
                  </button>
                  {picker === r.id && (
                    <div className="glass pop" style={{ position: 'absolute', top: '100%', marginTop: 6, zIndex: 30, borderRadius: 'var(--r-md)', padding: 6, width: 170, boxShadow: '0 20px 50px -16px rgba(0,0,0,.3)' }}>
                      {order.map(k => (
                        <button key={k} onClick={() => setStatus(r.id, k)} className="row" style={{ width: '100%', gap: 9, padding: '9px 11px', borderRadius: 9, border: 'none', cursor: 'pointer',
                          background: r.status === k ? 'var(--surface-2)' : 'transparent', color: 'var(--ink)', fontSize: 13.5, fontFamily: 'var(--font-body)' }}>
                          <span className="dot" style={{ background: STATUSES[k].color }} /> {STATUSES[k].th}
                          {r.status === k && <Icon name="check" size={15} color={STATUSES[k].color} style={{ marginLeft: 'auto' }} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* welfare toggles */}
                {['milk', 'brush', 'lunch'].map(key => (
                  <div key={key} className="center" style={{ width: 70 }}>
                    <button onClick={() => toggle(r.id, key)} className="center" style={{ width: 30, height: 30, borderRadius: 9, cursor: 'pointer', border: 'none',
                      background: r[key] ? 'var(--st-present)' : 'var(--surface-2)', color: r[key] ? '#fff' : 'var(--muted)',
                      transition: 'all .2s', transform: r[key] ? 'scale(1)' : 'scale(.95)' }}>
                      <Icon name={r[key] ? 'check' : 'minus'} size={16} color={r[key] ? '#fff' : 'var(--muted)'} sw={2.4} />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
        แตะที่สถานะเพื่อแก้ไข · แตะหัวคอลัมน์สุขภาวะเพื่อติ๊กทั้งห้อง · ประวัติย้อนหลังแก้ไขได้ทุกวัน
      </p>
    </div>
  );
}
window.Attendance = Attendance;
