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

  const heroText = document.getElementById('hero-text');
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
  // 3. Hero text fade + exit left
  // ============================================
  if (heroText) {
    gsap.to(heroText, {
      opacity: 0,
      x: '-100vw',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '12% top',
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
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1180) {
        compressIllustrations();
        ScrollTrigger.refresh();
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

  if (myWorkSection && processCard
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
          trigger: myWorkSection,
          start: 'top 85%',
          end: 'top top',
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
    const processTl = gsap.timeline({
      scrollTrigger: {
        trigger: myWorkSection,
        start: 'top 85%',
        end: '80% top',
        scrub: true,
      },
    });

    // Fade in — same scroll range as illustration convergence (15→100vh)
    processTl.fromTo(processCard,
      { opacity: 0 },
      { opacity: 1, duration: 0.35 },
      0
    );

    // Exit upward + fade out — uses y (not yPercent) to travel full viewport height
    processTl.to(processCard,
      { y: '-100vh', opacity: 0, duration: 0.14 },
      0.78
    );

    // Illustrations fade out just before card exits
    if (heroIllustrations) {
      gsap.to(heroIllustrations, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: myWorkSection,
          start: '40% top',
          end: '55% top',
          scrub: true,
        },
      });
    }
  }

  // ============================================
  // 7. Phone + Tech — SINGLE TIMELINE (enter → stay → exit)
  // Range: MyWork '55% top' (~210vh) to PhoneShowcase '90% top' (~570vh) = 360vh
  // Entry: 0-14% (50vh), overlaps with process exit (80-100% of process TL = 210-260vh)
  // Exit: 85-100% (54vh), overlaps with repo entry (section 9)
  // ============================================
  if (phoneContainer && techPanelContainer && myWorkSection && phoneShowcase) {
    gsap.set(phoneContainer, { yPercent: -50 });
    gsap.set(techPanelContainer, { yPercent: -50 });

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
  }

  // ============================================
  // 10. About card — SINGLE TIMELINE (enter → stay → exit)
  // Range: RepoSection '67% top' (~767vh) to AboutSection '85% top' (~1062vh) = 295vh
  // Entry: 0-15% (44vh), overlaps with repo exit
  // Exit: 85-100% (44vh)
  // ============================================
  if (aboutCard && repoSection && aboutSection) {
    gsap.set(aboutCard, { xPercent: -50, yPercent: -50 });

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
