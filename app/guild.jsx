/* ============================================================
   GUILD WAR + CLASS ACHIEVEMENTS — Phase 2
   ============================================================ */

/* ============================================================
   GUILD WAR — 4 guilds ranked by total XP
   ============================================================ */
function GuildWar({ openStudent }) {
  const STUDENTS = useStudents();
  const [guilds, setGuilds] = React.useState(() => window.GC.getGuildStats());
  const [sel, setSel] = React.useState(null);

  React.useEffect(() => {
    const h = () => setGuilds(window.GC.getGuildStats());
    window.addEventListener('gc:students-changed', h);
    return () => window.removeEventListener('gc:students-changed', h);
  }, []);

  const maxXP = guilds[0]?.xp || 1;
  const rankColors = ['var(--gold)', 'var(--rk-silver)', 'oklch(0.65 0.16 35)', 'var(--muted)'];
  const selGuild = sel ? guilds.find(g => g.key === sel) : null;

  return (
    <div className="col stagger" style={{ gap: 18 }}>
      {/* header */}
      <div className="glass scanlines row" style={{ borderRadius: 'var(--r-xl)', padding: '20px 26px', gap: 18, position: 'relative', overflow: 'hidden', flexWrap: 'wrap' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 120% at 10% 0%, color-mix(in oklch,var(--gold) 22%,transparent), transparent 55%)' }} />
        <div className="center float" style={{ width: 64, height: 64, borderRadius: 20, flex: 'none', position: 'relative',
          background: 'linear-gradient(135deg,oklch(0.7 0.22 28),oklch(0.6 0.18 50))', boxShadow: '0 14px 36px -10px oklch(0.65 0.2 30)' }}>
          <Icon name="fire" size={30} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <h2 style={{ fontSize: 24, color: '#fff' }}>⚔️ สงครามกิลด์</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>4 กิลด์แข่งขันกันด้วย XP รวมของสมาชิก — ใครสูงสุดคือผู้นำ</p>
        </div>
        <div className="row" style={{ gap: 10 }}>
          {guilds.map((g, i) => (
            <div key={g.key} className="center col glass-2" style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', gap: 3, cursor: 'pointer',
              border: sel === g.key ? `1px solid ${g.color}` : '1px solid transparent' }}
              onClick={() => setSel(sel === g.key ? null : g.key)}>
              <span className="tech" style={{ fontSize: 10, color: i === 0 ? 'var(--gold)' : 'var(--muted)' }}>#{i + 1}</span>
              <Icon name={g.icon} size={20} color={g.color} />
              <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{g.th}</span>
            </div>
          ))}
        </div>
      </div>

      {/* rank cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {guilds.map((g, rank) => (
          <div key={g.key} onClick={() => setSel(sel === g.key ? null : g.key)} className="glass scanlines col"
            style={{ borderRadius: 'var(--r-xl)', padding: 22, gap: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'transform .2s',
              border: sel === g.key ? `1px solid ${g.color}` : '1px solid transparent' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            {/* bg glow */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%',
              background: g.color, opacity: .12, filter: 'blur(30px)' }} />
            {/* rank badge */}
            <div className="row" style={{ justifyContent: 'space-between', position: 'relative' }}>
              <div className="row" style={{ gap: 12 }}>
                <div className="center" style={{ width: 52, height: 52, borderRadius: 16, flex: 'none',
                  background: `radial-gradient(circle at 40% 30%, ${g.color}, oklch(0.38 0.14 ${g.hue}))`,
                  boxShadow: `0 8px 24px -8px ${g.color}` }}>
                  <Icon name={g.icon} size={26} color="#fff" />
                </div>
                <div>
                  <div className="display" style={{ fontSize: 18, color: '#fff' }}>{g.th}</div>
                  <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.06em' }}>{g.en}</div>
                </div>
              </div>
              <div className="center" style={{ width: 38, height: 38, borderRadius: 12,
                background: rank === 0 ? 'var(--gold)' : 'var(--surface-2)' }}>
                <span className="display" style={{ fontSize: 18, color: rank === 0 ? '#1a1200' : rankColors[rank] }}>#{rank + 1}</span>
              </div>
            </div>

            {/* XP bar */}
            <div style={{ position: 'relative' }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="tech" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.06em' }}>GUILD XP</span>
                <span className="tech" style={{ fontSize: 14, color: g.color, fontWeight: 700 }}>{g.xp.toLocaleString()}</span>
              </div>
              <Bar value={g.xp} max={maxXP} color={`oklch(0.7 0.18 ${g.hue})`} height={10} glow />
            </div>

            {/* stats row */}
            <div className="row glass-2" style={{ borderRadius: 'var(--r-md)', padding: '10px 14px', justifyContent: 'space-around' }}>
              <span className="row" style={{ gap: 6 }}><Icon name="group" size={15} color="var(--muted)" /><span className="tech" style={{ color: '#fff', fontSize: 13 }}>{g.members.length}</span></span>
              <span className="row" style={{ gap: 6 }}><Icon name="star" size={15} color="var(--gold)" fill="var(--gold)" /><span className="tech" style={{ color: '#fff', fontSize: 13 }}>{g.stars}</span></span>
              <span className="row" style={{ gap: 6 }}><Icon name="coin" size={15} color="var(--gold)" /><span className="tech" style={{ color: '#fff', fontSize: 13 }}>{g.coins}</span></span>
            </div>

            {/* MVP */}
            {g.mvp && (
              <div className="row glass-2" style={{ borderRadius: 'var(--r-md)', padding: '10px 12px', gap: 10 }} onClick={e => { e.stopPropagation(); openStudent(g.mvp.id); }}>
                <div style={{ position: 'relative' }}>
                  <HeroAvatar student={g.mvp} size={40} ring={rank === 0 ? 'var(--gold)' : g.color} />
                  <span className="center" style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
                    background: rank === 0 ? 'var(--gold)' : g.color, borderRadius: 99, padding: '1px 5px' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: '#1a1200' }}>MVP</span>
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nowrap" style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{g.mvp.nick}</div>
                  <div className="tech" style={{ fontSize: 10.5, color: 'var(--muted)' }}>Lv.{g.mvp.game.level} · {(g.mvp.game.level * 1000 + g.mvp.game.xp).toLocaleString()} XP</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* selected guild roster */}
      {selGuild && (
        <div className="glass col" style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
          <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', gap: 12 }}>
            <Icon name={selGuild.icon} size={20} color={selGuild.color} />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>สมาชิก{selGuild.th}</span>
            <span className="pill tech" style={{ background: `color-mix(in oklch,${selGuild.color} 18%,transparent)`, color: selGuild.color, fontSize: 11 }}>{selGuild.members.length} คน</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, padding: 16 }}>
            {selGuild.members.map((s, i) => {
              const title = window.GC.getTitleForStudent(s);
              return (
                <div key={s.id} onClick={() => openStudent(s.id)} className="row glass-2"
                  style={{ borderRadius: 'var(--r-md)', padding: '10px 12px', gap: 10, cursor: 'pointer' }}>
                  <span className="center tech" style={{ width: 22, fontSize: 13, fontWeight: 700, color: i < 3 ? 'var(--gold)' : 'var(--muted)', flex: 'none' }}>{i + 1}</span>
                  <HeroAvatar student={s} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="nowrap" style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.nick}</div>
                    <span className="pill" style={{ fontSize: 9, padding: '1px 5px', background: `color-mix(in oklch,oklch(0.7 0.16 ${title.hue}) 16%,transparent)`, color: `oklch(0.82 0.14 ${title.hue})` }}>{title.th}</span>
                  </div>
                  <span className="tech" style={{ fontSize: 12, color: selGuild.color, flex: 'none' }}>{(s.game.level * 1000 + s.game.xp).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CLASS ACHIEVEMENTS — classroom-level milestones
   ============================================================ */
function ClassAchieve() {
  const STUDENTS = useStudents();
  const [ach, setAch] = React.useState(() => window.GC.getClassAchievements());
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    const h = () => setAch(window.GC.getClassAchievements());
    window.addEventListener('gc:students-changed', h);
    return () => window.removeEventListener('gc:students-changed', h);
  }, []);

  function claim(a) {
    window.GC.claimClassAchievement(a.key);
    // award class XP to all students
    const xpMatch = (a.reward || '').match(/\+(\d+)\s*XP/);
    if (xpMatch) {
      const amt = parseInt(xpMatch[1]);
      window.GC.getStudents().forEach(s => {
        window.GC.addScoreLog({ studentId: s.id, studentName: s.name, type: 'xp', amount: Math.round(amt / window.GC.getStudents().length), note: 'Class Achievement: ' + a.badge });
      });
    }
    setToast('🏅 ปลดล็อก ' + a.badge + '!');
    setTimeout(() => setToast(null), 3000);
  }

  const doneCount = ach.filter(a => a.done).length;

  return (
    <div className="col stagger" style={{ gap: 18 }}>
      {/* header */}
      <div className="glass row" style={{ borderRadius: 'var(--r-xl)', padding: '20px 26px', gap: 18, position: 'relative', overflow: 'hidden', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 130% at 90% 0%, color-mix(in oklch,var(--gold) 20%,transparent), transparent 55%)' }} />
        <div className="row" style={{ gap: 14, position: 'relative' }}>
          <div className="center float" style={{ width: 60, height: 60, borderRadius: 18, flex: 'none',
            background: 'linear-gradient(135deg,var(--gold),oklch(0.65 0.18 55))', boxShadow: '0 10px 30px -8px var(--gold)' }}>
            <Icon name="trophy" size={28} color="#1a1200" />
          </div>
          <div>
            <h2 style={{ fontSize: 24, color: '#fff' }}>🏰 ความสำเร็จระดับห้อง</h2>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>ทำให้ห้องปลดล็อก Achievement รับรางวัลพิเศษร่วมกัน</p>
          </div>
        </div>
        <div className="center col glass-2" style={{ padding: '12px 20px', borderRadius: 'var(--r-md)', gap: 4, position: 'relative' }}>
          <div className="display" style={{ fontSize: 28, color: 'var(--gold)' }}>{doneCount}<span style={{ fontSize: 16, color: 'var(--muted)' }}>/{ach.length}</span></div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>ปลดล็อกแล้ว</div>
          <div style={{ width: '100%', marginTop: 4 }}><Bar value={doneCount} max={ach.length} color="var(--gold)" height={6} glow /></div>
        </div>
      </div>

      {/* achievement grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
        {ach.map(a => (
          <div key={a.key} className="glass scanlines col"
            style={{ borderRadius: 'var(--r-lg)', padding: 20, gap: 14, position: 'relative', overflow: 'hidden',
              opacity: a.claimed ? 0.65 : 1,
              border: a.done && !a.claimed ? `1px solid color-mix(in oklch,oklch(0.72 0.18 ${a.hue}) 50%,transparent)` : '1px solid transparent' }}>
            {/* glow when done */}
            {a.done && <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%',
              background: `oklch(0.7 0.18 ${a.hue})`, opacity: .12, filter: 'blur(30px)' }} />}
            <div className="row" style={{ gap: 14, position: 'relative' }}>
              <div className="center" style={{ width: 52, height: 52, borderRadius: 16, flex: 'none',
                background: a.done ? `radial-gradient(circle at 40% 30%, oklch(0.75 0.2 ${a.hue}), oklch(0.45 0.16 ${a.hue}))` : 'var(--surface-2)',
                boxShadow: a.done ? `0 8px 24px -8px oklch(0.65 0.18 ${a.hue})` : 'none' }}>
                <Icon name={a.done ? 'check' : a.icon} size={24} color={a.done ? '#fff' : 'var(--muted)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{a.th}</div>
                <span className="pill" style={{ marginTop: 5, fontSize: 10.5, background: `color-mix(in oklch,oklch(0.7 0.16 ${a.hue}) 18%,transparent)`, color: `oklch(0.82 0.14 ${a.hue})` }}>
                  🏅 {a.badge}
                </span>
              </div>
              {a.done && !a.claimed && (
                <span className="pill tech" style={{ fontSize: 10, padding: '3px 8px', flex: 'none', animation: 'pulse 1.5s infinite',
                  background: `color-mix(in oklch,oklch(0.7 0.18 ${a.hue}) 30%,transparent)`, color: `oklch(0.88 0.14 ${a.hue})` }}>
                  ✓ พร้อมรับ
                </span>
              )}
            </div>
            <div className="row glass-2" style={{ borderRadius: 'var(--r-md)', padding: '8px 12px', justifyContent: 'space-between', position: 'relative' }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>รางวัล</span>
              <span className="tech" style={{ fontSize: 12.5, color: `oklch(0.82 0.14 ${a.hue})`, fontWeight: 600 }}>{a.reward}</span>
            </div>
            <button onClick={() => a.done && !a.claimed && claim(a)}
              disabled={!a.done || a.claimed}
              className="btn" style={{ width: '100%', justifyContent: 'center', fontSize: 13.5,
                background: a.claimed ? 'var(--surface-2)' : a.done ? `linear-gradient(120deg,oklch(0.7 0.2 ${a.hue}),oklch(0.6 0.18 ${a.hue + 30}))` : 'var(--surface-2)',
                color: a.claimed ? 'var(--muted)' : a.done ? '#0a0a14' : 'var(--muted)', cursor: a.done && !a.claimed ? 'pointer' : 'default' }}>
              {a.claimed ? <><Icon name="check" size={16} color="var(--muted)" /> รับรางวัลแล้ว</>
               : a.done ? <><Icon name="gift" size={16} color="#0a0a14" /> รับรางวัลห้อง</>
               : 'ยังไม่สำเร็จ'}
            </button>
          </div>
        ))}
      </div>

      {toast && (
        <div className="glass pop row" style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 60,
          borderRadius: 99, padding: '12px 24px', gap: 10, background: 'color-mix(in oklch,var(--gold) 30%,#1a1430)' }}>
          <Icon name="trophy" size={19} color="var(--gold)" />
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{toast}</span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { GuildWar, ClassAchieve });
