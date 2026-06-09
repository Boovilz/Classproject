/* ============================================================
   GAME — Reward Shop
   ============================================================ */
function CreateRewardModal({ onClose }) {
  const [name, setName] = React.useState('');
  const [cat, setCat] = React.useState('benefit');
  const [cur, setCur] = React.useState('coin');
  const [cost, setCost] = React.useState(50);
  const [stock, setStock] = React.useState(5);
  const [err, setErr] = React.useState('');

  const ICON_MAP = { privilege: 'crown', cosmetic: 'frame', benefit: 'gift' };

  function save() {
    if (!name.trim()) { setErr('กรุณาใส่ชื่อรางวัล'); return; }
    window.GC.addCustomReward({ th: name.trim(), cat, cur, cost: Number(cost), stock: Number(stock), icon: ICON_MAP[cat] });
    onClose();
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(8,6,18,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} className="glass pop col" style={{ width: 'min(440px,96vw)', borderRadius: 'var(--r-xl)', padding: 28, gap: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 18, color: '#fff' }}>สร้างรางวัลใหม่</h3>
          <button onClick={onClose} className="center" style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: 'var(--surface-2)', cursor: 'pointer', color: 'var(--ink-soft)' }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="col" style={{ gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 5 }}>ชื่อรางวัล *</div>
            <input value={name} onChange={e => { setName(e.target.value); setErr(''); }}
              placeholder="เช่น นั่งข้างหน้า 1 วัน…"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface-2)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }} />
            {err && <div style={{ fontSize: 12, color: 'var(--st-absent)', marginTop: 4 }}>{err}</div>}
          </div>

          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 5 }}>หมวดหมู่</div>
            <div className="row" style={{ gap: 6 }}>
              {[['privilege','สิทธิพิเศษ'],['cosmetic','ตกแต่งอวตาร'],['benefit','รางวัล']].map(([k,l]) => (
                <button key={k} onClick={() => setCat(k)} className="btn"
                  style={{ flex: 1, padding: '8px 4px', fontSize: 13, background: cat === k ? 'var(--navy)' : 'var(--surface-2)', color: cat === k ? '#fff' : 'var(--ink-soft)' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 5 }}>สกุล</div>
              <div className="row" style={{ gap: 6 }}>
                {[['coin','🪙'],['star','⭐']].map(([k,l]) => (
                  <button key={k} onClick={() => setCur(k)} className="btn"
                    style={{ flex: 1, padding: '8px', fontSize: 15, background: cur === k ? 'color-mix(in oklch,var(--gold) 25%,var(--navy))' : 'var(--surface-2)', color: cur === k ? 'var(--gold)' : 'var(--ink-soft)' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 5 }}>ราคา</div>
              <input type="number" value={cost} onChange={e => setCost(e.target.value)} min={1}
                style={{ width: '100%', padding: '9px 10px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface-2)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 5 }}>จำนวนคงเหลือ</div>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} min={1}
                style={{ width: '100%', padding: '9px 10px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface-2)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>

        <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={onClose} className="btn" style={{ padding: '10px 18px', color: 'var(--muted)' }}>ยกเลิก</button>
          <button onClick={save} className="btn btn-neon" style={{ padding: '10px 22px', fontSize: 14 }}>
            <Icon name="plus" size={16} color="#0a0a14" /> สร้างรางวัล
          </button>
        </div>
      </div>
    </div>
  );
}

function RewardShop() {
  const { REWARDS } = window.GC;
  const STUDENTS = useStudents();

  // class totals — reactive on gc:students-changed
  const [totals, setTotals] = React.useState(() => window.GC.getClassTotals());
  React.useEffect(() => {
    const h = () => setTotals(window.GC.getClassTotals());
    window.addEventListener('gc:students-changed', h);
    return () => window.removeEventListener('gc:students-changed', h);
  }, []);

  // custom rewards — reactive on gc:rewards-changed
  const [customRewards, setCustomRewards] = React.useState(() => window.GC.getCustomRewards());
  React.useEffect(() => {
    const h = () => setCustomRewards(window.GC.getCustomRewards());
    window.addEventListener('gc:rewards-changed', h);
    return () => window.removeEventListener('gc:rewards-changed', h);
  }, []);

  const allRewards = [...REWARDS, ...customRewards];
  const [cat, setCat] = React.useState('all');
  const [toast, setToast] = React.useState(null);
  const [owned, setOwned] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('gcos.shop.owned')) || []; } catch { return []; }
  });
  const [showCreate, setShowCreate] = React.useState(false);

  const cats = [['all', 'ทั้งหมด'], ['privilege', 'สิทธิพิเศษ'], ['cosmetic', 'ตกแต่งอวตาร'], ['benefit', 'รางวัล']];
  const list = allRewards.filter(r => cat === 'all' || r.cat === cat);

  const buy = (r) => {
    const bal = r.cur === 'coin' ? totals.coins : totals.stars;
    if (bal < r.cost) {
      setToast({ ok: false, msg: `แต้มไม่พอ (มี ${bal.toLocaleString()} ต้องการ ${r.cost})` });
    } else {
      // deduct from students proportionally (simplest: deduct from top student)
      const ss = window.GC.getStudents().filter(s => r.cur === 'coin' ? s.game.coins >= 1 : s.game.stars >= 1);
      let remaining = r.cost;
      for (const s of ss) {
        if (remaining <= 0) break;
        const have = r.cur === 'coin' ? s.game.coins : s.game.stars;
        const take = Math.min(have, remaining);
        const game = { ...s.game };
        if (r.cur === 'coin') game.coins = game.coins - take;
        else game.stars = game.stars - take;
        window.GC.updateStudent(s.id, { game });
        remaining -= take;
      }
      const newOwned = [...owned, r.id];
      setOwned(newOwned);
      localStorage.setItem('gcos.shop.owned', JSON.stringify(newOwned));
      setToast({ ok: true, msg: 'แลกรางวัลสำเร็จ! ' + r.th });
    }
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="col" style={{ gap: 18, position: 'relative' }}>
      {showCreate && <CreateRewardModal onClose={() => setShowCreate(false)} />}

      {/* balance + create */}
      <div className="glass row" style={{ borderRadius: 'var(--r-lg)', padding: '16px 22px', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div className="row" style={{ gap: 14 }}>
          <div className="row" style={{ gap: 9, padding: '10px 18px', borderRadius: 'var(--r-md)', background: 'color-mix(in oklch,var(--gold) 14%,transparent)' }}>
            <Icon name="coin" size={22} color="var(--gold)" />
            <div>
              <div className="display" style={{ fontSize: 22, color: '#fff', lineHeight: 1 }}>{totals.coins.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>เหรียญ (รวมห้อง)</div>
            </div>
          </div>
          <div className="row" style={{ gap: 9, padding: '10px 18px', borderRadius: 'var(--r-md)', background: 'color-mix(in oklch,var(--gold) 14%,transparent)' }}>
            <Icon name="star" size={22} color="var(--gold)" fill="var(--gold)" />
            <div>
              <div className="display" style={{ fontSize: 22, color: '#fff', lineHeight: 1 }}>{totals.stars.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>ดาว (รวมห้อง)</div>
            </div>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn btn-neon">
          <Icon name="plus" size={18} color="#0a0a14" /> สร้างรางวัลใหม่
        </button>
      </div>

      {/* category filter */}
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
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
          const color = 'var(--gold)';
          const hue = { privilege: 270, cosmetic: 305, benefit: 200 }[r.cat] || 160;
          return (
            <div key={r.id} className="glass scanlines col" style={{ borderRadius: 'var(--r-lg)', padding: 18, gap: 14, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%', background: `oklch(0.7 0.2 ${hue})`, opacity: .18, filter: 'blur(24px)' }} />
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="center" style={{ width: 54, height: 54, borderRadius: 16, background: `radial-gradient(circle at 40% 30%, oklch(0.7 0.18 ${hue}), oklch(0.42 0.16 ${hue}))` }}>
                  <Icon name={r.icon || 'gift'} size={26} color="#fff" />
                </div>
                <span className="pill tech" style={{ fontSize: 10.5, background: 'var(--surface-2)', color: 'var(--muted)' }}>คงเหลือ {r.stock}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{r.th}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>{cats.find(c => c[0] === r.cat)?.[1]}</div>
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
