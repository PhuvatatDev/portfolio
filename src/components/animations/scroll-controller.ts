/**
 * Portfolio Scroll Controller — v4
 *
 * Each card uses a SINGLE timeline for its entire lifecycle (entry → stay → exit).
 * This prevents tween conflicts on scroll-back.
 *
 * Transitions overlap: exit of card A and entry of card B share the same scroll range.
 * Achieved via endTrigger spanning timelines across section boundaries.
 *
 * Section heights: Hero 100vh, MyWork 200vh, PhoneShowcase 300vh,
 *                  RepoSection 250vh, AboutSection 250vh, Contact 150vh
 *
 * Scroll positions (approx):
 *   Hero start: 0vh          MyWork start: 100vh
 *   PhoneShowcase start: 300vh   RepoSection start: 600vh
 *   AboutSection start: 850vh    Contact start: 1100vh
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollController() {
  // ============================================
  // Element references
  // ============================================
  const codeGrid = document.getElementById('code-grid');
  if (!codeGrid) return;
  const gridCanvas = codeGrid.children[1] as HTMLElement;
  if (!gridCanvas) return;

  const myWorkSection = document.getElementById('my-work');
  const phoneShowcase = document.getElementById('phone-showcase');
  const repoSection = document.getElementById('repo-section');
  const aboutSection = document.getElementById('about-section');
  const contactSection = document.getElementById('contact-section');

  const processCard = document.getElementById('process-card');
  const phoneContainer = document.getElementById('phone-container');
  const techPanelContainer = document.getElementById('tech-panel-container');
  const repoCard = document.getElementById('repo-card');
  const aboutCard = document.getElementById('about-card');

  // Vertical section labels — synced with their respective cards
  const processLabel = document.getElementById('process-label');
  const techLabel = document.getElementById('tech-label');
  const repoLabel = document.getElementById('repo-label');
  const aboutLabel = document.getElementById('about-label');

  const heroSection = document.getElementById('hero');
  const heroMarqueeText = document.getElementById('hero-marquee-text');
  const heroLastWord = document.getElementById('hero-last-word');
  const heroBottomLeft = document.getElementById('hero-bottom-left');
  const heroIllustrations = document.getElementById('hero-illustrations');
  const siteHeader = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress');
  const contactText = document.getElementById('contact-text');
  const scatteredCards = document.getElementById('scattered-cards');

  // ============================================
  // 1. Grid parallax
  // ============================================
  gsap.to(gridCanvas, {
    y: -3000,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });

  // ============================================
  // 2. Scroll progress bar
  // ============================================
  if (progressBar) {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progressBar.style.left = `${self.progress * 80}%`;
      },
    });
  }

  // ============================================
  // 3a. Hero marquee — horizontal scroll-driven translate
  // Text translates from 0 to -(scrollWidth - viewport) over the full Hero section
  // Responsive: function-based x value + invalidateOnRefresh recalculates on resize
  // ============================================
  if (heroSection && heroMarqueeText) {
    gsap.to(heroMarqueeText, {
      x: () => -heroMarqueeText.scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  }

  // ============================================
  // 3b. Hero bottom-left (subtext + CTAs) — fade out near end of Hero
  // Clears the bottom-left area before the process card enters
  // ============================================
  if (heroSection && heroBottomLeft) {
    gsap.to(heroBottomLeft, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: '70% top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // ============================================
  // 4. Illustration responsive compression
  // ============================================
  const isMobile = window.innerWidth < 1180;
  const illustrations = [
    document.getElementById('illus-build'),
    document.getElementById('illus-idea'),
    document.getElementById('illus-live'),
    document.getElementById('illus-discussion'),
  ].filter((el): el is HTMLElement => el !== null);

  if (!isMobile && illustrations.length === 4) {
    const DESIGN_WIDTH = 1920;
    const illusOriginals = illustrations.map(el => ({
      el,
      right: parseFloat(el.style.right),
      top: parseFloat(el.style.top),
    }));
    const avgRight = illusOriginals.reduce((s, c) => s + c.right, 0) / illusOriginals.length;
    const avgTop = illusOriginals.reduce((s, c) => s + c.top, 0) / illusOriginals.length;

    function compressIllustrations() {
      const t = Math.max(0, Math.min(1, (window.innerWidth - 1180) / (DESIGN_WIDTH - 1180)));
      const hCompress = 0.5 + 0.5 * t;
      const vCompress = 0.85 + 0.15 * t;
      illusOriginals.forEach(({ el, right, top }) => {
        el.style.right = (avgRight + (right - avgRight) * hCompress) + 'vw';
        el.style.top = (avgTop + (top - avgTop) * vCompress) + 'vh';
      });
    }

    compressIllustrations();
    // invalidateOnRefresh on Section 5 tweens handles ScrollTrigger re-measure,
    // so we only need to reapply the compressed positions here.
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1180) {
        compressIllustrations();
      }
    });
  }

  // ============================================
  // 5. Illustration convergence (separate from card timeline)
  // These animate the illustration elements, not the process card itself
  // ============================================
  const slotIdea = document.querySelector('#process-slot-idea .process-illus-slot') as HTMLElement;
  const slotDiscussion = document.querySelector('#process-slot-discussion .process-illus-slot') as HTMLElement;
  const slotBuild = document.querySelector('#process-slot-build .process-illus-slot') as HTMLElement;
  const slotLive = document.querySelector('#process-slot-live .process-illus-slot') as HTMLElement;

  const illusIdea = document.getElementById('illus-idea');
  const illusDiscussion = document.getElementById('illus-discussion');
  const illusBuild = document.getElementById('illus-build');
  const illusLive = document.getElementById('illus-live');

  if (processCard) {
    gsap.set(processCard, { xPercent: -50, yPercent: -50 });
  }

  // Mobile skips convergence (slot coordinates are desktop-only; Section 4
  // isMobile guard kept illustration positions at original 1920px coords).
  if (!isMobile && myWorkSection && processCard
      && illusIdea && illusDiscussion && illusBuild && illusLive
      && slotIdea && slotDiscussion && slotBuild && slotLive) {

    const pairs = [
      { illus: illusIdea, slot: slotIdea },
      { illus: illusDiscussion, slot: slotDiscussion },
      { illus: illusBuild, slot: slotBuild },
      { illus: illusLive, slot: slotLive },
    ];

    pairs.forEach(({ illus, slot }) => {
      gsap.to(illus, {
        x: () => {
          const ir = illus.getBoundingClientRect();
          const sr = slot.getBoundingClientRect();
          return (sr.left + sr.width / 2) - (ir.left + ir.width / 2);
        },
        y: () => {
          const ir = illus.getBoundingClientRect();
          const sr = slot.getBoundingClientRect();
          return (sr.top + sr.height / 2) - (ir.top + ir.height / 2);
        },
        scale: () => slot.getBoundingClientRect().width / illus.offsetWidth,
        rotateY: 0,
        rotateX: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: () => {
            // Start when the last word 'deployment' is centered horizontally
            if (!heroLastWord || !heroMarqueeText) return 'top top';
            const currentX = (gsap.getProperty(heroMarqueeText, 'x') as number) || 0;
            const wordRect = heroLastWord.getBoundingClientRect();
            const wordCenterNatural = wordRect.left + wordRect.width / 2 - currentX;
            const translateNeeded = window.innerWidth / 2 - wordCenterNatural;
            const progress = Math.max(0, Math.min(0.99, -translateNeeded / heroMarqueeText.scrollWidth));
            return `${(progress * 100).toFixed(2)}% top`;
          },
          end: '140% top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
  }

  // ============================================
  // 6. Process card — SINGLE TIMELINE (fade in → stay → exit up)
  // Range: MyWork 'top 85%' (~15vh) to MyWork '80% top' (~260vh) = 245vh
  // Starts at same point as illustration convergence so they sync on scroll-back.
  // Fade in: 0-35% (85vh, synced with illustrations 15→100vh)
  // Exit: 78-92% (34vh) — y:-100vh clears viewport before phone enters
  // ============================================
  if (processCard && myWorkSection) {
    // Vertical centering for process label (CSS top:55% + GSAP yPercent:-50)
    if (processLabel) gsap.set(processLabel, { yPercent: -50 });

    const processTl = gsap.timeline({
      scrollTrigger: {
        trigger: myWorkSection,
        start: 'top top',
        end: '80% top',
        scrub: true,
      },
    });

    // Entry — reveal from bottom via clipPath (card stays physically at y:0
    // so slot positions remain measurable by illustration convergence).
    // ⚠️ DO NOT add layout-affecting properties (y, translateY, yPercent) here.
    // clipPath + opacity are paint-only — if the card moves, Section 5's
    // getBoundingClientRect() on the slots returns wrong targets and
    // illustrations converge to offset positions.
    processTl.fromTo(processCard,
      { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
      { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.2 },
      0
    );

    // Section label — fade in with the card
    if (processLabel) {
      processTl.to(processLabel,
        { opacity: 1, duration: 0.2 },
        0
      );
    }

    // Exit upward + fade out — uses y (not yPercent) to travel full viewport height
    processTl.to(processCard,
      { y: '-100vh', opacity: 0, duration: 0.14 },
      0.78
    );

    // Section label — exit with the card
    if (processLabel) {
      processTl.to(processLabel,
        { y: '-100vh', opacity: 0, duration: 0.14 },
        0.78
      );
    }

    // Illustrations travel up WITH the card (same timing, same distance)
    // so they visually leave inside the card instead of fading prematurely
    if (heroIllustrations) {
      processTl.to(heroIllustrations,
        { y: '-100vh', opacity: 0, duration: 0.14 },
        0.78
      );
    }
  }

  // ============================================
  // 7. Phone + Tech — SINGLE TIMELINE (enter → stay → exit)
  // Range: MyWork '55% top' (~210vh) to PhoneShowcase '90% top' (~570vh) = 360vh
  // Entry: 0-14% (50vh), overlaps with process exit (80-100% of process TL = 210-260vh)
  // Exit: 85-100% (54vh), overlaps with repo entry (section 9)
  // ============================================
  if (phoneContainer && techPanelContainer && myWorkSection && phoneShowcase) {
    // Centering handled by #phone-panel-wrapper (flex + translate(-50%,-50%))
    // No yPercent set here — GSAP y tweens are additive translates from current position

    const phoneTechTl = gsap.timeline({
      scrollTrigger: {
        trigger: myWorkSection,
        start: '55% top',
        endTrigger: phoneShowcase,
        end: '90% top',
        scrub: true,
      },
    });

    // Phone + Tech enter together (5% delay so process card clears screen first)
    phoneTechTl
      .fromTo(phoneContainer,
        { y: '100vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.12 },
        0.05
      )
      .fromTo(techPanelContainer,
        { y: '100vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.12 },
        0.05
      );

    // Section label — fade in with phone+tech (label is child of #phone-panel-wrapper,
    // so it already follows the wrapper's position; we only animate opacity)
    if (techLabel) {
      phoneTechTl.to(techLabel,
        { opacity: 1, duration: 0.12 },
        0.05
      );
    }

    // Phone + Tech exit together
    phoneTechTl
      .to(phoneContainer,
        { y: '-100vh', opacity: 0, duration: 0.12 },
        0.85
      )
      .to(techPanelContainer,
        { y: '-100vh', opacity: 0, duration: 0.12 },
        0.85
      );

    // Section label — exit with phone+tech
    if (techLabel) {
      phoneTechTl.to(techLabel,
        { opacity: 0, duration: 0.12 },
        0.85
      );
    }
  }

  // ============================================
  // 8. Header hide during phone, show at contact
  // ============================================
  if (siteHeader && myWorkSection) {
    gsap.to(siteHeader, {
      y: '-5vw',
      ease: 'none',
      scrollTrigger: {
        trigger: myWorkSection,
        start: '45% top',
        end: '55% top',
        scrub: true,
      },
    });
  }

  if (siteHeader && contactSection) {
    gsap.to(siteHeader, {
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 60%',
        end: 'top 30%',
        scrub: true,
      },
    });
  }

  // ============================================
  // 9. Repo card — SINGLE TIMELINE (enter → stay → exit)
  // Range: PhoneShowcase '72% top' (~516vh) to RepoSection '85% top' (~812vh) = 296vh
  // Entry: 0-15% (44vh), overlaps with phone exit
  // Exit: 85-100% (44vh), overlaps with about entry (section 10)
  // ============================================
  if (repoCard && phoneShowcase && repoSection) {
    gsap.set(repoCard, { xPercent: -50, yPercent: -50 });
    if (repoLabel) gsap.set(repoLabel, { yPercent: -50 });

    const repoTl = gsap.timeline({
      scrollTrigger: {
        trigger: phoneShowcase,
        start: '72% top',
        endTrigger: repoSection,
        end: '85% top',
        scrub: true,
      },
    });

    repoTl
      .fromTo(repoCard,
        { y: '100vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.12 },
        0.05
      )
      .to(repoCard,
        { y: '-100vh', opacity: 0, duration: 0.12 },
        0.85
      );

    // Section label — sync with repo card
    if (repoLabel) {
      repoTl
        .fromTo(repoLabel,
          { y: '100vh', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.12 },
          0.05
        )
        .to(repoLabel,
          { y: '-100vh', opacity: 0, duration: 0.12 },
          0.85
        );
    }
  }

  // ============================================
  // 10. About card — SINGLE TIMELINE (enter → stay → exit)
  // Range: RepoSection '67% top' (~767vh) to AboutSection '85% top' (~1062vh) = 295vh
  // Entry: 0-15% (44vh), overlaps with repo exit
  // Exit: 85-100% (44vh)
  // ============================================
  if (aboutCard && repoSection && aboutSection) {
    gsap.set(aboutCard, { xPercent: -50, yPercent: -50 });
    if (aboutLabel) gsap.set(aboutLabel, { yPercent: -50 });

    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: repoSection,
        start: '67% top',
        endTrigger: aboutSection,
        end: '85% top',
        scrub: true,
      },
    });

    aboutTl
      .fromTo(aboutCard,
        { y: '100vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.12 },
        0.05
      )
      .to(aboutCard,
        { y: '-100vh', opacity: 0, duration: 0.12 },
        0.85
      );

    // Section label — sync with about card
    if (aboutLabel) {
      aboutTl
        .fromTo(aboutLabel,
          { y: '100vh', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.12 },
          0.05
        )
        .to(aboutLabel,
          { y: '-100vh', opacity: 0, duration: 0.12 },
          0.85
        );
    }
  }

  // ============================================
  // 11. Contact text fade in
  // ============================================
  if (contactText && contactSection) {
    gsap.to(contactText, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 30%',
        end: 'top top',
        scrub: true,
        onEnter: () => { contactText.style.pointerEvents = 'auto'; },
        onLeaveBack: () => { contactText.style.pointerEvents = 'none'; },
      },
    });
  }

  // ============================================
  // 12. Scattered tech cards fade in
  // ============================================
  if (scatteredCards && contactSection) {
    gsap.to(scatteredCards, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 20%',
        end: 'top top',
        scrub: true,
      },
    });
  }
}
