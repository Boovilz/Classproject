/* ============================================================
   STUDENT PORTAL — read-only mobile-first view
   Access via: index.html?portal=S1  (specific student)
              index.html?portal       (picker)
   ============================================================ */

function StudentPortalPicker({ onSelect }) {
  const STUDENTS = useStudents();
  const [search, setSearch] = React.useState('');
  const filtered = search.trim()
    ? STUDENTS.filter(s => s.name.includes(search) || s.nick.includes(search))
    : STUDENTS;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a12', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px' }}>
      {/* header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="center" style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,var(--cyan),var(--purple))', margin: '0 auto 14px', boxShadow: '0 14px 36px -10px var(--halo)' }}>
          <Icon name="shield" size={30} color="#fff" />
        </div>
        <h1 className="display" style={{ fontSize: 26, color: '#fff', marginBottom: 6 }}>Student Portal</h1>
        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>เลือกชื่อของคุณเพื่อดูสถิติ</p>
      </div>

      {/* search */}
      <div className="row glass" style={{ borderRadius: 99, padding: '10px 18px', gap: 10, width: '100%', maxWidth: 400, marginBottom: 20 }}>
        <Icon name="search" size={16} color="var(--muted)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาชื่อ…"
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 15, color: '#fff', flex: 1, fontFamily: 'var(--font-body)' }} />
      </div>

      {/* student list */}
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(s => {
          const title = window.GC.getTitleForStudent(s);
          return (
            <button key={s.id} onClick={() => onSelect(s.id)} className="glass row"
              style={{ borderRadius: 16, padding: '14px 16px', gap: 14, cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left', transition: 'transform .15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <HeroAvatar student={s} size={48} ring={`oklch(0.72 0.16 ${s.game.hue})`} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{s.name}</div>
                <div className="row" style={{ gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  <span className="tech" style={{ fontSize: 11, color: 'var(--cyan)' }}>Lv.{s.game.level}</span>
                  <span className="pill" style={{ fontSize: 10, padding: '1px 6px', background: `color-mix(in oklch,oklch(0.7 0.16 ${title.hue}) 18%,transparent)`, color: `oklch(0.82 0.14 ${title.hue})` }}>{title.th}</span>
                </div>
              </div>
              <Icon name="chevron" size={18} color="var(--muted)" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StudentPortalView({ student }) {
  const STUDENTS = useStudents();
  const s = STUDENTS.find(x => x.id === student) || STUDENTS[0];
  const { SUBJECTS, RANKS } = window.GC;
  const log = React.useMemo(() => window.GC.getScoreLog().filter(e => e.studentId === s.id).slice(0, 10), [s.id]);
  const streak = React.useMemo(() => window.GC.getStudentStreak(s.id), [s.id]);
  const title = window.GC.getTitleForStudent(s);
  const petMood = window.GC.getPetMood();
  const r = RANKS[s.game.rankIdx];
  const unlocked = SUBJECTS.filter(sub => s.game.territories[sub.key] >= 50).length;
  const [showTerr, setShowTerr] = React.useState(false);

  function share() {
    const url = window.location.origin + window.location.pathname + '?portal=' + s.id;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => alert('คัดลอก URL แล้ว!\n' + url));
    } else {
      prompt('URL ของคุณ:', url);
    }
  }

  function goBack() {
    window.history.pushState({}, '', window.location.pathname + '?portal');
    window.location.reload();
  }

  const TYPE_ICON = { xp: '⚡', coin: '🪙', star: '⭐', badge: '🏅' };
  const TYPE_COLOR = { xp: 'var(--cyan)', coin: 'var(--gold)', star: 'var(--gold)', badge: 'var(--purple)' };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a12', maxWidth: 480, margin: '0 auto', paddingBottom: 40 }}>
      {/* back bar */}
      <div className="row" style={{ padding: '14px 16px', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
        <button onClick={goBack} className="row btn btn-ghost" style={{ gap: 6, padding: '6px 12px', fontSize: 13 }}>
          <Icon name="chevron" size={16} color="var(--muted)" style={{ transform: 'rotate(180deg)' }} /> กลับ
        </button>
        <button onClick={share} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13 }}>
          <Icon name="share" size={15} color="var(--cyan)" /> แชร์
        </button>
      </div>

      {/* hero banner */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '32px 20px 24px',
        background: `linear-gradient(160deg, oklch(0.4 0.18 ${s.game.hue}), oklch(0.22 0.1 ${(s.game.hue + 60) % 360}))` }}>
        <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', top: -50, right: 20, width: 180, height: 180, borderRadius: '50%', background: '#fff', opacity: .1, filter: 'blur(30px)' }} />
        <div className="center col" style={{ gap: 12, position: 'relative' }}>
          <div className="float"><HeroAvatar student={s} size={120} glow ring="rgba(255,255,255,.7)" /></div>
          <div className="center col" style={{ gap: 6 }}>
            <h2 style={{ fontSize: 24, color: '#fff', fontWeight: 700 }}>{s.name}</h2>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,.75)' }}>"{s.nick}"</div>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <RankBadge rank={s.game.rank} />
              <span className="pill" style={{ background: `color-mix(in oklch,oklch(0.7 0.16 ${title.hue}) 32%,rgba(0,0,0,.25))`, color: `oklch(0.92 0.12 ${title.hue})`, fontWeight: 700, fontSize: 12 }}>
                <Icon name={title.icon} size={12} color={`oklch(0.92 0.12 ${title.hue})`} /> {title.th}
              </span>
              {streak > 0 && (
                <span className="pill" style={{ background: 'color-mix(in oklch,oklch(0.7 0.2 30) 28%,rgba(0,0,0,.25))', color: 'oklch(0.92 0.18 45)', fontWeight: 700, fontSize: 12 }}>
                  🔥 Streak ×{streak}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* XP bar */}
        <div style={{ marginTop: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.8)' }}>Lv.{s.game.level} — XP</span>
            <span className="tech" style={{ fontSize: 12, color: '#fff' }}>{s.game.xp} / {s.game.xpMax}</span>
          </div>
          <div className="bar" style={{ height: 10, background: 'rgba(0,0,0,.3)' }}>
            <i style={{ width: (s.game.xp / s.game.xpMax * 100) + '%', background: 'linear-gradient(90deg,#fff,rgba(255,255,255,.6))' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, margin: '16px 0' }}>
          {[
            ['star', s.game.stars, 'ดาว', 'var(--gold)'],
            ['coin', s.game.coins, 'เหรียญ', 'var(--gold)'],
            ['trophy', s.badges, 'ตรา', 'var(--cyan)'],
            ['map', unlocked + '/8', 'ดินแดน', 'var(--purple)'],
          ].map(([ic, v, l, c]) => (
            <div key={l} className="glass center col" style={{ padding: '14px 6px', borderRadius: 14, gap: 5 }}>
              <Icon name={ic} size={20} color={c} fill={ic === 'star' ? c : 'none'} />
              <div className="display" style={{ fontSize: 20, color: '#fff' }}>{v}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* guild */}
        {s.guild && (() => {
          const g = window.GC.GUILDS.find(x => x.key === s.guild);
          return g ? (
            <div className="glass row" style={{ borderRadius: 14, padding: '12px 16px', gap: 12, marginBottom: 14 }}>
              <div className="center" style={{ width: 38, height: 38, borderRadius: 12, flex: 'none', background: `radial-gradient(circle at 40% 30%, ${g.color}, oklch(0.38 0.14 ${g.hue}))` }}>
                <Icon name={g.icon} size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>สังกัดกิลด์</div>
                <div style={{ fontSize: 15, color: '#fff', fontWeight: 700 }}>{g.th}</div>
              </div>
            </div>
          ) : null;
        })()}

        {/* pet mood */}
        <div className="glass row" style={{ borderRadius: 14, padding: '12px 16px', gap: 12, marginBottom: 14 }}>
          <div className="center" style={{ width: 38, height: 38, borderRadius: 12, flex: 'none', background: `color-mix(in oklch,oklch(0.7 0.18 ${petMood.hue}) 20%,transparent)` }}>
            <span style={{ fontSize: 22 }}>{petMood.emoji}</span>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>สัตว์เลี้ยงห้อง · อารมณ์ปัจจุบัน</div>
            <div style={{ fontSize: 15, color: `oklch(0.88 0.14 ${petMood.hue})`, fontWeight: 700 }}>{petMood.th} — {petMood.msg}</div>
          </div>
        </div>

        {/* territories (collapsible) */}
        <button onClick={() => setShowTerr(v => !v)} className="glass row"
          style={{ borderRadius: 14, padding: '13px 16px', gap: 12, width: '100%', border: 'none', cursor: 'pointer', marginBottom: showTerr ? 0 : 14, textAlign: 'left' }}>
          <Icon name="map" size={18} color="var(--purple)" />
          <span style={{ flex: 1, fontSize: 14, color: '#fff', fontWeight: 600 }}>ดินแดนความรู้</span>
          <span className="pill" style={{ fontSize: 11, background: 'color-mix(in oklch,var(--purple) 16%,transparent)', color: 'var(--purple)' }}>{unlocked}/8 ปลดล็อก</span>
          <Icon name="chevron" size={16} color="var(--muted)" style={{ transform: showTerr ? 'rotate(-90deg)' : 'rotate(90deg)', transition: '.2s' }} />
        </button>
        {showTerr && (
          <div className="glass col" style={{ borderRadius: '0 0 14px 14px', padding: '4px 16px 14px', gap: 10, marginBottom: 14 }}>
            {SUBJECTS.map(sub => {
              const p = s.game.territories[sub.key] || 0;
              return (
                <div key={sub.key} className="col" style={{ gap: 4 }}>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <span className="row" style={{ gap: 6, fontSize: 12.5, color: 'var(--ink-soft)' }}>
                      <Icon name={sub.icon} size={13} color={`oklch(0.78 0.16 ${sub.hue})`} /> {sub.th}
                    </span>
                    <span className="tech" style={{ fontSize: 12, color: p >= 50 ? 'var(--gold)' : 'var(--muted)' }}>{p >= 50 ? '✦' : ''} {p}%</span>
                  </div>
                  <Bar value={p} color={`oklch(0.74 0.17 ${sub.hue})`} height={6} glow />
                </div>
              );
            })}
          </div>
        )}

        {/* recent awards */}
        {log.length > 0 && (
          <div className="glass col" style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
            <div className="row" style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
              <Icon name="bolt" size={16} color="var(--cyan)" />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: '#fff', marginLeft: 8 }}>รางวัลล่าสุด</span>
            </div>
            {log.map((e, i) => (
              <div key={i} className="row" style={{ padding: '10px 16px', gap: 12, borderBottom: i < log.length - 1 ? '1px solid var(--line-soft)' : 'none',
                background: i % 2 ? 'transparent' : 'var(--surface-2)' }}>
                <span style={{ fontSize: 18 }}>{TYPE_ICON[e.type] || '?'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: TYPE_COLOR[e.type] || '#fff', fontWeight: 700 }}>+{e.amount} {String(e.type||'').toUpperCase()}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{e.note || '—'}</div>
                </div>
                <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', flex: 'none' }}>
                  {e.at ? new Date(e.at).toLocaleString('th-TH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* footer note */}
        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', padding: '8px 0' }}>
          📖 ดูได้อย่างเดียว — ไม่สามารถแก้ไขข้อมูล
        </div>
      </div>
    </div>
  );
}

function StudentPortal() {
  const params = new URLSearchParams(window.location.search);
  const initialId = params.get('portal') || null;
  const [studentId, setStudentId] = React.useState(initialId);

  function select(id) {
    setStudentId(id);
    window.history.pushState({}, '', window.location.pathname + '?portal=' + id);
  }

  if (!studentId) return <StudentPortalPicker onSelect={select} />;
  return <StudentPortalView student={studentId} />;
}

window.StudentPortal = StudentPortal;
