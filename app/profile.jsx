/* ============================================================
   STUDENT PROFILE — full avatar card detail (overlay)
   ============================================================ */
function StudentProfile({ studentId, onClose, openStudent }) {
  const STUDENTS = useStudents();
  const { SUBJECTS, STATUSES } = window.GC;
  const s = STUDENTS.find(x => x.id === studentId);

  const [attSummary, setAttSummary] = React.useState(null);
  const [streak, setStreak] = React.useState(0);

  React.useEffect(() => {
    if (!studentId) return;
    setAttSummary(window.GC.getStudentAttendanceSummary(studentId));
    setStreak(window.GC.getStudentStreak(studentId));
  }, [studentId]);

  if (!s) return null;
  const hue = (function (id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
    return h;
  })(s.id);
  const stat = STATUSES[s.status];

  const attItems = attSummary
    ? [['มา', (attSummary.present || 0) + (attSummary.late || 0), 'var(--st-present)'],
       ['สาย', attSummary.late || 0, 'var(--st-late)'],
       ['ป่วย', attSummary.sick || 0, 'var(--st-sick)'],
       ['ขาด', attSummary.absent || 0, 'var(--st-absent)']]
    : [['มา', '…', 'var(--st-present)'], ['สาย', '…', 'var(--st-late)'], ['ป่วย', '…', 'var(--st-sick)'], ['ขาด', '…', 'var(--st-absent)']];

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(8,6,18,0.72)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} className="glass pop scroll" style={{ width: 'min(960px,96vw)', maxHeight: '92vh', borderRadius: 'var(--r-xl)', overflow: 'auto', position: 'relative',
        background: 'rgba(24,18,46,0.92)' }}>
        {/* banner */}
        <div style={{ position: 'relative', padding: '28px 32px', overflow: 'hidden',
          background: `linear-gradient(120deg, oklch(0.5 0.2 ${hue}), oklch(0.4 0.18 ${(hue + 50) % 360}))` }}>
          <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', top: -60, right: 40, width: 200, height: 200, borderRadius: '50%', background: '#fff', opacity: .12, filter: 'blur(30px)' }} />
          <button onClick={onClose} className="center" style={{ position: 'absolute', top: 18, right: 18, width: 38, height: 38, borderRadius: 12, cursor: 'pointer', border: 'none', background: 'rgba(0,0,0,.25)', color: '#fff', zIndex: 5 }}>
            <Icon name="x" size={20} color="#fff" />
          </button>
          <div className="row" style={{ gap: 24, position: 'relative', alignItems: 'flex-end' }}>
            <div className="float"><HeroAvatar student={s} size={140} glow ring="rgba(255,255,255,.7)" /></div>
            <div style={{ flex: 1, paddingBottom: 6 }}>
              <div className="row" style={{ gap: 8 }}>
                <span className="pill tech" style={{ background: 'rgba(0,0,0,.25)', color: '#fff', letterSpacing: '.1em' }}>เลขที่ {s.no}</span>
                <span className="pill" style={{ background: 'color-mix(in oklch,' + stat.color + ' 30%,#000)', color: '#fff' }}>
                  <span className="dot" style={{ background: '#fff' }} /> {stat.th}
                </span>
              </div>
              <h2 style={{ fontSize: 34, color: '#fff', marginTop: 10, lineHeight: 1.05 }}>{s.name}</h2>
              <div className="row" style={{ gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                {streak > 0 && (
                  <span className="pill" style={{ background: 'color-mix(in oklch,oklch(0.7 0.2 30) 30%,rgba(0,0,0,.2))', color: 'oklch(0.92 0.18 45)', fontWeight: 700 }}>
                    🔥 Streak ×{streak}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* body */}
        <div style={{ padding: 28 }}>
          {/* stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 22 }}>
            <div className="center col glass-2" style={{ padding: '16px 8px', borderRadius: 'var(--r-md)', gap: 6,
              background: streak > 0 ? 'color-mix(in oklch,oklch(0.6 0.2 30) 14%,transparent)' : undefined,
              border: streak > 0 ? '1px solid oklch(0.6 0.2 30 / .35)' : undefined }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <div className="display" style={{ fontSize: 24, color: streak > 0 ? 'oklch(0.88 0.18 45)' : 'var(--muted)' }}>{streak}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Streak มาเรียนต่อเนื่อง</div>
            </div>
            <div className="center col glass-2" style={{ padding: '16px 8px', borderRadius: 'var(--r-md)', gap: 6 }}>
              <Icon name="map" size={22} color="var(--purple)" />
              <div className="display" style={{ fontSize: 24, color: '#fff' }}>{SUBJECTS.filter(sub => s.territories[sub.key] >= 50).length}/8</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>วิชาที่ผ่านเกณฑ์ 50%+</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            {/* subject progress */}
            <div>
              <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 12 }}>ผลการเรียนรายวิชา</h4>
              <div className="col" style={{ gap: 11 }}>
                {SUBJECTS.map(sub => {
                  const p = s.territories[sub.key];
                  return (
                    <div key={sub.key} className="col" style={{ gap: 5 }}>
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <span className="row" style={{ gap: 7, fontSize: 12.5, color: 'var(--ink-soft)' }}>
                          <Icon name={sub.icon} size={15} color={`oklch(0.78 0.16 ${sub.hue})`} /> {sub.th}
                        </span>
                        <span className="tech" style={{ fontSize: 12, color: p >= 100 ? 'var(--gold)' : 'var(--muted)' }}>{p}%</span>
                      </div>
                      <Bar value={p} color={`oklch(0.74 0.17 ${sub.hue})`} height={7} glow />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* health + attendance summary */}
            <div className="col" style={{ gap: 16 }}>
              <div>
                <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 12 }}>สรุปสุขภาพ</h4>
                <div className="row" style={{ gap: 10 }}>
                  {[['scale', s.health.w + ' กก.', 'น้ำหนัก'], ['ruler', s.health.h + ' ซม.', 'ส่วนสูง'], ['heart', s.health.bmi, 'BMI']].map(([ic, v, l]) => (
                    <div key={l} className="center col glass-2" style={{ flex: 1, padding: '12px 4px', borderRadius: 'var(--r-md)', gap: 3 }}>
                      <Icon name={ic} size={17} color="var(--cyan)" />
                      <div className="display" style={{ fontSize: 16, color: '#fff' }}>{v}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div className="row glass-2" style={{ marginTop: 10, padding: '10px 14px', borderRadius: 'var(--r-md)', gap: 8, justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>ภาวะโภชนาการ</span>
                  <span className="pill" style={{ background: 'color-mix(in oklch,var(--st-present) 22%,transparent)', color: 'var(--st-present)' }}>{s.health.nutrition}</span>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 12 }}>สรุปการมาเรียน (ปีการศึกษา)</h4>
                <div className="row glass-2" style={{ borderRadius: 'var(--r-md)', padding: 14, gap: 6 }}>
                  {attItems.map(([l, v, c]) => (
                    <div key={l} className="center col" style={{ flex: 1, gap: 4 }}>
                      <div className="display" style={{ fontSize: 22, color: c }}>{v}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.StudentProfile = StudentProfile;
