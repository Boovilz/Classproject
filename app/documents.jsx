/* ============================================================
   DOCUMENTS — class document library
   ============================================================ */
const DOC_CATEGORIES = ['ทั้งหมด', 'รายชื่อ', 'แบบฟอร์ม', 'รายงาน', 'บันทึก', 'แผนการสอน'];

function AddDocumentModal({ onClose }) {
  const [form, setForm] = React.useState({ name: '', cat: 'รายงาน', size: '120 KB', icon: 'note' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    window.GC.addDocument({ ...form, date: '2026-05-29' });
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 16, width: 380, maxWidth: '90vw' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>เพิ่มเอกสารใหม่</div>
        <form onSubmit={submit} className="col" style={{ gap: 13 }}>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่อไฟล์ *</label>
            <input {...inp} placeholder="เช่น รายงานพัฒนาการนักเรียน.pdf" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>หมวดหมู่</label>
            <select {...inp} value={form.cat} onChange={e => set('cat', e.target.value)}>
              {DOC_CATEGORIES.filter(c => c !== 'ทั้งหมด').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ขนาดไฟล์</label>
            <input {...inp} placeholder="เช่น 240 KB" value={form.size} onChange={e => set('size', e.target.value)} />
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="plus" size={15} /> เพิ่มเอกสาร
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Documents() {
  const [docs, setDocs] = React.useState(() => window.GC.getDocuments());
  const [filter, setFilter] = React.useState('ทั้งหมด');
  const [showAdd, setShowAdd] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => setDocs(window.GC.getDocuments());
    window.addEventListener('gc:documents-changed', refresh);
    return () => window.removeEventListener('gc:documents-changed', refresh);
  }, []);

  const filtered = filter === 'ทั้งหมด' ? docs : docs.filter(d => d.cat === filter);

  function remove(id) {
    window.GC.deleteDocument(id);
  }

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
          {DOC_CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)} className="btn" style={{ padding: '7px 14px', fontSize: 12.5, boxShadow: 'none',
              background: filter === c ? 'linear-gradient(120deg,var(--royal),var(--royal-2))' : 'var(--surface-2)',
              color: filter === c ? '#fff' : 'var(--ink-soft)' }}>{c}</button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} className="btn" style={{ fontSize: 13.5, background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
          <Icon name="plus" size={16} /> เพิ่มเอกสาร
        </button>
      </div>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
        {filtered.map(d => (
          <div key={d.id} className="glass col" style={{ borderRadius: 'var(--r-lg)', padding: 16, gap: 10 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="center" style={{ width: 42, height: 42, borderRadius: 12, background: 'color-mix(in oklch,var(--royal) 16%,transparent)' }}>
                <Icon name={d.icon} size={20} color="var(--royal)" />
              </div>
              <button onClick={() => remove(d.id)} className="btn btn-ghost" style={{ padding: '5px 9px', fontSize: 12 }} title="ลบเอกสาร">×</button>
            </div>
            <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }} title={d.name}>{d.name}</div>
            <div className="row" style={{ justifyContent: 'space-between', fontSize: 11.5, color: 'var(--muted)' }}>
              <span className="pill" style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)' }}>{d.cat}</span>
              <span>{d.size}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{d.date}</div>
            <button className="btn btn-ghost" style={{ fontSize: 12.5, justifyContent: 'center' }}>
              <Icon name="download" size={14} /> ดาวน์โหลด
            </button>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', padding: 20 }}>ไม่มีเอกสารในหมวดนี้</div>}
      </div>

      {showAdd && <AddDocumentModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

Object.assign(window, { Documents });
