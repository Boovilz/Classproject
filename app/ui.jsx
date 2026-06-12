/* ============================================================
   Shared UI primitives + icon set
   ============================================================ */

/* ---------- Icon: curated line glyphs (lucide-ish) ---------- */
const ICON_PATHS = {
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  clock: 'M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  thermometer: 'M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z',
  note: 'M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2 M9 3h6v4H9z',
  flag: 'M4 21V4 M4 4h12l-2 4 2 4H4',
  seat: 'M5 11V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5 M3 11h18v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM7 20v1M17 20v1',
  door: 'M4 21h16 M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17 M14 12h.5',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  cross: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z',
  home: 'M3 11l9-8 9 8 M5 10v10h5v-6h4v6h5V10',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13A4 4 0 0 1 16 11',
  calendar: 'M8 2v4M16 2v4M3 9h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  heart: 'M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7 7-7Z',
  chart: 'M3 3v18h18 M7 16l4-5 3 3 5-7',
  report: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6M9 17h4',
  spark: 'M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8',
  bolt: 'M13 2 3 14h7l-1 8 10-12h-7z',
  trophy: 'M6 4h12v4a6 6 0 0 1-12 0V4Z M6 6H3v2a3 3 0 0 0 3 3 M18 6h3v2a3 3 0 0 1-3 3 M9 18h6 M10 14v4M14 14v4',
  star: 'M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 18.9 6.1 21.1l1.2-6.6L2.5 9.9 9.1 9z',
  coin: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 7v10M9.5 9.5h3.2a1.8 1.8 0 0 1 0 3.6H9.5h3.5a1.8 1.8 0 0 1 0 3.6H9.2',
  crown: 'M3 7l4 5 5-7 5 7 4-5v11H3z M3 20h18',
  map: 'M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3Z M9 3v15M15 6v15',
  shop: 'M3 9l1.5-5h15L21 9 M4 9v11h16V9 M9 9v0a3 3 0 0 0 6 0M3 9a3 3 0 0 0 6 0M15 9a3 3 0 0 0 6 0',
  game: 'M6 12h4M8 10v4 M15 11h.01M18 13h.01 M7 7h10a4 4 0 0 1 4 4v2a4 4 0 0 1-7.5 2h-3A4 4 0 0 1 3 13v-2a4 4 0 0 1 4-4Z',
  wheel: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4',
  timer: 'M10 2h4 M12 14l3-3 M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  volume: 'M11 5 6 9H2v6h4l5 4V5Z M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14',
  shuffle: 'M16 3h5v5 M4 20 21 3 M21 16v5h-5 M15 15l6 6 M4 4l5 5',
  focus: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2 M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V20a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 13H4a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 5.7 6.3l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.6V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H20a2 2 0 1 1 0 4z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3',
  arrowRight: 'M5 12h14M13 5l7 7-7 7',
  arrowLeft: 'M19 12H5M11 19l-7-7 7-7',
  chevR: 'M9 6l6 6-6 6',
  chevD: 'M6 9l6 6 6-6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  edit: 'M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  download: 'M12 3v12M7 10l5 5 5-5 M5 21h14',
  filter: 'M3 4h18l-7 8v6l-4 2v-8z',
  google: 'M21 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7.1Z M12 22c2.6 0 4.8-.9 6.3-2.3l-3.1-2.4c-.9.6-2 .9-3.2.9-2.5 0-4.6-1.7-5.3-3.9H3.5v2.5A9.6 9.6 0 0 0 12 22Z M6.7 14.3a5.7 5.7 0 0 1 0-3.7V8.1H3.5a9.6 9.6 0 0 0 0 8.7z M12 6.6c1.4 0 2.7.5 3.6 1.4l2.7-2.7A9.6 9.6 0 0 0 3.5 8.1l3.2 2.5C7.4 8.3 9.5 6.6 12 6.6Z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M22 7l-10 6L2 7',
  lock: 'M5 11h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z M8 11V7a4 4 0 0 1 8 0v4',
  shield: 'M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M19 17H6a2 2 0 0 0-2 2',
  calc: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z M8 7h8 M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01',
  flask: 'M9 3h6 M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-5-9V3 M7.5 13h9',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M3 12h18 M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z',
  lang: 'M4 5h8 M8 3v2c0 4-2 7-5 9 M5 11c2 2 4 3 6 3 M14 21l4-10 4 10 M15.5 17h5',
  brush: 'M9.5 14.5 3 21 M14 4l6 6-7 3-2-2zM12 6l6 6',
  run: 'M13 4a2 2 0 1 0 0-.1 M7 21l3-6 3 2 1 5 M5 11l4-2 3 2 2-1 M10 9l1 4',
  tool: 'M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18l3 3 6.5-6.5a4 4 0 0 0 5.2-5.2l-2.5 2.5-2.3-2.3z',
  card: 'M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z M2 10h20 M6 15h4',
  frame: 'M4 4h16v16H4z M8 8h8v8H8z',
  gift: 'M20 12v8H4v-8 M2 8h20v4H2z M12 8v12 M12 8S11 4 8.5 4a2.5 2.5 0 0 0 0 5H12 M12 8s1-4 3.5-4a2.5 2.5 0 0 1 0 5H12',
  music: 'M9 18V5l12-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  tag: 'M20 12l-8.5 8.5a2 2 0 0 1-2.8 0L3 15V5h10l7 7Z M7.5 8.5h.01',
  fire: 'M12 3c1 3-1 4-2 6s0 5 2 5 3-2 2-5c2 1 3 3 3 5a5 5 0 1 1-10 0c0-3 3-5 5-11Z',
  scale: 'M12 3v4 M5 7h14 M5 7l-3 7h6zM19 7l3 7h-6z M8 21h8M12 7v14',
  ruler: 'M3 16 16 3l5 5L8 21z M7 12l2 2M10 9l2 2M13 6l2 2',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  play: 'M6 4l14 8-14 8z',
  pause: 'M7 4h4v16H7zM13 4h4v16h-4z',
  refresh: 'M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5',
};

