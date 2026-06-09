/* ============================================================
   TEACHER — Attendance with full academic-year calendar
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

  // week anchor = Monday of the selected date's week
  const [weekMonday, setWeekMonday] = React.useState(() => {
    const d = new Date(selDate);
    const dow = d.getDay() || 7;
    d.setDate(d.getDate() - (dow - 1));
    return dateKey(d);
  });

  // show mini-calendar
  const [showCal, setShowCal] = React.useState(false);
  const [calMonth, setCalMonth] = React.useState(() => {
    const d = new Date(selDate); return { y: d.getFullYear(), m: d.getMonth() };
  });

  // current attendance rows
  const [rows, setRows] = React.useState(() => getAttendance(selDate));
  const [picker, setPicker] = React.useState(null);
  const [dirty, setDirty] = React.useState(false);
  const [showBarcode, setShowBarcode] = React.useState(false);
  const calBtnRef = React.useRef(null);
  const [calDropPos, setCalDropPos] = React.useState({ top: 0, left: 0 });
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
    setPicker(null);
  }, [selDate]);

  // sync new students into rows
  React.useEffect(() => {
    setRows(prev => {
      const prevMap = Object.fromEntries(prev.map(r => [r.id, r]));
      return STUDENTS.map(s => prevMap[s.id] || { id: s.id, status: 'present', milk: true, brush: true, lunch: true });
    });
  }, [STUDENTS]);

  const setStatus = (id, status) => { setRows(r => r.map(x => x.id === id ? { ...x, status } : x)); setPicker(null); setDirty(true); };
  const toggle = (id, key) => { setRows(r => r.map(x => x.id === id ? { ...x, [key]: !x[key] } : x)); setDirty(true); };
  const bulkAll = (status) => { setRows(r => r.map(x => ({ ...x, status }))); setDirty(true); };
  const bulkWelfare = (key) => { const all = rows.every(x => x[key]); setRows(r => r.map(x => ({ ...x, [key]: !all }))); setDirty(true); };
  const save = () => { saveAttendance(selDate, rows); setDirty(false); };

  const student = id => STUDENTS.find(s => s.id === id);
  const counts = order.map(k => [k, rows.filter(r => r.status === k).length]);

  // compute Mon-Fri of current week
  function weekDays(mondayStr) {
    const mon = new Date(mondayStr);
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(mon); d.setDate(d.getDate() + i);
      return d;
    });
  }

  function prevWeek() {
    const d = new Date(weekMonday); d.setDate(d.getDate() - 7);
    if (d >= YEAR_START) { setWeekMonday(dateKey(d)); }
  }
  function nextWeek() {
    const d = new Date(weekMonday); d.setDate(d.getDate() + 7);
    if (d <= YEAR_END) { setWeekMonday(dateKey(d)); }
  }

  function selectDay(d) {
    if (!isSchoolDay(d)) return;
    const k = dateKey(d);
    setSelDate(k);
    setCalMonth({ y: d.getFullYear(), m: d.getMonth() });
  }

  // jump to a date and update week
  function jumpToDate(dateStr) {
    setSelDate(dateStr);
    const d = new Date(dateStr);
    const dow = d.getDay() || 7;
    d.setDate(d.getDate() - (dow - 1));
    setWeekMonday(dateKey(d));
    setShowCal(false);
  }

  const days = weekDays(weekMonday);
  const TH_DAYS = ['จ', 'อ', 'พ', 'พฤ', 'ศ'];
  const TH_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const TH_MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

  // mini-calendar data
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

      {/* ── week strip ── */}
      <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '14px 18px', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>

          {/* prev week */}
          <button onClick={prevWeek} className="center glass-2"
            style={{ width: 38, height: 38, borderRadius: 10, cursor: 'pointer', border: 'none' }}>
            <Icon name="arrowLeft" size={18} color="var(--ink-soft)" />
          </button>

          {/* day buttons */}
          {days.map((d, i) => {
            const k = dateKey(d);
            const school = isSchoolDay(d);
            const isSel = k === selDate;
            const isToday = k === dateKey(TODAY);
            const hasData = !!window.GC.ATTENDANCE_HISTORY[k];
            return (
              <button key={i} onClick={() => school && jumpToDate(k)}
                className="center col"
                style={{ width: 50, height: 58, borderRadius: 12, cursor: school ? 'pointer' : 'default', gap: 2, border: 'none',
                  background: isSel ? 'linear-gradient(160deg,var(--navy),var(--navy-2))' : isToday ? 'var(--surface-2)' : 'transparent',
                  color: isSel ? '#fff' : school ? 'var(--ink-soft)' : 'var(--muted)',
                  outline: isToday && !isSel ? '2px solid var(--navy)' : 'none',
                  opacity: school ? 1 : 0.35 }}>
                <span style={{ fontSize: 11 }}>{TH_DAYS[i]}</span>
                <span className="display" style={{ fontSize: 18 }}>{d.getDate()}</span>
                {hasData && !isSel && <span style={{ width: 5, height: 5, borderRadius: '50%', background: school ? 'var(--st-present)' : 'transparent' }} />}
              </button>
            );
          })}

          {/* next week */}
          <button onClick={nextWeek} className="center glass-2"
            style={{ width: 38, height: 38, borderRadius: 10, cursor: 'pointer', border: 'none' }}>
            <Icon name="arrowRight" size={18} color="var(--ink-soft)" />
          </button>

          {/* month label + calendar toggle */}
          <div className="row" style={{ gap: 7, marginLeft: 4, alignItems: 'center' }}>
            <button ref={calBtnRef} onClick={() => { if (!showCal && calBtnRef.current) { const r = calBtnRef.current.getBoundingClientRect(); setCalDropPos({ top: r.bottom + 6, left: r.left }); } setShowCal(c => !c); }} className="row glass-2"
              style={{ gap: 7, padding: '6px 12px', borderRadius: 10, cursor: 'pointer', border: 'none', color: 'var(--ink-soft)', fontSize: 13 }}>
              <Icon name="calendar" size={16} color="var(--muted)" />
              {TH_MONTHS_FULL[selDateObj.getMonth()]} {selDateObj.getFullYear()}
              <Icon name="chevD" size={14} color="var(--muted)" />
            </button>

            {/* mini calendar dropdown — rendered via portal to escape scroll clipping */}
            {showCal && ReactDOM.createPortal(
              <div className="pop" style={{ position: 'fixed', top: calDropPos.top, left: calDropPos.left, zIndex: 9999, borderRadius: 'var(--r-lg)', padding: 16, width: 280, boxShadow: '0 20px 60px -12px rgba(0,0,0,.55)', background: 'oklch(0.16 0.025 255)', border: '1px solid oklch(0.28 0.03 255)' }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <button onClick={() => setCalMonth(({y,m}) => m === 0 ? {y:y-1,m:11} : {y,m:m-1})}
                    style={{ border:'none',background:'transparent',cursor:'pointer',color:'#aab',fontSize:18,padding:'0 6px' }}>‹</button>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>
                    {TH_MONTHS_FULL[calMonth.m]} {calMonth.y}
                  </span>
                  <button onClick={() => setCalMonth(({y,m}) => m === 11 ? {y:y+1,m:0} : {y,m:m+1})}
                    style={{ border:'none',background:'transparent',cursor:'pointer',color:'#aab',fontSize:18,padding:'0 6px' }}>›</button>
                </div>
                {/* day-of-week header */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:4 }}>
                  {['จ','อ','พ','พฤ','ศ','ส','อา'].map(d => (
                    <div key={d} style={{ textAlign:'center', fontSize:11, color:'#778', fontWeight:600 }}>{d}</div>
                  ))}
                </div>
                {/* cells */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
                  {calDays(calMonth.y, calMonth.m).map((d, i) => {
                    if (!d) return <div key={i} />;
                    const k = dateKey(d);
                    const school = isSchoolDay(d);
                    const isSel = k === selDate;
                    const isT = k === dateKey(TODAY);
                    const hasDot = !!window.GC.ATTENDANCE_HISTORY[k];
                    return (
                      <button key={i} onClick={() => school && jumpToDate(k)}
                        style={{ border:'none', borderRadius:8, padding:'5px 2px', cursor: school ? 'pointer':'default',
                          background: isSel ? 'var(--navy)' : isT ? 'oklch(0.26 0.04 255)' : 'transparent',
                          color: isSel ? '#fff' : school ? '#dde' : '#556',
                          opacity: school ? 1 : 0.4,
                          outline: isT && !isSel ? '1.5px solid var(--navy)' : 'none',
                          fontSize: 13, textAlign:'center', position:'relative' }}>
                        {d.getDate()}
                        {hasDot && !isSel && <span style={{ position:'absolute', bottom:2, left:'50%', transform:'translateX(-50%)', width:4, height:4, borderRadius:'50%', background:'var(--st-present)' }} />}
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop:10, fontSize:11.5, color:'#667', textAlign:'center' }}>
                  ปีการศึกษา 2568 · เทอม 1 (พ.ค.–ต.ค. 68) · เทอม 2 (พ.ย. 68–มี.ค. 69)
                </div>
              </div>
            , document.body)}
          </div>
        </div>

        {/* bulk actions */}
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, color: 'var(--muted)', alignSelf: 'center' }}>เช็กรวดเร็ว:</span>
          <button onClick={() => bulkAll('present')} className="btn"
            style={{ padding: '8px 13px', fontSize: 13, background: 'color-mix(in oklch,var(--st-present) 16%,transparent)', color: 'var(--st-present)' }}>
            <Icon name="check" size={16} color="var(--st-present)" /> มาทั้งห้อง
          </button>
          <button onClick={save} className="btn"
            style={{ padding: '8px 14px', fontSize: 13,
              background: dirty ? 'linear-gradient(120deg,var(--navy),var(--navy-2))' : 'var(--surface-2)',
              color: dirty ? '#fff' : 'var(--muted)' }}>
            <Icon name="download" size={16} color={dirty ? '#fff' : 'var(--muted)'} />
            {dirty ? 'บันทึก *' : 'บันทึกแล้ว'}
          </button>
          <button onClick={() => setShowBarcode(b => !b)} className="btn"
            style={{ padding: '8px 14px', fontSize: 13,
              background: showBarcode ? 'linear-gradient(120deg,oklch(0.52 0.19 265),oklch(0.48 0.2 280))' : 'var(--surface-2)',
              color: showBarcode ? '#fff' : 'var(--ink-soft)' }}>
            <Icon name="report" size={16} color={showBarcode ? '#fff' : 'var(--ink-soft)'} />
            {showBarcode ? 'ซ่อนบาร์โค้ด' : 'บันทึกคะแนน 🔲'}
          </button>
        </div>
      </div>

      {/* selected date label */}
      <div className="row" style={{ gap: 8, alignItems: 'center' }}>
        <div className="display" style={{ fontSize: 16, color: 'var(--ink)' }}>
          {selDateObj.toLocaleDateString('th-TH', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </div>
        {isSchoolDay(selDateObj)
          ? <span className="pill" style={{ background:'color-mix(in oklch,var(--st-present) 16%,transparent)', color:'var(--st-present)', fontSize:11 }}>วันเรียน</span>
          : <span className="pill" style={{ background:'var(--surface-2)', color:'var(--muted)', fontSize:11 }}>หยุด</span>}
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
        <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>
          <div style={{ width: 38 }}>เลข</div>
          <div style={{ flex: 1 }}>นักเรียน</div>
          <div style={{ width: 200, textAlign: 'center' }}>สถานะ</div>
          <div className="center" style={{ width: 70, flexDirection: 'column', gap: 4 }}>
            <Icon name="drop" size={16} color="var(--st-leave)" />
            <span onClick={() => bulkWelfare('milk')} style={{ cursor: 'pointer' }}>นม</span>
          </div>
          <div className="center" style={{ width: 70, flexDirection: 'column', gap: 4 }}>
            <Icon name="spark" size={16} color="var(--st-present)" />
            <span onClick={() => bulkWelfare('brush')} style={{ cursor: 'pointer' }}>แปรงฟัน</span>
          </div>
          <div className="center" style={{ width: 70, flexDirection: 'column', gap: 4 }}>
            <Icon name="gift" size={16} color="var(--st-late)" />
            <span onClick={() => bulkWelfare('lunch')} style={{ cursor: 'pointer' }}>กลางวัน</span>
          </div>
          <div className="center" style={{ width: 56, flexDirection: 'column', gap: 4 }}>
            <Icon name="bolt" size={16} color="var(--gold)" />
            <span style={{ color: 'var(--gold)', fontSize: 10 }}>คะแนน</span>
          </div>
        </div>
        <div>
          {rows.map((r, i) => {
            const st = student(r.id);
            if (!st) return null;
            const stat = STATUSES[r.status] || STATUSES['present'];
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
                {/* status picker */}
                <div className="center" style={{ width: 200, position: 'relative' }}>
                  <button onClick={() => setPicker(picker === r.id ? null : r.id)} className="pill"
                    style={{ cursor: 'pointer', border: 'none',
                      background: 'color-mix(in oklch,' + stat.color + ' 16%,transparent)',
                      color: stat.color, padding: '6px 14px', fontSize: 13 }}>
                    <span className="dot" style={{ background: stat.color }} /> {stat.th}
                    <Icon name="chevD" size={14} color={stat.color} />
                  </button>
                  {picker === r.id && (
                    <div className="glass pop"
                      style={{ position: 'absolute', top: '100%', marginTop: 6, zIndex: 30, borderRadius: 'var(--r-md)', padding: 6, width: 170, boxShadow: '0 20px 50px -16px rgba(0,0,0,.3)' }}>
                      {order.map(k => (
                        <button key={k} onClick={() => setStatus(r.id, k)} className="row"
                          style={{ width: '100%', gap: 9, padding: '9px 11px', borderRadius: 9, border: 'none', cursor: 'pointer',
                            background: r.status === k ? 'var(--surface-2)' : 'transparent',
                            color: 'var(--ink)', fontSize: 13.5, fontFamily: 'var(--font-body)' }}>
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
                    <button onClick={() => toggle(r.id, key)} className="center"
                      style={{ width: 30, height: 30, borderRadius: 9, cursor: 'pointer', border: 'none',
                        background: r[key] ? 'var(--st-present)' : 'var(--surface-2)',
                        color: r[key] ? '#fff' : 'var(--muted)',
                        transition: 'all .2s', transform: r[key] ? 'scale(1)' : 'scale(.95)' }}>
                      <Icon name={r[key] ? 'check' : 'minus'} size={16} color={r[key] ? '#fff' : 'var(--muted)'} sw={2.4} />
                    </button>
                  </div>
                ))}
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
        แตะที่สถานะเพื่อแก้ไข · แตะหัวคอลัมน์สุขภาวะเพื่อติ๊กทั้งห้อง · กดปุ่ม 📅 เพื่อเลือกวันในปฏิทิน
      </p>
    </div>
  );
}
window.Attendance = Attendance;
