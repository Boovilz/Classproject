/* ============================================================
   TEACHER — Homework Submission Tracking
   Teacher creates homework assignments (ชื่องาน / รายวิชา / คะแนน / วันที่
   กำหนด), then records each student's submitted/not-submitted status
   for that assignment with a single click.
   ============================================================ */
function AddHomeworkAssignmentModal({ onClose }) {
  const [form, setForm] = React.useState({
    title: '', subject: window.GC.SUBJECTS[0].th, score: 10, date: window.GC.dateKey(new Date(2026, 4, 29)),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    window.GC.addHomeworkAssignment({ ...form, score: Number(form.score) || 0 });
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 16, width: 380, maxWidth: '90vw' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>เพิ่มการบ้านใหม่</div>
        <form onSubmit={submit} className="col" style={{ gap: 13 }}>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่องาน *</label>
            <input {...inp} placeholder="เช่น แบบฝึกหัดเศษส่วน หน้า 24-26" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>รายวิชา</label>
            <select {...inp} value={form.subject} onChange={e => set('subject', e.target.value)}>
              {window.GC.SUBJECTS.map(s => <option key={s.key} value={s.th}>{s.th}</option>)}
            </select>
          </div>
          <div className="row" style={{ gap: 13 }}>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>คะแนน</label>
              <input {...inp} type="number" min="0" value={form.score} onChange={e => set('score', e.target.value)} />
            </div>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>วันที่กำหนด</label>
              <input {...inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--navy),var(--navy-2))', color: '#fff' }}>
              <Icon name="plus" size={15} /> เพิ่มการบ้าน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HomeworkTracking({ openStudent }) {
  const STUDENTS = useStudents();
  const [assignments, setAssignments] = React.useState(() => window.GC.getHomeworkAssignments());
  const [selId, setSelId] = React.useState(() => window.GC.getHomeworkAssignments()[0]?.id || null);
  const [rows, setRows] = React.useState(() => selId ? window.GC.getHomeworkSubmissions(selId) : []);
  const [dirty, setDirty] = React.useState(false);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showScan, setShowScan] = React.useState(false);
  const [scanToast, setScanToast] = React.useState(null);

  React.useEffect(() => {
    const refresh = () => {
      const list = window.GC.getHomeworkAssignments();
      setAssignments(list);
      setSelId(sel => list.find(h => h.id === sel) ? sel : (list[0]?.id || null));
    };
    window.addEventListener('gc:hwassign-changed', refresh);
    return () => window.removeEventListener('gc:hwassign-changed', refresh);
  }, []);

  React.useEffect(() => {
    setRows(selId ? window.GC.getHomeworkSubmissions(selId) : []);
    setDirty(false);
  }, [selId]);

  React.useEffect(() => {
    setRows(prev => {
      const prevMap = Object.fromEntries(prev.map(r => [r.id, r]));
      return STUDENTS.map(s => prevMap[s.id] || { id: s.id, submitted: false });
    });
  }, [STUDENTS]);

  const sorted = [...assignments].sort((a, b) => b.date.localeCompare(a.date));
  const selected = assignments.find(h => h.id === selId);
  const student = id => STUDENTS.find(s => s.id === id);

  const toggle = (id) => {
    setRows(r => r.map(x => x.id === id ? { ...x, submitted: !x.submitted } : x));
    setDirty(true);
  };
  const tickAll = () => {
    setRows(r => r.map(x => ({ ...x, submitted: true })));
    setDirty(true);
  };
  const save = () => { window.GC.saveHomeworkSubmissions(selId, rows); setDirty(false); };

  // scanning a student's barcode (เลขประจำตัวนักเรียน) marks them as submitted
  // for the currently selected assignment and saves immediately
  const scanSubmit = (st) => {
    setRows(r => {
      const next = r.map(x => x.id === st.id ? { ...x, submitted: true } : x);
      window.GC.saveHomeworkSubmissions(selId, next);
      return next;
    });
    setDirty(false);
    setScanToast(`ส่งแล้ว ✓ ${st.nick}`);
    setTimeout(() => setScanToast(null), 2000);
  };

  const submittedCount = rows.filter(r => r.submitted).length;
  const pct = rows.length ? Math.round((submittedCount / rows.length) * 100) : 0;

  return (
    <div className="col" style={{ gap: 18 }}>
      {scanToast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: 'linear-gradient(120deg,var(--st-present),oklch(0.62 0.16 150))', color: '#fff',
          padding: '10px 22px', borderRadius: 99, fontWeight: 700, fontSize: 14,
          boxShadow: '0 8px 32px -8px var(--st-present)', animation: 'rise .2s ease-out' }}>
          ✓ {scanToast}
        </div>
      )}
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div className="display" style={{ fontSize: 20, color: 'var(--ink)' }}>การบ้าน</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>บันทึกชื่องาน รายวิชา คะแนน และติดตามว่าใครส่งแล้วบ้าง</div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn" style={{ fontSize: 13.5, background: 'linear-gradient(120deg,var(--navy),var(--navy-2))', color: '#fff' }}>
          <Icon name="plus" size={16} /> เพิ่มการบ้าน
        </button>
      </div>

      {/* assignment cards — pick one to manage submissions below */}
      <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
        {sorted.map(h => {
          const subRows = window.GC.getHomeworkSubmissions(h.id);
          const cnt = subRows.filter(r => r.submitted).length;
          const isSel = h.id === selId;
          return (
            <div key={h.id} onClick={() => setSelId(h.id)} className="glass" style={{
              borderRadius: 'var(--r-lg)', padding: '14px 18px', width: 230, cursor: 'pointer',
              border: isSel ? '1.5px solid var(--navy)' : '1.5px solid transparent',
              boxShadow: isSel ? '0 0 0 3px color-mix(in oklch,var(--navy) 14%,transparent)' : 'none' }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 6 }}>
                <span className="pill" style={{ fontSize: 11, background: 'color-mix(in oklch,var(--accent) 16%,transparent)', color: 'var(--accent)' }}>{h.subject}</span>
                <span className="pill" style={{ fontSize: 11, background: 'color-mix(in oklch,var(--orange) 16%,transparent)', color: 'var(--orange)' }}>{h.score} คะแนน</span>
              </div>
              <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{h.title}</div>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{h.date}</span>
                <span style={{ fontSize: 11.5, color: 'var(--st-present)', fontWeight: 600 }}>ส่งแล้ว {cnt}/{subRows.length}</span>
              </div>
            </div>
          );
        })}
        {!sorted.length && (
          <div className="glass center" style={{ borderRadius: 'var(--r-lg)', padding: 30, color: 'var(--muted)', fontSize: 13, width: '100%' }}>
            ยังไม่มีการบ้าน — กด "เพิ่มการบ้าน" เพื่อเริ่มต้น
          </div>
        )}
      </div>

      {selected && (
        <React.Fragment>
          {/* selected assignment detail + bulk actions */}
          <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: 18, gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{selected.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{selected.subject} · {selected.score} คะแนน · {selected.date}</div>
            </div>
            <div className="row glass-2" style={{ gap: 7, padding: '6px 12px', borderRadius: 99 }}>
              <span className="dot" style={{ background: 'var(--st-present)' }} />
              <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>ส่งแล้ว</span>
              <span className="display" style={{ fontSize: 14, color: 'var(--ink)' }}>{submittedCount}/{rows.length}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>({pct}%)</span>
            </div>
            <button onClick={tickAll} className="btn"
              style={{ padding: '7px 12px', fontSize: 12.5, background: 'color-mix(in oklch,var(--st-present) 16%,transparent)', color: 'var(--st-present)' }}>
              <Icon name="check" size={15} color="var(--st-present)" /> ส่งครบทั้งห้อง
            </button>
            <button onClick={save} className="btn"
              style={{ padding: '7px 14px', fontSize: 12.5,
                background: dirty ? 'linear-gradient(120deg,var(--navy),var(--navy-2))' : 'var(--surface-2)',
                color: dirty ? '#fff' : 'var(--muted)' }}>
              <Icon name="download" size={15} color={dirty ? '#fff' : 'var(--muted)'} />
              {dirty ? 'บันทึก *' : 'บันทึกแล้ว'}
            </button>
            <button onClick={() => setShowScan(b => !b)} className="btn"
              style={{ padding: '7px 14px', fontSize: 12.5,
                background: showScan ? 'linear-gradient(120deg,var(--st-present),oklch(0.62 0.16 150))' : 'var(--surface-2)',
                color: showScan ? '#fff' : 'var(--ink-soft)' }}>
              <Icon name="report" size={15} color={showScan ? '#fff' : 'var(--ink-soft)'} />
              {showScan ? 'ซ่อนสแกน' : 'สแกนส่งงาน 🔲'}
            </button>
          </div>

          {/* scan-to-submit panel — scanning a student's เลขประจำตัวนักเรียน
              marks the homework as submitted for this assignment immediately */}
          {showScan && (
            <div className="col" style={{ gap: 10, animation: 'rise .2s ease-out' }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', paddingLeft: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
                  <Icon name="report" size={16} /> สแกนบาร์โค้ดเพื่อบันทึกการส่งงาน
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>ยิงรหัสนักเรียน → บันทึก "ส่งแล้ว" ทันที</span>
              </div>
              <BarcodeRecordBar autoFocus={true}
                hint="สแกนหรือพิมพ์เลขประจำตัวนักเรียน → บันทึก &quot;ส่งแล้ว&quot; ทันที"
                onScan={scanSubmit} />
            </div>
          )}

          {/* roster — one click per student toggles submitted / not submitted */}
          <div className="glass" style={{ borderRadius: 'var(--r-lg)', overflow: 'visible' }}>
            <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>
              <div style={{ width: 38 }}>เลข</div>
              <div style={{ flex: 1 }}>นักเรียน ({rows.length} คน)</div>
              <div style={{ width: 110, textAlign: 'center' }}>สถานะการส่ง</div>
            </div>
            <div>
              {rows.map((r, i) => {
                const s = student(r.id);
                if (!s) return null;
                return (
                  <div key={r.id} className="row" style={{ padding: '10px 20px',
                    borderBottom: i < rows.length - 1 ? '1px solid var(--line-soft)' : 'none',
                    background: i % 2 ? 'transparent' : 'var(--surface-2)' }}>
                    <div className="tech" style={{ width: 38, color: 'var(--muted)', fontSize: 14 }}>{String(s.no).padStart(2, '0')}</div>
                    <div className="row" style={{ flex: 1, gap: 11, cursor: 'pointer' }} onClick={() => openStudent && openStudent(s.id)}>
                      <HeroAvatar student={s} size={38} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{s.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>"{s.nick}" {s.code ? '· #' + s.code : ''}</div>
                      </div>
                    </div>
                    <div className="center" style={{ width: 110 }}>
                      <button onClick={() => toggle(r.id)} className="btn" style={{
                        padding: '6px 14px', fontSize: 12.5, borderRadius: 99, border: 'none', cursor: 'pointer',
                        background: r.submitted ? 'color-mix(in oklch,var(--st-present) 18%,transparent)' : 'var(--surface-2)',
                        color: r.submitted ? 'var(--st-present)' : 'var(--muted)' }}>
                        <Icon name={r.submitted ? 'check' : 'minus'} size={13} color={r.submitted ? 'var(--st-present)' : 'var(--muted)'} sw={2.4} />
                        {r.submitted ? 'ส่งแล้ว' : 'ยังไม่ส่ง'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>แตะปุ่มสถานะเพื่อสลับว่าส่งแล้วหรือยังไม่ส่ง</p>
        </React.Fragment>
      )}

      {showAdd && <AddHomeworkAssignmentModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

Object.assign(window, { HomeworkTracking });
