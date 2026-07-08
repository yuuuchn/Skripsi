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

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

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
  }, [enableBlur, baseOpacity, baseRotation, blurStrength, rotationEnd, wordAnimationEnd, scrollContainerRef]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <span className={textClassName}>{splitText}</span>
    </div>
  );
}
