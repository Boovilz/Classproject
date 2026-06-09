/* ============================================================
   TEACHER — Health monitoring + Students grid
   ============================================================ */
function Health() {
  const { STUDENTS } = window.GC;
  const [sel, setSel] = React.useState(STUDENTS[0].id);
  const st = STUDENTS.find(s => s.id === sel);
  const nutColor = n => n === 'สมส่วน' ? 'var(--st-present)' : n === 'ผอม' ? 'var(--st-late)' : 'var(--st-sick)';
  const dist = ['ผอม', 'สมส่วน', 'ท้วม'].map(n => [n, STUDENTS.filter(s => s.health.nutrition === n).length]);

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
            {dist.map(([n, c]) => <div key={n} style={{ width: (c / STUDENTS.length * 100) + '%', background: nutColor(n) }} />)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>อ้างอิงเกณฑ์กรมอนามัย · อัปเดตเดือน ธ.ค. 2568</div>
        </div>
        <button className="btn btn-ghost" style={{ alignSelf: 'center' }}><Icon name="download" size={17} /> ออกรายงานสุขภาพ</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18 }}>
        {/* student list */}
        <div className="glass scroll" style={{ borderRadius: 'var(--r-lg)', padding: 12, maxHeight: 560 }}>
          <div className="col" style={{ gap: 4 }}>
            {STUDENTS.map(s => {
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

function StudentsGrid({ openStudent }) {
  const { STUDENTS, STATUSES } = window.GC;
  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 8 }}>
          {['ทั้งหมด', 'มาเรียน', 'ติดตาม'].map((t, i) => (
            <button key={t} className="btn" style={{ padding: '8px 16px', fontSize: 13.5,
              background: i === 0 ? 'linear-gradient(120deg,var(--navy),var(--navy-2))' : 'var(--surface-2)',
              color: i === 0 ? '#fff' : 'var(--ink-soft)', boxShadow: 'none' }}>{t}</button>
          ))}
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 13.5 }}><Icon name="plus" size={17} /> เพิ่มนักเรียน</button>
      </div>
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 14 }}>
        {STUDENTS.map(s => {
          const stat = STATUSES[s.status];
          return (
            <div key={s.id} onClick={() => openStudent(s.id)} className="glass col" style={{ borderRadius: 'var(--r-lg)', padding: 16, gap: 12, cursor: 'pointer', alignItems: 'center', textAlign: 'center', position: 'relative', transition: 'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <span className="pill" style={{ position: 'absolute', top: 10, right: 10, fontSize: 10.5, background: 'color-mix(in oklch,' + stat.color + ' 16%,transparent)', color: stat.color }}>{stat.short}</span>
              <HeroAvatar student={s} size={68} />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{s.nick}</div>
                <div className="nowrap" style={{ fontSize: 11.5, color: 'var(--muted)', maxWidth: 150 }}>{s.name}</div>
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
  );
}

Object.assign(window, { Health, StudentsGrid });
