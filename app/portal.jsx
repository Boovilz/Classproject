/* ============================================================
   PORTAL GATE — cinematic world selector, 3 variations
   ============================================================ */

const PORTAL_VARIANTS = [
  { key: 'doors', th: 'ประตูคู่', en: 'Twin Doors' },
  { key: 'split', th: 'จอแยกภาพ', en: 'Cinematic Split' },
  { key: 'orbs',  th: 'พอร์ทัลพลังงาน', en: 'Energy Orbs' },
];

const WORLDS = {
  teacher: {
    title: 'ระบบบริหารชั้นเรียน', sub: 'Classroom Administration',
    desc: 'เช็กชื่อ สุขภาวะ สุขภาพ และรายงาน — ครบในที่เดียว',
    icon: 'users', tags: ['เช็กชื่อ', 'สุขภาพ', 'รายงาน'],
    grad: 'linear-gradient(160deg, oklch(0.62 0.13 255), oklch(0.40 0.14 262))',
    accent: 'oklch(0.66 0.14 250)',
  },
  game: {
    title: 'โลกเกมมิฟิเคชัน', sub: 'Gamification Realm',
    desc: 'อวตาร เลเวล แรงค์ แผนที่ความรู้ และมินิเกม',
    icon: 'game', tags: ['อวตาร', 'แผนที่', 'มินิเกม'],
    grad: 'linear-gradient(160deg, oklch(0.62 0.22 305), oklch(0.55 0.2 270))',
    accent: 'oklch(0.7 0.2 295)',
  },
};

function Particles({ color, n = 18 }) {
  const items = React.useMemo(() => Array.from({ length: n }, (_, i) => ({
    l: Math.random() * 100, t: Math.random() * 100, s: 2 + Math.random() * 4,
    d: 3 + Math.random() * 5, delay: Math.random() * 4,
  })), [n]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {items.map((p, i) => (
        <span key={i} className="float" style={{ position: 'absolute', left: p.l + '%', top: p.t + '%',
          width: p.s, height: p.s, borderRadius: 99, background: color, opacity: .7,
          boxShadow: `0 0 ${p.s * 3}px ${color}`, animationDuration: p.d + 's', animationDelay: p.delay + 's' }} />
      ))}
    </div>
  );
}

/* ---- shared world card content ---- */
function WorldGlyph({ w, size = 64 }) {
  return (
    <div className="center" style={{ width: size, height: size, borderRadius: size * 0.3,
      background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(6px)' }}>
      <Icon name={w.icon} size={size * 0.5} color="#fff" />
    </div>
  );
}

/* ===== Variation 1: Twin Doors ===== */
function DoorsVariant({ onEnter }) {
  const [hover, setHover] = React.useState(null);
  return (
    <div className="row center" style={{ gap: 32, height: '100%', padding: '0 40px' }}>
      {['teacher', 'game'].map((k) => {
        const w = WORLDS[k]; const on = hover === k; const dim = hover && !on;
        return (
          <div key={k} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)}
            onClick={() => onEnter(k)} className="col"
            style={{ flex: on ? '1.15' : '1', maxWidth: 460, height: 'min(620px, 78vh)', cursor: 'pointer',
              borderRadius: 'var(--r-xl)', padding: 36, justifyContent: 'space-between', position: 'relative',
              overflow: 'hidden', background: w.grad, transformStyle: 'preserve-3d',
              transform: on ? 'translateY(-10px) scale(1.02)' : dim ? 'scale(0.97)' : 'scale(1)',
              opacity: dim ? 0.6 : 1, filter: dim ? 'saturate(.7)' : 'none',
              boxShadow: on ? `0 40px 110px -30px ${w.accent}` : '0 30px 80px -40px #000',
              transition: 'all .5s cubic-bezier(.2,.8,.2,1)' }}>
            <Particles color={w.accent} n={on ? 26 : 12} />
            {/* door seam shimmer */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, background: 'rgba(255,255,255,.25)',
              opacity: on ? 0 : 1, transition: 'opacity .5s' }} />
            {on && <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)', animation: 'sweep 1.6s ease-in-out infinite' }} />
            </div>}

            <div className="row" style={{ justifyContent: 'space-between', position: 'relative' }}>
              <WorldGlyph w={w} />
              <span className="tech" style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, letterSpacing: '.12em', alignSelf: 'flex-start' }}>{k === 'teacher' ? '01' : '02'}</span>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="row" style={{ gap: 8, marginBottom: 12 }}>
                {w.tags.map(t => <span key={t} className="pill" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}>{t}</span>)}
              </div>
              <h2 style={{ fontSize: 32, color: '#fff', lineHeight: 1.08 }}>{w.title}</h2>
              <div className="tech" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, letterSpacing: '.1em', marginTop: 4 }}>{w.sub}</div>
              <p style={{ color: 'rgba(255,255,255,.85)', marginTop: 12, fontSize: 14.5, maxWidth: 320 }}>{w.desc}</p>
              <div className="btn" style={{ marginTop: 20, background: '#fff', color: '#1a1a2e',
                transform: on ? 'translateX(6px)' : 'none', transition: 'transform .4s' }}>
                เปิดประตู <Icon name="arrowRight" size={18} color="#1a1a2e" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== Variation 2: Cinematic diagonal split ===== */
