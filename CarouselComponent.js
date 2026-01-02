
class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                }
                .carousel-container {
                    overflow: hidden;
                }
                .carousel {
                    display: flex;
                    gap: 1.5rem;
                    transition: transform 0.5s ease-in-out;
                    padding-block: 1rem;
                }
                ::slotted(*) {
                    flex-shrink: 0;
                    width: 100%;
                }
                .carousel-navigation {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    width: auto;
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.5rem;
                }
                .carousel-button {
                    background: #fff;
                    border: 1px solid #ddd;
                    color: #333;
                    font-size: 1.2rem;
                    cursor: pointer;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    transition: all 0.2s ease-in-out;
                }
                .carousel-button:hover {
                    background: #f0f0f0;
                    transform: translateY(-2px);
                }
                .carousel-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                @media (min-width: 768px) {
                    ::slotted(*) {
                        width: calc(50% - 0.75rem);
                    }
                }
                
                @media (min-width: 1024px) {
                    ::slotted(*) {
                        width: calc(33.333% - 1rem);
                    }
                }

            </style>
            <div class="carousel-container">
                <div class="carousel">
                    <slot></slot>
                </div>
            </div>
            <div class="carousel-navigation">
                <button class="carousel-button prev">&#8249;</button>
                <button class="carousel-button next">&#8250;</button>
            </div>
        `;
    }

    connectedCallback() {
        const carousel = this.shadowRoot.querySelector('.carousel');
        const prevButton = this.shadowRoot.querySelector('.prev');
        const nextButton = this.shadowRoot.querySelector('.next');
        const slotted = this.shadowRoot.querySelector('slot');
        let cards;
        let currentIndex = 0;

        const setupAndRender = () => {
            cards = slotted.assignedElements();
            if (cards.length === 0) return;
            updateCarousel();
        };

        slotted.addEventListener('slotchange', setupAndRender, { once: true });


        const updateCarousel = (isManual = false) => {
            if (!cards || cards.length === 0) return;

            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

            let itemsVisible = 1;
            if (isTablet) {
                itemsVisible = 2;
            } else if (!isMobile) {
                itemsVisible = 3;
            }
            
            const cardWidth = cards[0].offsetWidth;
            const gap = parseInt(getComputedStyle(carousel).gap) || 0;
            const scrollAmount = currentIndex * (cardWidth + gap);
            
            carousel.style.transform = `translateX(-${scrollAmount}px)`;

            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= cards.length - itemsVisible;
        };

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel(true);
            }
        });

        nextButton.addEventListener('click', () => {
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

            let itemsVisible = 1;
            if (isTablet) {
                itemsVisible = 2;
            } else if (!isMobile) {
                itemsVisible = 3;
            }

            if (currentIndex < cards.length - itemsVisible) {
                currentIndex++;
                updateCarousel(true);
            }
        });

        window.addEventListener('resize', () => {
            updateCarousel(true);
        });

        // A brief delay to allow slotted content to render before the first update
        setTimeout(() => {
            setupAndRender();
        }, 100)
    }
}

customElements.define('carousel-component', CarouselComponent);
