import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { FAQ_ITEMS } from '@/pages/landing/constants/landingContent';
import { useReveal } from '@/pages/landing/hooks/useReveal';
import LandingAboutSection from './LandingAboutSection';
import LandingExperienceSection from './LandingExperienceSection';
import LandingFaqSection from './LandingFaqSection';
import LandingFooter from './LandingFooter';
import LandingHero from './LandingHero';
import LandingTopNav from './LandingTopNav';

const clampValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const LandingPage = () => {
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(1);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const { revealRef: aboutRef, visible: aboutVisible } =
    useReveal<HTMLElement>(0.2);
  const { revealRef: experienceRef, visible: experienceVisible } =
    useReveal<HTMLElement>(0.2);
  const { revealRef: faqRef, visible: faqVisible } = useReveal<HTMLElement>(0.15);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncReducedMotion = () => {
      setIsReducedMotion(mediaQuery.matches);
    };

    syncReducedMotion();
    mediaQuery.addEventListener('change', syncReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', syncReducedMotion);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight || 1);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleResize();
    handleScroll();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFaqToggle = (faqId: string) => {
    setOpenFaqId((prevId) => (prevId === faqId ? '' : faqId));
  };

  const aboutProgress = isReducedMotion
    ? 1
    : clampValue(
        (scrollY - viewportHeight * 0.68) / (viewportHeight * 0.92),
        0,
        1,
      );

  const experienceProgress = isReducedMotion
    ? 1
    : clampValue(
        (scrollY - viewportHeight * 1.34) / (viewportHeight * 0.94),
        0,
        1,
      );

  return (
    <Container>
      <LandingTopNav />
      <LandingHero />
      <LandingAboutSection
        aboutProgress={aboutProgress}
        visible={aboutVisible}
        sectionRef={aboutRef}
      />
      <LandingExperienceSection
        experienceProgress={experienceProgress}
        visible={experienceVisible}
        sectionRef={experienceRef}
      />
      <LandingFaqSection
        openFaqId={openFaqId}
        onToggleFaq={handleFaqToggle}
        visible={faqVisible}
        sectionRef={faqRef}
      />
      <LandingFooter />
    </Container>
  );
};

export default LandingPage;

const Container = styled.main`
  background: oklch(99% 0.002 80deg);
`;