function SplitVariant({ onEnter }) {
  const [hover, setHover] = React.useState(null);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {['teacher', 'game'].map((k, idx) => {
        const w = WORLDS[k]; const on = hover === k;
        const teacher = k === 'teacher';
        return (
          <div key={k} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} onClick={() => onEnter(k)}
            style={{ position: 'absolute', inset: 0, cursor: 'pointer', background: w.grad,
              clipPath: teacher
                ? (hover === 'game' ? 'polygon(0 0, 38% 0, 18% 100%, 0 100%)' : hover === 'teacher' ? 'polygon(0 0, 82% 0, 62% 100%, 0 100%)' : 'polygon(0 0, 62% 0, 42% 100%, 0 100%)')
                : (hover === 'teacher' ? 'polygon(38% 0, 100% 0, 100% 100%, 18% 100%)' : hover === 'game' ? 'polygon(82% 0, 100% 0, 100% 100%, 62% 100%)' : 'polygon(62% 0, 100% 0, 100% 100%, 42% 100%)'),
              transition: 'clip-path .55s cubic-bezier(.4,0,.2,1)', zIndex: on ? 2 : 1 }}>
            <Particles color={w.accent} n={on ? 22 : 10} />
            <div className="col" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              [teacher ? 'left' : 'right']: teacher ? '8%' : '8%', maxWidth: 360, textAlign: teacher ? 'left' : 'right',
              alignItems: teacher ? 'flex-start' : 'flex-end' }}>
              <WorldGlyph w={w} size={72} />
              <h2 style={{ fontSize: 38, color: '#fff', marginTop: 18, lineHeight: 1.05 }}>{w.title}</h2>
              <div className="tech" style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, letterSpacing: '.12em', marginTop: 4 }}>{w.sub}</div>
              <p style={{ color: 'rgba(255,255,255,.85)', marginTop: 14, fontSize: 15 }}>{w.desc}</p>
              <div className="btn" style={{ marginTop: 22, background: '#fff', color: '#1a1a2e',
                opacity: on ? 1 : 0.0, transform: on ? 'none' : 'translateY(8px)', transition: 'all .4s' }}>
                เข้าสู่โลกนี้ <Icon name="arrowRight" size={18} color="#1a1a2e" />
              </div>
            </div>
          </div>
        );
      })}
      <div className="center" style={{ position: 'absolute', left: '50%', top: 24, transform: 'translateX(-50%)', zIndex: 5,
        pointerEvents: 'none' }}>
        <span className="tech" style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, letterSpacing: '.2em' }}>เลือกโลกของคุณ</span>
      </div>
    </div>
  );
}

