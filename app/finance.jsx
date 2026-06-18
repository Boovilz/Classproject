/* ============================================================
   CLASSROOM FINANCE — student savings + income/expense ledger
   ============================================================ */
function SavingsModal({ student, onClose }) {
  const [form, setForm] = React.useState({ kind: 'deposit', amount: '50', note: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };

  function submit(e) {
    e.preventDefault();
    const amt = +form.amount;
    if (!amt) return;
    window.GC.addSavingsTxn({ studentId: student.id, kind: form.kind, amount: amt, note: form.note });
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 16, width: 360, maxWidth: '90vw' }}>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <HeroAvatar student={student} size={48} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{student.nick} · {student.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>บัญชีออมทรัพย์นักเรียน</div>
          </div>
        </div>
        <form onSubmit={submit} className="col" style={{ gap: 13 }}>
          <div className="row" style={{ gap: 8 }}>
            {[['deposit', 'ฝากเงิน'], ['withdraw', 'ถอนเงิน']].map(([k, l]) => (
              <button key={k} type="button" onClick={() => set('kind', k)} className="btn"
                style={{ flex: 1, fontSize: 13, padding: '9px 12px', boxShadow: 'none',
                  background: form.kind === k ? (k === 'deposit' ? 'var(--emerald)' : 'var(--orange)') : 'var(--surface-2)',
                  color: form.kind === k ? '#fff' : 'var(--ink-soft)' }}>{l}</button>
            ))}
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>จำนวนเงิน (บาท)</label>
            <input {...inp} type="number" min="1" value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>หมายเหตุ</label>
            <input {...inp} placeholder="เช่น ออมทรัพย์ประจำสัปดาห์" value={form.note} onChange={e => set('note', e.target.value)} />
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="check" size={15} /> บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LedgerModal({ onClose }) {
  const { FINANCE_CATEGORIES } = window.GC;
  const [form, setForm] = React.useState({ type: 'income', category: FINANCE_CATEGORIES.income[0].key, amount: '100', note: '', date: '2026-05-29' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { style: { width: '100%', padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--surface-2)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box' } };
  const cats = FINANCE_CATEGORIES[form.type];

  function submit(e) {
    e.preventDefault();
    const amt = +form.amount;
    if (!amt) return;
    window.GC.addLedgerEntry({ type: form.type, category: form.category, amount: amt, note: form.note, date: form.date });
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 28, gap: 16, width: 380, maxWidth: '90vw' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>บันทึกรายรับ-รายจ่ายห้องเรียน</div>
        <form onSubmit={submit} className="col" style={{ gap: 13 }}>
          <div className="row" style={{ gap: 8 }}>
            {[['income', 'รายรับ'], ['expense', 'รายจ่าย']].map(([k, l]) => (
              <button key={k} type="button" onClick={() => setForm(f => ({ ...f, type: k, category: FINANCE_CATEGORIES[k][0].key }))}
                className="btn" style={{ flex: 1, fontSize: 13, padding: '9px 12px', boxShadow: 'none',
                  background: form.type === k ? (k === 'income' ? 'var(--emerald)' : 'var(--st-absent)') : 'var(--surface-2)',
                  color: form.type === k ? '#fff' : 'var(--ink-soft)' }}>{l}</button>
            ))}
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>หมวดหมู่</label>
            <select {...inp} value={form.category} onChange={e => set('category', e.target.value)}>
              {cats.map(c => <option key={c.key} value={c.key}>{c.th}</option>)}
            </select>
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>จำนวนเงิน (บาท)</label>
            <input {...inp} type="number" min="1" value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>
          <div className="col" style={{ gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>รายละเอียด</label>
            <input {...inp} placeholder="เช่น ขายของในงานกีฬาสี" value={form.note} onChange={e => set('note', e.target.value)} />
          </div>
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">ยกเลิก</button>
            <button type="submit" className="btn" style={{ background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="check" size={15} /> บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClassroomFinance() {
  const STUDENTS = useStudents();
  const [tab, setTab] = React.useState('savings'); // savings | ledger
  const [savings, setSavings] = React.useState(() => window.GC.getSavingsBalances());
  const [ledger, setLedger] = React.useState(() => window.GC.getLedger());
  const [summary, setSummary] = React.useState(() => window.GC.getFinanceSummary());
  const [savingsTarget, setSavingsTarget] = React.useState(null);
  const [showLedgerModal, setShowLedgerModal] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => { setSavings(window.GC.getSavingsBalances()); setLedger(window.GC.getLedger()); setSummary(window.GC.getFinanceSummary()); };
    window.addEventListener('gc:finance-changed', refresh);
    return () => window.removeEventListener('gc:finance-changed', refresh);
  }, []);

  return (
    <div className="col stagger" style={{ gap: 20 }}>
      {/* summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <Stat icon="coin" label="ยอดออมรวมนักเรียน" value={summary.totalSavings.toLocaleString() + ' บ.'} sub={STUDENTS.length + ' บัญชี'} color="var(--royal)" />
        <Stat icon="report" label="รายรับห้องเรียนรวม" value={summary.income.toLocaleString() + ' บ.'} sub="ตั้งแต่เปิดเทอม" color="var(--emerald)" />
        <Stat icon="card" label="รายจ่ายห้องเรียนรวม" value={summary.expense.toLocaleString() + ' บ.'} sub="ตั้งแต่เปิดเทอม" color="var(--orange)" />
        <Stat icon="bolt" label="คงเหลือสุทธิ" value={summary.net.toLocaleString() + ' บ.'} sub={summary.net >= 0 ? 'สถานะปกติ' : 'ต้องตรวจสอบ'} color={summary.net >= 0 ? 'var(--emerald)' : 'var(--st-absent)'} />
      </div>

      {/* tabs */}
      <div className="row" style={{ gap: 8 }}>
        {[['savings', 'บัญชีออมทรัพย์นักเรียน'], ['ledger', 'รายรับ-รายจ่ายห้องเรียน']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="btn" style={{ padding: '8px 16px', fontSize: 13.5,
            background: tab === k ? 'linear-gradient(120deg,var(--royal),var(--royal-2))' : 'var(--surface-2)',
            color: tab === k ? '#fff' : 'var(--ink-soft)', boxShadow: 'none' }}>{l}</button>
        ))}
      </div>

      {tab === 'savings' && (
        <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 20, gap: 4 }}>
          {savings.map(({ student, balance }) => (
            <div key={student.id} className="row" style={{ gap: 12, padding: '10px 6px', borderRadius: 'var(--r-md)', borderBottom: '1px solid var(--line-soft)' }}>
              <HeroAvatar student={student} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="nowrap" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{student.nick} · {student.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>เลขที่ {student.no}</div>
              </div>
              <div className="display" style={{ fontSize: 16, color: 'var(--royal)', minWidth: 90, textAlign: 'right' }}>{balance.toLocaleString()} บ.</div>
              <button onClick={() => setSavingsTarget(student)} className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12.5 }}>
                <Icon name="coin" size={14} /> ฝาก/ถอน
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'ledger' && (
        <div className="glass col" style={{ borderRadius: 'var(--r-xl)', padding: 20, gap: 14 }}>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button onClick={() => setShowLedgerModal(true)} className="btn" style={{ fontSize: 13, background: 'linear-gradient(120deg,var(--royal),var(--royal-2))', color: '#fff' }}>
              <Icon name="plus" size={15} /> บันทึกรายการ
            </button>
          </div>
          <div className="col" style={{ gap: 6 }}>
            {ledger.map(e => (
              <div key={e.id} className="row" style={{ gap: 12, padding: '9px 12px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', alignItems: 'center' }}>
                <div className="center" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: e.type === 'income' ? 'color-mix(in oklch,var(--emerald) 16%,transparent)' : 'color-mix(in oklch,var(--st-absent) 16%,transparent)' }}>
                  <Icon name={e.type === 'income' ? 'arrowRight' : 'card'} size={16} color={e.type === 'income' ? 'var(--emerald)' : 'var(--st-absent)'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nowrap" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{e.note}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{e.date}</div>
                </div>
                <div className="display" style={{ fontSize: 14.5, color: e.type === 'income' ? 'var(--emerald)' : 'var(--st-absent)' }}>
                  {e.type === 'income' ? '+' : '-'}{Number(e.amount).toLocaleString()} บ.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savingsTarget && <SavingsModal student={savingsTarget} onClose={() => setSavingsTarget(null)} />}
      {showLedgerModal && <LedgerModal onClose={() => setShowLedgerModal(false)} />}
    </div>
  );
}

Object.assign(window, { ClassroomFinance });
