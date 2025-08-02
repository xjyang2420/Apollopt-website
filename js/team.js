// init AOS animations
// AOS.init({ duration: 800, once: true });

document.addEventListener('DOMContentLoaded', () => {
  const teamSwiper = new Swiper(".team-swiper", {
    slidesPerView: 5,
    spaceBetween: 10,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '#teamPagination',
      clickable: true,
    },
    breakpoints: {
      1280: { slidesPerView: 6 },
      1024: { slidesPerView: 5 },
      768: { slidesPerView: 3 },
      480: { slidesPerView: 2 },
      0: { slidesPerView: 2 },
    },
  });

  const els = document.querySelectorAll('[data-animate]');
  const animatedClass = 'is-animated';

  els.forEach((el, i) => {
    el.dataset.delay = el.dataset.delay || `${i * 0.15}s`;
  });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const name = el.dataset.animate || 'zoomIn';
        const delay = el.dataset.delay || '0.2s';

        el.style.animationDelay = delay;
        el.classList.add('animate__animated', `animate__${name}`, animatedClass);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  els.forEach(el => io.observe(el));

  if (window.innerWidth <= 768) {
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }
});