/* ===== Variation 3: Energy orb portals ===== */
function OrbsVariant({ onEnter }) {
  const [hover, setHover] = React.useState(null);
  return (
    <div className="row center" style={{ gap: 'min(10vw,120px)', height: '100%' }}>
      {['teacher', 'game'].map((k) => {
        const w = WORLDS[k]; const on = hover === k;
        return (
          <div key={k} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} onClick={() => onEnter(k)}
            className="col center" style={{ cursor: 'pointer', gap: 24, transition: 'transform .5s', transform: on ? 'scale(1.05)' : 'scale(1)' }}>
            <div className="center" style={{ position: 'relative', width: 'min(34vh,300px)', height: 'min(34vh,300px)' }}>
              {/* outer rotating rings */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${w.accent}`,
                opacity: .5, animation: 'spinSlow 14s linear infinite', borderStyle: 'dashed' }} />
              <div style={{ position: 'absolute', inset: '10%', borderRadius: '50%', border: `1px solid ${w.accent}`,
                opacity: .35, animation: 'spinSlow 9s linear infinite reverse' }} />
              {/* glowing core */}
              <div className="center" style={{ width: '74%', height: '74%', borderRadius: '50%', position: 'relative',
                background: w.grad, overflow: 'hidden',
                boxShadow: on ? `0 0 80px -8px ${w.accent}, inset 0 0 60px rgba(255,255,255,.2)` : `0 0 40px -12px ${w.accent}`,
                transition: 'box-shadow .5s' }}>
                <Particles color="#fff" n={on ? 18 : 8} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,.3), transparent 60%)' }} />
                <Icon name={w.icon} size={64} color="#fff" style={{ position: 'relative' }} />
                {on && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,.25), transparent)', animation: 'spinSlow 2s linear infinite' }} />}
              </div>
              {/* floating tags */}
              {on && w.tags.map((t, i) => (
                <span key={t} className="pill rise" style={{ position: 'absolute', background: 'rgba(255,255,255,.18)', color: '#fff',
                  backdropFilter: 'blur(6px)', [i === 0 ? 'top' : i === 1 ? 'right' : 'bottom']: -8,
                  left: i === 2 ? '50%' : 'auto', transform: i === 2 ? 'translateX(-50%)' : 'none' }}>{t}</span>
              ))}
            </div>
            <div className="center col" style={{ gap: 4 }}>
              <h2 style={{ fontSize: 26, color: '#fff' }}>{w.title}</h2>
              <div className="tech" style={{ color: w.accent, fontSize: 12.5, letterSpacing: '.14em' }}>{w.sub.toUpperCase()}</div>
              <div className="row" style={{ gap: 7, marginTop: 8, color: 'rgba(255,255,255,.7)', fontSize: 13, opacity: on ? 1 : .5, transition: 'opacity .4s' }}>
                แตะเพื่อเข้า <Icon name="arrowRight" size={15} color="rgba(255,255,255,.7)" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Portal({ onEnter, onLogout }) {
  const [variant, setVariant] = React.useState('doors');
  const V = { doors: DoorsVariant, split: SplitVariant, orbs: OrbsVariant }[variant];
  return (
    <div data-world="game" className="world" style={{ position: 'absolute', inset: 0 }}>
      {/* top bar */}
      <div className="row" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '20px 28px', justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 11 }}>
          <div className="center" style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, var(--cyan), var(--purple))' }}>
            <Icon name="shield" size={21} color="#0a0a14" />
          </div>
          <div>
            <div className="display" style={{ fontSize: 15, color: '#fff', lineHeight: 1 }}>Portal Gate</div>
            <div className="tech" style={{ fontSize: 10.5, color: 'var(--cyan)', letterSpacing: '.14em' }}>เลือกโลกที่จะเข้า</div>
          </div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          {/* variation switcher */}
          <div className="glass-2 row" style={{ borderRadius: 99, padding: 4, gap: 2 }}>
            {PORTAL_VARIANTS.map(v => (
              <button key={v.key} onClick={() => setVariant(v.key)} className="btn"
                style={{ padding: '7px 14px', fontSize: 12.5, borderRadius: 99,
                  background: variant === v.key ? 'linear-gradient(120deg,var(--cyan),var(--neon))' : 'transparent',
                  color: variant === v.key ? '#0a0a14' : 'var(--ink-soft)', boxShadow: 'none' }}>
                {v.th}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={onLogout} style={{ padding: '9px 14px' }}>
            <Icon name="logout" size={17} /> ออก
          </button>
        </div>
      </div>

      <div style={{ position: 'absolute', inset: 0, paddingTop: 70 }} key={variant}>
        <div className="pop" style={{ height: '100%' }}>
          <V onEnter={onEnter} />
        </div>
      </div>

      <div className="center" style={{ position: 'absolute', bottom: 16, left: 0, right: 0, zIndex: 10 }}>
        <span className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.14em' }}>
          เวอร์ชัน Portal: {PORTAL_VARIANTS.find(v => v.key === variant).en} · สลับได้ที่มุมขวาบน
        </span>
      </div>
    </div>
  );
}
window.Portal = Portal;