function Icon({ name, size = 20, sw = 1.9, color = 'currentColor', style, fill = 'none' }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  const paths = d.split(' M').map((p, i) => (i === 0 ? p : 'M' + p));
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ flex: 'none', display: 'block', ...style }}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

/* ---------- Avatar placeholder (RPG hero portrait) ---------- */
function HeroAvatar({ student, size = 64, ring, glow }) {
  const hue = student?.game?.hue ?? 270;
  const bg = `radial-gradient(120% 120% at 50% 18%, oklch(0.72 0.16 ${hue}), oklch(0.42 0.18 ${(hue + 40) % 360}))`;
  const shadow = glow
    ? `0 0 0 2px ${ring || 'rgba(255,255,255,.35)'}, 0 0 24px -4px oklch(0.7 0.2 ${hue})`
    : ring ? `0 0 0 2px ${ring}` : 'none';
  const radius = size * 0.28;
  const baseStyle = { width: size, height: size, borderRadius: radius, overflow: 'hidden', flex: 'none', boxShadow: shadow, position: 'relative' };

  /* real photo */
  if (student?.photo) {
    return (
      <div style={{ ...baseStyle, background: bg }}>
        <img src={student.photo} alt={student.nick} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }

  /* emoji avatar */
  if (student?.avatar) {
    return (
      <div className="center" style={{ ...baseStyle, background: bg }}>
        <span style={{ fontSize: size * 0.52, lineHeight: 1, userSelect: 'none' }}>{student.avatar}</span>
      </div>
    );
  }

  /* gradient silhouette fallback */
  return (
    <div className="center" style={{ ...baseStyle, background: bg }}>
      <div style={{ position: 'absolute', inset: 0, opacity: .25,
        backgroundImage: 'repeating-linear-gradient(135deg,#fff2 0 8px,#fff0 8px 16px)' }} />
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <circle cx="32" cy="25" r="11" fill="rgba(255,255,255,0.92)" />
        <path d="M14 60c0-11 8-18 18-18s18 7 18 18z" fill="rgba(255,255,255,0.92)" />
      </svg>
      <span className="tech" style={{ position: 'absolute', bottom: 3, right: 5, fontSize: size * 0.16,
        fontWeight: 700, color: 'rgba(0,0,0,.45)' }}>{student?.nick || ''}</span>
    </div>
  );
}

/* ---------- Stat tile ---------- */
function Stat({ icon, label, value, sub, color, big }) {
  return (
    <div className="glass" style={{ borderRadius: 'var(--r-lg)', padding: big ? '22px 24px' : '18px 20px', position: 'relative', overflow: 'hidden' }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="nowrap" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
          <div className="display" style={{ fontSize: big ? 40 : 30, marginTop: 4, color: color || 'var(--ink)', lineHeight: 1 }}>{value}</div>
          {sub && <div className="nowrap" style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>{sub}</div>}
        </div>
        {icon && (
          <div className="center" style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-2)', color: color || 'var(--navy)' }}>
            <Icon name={icon} size={21} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Progress bar ---------- */
function Bar({ value, max = 100, color, height = 9, glow }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="bar" style={{ height }}>
      <i style={{ width: pct + '%', background: color || 'var(--navy)',
        boxShadow: glow ? `0 0 12px ${color}` : 'none', transition: 'width .8s cubic-bezier(.2,.8,.2,1)' }} />
    </div>
  );
}

/* ---------- Rank badge ---------- */
function RankBadge({ rank, size = 'md' }) {
  const r = window.GC.RANKS.find(x => x.key === rank) || window.GC.RANKS[0];
  const s = size === 'sm' ? { p: '3px 9px', f: 11.5, i: 13 } : { p: '5px 12px', f: 13, i: 15 };
  return (
    <span className="pill tech" style={{ padding: s.p, fontSize: s.f,
      background: 'color-mix(in oklch, ' + r.color + ' 22%, transparent)',
      color: r.color, border: '1px solid color-mix(in oklch, ' + r.color + ' 50%, transparent)',
      textTransform: 'uppercase', letterSpacing: '.05em' }}>
      <Icon name="shield" size={s.i} /> {r.key}
    </span>
  );
}

/* ---------- Sparkline / mini line chart ---------- */
function LineChart({ data, w = 520, h = 180, color, color2, series2, yLabel, pad = 34 }) {
  const all = [...data.map(d => d.v), ...(series2 ? series2.map(d => d.v) : [])];
  const min = Math.min(...all) - 1, max = Math.max(...all) + 1;
  const x = i => pad + (i / (data.length - 1)) * (w - pad - 12);
  const y = v => h - pad - ((v - min) / (max - min)) * (h - pad - 14);
  const line = arr => arr.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.v)}`).join(' ');
  const area = arr => line(arr) + ` L${x(arr.length - 1)},${h - pad} L${x(0)},${h - pad} Z`;
  const gid = 'g' + (color || '').replace(/\W/g, '');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((g, i) => (
        <line key={i} x1={pad} x2={w - 12} y1={pad + g * (h - pad - 14)} y2={pad + g * (h - pad - 14)}
          stroke="var(--line)" strokeWidth="1" />
      ))}
      <path d={area(data)} fill={`url(#${gid})`} />
      {series2 && <path d={line(series2)} fill="none" stroke={color2} strokeWidth="2.5" strokeDasharray="5 5" opacity=".8" />}
      <path d={line(data)} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => <circle key={i} cx={x(i)} cy={y(d.v)} r="3.5" fill={color} />)}
      {data.map((d, i) => (
        <text key={i} x={x(i)} y={h - pad + 18} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="var(--font-body)">{d.m || d.d}</text>
      ))}
    </svg>
  );
}

/* reactive hook — returns live student list, re-renders on add/delete/edit */
function useStudents() {
  const [students, setStudents] = React.useState(() => window.GC.getStudents());
  React.useEffect(() => {
    const refresh = () => setStudents(window.GC.getStudents());
    window.addEventListener('gc:students-changed', refresh);
    return () => window.removeEventListener('gc:students-changed', refresh);
  }, []);
  return students;
}

/* QR code box — renders a QR encoding `value` onto a canvas */
function QRCodeBox({ value, size = 120, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.QRCode) {
      window.QRCode.toCanvas(ref.current, value, { width: size, margin: 1, color: { dark: '#1a1430', light: '#ffffff' } }, () => {});
    }
  }, [value, size]);
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: 8, ...style }} />;
}

Object.assign(window, { Icon, HeroAvatar, Stat, Bar, RankBadge, LineChart, useStudents, QRCodeBox });
