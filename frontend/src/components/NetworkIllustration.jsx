export function IlustrasiJaringan() {
  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
      <rect x="20" y="20" width="80" height="60" rx="8" fill="#3b82f6" />
      <text x="60" y="55" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Komputer 1</text>
      <rect x="160" y="20" width="80" height="60" rx="8" fill="#3b82f6" />
      <text x="200" y="55" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Komputer 2</text>
      <rect x="300" y="20" width="80" height="60" rx="8" fill="#3b82f6" />
      <text x="340" y="55" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Komputer 3</text>

      <rect x="120" y="110" width="160" height="50" rx="25" fill="#10b981" />
      <text x="200" y="140" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Switch / Hub</text>

      <rect x="160" y="175" width="80" height="20" rx="10" fill="#f59e0b" />
      <text x="200" y="189" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">KONEKSI INTERNET</text>

      <line x1="60" y1="80" x2="140" y2="110" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
      <line x1="200" y1="80" x2="200" y2="110" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
      <line x1="340" y1="80" x2="260" y2="110" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
      <line x1="200" y1="160" x2="200" y2="175" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />

      <circle cx="60" cy="80" r="3" fill="#64748b" />
      <circle cx="200" cy="80" r="3" fill="#64748b" />
      <circle cx="340" cy="80" r="3" fill="#64748b" />
      <circle cx="200" cy="110" r="3" fill="#64748b" />
    </svg>
  );
}

export function IlustrasiLAN() {
  return (
    <svg viewBox="0 0 400 160" className="w-full">
      <rect x="140" y="10" width="120" height="36" rx="18" fill="#06b6d4" />
      <text x="200" y="33" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">LAN</text>

      <rect x="10" y="70" width="70" height="45" rx="6" fill="#3b82f6" />
      <text x="45" y="96" textAnchor="middle" fill="white" fontSize="9">PC 1</text>
      <rect x="95" y="70" width="70" height="45" rx="6" fill="#3b82f6" />
      <text x="130" y="96" textAnchor="middle" fill="white" fontSize="9">PC 2</text>
      <rect x="180" y="70" width="70" height="45" rx="6" fill="#3b82f6" />
      <text x="215" y="96" textAnchor="middle" fill="white" fontSize="9">PC 3</text>
      <rect x="265" y="70" width="70" height="45" rx="6" fill="#3b82f6" />
      <text x="300" y="96" textAnchor="middle" fill="white" fontSize="9">PC 4</text>
      <rect x="155" y="130" width="90" height="28" rx="14" fill="#f59e0b" />
      <text x="200" y="149" textAnchor="middle" fill="white" fontSize="10">Printer</text>

      <line x1="45" y1="115" x2="130" y2="144" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="130" y1="115" x2="130" y2="144" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="215" y1="115" x2="130" y2="144" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="300" y1="115" x2="130" y2="144" stroke="#94a3b8" strokeWidth="1.5" />

      <rect x="90" y="140" width="80" height="10" rx="5" fill="#e2e8f0" />
      <text x="130" y="148" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300" fontSize="8">1 Gedung / Sekolah</text>
    </svg>
  );
}

export function IlustrasiMAN() {
  return (
    <svg viewBox="0 0 400 160" className="w-full">
      <rect x="140" y="10" width="120" height="36" rx="18" fill="#8b5cf6" />
      <text x="200" y="33" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">MAN</text>

      <rect x="10" y="70" width="90" height="55" rx="8" fill="#3b82f6" />
      <text x="55" y="92" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Kampus A</text>
      <text x="55" y="108" textAnchor="middle" fill="#bfdbfe" fontSize="8">Pusat Kota</text>

      <rect x="155" y="70" width="90" height="55" rx="8" fill="#10b981" />
      <text x="200" y="92" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Kampus B</text>
      <text x="200" y="108" textAnchor="middle" fill="#a7f3d0" fontSize="8">Timur Kota</text>

      <rect x="300" y="70" width="90" height="55" rx="8" fill="#f59e0b" />
      <text x="345" y="92" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Kampus C</text>
      <text x="345" y="108" textAnchor="middle" fill="#fde68a" fontSize="8">Barat Kota</text>

      <line x1="100" y1="97" x2="155" y2="97" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,3" />
      <line x1="245" y1="97" x2="300" y2="97" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,3" />

      <rect x="130" y="140" width="140" height="16" rx="8" fill="#e2e8f0" />
      <text x="200" y="152" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300" fontSize="8">Area 1 Kota (10-50 km)</text>
    </svg>
  );
}

