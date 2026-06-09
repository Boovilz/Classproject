/* ============================================================
   GAME — Classroom tools (sound meter, timer, groups, focus)
   + Live status board
   ============================================================ */
function SoundMeter() {
  const [level, setLevel] = React.useState(28);
  const [on, setOn] = React.useState(true);
  const target = React.useRef(28);
  React.useEffect(() => {
    if (!on) return;
    let raf;
    const tick = () => {
      if (Math.random() < 0.04) target.current = 10 + Math.random() * 80;
      setLevel(l => l + (target.current - l) * 0.08 + (Math.random() - 0.5) * 4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);
  const lv = Math.max(2, Math.min(100, level));
  const loud = lv > 65;
  const color = lv > 65 ? 'var(--st-absent)' : lv > 40 ? 'var(--st-late)' : 'var(--st-present)';
  const bars = 28;
  return (
    <div className="glass scanlines col" style={{ borderRadius: 'var(--r-xl)', padding: 24, gap: 16, position: 'relative', overflow: 'hidden' }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 10 }}>
          <Icon name="volume" size={22} color={color} />
          <h3 style={{ fontSize: 18, color: '#fff' }}>เครื่องวัดเสียง</h3>
        </div>
        <button onClick={() => setOn(o => !o)} className="btn btn-ghost" style={{ padding: '7px 13px', fontSize: 12.5 }}>
          <Icon name={on ? 'pause' : 'play'} size={15} /> {on ? 'หยุด' : 'เริ่ม'}
        </button>
      </div>
      {/* level bars */}
      <div className="row" style={{ gap: 3, height: 120, alignItems: 'flex-end' }}>
        {Array.from({ length: bars }).map((_, i) => {
          const active = (i / bars) * 100 < lv;
          const h = 16 + (i / bars) * 100;
          const c = i / bars > 0.65 ? 'var(--st-absent)' : i / bars > 0.4 ? 'var(--st-late)' : 'var(--st-present)';
          return <div key={i} style={{ flex: 1, height: h + '%', borderRadius: 4, background: active ? c : 'var(--surface-2)', boxShadow: active ? `0 0 8px ${c}` : 'none', transition: 'background .1s' }} />;
        })}
      </div>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="display" style={{ fontSize: 34, color }}>{Math.round(lv)}<span style={{ fontSize: 16, color: 'var(--muted)' }}> dB</span></div>
          <div style={{ fontSize: 13, color }}>{loud ? '🔊 เสียงดังเกินไป — ช่วยกันเบาเสียงนะ' : lv > 40 ? 'ระดับเสียงพอดี' : '🤫 เงียบสงบ เยี่ยมมาก!'}</div>
        </div>
        <div className="center" style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in oklch,' + color + ' 18%,transparent)', border: '2px solid ' + color, animation: loud ? 'pulseGlow 0.6s infinite' : 'none' }}>
          <Icon name={loud ? 'bell' : 'check'} size={28} color={color} />
        </div>
      </div>
    </div>
  );
}

function ClassTimer() {
  const [secs, setSecs] = React.useState(300);
  const [left, setLeft] = React.useState(300);
  const [run, setRun] = React.useState(false);
  React.useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setLeft(l => { if (l <= 1) { clearInterval(id); setRun(false); return 0; } return l - 1; }), 1000);
    return () => clearInterval(id);
  }, [run]);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const pct = secs ? (left / secs) * 100 : 0;
  const set = (s) => { setSecs(s); setLeft(s); setRun(false); };
  const C = 2 * Math.PI * 84;
  return (
    <div className="glass col center" style={{ borderRadius: 'var(--r-xl)', padding: 24, gap: 16 }}>
      <div className="row" style={{ gap: 10, alignSelf: 'flex-start' }}><Icon name="timer" size={22} color="var(--cyan)" /><h3 style={{ fontSize: 18, color: '#fff' }}>จับเวลา</h3></div>
      <div style={{ position: 'relative', width: 200, height: 200 }}>
        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r="84" fill="none" stroke="var(--surface-2)" strokeWidth="12" />
          <circle cx="100" cy="100" r="84" fill="none" stroke="var(--cyan)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset 1s linear', filter: 'drop-shadow(0 0 6px var(--cyan))' }} />
        </svg>
        <div className="center col" style={{ position: 'absolute', inset: 0 }}>
          <div className="display tech" style={{ fontSize: 46, color: '#fff' }}>{mm}:{ss}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{run ? 'กำลังนับถอยหลัง' : left === 0 ? 'หมดเวลา!' : 'พร้อม'}</div>
        </div>
      </div>
      <div className="row" style={{ gap: 8 }}>
        {[['1:00', 60], ['3:00', 180], ['5:00', 300], ['10:00', 600]].map(([l, v]) => (
          <button key={v} onClick={() => set(v)} className="btn" style={{ padding: '7px 12px', fontSize: 12.5, background: secs === v ? 'var(--surface)' : 'var(--surface-2)', color: secs === v ? 'var(--cyan)' : 'var(--ink-soft)', boxShadow: 'none' }}>{l}</button>
        ))}
      </div>
      <div className="row" style={{ gap: 10 }}>
        <button onClick={() => setRun(r => !r)} className="btn btn-neon" style={{ padding: '11px 26px' }}><Icon name={run ? 'pause' : 'play'} size={18} color="#0a0a14" /> {run ? 'หยุด' : 'เริ่ม'}</button>
        <button onClick={() => set(secs)} className="btn btn-ghost" style={{ padding: '11px 16px' }}><Icon name="refresh" size={18} /> รีเซ็ต</button>
      </div>
    </div>
  );
}

