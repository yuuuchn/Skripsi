import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { Hand, VideoOff, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function HandCursor() {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPinching, setIsPinching] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [ripples, setRipples] = useState([]);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  const landmarkerRef = useRef(null);
  const animationFrameId = useRef(null);
  const pinchingRef = useRef(false);
  const streamRef = useRef(null);
  
  // Refs for tracking click state
  const pinchStartX = useRef(0);
  const pinchStartY = useRef(0);

  // Toggle hand cursor mode
  const handleToggle = async () => {
    if (active) {
      stopTracking();
    } else {
      await startTracking();
    }
  };

  const startTracking = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get webcam stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute('muted', '');
        videoRef.current.setAttribute('playsinline', '');
        
        // Force video play
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn("Webcam video play trigger issue:", playErr);
        }
      }

      // 2. Load MediaPipe HandLandmarker
      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.38,
          minHandPresenceConfidence: 0.38,
          minTrackingConfidence: 0.35
        });
        landmarkerRef.current = landmarker;
      }

      setActive(true);
      setLoading(false);
    } catch (err) {
      console.error("Failed to start hand tracking:", err);
      setError(`Gagal mengakses kamera/model AI: ${err.message || err}`);
      setLoading(false);
      stopTracking();
    }
  };

  const stopTracking = () => {
    setActive(false);
    setLoading(false);
    setIsPinching(false);
    setIsScrolling(false);
    pinchingRef.current = false;

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Cancel animation loop
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  // Main tracking loop
  useEffect(() => {
    if (!active || !videoRef.current || !landmarkerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    let lastVideoTime = -1;
    const alpha = 0.22; // Smoothing coefficient

    const detect = () => {
      try {
        if (video.videoWidth > 0) {
          // 1. Draw mirrored camera frame onto the canvas
          if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }

          const now = performance.now();
          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            
            const results = landmarker.detectForVideo(video, now);
            
            if (results.landmarks && results.landmarks.length > 0) {
              const landmarks = results.landmarks[0];

              // Key landmarks (only index finger tip & thumb tip needed)
              const indexTip = landmarks[8];
              const indexKnuckle = landmarks[6];
              const thumbTip = landmarks[4];

              if (indexTip && thumbTip && indexKnuckle) {
                // Coordinate mapping from normalized camera [0.0 - 1.0] to viewport pixels
                // Using 0.22 to 0.78 bounding box for ergonomic screen reach
                const scaleX = (1 - indexTip.x - 0.22) / 0.56;
                const scaleY = (indexTip.y - 0.22) / 0.56;

                // --- CUSTOM SCROLL ZONES TARGETING SPECIFIC FINGERS ---
                // Scroll Up: Only triggered when INDEX FINGER tip (8) enters the upper zone (scaleY <= 0)
                const isScrollUpActive = scaleY <= 0;
                
                // Scroll Down: Only triggered when THUMB tip (4) enters the lower zone (Y >= 0.78)
                const thumbScaleY = (thumbTip.y - 0.22) / 0.56;
                const isScrollDownActive = thumbScaleY >= 1;

                // Draw skeleton landmarks & scroll zones overlay on canvas
                if (ctx && canvas) {
                  drawScrollZones(ctx, isScrollUpActive, isScrollDownActive);
                  drawHandSkeleton(ctx, landmarks);
                }

                if (isScrollUpActive) {
                  // Index finger is in upper zone -> Scroll Up
                  setIsScrolling(true);
                  setIsPinching(false);
                  pinchingRef.current = false;
                  window.scrollBy(0, -11); // Scroll Up speed
                } else if (isScrollDownActive) {
                  // Thumb is in lower zone -> Scroll Down
                  setIsScrolling(true);
                  setIsPinching(false);
                  pinchingRef.current = false;
                  window.scrollBy(0, 11); // Scroll Down speed
                } else {
                  // Hand is in the middle POINTER zone
                  setIsScrolling(false);

                  const clampedX = Math.max(0, Math.min(1, scaleX));
                  const clampedY = Math.max(0, Math.min(1, scaleY));

                  const targetX = clampedX * window.innerWidth;
                  const targetY = clampedY * window.innerHeight;

                  // --- STABLE 2D PINCH DETECTION (FIXED BUG) ---
                  // Calculate distance in 2D (X and Y only) to avoid noisy 3D depth jumps
                  const dx = thumbTip.x - indexTip.x;
                  const dy = thumbTip.y - indexTip.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);

                  // Slightly widened thresholds for highly reliable 2D clicking
                  const clickThreshold = 0.054;
                  const freezeThreshold = 0.068;

                  // Anti-slip lock: freeze cursor position while preparing to click
                  if (distance >= freezeThreshold && !pinchingRef.current) {
                    cursorRef.current.x = cursorRef.current.x * (1 - alpha) + targetX * alpha;
                    cursorRef.current.y = cursorRef.current.y * (1 - alpha) + targetY * alpha;
                    setCursorPos({ x: cursorRef.current.x, y: cursorRef.current.y });
                  }

                  if (distance < clickThreshold) {
                    if (!pinchingRef.current) {
                      pinchingRef.current = true;
                      setIsPinching(true);
                      pinchStartX.current = cursorRef.current.x;
                      pinchStartY.current = cursorRef.current.y;
                      triggerClick(cursorRef.current.x, cursorRef.current.y);
                    }
                  } else {
                    if (pinchingRef.current) {
                      pinchingRef.current = false;
                      setIsPinching(false);
                    }
                  }
                }
              }
            } else {
              // Draw scroll zones even when no hand is detected
              if (ctx && canvas) {
                drawScrollZones(ctx, false, false);
              }
            }
          }
        }
      } catch (detectErr) {
        console.error("Error in detection loop:", detectErr);
        setError(`AI Error: ${detectErr.message || detectErr}`);
        stopTracking();
        return;
      }
      
      animationFrameId.current = requestAnimationFrame(detect);
    };

    detect();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [active]);

  // Helper to draw scroll zones on the preview canvas
  const drawScrollZones = (ctx, isActiveTop, isActiveBottom) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    
    // Top Zone (Scroll Up)
    ctx.fillStyle = isActiveTop ? 'rgba(16, 185, 129, 0.28)' : 'rgba(99, 102, 241, 0.12)';
    ctx.fillRect(0, 0, w, h * 0.22);
    
    ctx.strokeStyle = isActiveTop ? '#10b981' : 'rgba(99, 102, 241, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.22);
    ctx.lineTo(w, h * 0.22);
    ctx.stroke();
    
    ctx.fillStyle = isActiveTop ? '#10b981' : '#a5b4fc';
    ctx.font = 'bold 8px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▲ SCROLL UP (TELUNJUK)', w / 2, h * 0.14);
    
    // Bottom Zone (Scroll Down)
    ctx.fillStyle = isActiveBottom ? 'rgba(16, 185, 129, 0.28)' : 'rgba(99, 102, 241, 0.12)';
    ctx.fillRect(0, h * 0.78, w, h * 0.22);
    
    ctx.beginPath();
    ctx.moveTo(0, h * 0.78);
    ctx.lineTo(w, h * 0.78);
    ctx.stroke();
    
    ctx.fillStyle = isActiveBottom ? '#10b981' : '#a5b4fc';
    ctx.fillText('▼ SCROLL DOWN (JEMPOL)', w / 2, h * 0.92);
  };

  // Helper to draw ONLY index finger and thumb landmarks/skeleton on canvas
  const drawHandSkeleton = (ctx, landmarks) => {
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    
    // 1. Draw Index Finger Path (0 -> 5 -> 6 -> 7 -> 8)
    ctx.beginPath();
    const indexPath = [0, 5, 6, 7, 8];
    for (let i = 0; i < indexPath.length; i++) {
      const pt = landmarks[indexPath[i]];
      if (pt) {
        if (i === 0) ctx.moveTo(pt.x * ctx.canvas.width, pt.y * ctx.canvas.height);
        else ctx.lineTo(pt.x * ctx.canvas.width, pt.y * ctx.canvas.height);
      }
    }
    ctx.stroke();

    // 2. Draw Thumb Path (0 -> 1 -> 2 -> 3 -> 4)
    ctx.beginPath();
    const thumbPath = [0, 1, 2, 3, 4];
    for (let i = 0; i < thumbPath.length; i++) {
      const pt = landmarks[thumbPath[i]];
      if (pt) {
        if (i === 0) ctx.moveTo(pt.x * ctx.canvas.width, pt.y * ctx.canvas.height);
        else ctx.lineTo(pt.x * ctx.canvas.width, pt.y * ctx.canvas.height);
      }
    }
    ctx.stroke();

    // 3. Connect Thumb Base to Index Base (1 to 5) for palm base connection
    ctx.beginPath();
    const pt1 = landmarks[1];
    const pt5 = landmarks[5];
    if (pt1 && pt5) {
      ctx.moveTo(pt1.x * ctx.canvas.width, pt1.y * ctx.canvas.height);
      ctx.lineTo(pt5.x * ctx.canvas.width, pt5.y * ctx.canvas.height);
    }
    ctx.stroke();

    // 4. Draw Joint Nodes only for Index (5, 6, 7, 8), Thumb (1, 2, 3, 4), and Base (0)
    ctx.fillStyle = '#22d3ee';
    const activeJoints = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (const jointIdx of activeJoints) {
      const pt = landmarks[jointIdx];
      if (pt) {
        ctx.beginPath();
        const radius = (jointIdx === 4 || jointIdx === 8) ? 6 : 4;
        ctx.fillStyle = (jointIdx === 4 || jointIdx === 8) ? '#f43f5e' : '#22d3ee';
        ctx.arc(pt.x * ctx.canvas.width, pt.y * ctx.canvas.height, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  // Trigger click at coordinate (x, y)
  const triggerClick = (x, y) => {
    const elem = document.elementFromPoint(x, y);
    if (!elem) return;

    // Visual ripple effect
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 500);

    // Simulate standard DOM events
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y
    });

    const mousedown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y
    });

    const mouseup = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y
    });

    elem.dispatchEvent(mousedown);
    elem.dispatchEvent(mouseup);
    elem.dispatchEvent(clickEvent);
    
    // Focus support
    if (typeof elem.focus === 'function') {
      elem.focus();
    }
  };

  return (
    <>
      <style>{`
        @keyframes hand-ripple-effect {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; border-color: #6366f1; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; border-color: #f43f5e; }
        }
        .animate-hand-ripple {
          animation: hand-ripple-effect 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>

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
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 max-w-xs animate-bounce">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`flex items-center gap-2 px-4.5 py-3 rounded-2xl font-bold text-xs shadow-lg active:scale-95 transition-all duration-300 ${
            active 
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10' 
              : 'bg-white hover:bg-slate-50 text-indigo-600 border border-slate-100 hover:shadow-indigo-500/5'
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
              <span>Matikan Sensor 🖐️</span>
            </>
          ) : (
            <>
              <Hand className="w-4.5 h-4.5 text-indigo-600" />
              <span>Aktivasi Sensor 🖐️</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Mini PIP-style Camera Feed Window */}
      <div className={`fixed bottom-6 left-6 w-44 h-33 bg-slate-900 border-2 border-indigo-500/80 rounded-2xl overflow-hidden shadow-2xl z-[9999] items-center justify-center ${active ? 'flex' : 'hidden'}`}>
        <div className="relative w-full h-full transform -scale-x-100">
          {/* Hidden video element used for tracking */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="hidden"
          />
          {/* Canvas renders both webcam video frame & hand skeleton overlay */}
          <canvas 
            ref={canvasRef}
            width={320}
            height={240}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-2 left-2 bg-indigo-600/90 text-[8px] font-extrabold text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 fill-white" />
          <span>AI Tracking Active</span>
        </div>
      </div>
    </>
  );
}
