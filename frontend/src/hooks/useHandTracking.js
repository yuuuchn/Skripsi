import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

const CANVAS_W = 320;
const CANVAS_H = 240;
const SMOOTHING = 0.22;
const CLICK_THRESHOLD = 0.054;
const FREEZE_THRESHOLD = 0.068;
const TOP_BOUND = 0.15;
const BOTTOM_BOUND = 0.75;
const RANGE_Y = BOTTOM_BOUND - TOP_BOUND;
const SCROLL_UP_VELOCITY = -15;
const SCROLL_DOWN_VELOCITY = 15;
const DAMPING = 0.82;
const RESPONSE = 0.18;
const VELOCITY_DEADZONE = 0.1;

function drawScrollZones(ctx, isActiveTop, isActiveBottom) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.fillStyle = isActiveTop ? 'rgba(16, 185, 129, 0.28)' : 'rgba(99, 102, 241, 0.12)';
  ctx.fillRect(0, 0, w, h * TOP_BOUND);

  ctx.strokeStyle = isActiveTop ? '#10b981' : 'rgba(99, 102, 241, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, h * TOP_BOUND);
  ctx.lineTo(w, h * TOP_BOUND);
  ctx.stroke();

  ctx.fillStyle = isActiveBottom ? 'rgba(16, 185, 129, 0.28)' : 'rgba(99, 102, 241, 0.12)';
  ctx.fillRect(0, h * BOTTOM_BOUND, w, h * 0.25);

  ctx.beginPath();
  ctx.moveTo(0, h * BOTTOM_BOUND);
  ctx.lineTo(w, h * BOTTOM_BOUND);
  ctx.stroke();
}