export function IlustrasiWAN() {
  return (
    <svg viewBox="0 0 400 180" className="w-full">
      <rect x="140" y="10" width="120" height="36" rx="18" fill="#ef4444" />
      <text x="200" y="33" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">WAN</text>

      <circle cx="50" cy="90" r="28" fill="#3b82f6" />
      <text x="50" y="87" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Jakarta</text>
      <text x="50" y="99" textAnchor="middle" fill="#bfdbfe" fontSize="7">ID</text>

      <circle cx="200" cy="75" r="28" fill="#10b981" />
      <text x="200" y="72" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Singapura</text>
      <text x="200" y="84" textAnchor="middle" fill="#a7f3d0" fontSize="7">SG</text>

      <circle cx="350" cy="100" r="28" fill="#f59e0b" />
      <text x="350" y="97" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Tokyo</text>
      <text x="350" y="109" textAnchor="middle" fill="#fde68a" fontSize="7">JP</text>

      <circle cx="200" cy="150" r="20" fill="#8b5cf6" />
      <text x="200" y="154" textAnchor="middle" fill="white" fontSize="7">Internet</text>

      <line x1="78" y1="90" x2="172" y2="85" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1="228" y1="85" x2="322" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1="50" y1="118" x2="185" y2="140" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1="200" y1="103" x2="200" y2="130" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1="350" y1="128" x2="215" y2="140" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
    </svg>
  );
}

export function IlustrasiMediaKabel() {
  return (
    <svg viewBox="0 0 400 78" className="w-full">
      <text x="60" y="25" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="bold">Kabel UTP</text>
      <rect x="10" y="32" width="100" height="16" rx="3" fill="#3b82f6" opacity="0.3" />
      <rect x="10" y="36" width="100" height="2" rx="1" fill="#3b82f6" />
      <rect x="10" y="40" width="100" height="2" rx="1" fill="#ef4444" />
      <rect x="10" y="44" width="100" height="2" rx="1" fill="#eab308" />
      <rect x="110" y="32" width="18" height="16" rx="3" fill="#94a3b8" />
      <text x="119" y="44" textAnchor="middle" fill="white" fontSize="8">RJ</text>
      <text x="60" y="62" textAnchor="middle" fill="#64748b" fontSize="8">100m — 1 Gbps</text>

      <text x="200" y="25" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="bold">Fiber Optik</text>
      <rect x="150" y="32" width="100" height="16" rx="8" fill="#a78bfa" opacity="0.3" />
      <line x1="160" y1="40" x2="240" y2="40" stroke="#a78bfa" strokeWidth="3" strokeDasharray="8,4" />
      <circle cx="160" cy="40" r="3" fill="#f59e0b" />
      <circle cx="180" cy="40" r="3" fill="#f59e0b" />
      <circle cx="200" cy="40" r="3" fill="#f59e0b" />
      <circle cx="220" cy="40" r="3" fill="#f59e0b" />
      <circle cx="240" cy="40" r="3" fill="#f59e0b" />
      <text x="200" y="62" textAnchor="middle" fill="#64748b" fontSize="8">100+ km — 100 Gbps</text>

      <text x="340" y="25" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">WiFi</text>
      <rect x="290" y="32" width="100" height="16" rx="8" fill="#34d399" opacity="0.3" />
      <path d="M320,40 Q330,28 340,40" fill="none" stroke="#10b981" strokeWidth="1.5" />
      <path d="M313,40 Q330,22 347,40" fill="none" stroke="#10b981" strokeWidth="1.5" />
      <path d="M306,40 Q330,16 354,40" fill="none" stroke="#10b981" strokeWidth="1.5" />
      <text x="340" y="62" textAnchor="middle" fill="#64748b" fontSize="8">30-100m — 1 Gbps</text>
    </svg>
  );
}

