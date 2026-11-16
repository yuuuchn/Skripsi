function Laptop({ x, y, color = '#4f46e5' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="3" y="0" width="38" height="26" rx="4" fill="white" stroke={color} strokeWidth="2" />
      <rect x="8" y="5" width="28" height="15" rx="2" fill={color} opacity=".16" />
      <circle cx="22" cy="12.5" r="3" fill={color} opacity=".65" />
      <path d="M0 29h44l-5 4H5l-5-4Z" fill={color} />
    </g>
  );
}

function Router({ x, y, color = '#06b6d4' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M4 20h48l-4 10H8L4 20Z" fill={color} />
      <rect x="8" y="10" width="40" height="12" rx="4" fill={color} stroke="white" strokeWidth="2" />
      <path d="M20 10V3m16 7V3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="17" cy="16" r="1.6" fill="white" /><circle cx="23" cy="16" r="1.6" fill="#bbf7d0" /><circle cx="29" cy="16" r="1.6" fill="#fde68a" />
    </g>
  );
}

function NetworkThumbnail() {
  return <svg viewBox="0 0 360 150" aria-label="Komputer terhubung ke router" className="w-full max-w-[270px]" fill="none">
    <path d="M70 83C115 49 142 49 173 73M188 73c30-25 59-24 103 10" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 6" />
    <circle cx="125" cy="61" r="4" fill="#818cf8" /><circle cx="249" cy="62" r="4" fill="#22d3ee" />
    <Laptop x="25" y="80" /><Router x="155" y="72" /><Laptop x="285" y="80" color="#06b6d4" />
  </svg>;
}

function TimelineThumbnail() {
  return <svg viewBox="0 0 360 150" aria-label="Perkembangan internet" className="w-full max-w-[280px]" fill="none">
    <path d="M30 82h300" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
    {[{ x: 52, year: '1969', color: '#6366f1' }, { x: 137, year: '1983', color: '#06b6d4' }, { x: 222, year: '1990', color: '#10b981' }, { x: 307, year: '5G', color: '#f59e0b' }].map((item) => (
      <g key={item.year}>
        <circle cx={item.x} cy="82" r="13" fill="white" stroke={item.color} strokeWidth="5" />
        <circle cx={item.x} cy="82" r="4" fill={item.color} />
        <text x={item.x} y="48" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="700">{item.year}</text>
      </g>
    ))}
    <path d="M48 112h12m70 0h14m70 0h14m70 0h14" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
  </svg>;
}

function RangeThumbnail() {
  return <svg viewBox="0 0 360 150" aria-label="Perbandingan LAN MAN WAN" className="w-full max-w-[280px]" fill="none">
    <circle cx="78" cy="78" r="38" fill="#cffafe" stroke="#06b6d4" strokeWidth="3" /><circle cx="78" cy="78" r="22" fill="#06b6d4" opacity=".22" /><circle cx="78" cy="78" r="7" fill="#0891b2" />
    <circle cx="180" cy="78" r="55" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="3" /><circle cx="180" cy="78" r="32" fill="#8b5cf6" opacity=".18" /><circle cx="180" cy="78" r="7" fill="#7c3aed" />
    <circle cx="282" cy="78" r="70" fill="#ffedd5" stroke="#f59e0b" strokeWidth="3" /><circle cx="282" cy="78" r="42" fill="#f59e0b" opacity=".17" /><circle cx="282" cy="78" r="7" fill="#d97706" />
    <text x="78" y="136" textAnchor="middle" fill="#0e7490" fontSize="14" fontWeight="800">LAN</text><text x="180" y="136" textAnchor="middle" fill="#6d28d9" fontSize="14" fontWeight="800">MAN</text><text x="282" y="136" textAnchor="middle" fill="#b45309" fontSize="14" fontWeight="800">WAN</text>
  </svg>;
}