function GroupGen() {
  const { STUDENTS } = window.GC;
  const [groups, setGroups] = React.useState(4);
  const [result, setResult] = React.useState(null);
  const gen = () => {
    const sh = [...STUDENTS].sort(() => Math.random() - 0.5);
    const out = Array.from({ length: groups }, () => []);
    sh.forEach((s, i) => out[i % groups].push(s));
    setResult(out);
  };
  return (
    <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 24, gap: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 10 }}><Icon name="shuffle" size={22} color="var(--purple)" /><h3 style={{ fontSize: 18, color: '#fff' }}>สุ่มแบ่งกลุ่ม</h3></div>
        <div className="row glass-2" style={{ borderRadius: 99, padding: 4, gap: 2 }}>
          {[2, 3, 4, 5].map(g => (
            <button key={g} onClick={() => setGroups(g)} className="center" style={{ width: 34, height: 32, borderRadius: 99, cursor: 'pointer', border: 'none',
              background: groups === g ? 'var(--purple)' : 'transparent', color: groups === g ? '#fff' : 'var(--ink-soft)', fontFamily: 'var(--font-tech)', fontSize: 14 }}>{g}</button>
          ))}
        </div>
      </div>
      {result ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
          {result.map((g, i) => (
            <div key={i} className="glass-2 col rise" style={{ borderRadius: 'var(--r-md)', padding: 12, gap: 7 }}>
              <div className="tech" style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 700 }}>กลุ่ม {i + 1}</div>
              {g.map(s => (
                <div key={s.id} className="row" style={{ gap: 8 }}><HeroAvatar student={s} size={26} /><span style={{ fontSize: 12.5, color: '#fff' }}>{s.nick}</span></div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="center col" style={{ padding: '24px 0', gap: 10, color: 'var(--muted)' }}>
          <Icon name="users" size={34} color="var(--muted)" />
          <span style={{ fontSize: 13 }}>กดสุ่มเพื่อแบ่ง {STUDENTS.length} คนเป็น {groups} กลุ่ม</span>
        </div>
      )}
      <button onClick={gen} className="btn btn-neon" style={{ justifyContent: 'center' }}><Icon name="shuffle" size={18} color="#0a0a14" /> สุ่มแบ่งกลุ่ม</button>
    </div>
  );
}

function ClassroomTools() {
  return (
    <div className="col stagger" style={{ gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <SoundMeter />
        <ClassTimer />
      </div>
      <GroupGen />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
        {[['focus', 'โหมดโฟกัส', 'ลดสิ่งรบกวน เน้นบทเรียน', 88], ['seat', 'สลับที่นั่ง', 'สุ่มผังที่นั่งใหม่', 230]].map(([ic, t, d, hue]) => (
          <div key={t} className="glass scanlines row" style={{ borderRadius: 'var(--r-lg)', padding: 18, gap: 14, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <div className="center" style={{ width: 50, height: 50, borderRadius: 14, background: `radial-gradient(circle at 40% 30%, oklch(0.7 0.18 ${hue}), oklch(0.42 0.16 ${hue}))` }}>
              <Icon name={ic} size={24} color="#fff" />
            </div>
            <div><div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{t}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{d}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBoard({ openStudent }) {
  const { STUDENTS, LIVE } = window.GC;
  const [states, setStates] = React.useState(() => Object.fromEntries(STUDENTS.map(s => [s.id, s.live])));
  const cycle = (id) => {
    const keys = Object.keys(LIVE);
    setStates(st => { const i = keys.indexOf(st[id]); return { ...st, [id]: keys[(i + 1) % keys.length] }; });
  };
  const counts = Object.keys(LIVE).map(k => [k, Object.values(states).filter(v => v === k).length]);
  return (
    <div className="col stagger" style={{ gap: 18 }}>
      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        {counts.map(([k, n]) => (
          <div key={k} className="row glass-2" style={{ gap: 9, padding: '9px 15px', borderRadius: 99 }}>
            <span className="center" style={{ width: 26, height: 26, borderRadius: 8, background: 'color-mix(in oklch,' + LIVE[k].color + ' 20%,transparent)' }}><Icon name={LIVE[k].icon} size={15} color={LIVE[k].color} /></span>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{LIVE[k].th}</span>
            <span className="display" style={{ fontSize: 15, color: '#fff' }}>{n}</span>
          </div>
        ))}
      </div>
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
        {STUDENTS.map(s => {
          const lv = LIVE[states[s.id]];
          return (
            <div key={s.id} onClick={() => cycle(s.id)} className="glass col center" style={{ borderRadius: 'var(--r-lg)', padding: 16, gap: 10, cursor: 'pointer', position: 'relative', transition: 'transform .15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ position: 'relative' }}>
                <HeroAvatar student={s} size={56} ring={lv.color} />
                <span className="center" style={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: '50%', background: lv.color, border: '2px solid #1a1430' }}>
                  <Icon name={lv.icon} size={13} color="#fff" />
                </span>
              </div>
              <div className="center col" style={{ gap: 3 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{s.nick}</div>
                <span className="pill" style={{ fontSize: 10.5, background: 'color-mix(in oklch,' + lv.color + ' 18%,transparent)', color: lv.color }}>{lv.th}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>แตะที่การ์ดเพื่อเปลี่ยนสถานะสด · อัปเดตเรียลไทม์ทั้งห้อง</p>
    </div>
  );
}

Object.assign(window, { ClassroomTools, StatusBoard, SoundMeter, ClassTimer, GroupGen });
