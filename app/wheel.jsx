/* ============================================================
   GAME — Mini-games hub + working Wheel Spinner
   ============================================================ */
function WheelSpinner({ openStudent }) {
  const { STUDENTS } = window.GC;
  const items = STUDENTS;
  const n = items.length;
  const seg = 360 / n;
  const [rot, setRot] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [winner, setWinner] = React.useState(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true); setWinner(null);
    const idx = Math.floor(Math.random() * n);
    const target = 360 * 6 - (idx * seg + seg / 2); // bring segment center to top
    const base = Math.ceil(rot / 360) * 360;
    const final = base + target;
    setRot(final);
    setTimeout(() => { setSpinning(false); setWinner(items[idx]); }, 4200);
  };

  const R = 150, cx = 160, cy = 160;
  const wedge = (i) => {
    const a0 = (i * seg - 90) * Math.PI / 180;
    const a1 = ((i + 1) * seg - 90) * Math.PI / 180;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    return `M${cx},${cy} L${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} Z`;
  };

  return (
    <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: 28, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 60% at 50% 45%, var(--halo), transparent 70%)' }} />
      <div className="row" style={{ position: 'relative', gap: 36, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        {/* wheel */}
        <div style={{ position: 'relative', width: 360, height: 360 }}>
          {/* pointer */}
          <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
            <svg width="34" height="34" viewBox="0 0 24 24"><path d="M12 22 4 8h16z" fill="var(--cyan)" stroke="#0a0a14" strokeWidth="1.4" /></svg>
          </div>
          <svg width="360" height="360" viewBox="0 0 320 320" style={{ transform: `rotate(${rot}deg)`, transition: spinning ? 'transform 4.1s cubic-bezier(.12,.62,.16,1)' : 'none', filter: 'drop-shadow(0 14px 40px rgba(0,0,0,.5))' }}>
            {items.map((s, i) => (
              <path key={s.id} d={wedge(i)} fill={`oklch(${0.5 + (i % 2) * 0.08} 0.18 ${s.game.hue})`} stroke="rgba(0,0,0,.25)" strokeWidth="1" />
            ))}
            {items.map((s, i) => {
              const a = ((i + 0.5) * seg - 90) * Math.PI / 180;
              const tr = R * 0.66;
              const tx = cx + tr * Math.cos(a), ty = cy + tr * Math.sin(a);
              return <text key={s.id} x={tx} y={ty} fill="#fff" fontSize="12" fontWeight="700" fontFamily="var(--font-display)"
                textAnchor="middle" dominantBaseline="middle" transform={`rotate(${(i + 0.5) * seg}, ${tx}, ${ty})`}>{s.nick}</text>;
            })}
            <circle cx={cx} cy={cy} r="30" fill="oklch(0.2 0.05 285)" stroke="var(--cyan)" strokeWidth="2" />
          </svg>
          <button onClick={spin} disabled={spinning} className="center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 58, height: 58, borderRadius: '50%', cursor: spinning ? 'default' : 'pointer', border: 'none', zIndex: 4,
            background: 'linear-gradient(135deg,var(--cyan),var(--neon))', color: '#0a0a14', boxShadow: '0 0 24px var(--halo)' }}>
            <Icon name={spinning ? 'refresh' : 'play'} size={24} color="#0a0a14" style={{ animation: spinning ? 'spinSlow 1s linear infinite' : 'none' }} />
          </button>
        </div>

        {/* result */}
        <div className="col" style={{ gap: 14, minWidth: 240, alignItems: 'center' }}>
          <h3 style={{ fontSize: 22, color: '#fff' }}>วงล้อสุ่มนักเรียน</h3>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', textAlign: 'center', maxWidth: 260 }}>หมุนเพื่อสุ่มผู้ตอบคำถาม — ยุติธรรม สนุก และลุ้นกันทั้งห้อง</p>
          {winner ? (
            <div className="glass pop col center" style={{ borderRadius: 'var(--r-lg)', padding: 20, gap: 10, width: '100%',
              background: `linear-gradient(160deg, color-mix(in oklch,var(--cyan) 18%,transparent), transparent)` }}>
              <span className="pill tech" style={{ background: 'color-mix(in oklch,var(--gold) 20%,transparent)', color: 'var(--gold)' }}>ผู้โชคดี!</span>
              <HeroAvatar student={winner} size={80} glow ring="var(--cyan)" />
              <div className="display" style={{ fontSize: 22, color: '#fff' }}>{winner.name}</div>
              <div className="row" style={{ gap: 8 }}>
                <button onClick={() => openStudent(winner.id)} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }}>ดูการ์ด</button>
                <button onClick={spin} className="btn btn-neon" style={{ padding: '8px 14px', fontSize: 13 }}>หมุนอีก</button>
              </div>
            </div>
          ) : (
            <button onClick={spin} disabled={spinning} className="btn btn-neon" style={{ padding: '14px 30px', fontSize: 16 }}>
              {spinning ? 'กำลังหมุน…' : <>หมุนวงล้อ <Icon name="wheel" size={20} color="#0a0a14" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// GamesHub is defined in minigames.jsx (full launcher with all 5 games)

window.WheelSpinner = WheelSpinner;
