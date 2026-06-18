/* ============================================================
   TEACHER — Attendance with always-visible calendar (supports
   backdating: pick any past school day from the calendar and
   save corrected statuses for that day)
   ============================================================ */
function Attendance({ openStudent }) {
  const STUDENTS = useStudents();
  const { STATUSES, getAttendance, saveAttendance, isSchoolDay, dateKey, YEAR_START, YEAR_END } = window.GC;
  const order = ['present', 'late', 'sick', 'leave', 'activity', 'absent'];

  const TODAY = new Date(2026, 4, 29);

  // selected date
  const [selDate, setSelDate] = React.useState(() => {
    // find most recent school day up to today
    const d = new Date(TODAY);
    while (!isSchoolDay(d) && d >= YEAR_START) d.setDate(d.getDate() - 1);
    return dateKey(d);
  });

  const [calMonth, setCalMonth] = React.useState(() => {
    const d = new Date(selDate); return { y: d.getFullYear(), m: d.getMonth() };
  });

  // current attendance rows
  const [rows, setRows] = React.useState(() => getAttendance(selDate));
  const [dirty, setDirty] = React.useState(false);
  const [showBarcode, setShowBarcode] = React.useState(false);
  const [awardRow, setAwardRow] = React.useState(null); // student id
  const [awardType, setAwardType] = React.useState('xp');
  const [awardAmt, setAwardAmt] = React.useState(10);
  const [awardToast, setAwardToast] = React.useState(null);

  function doAward(studentId) {
    const st = student(studentId);
    if (!st) return;
    window.GC.addScoreLog({ studentId, studentName: st.name, type: awardType, amount: awardAmt, note: 'จากเช็คชื่อ' });
    setAwardToast(`+${awardAmt} ${awardType.toUpperCase()} → ${st.nick}`);
    setTimeout(() => setAwardToast(null), 2500);
    setAwardRow(null);
  }

  // reload rows when date changes
  React.useEffect(() => {
    setRows(getAttendance(selDate));
    setDirty(false);
  }, [selDate]);

  // sync new students into rows
  React.useEffect(() => {
    setRows(prev => {
      const prevMap = Object.fromEntries(prev.map(r => [r.id, r]));
      return STUDENTS.map(s => prevMap[s.id] || { id: s.id, status: 'present', milk: true, brush: true, lunch: true });
    });
  }, [STUDENTS]);

  const setStatus = (id, status) => { setRows(r => r.map(x => x.id === id ? { ...x, status } : x)); setDirty(true); };
  const bulkAll = (status) => { setRows(r => r.map(x => ({ ...x, status }))); setDirty(true); };
  const save = () => { saveAttendance(selDate, rows); setDirty(false); };

  const student = id => STUDENTS.find(s => s.id === id);
  const counts = order.map(k => [k, rows.filter(r => r.status === k).length]);

  // jump to any date (past or future within the school year) — enables backdated edits
  function jumpToDate(dateStr) {
    setSelDate(dateStr);
    const d = new Date(dateStr);
    setCalMonth({ y: d.getFullYear(), m: d.getMonth() });
  }

  const TH_MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

  // calendar grid data
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

  return (
    <div className="col" style={{ gap: 18 }}>
      {awardToast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: 'linear-gradient(120deg,var(--gold),oklch(0.72 0.16 55))', color: '#1a1200',
          padding: '10px 22px', borderRadius: 99, fontWeight: 700, fontSize: 14,
          boxShadow: '0 8px 32px -8px var(--gold)', animation: 'rise .2s ease-out' }}>
          ⚡ {awardToast}
        </div>
      )}

      {/* ── calendar + status legend ── */}
      <div className="row" style={{ gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* calendar — pick any school day, including past ones, to record/correct attendance */}
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

        {/* legend — the 6 attendance statuses */}
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: 18, flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 12 }}>เกณฑ์สถานะการมาเรียน</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {order.map(k => (
              <div key={k} className="row" style={{ gap: 9, alignItems: 'center' }}>
                <div className="center" style={{ width: 30, height: 30, borderRadius: 9, background: 'color-mix(in oklch,' + STATUSES[k].color + ' 16%,transparent)' }}>
                  <Icon name={STATUSES[k].icon} size={15} color={STATUSES[k].color} />
                </div>
                <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{STATUSES[k].th}</span>
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
            <button onClick={() => bulkAll('present')} className="btn"
              style={{ padding: '7px 12px', fontSize: 12.5, background: 'color-mix(in oklch,var(--st-present) 16%,transparent)', color: 'var(--st-present)' }}>
              <Icon name="check" size={15} color="var(--st-present)" /> มาทั้งห้อง
            </button>
            <button onClick={save} className="btn"
              style={{ padding: '7px 14px', fontSize: 12.5,
                background: dirty ? 'linear-gradient(120deg,var(--navy),var(--navy-2))' : 'var(--surface-2)',
                color: dirty ? '#fff' : 'var(--muted)' }}>
              <Icon name="download" size={15} color={dirty ? '#fff' : 'var(--muted)'} />
              {dirty ? 'บันทึก *' : 'บันทึกแล้ว'}
            </button>
            <button onClick={() => setShowBarcode(b => !b)} className="btn"
              style={{ padding: '7px 14px', fontSize: 12.5,
                background: showBarcode ? 'linear-gradient(120deg,oklch(0.52 0.19 265),oklch(0.48 0.2 280))' : 'var(--surface-2)',
                color: showBarcode ? '#fff' : 'var(--ink-soft)' }}>
              <Icon name="report" size={15} color={showBarcode ? '#fff' : 'var(--ink-soft)'} />
              {showBarcode ? 'ซ่อนบาร์โค้ด' : 'บันทึกคะแนน 🔲'}
            </button>
          </div>

          {/* summary chips */}
          <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            {counts.map(([k, n]) => (
              <div key={k} className="row glass-2" style={{ gap: 7, padding: '6px 12px', borderRadius: 99 }}>
                <span className="dot" style={{ background: STATUSES[k].color }} />
                <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{STATUSES[k].th}</span>
                <span className="display" style={{ fontSize: 14, color: 'var(--ink)' }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* barcode panel — inline toggle */}
      {showBarcode && (
        <div className="glass col" style={{ borderRadius: 'var(--r-lg)', padding: 18, gap: 10,
          borderLeft: '3px solid oklch(0.52 0.19 265)', animation: 'rise .2s ease-out' }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
              <Icon name="report" size={16} /> บันทึกคะแนนด้วยบาร์โค้ด
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>สแกนหรือพิมพ์รหัส → กด Enter → มอบคะแนน</span>
          </div>
          <BarcodePanel compact={true} autoFocus={false} />
        </div>
      )}

      {/* table — one checkbox per status, per student */}
      <div className="glass" style={{ borderRadius: 'var(--r-lg)', overflow: 'visible' }}>
        <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>
          <div style={{ width: 38 }}>เลข</div>
          <div style={{ flex: 1 }}>นักเรียน</div>
          {order.map(k => (
            <div key={k} className="center" style={{ width: 58, flexDirection: 'column', gap: 4 }}>
              <Icon name={STATUSES[k].icon} size={15} color={STATUSES[k].color} />
              <span>{STATUSES[k].short}</span>
            </div>
          ))}
          <div className="center" style={{ width: 56, flexDirection: 'column', gap: 4 }}>
            <Icon name="bolt" size={16} color="var(--gold)" />
            <span style={{ color: 'var(--gold)', fontSize: 10 }}>คะแนน</span>
          </div>
        </div>
        <div>
          {rows.map((r, i) => {
            const st = student(r.id);
            if (!st) return null;
            return (
              <React.Fragment key={r.id}>
              <div className="row"
                style={{ padding: '10px 20px', borderBottom: awardRow === r.id ? 'none' : (i < rows.length - 1 ? '1px solid var(--line-soft)' : 'none'),
                  background: i % 2 ? 'transparent' : 'var(--surface-2)' }}>
                <div className="tech" style={{ width: 38, color: 'var(--muted)', fontSize: 14 }}>{String(st.no).padStart(2, '0')}</div>
                <div className="row" style={{ flex: 1, gap: 11, cursor: 'pointer' }} onClick={() => openStudent(st.id)}>
                  <HeroAvatar student={st} size={38} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{st.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>"{st.nick}" {st.code ? '· #'+st.code : ''}</div>
                  </div>
                </div>
                {/* status checkboxes */}
                {order.map(k => {
                  const on = r.status === k;
                  return (
                    <div key={k} className="center" style={{ width: 58 }}>
                      <button onClick={() => setStatus(r.id, k)} className="center"
                        style={{ width: 30, height: 30, borderRadius: 9, cursor: 'pointer', border: 'none',
                          background: on ? STATUSES[k].color : 'var(--surface-2)',
                          color: on ? '#fff' : 'var(--muted)',
                          transition: 'all .2s', transform: on ? 'scale(1)' : 'scale(.95)' }}>
                        <Icon name={STATUSES[k].icon} size={15} color={on ? '#fff' : 'var(--muted)'} sw={2.4} />
                      </button>
                    </div>
                  );
                })}
                {/* per-student score button */}
                <div className="center" style={{ width: 56 }}>
                  <button onClick={() => setAwardRow(awardRow === r.id ? null : r.id)} className="center"
                    style={{ width: 32, height: 32, borderRadius: 9, cursor: 'pointer', border: 'none',
                      background: awardRow === r.id ? 'var(--gold)' : 'color-mix(in oklch,var(--gold) 16%,transparent)',
                      color: awardRow === r.id ? '#1a1200' : 'var(--gold)', transition: 'all .18s' }}>
                    <Icon name="bolt" size={16} color={awardRow === r.id ? '#1a1200' : 'var(--gold)'} />
                  </button>
                </div>
              </div>
              {/* inline award expand */}
              {awardRow === r.id && (
                <div className="row" style={{ padding: '10px 20px 12px', gap: 10, background: 'color-mix(in oklch,var(--gold) 8%,transparent)', borderTop: '1px dashed color-mix(in oklch,var(--gold) 30%,transparent)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>มอบให้ {st.nick}</span>
                  <div className="row" style={{ gap: 4 }}>
                    {[['xp','⚡ XP'],['coin','🪙 Coin'],['star','⭐ Star']].map(([t,l]) => (
                      <button key={t} onClick={() => setAwardType(t)} className="btn"
                        style={{ padding: '5px 11px', fontSize: 12, background: awardType === t ? 'var(--navy)' : 'var(--surface-2)', color: awardType === t ? '#fff' : 'var(--ink-soft)' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                  <div className="row" style={{ gap: 4 }}>
                    {[5,10,20,50].map(v => (
                      <button key={v} onClick={() => setAwardAmt(v)} className="btn"
                        style={{ padding: '5px 10px', fontSize: 12, background: awardAmt === v ? 'var(--gold)' : 'var(--surface-2)', color: awardAmt === v ? '#1a1200' : 'var(--ink-soft)' }}>
                        +{v}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => doAward(r.id)} className="btn"
                    style={{ padding: '7px 16px', fontSize: 13, background: 'linear-gradient(120deg,var(--gold),oklch(0.72 0.16 55))', color: '#1a1200', fontWeight: 700 }}>
                    มอบ +{awardAmt}
                  </button>
                </div>
              )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
        แตะสถานะเพื่อแก้ไข · เลือกวันที่ในปฏิทินด้านบนเพื่อบันทึกหรือแก้ไขข้อมูลย้อนหลัง
      </p>
    </div>
  );
}
window.Attendance = Attendance;
