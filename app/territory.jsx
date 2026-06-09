/* ============================================================
   GAME — Territory Map (stylized knowledge regions)
   Abstract glowing landmass + 8 subject nodes (game board)
   ============================================================ */
function TerritoryMap({ openStudent }) {
  const { SUBJECTS, STUDENTS } = window.GC;
  const avg = key => Math.round(STUDENTS.reduce((a, s) => a + s.game.territories[key], 0) / STUDENTS.length);
  const [sel, setSel] = React.useState('thai');
  const sub = SUBJECTS.find(s => s.key === sel);
  const subAvg = avg(sub.key);
  const explorers = [...STUDENTS].sort((a, b) => b.game.territories[sub.key] - a.game.territories[sub.key]).slice(0, 4);

  // connection order for energy lines (path through nodes)
  const links = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,5],[5,6],[5,7],[6,7]];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, height: '100%' }}>
      {/* map */}
      <div className="glass" style={{ borderRadius: 'var(--r-xl)', position: 'relative', overflow: 'hidden', minHeight: 520 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 40%, color-mix(in oklch,var(--purple) 20%,transparent), transparent 70%)' }} />
        {/* abstract landmass placeholder */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.4 0.12 280)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="oklch(0.3 0.1 250)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* simplified stylized continent blob */}
          <path d="M50,8 C62,10 66,20 64,30 C72,34 74,44 66,50 C70,58 60,66 58,74 C56,84 48,94 44,90 C38,86 42,78 38,74 C28,72 26,60 32,54 C26,48 28,38 34,36 C30,28 38,18 44,18 C45,12 46,7 50,8 Z"
            fill="url(#land)" stroke="color-mix(in oklch,var(--cyan) 40%,transparent)" strokeWidth="0.4" />
          {/* energy links */}
          {links.map(([a, b], i) => {
            const A = SUBJECTS[a].pos, B = SUBJECTS[b].pos;
            return <line key={i} x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="color-mix(in oklch,var(--cyan) 35%,transparent)" strokeWidth="0.4" strokeDasharray="1.4 1.4" />;
          })}
        </svg>

        {/* nodes */}
        {SUBJECTS.map(s => {
          const p = avg(s.key); const on = sel === s.key; const locked = p < 20;
          return (
            <button key={s.key} onClick={() => setSel(s.key)} className="center col"
              style={{ position: 'absolute', left: s.pos[0] + '%', top: s.pos[1] + '%', transform: 'translate(-50%,-50%)', gap: 6,
                cursor: 'pointer', border: 'none', background: 'transparent', zIndex: on ? 5 : 2 }}>
              <div className="center" style={{ width: on ? 66 : 56, height: on ? 66 : 56, borderRadius: '50%', position: 'relative', transition: 'all .3s',
                background: `radial-gradient(circle at 50% 35%, oklch(0.7 0.18 ${s.hue}), oklch(0.4 0.16 ${s.hue}))`,
                boxShadow: on ? `0 0 30px oklch(0.7 0.2 ${s.hue}), 0 0 0 3px rgba(255,255,255,.5)` : `0 0 18px -2px oklch(0.6 0.18 ${s.hue})`,
                opacity: locked ? 0.5 : 1, filter: locked ? 'grayscale(.5)' : 'none' }}>
                {on && <span style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid #fff', opacity: .5, animation: 'spinSlow 8s linear infinite', borderStyle: 'dashed' }} />}
                <Icon name={s.icon} size={on ? 28 : 24} color="#fff" />
                {locked && <span style={{ position: 'absolute', bottom: -2, right: -2 }}><Icon name="lock" size={16} color="#fff" /></span>}
              </div>
              <span className="pill tech" style={{ fontSize: 10.5, background: 'rgba(0,0,0,.5)', color: '#fff', padding: '2px 8px' }}>{p}%</span>
              <span style={{ fontSize: 11.5, color: '#fff', fontWeight: 600, textShadow: '0 1px 6px #000', maxWidth: 90, textAlign: 'center', lineHeight: 1.1 }}>{s.th}</span>
            </button>
          );
        })}

        {/* legend */}
        <div className="glass-2 row" style={{ position: 'absolute', bottom: 16, left: 16, borderRadius: 99, padding: '8px 14px', gap: 14, fontSize: 11.5, color: 'var(--ink-soft)' }}>
          <span className="row" style={{ gap: 6 }}><span className="dot" style={{ background: 'var(--gold)' }} /> ปลดล็อกแล้ว</span>
          <span className="row" style={{ gap: 6 }}><Icon name="lock" size={13} color="var(--muted)" /> ยังไม่ปลดล็อก</span>
          <span className="tech" style={{ color: 'var(--muted)' }}>· 8 ดินแดน = 8 วิชา</span>
        </div>
      </div>

      {/* side panel */}
      <div className="glass scroll" style={{ borderRadius: 'var(--r-xl)', padding: 22, maxHeight: 560 }}>
        <div className="center" style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 14px',
          background: `radial-gradient(circle at 50% 35%, oklch(0.72 0.18 ${sub.hue}), oklch(0.42 0.16 ${sub.hue}))`,
          boxShadow: `0 12px 30px -8px oklch(0.6 0.2 ${sub.hue})` }}>
          <Icon name={sub.icon} size={34} color="#fff" />
        </div>
        <h3 style={{ fontSize: 21, color: '#fff', textAlign: 'center' }}>{sub.th}</h3>
        <div className="tech" style={{ fontSize: 11.5, color: 'var(--muted)', textAlign: 'center', letterSpacing: '.1em', marginBottom: 16 }}>ดินแดนความรู้</div>

        <div className="col" style={{ gap: 6, marginBottom: 18 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>ความคืบหน้าเฉลี่ยของห้อง</span>
            <span className="display" style={{ fontSize: 16, color: `oklch(0.8 0.16 ${sub.hue})` }}>{subAvg}%</span>
          </div>
          <Bar value={subAvg} color={`oklch(0.74 0.17 ${sub.hue})`} height={10} glow />
        </div>

        <div style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>นักสำรวจชั้นนำ</div>
        <div className="col" style={{ gap: 8 }}>
          {explorers.map((s, i) => (
            <div key={s.id} onClick={() => openStudent(s.id)} className="row glass-2" style={{ gap: 10, padding: 9, borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
              <span className="center tech" style={{ width: 22, height: 22, borderRadius: 7, fontSize: 12, background: i === 0 ? 'var(--gold)' : 'var(--surface-2)', color: i === 0 ? '#1a1400' : 'var(--muted)', fontWeight: 700 }}>{i + 1}</span>
              <HeroAvatar student={s} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="nowrap" style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{s.nick}</div>
              </div>
              <span className="tech" style={{ fontSize: 12.5, color: `oklch(0.8 0.16 ${sub.hue})` }}>{s.game.territories[sub.key]}%</span>
            </div>
          ))}
        </div>

        <button className="btn btn-neon" style={{ width: '100%', justifyContent: 'center', marginTop: 18 }}>
          <Icon name="flag" size={17} color="#0a0a14" /> มอบความสำเร็จดินแดน
        </button>
      </div>
    </div>
  );
}
window.TerritoryMap = TerritoryMap;
