/* ============================================================
   CLASSROOM KINGDOM — Command Deck hub (Direction B, live)
   A Valorant/Discord-style game-client HUD: clipped panels with
   corner brackets, a segmented season-power gauge, a SELECT
   DESTINATION zone grid, and an OPS rail (Class Core · Boss Alert ·
   Class Unit). `go(route)` navigates; routes resolve in shell.jsx.
   ============================================================ */

/* angular panel clip + corner brackets — the Command Deck signature */
const CLIP = 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)';
function Brackets({ color = 'var(--cyan)' }) {
  const c = { position: 'absolute', width: 13, height: 13, borderColor: color, opacity: .85, pointerEvents: 'none' };
  return (
    <>
      <span style={{ ...c, top: 6, left: 6, borderTop: '2px solid', borderLeft: '2px solid' }} />
      <span style={{ ...c, top: 6, right: 6, borderTop: '2px solid', borderRight: '2px solid' }} />
      <span style={{ ...c, bottom: 6, left: 6, borderBottom: '2px solid', borderLeft: '2px solid' }} />
      <span style={{ ...c, bottom: 6, right: 6, borderBottom: '2px solid', borderRight: '2px solid' }} />
    </>
  );
}
const rewardLabel = (r) => r.xp ? `+${r.xp} XP` : r.star ? `+${r.star} ดาว` : r.coin ? `+${r.coin} เหรียญ` : r.badge;
const rewardIcon = (r) => r.xp ? 'bolt' : r.star ? 'star' : r.coin ? 'coin' : 'trophy';

/* ---- Mission-briefing season bar with segmented power gauge ---- */
function MissionBar({ go }) {
  const { SEASON } = window.GC;
  const pct = Math.round((SEASON.xp / SEASON.goal) * 100);
  const segs = 30, filled = Math.round((pct / 100) * segs);
  return (
    <button onClick={() => go('season')} className="scanlines" style={{ position: 'relative', padding: '18px 26px', flex: 'none', clipPath: CLIP,
      textAlign: 'left', cursor: 'pointer', width: '100%',
      background: 'linear-gradient(100deg, oklch(0.24 0.08 290 / .92), oklch(0.18 0.06 280 / .72))', border: '1px solid oklch(0.6 0.16 290 / .4)' }}>
      <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(var(--cyan),var(--purple))' }} />
      <div className="row" style={{ gap: 22, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 16 }}>
          <div className="center" style={{ width: 56, height: 56, flex: 'none', clipPath: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)',
            background: `linear-gradient(135deg, oklch(0.7 0.18 ${SEASON.hue}), oklch(0.45 0.16 ${SEASON.hue}))` }}>
            <Icon name={SEASON.icon} size={26} color="#fff" />
          </div>
          <div>
            <div className="row" style={{ gap: 8, marginBottom: 4, flexWrap: 'nowrap' }}>
              <span className="tech" style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: '.2em', whiteSpace: 'nowrap' }}>ACTIVE SEASON // S{SEASON.no}</span>
              <span className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', whiteSpace: 'nowrap' }}>DAY {SEASON.day}/{SEASON.days}</span>
            </div>
            <h2 style={{ fontSize: 22, color: '#fff', lineHeight: 1.05 }}>{SEASON.th}</h2>
          </div>
        </div>
        <div style={{ minWidth: 300, flex: 1, maxWidth: 440, alignSelf: 'center' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.14em' }}>SEASON POWER</span>
            <span className="tech" style={{ fontSize: 12.5, color: 'var(--cyan)' }}>{SEASON.xp.toLocaleString()} / {SEASON.goal.toLocaleString()}</span>
          </div>
          <div className="row" style={{ gap: 3 }}>
            {Array.from({ length: segs }).map((_, i) => (
              <span key={i} style={{ flex: 1, height: 12, borderRadius: 1,
                background: i < filled ? (i > segs - 5 ? 'var(--gold)' : 'linear-gradient(var(--cyan),var(--purple))') : 'oklch(0.4 0.06 280 / .4)',
                boxShadow: i < filled ? '0 0 8px oklch(0.7 0.18 260 / .6)' : 'none' }} />
            ))}
          </div>
          <div className="tech" style={{ fontSize: 10.5, color: 'var(--gold)', marginTop: 6, textAlign: 'right', letterSpacing: '.1em' }}>{pct}% TO GOAL · ดูเส้นทางฤดูกาล →</div>
        </div>
      </div>
    </button>
  );
}

