document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll('.advantage-item');
    const advantageSection = document.querySelector('.advantage-section');

    let loaded = false; 

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !loaded) {
                loaded = true;
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('loaded');
                    }, 300 * index);
                });
                observer.unobserve(advantageSection); 
            }
        });
    }, {
        threshold: 0.3 
    });

    observer.observe(advantageSection);
});

