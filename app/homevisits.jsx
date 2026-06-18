/* ============================================================
   HOME VISITS — visit log + add-visit form
   ============================================================ */
function AddVisitModal({ onClose }) {
  const STUDENTS = useStudents();
  const [form, setForm] = React.useState({ studentId: STUDENTS[0]?.id || '', date: '2026-06-01', purpose: '', notes: '', status: 'นัดหมายแล้ว' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  function submit(e) {
    e.preventDefault();
    if (!form.purpose.trim()) return;
    window.GC.addHomeVisit(form);
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 16, width: 400, maxWidth: '90vw' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>บันทึกการเยี่ยมบ้านนักเรียน</div>
        <form onSubmit={submit} className="col" style={{ gap: 13 }}>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>นักเรียน</label>
            <select {...inp} value={form.studentId} onChange={e => set('studentId', e.target.value)}>
              {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.nick} · {s.name}</option>)}
            </select>
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>วันที่เยี่ยม</label>
            <input {...inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>วัตถุประสงค์ *</label>
            <input {...inp} placeholder="เช่น ติดตามการขาดเรียนบ่อย" value={form.purpose} onChange={e => set('purpose', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>บันทึกเพิ่มเติม</label>
            <textarea {...inp} rows={3} style={{ ...inp.style, resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>สถานะ</label>
            <select {...inp} value={form.status} onChange={e => set('status', e.target.value)}>
              {['นัดหมายแล้ว', 'เสร็จสิ้น', 'ติดตามต่อ'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="check" size={15} /> บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HomeVisits({ openStudent }) {
  const STUDENTS = useStudents();
  const [visits, setVisits] = React.useState(() => window.GC.getHomeVisits());
  const [showAdd, setShowAdd] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => setVisits(window.GC.getHomeVisits());
    window.addEventListener('gc:homevisits-changed', refresh);
    return () => window.removeEventListener('gc:homevisits-changed', refresh);
  }, []);

  const byId = {}; STUDENTS.forEach(s => byId[s.id] = s);
  const statusColor = s => s === 'เสร็จสิ้น' ? 'var(--emerald)' : s === 'ติดตามต่อ' ? 'var(--orange)' : 'var(--royal)';

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>บันทึกการเยี่ยมบ้านนักเรียนทั้งหมด {visits.length} รายการ</div>
        <button onClick={() => setShowAdd(true)} className="btn" style={{ fontSize: 13.5, background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
          <Icon name="plus" size={16} /> บันทึกการเยี่ยมบ้าน
        </button>
      </div>

      <div className="col" style={{ gap: 14 }}>
        {visits.map(v => {
          const st = byId[v.studentId];
          if (!st) return null;
          return (
            <div key={v.id} className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '18px 22px', gap: 16, alignItems: 'flex-start' }}>
              <HeroAvatar student={st} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row" style={{ justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div onClick={() => openStudent && openStudent(st.id)} style={{ cursor: 'pointer', fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>{st.nick} · {st.name}</div>
                  <span className="pill" style={{ background: 'color-mix(in oklch,' + statusColor(v.status) + ' 16%,transparent)', color: statusColor(v.status) }}>{v.status}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 4 }}>{v.purpose}</div>
                {v.notes && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>{v.notes}</div>}
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}><Icon name="door" size={12} /> {v.date}</div>
              </div>
            </div>
          );
        })}
        {visits.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', padding: 20, textAlign: 'center' }}>ยังไม่มีบันทึกการเยี่ยมบ้าน</div>}
      </div>

      {showAdd && <AddVisitModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

Object.assign(window, { HomeVisits });
