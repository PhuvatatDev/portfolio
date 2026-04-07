/**
 * Portfolio Scroll Controller
 * Adapted from MindTarot website scroll-controller.ts
 *
 * Key pattern (from MindTarot): disable/enable conflicting triggers at phase boundaries.
 * Every scrub tween auto-reverses on scroll-back. Height changes use callbacks (not tweens)
 * because GSAP can't reverse-animate to `auto`.
 *
 * Phases:
 * 1. Hero → Convergence (illustrations → card)
 * 2. Content swaps (Process → About → Repo)  — card stays centered
 * 3. Phone + card morph (card shifts right, phone rises)
 * 4. Contact (phone + card fade out, contact fades in)
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

  // Phase 1 triggers — disabled during content swaps to prevent tween conflicts
  const convergenceTriggers: (ScrollTrigger | undefined)[] = [];

  // Phase 3 triggers (phone section) — disabled when scrolling back before phone section
  const phonePhaseTriggers: (ScrollTrigger | undefined)[] = [];

  // Phase 4 triggers (contact section) — disabled when scrolling back before contact
  const contactTriggers: (ScrollTrigger | undefined)[] = [];

  // Initialize card position with GSAP (replaces CSS transform: translate(-50%, -50%))
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

    // Card fades in (part of convergence phase)
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
  // Phase boundary: convergence → content swaps
  // ============================================
  if (myWorkSection) {
    ScrollTrigger.create({
      trigger: myWorkSection,
      start: '20% top',
      onEnter: () => convergenceTriggers.forEach(t => t?.disable(false)),
      onLeaveBack: () => {
        // Re-enable convergence, disable contact phase
        convergenceTriggers.forEach(t => t?.enable(false, false));
        contactTriggers.forEach(t => t?.disable(false));
      },
    });
  }

  // ============================================
  // 6. Content swap: Process + illustrations → About
  // ============================================
  const panelProcess = document.getElementById('panel-process');
  const panelAbout = document.getElementById('panel-about');
  const panelRepo = document.getElementById('panel-repo');
  const panelTech = document.getElementById('panel-tech');

  // Process content + illustrations all fade out together
  const fadeOutTargets = [panelProcess, heroIllustrations].filter(Boolean) as HTMLElement[];
  fadeOutTargets.forEach(el => {
    if (myWorkSection) {
      gsap.to(el, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: myWorkSection,
          start: '22% top',
          end: '32% top',
          scrub: true,
        },
      });
    }
  });

  // About fades in
  if (myWorkSection && panelAbout) {
    gsap.to(panelAbout, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: myWorkSection,
        start: '28% top',
        end: '38% top',
        scrub: true,
        onEnter: () => { panelAbout.style.pointerEvents = 'auto'; },
        onLeaveBack: () => { panelAbout.style.pointerEvents = 'none'; },
      },
    });
  }

  // ============================================
  // 6b. Content swap: About → Repo
  // ============================================
  if (myWorkSection && panelAbout && panelRepo) {
    // About fades out
    gsap.to(panelAbout, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: myWorkSection,
        start: '55% top',
        end: '65% top',
        scrub: true,
        onEnter: () => { panelAbout.style.pointerEvents = 'none'; },
        onLeaveBack: () => { panelAbout.style.pointerEvents = 'auto'; },
      },
    });

    // Repo fades in
    gsap.to(panelRepo, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: myWorkSection,
        start: '60% top',
        end: '70% top',
        scrub: true,
        onEnter: () => { panelRepo.style.pointerEvents = 'auto'; },
        onLeaveBack: () => { panelRepo.style.pointerEvents = 'none'; },
      },
    });

  }

  // ============================================
  // 7. Header slides up
  // ============================================
  const phoneShowcase = document.getElementById('phone-showcase');
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
  // 7b. Card morphs: center → right side + Repo → Tech crossfade
  // ============================================
  if (phoneShowcase && processCard) {
    // Repo fades out as card starts morphing — tracked for disable/enable
    if (panelRepo) {
      const repoPhoneFade = gsap.to(panelRepo, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: phoneShowcase,
          start: 'top 80%',
          end: 'top 40%',
          scrub: true,
          onEnter: () => { panelRepo.style.pointerEvents = 'none'; },
          onLeaveBack: () => { panelRepo.style.pointerEvents = 'auto'; },
        },
      });
      phonePhaseTriggers.push(repoPhoneFade.scrollTrigger);
    }

    // Card position/size morph — fromTo with explicit start values
    // NO height/maxHeight — GSAP can't reverse-animate from auto
    gsap.fromTo(processCard,
      {
        left: '50%',
        xPercent: -50,
        width: '85vw',
        maxWidth: 1100,
      },
      {
        left: '39%',
        xPercent: 0,
        width: 'calc(60vw - 2rem)',
        maxWidth: 700,
        ease: 'none',
        scrollTrigger: {
          trigger: phoneShowcase,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    // Height managed via callbacks (GSAP can't tween auto → px → auto)
    ScrollTrigger.create({
      trigger: phoneShowcase,
      start: 'top 50%',
      onEnter: () => {
        if (processCard) {
          processCard.style.height = '80vh';
          processCard.style.maxHeight = '750px';
        }
      },
      onLeaveBack: () => {
        if (processCard) {
          processCard.style.height = '';
          processCard.style.maxHeight = '';
        }
      },
    });

    // Tech panel fades in — tracked for disable/enable
    const techScrollContainer = document.getElementById('panel-tech-scroll');
    if (panelTech) {
      const techFade = gsap.to(panelTech, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: phoneShowcase,
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
          onEnter: () => {
            panelTech.style.pointerEvents = 'auto';
            // Force explicit pixel height on scroll container
            // (% height inside absolute-positioned parent in overflow:hidden card is unreliable)
            if (techScrollContainer && processCard) {
              const h = processCard.offsetHeight + 'px';
              techScrollContainer.style.height = h;
              techScrollContainer.style.maxHeight = h;
            }
          },
          onLeaveBack: () => {
            panelTech.style.pointerEvents = 'none';
            if (techScrollContainer) {
              techScrollContainer.style.height = '100%';
              techScrollContainer.style.maxHeight = '';
            }
          },
        },
      });
      phonePhaseTriggers.push(techFade.scrollTrigger);
    }
  }

  // ============================================
  // Phase boundary: myWork content ↔ phone section
  // Disable phone-phase tweens on scroll-back so myWork tweens control panels
  // ============================================
  if (phoneShowcase) {
    ScrollTrigger.create({
      trigger: phoneShowcase,
      start: 'top 85%',
      onEnter: () => phonePhaseTriggers.forEach(t => t?.enable(false, false)),
      onLeaveBack: () => {
        phonePhaseTriggers.forEach(t => t?.disable(false));
        // Reset panels to myWork-phase state (repo visible, tech hidden)
        if (panelRepo) gsap.set(panelRepo, { opacity: 1 });
        if (panelTech) gsap.set(panelTech, { opacity: 0 });
        if (panelRepo) panelRepo.style.pointerEvents = 'auto';
        if (panelTech) panelTech.style.pointerEvents = 'none';
      },
    });
  }

  // ============================================
  // 8. Phone rise from bottom
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
          start: 'top 70%',
          end: 'top 10%',
          scrub: true,
        },
      }
    );

    // ============================================
    // 9. Phone shifts left (after rise completes)
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
  // Phase boundary: phone → contact
  // Enable contact triggers when entering contact zone, disable on scroll-back
  // ============================================
  const contactSection = document.getElementById('contact-section');

  if (contactSection && phoneShowcase) {
    ScrollTrigger.create({
      trigger: contactSection,
      start: 'top bottom',
      onEnter: () => contactTriggers.forEach(t => t?.enable(false, false)),
      onLeaveBack: () => {
        contactTriggers.forEach(t => t?.disable(false));
        // Restore card opacity (contactFade may have set it to 0)
        if (processCard) gsap.set(processCard, { opacity: 1 });
      },
    });
  }

  // ============================================
  // 10. Phone + card fade out (at contact section)
  // ============================================
  if (contactSection && phoneContainer) {
    gsap.to(phoneContainer, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 80%',
        end: 'top 40%',
        scrub: true,
      },
    });
  }

  // Card fades out — tracked in contactTriggers for disable/enable
  // Uses gsap.to (NOT fromTo) — fromTo would apply opacity:1 immediately at creation
  if (contactSection && processCard) {
    const cardFadeOut = gsap.to(processCard, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 80%',
        end: 'top 40%',
        scrub: true,
        onEnter: () => { if (panelTech) panelTech.style.pointerEvents = 'none'; },
        onLeaveBack: () => { if (panelTech) panelTech.style.pointerEvents = 'auto'; },
      },
    });
    contactTriggers.push(cardFadeOut.scrollTrigger);
    // Start disabled — enabled by phase boundary when reaching contact zone
    cardFadeOut.scrollTrigger?.disable(false);
  }

  // ============================================
  // 11. Header slides back in
  // ============================================
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
  // 12. Contact text fade in
  // ============================================
  const contactText = document.getElementById('contact-text');

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
  // 13. Scattered tech cards fade in
  // ============================================
  const scatteredCards = document.getElementById('scattered-cards');

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
