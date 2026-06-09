/* ============================================================
   GAME WORLD — shell (neon rail) + home (avatar cards, leaderboard)
   ============================================================ */
const GAME_NAV = [
  { key: 'home',      th: 'อาณาจักร',  icon: 'crown' },
  { key: 'territory', th: 'แผนที่',    icon: 'map' },
  { key: 'boss',      th: 'สู้บอส',    icon: 'fire' },
  { key: 'season',    th: 'ฤดูกาล',    icon: 'calc' },
  { key: 'games',     th: 'สนามเกม',   icon: 'game' },
  { key: 'quests',    th: 'เควสต์',    icon: 'report' },
  { key: 'hall',      th: 'เกียรติยศ', icon: 'trophy' },
  { key: 'shop',      th: 'ร้านค้า',   icon: 'shop' },
  { key: 'tools',     th: 'เครื่องมือ', icon: 'timer' },
  { key: 'status',    th: 'สถานะสด',   icon: 'bolt' },
];

function GameShell({ route, setRoute, onPortal, children }) {
  const { CLASS } = window.GC;
  return (
    <div data-world="game" className="world row" style={{ position: 'absolute', inset: 0 }}>
      {/* rail */}
      <aside className="col" style={{ width: 92, flex: 'none', padding: '18px 0', gap: 6, alignItems: 'center', position: 'relative', zIndex: 3,
        borderRight: '1px solid var(--line)', background: 'rgba(20,16,40,0.5)', backdropFilter: 'blur(var(--glass-blur))' }}>
        <div className="center" style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, var(--cyan), var(--purple))', boxShadow: '0 8px 24px -6px var(--halo)', marginBottom: 10, flex: 'none' }}>
          <Icon name="shield" size={24} color="#0a0a14" />
        </div>
        <div className="col scroll-thin" style={{ gap: 6, alignItems: 'center', flex: 1, minHeight: 0, overflowY: 'auto', width: '100%', padding: '2px 0' }}>
        {GAME_NAV.map(n => {
          const on = route === n.key;
          return (
            <button key={n.key} onClick={() => setRoute(n.key)} className="center col" title={n.th}
              style={{ width: 64, height: 58, borderRadius: 16, gap: 4, cursor: 'pointer', border: 'none', position: 'relative', flex: 'none',
                background: on ? 'linear-gradient(160deg, color-mix(in oklch,var(--cyan) 30%,transparent), color-mix(in oklch,var(--purple) 30%,transparent))' : 'transparent',
                color: on ? 'var(--cyan)' : 'var(--muted)', transition: 'all .2s' }}>
              {on && <span style={{ position: 'absolute', left: -10, top: 15, width: 4, height: 28, borderRadius: 99, background: 'var(--cyan)', boxShadow: '0 0 12px var(--cyan)' }} />}
              <Icon name={n.icon} size={22} />
              <span style={{ fontSize: 10, fontWeight: 600 }}>{n.th}</span>
            </button>
          );
        })}
        </div>
        <button onClick={onPortal} className="center" title="กลับ Portal" style={{ width: 64, height: 58, borderRadius: 16, gap: 4, cursor: 'pointer', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink-soft)', flexDirection: 'column', flex: 'none', marginTop: 6 }}>
          <Icon name="door" size={22} /><span style={{ fontSize: 10 }}>Portal</span>
        </button>
      </aside>

      {/* main */}
      <div className="col" style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <header className="row" style={{ padding: '16px 28px', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid var(--line)' }}>
          <div className="row" style={{ gap: 12 }}>
            <span className="pill tech" style={{ background: 'color-mix(in oklch,var(--cyan) 16%,transparent)', color: 'var(--cyan)', letterSpacing: '.1em' }}>
              <span className="dot" style={{ background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} /> LIVE
            </span>
            <div>
              <div className="display" style={{ fontSize: 17, color: '#fff' }}>{GAME_NAV.find(n => n.key === route)?.th}</div>
              <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.08em' }}>ชั้นเรียน {CLASS.name} · ฤดูกาลที่ 1</div>
            </div>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div className="row glass-2" style={{ borderRadius: 99, padding: '7px 14px', gap: 7 }}>
              <Icon name="star" size={16} color="var(--gold)" fill="var(--gold)" /><span className="tech" style={{ color: '#fff', fontSize: 14 }}>312</span>
            </div>
            <div className="row glass-2" style={{ borderRadius: 99, padding: '7px 14px', gap: 7 }}>
              <Icon name="coin" size={16} color="var(--gold)" /><span className="tech" style={{ color: '#fff', fontSize: 14 }}>1,480</span>
            </div>
            <button className="center glass-2" style={{ width: 40, height: 40, borderRadius: 12, cursor: 'pointer' }}><Icon name="settings" size={19} color="var(--ink-soft)" /></button>
          </div>
        </header>
        <main className="scroll" style={{ flex: 1, padding: '28px 28px 96px' }}>{children}</main>
      </div>
    </div>
  );
}

function CompactAvatarCard({ s, rank, onClick }) {
  const { RANKS } = window.GC;
  const r = RANKS[s.game.rankIdx];
  return (
    <div onClick={onClick} className="glass scanlines col" style={{ borderRadius: 'var(--r-lg)', padding: 16, gap: 12, cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'transform .2s, box-shadow .2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 24px 50px -20px oklch(0.7 0.2 ${s.game.hue})`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}>
      {/* hue glow */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 130, height: 130, borderRadius: '50%', background: `oklch(0.7 0.2 ${s.game.hue})`, opacity: .2, filter: 'blur(28px)' }} />
      {rank && <div className="center tech" style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderRadius: 9,
        background: rank <= 3 ? 'linear-gradient(135deg,var(--gold),oklch(0.7 0.16 60))' : 'var(--surface-2)', color: rank <= 3 ? '#1a1400' : 'var(--muted)', fontSize: 14, fontWeight: 700 }}>{rank}</div>}
      <div className="center" style={{ paddingTop: 6 }}>
        <HeroAvatar student={s} size={84} glow ring={r.color} />
      </div>
      <div className="center col" style={{ gap: 3 }}>
        <div className="display" style={{ fontSize: 17, color: '#fff' }}>{s.nick}</div>
        <RankBadge rank={s.game.rank} size="sm" />
      </div>
      <div className="col" style={{ gap: 6 }}>
        <div className="row" style={{ justifyContent: 'space-between', fontSize: 12 }}>
          <span className="tech" style={{ color: 'var(--cyan)' }}>Lv.{s.game.level} · {s.game.tier.th}</span>
          <span className="tech" style={{ color: 'var(--muted)' }}>{s.game.xp}/{s.game.xpMax}</span>
        </div>
        <Bar value={s.game.xp} max={s.game.xpMax} color={`oklch(0.78 0.16 ${s.game.hue})`} glow />
      </div>
      <div className="row" style={{ justifyContent: 'space-around', borderTop: '1px solid var(--line)', paddingTop: 10 }}>
        <span className="row" style={{ gap: 5, fontSize: 13 }}><Icon name="star" size={15} color="var(--gold)" fill="var(--gold)" /><span className="tech" style={{ color: '#fff' }}>{s.game.stars}</span></span>
        <span className="row" style={{ gap: 5, fontSize: 13 }}><Icon name="coin" size={15} color="var(--gold)" /><span className="tech" style={{ color: '#fff' }}>{s.game.coins}</span></span>
        <span className="row" style={{ gap: 5, fontSize: 13 }}><Icon name="trophy" size={15} color="var(--cyan)" /><span className="tech" style={{ color: '#fff' }}>{s.badges}</span></span>
      </div>
    </div>
  );
}

function GameHome({ openStudent }) {
  const STUDENTS = useStudents();
  const ranked = [...STUDENTS].sort((a, b) => (b.game.level * 1000 + b.game.xp) - (a.game.level * 1000 + a.game.xp));
  const mvp = ranked[0];
  const classXP = STUDENTS.reduce((a, s) => a + s.game.level * 1000 + s.game.xp, 0);
  const goal = 120000;

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      {/* hero banner: MVP + class progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div className="glass scanlines" style={{ borderRadius: 'var(--r-xl)', padding: 24, position: 'relative', overflow: 'hidden',
          background: `linear-gradient(120deg, color-mix(in oklch,var(--purple) 22%,transparent), color-mix(in oklch,var(--cyan) 14%,transparent))` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 80% at 80% 20%, var(--halo), transparent 60%)' }} />
          <div className="row" style={{ position: 'relative', gap: 22, alignItems: 'center' }}>
            <div style={{ position: 'relative' }} className="float">
              <HeroAvatar student={mvp} size={130} glow ring="var(--gold)" />
              <span className="center" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}>
                <Icon name="crown" size={34} color="var(--gold)" fill="var(--gold)" />
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <span className="pill tech" style={{ background: 'color-mix(in oklch,var(--gold) 20%,transparent)', color: 'var(--gold)', letterSpacing: '.12em' }}>นักเรียนแห่งสัปดาห์</span>
              <h2 style={{ fontSize: 32, color: '#fff', marginTop: 10 }}>{mvp.name}</h2>
              <div className="row" style={{ gap: 10, marginTop: 8 }}>
                <RankBadge rank={mvp.game.rank} />
                <span className="pill tech" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--cyan)' }}>Lv.{mvp.game.level} {mvp.game.tier.th}</span>
              </div>
              <button onClick={() => openStudent(mvp.id)} className="btn btn-neon" style={{ marginTop: 18, padding: '10px 18px', fontSize: 14 }}>
                ดูการ์ดอวตาร <Icon name="arrowRight" size={17} color="#0a0a14" />
              </button>
            </div>
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: 24 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 17, color: '#fff' }}>พลัง XP รวมของห้อง</h3>
            <Icon name="bolt" size={22} color="var(--cyan)" />
          </div>
          <div className="display neon-text" style={{ fontSize: 44, marginTop: 14 }}>{classXP.toLocaleString()}</div>
          <div className="tech" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>เป้าหมายฤดูกาล {goal.toLocaleString()} XP</div>
          <Bar value={classXP} max={goal} color="linear-gradient(90deg,var(--cyan),var(--purple))" height={12} glow />
          <div className="row" style={{ gap: 12, marginTop: 18 }}>
            {[['users', STUDENTS.length, 'นักรบ'], ['trophy', 38, 'เหรียญตรา'], ['fire', 12, 'สตรีค']].map(([ic, v, l]) => (
              <div key={l} className="center col glass-2" style={{ flex: 1, padding: '12px 4px', borderRadius: 'var(--r-md)', gap: 3 }}>
                <Icon name={ic} size={18} color="var(--cyan)" />
                <div className="display" style={{ fontSize: 18, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* leaderboard quick strip */}
      <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: '16px 22px' }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, color: '#fff' }}>🏆 อันดับนักรบ</h3>
          <span className="tech" style={{ fontSize: 12, color: 'var(--muted)' }}>เรียงตามเลเวล + XP</span>
        </div>
        <div className="row scroll" style={{ gap: 10, paddingBottom: 6 }}>
          {ranked.slice(0, 5).map((s, i) => (
            <div key={s.id} onClick={() => openStudent(s.id)} className="row glass-2" style={{ gap: 11, padding: '10px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer', flex: '1 0 auto' }}>
              <span className="center tech" style={{ width: 26, height: 26, borderRadius: 8, fontSize: 14, fontWeight: 700,
                background: i < 3 ? 'linear-gradient(135deg,var(--gold),oklch(0.7 0.16 60))' : 'var(--surface-2)', color: i < 3 ? '#1a1400' : 'var(--muted)' }}>{i + 1}</span>
              <HeroAvatar student={s} size={36} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{s.nick}</div>
                <div className="tech" style={{ fontSize: 11, color: 'var(--cyan)' }}>Lv.{s.game.level}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* avatar card grid */}
      <div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: 18, color: '#fff' }}>การ์ดอวตารทั้งห้อง</h3>
          <span className="tech" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{STUDENTS.length} การ์ด · แตะเพื่อดูรายละเอียด</span>
        </div>
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 16 }}>
          {ranked.map((s, i) => <CompactAvatarCard key={s.id} s={s} rank={i + 1} onClick={() => openStudent(s.id)} />)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GameShell, GameHome, CompactAvatarCard, GAME_NAV });
