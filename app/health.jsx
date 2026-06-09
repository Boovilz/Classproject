/* ============================================================
   TEACHER — Health monitoring + Students grid
   ============================================================ */
function EditStudentModal({ student, onClose }) {
  const [form, setForm] = React.useState({
    code: student.code || '',
    name: student.name || '',
    nick: student.nick || '',
    gender: student.gender || 'm',
    h: String(student.health?.h || 130),
    w: String(student.health?.w || 28),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  function submit(e) {
    e.preventDefault();
    const h = +form.h; const w = +form.w;
    const bmi = +(w / Math.pow(h / 100, 2)).toFixed(1);
    const nutrition = bmi < 14 ? 'ผอม' : bmi > 18.5 ? 'ท้วม' : 'สมส่วน';
    window.GC.updateStudent(student.id, {
      code: form.code, name: form.name, nick: form.nick, gender: form.gender,
      health: { ...student.health, h, w, bmi, nutrition },
    });
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 18, width: 400, maxWidth: '90vw' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            <Icon name="tool" size={17} /> แก้ไขข้อมูลนักเรียน
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        <form onSubmit={submit} className="col" style={{ gap: 12 }}>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>รหัสนักเรียน</label>
            <input {...inp} placeholder="เช่น 46201" value={form.code} onChange={e => set('code', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่อ-นามสกุล</label>
            <input {...inp} placeholder="เช่น ด.ช. สมชาย ใจดี" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่อเล่น</label>
            <input {...inp} placeholder="เช่น เจ" value={form.nick} onChange={e => set('nick', e.target.value)} />
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>เพศ</label>
              <select {...inp} value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="m">ชาย</option>
                <option value="f">หญิง</option>
              </select>
            </div>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ส่วนสูง (ซม.)</label>
              <input {...inp} type="number" min="80" max="200" value={form.h} onChange={e => set('h', e.target.value)} />
            </div>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>น้ำหนัก (กก.)</label>
              <input {...inp} type="number" min="10" max="100" step="0.1" value={form.w} onChange={e => set('w', e.target.value)} />
            </div>
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--navy),var(--navy-2))', color: '#fff' }}>
              <Icon name="check" size={15} /> บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Health() {
  const students = window.GC.getStudents();
  const [sel, setSel] = React.useState(students[0]?.id);
  const st = students.find(s => s.id === sel) || students[0];
  const nutColor = n => n === 'สมส่วน' ? 'var(--st-present)' : n === 'ผอม' ? 'var(--st-late)' : 'var(--st-sick)';
  const dist = ['ผอม', 'สมส่วน', 'ท้วม'].map(n => [n, students.filter(s => s.health.nutrition === n).length]);

  return (
    <div className="col" style={{ gap: 18 }}>
      {/* class nutrition summary */}
      <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '18px 24px', gap: 28, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>ภาวะโภชนาการของห้อง</div>
          <div className="row" style={{ gap: 18, marginTop: 10 }}>
            {dist.map(([n, c]) => (
              <div key={n} className="row" style={{ gap: 9 }}>
                <div className="center display" style={{ width: 44, height: 44, borderRadius: 12, fontSize: 18,
                  background: 'color-mix(in oklch,' + nutColor(n) + ' 16%,transparent)', color: nutColor(n) }}>{c}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{n}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div className="row" style={{ height: 14, borderRadius: 99, overflow: 'hidden', marginTop: 26 }}>
            {dist.map(([n, c]) => <div key={n} style={{ width: (c / students.length * 100) + '%', background: nutColor(n) }} />)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>อ้างอิงเกณฑ์กรมอนามัย · อัปเดตเดือน ธ.ค. 2568</div>
        </div>
        <button className="btn btn-ghost" style={{ alignSelf: 'center' }}><Icon name="download" size={17} /> ออกรายงานสุขภาพ</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18 }}>
        {/* student list */}
        <div className="glass scroll" style={{ borderRadius: 'var(--r-lg)', padding: 12, maxHeight: 560 }}>
          <div className="col" style={{ gap: 4 }}>
            {students.map(s => {
              const on = s.id === sel;
              return (
                <button key={s.id} onClick={() => setSel(s.id)} className="row" style={{ gap: 11, padding: 9, borderRadius: 'var(--r-md)', cursor: 'pointer', border: 'none', textAlign: 'left',
                  background: on ? 'var(--surface-2)' : 'transparent', outline: on ? '1.5px solid var(--navy)' : 'none' }}>
                  <HeroAvatar student={s} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{s.nick}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>BMI {s.health.bmi}</div>
                  </div>
                  <span className="pill" style={{ fontSize: 11, background: 'color-mix(in oklch,' + nutColor(s.health.nutrition) + ' 16%,transparent)', color: nutColor(s.health.nutrition) }}>{s.health.nutrition}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* detail */}
        <div className="col" style={{ gap: 16 }}>
          <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '20px 24px', gap: 18, alignItems: 'center' }}>
            <HeroAvatar student={st} size={64} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 19, color: 'var(--ink)' }}>{st.name}</h3>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>เลขที่ {st.no} · ป.4/2</div>
            </div>
            <div className="row" style={{ gap: 12 }}>
              {[['น้ำหนัก', st.health.w + ' กก.', 'scale'], ['ส่วนสูง', st.health.h + ' ซม.', 'ruler'], ['BMI', st.health.bmi, 'heart']].map(([l, v, ic]) => (
                <div key={l} className="center col glass-2" style={{ width: 96, padding: '12px 6px', borderRadius: 'var(--r-md)', gap: 4 }}>
                  <Icon name={ic} size={18} color="var(--navy)" />
                  <div className="display" style={{ fontSize: 18, color: 'var(--ink)' }}>{v}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{l}</div>
                </div>
              ))}
              <div className="center col" style={{ width: 96, padding: '12px 6px', borderRadius: 'var(--r-md)', gap: 4,
                background: 'color-mix(in oklch,' + nutColor(st.health.nutrition) + ' 16%,transparent)' }}>
                <Icon name="shield" size={18} color={nutColor(st.health.nutrition)} />
                <div className="display" style={{ fontSize: 16, color: nutColor(st.health.nutrition) }}>{st.health.nutrition}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>โภชนาการ</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '18px 22px' }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <h4 style={{ fontSize: 15, color: 'var(--ink)' }}>กราฟน้ำหนัก (กก.)</h4>
                <Icon name="scale" size={18} color="var(--navy)" />
              </div>
              <LineChart data={st.health.weightHist} color="var(--navy)" h={170} />
            </div>
            <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '18px 22px' }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <h4 style={{ fontSize: 15, color: 'var(--ink)' }}>กราฟส่วนสูง (ซม.)</h4>
                <Icon name="ruler" size={18} color="var(--accent)" />
              </div>
              <LineChart data={st.health.heightHist} color="var(--accent)" h={170} />
            </div>
          </div>

          <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '14px 20px', gap: 12, justifyContent: 'space-between' }}>
            <div className="row" style={{ gap: 10 }}>
              <div className="center" style={{ width: 36, height: 36, borderRadius: 10, background: 'color-mix(in oklch,var(--st-present) 16%,transparent)' }}>
                <Icon name="check" size={18} color="var(--st-present)" />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>การเจริญเติบโตปกติ</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>บันทึกล่าสุด ธ.ค. 2568 · ครั้งถัดไป ก.พ. 2569</div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ padding: '9px 16px', fontSize: 13.5 }}><Icon name="plus" size={16} color="#fff" /> บันทึกใหม่</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddStudentModal({ onClose }) {
  const [form, setForm] = React.useState({ code: '', name: '', nick: '', gender: 'm', h: '130', w: '28' });
  const [err, setErr] = React.useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.nick.trim()) { setErr('กรุณากรอกชื่อและชื่อเล่น'); return; }
    window.GC.addStudent({ ...form, h: +form.h, w: +form.w });
    onClose();
  }

  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 18, width: 360, maxWidth: '90vw' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            <Icon name="plus" size={17} /> เพิ่มนักเรียนใหม่
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={submit} className="col" style={{ gap: 12 }}>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>รหัสนักเรียน</label>
            <input {...inp} placeholder="เช่น 46217" value={form.code} onChange={e => set('code', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่อ-นามสกุล *</label>
            <input {...inp} placeholder="เช่น ด.ช. สมชาย ใจดี" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ชื่อเล่น *</label>
            <input {...inp} placeholder="เช่น เจ" value={form.nick} onChange={e => set('nick', e.target.value)} />
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>เพศ</label>
              <select {...inp} value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="m">ชาย</option>
                <option value="f">หญิง</option>
              </select>
            </div>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>ส่วนสูง (ซม.)</label>
              <input {...inp} type="number" min="80" max="200" value={form.h} onChange={e => set('h', e.target.value)} />
            </div>
            <div className="col" style={{ gap: 5, flex: 1 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>น้ำหนัก (กก.)</label>
              <input {...inp} type="number" min="10" max="100" step="0.1" value={form.w} onChange={e => set('w', e.target.value)} />
            </div>
          </div>
          {err && <div style={{ fontSize: 12.5, color: 'var(--st-sick)' }}>{err}</div>}
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--navy),var(--navy-2))', color: '#fff' }}>
              <Icon name="plus" size={15} /> เพิ่มนักเรียน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StudentsGrid({ openStudent }) {
  const { STATUSES, getStudents, deleteStudent } = window.GC;
  const [students, setStudents] = React.useState(getStudents);
  const [filter, setFilter] = React.useState('all');
  const [showAdd, setShowAdd] = React.useState(false);
  const [editStudent, setEditStudent] = React.useState(null);
  const [confirmDel, setConfirmDel] = React.useState(null);

  React.useEffect(() => {
    const refresh = () => setStudents(getStudents());
    window.addEventListener('gc:students-changed', refresh);
    return () => window.removeEventListener('gc:students-changed', refresh);
  }, []);

  const filtered = filter === 'all' ? students
    : filter === 'present' ? students.filter(s => s.status === 'present' || s.status === 'late')
    : students.filter(s => s.status === 'absent' || s.status === 'sick');

  function handleDelete(e, id) {
    e.stopPropagation();
    setConfirmDel(id);
  }

  function confirmDelete() {
    deleteStudent(confirmDel);
    setConfirmDel(null);
  }

  const TABS = [['all','ทั้งหมด'],['present','มาเรียน'],['watch','ติดตาม']];

  return (
    <>
      <div className="col" style={{ gap: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div className="row" style={{ gap: 8 }}>
            {TABS.map(([k, th]) => (
              <button key={k} onClick={() => setFilter(k)} className="btn" style={{ padding: '8px 16px', fontSize: 13.5,
                background: filter === k ? 'linear-gradient(120deg,var(--navy),var(--navy-2))' : 'var(--surface-2)',
                color: filter === k ? '#fff' : 'var(--ink-soft)', boxShadow: 'none' }}>{th}</button>
            ))}
          </div>
          <button onClick={() => setShowAdd(true)} className="btn" style={{ fontSize: 13.5, background: 'linear-gradient(120deg,var(--navy),var(--navy-2))', color: '#fff' }}>
            <Icon name="plus" size={17} /> เพิ่มนักเรียน
          </button>
        </div>

        <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>ทั้งหมด {students.length} คน · แสดง {filtered.length} คน</div>

        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 14 }}>
          {filtered.map(s => {
            const stat = STATUSES[s.status] || STATUSES['present'];
            return (
              <div key={s.id} onClick={() => openStudent(s.id)} className="glass col"
                style={{ borderRadius: 'var(--r-lg)', padding: 16, gap: 12, cursor: 'pointer', alignItems: 'center', textAlign: 'center', position: 'relative', transition: 'transform .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <span className="pill" style={{ position: 'absolute', top: 10, right: 36, fontSize: 10.5,
                  background: 'color-mix(in oklch,' + stat.color + ' 16%,transparent)', color: stat.color }}>{stat.short}</span>
                <button onClick={e => { e.stopPropagation(); setEditStudent(s); }}
                  style={{ position: 'absolute', top: 8, right: 32, width: 22, height: 22, borderRadius: 6,
                    border: 'none', background: 'color-mix(in oklch,var(--navy) 18%,transparent)',
                    color: 'var(--navy)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="แก้ไขข้อมูล">✎</button>
                <button onClick={e => handleDelete(e, s.id)}
                  style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 6,
                    border: 'none', background: 'color-mix(in oklch,var(--st-absent) 18%,transparent)',
                    color: 'var(--st-absent)', fontSize: 14, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="ลบนักเรียน">×</button>
                <HeroAvatar student={s} size={68} />
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{s.nick}</div>
                  <div className="nowrap" style={{ fontSize: 11.5, color: 'var(--muted)', maxWidth: 150 }}>{s.name}</div>
                  {s.code && <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>#{s.code}</div>}
                </div>
                <div className="row" style={{ gap: 12, fontSize: 12, color: 'var(--ink-soft)' }}>
                  <span className="row" style={{ gap: 4 }}><Icon name="bolt" size={13} color="var(--navy)" /> Lv.{s.game.level}</span>
                  <span className="row" style={{ gap: 4 }}><Icon name="heart" size={13} color="var(--st-sick)" /> {s.health.bmi}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editStudent && <EditStudentModal student={editStudent} onClose={() => setEditStudent(null)} />}
      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} />}

      {confirmDel && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 16, width: 320, textAlign: 'center' }}>
            <div style={{ fontSize: 36 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>ยืนยันการลบนักเรียน?</div>
            <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>
              {students.find(s => s.id === confirmDel)?.name}<br/>การกระทำนี้ไม่สามารถกู้คืนได้
            </div>
            <div className="row" style={{ gap: 10, justifyContent: 'center', marginTop: 4 }}>
              <button onClick={() => setConfirmDel(null)} className="btn btn-ghost">ยกเลิก</button>
              <button onClick={confirmDelete} className="btn" style={{ background: 'var(--st-absent)', color: '#fff' }}>
                ลบออก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

Object.assign(window, { Health, StudentsGrid });
