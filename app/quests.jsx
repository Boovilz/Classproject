/* ============================================================
   QUEST BOARD — daily / weekly / season quests + claim flow
   ============================================================ */
function QuestBoard() {
  const { QUESTS } = window.GC;
  const STUDENTS = useStudents();
  const [tab, setTab] = React.useState('daily');
  const [claimed, setClaimed] = React.useState({});
  const [toast, setToast] = React.useState(null);

  // compute real cur values from live data
  const liveCur = React.useMemo(() => {
    const log = window.GC.getScoreLog();
    const totals = window.GC.getClassTotals();
    const avgMath = STUDENTS.length
      ? Math.round(STUDENTS.reduce((a, s) => a + (s.game.territories.math || 0), 0) / STUDENTS.length)
      : 0;
    const hofCount = STUDENTS.filter(s => s.game.level >= 5).length;
    const weekXP = Math.min(200, Math.round(totals.classXP / 100));
    return {
      d1: STUDENTS.filter(s => s.status === 'present').length > 0 ? 1 : 0,
      d2: Math.min(3, log.filter(e => e.type === 'xp' && e.amount <= 30).length % 4),
      d3: STUDENTS.filter(s => s.game.stars > 0).length > 0 ? 1 : 0,
      d4: 0,
      w1: Math.min(5, STUDENTS.filter(s => s.status === 'present').length > 0 ? 3 : 0),
      w2: 0,
      w3: weekXP,
      s1: avgMath,
      s2: 0,
      s3: Math.min(3, hofCount),
    };
  }, [STUDENTS]);

  const tabs = [['daily', 'รายวัน', 'รีเซ็ตทุกเช้า'], ['weekly', 'รายสัปดาห์', 'รีเซ็ตวันจันทร์'], ['season', 'ฤดูกาล', '45 วัน']];
  const list = QUESTS[tab].map(q => ({ ...q, cur: liveCur[q.id] ?? q.cur }));
  const rewardLabel = (r) => r.xp ? `+${r.xp} XP` : r.star ? `+${r.star} ดาว` : r.coin ? `+${r.coin} เหรียญ` : r.badge;
  const rewardIcon = (r) => r.xp ? 'bolt' : r.star ? 'star' : r.coin ? 'coin' : 'trophy';

  const claim = (q) => {
    setClaimed(c => ({ ...c, [q.id]: true }));
    setToast(`รับรางวัล: ${rewardLabel(q.reward)}`);
    setTimeout(() => setToast(null), 1800);
  };

  const doneCount = list.filter(q => q.cur >= q.max).length;

  return (
    <div className="col stagger" style={{ gap: 18, position: 'relative' }}>
      {/* header */}
      <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '16px 22px', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 22, color: '#fff' }}>📜 กระดานเควสต์</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>ทำภารกิจเพื่อรับ XP ดาว เหรียญ และเหรียญตรา</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {tabs.map(([k, t, s]) => (
            <button key={k} onClick={() => setTab(k)} className="btn col" style={{ padding: '8px 18px', fontSize: 13.5, gap: 0, alignItems: 'flex-start',
              background: tab === k ? 'linear-gradient(120deg,var(--cyan),var(--neon))' : 'var(--surface-2)',
              color: tab === k ? '#0a0a14' : 'var(--ink-soft)', boxShadow: 'none' }}>
              {t}<span style={{ fontSize: 10, opacity: .7, fontWeight: 400 }}>{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* progress summary */}
      <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '14px 22px', gap: 16, alignItems: 'center' }}>
        <div className="center" style={{ width: 48, height: 48, borderRadius: 14, background: 'color-mix(in oklch,var(--gold) 16%,transparent)' }}>
          <Icon name="report" size={24} color="var(--gold)" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>ภารกิจ{tabs.find(t => t[0] === tab)[1]}สำเร็จ</span>
            <span className="tech" style={{ fontSize: 14, color: 'var(--cyan)' }}>{doneCount}/{list.length}</span>
          </div>
          <Bar value={doneCount} max={list.length} color="linear-gradient(90deg,var(--cyan),var(--purple))" height={10} glow />
        </div>
      </div>

      {/* quest grid */}
      <div key={tab} className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
        {list.map(q => {
          const done = q.cur >= q.max;
          const isClaimed = claimed[q.id];
          const pct = Math.round((q.cur / q.max) * 100);
          return (
            <div key={q.id} className="glass scanlines" style={{ borderRadius: 'var(--r-lg)', padding: 18, position: 'relative', overflow: 'hidden',
              opacity: isClaimed ? 0.6 : 1 }}>
              <div style={{ position: 'absolute', top: -28, right: -28, width: 100, height: 100, borderRadius: '50%', background: done ? 'var(--st-present)' : 'var(--cyan)', opacity: .14, filter: 'blur(22px)' }} />
              <div className="row" style={{ gap: 13, marginBottom: 14 }}>
                <div className="center" style={{ width: 48, height: 48, borderRadius: 14, flex: 'none',
                  background: done ? 'color-mix(in oklch,var(--st-present) 20%,transparent)' : 'var(--surface-2)' }}>
                  <Icon name={done ? 'check' : q.icon} size={24} color={done ? 'var(--st-present)' : 'var(--cyan)'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{q.th}</div>
                  <span className="pill" style={{ marginTop: 5, fontSize: 11, background: 'color-mix(in oklch,var(--gold) 16%,transparent)', color: 'var(--gold)' }}>
                    <Icon name={rewardIcon(q.reward)} size={12} color="var(--gold)" /> {rewardLabel(q.reward)}
                  </span>
                </div>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="tech" style={{ fontSize: 11, color: 'var(--muted)' }}>{q.cur}/{q.max}</span>
                <span className="tech" style={{ fontSize: 11, color: done ? 'var(--st-present)' : 'var(--muted)' }}>{pct}%</span>
              </div>
              <Bar value={q.cur} max={q.max} color={done ? 'var(--st-present)' : `linear-gradient(90deg,var(--cyan),var(--neon))`} glow={done} />
              <button onClick={() => done && !isClaimed && claim(q)} disabled={!done || isClaimed} className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '10px', fontSize: 13.5,
                background: isClaimed ? 'var(--surface-2)' : done ? 'linear-gradient(120deg,var(--cyan),var(--neon))' : 'var(--surface-2)',
                color: isClaimed ? 'var(--muted)' : done ? '#0a0a14' : 'var(--muted)', boxShadow: 'none', cursor: done && !isClaimed ? 'pointer' : 'default' }}>
                {isClaimed ? <><Icon name="check" size={16} color="var(--muted)" /> รับแล้ว</> : done ? <><Icon name="gift" size={16} color="#0a0a14" /> รับรางวัล</> : 'ยังไม่สำเร็จ'}
              </button>
            </div>
          );
        })}
      </div>

      {toast && (
        <div className="glass pop row" style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 60,
          borderRadius: 99, padding: '12px 22px', gap: 10, background: 'color-mix(in oklch,var(--st-present) 30%,#1a1430)' }}>
          <Icon name="trophy" size={19} color="var(--gold)" />
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{toast}</span>
        </div>
      )}
    </div>
  );
}
window.QuestBoard = QuestBoard;