export function IlustrasiTopologi() {
  return (
    <svg viewBox="0 0 400 180" className="w-full">
      <text x="80" y="20" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold">Topologi Star</text>
      <circle cx="80" cy="80" r="10" fill="#3b82f6" />
      <text x="80" y="84" textAnchor="middle" fill="white" fontSize="7">Hub</text>
      <circle cx="30" cy="140" r="8" fill="#10b981" />
      <circle cx="80" cy="150" r="8" fill="#10b981" />
      <circle cx="130" cy="140" r="8" fill="#10b981" />
      <line x1="80" y1="90" x2="30" y2="134" stroke="#94a3b8" strokeWidth="1" />
      <line x1="80" y1="90" x2="80" y2="142" stroke="#94a3b8" strokeWidth="1" />
      <line x1="80" y1="90" x2="130" y2="134" stroke="#94a3b8" strokeWidth="1" />

      <text x="280" y="20" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold">Topologi Bus</text>
      <line x1="190" y1="80" x2="370" y2="80" stroke="#8b5cf6" strokeWidth="3" />
      <circle cx="205" cy="80" r="3" fill="#ef4444" />
      <circle cx="245" cy="80" r="3" fill="#ef4444" />
      <circle cx="285" cy="80" r="3" fill="#ef4444" />
      <circle cx="325" cy="80" r="3" fill="#ef4444" />
      <circle cx="355" cy="80" r="3" fill="#ef4444" />
      <line x1="205" y1="80" x2="205" y2="130" stroke="#94a3b8" strokeWidth="1" />
      <line x1="285" y1="80" x2="285" y2="130" stroke="#94a3b8" strokeWidth="1" />
      <line x1="355" y1="80" x2="355" y2="130" stroke="#94a3b8" strokeWidth="1" />
      <rect x="195" y="130" width="20" height="12" rx="3" fill="#10b981" />
      <rect x="275" y="130" width="20" height="12" rx="3" fill="#10b981" />
      <rect x="345" y="130" width="20" height="12" rx="3" fill="#10b981" />
      <text x="280" y="162" textAnchor="middle" fill="#64748b" fontSize="8">Kabel backbone utama</text>
    </svg>
  );
}

export function IlustrasiSejarahInternet() {
  return (
    <svg viewBox="0 0 500 160" className="w-full max-w-lg mx-auto">
      {/* Timeline main line */}
      <line x1="40" y1="80" x2="460" y2="80" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="4" />
      <polygon points="460,75 470,80 460,85" className="fill-slate-400 dark:fill-slate-600" />
      
      {/* 1969 */}
      <circle cx="60" cy="80" r="8" fill="#4f46e5" />
      <circle cx="60" cy="80" r="4" fill="white" />
      <text x="60" y="55" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100" fontSize="10" fontWeight="extrabold">1969</text>
      <text x="60" y="105" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400" fontSize="9" fontWeight="bold">ARPANET</text>
      <text x="60" y="118" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500" fontSize="8">(4 Komputer)</text>

      {/* 1983 */}
      <circle cx="150" cy="80" r="8" fill="#06b6d4" />
      <circle cx="150" cy="80" r="4" fill="white" />
      <text x="150" y="55" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100" fontSize="10" fontWeight="extrabold">1983</text>
      <text x="150" y="105" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400" fontSize="9" fontWeight="bold">TCP/IP</text>
      <text x="150" y="118" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500" fontSize="8">(Protokol Standar)</text>

      {/* 1990 */}
      <circle cx="240" cy="80" r="8" fill="#8b5cf6" />
      <circle cx="240" cy="80" r="4" fill="white" />
      <text x="240" y="55" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100" fontSize="10" fontWeight="extrabold">1990</text>
      <text x="240" y="105" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400" fontSize="9" fontWeight="bold">WWW Lahir</text>
      <text x="240" y="118" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500" fontSize="8">(Halaman Web)</text>

      {/* 2000s */}
      <circle cx="330" cy="80" r="8" fill="#10b981" />
      <circle cx="330" cy="80" r="4" fill="white" />
      <text x="330" y="55" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100" fontSize="10" fontWeight="extrabold">2000-an</text>
      <text x="330" y="105" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400" fontSize="9" fontWeight="bold">Era WiFi</text>
      <text x="330" y="118" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500" fontSize="8">(Internet Tanpa Kabel)</text>

      {/* Sekarang */}
      <circle cx="420" cy="80" r="8" fill="#f59e0b" />
      <circle cx="420" cy="80" r="4" fill="white" />
      <text x="420" y="55" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100" fontSize="10" fontWeight="extrabold">Sekarang</text>
      <text x="420" y="105" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400" fontSize="9" fontWeight="bold">4G/5G Seluler</text>
      <text x="420" y="118" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500" fontSize="8">(Super Cepat & Mobile)</text>
    </svg>
  );
}

