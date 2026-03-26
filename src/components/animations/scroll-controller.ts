/**
 * Portfolio Scroll Controller
 * Adapted from MindTarot website scroll-controller.ts
 *
 * Animations (in scroll order):
 * 1. Grid parallax
 * 2. Scroll progress bar
 * 3. Hero text fade + exit left
 * 4. Illustration compression (responsive)
 * 5. Illustration convergence → cream process card
 * 6. Process card + illustrations exit up
 * 6b. Header slides up (makes room for phone)
 * 7. Phone rise from bottom
 * 8. Phone shift left
 * 9. Showcase panel slide in from right
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollController() {
  const gridOverlay = document.getElementById('grid-color-overlay');
  const codeGrid = document.getElementById('code-grid');

  if (!gridOverlay || !codeGrid) return;

  const gridCanvas = codeGrid.children[1] as HTMLElement;
  if (!gridCanvas) return;

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
  const progressBar = document.getElementById('scroll-progress');
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
  const heroText = document.getElementById('hero-text');
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
  // 5. Illustration convergence → cream process card
  // ============================================
  const myWorkSection = document.getElementById('my-work');
  const processCard = document.getElementById('process-card');
  const heroIllustrations = document.getElementById('hero-illustrations');

  const slotIdea = document.querySelector('#process-slot-idea .process-illus-slot') as HTMLElement;
  const slotDiscussion = document.querySelector('#process-slot-discussion .process-illus-slot') as HTMLElement;
  const slotBuild = document.querySelector('#process-slot-build .process-illus-slot') as HTMLElement;
  const slotLive = document.querySelector('#process-slot-live .process-illus-slot') as HTMLElement;

  const illusIdea = document.getElementById('illus-idea');
  const illusDiscussion = document.getElementById('illus-discussion');
  const illusBuild = document.getElementById('illus-build');
  const illusLive = document.getElementById('illus-live');

  // Track triggers so we can disable them during exit (prevents tween conflicts)
  const convergenceTriggers: (ScrollTrigger | undefined)[] = [];

  if (myWorkSection && processCard
      && illusIdea && illusDiscussion && illusBuild && illusLive
      && slotIdea && slotDiscussion && slotBuild && slotLive) {

    const pairs = [
      { illus: illusIdea, slot: slotIdea },
      { illus: illusDiscussion, slot: slotDiscussion },
      { illus: illusBuild, slot: slotBuild },
      { illus: illusLive, slot: slotLive },
    ];

    // Illustrations converge into card slots
    pairs.forEach(({ illus, slot }) => {
      const tween = gsap.to(illus, {
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
      convergenceTriggers.push(tween.scrollTrigger);
    });

    // Card fades in
    const cardFade = gsap.to(processCard, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: myWorkSection,
        start: 'top 30%',
        end: 'top top',
        scrub: true,
      },
    });
    convergenceTriggers.push(cardFade.scrollTrigger);
  }

  // ============================================
  // 6. Process card + illustrations exit up
  // ============================================
  const phoneShowcase = document.getElementById('phone-showcase');

  if (phoneShowcase && processCard) {
    // Disable convergence triggers when exiting (prevents property conflicts)
    ScrollTrigger.create({
      trigger: phoneShowcase,
      start: 'top bottom',
      onEnter: () => convergenceTriggers.forEach(t => t?.disable(false)),
      onLeaveBack: () => convergenceTriggers.forEach(t => t?.enable(false, false)),
    });

    // Card + illustrations slide up together as one unit
    const exitTargets = [processCard, heroIllustrations].filter(Boolean) as HTMLElement[];
    exitTargets.forEach(el => {
      gsap.to(el, {
        y: '-100vh',
        ease: 'none',
        scrollTrigger: {
          trigger: phoneShowcase,
          start: 'top bottom',
          end: 'top 30%',
          scrub: true,
        },
      });
    });
  }

  // ============================================
  // 6b. Header fades out as phone rises
  // ============================================
  const siteHeader = document.getElementById('site-header');

  if (siteHeader && phoneShowcase) {
    gsap.to(siteHeader, {
      y: '-5vw',
      ease: 'none',
      scrollTrigger: {
        trigger: phoneShowcase,
        start: 'top 60%',
        end: 'top 30%',
        scrub: true,
      },
    });
  }

  // ============================================
  // 7. Phone rise from bottom
  // ============================================
  const phoneContainer = document.getElementById('phone-container');

  if (phoneContainer && phoneShowcase) {
    gsap.fromTo(phoneContainer,
      { xPercent: -50, yPercent: -50, y: '100vh' },
      {
        xPercent: -50,
        yPercent: -50,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: phoneShowcase,
          start: 'top 60%',
          end: 'top top',
          scrub: true,
        },
      }
    );

    // ============================================
    // 8. Phone shifts left (after rise completes)
    // ============================================
    gsap.to(phoneContainer, {
      left: '28%',
      ease: 'none',
      scrollTrigger: {
        trigger: phoneShowcase,
        start: 'top top',
        end: '10% top',
        scrub: true,
      },
    });
  }

  // ============================================
  // 9. Showcase panel slides in from right
  // ============================================
  const showcasePanel = document.getElementById('showcase-panel');

  if (showcasePanel && phoneShowcase) {
    gsap.fromTo(showcasePanel,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: phoneShowcase,
          start: '5% top',
          end: '13% top',
          scrub: true,
        },
      }
    );

    // Enable pointer events once panel is visible
    ScrollTrigger.create({
      trigger: phoneShowcase,
      start: '13% top',
      onEnter: () => { showcasePanel.style.pointerEvents = 'auto'; },
      onLeaveBack: () => { showcasePanel.style.pointerEvents = 'none'; },
    });
  }
}
