import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ 
  children, 
  scrollContainerRef, 
  enableBlur = true, 
  baseOpacity = 0.1, 
  baseRotation = 0, 
  blurStrength = 4, 
  containerClassName = '', 
  textClassName = '', 
  rotationEnd = 'bottom bottom', 
  wordAnimationEnd = 'bottom bottom' 
}) {
  const containerRef = useRef(null);

  const isLightweight = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px), (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)').matches;
  }, []);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    if (isLightweight || (baseOpacity >= 1 && (!enableBlur || blurStrength <= 0))) {
      return text;
    }
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children, isLightweight, baseOpacity, enableBlur, blurStrength]);

  useEffect(() => {
    if (isLightweight) return;
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const ctx = gsap.context(() => {
      // Optional Rotation animation (disabled by default with baseRotation=0)
      if (baseRotation !== 0) {
        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom',
              end: rotationEnd,
              scrub: true,
            },
          }
        );
      }

      // Word reveal animation
      const wordElements = el.querySelectorAll('.word');
      if (wordElements.length === 0) return;

      if (baseOpacity < 1) {
        gsap.fromTo(
          wordElements,
          { opacity: baseOpacity, willChange: 'opacity' },
          {
            ease: 'none',
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        );
      }

      // Blur animation (if enabled and strength is greater than 0)
      if (enableBlur && blurStrength > 0) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [isLightweight, enableBlur, baseOpacity, baseRotation, blurStrength, rotationEnd, wordAnimationEnd, scrollContainerRef]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <span className={textClassName}>{splitText}</span>
    </div>
  );
}