function MediaThumbnail() {
  return <svg viewBox="0 0 360 150" aria-label="Media transmisi kabel dan nirkabel" className="w-full max-w-[280px]" fill="none">
    <path d="M28 58c42 0 42 35 84 35s42-35 84-35 42 35 84 35 42-35 52-35" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
    <path d="M28 58c42 0 42 35 84 35s42-35 84-35 42 35 84 35 42-35 52-35" stroke="#fde68a" strokeWidth="5" strokeDasharray="9 8" strokeLinecap="round" />
    <path d="M165 112c0-20 17-36 37-36s37 16 37 36M178 112c0-13 11-24 24-24s24 11 24 24M198 112h.1" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" />
    <circle cx="198" cy="112" r="5" fill="#0891b2" />
  </svg>;
}

function DevicesThumbnail() {
  return <svg viewBox="0 0 360 150" aria-label="Perangkat jaringan komputer" className="w-full max-w-[280px]" fill="none">
    <Router x="22" y="58" color="#6366f1" /><Router x="154" y="58" color="#10b981" />
    <rect x="286" y="54" width="50" height="42" rx="7" fill="#f59e0b" /><path d="M294 67h34M294 76h34M294 85h20" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M74 88h80m72 0h60" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 6" /><circle cx="118" cy="88" r="4" fill="#818cf8" /><circle cx="246" cy="88" r="4" fill="#34d399" />
  </svg>;
}

function ImpactThumbnail() {
  return <svg viewBox="0 0 360 150" aria-label="Dampak positif dan negatif jaringan" className="w-full max-w-[280px]" fill="none">
    <rect x="22" y="24" width="130" height="100" rx="16" fill="#d1fae5" stroke="#10b981" strokeWidth="3" /><path d="m62 77 12 12 35-38" stroke="#059669" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /><text x="87" y="112" textAnchor="middle" fill="#047857" fontSize="14" fontWeight="800">MANFAAT</text>
    <rect x="208" y="24" width="130" height="100" rx="16" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="3" /><path d="m248 55 50 50m0-50-50 50" stroke="#e11d48" strokeWidth="8" strokeLinecap="round" /><text x="273" y="112" textAnchor="middle" fill="#be123c" fontSize="14" fontWeight="800">RISIKO</text>
    <path d="M165 74h30" stroke="#94a3b8" strokeWidth="4" strokeDasharray="5 5" />
  </svg>;
}

const thumbnails = {
  1: NetworkThumbnail,
  2: TimelineThumbnail,
  3: RangeThumbnail,
  4: MediaThumbnail,
  5: DevicesThumbnail,
  6: ImpactThumbnail,
};

const thumbnailThemes = [
  'from-indigo-50 via-white to-cyan-50 dark:from-indigo-950/60 dark:via-slate-900 dark:to-cyan-950/50',
  'from-cyan-50 via-white to-blue-50 dark:from-cyan-950/60 dark:via-slate-900 dark:to-blue-950/50',
  'from-emerald-50 via-white to-indigo-50 dark:from-emerald-950/60 dark:via-slate-900 dark:to-indigo-950/50',
  'from-amber-50 via-white to-violet-50 dark:from-amber-950/60 dark:via-slate-900 dark:to-violet-950/50',
  'from-violet-50 via-white to-rose-50 dark:from-violet-950/60 dark:via-slate-900 dark:to-rose-950/50',
  'from-rose-50 via-white to-emerald-50 dark:from-rose-950/60 dark:via-slate-900 dark:to-emerald-950/50',
];

export default function MateriThumbnail({ materiId, index = 0 }) {
  const Illustration = thumbnails[Number(materiId)] || IlustrasiJaringan;
  const theme = thumbnailThemes[index % thumbnailThemes.length];

  return (
    <div className={`relative h-36 overflow-hidden border-b border-slate-200/70 bg-gradient-to-br ${theme} dark:border-slate-700/70`}>
      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/50 blur-2xl dark:bg-white/5" />
      <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-indigo-200/30 blur-2xl dark:bg-indigo-400/10" />
      <div className="relative flex h-full items-center justify-center px-6 py-3 transition-transform duration-500 group-hover:scale-[1.04]">
        <Illustration />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/20 to-transparent dark:from-slate-950/20" />
    </div>
  );
}
