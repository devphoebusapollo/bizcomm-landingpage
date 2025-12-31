document.addEventListener('DOMContentLoaded', () => {

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }

    hamburger.addEventListener('click', () => {
        const isActive = navLinks.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            hamburger.classList.add('active');
            navLinks.classList.add('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    // Accordion functionality (for FAQ section)
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const content = item.querySelector('.accordion-content');
            // Close other accordions
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle current accordion
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Modal functionality
    const modal = document.getElementById('signup-modal');
    const enrollButtons = document.querySelectorAll('.enroll-now');
    const closeModal = document.querySelector('.close-modal');

    enrollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Generic Carousel Logic
    function setupCarousel(carouselSelector, prevButtonSelector, nextButtonSelector, cardSelector, containerSelector) {
        const carousel = document.querySelector(carouselSelector);
        const prevButton = document.querySelector(prevButtonSelector);
        const nextButton = document.querySelector(nextButtonSelector);
        const cards = document.querySelectorAll(cardSelector);
        const container = document.querySelector(containerSelector);

        if (!carousel || !container) return;

        let currentIndex = 0;
        let autoScrollInterval;

        function isCarouselScrollable() {
            return carousel.scrollWidth > container.offsetWidth;
        }

        function updateCarousel(isManual = false) {
            if (!isCarouselScrollable()) {
                carousel.style.transform = 'translateX(0px)';
                if (prevButton) prevButton.disabled = true;
                if (nextButton) nextButton.disabled = true;
                return;
            }
            
            if (!isManual) {
                 const totalWidth = carousel.scrollWidth;
                 const containerWidth = container.offsetWidth;
                 if (currentIndex >= (totalWidth - containerWidth) / (cards[0].offsetWidth + parseInt(getComputedStyle(carousel).gap))) {
                    currentIndex = 0;
                 }
            }

            const cardWidth = cards[0].offsetWidth;
            const gap = parseInt(getComputedStyle(carousel).gap) || 0;
            let scrollAmount = currentIndex * (cardWidth + gap);
            
            const maxScroll = carousel.scrollWidth - container.offsetWidth;
            if (scrollAmount > maxScroll) {
                scrollAmount = maxScroll;
            }

            carousel.style.transform = `translateX(-${scrollAmount}px)`;

            if (prevButton) prevButton.disabled = currentIndex === 0;
            if (nextButton) nextButton.disabled = (scrollAmount >= maxScroll - 2);
        }

        function startAutoScroll() {
            stopAutoScroll(); // Clear any existing interval
            if (isCarouselScrollable()) {
                autoScrollInterval = setInterval(() => {
                    currentIndex++;
                    updateCarousel();
                }, 5000);
            }
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel(true);
                    stopAutoScroll();
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const maxIndex = Math.floor((carousel.scrollWidth - container.offsetWidth) / (cards[0].offsetWidth + parseInt(getComputedStyle(carousel).gap)));
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel(true);
                    stopAutoScroll(); 
                }
            });
        }

        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoScroll();
                } else {
                    stopAutoScroll();
                }
            });
        }, { threshold: 0.5 });

        carouselObserver.observe(container);

        window.addEventListener('resize', () => {
            updateCarousel(true);
        });
        updateCarousel(true);
    }

    // Setup Testimonial Carousel
    setupCarousel('.testimonial-carousel', '.prev-testimonial', '.next-testimonial', '.testimonial-card', '.testimonial-carousel-container');

    // Setup Curriculum Carousel
    setupCarousel('.curriculum-carousel', '.prev-curriculum', '.next-curriculum', '.curriculum-card', '.curriculum-carousel-container');

    // Gallery Animation on Scroll
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 150); // Staggered animation
                galleryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    galleryItems.forEach(item => {
        galleryObserver.observe(item);
    });

});