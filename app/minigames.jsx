/* ============================================================
   MINI-GAMES — Hot Potato · Ladder · Card Draw · Boss Battle
   All theme-aware (use .glass/.btn + tokens), tie to STUDENTS.
   ============================================================ */

/* ---------------------------------------------------------- *
 *  HOT POTATO  (ระเบิดเวลา)
 * ---------------------------------------------------------- */
function HotPotato() {
  const { STUDENTS } = window.GC;
  const n = STUDENTS.length;
  const [idx, setIdx] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [caught, setCaught] = React.useState(null);
  const [fuse, setFuse] = React.useState(100);
  const tRef = React.useRef(null);
  const dl = React.useRef(0);
  const start = React.useRef(0);

  const stop = () => { clearTimeout(tRef.current); };
  React.useEffect(() => () => stop(), []);

  const begin = () => {
    stop();
    setCaught(null);
    const dur = 5000 + Math.random() * 8000;
    start.current = performance.now();
    dl.current = start.current + dur;
    setRunning(true);
    setIdx(Math.floor(Math.random() * n));
    const step = () => {
      const now = performance.now();
      const remain = dl.current - now;
      const total = dl.current - start.current;
      setFuse(Math.max(0, (remain / total) * 100));
      if (remain <= 0) {
        setRunning(false);
        setIdx(cur => { setCaught(cur); return cur; });
        return;
      }
      // tick interval slows as fuse nears end (suspense)
      const prog = 1 - remain / total;
      const interval = 80 + prog * prog * 360;
      setIdx(c => (c + 1) % n);
      tRef.current = setTimeout(step, interval);
    };
    tRef.current = setTimeout(step, 120);
  };

  const fuseColor = fuse > 55 ? 'var(--st-present)' : fuse > 25 ? 'var(--st-late)' : 'var(--st-absent)';

  return (
    <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: 26, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 60% at 50% 30%, var(--halo), transparent 70%)' }} />
      <div className="col center" style={{ position: 'relative', gap: 18 }}>
        {/* bomb */}
        <div className="center" style={{ position: 'relative', width: 150, height: 150 }}>
          <div className="center" style={{ width: 130, height: 130, borderRadius: '50%', position: 'relative',
            background: caught ? 'radial-gradient(circle at 38% 32%, #ff8a4c, #b3231a)' : 'radial-gradient(circle at 38% 32%, #3a3550, #14101f)',
            boxShadow: running ? `0 0 ${20 + (100 - fuse) / 2}px ${fuseColor}` : '0 10px 30px -8px #000',
            animation: caught ? 'shake .5s' : running && fuse < 25 ? 'pulseGlow .3s infinite' : 'none', border: '3px solid rgba(255,255,255,.12)' }}>
            {/* fuse line + spark */}
            <div style={{ position: 'absolute', top: -22, left: '60%', width: 4, height: 26, background: '#6b5a3a', borderRadius: 2, transform: 'rotate(18deg)' }} />
            <span style={{ position: 'absolute', top: -28, left: '70%', width: 12, height: 12, borderRadius: '50%',
              background: fuseColor, boxShadow: `0 0 12px ${fuseColor}`, animation: running ? 'pulseGlow .25s infinite' : 'none', opacity: running ? 1 : 0 }} />
            <span className="display" style={{ fontSize: caught ? 34 : 22, color: '#fff' }}>{caught ? 'BOOM!' : running ? Math.ceil(fuse / 10) : 'พร้อม'}</span>
          </div>
        </div>

        {/* current holder */}
        {(running || caught !== null) && (
          <div className="col center pop" key={caught !== null ? 'c' : idx} style={{ gap: 8 }}>
            <HeroAvatar student={STUDENTS[idx]} size={caught !== null ? 92 : 72} glow ring={caught !== null ? 'var(--st-absent)' : 'var(--cyan)'} />
            <div className="display" style={{ fontSize: caught !== null ? 24 : 19, color: '#fff' }}>{STUDENTS[idx].name}</div>
            {caught !== null && <span className="pill" style={{ background: 'color-mix(in oklch,var(--st-absent) 22%,transparent)', color: 'var(--st-absent)' }}>ระเบิดในมือ! ตอบคำถามเลย</span>}
          </div>
        )}
        {!running && caught === null && (
          <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', maxWidth: 340 }}>ส่งระเบิดต่อกันไปเรื่อยๆ — ใครถือตอนระเบิดต้องตอบคำถาม! เวลานับถอยหลังเป็นความลับ</p>
        )}

        {/* fuse bar */}
        <div style={{ width: 'min(420px,90%)' }}>
          <div className="bar" style={{ height: 12 }}><i style={{ width: fuse + '%', background: fuseColor, transition: 'width .1s linear' }} /></div>
        </div>

        <div className="row" style={{ gap: 10 }}>
          <button onClick={begin} className="btn btn-neon" style={{ padding: '13px 28px', fontSize: 15 }}>
            <Icon name={running ? 'refresh' : 'fire'} size={19} color="#0a0a14" /> {running ? 'เริ่มใหม่' : caught !== null ? 'เล่นอีกครั้ง' : 'จุดชนวน'}
          </button>
          {running && <button onClick={() => { stop(); setRunning(false); setCaught(idx); }} className="btn btn-ghost" style={{ padding: '13px 20px' }}>หยุด</button>}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- *
 *  LADDER CHALLENGE  (บันไดท้าทาย) — Amidakuji
 * ---------------------------------------------------------- */
const LADDER_PRIZES = ['+15 XP', 'ตอบคำถาม', 'ผู้ช่วยครู', 'เลือกเพลง', 'พักดื่มน้ำ', '+1 ดาว', 'นำสวดมนต์', 'เปิดประตู'];

function LadderChallenge() {
  const { STUDENTS } = window.GC;
  const [count, setCount] = React.useState(5);
  const [seed, setSeed] = React.useState(0);
  const W = 620, H = 380, ROWS = 9;
  const topY = 56, botY = H - 46;

  const { players, prizes, rungs } = React.useMemo(() => {
    const sh = [...STUDENTS].sort(() => Math.random() - 0.5).slice(0, count);
    const pz = [...LADDER_PRIZES].sort(() => Math.random() - 0.5).slice(0, count);
    const rg = [];
    for (let r = 0; r < ROWS; r++) {
      const row = new Array(count - 1).fill(false);
      for (let c = 0; c < count - 1; c++) {
        if (row[c - 1]) continue;
        if (Math.random() < 0.42) row[c] = true;
      }
      rg.push(row);
    }
    return { players: sh, prizes: pz, rungs: rg };
  }, [count, seed]);

  const [picked, setPicked] = React.useState(null);
  const [results, setResults] = React.useState({});
  const colX = c => 46 + c * ((W - 92) / (count - 1));
  const rowY = r => topY + 26 + r * ((botY - topY - 40) / (ROWS - 1));

  const trace = (s) => {
    let c = s; const pts = [[colX(c), topY]];
    for (let r = 0; r < ROWS; r++) {
      const y = rowY(r);
      pts.push([colX(c), y]);
      if (rungs[r][c]) { c += 1; pts.push([colX(c), y]); }
      else if (c > 0 && rungs[r][c - 1]) { c -= 1; pts.push([colX(c), y]); }
    }
    pts.push([colX(c), botY]);
    return { col: c, pts };
  };

  const pick = (s) => {
    if (results[s] !== undefined) { setPicked(s); return; }
    const { col, pts } = trace(s);
    setPicked(s);
    setResults(r => ({ ...r, [s]: { col, pts } }));
  };

  const reset = () => { setResults({}); setPicked(null); setSeed(x => x + 1); };

  const active = picked !== null ? results[picked] : null;
  const pathStr = active ? active.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ') : '';
  const pathLen = active ? active.pts.reduce((a, p, i) => i ? a + Math.hypot(p[0] - active.pts[i - 1][0], p[1] - active.pts[i - 1][1]) : 0, 0) : 0;

  return (
    <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: 22 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 19, color: '#fff' }}>บันไดท้าทาย</h3>
          <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>แตะชื่อด้านบนเพื่อไต่บันไดหาภารกิจของตัวเอง</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="row glass-2" style={{ borderRadius: 99, padding: 4, gap: 2 }}>
            {[4, 5, 6].map(c => (
              <button key={c} onClick={() => { setCount(c); setResults({}); setPicked(null); }} className="center" style={{ width: 34, height: 32, borderRadius: 99, cursor: 'pointer', border: 'none',
                background: count === c ? 'var(--purple)' : 'transparent', color: count === c ? '#fff' : 'var(--ink-soft)', fontFamily: 'var(--font-tech)', fontSize: 14 }}>{c}</button>
            ))}
          </div>
          <button onClick={reset} className="btn btn-ghost" style={{ padding: '9px 14px', fontSize: 13 }}><Icon name="shuffle" size={16} /> สุ่มใหม่</button>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {/* top players */}
        <div className="row" style={{ position: 'absolute', top: 0, left: 0, right: 0, justifyContent: 'space-between', padding: '0 10px', zIndex: 3 }}>
          {players.map((p, c) => (
            <button key={p.id} onClick={() => pick(c)} className="col center" style={{ gap: 4, cursor: 'pointer', border: 'none', background: 'transparent',
              width: (W - 92) / (count - 1) + 30, transform: picked === c ? 'scale(1.06)' : 'scale(1)', transition: 'transform .2s' }}>
              <HeroAvatar student={p} size={40} glow={picked === c} ring={picked === c ? 'var(--cyan)' : null} />
              <span className="nowrap" style={{ fontSize: 11.5, color: results[c] !== undefined ? 'var(--cyan)' : '#fff', maxWidth: 70 }}>{p.nick}</span>
            </button>
          ))}
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
          {/* verticals */}
          {players.map((_, c) => (
            <line key={c} x1={colX(c)} y1={topY} x2={colX(c)} y2={botY} stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
          ))}
          {/* rungs */}
          {rungs.map((row, r) => row.map((on, c) => on && (
            <line key={r + '-' + c} x1={colX(c)} y1={rowY(r)} x2={colX(c + 1)} y2={rowY(r)} stroke="var(--muted)" strokeWidth="3" strokeLinecap="round" />
          )))}
          {/* traced path */}
          {active && (
            <path key={picked + '-' + seed} d={pathStr} fill="none" stroke="var(--cyan)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: pathLen, strokeDashoffset: pathLen, animation: 'drawPath 1.1s ease-out forwards', filter: 'drop-shadow(0 0 6px var(--cyan))' }} />
          )}
        </svg>

        {/* bottom prizes */}
        <div className="row" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'space-between', padding: '0 10px' }}>
          {prizes.map((pz, c) => {
            const won = active && active.col === c;
            return (
              <div key={c} className="center" style={{ width: (W - 92) / (count - 1) + 30 }}>
                <span className="pill" style={{ fontSize: 11.5, padding: '6px 10px', textAlign: 'center', lineHeight: 1.1,
                  background: won ? 'color-mix(in oklch,var(--gold) 26%,transparent)' : 'var(--surface-2)',
                  color: won ? 'var(--gold)' : 'var(--ink-soft)', border: won ? '2px solid var(--gold)' : '2px solid var(--line)',
                  transform: won ? 'scale(1.1)' : 'scale(1)', transition: 'all .3s' }}>{pz}</span>
              </div>
            );
          })}
        </div>
      </div>

      {active && (
        <div className="center pop" style={{ marginTop: 16 }}>
          <div className="glass-2 row" style={{ borderRadius: 'var(--r-md)', padding: '10px 18px', gap: 10 }}>
            <HeroAvatar student={players[picked]} size={34} />
            <span style={{ fontSize: 14, color: '#fff' }}>{players[picked].nick} ได้</span>
            <span className="pill" style={{ background: 'color-mix(in oklch,var(--gold) 22%,transparent)', color: 'var(--gold)' }}>{prizes[active.col]}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- *
 *  CARD DRAW  (สุ่มการ์ด) — 3D flip deck
 * ---------------------------------------------------------- */
function CardDraw() {
  const { STUDENTS } = window.GC;
  const [deck, setDeck] = React.useState(() => [...STUDENTS].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = React.useState({});
  const [drawnCount, setDrawnCount] = React.useState(0);
  const [last, setLast] = React.useState(null);
  const cards = deck.length;

  const flip = (i) => {
    if (flipped[i]) return;
    setFlipped(f => ({ ...f, [i]: drawnCount }));
    setLast(deck[drawnCount % cards]);
    setDrawnCount(c => c + 1);
  };
  const reshuffle = () => { setDeck([...STUDENTS].sort(() => Math.random() - 0.5)); setFlipped({}); setDrawnCount(0); setLast(null); };

  return (
    <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 19, color: '#fff' }}>สุ่มการ์ดนักเรียน</h3>
          <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>แตะการ์ดคว่ำเพื่อเปิด — สุ่มผู้โชคดีทีละคน</p>
        </div>
        <div className="row" style={{ gap: 10, alignItems: 'center' }}>
          <span className="pill tech" style={{ background: 'var(--surface-2)', color: 'var(--cyan)' }}>เปิดแล้ว {drawnCount}/{cards}</span>
          <button onClick={reshuffle} className="btn btn-ghost" style={{ padding: '9px 14px', fontSize: 13 }}><Icon name="shuffle" size={16} /> สับไพ่ใหม่</button>
        </div>
      </div>

      {last && (
        <div className="center pop" key={last.id} style={{ marginBottom: 16 }}>
          <div className="glass-2 row" style={{ borderRadius: 'var(--r-md)', padding: '8px 16px', gap: 10 }}>
            <span className="pill tech" style={{ background: 'color-mix(in oklch,var(--gold) 20%,transparent)', color: 'var(--gold)' }}>ล่าสุด</span>
            <HeroAvatar student={last} size={32} />
            <span style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{last.name}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(96px,1fr))', gap: 12 }}>
        {deck.map((s, i) => {
          const isFlipped = flipped[i] !== undefined;
          const who = isFlipped ? deck[flipped[i] % cards] : null;
          return (
            <div key={i} onClick={() => flip(i)} style={{ perspective: 700, cursor: isFlipped ? 'default' : 'pointer', aspectRatio: '3/4' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d',
                transition: 'transform .55s cubic-bezier(.2,.8,.2,1)', transform: isFlipped ? 'rotateY(180deg)' : 'none' }}>
                {/* back */}
                <div className="center" style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 'var(--r-md)',
                  background: 'linear-gradient(150deg, color-mix(in oklch,var(--purple) 40%,#1a1430), color-mix(in oklch,var(--cyan) 24%,#1a1430))',
                  border: '2px solid var(--line)' }}>
                  <div className="center" style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.12)' }}>
                    <Icon name="spark" size={20} color="#fff" />
                  </div>
                </div>
                {/* front */}
                <div className="center col" style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 'var(--r-md)',
                  background: who ? `linear-gradient(160deg, oklch(0.4 0.16 ${who.game.hue}), oklch(0.25 0.12 ${who.game.hue}))` : 'var(--surface-2)',
                  border: '2px solid var(--cyan)', gap: 6, padding: 6 }}>
                  {who && <HeroAvatar student={who} size={42} />}
                  {who && <span className="nowrap" style={{ fontSize: 11, color: '#fff', fontWeight: 700, maxWidth: '100%' }}>{who.nick}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- *
 *  BOSS BATTLE  (บอสไฟต์) — whole-class HP battle
 * ---------------------------------------------------------- */
function BossBattle() {
  const { STUDENTS } = window.GC;
  const MAX = 5000;
  const [hp, setHp] = React.useState(MAX);
  const [hits, setHits] = React.useState([]);     // floating damage {id,x,val,crit}
  const [combo, setCombo] = React.useState(0);
  const [shake, setShake] = React.useState(0);
  const [won, setWon] = React.useState(false);
  const comboTimer = React.useRef(null);
  const enraged = hp <= MAX * 0.4 && !won;

  const attack = (mult = 1, label) => {
    if (won) return;
    const crit = Math.random() < 0.18;
    const base = (Math.floor(70 + Math.random() * 150)) * mult;
    const dmg = crit ? Math.round(base * 2) : base;
    const who = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];
    const id = Math.random();
    setHits(h => [...h, { id, x: 20 + Math.random() * 60, val: dmg, crit, who: who.nick, label }]);
    setTimeout(() => setHits(h => h.filter(x => x.id !== id)), 850);
    setShake(s => s + 1);
    setCombo(c => c + 1);
    clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 1400);
    setHp(p => {
      const nv = Math.max(0, p - dmg);
      if (nv === 0) setWon(true);
      return nv;
    });
  };

  const reset = () => { setHp(MAX); setHits([]); setCombo(0); setWon(false); };
  const pct = (hp / MAX) * 100;

  return (
    <div className="glass scanlines" key={shake > 0 && shake} style={{ borderRadius: 'var(--r-xl)', padding: 26, position: 'relative', overflow: 'hidden',
      background: enraged ? 'linear-gradient(160deg, color-mix(in oklch,var(--neon) 16%,transparent), transparent)' : undefined }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(60% 60% at 50% 25%, ${enraged ? 'rgba(255,80,60,.3)' : 'var(--halo)'}, transparent 70%)` }} />

      {/* confetti on win */}
      {won && Array.from({ length: 26 }).map((_, i) => (
        <span key={i} style={{ position: 'absolute', top: -12, left: (i * 3.8) + '%', width: 9, height: 9, zIndex: 6,
          background: ['var(--cyan)', 'var(--gold)', 'var(--purple)', 'var(--neon)'][i % 4], borderRadius: i % 2 ? '50%' : 2,
          animation: `confettiFall ${1.4 + (i % 5) * 0.3}s ${(i % 7) * 0.12}s ease-in forwards` }} />
      ))}

      <div className="col center" style={{ position: 'relative', gap: 18 }}>
        {/* HP bar */}
        <div style={{ width: 'min(560px,96%)' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="display" style={{ fontSize: 16, color: '#fff' }}>{enraged ? '😤 จอมเวทแห่งความขี้เกียจ (โกรธ!)' : 'จอมเวทแห่งความขี้เกียจ'}</span>
            <span className="tech" style={{ fontSize: 13, color: enraged ? 'var(--neon)' : 'var(--cyan)' }}>{hp} / {MAX}</span>
          </div>
          <div className="bar" style={{ height: 18, border: '2px solid rgba(255,255,255,.15)' }}>
            <i style={{ width: pct + '%', background: enraged ? 'linear-gradient(90deg,#ff5d4d,#ffb000)' : 'linear-gradient(90deg,var(--st-absent),var(--st-late))', transition: 'width .3s' }} />
          </div>
        </div>

        {/* boss */}
        <div className="center" style={{ position: 'relative', width: 200, height: 180,
          animation: won ? 'none' : `${shake}` && 'flashHit .25s' }} key={'b' + shake}>
          <div className="center" style={{ width: 160, height: 160, borderRadius: '46% 46% 42% 42%', position: 'relative',
            background: enraged ? 'radial-gradient(circle at 40% 30%, #ff7a5c, #8a1410)' : 'radial-gradient(circle at 40% 30%, #8a6bff, #3a1f7a)',
            boxShadow: `0 16px 50px -10px ${enraged ? 'rgba(255,60,40,.6)' : 'var(--halo)'}`, border: '3px solid rgba(255,255,255,.18)',
            opacity: won ? 0.35 : 1, transition: 'opacity .4s', filter: won ? 'grayscale(.7)' : 'none' }}>
            {/* eyes */}
            <div className="row" style={{ gap: 26, position: 'absolute', top: 52 }}>
              {[0, 1].map(i => (
                <div key={i} className="center" style={{ width: 30, height: 30, borderRadius: '50%', background: '#fff' }}>
                  <div style={{ width: 13, height: 13, borderRadius: '50%', background: enraged ? '#c00' : '#1a1030', transform: won ? 'scaleY(0.2)' : 'none' }} />
                </div>
              ))}
            </div>
            {/* mouth */}
            <div style={{ position: 'absolute', bottom: 44, width: 56, height: won ? 4 : 18, borderRadius: won ? 2 : '0 0 30px 30px', background: '#1a1030', transition: 'all .3s' }} />
          </div>

          {/* floating damage */}
          {hits.map(h => (
            <span key={h.id} className="display" style={{ position: 'absolute', left: h.x + '%', top: '30%', zIndex: 5,
              fontSize: h.crit ? 34 : 24, color: h.crit ? 'var(--gold)' : '#fff', textShadow: '0 2px 8px #000',
              animation: 'dmgFloat .85s ease-out forwards', whiteSpace: 'nowrap' }}>
              {h.crit ? 'CRIT! ' : ''}-{h.val}
            </span>
          ))}
          {combo > 2 && !won && (
            <span className="tech" style={{ position: 'absolute', top: -6, right: -10, fontSize: 18, color: 'var(--cyan)', textShadow: '0 0 10px var(--halo)' }}>x{combo} คอมโบ!</span>
          )}
        </div>

        {won ? (
          <div className="col center pop" style={{ gap: 10 }}>
            <span className="pill" style={{ background: 'color-mix(in oklch,var(--gold) 24%,transparent)', color: 'var(--gold)', fontSize: 15, padding: '8px 18px' }}>
              <Icon name="trophy" size={18} color="var(--gold)" /> ชนะแล้ว! ทั้งห้องได้รับ +50 XP · +20 เหรียญ
            </span>
            <button onClick={reset} className="btn btn-neon" style={{ padding: '12px 26px' }}><Icon name="refresh" size={18} color="#0a0a14" /> สู้บอสตัวใหม่</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', textAlign: 'center', maxWidth: 380 }}>ตอบถูกทั้งห้องคือพลังโจมตี! ช่วยกันโจมตีจนพลังบอสหมด</p>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => attack(1)} className="btn btn-neon" style={{ padding: '13px 26px', fontSize: 15 }}><Icon name="bolt" size={19} color="#0a0a14" /> โจมตี!</button>
              <button onClick={() => attack(2.4)} className="btn btn-primary" style={{ padding: '13px 22px', fontSize: 14 }}><Icon name="fire" size={18} color="#fff" /> ท่าไม้ตาย (ทั้งกลุ่ม)</button>
              <button onClick={reset} className="btn btn-ghost" style={{ padding: '13px 18px' }}><Icon name="refresh" size={17} /> รีเซ็ต</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- *
 *  GAMES HUB — launcher
 * ---------------------------------------------------------- */
const MINIGAMES = [
  { key: 'wheel',  th: 'วงล้อสุ่มชื่อ', desc: 'สุ่มผู้ตอบคำถาม',   icon: 'wheel',  hue: 200 },
  { key: 'potato', th: 'ระเบิดเวลา',    desc: 'Hot Potato ส่งต่อ', icon: 'fire',   hue: 25 },
  { key: 'ladder', th: 'บันไดท้าทาย',   desc: 'ไต่บันไดหาภารกิจ',  icon: 'chart',  hue: 150 },
  { key: 'cards',  th: 'สุ่มการ์ด',     desc: 'เปิดการ์ดผู้โชคดี',  icon: 'card',   hue: 305 },
  { key: 'boss',   th: 'บอสไฟต์',       desc: 'สู้บอสทั้งห้อง',     icon: 'shield', hue: 0 },
];

function GamesHub({ openStudent }) {
  const [active, setActive] = React.useState('wheel');
  const G = { wheel: () => <WheelSpinner openStudent={openStudent} />, potato: HotPotato, ladder: LadderChallenge, cards: CardDraw, boss: BossBattle }[active];
  return (
    <div className="col" style={{ gap: 20 }}>
      {/* launcher tiles */}
      <div className="row scroll" style={{ gap: 12, paddingBottom: 4 }}>
        {MINIGAMES.map(g => {
          const on = active === g.key;
          return (
            <button key={g.key} onClick={() => setActive(g.key)} className="glass scanlines col" style={{ flex: '1 0 160px', borderRadius: 'var(--r-lg)', padding: 16, gap: 10, cursor: 'pointer', position: 'relative', overflow: 'hidden', border: 'none', textAlign: 'left',
              outline: on ? '2px solid var(--cyan)' : 'none', transform: on ? 'translateY(-3px)' : 'none', transition: 'transform .2s' }}>
              <div style={{ position: 'absolute', top: -26, right: -26, width: 90, height: 90, borderRadius: '50%', background: `oklch(0.68 0.2 ${g.hue})`, opacity: on ? .35 : .16, filter: 'blur(20px)' }} />
              <div className="center" style={{ width: 46, height: 46, borderRadius: 13, background: `radial-gradient(circle at 40% 30%, oklch(0.7 0.18 ${g.hue}), oklch(0.42 0.16 ${g.hue}))` }}>
                <Icon name={g.icon} size={23} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{g.th}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{g.desc}</div>
              </div>
              {on && <span className="pill tech" style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, background: 'color-mix(in oklch,var(--cyan) 20%,transparent)', color: 'var(--cyan)' }}>กำลังเล่น</span>}
            </button>
          );
        })}
      </div>

      <div key={active} className="rise"><G /></div>
    </div>
  );
}

Object.assign(window, { GamesHub, HotPotato, LadderChallenge, CardDraw, BossBattle, MINIGAMES });
