/* ============================================================
   SCORE HISTORY — per-student score board + full award log
   ============================================================ */
function ScoreHistory({ openStudent }) {
  const STUDENTS = useStudents();
  const [log, setLog] = React.useState(() => window.GC.getScoreLog());
  const [sort, setSort] = React.useState('level');
  const [search, setSearch] = React.useState('');
  const [tab, setTab] = React.useState('board');

  React.useEffect(() => {
    const h = () => setLog(window.GC.getScoreLog());
    window.addEventListener('gc:score-added', h);
    window.addEventListener('gc:students-changed', h);
    return () => {
      window.removeEventListener('gc:score-added', h);
      window.removeEventListener('gc:students-changed', h);
    };
  }, []);

  // per-student totals derived from score log
  const totalsMap = React.useMemo(() => {
    const m = {};
    log.forEach(e => {
      if (!e.studentId) return;
      if (!m[e.studentId]) m[e.studentId] = { xpEarned: 0, coinEarned: 0, starEarned: 0, entries: 0 };
      const t = m[e.studentId];
      t.entries++;
      if (e.type === 'xp')   t.xpEarned   += (Number(e.amount) || 0);
      else if (e.type === 'coin') t.coinEarned += (Number(e.amount) || 0);
      else if (e.type === 'star') t.starEarned += (Number(e.amount) || 0);
    });
    return m;
  }, [log]);

  const sortFns = {
    level:    (a, b) => (b.game.level * 1000 + b.game.xp) - (a.game.level * 1000 + a.game.xp),
    xpEarned: (a, b) => (totalsMap[b.id]?.xpEarned || 0) - (totalsMap[a.id]?.xpEarned || 0),
    coins:    (a, b) => (b.game.coins || 0) - (a.game.coins || 0),
    stars:    (a, b) => (b.game.stars || 0) - (a.game.stars || 0),
    badges:   (a, b) => (b.badges || 0) - (a.badges || 0),
    entries:  (a, b) => (totalsMap[b.id]?.entries || 0) - (totalsMap[a.id]?.entries || 0),
  };

  const filtered = React.useMemo(() => {
    const q = search.trim();
    return STUDENTS.filter(s =>
      !q || s.name.includes(q) || s.nick.includes(q) || (s.code || '').includes(q)
    );
  }, [STUDENTS, search]);

  const ranked = React.useMemo(() =>
    [...filtered].sort(sortFns[sort] || sortFns.level),
    [filtered, sort, totalsMap]
  );

  const totalXP    = log.filter(e => e.type === 'xp').reduce((a, e) => a + (Number(e.amount) || 0), 0);
  const totalCoins = log.filter(e => e.type === 'coin').reduce((a, e) => a + (Number(e.amount) || 0), 0);
  const totalStars = log.filter(e => e.type === 'star').reduce((a, e) => a + (Number(e.amount) || 0), 0);

  const SORT_OPTS = [
    ['level',    'เลเวล'],
    ['xpEarned', 'XP รับมา'],
    ['coins',    'เหรียญ'],
    ['stars',    'ดาว'],
    ['badges',   'เหรียญตรา'],
    ['entries',  'จำนวนครั้ง'],
  ];

  const TYPE_ICON  = { xp: '⚡', coin: '🪙', star: '⭐' };
  const TYPE_COLOR = { xp: 'var(--cyan)', coin: 'var(--gold)', star: 'var(--gold)' };

  return (
    <div className="col stagger" style={{ gap: 18 }}>

      {/* header */}
      <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '16px 22px', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 22, color: '#fff' }}>📊 ตารางคะแนนรวม</h2>
          <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>คะแนนสะสมจากทุกช่องทาง — บาร์โค้ด · เช็คชื่อ · ห้องโถงรวม</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="row glass-2" style={{ borderRadius: 10, padding: '8px 12px', gap: 7 }}>
            <Icon name="search" size={16} color="var(--muted)" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหา…"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#fff', width: 130, fontFamily: 'var(--font-body)' }} />
          </div>
        </div>
      </div>

      {/* summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          ['bolt',   totalXP.toLocaleString(),   'XP รับทั้งหมด', 'var(--cyan)'],
          ['coin',   totalCoins.toLocaleString(), 'Coin รับทั้งหมด', 'var(--gold)'],
          ['star',   totalStars.toLocaleString(), 'Star รับทั้งหมด', 'var(--gold)'],
          ['report', log.length.toString(),        'ครั้งที่มอบ', 'var(--purple)'],
        ].map(([ic, v, l, c]) => (
          <div key={l} className="glass center col" style={{ borderRadius: 'var(--r-lg)', padding: '18px 10px', gap: 7 }}>
            <Icon name={ic} size={24} color={c} fill={ic === 'star' ? c : 'none'} />
            <div className="display neon-text" style={{ fontSize: 28, color: '#fff' }}>{v}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* tab toggle */}
      <div className="row" style={{ gap: 8 }}>
        {[['board','🏆 ตารางคะแนน'],['log','📋 ประวัติการมอบ']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} className="btn"
            style={{ padding: '9px 20px', fontSize: 14, background: tab === k ? 'linear-gradient(120deg,var(--cyan),var(--neon))' : 'var(--surface-2)', color: tab === k ? '#0a0a14' : 'var(--ink-soft)' }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'board' && (
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {/* sort bar */}
          <div className="row" style={{ padding: '12px 20px', gap: 6, borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center', marginRight: 4 }}>เรียงตาม:</span>
            {SORT_OPTS.map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)} className="btn"
                style={{ padding: '5px 12px', fontSize: 12, background: sort === k ? 'var(--navy)' : 'var(--surface-2)', color: sort === k ? '#fff' : 'var(--ink-soft)' }}>
                {l}
              </button>
            ))}
          </div>
          {/* table header */}
          <div className="row" style={{ padding: '10px 20px', fontSize: 11.5, color: 'var(--muted)', fontWeight: 600, borderBottom: '1px solid var(--line)' }}>
            <div style={{ width: 36 }}>#</div>
            <div style={{ flex: 1 }}>นักเรียน</div>
            <div style={{ width: 90, textAlign: 'center' }}>เลเวล</div>
            <div style={{ width: 90, textAlign: 'center' }}>⚡ XP รับ</div>
            <div style={{ width: 80, textAlign: 'center' }}>XP ปัจจุบัน</div>
            <div style={{ width: 72, textAlign: 'center' }}>🪙 Coin</div>
            <div style={{ width: 72, textAlign: 'center' }}>⭐ Star</div>
            <div style={{ width: 72, textAlign: 'center' }}>🏅 ตรา</div>
            <div style={{ width: 60, textAlign: 'center' }}>ครั้ง</div>
          </div>
          {/* rows */}
          {ranked.map((s, idx) => {
            const t = totalsMap[s.id] || { xpEarned: 0, coinEarned: 0, starEarned: 0, entries: 0 };
            const isTop3 = idx < 3;
            return (
              <div key={s.id} onClick={() => openStudent(s.id)} className="row"
                style={{ padding: '10px 20px', cursor: 'pointer', borderBottom: idx < ranked.length - 1 ? '1px solid var(--line-soft)' : 'none',
                  background: idx % 2 ? 'transparent' : 'var(--surface-2)',
                  transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in oklch,var(--cyan) 6%,transparent)'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 ? 'transparent' : 'var(--surface-2)'}>
                <div style={{ width: 36 }}>
                  <span className="center tech" style={{ display: 'inline-flex', width: 26, height: 26, borderRadius: 8, fontSize: 13, fontWeight: 700,
                    background: isTop3 ? 'linear-gradient(135deg,var(--gold),oklch(0.7 0.16 60))' : 'var(--surface-2)',
                    color: isTop3 ? '#1a1400' : 'var(--muted)' }}>{idx + 1}</span>
                </div>
                <div className="row" style={{ flex: 1, gap: 10, minWidth: 0 }}>
                  <HeroAvatar student={s} size={36} />
                  <div style={{ minWidth: 0 }}>
                    <div className="nowrap" style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>"{s.nick}" {s.code ? '· #' + s.code : ''}</div>
                  </div>
                </div>
                <div style={{ width: 90, textAlign: 'center' }}>
                  <div className="tech" style={{ fontSize: 14, color: 'var(--cyan)' }}>Lv.{s.game.level}</div>
                  <div style={{ marginTop: 4, width: 70, margin: '4px auto 0' }}>
                    <Bar value={s.game.xp} max={s.game.xpMax} color={`oklch(0.78 0.16 ${s.game.hue})`} height={4} />
                  </div>
                </div>
                <div style={{ width: 90, textAlign: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.xpEarned > 0 ? 'var(--cyan)' : 'var(--muted)' }}>
                    {t.xpEarned > 0 ? '+' + t.xpEarned.toLocaleString() : '—'}
                  </span>
                </div>
                <div style={{ width: 80, textAlign: 'center' }}>
                  <span className="tech" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{s.game.xp.toLocaleString()}</span>
                </div>
                <div style={{ width: 72, textAlign: 'center' }}>
                  <span style={{ fontSize: 14, color: s.game.coins > 0 ? 'var(--gold)' : 'var(--muted)' }}>
                    {s.game.coins > 0 ? s.game.coins.toLocaleString() : '—'}
                  </span>
                </div>
                <div style={{ width: 72, textAlign: 'center' }}>
                  <span style={{ fontSize: 14, color: s.game.stars > 0 ? 'var(--gold)' : 'var(--muted)' }}>
                    {s.game.stars > 0 ? s.game.stars : '—'}
                  </span>
                </div>
                <div style={{ width: 72, textAlign: 'center' }}>
                  <span style={{ fontSize: 14, color: s.badges > 0 ? 'var(--cyan)' : 'var(--muted)' }}>
                    {s.badges > 0 ? s.badges : '—'}
                  </span>
                </div>
                <div style={{ width: 60, textAlign: 'center' }}>
                  <span className="tech" style={{ fontSize: 12, color: t.entries > 0 ? 'var(--ink-soft)' : 'var(--muted)' }}>
                    {t.entries > 0 ? t.entries : '—'}
                  </span>
                </div>
              </div>
            );
          })}
          {ranked.length === 0 && (
            <div className="center" style={{ padding: 36, color: 'var(--muted)', fontSize: 14 }}>ไม่พบนักเรียนที่ตรงกัน</div>
          )}
        </div>
      )}

      {tab === 'log' && (
        <div className="glass" style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <div className="row" style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>ประวัติการมอบคะแนนทั้งหมด</span>
            <span className="tech" style={{ fontSize: 12, color: 'var(--muted)' }}>{log.length} รายการ (ล่าสุด 200)</span>
          </div>
          {log.length === 0 && (
            <div className="center" style={{ padding: 40, color: 'var(--muted)', fontSize: 14 }}>ยังไม่มีประวัติ — เริ่มมอบคะแนนเพื่อดูที่นี่</div>
          )}
          <div className="col" style={{ gap: 0 }}>
            {log.map((e, i) => {
              const s = STUDENTS.find(x => x.id === e.studentId);
              return (
                <div key={i} className="row"
                  style={{ padding: '10px 20px', gap: 14, borderBottom: i < log.length - 1 ? '1px solid var(--line-soft)' : 'none',
                    background: i % 2 ? 'transparent' : 'var(--surface-2)', alignItems: 'center' }}>
                  <div style={{ width: 28, textAlign: 'right', fontSize: 12, color: 'var(--muted)', flexShrink: 0 }}>{i + 1}</div>
                  {s ? (
                    <div className="row" style={{ gap: 8, width: 220, cursor: 'pointer' }} onClick={() => openStudent(s.id)}>
                      <HeroAvatar student={s} size={30} />
                      <div style={{ minWidth: 0 }}>
                        <div className="nowrap" style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.nick}</div>
                        <div className="tech" style={{ fontSize: 10, color: 'var(--muted)' }}>Lv.{s.game.level}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: 220, fontSize: 13, color: 'var(--muted)' }}>{e.studentName || '—'}</div>
                  )}
                  <div style={{ width: 110 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: TYPE_COLOR[e.type] || 'var(--cyan)' }}>
                      {TYPE_ICON[e.type] || '?'} +{e.amount} {String(e.type || '').toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-soft)' }}>
                    {e.note || '—'}
                  </div>
                  <div className="tech" style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>
                    {e.at ? new Date(e.at).toLocaleString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
window.ScoreHistory = ScoreHistory;
