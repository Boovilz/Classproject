/* ============================================================
   ACADEMIC RECORDS — subject averages + per-student grade table
   ============================================================ */
function AcademicRecords({ openStudent }) {
  const STUDENTS = useStudents();
  const { SUBJECTS } = window.GC;
  const subjectAvg = window.GC.getSubjectAverages();
  const [sortKey, setSortKey] = React.useState(SUBJECTS[0].key);

  const ranked = [...STUDENTS].sort((a, b) => (b.territories[sortKey] || 0) - (a.territories[sortKey] || 0));
  const gradeColor = v => v >= 80 ? 'var(--emerald)' : v >= 60 ? 'var(--orange)' : 'var(--st-absent)';
  const gradeLabel = v => v >= 80 ? 'ดีมาก' : v >= 60 ? 'ปานกลาง' : 'ควรพัฒนา';

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      {/* subject average chart */}
      <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: '22px 26px' }}>
        <h3 style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 16 }}>ผลการเรียนเฉลี่ยรายวิชาทั้งห้อง</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {subjectAvg.map((sub, i) => (
            <div key={sub.key} className="glass-2 col" style={{ borderRadius: 'var(--r-lg)', padding: '14px 16px', gap: 8 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 600 }}>{sub.th}</span>
                <span className="display" style={{ fontSize: 16, color: gradeColor(sub.avg) }}>{sub.avg}%</span>
              </div>
              <Bar value={sub.avg} max={100} color={gradeColor(sub.avg)} height={8} />
            </div>
          ))}
        </div>
      </div>

      {/* per-student table */}
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: '20px 24px', gap: 14 }}>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: 16, color: 'var(--ink)' }}>ผลการเรียนรายบุคคล</h3>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            {SUBJECTS.map(sub => (
              <button key={sub.key} onClick={() => setSortKey(sub.key)} className="btn"
                style={{ padding: '6px 12px', fontSize: 12, boxShadow: 'none',
                  background: sortKey === sub.key ? 'var(--royal)' : 'var(--surface-2)',
                  color: sortKey === sub.key ? '#fff' : 'var(--ink-soft)' }}>{sub.th}</button>
            ))}
          </div>
        </div>

        <div className="col" style={{ gap: 6 }}>
          {ranked.map((st, i) => {
            const v = st.territories[sortKey] || 0;
            return (
              <div key={st.id} onClick={() => openStudent && openStudent(st.id)} className="row glass-2"
                style={{ gap: 12, padding: '10px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer', alignItems: 'center' }}>
                <span className="center display" style={{ width: 24, height: 24, borderRadius: 7, fontSize: 12, color: 'var(--muted)', flexShrink: 0, background: 'var(--surface-2)' }}>{i + 1}</span>
                <HeroAvatar student={st} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{st.nick} · {st.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>เลขที่ {st.no}</div>
                </div>
                <div style={{ width: 140 }}>
                  <Bar value={v} max={100} color={gradeColor(v)} height={7} />
                </div>
                <span className="pill" style={{ minWidth: 60, justifyContent: 'center', background: 'color-mix(in oklch,' + gradeColor(v) + ' 16%,transparent)', color: gradeColor(v) }}>{gradeLabel(v)}</span>
                <span className="display" style={{ fontSize: 14, color: gradeColor(v), width: 38, textAlign: 'right' }}>{v}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AcademicRecords });
