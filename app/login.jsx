/* ============================================================
   LOGIN — cinematic entry, hints at both worlds
   ============================================================ */
function Login({ onLogin }) {
  const [tab, setTab] = React.useState('email');
  const [email, setEmail] = React.useState('manee@school.ac.th');
  const [pw, setPw] = React.useState('demo1234');
  const [busy, setBusy] = React.useState(false);

  const go = (e) => {
    if (e) e.preventDefault();
    setBusy(true);
    setTimeout(() => onLogin(), 650);
  };

  return (
    <div data-world="game" className="world center" style={{ position: 'absolute', inset: 0 }}>
      {/* floating orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        {[['18%','22%',180,'var(--purple)',9],['78%','30%',140,'var(--cyan)',7],['62%','78%',200,'var(--neon)',11],['28%','70%',120,'var(--gold)',8]].map((o,i)=>(
          <div key={i} className="float" style={{ position:'absolute', left:o[0], top:o[1], width:o[2], height:o[2],
            borderRadius:'50%', background:o[3], filter:'blur(60px)', opacity:.4, animationDuration:o[4]+'s' }} />
        ))}
      </div>

      <div className="row pop" style={{ position: 'relative', zIndex: 2, gap: 0, width: 'min(940px, 92vw)',
        borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: '0 40px 120px -40px #000' }}>

        {/* left: brand panel */}
        <div className="col" style={{ flex: '1 1 0', minWidth: 0, padding: '52px 46px', justifyContent: 'space-between',
          background: 'linear-gradient(155deg, oklch(0.28 0.10 290), oklch(0.18 0.08 280))', position: 'relative', minHeight: 540 }}>
          <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'relative' }}>
            <div className="row" style={{ gap: 12 }}>
              <div className="center" style={{ width: 52, height: 52, borderRadius: 15,
                background: 'linear-gradient(135deg, var(--cyan), var(--purple))', boxShadow: '0 8px 30px -6px var(--halo)' }}>
                <Icon name="shield" size={28} color="#0a0a14" />
              </div>
              <div>
                <div className="display" style={{ fontSize: 20, color: '#fff', lineHeight: 1 }}>Classroom OS</div>
                <div className="tech" style={{ fontSize: 12, color: 'var(--cyan)', letterSpacing: '.16em' }}>GAMIFIED EDITION</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <h1 style={{ fontSize: 40, color: '#fff', lineHeight: 1.05 }}>ห้องเรียน<br/>ที่มีชีวิต</h1>
            <p style={{ color: 'var(--ink-soft)', marginTop: 14, fontSize: 15, maxWidth: 320 }}>
              ระบบบริหารจัดการชั้นเรียน ผสานโลกเกม RPG เพื่อครูยุคใหม่และนักเรียนที่กระตือรือร้น
            </p>
            <div className="row" style={{ gap: 18, marginTop: 26 }}>
              {[['users','จัดการชั้นเรียน'],['bolt','ระบบ XP & เลเวล'],['map','แผนที่ความรู้']].map((f,i)=>(
                <div key={i} className="col" style={{ gap: 7, alignItems: 'flex-start' }}>
                  <div className="center" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.08)', color: 'var(--cyan)' }}>
                    <Icon name={f[0]} size={18} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{f[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right: form */}
        <div className="glass col" style={{ flex: '0 0 400px', maxWidth: '100%', padding: '46px 40px', justifyContent: 'center', gap: 18,
          background: 'rgba(20,16,40,0.72)' }}>
          <div>
            <h2 style={{ fontSize: 26, color: '#fff' }}>เข้าสู่ระบบ</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>ยินดีต้อนรับกลับมา คุณครู</p>
          </div>

          <button className="btn" onClick={go} style={{ background: '#fff', color: '#222', justifyContent: 'center' }}>
            <Icon name="google" size={18} color="#4285F4" /> เข้าสู่ระบบด้วย Google
          </button>

          <div className="row" style={{ gap: 12, color: 'var(--muted)', fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} /> หรือ <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>

          <form className="col" style={{ gap: 14 }} onSubmit={go}>
            <label className="col" style={{ gap: 7 }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 600 }}>อีเมล</span>
              <div style={{ position: 'relative' }}>
                <Icon name="mail" size={17} color="var(--muted)" style={{ position: 'absolute', left: 13, top: 14 }} />
                <input className="field" style={{ paddingLeft: 40 }} value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </label>
            <label className="col" style={{ gap: 7 }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 600 }}>รหัสผ่าน</span>
              <div style={{ position: 'relative' }}>
                <Icon name="lock" size={17} color="var(--muted)" style={{ position: 'absolute', left: 13, top: 14 }} />
                <input className="field" style={{ paddingLeft: 40 }} type="password" value={pw} onChange={e => setPw(e.target.value)} />
              </div>
            </label>
            <button className="btn btn-neon" type="submit" disabled={busy} style={{ justifyContent: 'center', marginTop: 4 }}>
              {busy ? <><span className="spin" style={{ width: 16, height: 16, border: '2px solid #0a0a14', borderTopColor: 'transparent', borderRadius: 99, display: 'inline-block', animation: 'spinSlow .7s linear infinite' }} /> กำลังเข้าสู่ระบบ…</>
                : <>เข้าสู่ระบบ <Icon name="arrowRight" size={18} color="#0a0a14" /></>}
            </button>
          </form>
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
            เดโม่ — กดเข้าสู่ระบบได้เลยเพื่อเข้าสู่ Portal Gate
          </p>
        </div>
      </div>
    </div>
  );
}
window.Login = Login;
