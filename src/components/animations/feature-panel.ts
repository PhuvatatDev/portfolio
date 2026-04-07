/**
 * Feature Panel — card click → detail view interaction
 * Handles grid ↔ detail view transitions inside the CreamPanel's tech panel
 */

import { gsap } from 'gsap';

export function initFeaturePanel() {
  const gridView = document.getElementById('feature-grid-view');
  const detailView = document.getElementById('feature-detail-view');
  const backBtn = document.getElementById('detail-back');
  const scrollContainer = document.getElementById('panel-tech-scroll');

  if (!gridView || !detailView || !backBtn || !scrollContainer) return;

  // --- Card click: open detail view ---
  gridView.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('[data-feature]') as HTMLElement;
    if (!card) return;

    // Ignore clicks on links (store badges)
    if ((e.target as HTMLElement).closest('a')) return;

    const featureId = card.getAttribute('data-feature');
    if (featureId) openDetail(featureId);
  });

  // --- Back button: return to grid ---
  backBtn.addEventListener('click', closeDetail);

  function openDetail(id: string) {
    // Hide all detail sections, show the right one
    detailView.querySelectorAll('.feature-detail').forEach(el => {
      el.classList.add('hidden');
    });
    const detail = detailView.querySelector(`[data-detail="${id}"]`);
    if (!detail) return;
    detail.classList.remove('hidden');

    // Scroll container to top
    scrollContainer.scrollTop = 0;

    // Transition: grid fades out → detail fades in
    gsap.to(gridView, {
      opacity: 0,
      duration: 0.15,
      ease: 'power1.in',
      onComplete: () => {
        gridView.classList.add('hidden');
        detailView.classList.remove('hidden');
        gsap.fromTo(detailView,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
      },
    });
  }

  function closeDetail() {
    // Scroll container to top
    scrollContainer.scrollTop = 0;

    // Transition: detail fades out → grid fades in
    gsap.to(detailView, {
      opacity: 0,
      duration: 0.15,
      ease: 'power1.in',
      onComplete: () => {
        detailView.classList.add('hidden');
        gridView.classList.remove('hidden');
        gsap.fromTo(gridView,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: 'power2.out' }
        );
      },
    });
  }
}
