export default function PerangkatJaringan() {
  return (
    <svg viewBox="0 0 500 200" className="w-full max-w-2xl mx-auto">
      <text x="250" y="20" textAnchor="middle" fill="#4f46e5" fontSize="13" fontWeight="bold">Perangkat Jaringan Komputer</text>

      <rect x="10" y="40" width="70" height="50" rx="10" fill="#3b82f6" />
      <text x="45" y="62" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Modem</text>
      <text x="45" y="74" textAnchor="middle" fill="#bfdbfe" fontSize="7">🌐 Internet</text>

      <rect x="110" y="40" width="70" height="50" rx="10" fill="#8b5cf6" />
      <text x="145" y="62" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Router</text>
      <text x="145" y="74" textAnchor="middle" fill="#ddd6fe" fontSize="7">🔀 Atur jalur</text>

      <rect x="210" y="40" width="70" height="50" rx="10" fill="#10b981" />
      <text x="245" y="62" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Switch</text>
      <text x="245" y="74" textAnchor="middle" fill="#a7f3d0" fontSize="7">🔗 Hubungkan</text>

      <rect x="310" y="40" width="70" height="50" rx="10" fill="#f59e0b" />
      <text x="345" y="62" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Access</text>
      <text x="345" y="74" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Point</text>
      <text x="345" y="86" textAnchor="middle" fill="#fde68a" fontSize="7">📡 WiFi</text>

      <rect x="420" y="40" width="70" height="50" rx="10" fill="#ef4444" />
      <text x="455" y="62" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Kabel +</text>
      <text x="455" y="74" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">RJ-45</text>

      <line x1="80" y1="65" x2="110" y2="65" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" />
      <line x1="180" y1="65" x2="210" y2="65" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" />
      <line x1="280" y1="65" x2="310" y2="65" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" />
      <line x1="380" y1="65" x2="420" y2="65" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,2" />

      <rect x="70" y="120" width="60" height="35" rx="8" fill="#3b82f6" opacity="0.8" />
      <text x="100" y="142" textAnchor="middle" fill="white" fontSize="8">Komputer 1</text>

      <rect x="160" y="120" width="60" height="35" rx="8" fill="#3b82f6" opacity="0.8" />
      <text x="190" y="142" textAnchor="middle" fill="white" fontSize="8">Komputer 2</text>

      <rect x="280" y="120" width="60" height="35" rx="8" fill="#3b82f6" opacity="0.8" />
      <text x="310" y="142" textAnchor="middle" fill="white" fontSize="8">Laptop</text>

      <rect x="370" y="120" width="55" height="35" rx="8" fill="#3b82f6" opacity="0.8" />
      <text x="397" y="142" textAnchor="middle" fill="white" fontSize="8">HP</text>

      <line x1="100" y1="90" x2="100" y2="120" stroke="#94a3b8" strokeWidth="1" />
      <line x1="190" y1="90" x2="190" y2="120" stroke="#94a3b8" strokeWidth="1" />
      <line x1="310" y1="90" x2="310" y2="120" stroke="#94a3b8" strokeWidth="1" />
      <line x1="397" y1="90" x2="397" y2="120" stroke="#94a3b8" strokeWidth="1" />

      <path d="M80,155 Q250,190 420,155" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="250" y="190" textAnchor="middle" fill="#64748b" fontSize="8">Semua perangkat ini bekerja sama supaya kamu bisa internetan!</text>
    </svg>
  );
}