/* ---- SELECT DESTINATION grid ---- */
function ZoneGrid({ go }) {
  const { KINGDOM_ZONES } = window.GC;
  const zones = KINGDOM_ZONES.filter(z => z.key !== 'castle');
  const [hover, setHover] = React.useState(null);
  return (
    <div className="col" style={{ gap: 14, minHeight: 0 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="tech" style={{ fontSize: 13, color: '#fff', letterSpacing: '.16em' }}>// SELECT DESTINATION</span>
        <span className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em' }}>{zones.length} ZONES ONLINE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gridAutoRows: '1fr', gap: 12, flex: 1, minHeight: 0 }}>
        {zones.map(z => {
          const on = hover === z.key;
          return (
            <button key={z.key} onClick={() => z.route && go(z.route)} onMouseEnter={() => setHover(z.key)} onMouseLeave={() => setHover(null)}
              className="center col scanlines" style={{ position: 'relative', clipPath: CLIP, cursor: 'pointer', gap: 10, padding: 14, minHeight: 150,
                background: on ? `linear-gradient(160deg, oklch(0.42 0.16 ${z.hue} / .9), oklch(0.24 0.1 ${z.hue} / .7))` : 'oklch(0.22 0.06 285 / .55)',
                border: `1px solid ${on ? `oklch(0.7 0.2 ${z.hue})` : 'oklch(0.55 0.12 285 / .3)'}`,
                boxShadow: on ? `0 0 30px -4px oklch(0.6 0.2 ${z.hue} / .7)` : 'none', transform: on ? 'translateY(-3px)' : 'none', transition: 'all .2s' }}>
              <Brackets color={on ? `oklch(0.85 0.16 ${z.hue})` : 'oklch(0.6 0.1 285 / .5)'} />
              <div className="center" style={{ width: 56, height: 56, borderRadius: 14, flex: 'none',
                background: `radial-gradient(circle at 40% 30%, oklch(0.74 0.18 ${z.hue}), oklch(0.4 0.16 ${z.hue}))`,
                boxShadow: `0 8px 22px -6px oklch(0.5 0.18 ${z.hue})` }}>
                <Icon name={z.icon} size={28} color="#fff" />
              </div>
              <div className="center col" style={{ gap: 4 }}>
                <div className="display" style={{ fontSize: 14, color: '#fff', lineHeight: 1.3, textAlign: 'center' }}>{z.th}</div>
                <div className="tech" style={{ fontSize: 9.5, color: on ? `oklch(0.85 0.14 ${z.hue})` : 'var(--muted)', letterSpacing: '.08em', lineHeight: 1.2 }}>{z.sub.toUpperCase()}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Class core readout ---- */
function ClassCore() {
  const { CLASS_XP, CLASS_LEVEL, STUDENTS } = window.GC;
  return (
    <div className="scanlines" style={{ position: 'relative', padding: 18, clipPath: CLIP, background: 'oklch(0.22 0.07 288 / .7)', border: '1px solid oklch(0.55 0.14 290 / .35)' }}>
      <Brackets />
      <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em', marginBottom: 10 }}>CLASS CORE</div>
      <div className="row" style={{ gap: 14 }}>
        <div className="center" style={{ width: 60, height: 60, flex: 'none', borderRadius: '50%', position: 'relative',
          background: 'conic-gradient(var(--cyan), var(--purple), var(--gold), var(--cyan))', padding: 3 }}>
          <div className="center col" style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'oklch(0.16 0.05 285)' }}>
            <Icon name="crown" size={22} color="var(--gold)" />
          </div>
        </div>
        <div>
          <div className="display" style={{ fontSize: 26, color: '#fff' }}>Lv.{CLASS_LEVEL}</div>
          <div className="tech" style={{ fontSize: 12, color: 'var(--cyan)' }}>{CLASS_XP.toLocaleString()} XP</div>
        </div>
      </div>
      <div className="row" style={{ gap: 8, marginTop: 14 }}>
        {[['users', STUDENTS.length, 'UNITS'], ['trophy', 38, 'MEDALS'], ['fire', 12, 'STREAK']].map(([ic, v, l]) => (
          <div key={l} className="center col" style={{ flex: 1, padding: '8px 2px', background: 'oklch(0.16 0.04 285 / .6)', gap: 2, border: '1px solid oklch(0.5 0.1 285 / .25)' }}>
            <Icon name={ic} size={15} color="var(--cyan)" />
            <div className="tech" style={{ fontSize: 15, color: '#fff' }}>{v}</div>
            <div className="tech" style={{ fontSize: 8.5, color: 'var(--muted)', letterSpacing: '.08em' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Boss alert (live HP) -> boss screen ---- */
function BossAlert({ go }) {
  const { BOSS } = window.GC;
  const pct = Math.round((BOSS.hp / BOSS.hpMax) * 100);
  return (
    <div className="scanlines" style={{ position: 'relative', padding: 16, clipPath: CLIP, overflow: 'hidden',
      background: 'linear-gradient(150deg, oklch(0.4 0.18 25 / .55), oklch(0.2 0.08 20 / .6))', border: '1px solid oklch(0.62 0.2 25 / .5)' }}>
      <Brackets color="oklch(0.7 0.2 25)" />
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="tech" style={{ fontSize: 11, color: 'oklch(0.8 0.16 30)', letterSpacing: '.16em', whiteSpace: 'nowrap' }}>⚠ BOSS INCOMING</span>
        <span className="pill tech" style={{ fontSize: 10, background: 'oklch(0.6 0.2 25 / .3)', color: 'oklch(0.85 0.14 35)' }}>
          <span className="dot" style={{ background: 'oklch(0.78 0.2 30)', boxShadow: '0 0 8px oklch(0.78 0.2 30)' }} /> LIVE
        </span>
      </div>
      <div className="display" style={{ fontSize: 18, color: '#fff', marginBottom: 6 }}>{BOSS.name}</div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
        <span className="tech" style={{ fontSize: 10.5, color: 'oklch(0.85 0.1 30)' }}>HP</span>
        <span className="tech" style={{ fontSize: 11.5, color: '#fff' }}>{BOSS.hp.toLocaleString()} / {BOSS.hpMax.toLocaleString()}</span>
      </div>
      <Bar value={BOSS.hp} max={BOSS.hpMax} color="linear-gradient(90deg,oklch(0.7 0.22 25),oklch(0.78 0.18 45))" height={10} glow />
      <button onClick={() => go('boss')} className="btn" style={{ marginTop: 12, width: '100%', justifyContent: 'center', padding: '9px', fontSize: 13, cursor: 'pointer',
        background: 'linear-gradient(120deg, oklch(0.65 0.22 25), oklch(0.7 0.2 40))', color: '#fff', border: 'none' }}>เข้าร่วมสู้บอส <Icon name="shield" size={15} color="#fff" /></button>
    </div>
  );
}

/* ---- Class unit (pet) — interactive feed, -> pet screen ---- */
function ClassUnit({ go }) {
  const { PET, CLASS } = window.GC;
  const [fed, setFed] = React.useState(PET.fedToday);
  const [xp, setXp] = React.useState(PET.xp);
  const [bounce, setBounce] = React.useState(0);
  const feed = (e) => { e.stopPropagation(); setBounce(b => b + 1); setFed(f => Math.min(CLASS.total, f + 1)); setXp(x => Math.min(PET.xpMax, x + 12)); };
  return (
    <div className="scanlines" style={{ position: 'relative', padding: 16, clipPath: CLIP, flex: 1, minHeight: 0,
      background: 'oklch(0.22 0.07 288 / .7)', border: '1px solid oklch(0.55 0.14 290 / .35)' }}>
      <Brackets />
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.16em' }}>CLASS UNIT // {PET.name}</span>
        <button onClick={() => go('pet')} className="tech" style={{ fontSize: 10, color: 'var(--cyan)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.08em' }}>ฟาร์ม →</button>
      </div>
      <div className="row" style={{ gap: 14 }}>
        <button onClick={() => go('pet')} key={bounce} className="center float pop" style={{ width: 56, height: 54, flex: 'none', borderRadius: '50% 50% 46% 46%', position: 'relative', cursor: 'pointer', border: 'none',
          background: `radial-gradient(circle at 42% 30%, oklch(0.8 0.17 ${PET.hue}), oklch(0.46 0.16 ${PET.hue}))` }}>
          <div style={{ position: 'absolute', top: -6, left: 14, width: 9, height: 12, background: 'oklch(0.9 0.08 88)', clipPath: 'polygon(50% 0,100% 100%,0 100%)' }} />
          <div style={{ position: 'absolute', top: -6, right: 14, width: 9, height: 12, background: 'oklch(0.9 0.08 88)', clipPath: 'polygon(50% 0,100% 100%,0 100%)' }} />
          <div className="row" style={{ gap: 9, position: 'absolute', top: 18 }}>
            {[0, 1].map(i => <div key={i} className="center" style={{ width: 12, height: 14, borderRadius: '50%', background: '#fff' }}><div style={{ width: 5, height: 7, borderRadius: '50%', background: '#1a1030' }} /></div>)}
          </div>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
            <span className="tech" style={{ fontSize: 12, color: '#fff' }}>Lv.{PET.level} · {PET.stage}</span>
            <span className="tech" style={{ fontSize: 11, color: 'var(--cyan)' }}>{xp}/{PET.xpMax}</span>
          </div>
          <Bar value={xp} max={PET.xpMax} color={`oklch(0.76 0.17 ${PET.hue})`} glow />
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
            <span className="tech" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.06em' }}>FED {fed}/{CLASS.total} TODAY</span>
            <button onClick={feed} className="btn btn-neon" style={{ padding: '5px 12px', fontSize: 11.5 }}><Icon name="heart" size={13} color="#0a0a14" /> ให้ XP</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassroomKingdom({ go, openStudent }) {
  return (
    <div className="col stagger" style={{ gap: 16 }}>
      <MissionBar go={go} />
      <div className="kingdom-grid">
        <ZoneGrid go={go} />
        <div className="col" style={{ gap: 14 }}>
          <ClassCore />
          <BossAlert go={go} />
          <ClassUnit go={go} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ClassroomKingdom, CLIP, Brackets, rewardLabel, rewardIcon });
