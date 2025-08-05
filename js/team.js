// init AOS animations
// AOS.init({ duration: 800, once: true });

document.addEventListener('DOMContentLoaded', () => {
  const teamSwiper = new Swiper(".team-swiper", {
    slidesPerView: 5,
    spaceBetween: 10,
    loop: true,
    autoplay: {
      delay: 6000,
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
  }, { threshold: 0.1 });

  els.forEach(el => io.observe(el));

  // document.querySelectorAll('.card-hover-wrapper').forEach(wrapper => {
  //   let hideTimer;

  //   // 鼠标进入头像或 tooltip 区域时，显示 tooltip
  //   wrapper.addEventListener('mouseenter', () => {
  //     clearTimeout(hideTimer);
  //     wrapper.classList.add('tooltip-visible');
  //   });

  //   // 鼠标离开整个 wrapper 区域时，延迟隐藏
  //   wrapper.addEventListener('mouseleave', () => {
  //     hideTimer = setTimeout(() => {
  //       wrapper.classList.remove('tooltip-visible');
  //     }, 200); // 这里设置延迟时间（单位毫秒），比如 300ms
  //   });
  // });

  if (window.innerWidth <= 768) {
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }

  const wrappers = document.querySelectorAll('.card-hover-wrapper');

  wrappers.forEach(currentWrapper => {
    const tooltip = currentWrapper.querySelector('.card-tooltip');
    let hideTimer;

    currentWrapper.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer);

      // 隐藏其他 wrapper 的 tooltip
      wrappers.forEach(otherWrapper => {
        if (otherWrapper !== currentWrapper) {
          otherWrapper.classList.remove('tooltip-visible');
        }
      });

      currentWrapper.classList.add('tooltip-visible');
    });

    currentWrapper.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(() => {
        currentWrapper.classList.remove('tooltip-visible');
      }, 250); // 可调延迟时间
    });
  });
});