function drawHandSkeleton(ctx, mappedLandmarks) {
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 3;

  const drawPath = (indices) => {
    ctx.beginPath();
    for (let i = 0; i < indices.length; i++) {
      const pt = mappedLandmarks[indices[i]];
      if (!pt) continue;
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
  };

  drawPath([0, 5, 6, 7, 8]);
  drawPath([0, 1, 2, 3, 4]);

  const pt1 = mappedLandmarks[1];
  const pt5 = mappedLandmarks[5];
  if (pt1 && pt5) {
    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt5.x, pt5.y);
    ctx.stroke();
  }

  ctx.fillStyle = '#22d3ee';
  const activeJoints = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (const jointIdx of activeJoints) {
    const pt = mappedLandmarks[jointIdx];
    if (!pt) continue;
    ctx.beginPath();
    const radius = (jointIdx === 4 || jointIdx === 8) ? 6 : 4;
    ctx.fillStyle = (jointIdx === 4 || jointIdx === 8) ? '#f43f5e' : '#22d3ee';
    ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const mapToCanvas = (pt, imgWidth, imgHeight, sx, sWidth, sHeight, canvas) => {
  if (!pt) return null;
  return {
    x: ((pt.x * imgWidth - sx) / sWidth) * canvas.width,
    y: ((pt.y * imgHeight - sy) / sHeight) * canvas.height,
  };
};

export default function useHandTracking(videoRef, canvasRef) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isPinching, setIsPinching] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [ripples, setRipples] = useState([]);

  const cursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const landmarkerRef = useRef(null);
  const animationFrameId = useRef(null);
  const pinchingRef = useRef(false);
  const streamRef = useRef(null);
  const scrollVelocity = useRef(0);
  const onPinchRef = useRef(null);

  const onPinch = (fn) => { onPinchRef.current = fn; };

  const triggerClick = (x, y) => {
    const elem = document.elementFromPoint(x, y);
    if (!elem) return;

    if (onPinchRef.current) onPinchRef.current();

    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 500);

    const dispatch = (type) => {
      elem.dispatchEvent(new MouseEvent(type, {
        bubbles: true, cancelable: true, view: window, clientX: x, clientY: y,
      }));
    };
    dispatch('mousedown');
    dispatch('mouseup');
    dispatch('click');

    if (typeof elem.focus === 'function') elem.focus();
  };

  const stopTracking = () => {
    setActive(false);
    setLoading(false);
    setIsPinching(false);
    setIsScrolling(false);
    pinchingRef.current = false;
    scrollVelocity.current = 0;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const startTracking = async () => {
    setLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute('muted', '');
        videoRef.current.setAttribute('playsinline', '');
        try { await videoRef.current.play(); } catch (_) {}
      }

      const dpr = window.devicePixelRatio || 1;
      if (canvasRef.current) {
        canvasRef.current.width = CANVAS_W * dpr;
        canvasRef.current.height = CANVAS_H * dpr;
      }

      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
        );
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.38,
          minHandPresenceConfidence: 0.38,
          minTrackingConfidence: 0.35,
        });
      }

      setActive(true);
      setLoading(false);
    } catch (err) {
      setError(`Gagal mengakses kamera/model AI: ${err.message || err}`);
      setLoading(false);
      stopTracking();
    }
  };

  const handleToggle = async () => {
    if (active) stopTracking();
    else await startTracking();
  };

  useEffect(() => {
    if (!active || !videoRef.current || !canvasRef.current || !landmarkerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;
    const ctx = canvas.getContext('2d');

    let lastVideoTime = -1;

    const detect = () => {
      let targetScrollVelocity = 0;

      try {
        if (video.videoWidth > 0) {
          const imgWidth = video.videoWidth;
          const imgHeight = video.videoHeight;
          let sx = 0, sy = 0, sWidth = imgWidth, sHeight = imgHeight;

          if (ctx && canvas) {
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = imgWidth / imgHeight;

            if (imgRatio > canvasRatio) {
              sWidth = imgHeight * canvasRatio;
              sx = (imgWidth - sWidth) / 2;
            } else {
              sHeight = imgWidth / canvasRatio;
              sy = (imgHeight - sHeight) / 2;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
          }

          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            const results = landmarker.detectForVideo(video, performance.now());

            if (results.landmarks && results.landmarks.length > 0) {
              const landmarks = results.landmarks[0];

              const mappedLandmarks = landmarks.map(pt =>
                mapToCanvas(pt, imgWidth, imgHeight, sx, sWidth, sHeight, canvas)
              );
              const indexTipMapped = mappedLandmarks[8];
              const thumbTipMapped = mappedLandmarks[4];

              const indexTip = landmarks[8];
              const thumbTip = landmarks[4];

              if (indexTipMapped && thumbTipMapped) {
                const rx = indexTipMapped.x / canvas.width;
                const ry = indexTipMapped.y / canvas.height;
                const thumbRy = thumbTipMapped.y / canvas.height;

                const isScrollUpActive = ry <= TOP_BOUND;
                const isScrollDownActive = thumbRy >= BOTTOM_BOUND;

                if (ctx && canvas) {
                  drawScrollZones(ctx, isScrollUpActive, isScrollDownActive);
                  drawHandSkeleton(ctx, mappedLandmarks);
                }

                if (isScrollUpActive) {
                  targetScrollVelocity = SCROLL_UP_VELOCITY;
                  setIsScrolling(true);
                  setIsPinching(false);
                  pinchingRef.current = false;
                } else if (isScrollDownActive) {
                  targetScrollVelocity = SCROLL_DOWN_VELOCITY;
                  setIsScrolling(true);
                  setIsPinching(false);
                  pinchingRef.current = false;
                } else {
                  setIsScrolling(false);

                  const scaleX = (1 - rx - 0.22) / 0.56;
                  const scaleY = (ry - TOP_BOUND) / RANGE_Y;

                  const clampedX = Math.max(0, Math.min(1, scaleX));
                  const clampedY = Math.max(0, Math.min(1, scaleY));

                  const targetX = clampedX * window.innerWidth;
                  const targetY = clampedY * window.innerHeight;

                  const dx = thumbTip.x - indexTip.x;
                  const dy = thumbTip.y - indexTip.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance >= FREEZE_THRESHOLD && !pinchingRef.current) {
                    cursorRef.current.x = cursorRef.current.x * (1 - SMOOTHING) + targetX * SMOOTHING;
                    cursorRef.current.y = cursorRef.current.y * (1 - SMOOTHING) + targetY * SMOOTHING;
                    setCursorPos({ x: cursorRef.current.x, y: cursorRef.current.y });
                  }

                  if (distance < CLICK_THRESHOLD) {
                    if (!pinchingRef.current) {
                      pinchingRef.current = true;
                      setIsPinching(true);
                      triggerClick(cursorRef.current.x, cursorRef.current.y);
                    }
                  } else if (pinchingRef.current) {
                    pinchingRef.current = false;
                    setIsPinching(false);
                  }
                }
              }
            } else if (ctx && canvas) {
              drawScrollZones(ctx, false, false);
            }
          }
        }

        scrollVelocity.current = scrollVelocity.current * DAMPING + targetScrollVelocity * RESPONSE;
        if (Math.abs(scrollVelocity.current) < VELOCITY_DEADZONE) {
          scrollVelocity.current = 0;
        }

        if (scrollVelocity.current !== 0) {
          window.scrollBy({ top: scrollVelocity.current, behavior: 'instant' });
        }
      } catch (detectErr) {
        setError(`AI Error: ${detectErr.message || detectErr}`);
        stopTracking();
        return;
      }

      animationFrameId.current = requestAnimationFrame(detect);
    };

    detect();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [active]);

  useEffect(() => {
    return () => stopTracking();
  }, []);

  return {
    active, loading, error,
    cursorPos, isPinching, isScrolling, ripples,
    handleToggle, onPinch,
  };
}