export function IlustrasiDampakJaringan() {
  return (
    <svg viewBox="0 0 560 180" className="w-full max-w-xl mx-auto">
      {/* Benefits Box (Sisi Positif) */}
      <rect x="10" y="10" width="250" height="150" rx="12" fill="#10b981" fillOpacity="0.06" stroke="#10b981" strokeWidth="1.5" />
      <rect x="25" y="22" width="220" height="24" rx="12" fill="#10b981" />
      <text x="135" y="38" textAnchor="middle" fill="white" fontSize="10.5" fontWeight="extrabold">Dampak Positif (Manfaat)</text>
      
      <circle cx="30" cy="70" r="3" fill="#10b981" />
      <text x="42" y="73" className="fill-slate-900 dark:fill-slate-100" fontSize="9">
        <tspan fontWeight="bold">Pendidikan: </tspan>
        <tspan className="fill-slate-600 dark:fill-slate-300">Belajar online dan cari materi</tspan>
      </text>

      <circle cx="30" cy="100" r="3" fill="#10b981" />
      <text x="42" y="103" className="fill-slate-900 dark:fill-slate-100" fontSize="9">
        <tspan fontWeight="bold">Komunikasi: </tspan>
        <tspan className="fill-slate-600 dark:fill-slate-300">Chat dan video call lancar</tspan>
      </text>

      <circle cx="30" cy="130" r="3" fill="#10b981" />
      <text x="42" y="133" className="fill-slate-900 dark:fill-slate-100" fontSize="9">
        <tspan fontWeight="bold">Kemudahan: </tspan>
        <tspan className="fill-slate-600 dark:fill-slate-300">Belanja dan pesan makanan</tspan>
      </text>

      {/* Timbangan/VS divider */}
      <line x1="280" y1="30" x2="280" y2="140" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="2" strokeDasharray="4,4" />
      <circle cx="280" cy="85" r="14" fill="#64748b" />
      <text x="280" y="89" textAnchor="middle" fill="white" fontSize="9" fontWeight="black">VS</text>

      {/* Negative Impact Box (Sisi Negatif) */}
      <rect x="300" y="10" width="250" height="150" rx="12" fill="#ef4444" fillOpacity="0.06" stroke="#ef4444" strokeWidth="1.5" />
      <rect x="315" y="22" width="220" height="24" rx="12" fill="#ef4444" />
      <text x="425" y="38" textAnchor="middle" fill="white" fontSize="10.5" fontWeight="extrabold">Dampak Negatif (Bahaya)</text>

          <circle cx="320" cy="70" r="3" fill="#ef4444" />
          <text x="332" y="73" className="fill-slate-900 dark:fill-slate-100" fontSize="9">
            <tspan fontWeight="bold">Kriminalitas: </tspan>
            <tspan className="fill-slate-600 dark:fill-slate-300">Penipuan online dan hacking</tspan>
          </text>

          <circle cx="320" cy="100" r="3" fill="#ef4444" />
          <text x="332" y="103" className="fill-slate-900 dark:fill-slate-100" fontSize="9">
            <tspan fontWeight="bold">Psikologis: </tspan>
            <tspan className="fill-slate-600 dark:fill-slate-300">Kecanduan HP / game online</tspan>
          </text>

          <circle cx="320" cy="130" r="3" fill="#ef4444" />
          <text x="332" y="133" className="fill-slate-900 dark:fill-slate-100" fontSize="9">
            <tspan fontWeight="bold">Sosial: </tspan>
            <tspan className="fill-slate-600 dark:fill-slate-300">Penyebaran hoax dan bullying</tspan>
          </text>
    </svg>
  );
}
