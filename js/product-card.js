document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('#product-cardSwiper', {
        loop: true,
        centeredSlides: true,
        slidesPerView: 5,
        spaceBetween: 10,
        pagination: {
            el: '#productPagination',
            clickable: true,
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        on: {
            init: function () {
                setTimeout(() => {
                    //swiper.slideToLoop(0, 0, false); // slideToLoop(index, speed, runCallbacks)

                    swiper.slides.forEach(slide => slide.classList.remove('active'));
                    swiper.slides[swiper.activeIndex].classList.add('active');
                }, 0);
            },
            slideChangeTransitionEnd: function () {
                swiper.slides.forEach(slide => slide.classList.remove('active'));
                swiper.slides[swiper.activeIndex].classList.add('active');
            }
        },
        breakpoints: {
            1440: {
                slidesPerView: 5
            },
            1024: {
                slidesPerView: 4
            },
            640: {
                slidesPerView: 2
            },
            0: {
                slidesPerView: 1
            }
        }
    });

    swiper.update();
    swiper.autoplay.start();

    setTimeout(() => {
        if (swiper.autoplay && swiper.autoplay.running === false) {
            swiper.autoplay.start();
        }
    }, 500);

    const productSlides = document.querySelectorAll('.product-card-section .swiper-slide');
    const productSection = document.querySelector('.product-card-section');

    let productAnimated = false;

    const productObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !productAnimated) {
                productAnimated = true;
                productSlides.forEach((slide, index) => {
                    setTimeout(() => {
                        slide.classList.add('loaded');
                    }, index * 200);
                });
                observer.unobserve(productSection);
            }
        });
    }, {
        threshold: 0.2 
    });

    productObserver.observe(productSection);
});
