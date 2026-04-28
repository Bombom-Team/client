import { useEffect, useRef, useState } from 'react';

export const useReveal = <T extends HTMLElement>(threshold = 0.15) => {
  const revealRef = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    const node = revealRef.current;

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return {
    revealRef,
    visible,
  };
};
