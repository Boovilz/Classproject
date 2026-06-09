/* ============================================================
   WORLD 2 SCREENS — Boss Battle · Pet Sanctuary · Season Hub
   Command Deck visual language (clipped panels + corner brackets).
   Rendered inside GameShell <main> (already padded + scrolling).
   ============================================================ */
const { CLIP: W2CLIP, Brackets: W2Brackets } = window;

/* shared section heading */
function DeckHead({ tag, title, sub, icon, hue = 290, right }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
      <div className="row" style={{ gap: 14 }}>
        <div className="center" style={{ width: 52, height: 52, flex: 'none', clipPath: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)',
          background: `linear-gradient(135deg, oklch(0.7 0.18 ${hue}), oklch(0.42 0.16 ${hue}))` }}>
          <Icon name={icon} size={25} color="#fff" />
        </div>
        <div>
          <div className="tech" style={{ fontSize: 11, color: `oklch(0.8 0.14 ${hue})`, letterSpacing: '.2em' }}>{tag}</div>
          <h2 style={{ fontSize: 24, color: '#fff', lineHeight: 1.05 }}>{title}</h2>
          {sub && <div className="tech" style={{ fontSize: 11.5, color: 'var(--muted)', letterSpacing: '.06em', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}

function Panel({ children, hue, pad = 18, style }) {
  return (
    <div className="scanlines" style={{ position: 'relative', padding: pad, clipPath: W2CLIP,
      background: hue ? `linear-gradient(155deg, oklch(0.3 0.1 ${hue} / .5), oklch(0.18 0.05 285 / .7))` : 'oklch(0.22 0.07 288 / .7)',
      border: `1px solid ${hue ? `oklch(0.6 0.16 ${hue} / .4)` : 'oklch(0.55 0.14 290 / .35)'}`, ...style }}>
      <W2Brackets color={hue ? `oklch(0.8 0.16 ${hue})` : 'var(--cyan)'} />
      {children}
    </div>
  );
}

/* ============================================================
   BOSS BATTLE — cooperative classroom HP event
   ============================================================ */
function BossRaid({ openStudent }) {
  const { BOSS, CLASS } = window.GC;
  const STUDENTS = useStudents();
  const [hp, setHp] = React.useState(BOSS.hp);
  const [feed, setFeed] = React.useState(BOSS.feed);
  const [hit, setHit] = React.useState(0);
  const pct = Math.round((hp / BOSS.hpMax) * 100);

  const strike = (atk) => {
    setHp(h => Math.max(0, h - atk.dmg));
    setHit(x => x + 1);
    const idx = Math.floor(Math.random() * STUDENTS.length);
    setFeed(f => [{ who: idx, dmg: atk.dmg, act: atk.th, t: 'เมื่อสักครู่' }, ...f].slice(0, 6));
  };

  // contributors ranked by real XP; scale dmg proportionally to max student XP
  const contributors = React.useMemo(() => {
    const sorted = [...STUDENTS].sort((a, b) => b.game.xp - a.game.xp).slice(0, 6);
    const maxXP = sorted[0]?.game.xp || 1;
    return sorted.map(s => ({ s, dmg: Math.max(10, Math.round((s.game.xp / maxXP) * 320)) }));
  }, [STUDENTS]);

  return (
    <div className="col stagger" style={{ gap: 18 }}>
      <DeckHead tag="CO-OP RAID // LIVE" title={BOSS.name} sub={`${BOSS.en} · ${BOSS.element}`} icon="fire" hue={22}
        right={<div className="row" style={{ gap: 10 }}>
          <span className="pill tech" style={{ background: 'oklch(0.6 0.2 25 / .25)', color: 'oklch(0.85 0.14 35)', fontSize: 12 }}>
            <span className="dot" style={{ background: 'oklch(0.78 0.2 30)', boxShadow: '0 0 8px oklch(0.78 0.2 30)' }} /> กำลังต่อสู้
          </span>
          <span className="pill tech" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--ink-soft)', fontSize: 12 }}>จบใน {BOSS.ends}</span>
        </div>} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, alignItems: 'start' }}>
        {/* arena */}
        <Panel hue={22} pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ position: 'relative', padding: '28px 26px 24px', minHeight: 420 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 55% at 50% 38%, oklch(0.55 0.22 28 / .35), transparent 70%)' }} />
            {/* boss creature */}
            <div className="center" style={{ position: 'relative', padding: '14px 0 24px' }}>
              <div className={hit ? 'pop' : ''} key={hit} style={{ position: 'relative', width: 220, height: 200 }}>
                <div style={{ position: 'absolute', inset: '50% 50% auto', transform: 'translate(-50%,-30%)', left: '50%', top: '50%', width: 200, height: 26, borderRadius: '50%', background: 'oklch(0.45 0.2 25 / .5)', filter: 'blur(14px)' }} />
                <div className="center float" style={{ width: 200, height: 188, borderRadius: '48% 48% 44% 44%', position: 'relative', margin: '0 auto',
                  background: 'radial-gradient(circle at 44% 30%, oklch(0.66 0.22 32), oklch(0.34 0.18 22))',
                  boxShadow: '0 0 70px -6px oklch(0.6 0.24 28), inset 0 0 50px oklch(0.25 0.14 18)' }}>
                  {/* horns */}
                  <div style={{ position: 'absolute', top: -22, left: 36, width: 26, height: 46, background: 'linear-gradient(oklch(0.8 0.12 60),oklch(0.5 0.16 30))', clipPath: 'polygon(50% 0,100% 100%,0 100%)', transform: 'rotate(-16deg)' }} />
                  <div style={{ position: 'absolute', top: -22, right: 36, width: 26, height: 46, background: 'linear-gradient(oklch(0.8 0.12 60),oklch(0.5 0.16 30))', clipPath: 'polygon(50% 0,100% 100%,0 100%)', transform: 'rotate(16deg)' }} />
                  {/* eyes */}
                  <div className="row" style={{ gap: 30, position: 'absolute', top: 66 }}>
                    {[0, 1].map(i => <div key={i} className="center" style={{ width: 34, height: 26, borderRadius: '50%', background: '#1a0c08', transform: 'skewX(' + (i ? -12 : 12) + 'deg)' }}>
                      <div style={{ width: 14, height: 16, borderRadius: '50%', background: 'oklch(0.9 0.2 95)', boxShadow: '0 0 12px oklch(0.85 0.2 90)' }} /></div>)}
                  </div>
                  {/* mouth */}
                  <div className="center" style={{ position: 'absolute', bottom: 38, width: 72, height: 30, borderRadius: '0 0 40px 40px', background: '#160a06', overflow: 'hidden' }}>
                    <div className="row" style={{ gap: 4, marginTop: -3 }}>
                      {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ width: 8, height: 12, background: '#fff', clipPath: 'polygon(50% 100%,0 0,100% 0)' }} />)}
                    </div>
                  </div>
                </div>
                {/* damage burst */}
                {hit > 0 && <div key={'b' + hit} className="tech" style={{ position: 'absolute', top: 30, right: 6, color: 'oklch(0.9 0.2 95)', fontSize: 26, textShadow: '0 2px 8px #000', animation: 'floatUp 1s ease-out forwards' }}>−{feed[0]?.dmg}</div>}
              </div>
            </div>

            {/* HP */}
            <div style={{ position: 'relative' }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="tech" style={{ fontSize: 13, color: 'oklch(0.86 0.12 30)', letterSpacing: '.12em' }}>BOSS HP</span>
                <span className="tech" style={{ fontSize: 15, color: '#fff' }}>{hp.toLocaleString()} <span style={{ color: 'var(--muted)', fontSize: 12 }}>/ {BOSS.hpMax.toLocaleString()}</span></span>
              </div>
              <div style={{ height: 22, borderRadius: 4, background: 'oklch(0.2 0.04 20 / .8)', overflow: 'hidden', border: '1px solid oklch(0.5 0.14 25 / .5)', position: 'relative' }}>
                <div style={{ width: pct + '%', height: '100%', background: 'linear-gradient(90deg, oklch(0.55 0.24 22), oklch(0.72 0.2 42))', boxShadow: '0 0 18px oklch(0.65 0.22 30)', transition: 'width .4s ease' }} />
                <div className="center tech" style={{ position: 'absolute', inset: 0, fontSize: 12, color: '#fff', textShadow: '0 1px 3px #000' }}>{pct}%</div>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
                <span className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.06em' }}>ทั้งห้องช่วยกันลด HP · {STUDENTS.length} นักรบ</span>
                {hp === 0 && <span className="pill tech" style={{ background: 'color-mix(in oklch,var(--st-present) 25%,transparent)', color: 'var(--st-present)', fontSize: 12 }}>ปราบบอสสำเร็จ! 🎉</span>}
              </div>
            </div>
          </div>
        </Panel>

        {/* right column: attacks + rewards */}
        <div className="col" style={{ gap: 16 }}>
          <Panel>
            <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 12 }}>// วิธีโจมตี (แตะเพื่อจำลอง)</div>
            <div className="col" style={{ gap: 9 }}>
              {BOSS.attacks.map((a, i) => (
                <button key={i} onClick={() => strike(a)} className="row" style={{ gap: 12, padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
                  background: 'oklch(0.16 0.04 285 / .6)', border: '1px solid oklch(0.5 0.1 285 / .3)', clipPath: W2CLIP, transition: 'transform .12s' }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(.97)'} onMouseUp={e => e.currentTarget.style.transform = 'none'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  <div className="center" style={{ width: 36, height: 36, borderRadius: 10, flex: 'none', background: 'oklch(0.4 0.16 25 / .4)' }}><Icon name={a.icon} size={18} color="oklch(0.82 0.16 35)" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}><div className="nowrap" style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{a.th}</div></div>
                  <span className="tech" style={{ fontSize: 14, color: 'oklch(0.85 0.18 40)' }}>−{a.dmg}</span>
                </button>
              ))}
            </div>
          </Panel>
          <Panel hue={88}>
            <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 12 }}>// รางวัลเมื่อปราบสำเร็จ</div>
            <div className="col" style={{ gap: 9 }}>
              {BOSS.rewards.map((r, i) => (
                <div key={i} className="row" style={{ gap: 12 }}>
                  <div className="center" style={{ width: 34, height: 34, borderRadius: 10, flex: 'none', background: `oklch(0.4 0.16 ${r.hue} / .4)` }}><Icon name={r.icon} size={17} color={`oklch(0.82 0.16 ${r.hue})`} /></div>
                  <span style={{ fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{r.th}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* bottom: live feed + contributors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Panel>
          <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 12 }}>// ฟีดการโจมตีสด</div>
          <div className="col" style={{ gap: 8 }}>
            {feed.map((f, i) => {
              const s = STUDENTS[f.who];
              return (
                <div key={i} className="row" style={{ gap: 11, opacity: i === 0 ? 1 : 0.85 - i * 0.08 }}>
                  <HeroAvatar student={s} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="nowrap" style={{ fontSize: 12.5, color: '#fff' }}><b>{s.nick}</b> <span style={{ color: 'var(--muted)' }}>{f.act}</span></div>
                    <div className="tech" style={{ fontSize: 10, color: 'var(--muted)' }}>{f.t}</div>
                  </div>
                  <span className="tech" style={{ fontSize: 13, color: 'oklch(0.85 0.18 40)' }}>−{f.dmg}</span>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel hue={50}>
          <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 12 }}>// นักรบสร้างดาเมจสูงสุด</div>
          <div className="col" style={{ gap: 9 }}>
            {contributors.map((c, i) => (
              <button key={c.s.id} onClick={() => openStudent && openStudent(c.s.id)} className="row" style={{ gap: 11, alignItems: 'center', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left', padding: 0 }}>
                <span className="center tech" style={{ width: 22, flex: 'none', fontSize: 13, fontWeight: 700, color: i < 3 ? 'var(--gold)' : 'var(--muted)' }}>{i + 1}</span>
                <HeroAvatar student={c.s} size={34} />
                <span style={{ flex: 1, fontSize: 13, color: '#fff', fontWeight: 600 }}>{c.s.nick}</span>
                <div style={{ flex: 1, maxWidth: 110 }}><Bar value={c.dmg} max={320} color="linear-gradient(90deg,var(--gold),oklch(0.75 0.16 40))" height={7} /></div>
                <span className="tech" style={{ fontSize: 12, color: 'var(--gold)', width: 42, textAlign: 'right' }}>{c.dmg}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================
   PET SANCTUARY — class mascot raised cooperatively
   ============================================================ */
function PetSanctuary() {
  const { PET, CLASS } = window.GC;
  const STUDENTS = useStudents();
  const [xp, setXp] = React.useState(PET.xp);
  const [fed, setFed] = React.useState(PET.fedToday);
  const [bounce, setBounce] = React.useState(0);
  const [mood, setMood] = React.useState(PET.mood);
  const feed = (amt) => { setBounce(b => b + 1); setFed(f => Math.min(STUDENTS.length, f + 1)); setXp(x => Math.min(PET.xpMax, x + amt)); setMood('ร่าเริงมาก'); };

  const stageDefs = [
    { th: 'ไข่มังกร', lv: [1, 3], icon: 'drop' },
    { th: 'วัยเด็ก',  lv: [4, 8], icon: 'fire' },
    { th: 'วัยรุ่น',  lv: [9, 15], icon: 'bolt' },
    { th: 'มังกรโบราณ', lv: [16, 99], icon: 'crown' },
  ];
  const stages = stageDefs.map(st => ({
    ...st,
    lvLabel: st.lv[1] === 99 ? `${st.lv[0]}+` : `${st.lv[0]}-${st.lv[1]}`,
    done: PET.level > st.lv[1],
    cur: PET.level >= st.lv[0] && PET.level <= st.lv[1],
  }));
  const foods = [
    { th: 'ผลเบอร์รี XP', amt: 12, cost: '+1 ตอบถูก', icon: 'spark', hue: 200 },
    { th: 'ขนมปังพลัง', amt: 30, cost: 'ส่งการบ้าน', icon: 'report', hue: 88 },
    { th: 'คริสตัลทอง', amt: 80, cost: 'ชนะมินิเกม', icon: 'coin', hue: 50 },
  ];
  const feeders = [...STUDENTS].sort((a, b) => b.game.stars - a.game.stars).slice(0, 5);

  return (
    <div className="col stagger" style={{ gap: 18 }}>
      <DeckHead tag="CLASS UNIT // SANCTUARY" title="ฟาร์มสัตว์เลี้ยงประจำห้อง" sub="ทั้งห้องช่วยกันเลี้ยงให้เติบโต — ร่วมมือ ไม่ใช่แข่งขัน" icon="heart" hue={150} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18, alignItems: 'start' }}>
        {/* habitat */}
        <Panel hue={262} pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ position: 'relative', padding: '28px 26px', minHeight: 380 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(58% 52% at 50% 38%, oklch(0.4 0.14 280 / .55), transparent 72%)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: 'linear-gradient(oklch(0.18 0.05 285 / 0), oklch(0.16 0.05 285 / .6))' }} />
            <div className="center col" style={{ position: 'relative', gap: 16 }}>
              <div key={bounce} className="pop center" style={{ position: 'relative', width: 200, height: 190 }}>
                {/* contrasting backdrop disc so the green mascot reads as a centerpiece */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-54%)', width: 188, height: 188, borderRadius: '50%',
                  background: 'radial-gradient(circle, oklch(0.7 0.14 285 / .35), oklch(0.5 0.12 285 / .12) 60%, transparent 72%)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-54%)', width: 196, height: 196, borderRadius: '50%', border: '1px dashed oklch(0.7 0.12 285 / .35)', animation: 'spinSlow 30s linear infinite' }} />
                <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: 120, height: 20, borderRadius: '50%', background: `oklch(0.45 0.16 ${PET.hue} / .5)`, filter: 'blur(10px)' }} />
                <div className="float center" style={{ width: 170, height: 162, borderRadius: '50% 50% 46% 46%', position: 'relative',
                  background: `radial-gradient(circle at 42% 30%, oklch(0.84 0.17 ${PET.hue}), oklch(0.46 0.16 ${PET.hue}))`, boxShadow: `0 18px 44px -10px oklch(0.6 0.2 ${PET.hue}), inset 0 0 30px rgba(255,255,255,.2)` }}>
                  <div style={{ position: 'absolute', top: -14, left: 42, width: 18, height: 26, background: 'oklch(0.9 0.08 88)', clipPath: 'polygon(50% 0,100% 100%,0 100%)' }} />
                  <div style={{ position: 'absolute', top: -14, right: 42, width: 18, height: 26, background: 'oklch(0.9 0.08 88)', clipPath: 'polygon(50% 0,100% 100%,0 100%)' }} />
                  <div className="row" style={{ gap: 28, position: 'absolute', top: 56 }}>
                    {[0, 1].map(i => <div key={i} className="center" style={{ width: 30, height: 34, borderRadius: '50%', background: '#fff' }}><div style={{ width: 14, height: 17, borderRadius: '50%', background: '#1a1030' }} /></div>)}
                  </div>
                  <div style={{ position: 'absolute', bottom: 44, left: 30, width: 16, height: 10, borderRadius: 99, background: 'oklch(0.7 0.18 20)', opacity: .6 }} />
                  <div style={{ position: 'absolute', bottom: 44, right: 30, width: 16, height: 10, borderRadius: 99, background: 'oklch(0.7 0.18 20)', opacity: .6 }} />
                  <div style={{ position: 'absolute', bottom: 34, left: '50%', transform: 'translateX(-50%)', width: 34, height: 16, borderRadius: '0 0 34px 34px', background: '#1a1030' }} />
                </div>
              </div>
              <div className="center col" style={{ gap: 5 }}>
                <div className="display" style={{ fontSize: 22, color: '#fff' }}>{PET.name}</div>
                <div className="row" style={{ gap: 8 }}>
                  <span className="pill tech" style={{ background: 'color-mix(in oklch,var(--gold) 18%,transparent)', color: 'var(--gold)', fontSize: 11 }}>Lv.{PET.level}</span>
                  <span className="pill tech" style={{ background: 'color-mix(in oklch,var(--cyan) 16%,transparent)', color: 'var(--cyan)', fontSize: 11 }}>{PET.species} · {PET.stage}</span>
                  <span className="pill tech" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--ink-soft)', fontSize: 11 }}>อารมณ์: {mood}</span>
                </div>
              </div>
              <div style={{ width: '100%', maxWidth: 360 }}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em' }}>GROWTH</span>
                  <span className="tech" style={{ fontSize: 12, color: 'var(--cyan)' }}>{xp} / {PET.xpMax}</span>
                </div>
                <Bar value={xp} max={PET.xpMax} color={`oklch(0.78 0.17 ${PET.hue})`} height={12} glow />
                <div className="tech" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 6, textAlign: 'center', letterSpacing: '.06em' }}>วันนี้ทั้งห้องให้อาหารแล้ว {fed}/{STUDENTS.length} คน</div>
              </div>
            </div>
          </div>
        </Panel>

        {/* feeding + evolution */}
        <div className="col" style={{ gap: 16 }}>
          <Panel>
            <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 12 }}>// ให้อาหาร (ได้จากพฤติกรรมดี)</div>
            <div className="col" style={{ gap: 9 }}>
              {foods.map((f, i) => (
                <button key={i} onClick={() => feed(f.amt)} className="row" style={{ gap: 12, padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
                  background: 'oklch(0.16 0.04 285 / .6)', border: '1px solid oklch(0.5 0.1 285 / .3)', clipPath: W2CLIP }}>
                  <div className="center" style={{ width: 36, height: 36, borderRadius: 10, flex: 'none', background: `oklch(0.4 0.16 ${f.hue} / .4)` }}><Icon name={f.icon} size={18} color={`oklch(0.82 0.16 ${f.hue})`} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="nowrap" style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{f.th}</div>
                    <div className="tech" style={{ fontSize: 10, color: 'var(--muted)' }}>{f.cost}</div>
                  </div>
                  <span className="tech" style={{ fontSize: 13, color: 'var(--cyan)' }}>+{f.amt}</span>
                </button>
              ))}
            </div>
          </Panel>
          <Panel hue={50}>
            <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 12 }}>// สายวิวัฒนาการ</div>
            <div className="row" style={{ gap: 8 }}>
              {stages.map((st, i) => (
                <div key={i} className="center col" style={{ flex: 1, gap: 7, padding: '12px 4px', clipPath: W2CLIP, position: 'relative',
                  background: st.cur ? 'linear-gradient(160deg, oklch(0.4 0.14 150 / .8), oklch(0.24 0.08 150 / .6))' : 'oklch(0.16 0.04 285 / .6)',
                  border: `1px solid ${st.cur ? 'oklch(0.7 0.18 150)' : 'oklch(0.5 0.1 285 / .25)'}`, opacity: st.done || st.cur ? 1 : 0.5 }}>
                  <div className="center" style={{ width: 38, height: 38, borderRadius: '50%', background: st.cur ? `oklch(0.6 0.18 150)` : 'oklch(0.3 0.06 285)' }}><Icon name={st.icon} size={18} color="#fff" /></div>
                  <div className="display" style={{ fontSize: 12, color: '#fff', textAlign: 'center' }}>{st.th}</div>
                  <div className="tech" style={{ fontSize: 9.5, color: 'var(--muted)' }}>Lv.{st.lvLabel}</div>
                  {st.cur && <span className="tech" style={{ position: 'absolute', top: 4, right: 6, fontSize: 8, color: 'oklch(0.85 0.16 150)' }}>NOW</span>}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* top feeders */}
      <Panel hue={350}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em' }}>// ผู้ดูแลใจดีประจำห้อง</span>
          <span className="tech" style={{ fontSize: 11, color: 'var(--muted)' }}>ให้อาหารบ่อยที่สุดสัปดาห์นี้</span>
        </div>
        <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
          {feeders.map((s, i) => (
            <div key={s.id} className="center col" style={{ gap: 6, width: 84 }}>
              <div style={{ position: 'relative' }}>
                <HeroAvatar student={s} size={56} ring={i === 0 ? 'var(--gold)' : undefined} glow={i === 0} />
                {i === 0 && <span className="center" style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: '50%', background: 'var(--gold)' }}><Icon name="crown" size={13} color="#3a2800" /></span>}
              </div>
              <div className="display" style={{ fontSize: 12.5, color: '#fff' }}>{s.nick}</div>
              <span className="row tech" style={{ gap: 3, fontSize: 11, color: 'var(--st-rose, oklch(0.7 0.16 350))' }}><Icon name="star" size={11} color="oklch(0.82 0.18 50)" /> {s.game.stars}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ============================================================
   SEASON HUB — progression track + season list
   ============================================================ */
function SeasonHub({ go }) {
  const { SEASON, SEASONS, SEASON_TRACK, QUESTS } = window.GC;
  const [totals, setTotals] = React.useState(() => window.GC.getClassTotals());
  React.useEffect(() => {
    const h = () => setTotals(window.GC.getClassTotals());
    window.addEventListener('gc:students-changed', h);
    return () => window.removeEventListener('gc:students-changed', h);
  }, []);
  const liveXP = totals.classXP;
  const pct = Math.round((liveXP / SEASON.goal) * 100);

  return (
    <div className="col stagger" style={{ gap: 18 }}>
      <DeckHead tag={`SEASON ${SEASON.no} // ACTIVE`} title={SEASON.th} sub={`${SEASON.en} · วันที่ ${SEASON.day}/${SEASON.days}`} icon={SEASON.icon} hue={SEASON.hue}
        right={<span className="pill tech" style={{ background: `oklch(0.5 0.16 ${SEASON.hue} / .3)`, color: `oklch(0.85 0.14 ${SEASON.hue})`, fontSize: 13 }}>{pct}% สู่เป้าหมาย</span>} />

      {/* progression track */}
      <Panel hue={SEASON.hue} pad={24}>
        <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 18 }}>// เส้นทางความก้าวหน้าของฤดูกาล</div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${SEASON_TRACK.length},1fr)`, gap: 0 }}>
          {/* baseline */}
          <div style={{ position: 'absolute', left: '8%', right: '8%', top: 19, height: 4, borderRadius: 99, background: 'oklch(0.3 0.05 285)' }} />
          <div style={{ position: 'absolute', left: '8%', top: 19, height: 4, borderRadius: 99, width: `${Math.min(84, (pct / 100) * 84)}%`, background: `linear-gradient(90deg, oklch(0.7 0.18 ${SEASON.hue}), var(--gold))`, boxShadow: `0 0 12px oklch(0.7 0.18 ${SEASON.hue})` }} />
          {SEASON_TRACK.map((m, i) => {
            const reached = liveXP >= m.at;
            return (
              <div key={i} className="center col" style={{ gap: 8, position: 'relative', zIndex: 1 }}>
                <div className="center" style={{ width: 42, height: 42, borderRadius: '50%', flex: 'none',
                  background: reached ? `radial-gradient(circle at 40% 30%, oklch(0.78 0.18 ${SEASON.hue}), oklch(0.46 0.16 ${SEASON.hue}))` : 'oklch(0.22 0.05 285)',
                  border: reached ? '2px solid var(--gold)' : '2px solid oklch(0.4 0.08 285)',
                  boxShadow: reached ? `0 0 18px oklch(0.7 0.18 ${SEASON.hue} / .7)` : 'none' }}>
                  <Icon name={m.icon} size={19} color={reached ? '#fff' : 'var(--muted)'} />
                </div>
                <div className="center col" style={{ gap: 2, padding: '0 4px' }}>
                  <div className="display" style={{ fontSize: 12, color: reached ? '#fff' : 'var(--muted)', textAlign: 'center', lineHeight: 1.15 }}>{m.th}</div>
                  <div className="tech" style={{ fontSize: 9, color: 'var(--muted)' }}>{(m.at / 1000)}k XP</div>
                  <div className="tech" style={{ fontSize: 9.5, color: reached ? `oklch(0.82 0.14 ${SEASON.hue})` : 'oklch(0.5 0.04 285)', textAlign: 'center' }}>{m.reward}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 18, alignItems: 'start' }}>
        {/* season quests */}
        <Panel>
          <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 12 }}>// ภารกิจประจำฤดูกาล</div>
          <div className="col" style={{ gap: 10 }}>
            {QUESTS.season.map(q => {
              const liveCur = q.id === 's1'
                ? Math.round(totals.classXP / 500)
                : q.id === 's3'
                  ? Math.min(q.max, (window.GC.STUDENTS || []).filter(s => s.game.level >= 5).length)
                  : q.cur;
              const done = liveCur >= q.max;
              return (
                <div key={q.id} className="row" style={{ gap: 12, padding: '11px 12px', clipPath: W2CLIP,
                  background: done ? 'color-mix(in oklch,var(--st-present) 14%,transparent)' : 'oklch(0.16 0.04 285 / .6)', border: `1px solid ${done ? 'color-mix(in oklch,var(--st-present) 35%,transparent)' : 'oklch(0.5 0.1 285 / .25)'}` }}>
                  <div className="center" style={{ width: 36, height: 36, borderRadius: 10, flex: 'none', background: done ? 'var(--st-present)' : 'oklch(0.4 0.14 290 / .5)' }}>
                    <Icon name={done ? 'check' : q.icon} size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, color: '#fff', fontWeight: 600 }}>{q.th}</div>
                    <div style={{ marginTop: 5 }}><Bar value={liveCur} max={q.max} color={`oklch(0.7 0.16 ${SEASON.hue})`} height={6} /></div>
                  </div>
                  <span className="pill tech" style={{ fontSize: 10.5, background: 'color-mix(in oklch,var(--gold) 16%,transparent)', color: 'var(--gold)', flex: 'none' }}>
                    <Icon name={rewardIcon(q.reward)} size={12} color="var(--gold)" /> {rewardLabel(q.reward)}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* season roster */}
        <Panel hue={SEASON.hue}>
          <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 12 }}>// ปฏิทินฤดูกาล</div>
          <div className="col" style={{ gap: 10 }}>
            {SEASONS.map(s => {
              const active = s.state === 'active';
              return (
                <div key={s.no} className="row" style={{ gap: 14, padding: '12px 14px', clipPath: W2CLIP, position: 'relative',
                  background: active ? `linear-gradient(120deg, oklch(0.4 0.16 ${s.hue} / .6), oklch(0.22 0.07 285 / .6))` : 'oklch(0.16 0.04 285 / .55)',
                  border: `1px solid ${active ? `oklch(0.7 0.18 ${s.hue})` : 'oklch(0.45 0.08 285 / .3)'}`, opacity: active ? 1 : 0.62 }}>
                  <div className="center" style={{ width: 46, height: 46, flex: 'none', clipPath: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)',
                    background: `linear-gradient(135deg, oklch(0.7 0.18 ${s.hue}), oklch(0.42 0.16 ${s.hue}))` }}>
                    <Icon name={active ? s.icon : 'lock'} size={22} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ gap: 8, marginBottom: 2 }}>
                      <span className="tech" style={{ fontSize: 10.5, color: `oklch(0.82 0.14 ${s.hue})`, letterSpacing: '.12em' }}>SEASON {s.no}</span>
                      {active && <span className="pill tech" style={{ fontSize: 9, padding: '1px 7px', background: 'color-mix(in oklch,var(--st-present) 22%,transparent)', color: 'var(--st-present)' }}>กำลังเล่น</span>}
                    </div>
                    <div className="display" style={{ fontSize: 15, color: '#fff' }}>{s.th}</div>
                    <div className="tech" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '.04em' }}>{s.en}</div>
                  </div>
                  {!active && <span className="tech" style={{ fontSize: 10, color: 'var(--muted)', flex: 'none' }}>เร็วๆ นี้</span>}
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { BossRaid, PetSanctuary, SeasonHub });
