/* ============================================================
   main.js — Akira Hata Portfolio
   ============================================================ */

/* --- Nav: scroll border effect ---------------------------- */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* --- AOS (Animate On Scroll) ------------------------------ */
AOS.init({
  duration: 1200,
  easing: 'ease-out-quart',
  once: false,
  mirror: true,
  offset: 60,
  anchorPlacement: 'bottom-bottom',
});

window.addEventListener('resize', () => AOS.refresh(), { passive: true });

/* --- Nav: mobile toggle ----------------------------------- */
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
});

// メニュー項目クリックで閉じる
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  });
});

/* --- Active nav link highlight on scroll ----------------- */
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--text)'
          : '';
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

/* --- Works carousel --------------------------------------- */
const carousel = document.querySelector('.works__carousel');
const prevBtn  = document.querySelector('.works__nav--prev');
const nextBtn  = document.querySelector('.works__nav--next');
const dotsWrap = document.querySelector('.works__dots');
const counterCurrent = document.querySelector('.works__counter-current');
const counterTotal = document.querySelector('.works__counter-total');

if (carousel && prevBtn && nextBtn && dotsWrap) {
  const originals = [...carousel.querySelectorAll('.work-card')];
  const count = originals.length;

  if (counterTotal) counterTotal.textContent = String(count).padStart(2, '0');

  const cloneFirst = originals[0].cloneNode(true);
  const cloneLast  = originals[count - 1].cloneNode(true);

  [cloneFirst, cloneLast].forEach(clone => {
    clone.classList.add('work-card--clone');
    clone.classList.remove('reveal', 'is-visible');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach(link => link.setAttribute('tabindex', '-1'));
  });

  carousel.insertBefore(cloneLast, originals[0]);
  carousel.appendChild(cloneFirst);

  const cards = [...carousel.querySelectorAll('.work-card')];
  const REAL_START = 1;
  const REAL_END = count;
  let isJumping = false;
  let scrollTimer;

  function getScrollLeftForIndex(index) {
    const card = cards[index];
    if (!card) return 0;
    return card.offsetLeft + card.offsetWidth / 2 - carousel.clientWidth / 2;
  }

  function getDomIndex() {
    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - carouselCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    return closest;
  }

  function getLogicalIndex(domIndex) {
    if (domIndex === 0) return count - 1;
    if (domIndex === count + 1) return 0;
    return domIndex - REAL_START;
  }

  function jumpToDom(index) {
    isJumping = true;
    carousel.classList.add('is-jumping');
    carousel.style.scrollBehavior = 'auto';
    carousel.scrollLeft = getScrollLeftForIndex(index);
    carousel.classList.remove('is-jumping');
    carousel.style.scrollBehavior = 'smooth';
    isJumping = false;
    updateActiveCard();
  }

  function scrollToDom(index, smooth = true) {
    if (!cards[index]) return;
    carousel.style.scrollBehavior = smooth ? 'smooth' : 'auto';
    carousel.scrollLeft = getScrollLeftForIndex(index);
    scheduleLoopCheck();
  }

  originals.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'works__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `制作物 ${i + 1}`);
    dot.addEventListener('click', () => scrollToDom(i + REAL_START));
    dotsWrap.appendChild(dot);
  });

  function updateActiveCard() {
    const domIndex = getDomIndex();
    const logical = getLogicalIndex(domIndex);

    cards.forEach((card, i) => {
      card.classList.toggle('work-card--active', i === domIndex);
    });

    dotsWrap.querySelectorAll('.works__dot').forEach((dot, i) => {
      const isActive = i === logical;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive);
    });

    if (counterCurrent) {
      counterCurrent.textContent = String(logical + 1).padStart(2, '0');
    }
  }

  function handleLoopJump() {
    if (isJumping) return;

    const domIndex = getDomIndex();

    if (domIndex === 0) {
      jumpToDom(REAL_END);
    } else if (domIndex === count + 1) {
      jumpToDom(REAL_START);
    }
  }

  function scheduleLoopCheck() {
    if ('onscrollend' in carousel) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(handleLoopJump, 480);
  }

  function goNext() {
    const domIndex = getDomIndex();
    if (domIndex >= REAL_END) {
      scrollToDom(domIndex + 1);
      return;
    }
    scrollToDom(domIndex + 1);
  }

  function goPrev() {
    const domIndex = getDomIndex();
    if (domIndex <= REAL_START) {
      scrollToDom(0);
      return;
    }
    scrollToDom(domIndex - 1);
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  carousel.addEventListener('scroll', () => {
    if (!isJumping) updateActiveCard();
  }, { passive: true });

  carousel.addEventListener('scrollend', handleLoopJump, { passive: true });

  window.addEventListener('resize', () => {
    jumpToDom(getDomIndex());
  }, { passive: true });

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  });

  requestAnimationFrame(() => {
    jumpToDom(REAL_START);
  });
}
