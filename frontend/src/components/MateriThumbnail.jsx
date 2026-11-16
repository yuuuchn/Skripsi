import networkImage from '../assets/materi/network.svg';
import historyImage from '../assets/materi/internet-history.svg';
import rangeImage from '../assets/materi/network-range.svg';
import transmissionImage from '../assets/materi/transmission.svg';
import devicesImage from '../assets/materi/devices.svg';
import impactImage from '../assets/materi/impact.svg';

const thumbnails = {
  1: { src: networkImage, alt: 'Ilustrasi komputer terhubung ke router' },
  2: { src: historyImage, alt: 'Ilustrasi perjalanan sejarah internet' },
  3: { src: rangeImage, alt: 'Ilustrasi perbandingan jangkauan LAN, MAN, dan WAN' },
  4: { src: transmissionImage, alt: 'Ilustrasi kabel dan jaringan Wi-Fi' },
  5: { src: devicesImage, alt: 'Ilustrasi perangkat jaringan komputer' },
  6: { src: impactImage, alt: 'Ilustrasi manfaat dan risiko jaringan komputer' },
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
  const thumbnail = thumbnails[Number(materiId)] || thumbnails[1];
  const theme = thumbnailThemes[index % thumbnailThemes.length];

  return (
    <div className={`relative h-36 overflow-hidden border-b border-slate-200/70 bg-gradient-to-br ${theme} dark:border-slate-700/70`}>
      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/50 blur-2xl dark:bg-white/5" />
      <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-indigo-200/30 blur-2xl dark:bg-indigo-400/10" />
      <div className="relative flex h-full items-center justify-center px-3 py-2 transition-transform duration-500 group-hover:scale-[1.04]">
        <img src={thumbnail.src} alt={thumbnail.alt} className="h-full w-full object-contain drop-shadow-sm" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/20 to-transparent dark:from-slate-950/20" />
    </div>
  );
}
