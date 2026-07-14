import { useRef, useState } from 'react';
import { Hand, VideoOff, Loader2, AlertCircle, HelpCircle, X, MousePointerClick, MoveVertical } from 'lucide-react';
import useHandTracking from '../hooks/useHandTracking';
import usePipWindow from '../hooks/usePipWindow';
import useClickSound from '../hooks/useClickSound';

export default function HandCursor() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const playClick = useClickSound();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { position, handleMouseDown, handleTouchStart } = usePipWindow();
  const {
    active, loading, error,
    cursorPos, isPinching, isScrolling, ripples,
    handleToggle, onPinch,
  } = useHandTracking(videoRef, canvasRef);

  onPinch(playClick);

  const handleSensorToggle = async () => {
    if (!active && localStorage.getItem('handHelpSeen') !== '1') {
      setShowHelp(true);
      localStorage.setItem('handHelpSeen', '1');
    }
    await handleToggle();
  };

  return (
    <>
      {/* 1. Global Virtual Cursor Overlay */}
      {active && (
        <div 
          className="fixed w-6 h-6 rounded-full border border-white shadow-xl pointer-events-none z-[99999] transition-transform duration-75 flex items-center justify-center bg-indigo-500/35"
          style={{ 
            left: `${cursorPos.x}px`, 
            top: `${cursorPos.y}px`, 
            transform: `translate(-50%, -50%) scale(${isPinching ? 0.75 : isScrolling ? 1.25 : 1})`,
            boxShadow: isPinching 
              ? '0 0 15px 4px rgba(244, 63, 94, 0.6)' 
              : isScrolling
              ? '0 0 15px 4px rgba(16, 185, 129, 0.6)'
              : '0 0 10px 2px rgba(99, 102, 241, 0.4)'
          }}
        >
          {/* Cyan dot for standard pointing, Rose for pinching (clicking), Emerald with icon for scrolling */}
          <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-150 flex items-center justify-center text-[6px] text-white font-extrabold ${
            isScrolling ? 'bg-emerald-500' : isPinching ? 'bg-rose-500' : 'bg-cyan-400'
          }`}>
            {isScrolling && '↕'}
          </div>
        </div>
      )}

      {/* 2. Visual click ripples */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="fixed w-10 h-10 border-2 rounded-full pointer-events-none z-[99998] animate-hand-ripple"
          style={{ left: `${r.x}px`, top: `${r.y}px` }}
        />
      ))}

      {/* 3. Floating Control Button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3.5">
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 max-w-xs animate-bounce">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Panduan gestur */}
        {showHelp && (
          <div className="w-[calc(100vw-3rem)] max-w-xs bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-xl p-4 animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-black text-sm text-[var(--color-text)] flex items-center gap-2">
                <Hand className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Cara Pakai Sensor Tangan
              </h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="Tutup">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center shrink-0">
                  <MousePointerClick className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--color-text)]">Cubit untuk klik</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] leading-snug">Satukan ujung jempol dan telunjuk seperti mencubit.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shrink-0">
                  <MoveVertical className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--color-text)]">Angkat / turunkan tangan untuk scroll</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] leading-snug">Gerakkan tangan ke area atas untuk scroll naik, ke bawah untuk scroll turun.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/50 flex items-center justify-center shrink-0">
                  <Hand className="w-4 h-4 text-cyan-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--color-text)]">Gerakkan telunjuk untuk mengarahkan</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] leading-snug">Titik kursor akan mengikuti ujung telunjukmu.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {!showHelp && (
            <button
              onClick={() => setShowHelp(true)}
              className="w-11 h-11 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-lg active:scale-95 transition-all flex items-center justify-center"
              title="Cara pakai sensor tangan"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleSensorToggle}
            disabled={loading}
            className={`flex items-center gap-2 px-4.5 py-3 rounded-2xl font-bold text-xs shadow-lg active:scale-95 transition-all duration-300 ${
              active
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10'
                : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-200 dark:hover:border-indigo-500/30'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memuat AI Model...</span>
              </>
            ) : active ? (
              <>
                <VideoOff className="w-4.5 h-4.5" />
                <span>Matikan Sensor</span>
              </>
            ) : (
              <>
                <Hand className="w-4.5 h-4.5" />
                <span>Aktivasi Sensor</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Mini PIP-style Camera Feed Window */}
      <div 
        className={`fixed w-32 sm:w-48 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-indigo-500/80 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl z-[9999] flex-col ${active ? 'flex' : 'hidden'} transition-all duration-300`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        {/* Sleek Draggable Header Bar */}
        <div 
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={() => setIsMinimized(!isMinimized)}
          title="Klik 2x untuk menyembunyikan/menampilkan kamera"
          className="drag-header flex items-center justify-between w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-indigo-500/20 select-none cursor-grab active:cursor-grabbing hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
        >
          {/* Decorative Window Controls */}
          <div className="flex gap-1.5 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-rose-500/70" />
            <div className="w-2 h-2 rounded-full bg-amber-500/70" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
          </div>
          {/* AI Active Pulse Badge */}
          <div className="flex items-center gap-1.5 pointer-events-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[7.5px] font-black tracking-widest text-slate-500 dark:text-slate-300 uppercase">AI SENSOR</span>
          </div>
        </div>

        {/* Camera Feed Body */}
        <div className={`relative w-full transition-all duration-300 transform -scale-x-100 bg-slate-100 dark:bg-slate-950 pointer-events-none ${isMinimized ? 'h-0 opacity-0 overflow-hidden' : 'h-24 sm:h-36'}`}>
          {/* Display video element directly instead of hidden */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Transparent canvas overlay for tracking dots */}
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        </div>
      </div>
    </>
  );
}
