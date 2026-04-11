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
import { CONTACT_EMAIL } from '../../data/contact';

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
  const contactWarp = document.getElementById('contact-warp');
  const contactMarqueeBand = document.getElementById('contact-marquee-band');
  const contactMarqueeText = document.getElementById('contact-marquee-text');
  const contactUpper = document.getElementById('contact-upper');
  const contactTechMarquee = document.getElementById('contact-tech-marquee');
  const contactFooter = document.getElementById('contact-footer');

  // Resize listener reference — declared outside ctx so HMR dispose can remove it
  let handleResize: (() => void) | null = null;

  // ============================================
  // All GSAP/ScrollTrigger setup wrapped in a scopeless context
  // so HMR can cleanly revert() every tween + trigger on dispose.
  // Scopeless (no second arg) to preserve global document scope for selectors.
  // ============================================
  const ctx = gsap.context(() => {
  // Mobile breakpoint — matches Tailwind 'lg' (1180px) and global.css mobile block
  const isMobile = window.innerWidth < 1180;

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
  // 3a. Hero marquee — horizontal scroll-driven translate (desktop only)
  // Text translates from 0 to -(scrollWidth - viewport) over the full Hero section
  // Mobile: skipped — CSS forces white-space:normal so the text wraps as a
  // static title instead of sliding horizontally
  // ============================================
  if (!isMobile && heroSection && heroMarqueeText) {
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
  // 3b. Hero bottom-left (subtext + CTAs) — clear before process card enters
  // Desktop: fade out in place
  // Mobile: slide left off-screen (consistent with 3c title slide)
  // ============================================
  if (heroSection && heroBottomLeft) {
    if (isMobile) {
      gsap.to(heroBottomLeft, {
        x: '-120vw',
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: '30% top',
          end: 'bottom top',
          scrub: true,
        },
      });
    } else {
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
  }

  // ============================================
  // 3c. Hero title — slide left on hero exit (mobile only)
  // Desktop uses Section 3a marquee animation. On mobile the title is a
  // static wrapped block, so we slide it off-screen left in sync with 3b.
  // ============================================
  if (isMobile && heroSection && heroMarqueeText) {
    gsap.to(heroMarqueeText, {
      x: '-120vw',
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: '30% top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // ============================================
  // 4. Illustration responsive compression (desktop only)
  // ============================================
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
    handleResize = () => {
      if (window.innerWidth >= 1180) {
        compressIllustrations();
      }
    };
    window.addEventListener('resize', handleResize);
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

  // Desktop and mobile both run convergence. Desktop start is synced with the
  // marquee position (when 'deployment' is centered). Mobile uses a simple
  // fixed start (30% of hero) since there is no marquee animation.
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
          trigger: heroSection,
          start: isMobile ? '30% top' : () => {
            // Desktop: start when the last word 'deployment' is centered horizontally
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
      { y: '-100vh', opacity: 0, duration: 0.22 },
      0.76
    );

    // Section label — exit with the card
    if (processLabel) {
      processTl.to(processLabel,
        { y: '-100vh', opacity: 0, duration: 0.22 },
        0.76
      );
    }

    // Illustrations travel up WITH the card (same timing, same distance)
    // so they visually leave inside the card instead of fading prematurely
    if (heroIllustrations) {
      processTl.to(heroIllustrations,
        { y: '-100vh', opacity: 0, duration: 0.22 },
        0.76
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

    // Tech label — vertical centering (CSS top:50% + GSAP yPercent:-50)
    // so y tweens travel from that centered baseline.
    if (techLabel) gsap.set(techLabel, { yPercent: -50 });

    const phoneTechTl = gsap.timeline({
      scrollTrigger: {
        trigger: myWorkSection,
        start: '55% top',
        endTrigger: phoneShowcase,
        end: '90% top',
        scrub: true,
      },
    });

    // Phone + Tech enter together (2% delay so process card clears screen first)
    phoneTechTl
      .fromTo(phoneContainer,
        { y: '100vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.22 },
        0.02
      )
      .fromTo(techPanelContainer,
        { y: '100vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.22 },
        0.02
      );

    // Section label — travel up from below with phone+tech (same tween as card)
    if (techLabel) {
      phoneTechTl.fromTo(techLabel,
        { y: '100vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.22 },
        0.02
      );
    }

    // Phone + Tech exit together
    phoneTechTl
      .to(phoneContainer,
        { y: '-100vh', opacity: 0, duration: 0.22 },
        0.76
      )
      .to(techPanelContainer,
        { y: '-100vh', opacity: 0, duration: 0.22 },
        0.76
      );

    // Section label — exit upward with phone+tech
    if (techLabel) {
      phoneTechTl.to(techLabel,
        { y: '-100vh', opacity: 0, duration: 0.22 },
        0.76
      );
    }
  }

  // ============================================
  // 8. Header hide during phone, show at contact
  // fromTo with explicit values (not to()) so the reverse path is
  // deterministic regardless of scroll speed. immediateRender:false
  // prevents the fromTo start values from being applied at page load
  // (otherwise the second tween's {y:-5vw} would hide the header in Hero).
  // ============================================
  if (siteHeader && myWorkSection) {
    gsap.fromTo(siteHeader,
      { y: 0 },
      {
        y: '-5vw',
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: myWorkSection,
          start: '45% top',
          end: '55% top',
          scrub: true,
        },
      }
    );
  }

  if (siteHeader && contactSection) {
    gsap.fromTo(siteHeader,
      { y: '-5vw' },
      {
        y: 0,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 60%',
          end: 'top 30%',
          scrub: true,
        },
      }
    );
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
        { y: 0, opacity: 1, duration: 0.22 },
        0.02
      )
      .to(repoCard,
        { y: '-100vh', opacity: 0, duration: 0.22 },
        0.76
      );

    // Section label — sync with repo card
    if (repoLabel) {
      repoTl
        .fromTo(repoLabel,
          { y: '100vh', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.22 },
          0.02
        )
        .to(repoLabel,
          { y: '-100vh', opacity: 0, duration: 0.22 },
          0.76
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
        { y: 0, opacity: 1, duration: 0.22 },
        0.02
      )
      .to(aboutCard,
        { y: '-100vh', opacity: 0, duration: 0.22 },
        0.76
      );

    // Section label — sync with about card
    if (aboutLabel) {
      aboutTl
        .fromTo(aboutLabel,
          { y: '100vh', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.22 },
          0.02
        )
        .to(aboutLabel,
          { y: '-100vh', opacity: 0, duration: 0.22 },
          0.76
        );
    }
  }

  // ============================================
  // 11. Contact section — grid warp + marquee entrance + content fade
  // ============================================
  if (contactSection) {
    // 11a. Grid warp SVG — fade in as the section enters
    if (contactWarp) {
      gsap.to(contactWarp, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 60%',
          end: 'top 10%',
          scrub: true,
        },
      });
    }

    // 11b. Marquee — enters from the left (inverse of Hero marquee)
    // Hero marquee: x: 0 → -scrollWidth (exits left)
    // Contact marquee: x: -scrollWidth → 0 (enters from left)
    if (contactMarqueeBand && contactMarqueeText) {
      // Fade in the band
      gsap.to(contactMarqueeBand, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 70%',
          end: 'top 30%',
          scrub: true,
        },
      });

      // Horizontal entrance — from off-screen left to natural position
      gsap.fromTo(contactMarqueeText,
        { x: () => -contactMarqueeText.scrollWidth },
        {
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: contactSection,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // 11c. Upper content (tagline + terminal links) — fade in
    if (contactUpper) {
      gsap.to(contactUpper, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 50%',
          end: 'top 10%',
          scrub: true,
          onEnter: () => { contactUpper.style.pointerEvents = 'auto'; },
          onLeaveBack: () => { contactUpper.style.pointerEvents = 'none'; },
        },
      });
    }

    // 11d. Tech stack marquee — fade in above footer
    if (contactTechMarquee) {
      gsap.to(contactTechMarquee, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 30%',
          end: 'top top',
          scrub: true,
          onEnter: () => { contactTechMarquee.style.pointerEvents = 'auto'; },
          onLeaveBack: () => { contactTechMarquee.style.pointerEvents = 'none'; },
        },
      });
    }

    // 11f. Footer — fade in
    if (contactFooter) {
      gsap.to(contactFooter, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 30%',
          end: 'top top',
          scrub: true,
        },
      });
    }
  }
  }); // end gsap.context()

  // Refresh ScrollTrigger once fonts/images have settled, so triggers
  // recalculate against final layout (prevents misaligned triggers).
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  // ============================================
  // 12. Contact email — click to copy to clipboard
  // ============================================
  const contactEmail = document.getElementById('contact-email');
  const copyIcon = document.getElementById('copy-icon');
  const copiedFeedback = document.getElementById('copied-feedback');
  if (contactEmail && copyIcon && copiedFeedback) {
    contactEmail.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        copyIcon.style.display = 'none';
        copiedFeedback.style.display = 'inline-flex';
        setTimeout(() => {
          copyIcon.style.display = 'inline';
          copiedFeedback.style.display = 'none';
        }, 1500);
      } catch {
        // Silent fail — clipboard unavailable (insecure context, permissions)
        // Do not flip UI on failure
      }
    });
  }

  // ============================================
  // HMR cleanup (Vite/Astro dev only)
  // Reverts all tweens/triggers created in ctx and removes the resize listener
  // so hot reloads don't stack animations or leak memory.
  // ============================================
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      ctx.revert();
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
    });
  }

}
