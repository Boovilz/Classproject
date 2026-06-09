/* ============================================================
   GAME — Reward Shop
   ============================================================ */
function RewardShop() {
  const { REWARDS } = window.GC;
  const [coins, setCoins] = React.useState(1480);
  const [stars, setStars] = React.useState(312);
  const [cat, setCat] = React.useState('all');
  const [toast, setToast] = React.useState(null);
  const [owned, setOwned] = React.useState([]);

  const cats = [['all', 'ทั้งหมด'], ['privilege', 'สิทธิพิเศษ'], ['cosmetic', 'ตกแต่งอวตาร'], ['benefit', 'รางวัล']];
  const list = REWARDS.filter(r => cat === 'all' || r.cat === cat);

  const buy = (r) => {
    const bal = r.cur === 'coin' ? coins : stars;
    if (bal < r.cost) { setToast({ ok: false, msg: 'แต้มไม่พอ' }); }
    else {
      if (r.cur === 'coin') setCoins(c => c - r.cost); else setStars(s => s - r.cost);
      setOwned(o => [...o, r.id]);
      setToast({ ok: true, msg: 'แลกรางวัลสำเร็จ! ' + r.th });
    }
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="col" style={{ gap: 18, position: 'relative' }}>
      {/* balance + create */}
      <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '16px 22px', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div className="row" style={{ gap: 14 }}>
          <div className="row" style={{ gap: 9, padding: '10px 18px', borderRadius: 'var(--r-md)', background: 'color-mix(in oklch,var(--gold) 14%,transparent)' }}>
            <Icon name="coin" size={22} color="var(--gold)" />
            <div><div className="display" style={{ fontSize: 22, color: '#fff', lineHeight: 1 }}>{coins.toLocaleString()}</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>เหรียญ</div></div>
          </div>
          <div className="row" style={{ gap: 9, padding: '10px 18px', borderRadius: 'var(--r-md)', background: 'color-mix(in oklch,var(--gold) 14%,transparent)' }}>
            <Icon name="star" size={22} color="var(--gold)" fill="var(--gold)" />
            <div><div className="display" style={{ fontSize: 22, color: '#fff', lineHeight: 1 }}>{stars}</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>ดาว</div></div>
          </div>
        </div>
        <button className="btn btn-neon"><Icon name="plus" size={18} color="#0a0a14" /> สร้างรางวัลใหม่</button>
      </div>

      {/* category filter */}
      <div className="row" style={{ gap: 8 }}>
        {cats.map(([k, t]) => (
          <button key={k} onClick={() => setCat(k)} className="btn" style={{ padding: '8px 16px', fontSize: 13.5,
            background: cat === k ? 'linear-gradient(120deg,var(--cyan),var(--neon))' : 'var(--surface-2)',
            color: cat === k ? '#0a0a14' : 'var(--ink-soft)', boxShadow: 'none' }}>{t}</button>
        ))}
      </div>

      {/* grid */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 16 }}>
        {list.map(r => {
          const isOwned = owned.includes(r.id);
          const color = r.cur === 'coin' ? 'var(--gold)' : 'var(--gold)';
          const hue = { privilege: 270, cosmetic: 305, benefit: 200 }[r.cat];
          return (
            <div key={r.id} className="glass scanlines col" style={{ borderRadius: 'var(--r-lg)', padding: 18, gap: 14, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%', background: `oklch(0.7 0.2 ${hue})`, opacity: .18, filter: 'blur(24px)' }} />
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="center" style={{ width: 54, height: 54, borderRadius: 16, background: `radial-gradient(circle at 40% 30%, oklch(0.7 0.18 ${hue}), oklch(0.42 0.16 ${hue}))` }}>
                  <Icon name={r.icon} size={26} color="#fff" />
                </div>
                <span className="pill tech" style={{ fontSize: 10.5, background: 'var(--surface-2)', color: 'var(--muted)' }}>คงเหลือ {r.stock}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{r.th}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>{cats.find(c => c[0] === r.cat)[1]}</div>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="row" style={{ gap: 6 }}>
                  <Icon name={r.cur} size={18} color={color} fill={r.cur === 'star' ? color : 'none'} />
                  <span className="display" style={{ fontSize: 19, color: '#fff' }}>{r.cost}</span>
                </div>
                <button onClick={() => buy(r)} disabled={isOwned} className="btn" style={{ padding: '8px 14px', fontSize: 13,
                  background: isOwned ? 'var(--surface-2)' : 'linear-gradient(120deg,var(--cyan),var(--neon))',
                  color: isOwned ? 'var(--muted)' : '#0a0a14', boxShadow: 'none' }}>
                  {isOwned ? <><Icon name="check" size={15} color="var(--muted)" /> แลกแล้ว</> : 'แลก'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div className="glass pop row" style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 60,
          borderRadius: 99, padding: '12px 22px', gap: 10, background: toast.ok ? 'color-mix(in oklch,var(--st-present) 30%,#1a1430)' : 'color-mix(in oklch,var(--st-absent) 30%,#1a1430)' }}>
          <Icon name={toast.ok ? 'check' : 'x'} size={19} color={toast.ok ? 'var(--st-present)' : 'var(--st-absent)'} />
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
window.RewardShop = RewardShop;
