(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function setupNavigation() {
    const nav = $('#nav');
    const toggle = $('#navToggle');
    const links = $('#navLinks');
    if (!nav || !toggle || !links) return;

    const closeMenu = () => {
      links.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
      document.body.classList.remove('menu-open');
    };
    toggle.addEventListener('click', () => {
      const open = !links.classList.contains('is-open');
      links.classList.toggle('is-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      document.body.classList.toggle('menu-open', open);
    });
    $$('a', links).forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 24), { passive: true });

    const navLinks = $$('a', links);
    const sections = $$('main section[id], footer[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-42% 0px -50% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  function setupReveals() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) return items.forEach((item) => item.classList.add('is-visible'));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  function setupCarousel() {
    const carousel = $('.works__carousel');
    const dots = $('.works__dots');
    const counter = $('.works__counter b');
    const template = $('#workCardTemplate');
    if (!carousel || !dots || !counter || !template) return;
    const projects = [
      { type: 'REAL-TIME GAME / 2026', title: 'Cebu Conquest', description: 'セブ島を舞台にしたリアルタイム領土争奪ゲーム。4人チームで開発し、フロントエンド、ゲーム画面、UI実装を担当。', stack: ['Phaser', 'React', 'TypeScript', 'Socket.IO', 'Node.js'], visual: 'conquest', status: 'TEAM PROJECT' },
      { type: 'WEB APPLICATION / 2025', title: 'Cebu Coffee', description: 'セブ島のカフェを探索・レビューするWebアプリケーション。PHPとMySQLを使用して設計・開発。', stack: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'], visual: 'coffee', status: 'WEB APPLICATION' },
      { type: 'IN PROGRESS', title: 'Next Project', description: '次のアイデアを、丁寧に育てています。詳細はもう少しだけお待ちください。', stack: ['Coming soon'], visual: 'next', status: 'COMING SOON' }
    ];
    let active = 0;
    const cards = projects.map((project, index) => {
      const fragment = template.content.cloneNode(true);
      const card = $('.work-card', fragment);
      card.dataset.index = String(index);
      card.classList.add(`work-card--${project.visual}`);
      card.setAttribute('aria-label', `${project.title}、${index + 1}件目`);
      $('.work-card__number', card).textContent = String(index + 1).padStart(2, '0');
      $('.work-card__type', card).textContent = project.type;
      $('h3', card).textContent = project.title;
      $('.work-card__description', card).textContent = project.description;
      $('.work-card__status', card).textContent = project.status;
      project.stack.forEach((tech) => { const tag = document.createElement('span'); tag.textContent = tech; $('.work-card__stack', card).append(tag); });
      carousel.append(card);
      const dot = document.createElement('button');
      dot.type = 'button'; dot.setAttribute('role', 'tab'); dot.setAttribute('aria-label', `${project.title}を表示`);
      dot.addEventListener('click', () => goTo(index)); dots.append(dot);
      return card;
    });
    const update = () => {
      cards.forEach((card, index) => card.classList.toggle('is-active', index === active));
      $$('button', dots).forEach((dot, index) => { dot.classList.toggle('is-active', index === active); dot.setAttribute('aria-selected', String(index === active)); });
      counter.textContent = String(active + 1).padStart(2, '0');
    };
    const goTo = (index) => { active = (index + projects.length) % projects.length; cards[active].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); update(); };
    $('.carousel-button--prev')?.addEventListener('click', () => goTo(active - 1));
    $('.carousel-button--next')?.addEventListener('click', () => goTo(active + 1));
    carousel.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1); } });
    let scrollTimer;
    carousel.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = window.setTimeout(() => { const center = carousel.scrollLeft + carousel.clientWidth / 2; active = cards.reduce((closest, card, index) => Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) < Math.abs(cards[closest].offsetLeft + cards[closest].offsetWidth / 2 - center) ? index : closest, active); update(); }, 90); }, { passive: true });
    update();
  }
  setupNavigation();
  setupReveals();
  setupCarousel();
})();
