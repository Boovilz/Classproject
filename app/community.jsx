/* ============================================================
   PARENT COMMUNICATION — announcements + homework + progress
   ============================================================ */
function AddAnnouncementModal({ onClose }) {
  const [form, setForm] = React.useState({ title: '', body: '', audience: 'ทุกคน' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    window.GC.addAnnouncement(form);
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 16, width: 420, maxWidth: '90vw' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>ส่งประกาศใหม่ถึงผู้ปกครอง</div>
        <form onSubmit={submit} className="col" style={{ gap: 13 }}>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>หัวข้อ *</label>
            <input {...inp} placeholder="เช่น นัดประชุมผู้ปกครอง" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>รายละเอียด *</label>
            <textarea {...inp} rows={4} style={{ ...inp.style, resize: 'vertical' }} value={form.body} onChange={e => set('body', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ผู้รับ</label>
            <select {...inp} value={form.audience} onChange={e => set('audience', e.target.value)}>
              <option value="ทุกคน">ผู้ปกครองทุกคน</option>
              <option value="เฉพาะกลุ่มติดตาม">เฉพาะกลุ่มที่ต้องติดตาม</option>
            </select>
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="mail" size={15} /> ส่งประกาศ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddHomeworkModal({ onClose }) {
  const [form, setForm] = React.useState({ subject: 'คณิตศาสตร์', title: '', due: '2026-06-05' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    window.GC.addHomework(form);
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 16, width: 380, maxWidth: '90vw' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>แจ้งการบ้านใหม่</div>
        <form onSubmit={submit} className="col" style={{ gap: 13 }}>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>วิชา</label>
            <select {...inp} value={form.subject} onChange={e => set('subject', e.target.value)}>
              {window.GC.SUBJECTS.map(s => <option key={s.key} value={s.th}>{s.th}</option>)}
            </select>
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>รายละเอียดการบ้าน *</label>
            <input {...inp} placeholder="เช่น แบบฝึกหัดเศษส่วน หน้า 24-26" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>วันกำหนดส่ง</label>
            <input {...inp} type="date" value={form.due} onChange={e => set('due', e.target.value)} />
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="plus" size={15} /> แจ้งการบ้าน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ParentCommunication({ openStudent }) {
  const STUDENTS = useStudents();
  const [tab, setTab] = React.useState('announce'); // announce | homework | progress
  const [anns, setAnns] = React.useState(() => window.GC.getAnnouncements());
  const [hw, setHw] = React.useState(() => window.GC.getHomework());
  const [showAnnModal, setShowAnnModal] = React.useState(false);
  const [showHwModal, setShowHwModal] = React.useState(false);

  React.useEffect(() => {
    const ra = () => setAnns(window.GC.getAnnouncements());
    const rh = () => setHw(window.GC.getHomework());
    window.addEventListener('gc:announcements-changed', ra);
    window.addEventListener('gc:homework-changed', rh);
    return () => { window.removeEventListener('gc:announcements-changed', ra); window.removeEventListener('gc:homework-changed', rh); };
  }, []);

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      <div className="row" style={{ gap: 8 }}>
        {[['announce', 'ศูนย์ประกาศ'], ['homework', 'แจ้งการบ้าน'], ['progress', 'รายงานพัฒนาการ']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="btn" style={{ padding: '8px 16px', fontSize: 13.5,
            background: tab === k ? 'linear-gradient(120deg,var(--royal),var(--royal-2))' : 'var(--surface-2)',
            color: tab === k ? '#fff' : 'var(--ink-soft)', boxShadow: 'none' }}>{l}</button>
        ))}
      </div>

      {tab === 'announce' && (
        <div className="col" style={{ gap: 14 }}>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button onClick={() => setShowAnnModal(true)} className="btn" style={{ fontSize: 13.5, background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="mail" size={16} /> ส่งประกาศใหม่
            </button>
          </div>
          {anns.map(a => (
            <div key={a.id} className="glass col" style={{ borderRadius: 'var(--r-lg)', padding: '18px 22px', gap: 8 }}>
              <div className="row" style={{ justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{a.title}</div>
                <span className="pill" style={{ background: 'color-mix(in oklch,var(--royal) 16%,transparent)', color: 'var(--royal)' }}>{a.audience}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{a.body}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{a.date}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'homework' && (
        <div className="col" style={{ gap: 14 }}>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button onClick={() => setShowHwModal(true)} className="btn" style={{ fontSize: 13.5, background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="book" size={16} /> แจ้งการบ้านใหม่
            </button>
          </div>
          <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 20, gap: 6 }}>
            {hw.map(h => (
              <div key={h.id} className="row" style={{ gap: 12, padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', alignItems: 'center' }}>
                <div className="center" style={{ width: 36, height: 36, borderRadius: 10, background: 'color-mix(in oklch,var(--emerald) 16%,transparent)', flexShrink: 0 }}>
                  <Icon name="book" size={17} color="var(--emerald)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{h.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{h.subject}</div>
                </div>
                <span className="pill" style={{ background: 'color-mix(in oklch,var(--orange) 16%,transparent)', color: 'var(--orange)' }}>กำหนดส่ง {h.due}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'progress' && (
        <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 20, gap: 6 }}>
          {STUDENTS.map(st => {
            const subjectAvg = window.GC.getSubjectAverages();
            const territories = st.territories;
            const overall = Math.round(window.GC.SUBJECTS.reduce((a, s) => a + (territories[s.key] || 0), 0) / window.GC.SUBJECTS.length);
            const color = overall >= 80 ? 'var(--emerald)' : overall >= 60 ? 'var(--orange)' : 'var(--st-absent)';
            return (
              <div key={st.id} onClick={() => openStudent && openStudent(st.id)} className="row glass-2"
                style={{ gap: 12, padding: '10px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer', alignItems: 'center' }}>
                <HeroAvatar student={st} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{st.nick} · {st.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>เลขที่ {st.no}</div>
                </div>
                <div style={{ width: 130 }}><Bar value={overall} max={100} color={color} height={7} /></div>
                <span className="display" style={{ fontSize: 14, color, width: 40, textAlign: 'right' }}>{overall}%</span>
                <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}><Icon name="download" size={13} /> ส่งรายงาน</button>
              </div>
            );
          })}
        </div>
      )}

      {showAnnModal && <AddAnnouncementModal onClose={() => setShowAnnModal(false)} />}
      {showHwModal && <AddHomeworkModal onClose={() => setShowHwModal(false)} />}
    </div>
  );
}

Object.assign(window, { ParentCommunication });
