/* ============================================================
   STUDENT PROFILE — full avatar card detail (overlay)
   ============================================================ */
function StudentProfile({ studentId, onClose, openStudent }) {
  const STUDENTS = useStudents();
  const { SUBJECTS, STATUSES, RANKS } = window.GC;
  const s = STUDENTS.find(x => x.id === studentId);

  const [attSummary, setAttSummary] = React.useState(null);
  const [streak, setStreak] = React.useState(0);
  const [awardType, setAwardType] = React.useState('xp');
  const [awardAmt, setAwardAmt] = React.useState(20);
  const [showAward, setShowAward] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    if (!studentId) return;
    setAttSummary(window.GC.getStudentAttendanceSummary(studentId));
    setStreak(window.GC.getStudentStreak(studentId));
  }, [studentId]);

  if (!s) return null;
  const r = RANKS[s.game.rankIdx];
  const hue = s.game.hue;
  const stat = STATUSES[s.status];
  const title = window.GC.getTitleForStudent(s);
  const ranked = [...STUDENTS].sort((a, b) => (b.game.level * 1000 + b.game.xp) - (a.game.level * 1000 + a.game.xp));
  const myRank = ranked.findIndex(x => x.id === s.id) + 1;
  const unlocked = SUBJECTS.filter(sub => s.game.territories[sub.key] >= 50).length;

  function doAward() {
    if (awardType === 'badge') {
      window.GC.updateStudent(s.id, { badges: (s.badges || 0) + 1 });
      showToast('มอบเหรียญตราให้ ' + s.nick + ' สำเร็จ!');
    } else {
      window.GC.addScoreLog({ studentId: s.id, studentName: s.name, type: awardType, amount: awardAmt, note: 'จากการ์ดโปรไฟล์' });
      showToast(`+${awardAmt} ${awardType.toUpperCase()} → ${s.nick}`);
    }
    setShowAward(false);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const attItems = attSummary
    ? [['มา', (attSummary.present || 0) + (attSummary.late || 0), 'var(--st-present)'],
       ['สาย', attSummary.late || 0, 'var(--st-late)'],
       ['ป่วย', attSummary.sick || 0, 'var(--st-sick)'],
       ['ขาด', attSummary.absent || 0, 'var(--st-absent)']]
    : [['มา', '…', 'var(--st-present)'], ['สาย', '…', 'var(--st-late)'], ['ป่วย', '…', 'var(--st-sick)'], ['ขาด', '…', 'var(--st-absent)']];

  return (
    <div data-world="game" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(8,6,18,0.72)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} className="glass pop scroll" style={{ width: 'min(960px,96vw)', maxHeight: '92vh', borderRadius: 'var(--r-xl)', overflow: 'auto', position: 'relative',
        background: 'rgba(24,18,46,0.92)' }}>
        {/* toast */}
        {toast && (
          <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 999,
            background: 'linear-gradient(120deg,var(--gold),oklch(0.72 0.16 55))', color: '#1a1200',
            padding: '10px 22px', borderRadius: 99, fontWeight: 700, fontSize: 14,
            boxShadow: '0 8px 32px -8px var(--gold)', animation: 'rise .2s ease-out' }}>
            ⚡ {toast}
          </div>
        )}
        {/* banner */}
        <div style={{ position: 'relative', padding: '28px 32px', overflow: 'hidden',
          background: `linear-gradient(120deg, oklch(0.5 0.2 ${hue}), oklch(0.4 0.18 ${(hue + 50) % 360}))` }}>
          <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', top: -60, right: 40, width: 200, height: 200, borderRadius: '50%', background: '#fff', opacity: .12, filter: 'blur(30px)' }} />
          <button onClick={onClose} className="center" style={{ position: 'absolute', top: 18, right: 18, width: 38, height: 38, borderRadius: 12, cursor: 'pointer', border: 'none', background: 'rgba(0,0,0,.25)', color: '#fff', zIndex: 5 }}>
            <Icon name="x" size={20} color="#fff" />
          </button>
          <div className="row" style={{ gap: 24, position: 'relative', alignItems: 'flex-end' }}>
            <div className="float"><HeroAvatar student={s} size={140} glow ring="rgba(255,255,255,.7)" /></div>
            <div style={{ flex: 1, paddingBottom: 6 }}>
              <div className="row" style={{ gap: 8 }}>
                <span className="pill tech" style={{ background: 'rgba(0,0,0,.25)', color: '#fff', letterSpacing: '.1em' }}>เลขที่ {s.no}</span>
                <span className="pill" style={{ background: 'color-mix(in oklch,' + stat.color + ' 30%,#000)', color: '#fff' }}>
                  <span className="dot" style={{ background: '#fff' }} /> {stat.th}
                </span>
              </div>
              <h2 style={{ fontSize: 34, color: '#fff', marginTop: 10, lineHeight: 1.05 }}>{s.name}</h2>
              <div className="row" style={{ gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                <RankBadge rank={s.game.rank} />
                <span className="pill tech" style={{ background: 'rgba(0,0,0,.22)', color: '#fff' }}>Lv.{s.game.level} · {s.game.tier.th}</span>
                <span className="pill tech" style={{ background: 'rgba(0,0,0,.22)', color: '#fff' }}>อันดับ #{myRank}</span>
                <span className="pill" style={{ background: `color-mix(in oklch,oklch(0.7 0.16 ${title.hue}) 30%,rgba(0,0,0,.2))`, color: `oklch(0.92 0.12 ${title.hue})`, fontWeight: 700 }}>
                  <Icon name={title.icon} size={12} color={`oklch(0.92 0.12 ${title.hue})`} /> {title.th}
                </span>
                {streak > 0 && (
                  <span className="pill" style={{ background: 'color-mix(in oklch,oklch(0.7 0.2 30) 30%,rgba(0,0,0,.2))', color: 'oklch(0.92 0.18 45)', fontWeight: 700 }}>
                    🔥 Streak ×{streak}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* xp bar */}
          <div style={{ position: 'relative', marginTop: 20 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="tech" style={{ fontSize: 12.5, color: 'rgba(255,255,255,.85)' }}>XP สู่เลเวลถัดไป</span>
              <span className="tech" style={{ fontSize: 12.5, color: '#fff' }}>{s.game.xp} / {s.game.xpMax}</span>
            </div>
            <div className="bar" style={{ height: 12, background: 'rgba(0,0,0,.25)' }}>
              <i style={{ width: (s.game.xp / s.game.xpMax * 100) + '%', background: 'linear-gradient(90deg,#fff,rgba(255,255,255,.7))' }} />
            </div>
          </div>
        </div>

        {/* body */}
        <div style={{ padding: 28 }}>
          {/* stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 22 }}>
            {[['star', s.game.stars, 'ดาว', 'var(--gold)'], ['coin', s.game.coins, 'เหรียญ', 'var(--gold)'], ['trophy', s.badges, 'เหรียญตรา', 'var(--cyan)'], ['map', unlocked + '/8', 'ดินแดน', 'var(--purple)']].map(([ic, v, l, c]) => (
              <div key={l} className="center col glass-2" style={{ padding: '16px 8px', borderRadius: 'var(--r-md)', gap: 6 }}>
                <Icon name={ic} size={22} color={c} fill={ic === 'star' ? c : 'none'} />
                <div className="display" style={{ fontSize: 24, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{l}</div>
              </div>
            ))}
            <div className="center col glass-2" style={{ padding: '16px 8px', borderRadius: 'var(--r-md)', gap: 6,
              background: streak > 0 ? 'color-mix(in oklch,oklch(0.6 0.2 30) 14%,transparent)' : undefined,
              border: streak > 0 ? '1px solid oklch(0.6 0.2 30 / .35)' : undefined }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <div className="display" style={{ fontSize: 24, color: streak > 0 ? 'oklch(0.88 0.18 45)' : 'var(--muted)' }}>{streak}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Streak</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            {/* territory progress */}
            <div>
              <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 12 }}>ความคืบหน้าดินแดนความรู้</h4>
              <div className="col" style={{ gap: 11 }}>
                {SUBJECTS.map(sub => {
                  const p = s.game.territories[sub.key];
                  return (
                    <div key={sub.key} className="col" style={{ gap: 5 }}>
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <span className="row" style={{ gap: 7, fontSize: 12.5, color: 'var(--ink-soft)' }}>
                          <Icon name={sub.icon} size={15} color={`oklch(0.78 0.16 ${sub.hue})`} /> {sub.th}
                        </span>
                        <span className="tech" style={{ fontSize: 12, color: p >= 100 ? 'var(--gold)' : 'var(--muted)' }}>{p >= 100 ? 'ปลดล็อก ✦' : p + '%'}</span>
                      </div>
                      <Bar value={p} color={`oklch(0.74 0.17 ${sub.hue})`} height={7} glow />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* health + attendance summary */}
            <div className="col" style={{ gap: 16 }}>
              <div>
                <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 12 }}>สรุปสุขภาพ</h4>
                <div className="row" style={{ gap: 10 }}>
                  {[['scale', s.health.w + ' กก.', 'น้ำหนัก'], ['ruler', s.health.h + ' ซม.', 'ส่วนสูง'], ['heart', s.health.bmi, 'BMI']].map(([ic, v, l]) => (
                    <div key={l} className="center col glass-2" style={{ flex: 1, padding: '12px 4px', borderRadius: 'var(--r-md)', gap: 3 }}>
                      <Icon name={ic} size={17} color="var(--cyan)" />
                      <div className="display" style={{ fontSize: 16, color: '#fff' }}>{v}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div className="row glass-2" style={{ marginTop: 10, padding: '10px 14px', borderRadius: 'var(--r-md)', gap: 8, justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>ภาวะโภชนาการ</span>
                  <span className="pill" style={{ background: 'color-mix(in oklch,var(--st-present) 22%,transparent)', color: 'var(--st-present)' }}>{s.health.nutrition}</span>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 15, color: '#fff', marginBottom: 12 }}>สรุปการมาเรียน (ปีการศึกษา)</h4>
                <div className="row glass-2" style={{ borderRadius: 'var(--r-md)', padding: 14, gap: 6 }}>
                  {attItems.map(([l, v, c]) => (
                    <div key={l} className="center col" style={{ flex: 1, gap: 4 }}>
                      <div className="display" style={{ fontSize: 22, color: c }}>{v}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* QR code — record / check-in */}
          <div className="row glass-2" style={{ marginTop: 22, padding: 16, borderRadius: 'var(--r-md)', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <QRCodeBox value={`${location.origin}${location.pathname}?portal=${s.id}`} size={92} />
            <div style={{ flex: 1, minWidth: 160 }}>
              <h4 style={{ fontSize: 14, color: '#fff', marginBottom: 4 }}>QR Code บันทึกข้อมูลนักเรียน</h4>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                สแกนเพื่อเปิดหน้าข้อมูล ({s.nick} · เลขที่ {s.no}) — ใช้สำหรับเช็คชื่อ/บันทึกคะแนนผ่านมือถือของนักเรียนเอง
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="col" style={{ gap: 12, marginTop: 24 }}>
            <div className="row" style={{ gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button onClick={() => { setAwardType('xp'); setAwardAmt(20); setShowAward(t => !t); }} className="btn btn-ghost"
                style={{ background: showAward && awardType !== 'badge' ? 'color-mix(in oklch,var(--cyan) 20%,transparent)' : undefined }}>
                <Icon name="bolt" size={17} color="var(--cyan)" /> ให้ XP
              </button>
              <button onClick={() => { setAwardType('star'); setAwardAmt(1); setShowAward(t => !t); }} className="btn btn-ghost"
                style={{ background: showAward && awardType === 'star' ? 'color-mix(in oklch,var(--gold) 20%,transparent)' : undefined }}>
                <Icon name="star" size={17} color="var(--gold)" /> ให้ดาว
              </button>
              <button onClick={() => { setAwardType('badge'); setShowAward(false); doAward(); }} className="btn btn-neon">
                <Icon name="trophy" size={17} color="#0a0a14" /> มอบเหรียญตรา
              </button>
            </div>

            {/* inline award panel */}
            {showAward && awardType !== 'badge' && (
              <div className="glass-2 row pop" style={{ borderRadius: 'var(--r-md)', padding: '14px 18px', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end',
                borderLeft: '3px solid var(--gold)', animation: 'rise .18s ease-out' }}>
                <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
                  มอบ {awardType === 'xp' ? '⚡ XP' : awardType === 'coin' ? '🪙 Coin' : '⭐ Star'} ให้ {s.nick}
                </span>
                <div className="row" style={{ gap: 4 }}>
                  {[['xp','⚡ XP'],['coin','🪙 Coin'],['star','⭐ Star']].map(([t,l]) => (
                    <button key={t} onClick={() => setAwardType(t)} className="btn"
                      style={{ padding: '5px 11px', fontSize: 12, background: awardType === t ? 'var(--navy)' : 'var(--surface-2)', color: awardType === t ? '#fff' : 'var(--ink-soft)' }}>
                      {l}
                    </button>
                  ))}
                </div>
                <div className="row" style={{ gap: 4 }}>
                  {(awardType === 'star' ? [1,2,3,5] : [10,20,50,100]).map(v => (
                    <button key={v} onClick={() => setAwardAmt(v)} className="btn"
                      style={{ padding: '5px 10px', fontSize: 12, background: awardAmt === v ? 'var(--gold)' : 'var(--surface-2)', color: awardAmt === v ? '#1a1200' : 'var(--ink-soft)' }}>
                      +{v}
                    </button>
                  ))}
                </div>
                <button onClick={doAward} className="btn"
                  style={{ padding: '8px 18px', fontSize: 13, background: 'linear-gradient(120deg,var(--gold),oklch(0.72 0.16 55))', color: '#1a1200', fontWeight: 700 }}>
                  มอบ +{awardAmt}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
window.StudentProfile = StudentProfile;
