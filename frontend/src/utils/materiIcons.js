import {
  Laptop,
  Monitor,
  Smartphone,
  Server,
  HardDrive,
  Cpu,
  History,
  Globe,
  Network,
  Wifi,
  Signal,
  Radio,
  Cable,
  Router,
  Cloud,
  Database,
  ShieldCheck,
  Lock,
  KeyRound,
  BookOpen,
  Code2,
  Terminal,
  Layers,
  Share2,
  Activity,
  Zap,
   Compass,
  Lightbulb,
  Award,
  Rocket,
  HelpCircle,
} from 'lucide-react';

export const MATERI_ICONS = [
  // Perangkat & Jaringan
  { name: 'Laptop', label: 'Laptop / Komputer', category: 'Perangkat & Jaringan', component: Laptop },
  { name: 'Monitor', label: 'Komputer Desktop', category: 'Perangkat & Jaringan', component: Monitor },
  { name: 'Smartphone', label: 'Smartphone / Mobile', category: 'Perangkat & Jaringan', component: Smartphone },
  { name: 'Router', label: 'Router / Access Point', category: 'Perangkat & Jaringan', component: Router },
  { name: 'Server', label: 'Server Jaringan', category: 'Perangkat & Jaringan', component: Server },
  { name: 'HardDrive', label: 'Penyimpanan / Switch', category: 'Perangkat & Jaringan', component: HardDrive },
  { name: 'Cpu', label: 'Prosesor / Hardware', category: 'Perangkat & Jaringan', component: Cpu },

  // Konektivitas & Transmisi
  { name: 'Globe', label: 'Internet / Global (WAN)', category: 'Konektivitas & Transmisi', component: Globe },
  { name: 'Network', label: 'Topologi / Jaringan (LAN)', category: 'Konektivitas & Transmisi', component: Network },
  { name: 'Wifi', label: 'WiFi / Nirkabel', category: 'Konektivitas & Transmisi', component: Wifi },
  { name: 'Cable', label: 'Kabel Jaringan (UTP/FO)', category: 'Konektivitas & Transmisi', component: Cable },
  { name: 'Signal', label: 'Sinyal / Frekuensi', category: 'Konektivitas & Transmisi', component: Signal },
  { name: 'Radio', label: 'Gelombang Radio / Pemancar', category: 'Konektivitas & Transmisi', component: Radio },
  { name: 'Share2', label: 'Berbagi Data / Koneksi', category: 'Konektivitas & Transmisi', component: Share2 },

  // Data, Cloud & Keamanan
  { name: 'Cloud', label: 'Cloud Computing', category: 'Data, Cloud & Keamanan', component: Cloud },
  { name: 'Database', label: 'Basis Data / Paket Data', category: 'Data, Cloud & Keamanan', component: Database },
  { name: 'ShieldCheck', label: 'Keamanan Siber / Proteksi', category: 'Data, Cloud & Keamanan', component: ShieldCheck },
  { name: 'Lock', label: 'Enkripsi / Privasi', category: 'Data, Cloud & Keamanan', component: Lock },
  { name: 'KeyRound', label: 'Autentikasi / Sandi', category: 'Data, Cloud & Keamanan', component: KeyRound },
  { name: 'Activity', label: 'Lalu Lintas / Trafik Data', category: 'Data, Cloud & Keamanan', component: Activity },

  // Konsep, Sejarah & Umum
  { name: 'BookOpen', label: 'Buku Materi / Modul', category: 'Konsep & Pembelajaran', component: BookOpen },
  { name: 'History', label: 'Sejarah / Perkembangan', category: 'Konsep & Pembelajaran', component: History },
  { name: 'Layers', label: 'Arsitektur / Layer OSI', category: 'Konsep & Pembelajaran', component: Layers },
  { name: 'Code2', label: 'Protokol / Pemrograman', category: 'Konsep & Pembelajaran', component: Code2 },
  { name: 'Terminal', label: 'Command Line / Konfigurasi', category: 'Konsep & Pembelajaran', component: Terminal },
  { name: 'Lightbulb', label: 'Konsep Dasar / Ide', category: 'Konsep & Pembelajaran', component: Lightbulb },
  { name: 'Compass', label: 'Eksplorasi / Panduan', category: 'Konsep & Pembelajaran', component: Compass },
  { name: 'Zap', label: 'Kecepatan / Performa', category: 'Konsep & Pembelajaran', component: Zap },
  { name: 'Rocket', label: 'Teknologi Masa Depan', category: 'Konsep & Pembelajaran', component: Rocket },
  { name: 'Award', label: 'Evaluasi / Pencapaian', category: 'Konsep & Pembelajaran', component: Award },
];

export const iconMap = {
  // Backward compatibility untuk emoji lama
  '💻': Laptop,
  '📜': History,
  '🌐': Globe,
  '🔌': Cable,
  '📡': Router,
  '✅': ShieldCheck,
  // Semua ikon Lucide berdasarkan nama
  ...Object.fromEntries(MATERI_ICONS.map((item) => [item.name, item.component])),
};

export function getMateriIcon(iconName) {
  return iconMap[iconName] || HelpCircle;
}
