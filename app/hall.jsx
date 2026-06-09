/* ============================================================
   HALL OF FAME  +  STUDENT GUILD
   ============================================================ */
function HallOfFame({ openStudent }) {
  const STUDENTS = useStudents();
  const [log, setLog] = React.useState(() => window.GC.getScoreLog());
  React.useEffect(() => {
    const h = () => setLog(window.GC.getScoreLog());
    window.addEventListener('gc:score-added', h);
    window.addEventListener('gc:students-changed', h);
    return () => { window.removeEventListener('gc:score-added', h); window.removeEventListener('gc:students-changed', h); };
  }, []);
  const achievements = React.useMemo(() => window.GC.getAchievements(), [STUDENTS, log]);
  const ranked = [...STUDENTS].sort((a, b) => (b.game.level * 1000 + b.game.xp) - (a.game.level * 1000 + a.game.xp));
  const podium = [ranked[1], ranked[0], ranked[2]];   // 2nd, 1st, 3rd
  const heights = [128, 168, 104];
  const places = [2, 1, 3];
  const medal = ['var(--rk-silver)', 'var(--gold)', 'var(--rk-bronze)'];

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      {/* hero header */}
      <div className="glass scanlines" style={{ borderRadius: 'var(--r-xl)', padding: '20px 26px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(110deg, color-mix(in oklch,var(--gold) 18%,transparent), transparent 60%)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 120% at 85% 0%, color-mix(in oklch,var(--gold) 30%,transparent), transparent 60%)' }} />
        <div className="row" style={{ position: 'relative', gap: 14, alignItems: 'center' }}>
          <Icon name="trophy" size={32} color="var(--gold)" />
          <div>
            <h2 style={{ fontSize: 24, color: '#fff' }}>หอเกียรติยศ</h2>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>เชิดชูนักเรียนผู้สร้างแรงบันดาลใจประจำฤดูกาล</p>
          </div>
        </div>
      </div>

      {/* podium */}
      <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: '28px 24px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 80% at 50% 0%, var(--halo), transparent 60%)' }} />
        <div className="row" style={{ position: 'relative', justifyContent: 'center', alignItems: 'flex-end', gap: 18 }}>
          {podium.map((s, i) => (
            <div key={s.id} className="col center" style={{ gap: 10, width: 150 }}>
              <div style={{ position: 'relative' }} className={places[i] === 1 ? 'float' : ''}>
                {places[i] === 1 && <Icon name="crown" size={28} color="var(--gold)" fill="var(--gold)" style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)' }} />}
                <HeroAvatar student={s} size={places[i] === 1 ? 84 : 64} glow ring={medal[i]} />
              </div>
              <div className="center col" style={{ gap: 3 }}>
                <div className="display" style={{ fontSize: 15, color: '#fff' }}>{s.nick}</div>
                <RankBadge rank={s.game.rank} size="sm" />
                {(() => { const t = window.GC.getTitleForStudent(s); return (
                  <span className="pill" style={{ fontSize: 9.5, marginTop: 2, background: `color-mix(in oklch,oklch(0.7 0.16 ${t.hue}) 18%,transparent)`, color: `oklch(0.82 0.14 ${t.hue})` }}>{t.th}</span>
                ); })()}
              </div>
              <div className="center col" style={{ width: '100%', height: heights[i], borderRadius: '12px 12px 0 0', justifyContent: 'flex-start', paddingTop: 14, gap: 4,
                background: `linear-gradient(180deg, color-mix(in oklch,${medal[i]} 30%,transparent), color-mix(in oklch,${medal[i]} 8%,transparent))`,
                border: '1px solid var(--line)', borderBottom: 'none' }}>
                <div className="display" style={{ fontSize: 34, color: medal[i] }}>{places[i]}</div>
                <div className="tech" style={{ fontSize: 11, color: 'var(--cyan)' }}>{(s.game.level * 1000 + s.game.xp).toLocaleString()}</div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>พลังรวม</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* achievement categories */}
      <div>
        <h3 style={{ fontSize: 17, color: '#fff', marginBottom: 14 }}>🏅 ผู้ครองตำแหน่งแห่งฤดูกาล</h3>
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 14 }}>
          {achievements.map(a => {
            if (!a.holder) return null;
            const title = window.GC.getTitleForStudent(a.holder);
            return (
            <div key={a.key} onClick={() => openStudent(a.holder.id)} className="glass scanlines row" style={{ borderRadius: 'var(--r-lg)', padding: 16, gap: 14, cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ position: 'absolute', top: -26, right: -26, width: 90, height: 90, borderRadius: '50%', background: `oklch(0.72 0.16 ${a.hue})`, opacity: .18, filter: 'blur(20px)' }} />
              <div style={{ position: 'relative' }}>
                <HeroAvatar student={a.holder} size={56} glow ring={`oklch(0.72 0.16 ${a.hue})`} />
                <span className="center" style={{ position: 'absolute', bottom: -5, right: -5, width: 26, height: 26, borderRadius: '50%',
                  background: `oklch(0.62 0.18 ${a.hue})`, border: '2px solid #1a1430' }}>
                  <Icon name={a.icon} size={14} color="#fff" />
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="pill" style={{ fontSize: 10.5, background: `color-mix(in oklch,oklch(0.7 0.16 ${a.hue}) 20%,transparent)`, color: `oklch(0.78 0.14 ${a.hue})`, marginBottom: 6 }}>{a.th}</span>
                <div className="nowrap" style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{a.holder.name}</div>
                <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3 }}>Lv.{a.holder.game.level} · {a.holder.game.tier.th}</div>
                <span className="pill" style={{ fontSize: 10, background: `color-mix(in oklch,oklch(0.7 0.16 ${title.hue}) 16%,transparent)`, color: `oklch(0.82 0.14 ${title.hue})` }}>
                  <Icon name={title.icon} size={10} color={`oklch(0.82 0.14 ${title.hue})`} /> {title.th}
                </span>
              </div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

function StudentGuild({ openStudent }) {
  const STUDENTS = useStudents();
  const { CLASS, CLASS_LEVEL } = window.GC;
  const ranked = [...STUDENTS].sort((a, b) => (b.game.level * 1000 + b.game.xp) - (a.game.level * 1000 + a.game.xp));
  const totalStars = STUDENTS.reduce((a, s) => a + s.game.stars, 0);
  const [sort, setSort] = React.useState('power');
  const sorted = [...STUDENTS].sort((a, b) => sort === 'power' ? (b.game.level * 1000 + b.game.xp) - (a.game.level * 1000 + a.game.xp)
    : sort === 'stars' ? b.game.stars - a.game.stars : a.no - b.no);

  return (
    <div className="col stagger" style={{ gap: 18 }}>
      {/* guild crest header */}
      <div className="glass scanlines row" style={{ borderRadius: 'var(--r-xl)', padding: '20px 26px', gap: 18, position: 'relative', overflow: 'hidden', flexWrap: 'wrap' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 120% at 12% 0%, var(--halo), transparent 60%)' }} />
        <div className="center float" style={{ width: 64, height: 64, borderRadius: 20, flex: 'none', position: 'relative',
          background: 'linear-gradient(135deg, var(--purple), var(--cyan))', boxShadow: '0 14px 36px -10px var(--halo)' }}>
          <Icon name="shield" size={32} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ fontSize: 24, color: '#fff' }}>หอสมาคม · {CLASS.name}</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>การ์ดฮีโร่ของสมาชิกทั้ง {CLASS.total} คน · เลเวลสมาคม Lv.{CLASS_LEVEL}</p>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <div className="center col glass-2" style={{ padding: '12px 18px', borderRadius: 'var(--r-md)', gap: 2 }}>
            <Icon name="star" size={18} color="var(--gold)" fill="var(--gold)" />
            <div className="tech" style={{ fontSize: 17, color: '#fff' }}>{totalStars}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>ดาวรวม</div>
          </div>
          <div className="center col glass-2" style={{ padding: '12px 18px', borderRadius: 'var(--r-md)', gap: 2 }}>
            <Icon name="bolt" size={18} color="var(--cyan)" />
            <div className="tech" style={{ fontSize: 17, color: '#fff' }}>{ranked[0].game.level}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>เลเวลสูงสุด</div>
          </div>
        </div>
      </div>

      {/* sort */}
      <div className="row" style={{ gap: 8 }}>
        <span style={{ fontSize: 12.5, color: 'var(--muted)', alignSelf: 'center' }}>เรียงตาม:</span>
        {[['power', 'พลังรวม'], ['stars', 'ดาว'], ['no', 'เลขที่']].map(([k, t]) => (
          <button key={k} onClick={() => setSort(k)} className="btn" style={{ padding: '7px 15px', fontSize: 13,
            background: sort === k ? 'linear-gradient(120deg,var(--cyan),var(--neon))' : 'var(--surface-2)',
            color: sort === k ? '#0a0a14' : 'var(--ink-soft)', boxShadow: 'none' }}>{t}</button>
        ))}
      </div>

      {/* hero card roster */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 16 }}>
        {sorted.map((s, i) => <CompactAvatarCard key={s.id} s={s} rank={sort === 'power' ? i + 1 : null} onClick={() => openStudent(s.id)} />)}
      </div>
    </div>
  );
}

Object.assign(window, { HallOfFame, StudentGuild });
