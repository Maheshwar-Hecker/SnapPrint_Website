/**
 * Slideshow Image Widget
 * Creates an adaptive-width image carousel with smooth transitions
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.containerId - ID of the container element
 * @param {Array} config.slides - Array of slide objects
 * @param {boolean} config.autoPlay - Enable auto-play (default: true)
 * @param {number} config.interval - Auto-play interval in ms (default: 4000)
 * @param {boolean} config.showDots - Show navigation dots (default: true)
 * @param {boolean} config.showArrows - Show navigation arrows (default: true)
 * @param {boolean} config.adaptiveWidth - Enable adaptive width based on image (default: true)
 */

class SlideshowWidget {
    constructor(config) {
        this.containerId = config.containerId;
        this.slides = config.slides || [];
        this.autoPlay = config.autoPlay !== false;
        this.interval = config.interval || 4000;
        this.showDots = config.showDots !== false;
        this.showArrows = config.showArrows !== false;
        this.adaptiveWidth = config.adaptiveWidth !== false;
        this.currentSlide = 0;
        this.autoPlayTimer = null;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = this.render();
        this.attachEventListeners();
        if (this.autoPlay) this.startAutoPlay();
    }

    render() {
        return `
            <div class="slideshow-wrapper">
                <div class="slides-container">
                    ${this.slides.map((slide, index) => `
                        <div class="slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            ${slide.link ? `<a href="${slide.link}" class="slide-link">` : ''}
                            <img 
                                src="${slide.image}" 
                                alt="${slide.alt || 'Slide ' + (index + 1)}"
                                class="slide-image"
                                style="${this.adaptiveWidth && slide.aspectRatio ? `aspect-ratio: ${slide.aspectRatio};` : ''}"
                            />
                            ${slide.caption ? `
                                <div class="slide-caption">
                                    ${slide.title ? `<h3>${slide.title}</h3>` : ''}
                                    ${slide.description ? `<p>${slide.description}</p>` : ''}
                                    ${slide.buttonText ? `<button class="slide-cta">${slide.buttonText}</button>` : ''}
                                </div>
                            ` : ''}
                            ${slide.link ? `</a>` : ''}
                        </div>
                    `).join('')}
                </div>

                ${this.showArrows ? `
                    <button class="slide-arrow slide-prev" aria-label="Previous slide">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    <button class="slide-arrow slide-next" aria-label="Next slide">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                ` : ''}

                ${this.showDots ? `
                    <div class="slide-dots">
                        ${this.slides.map((_, index) => `
                            <button 
                                class="dot ${index === 0 ? 'active' : ''}" 
                                data-slide="${index}"
                                aria-label="Go to slide ${index + 1}"
                            ></button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <style>
                .slideshow-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .slides-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    transform: scale(0.95);
                    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                                transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                }

                .slide.active {
                    opacity: 1;
                    transform: scale(1);
                    pointer-events: auto;
                    z-index: 1;
                }

                .slide-link {
                    display: block;
                    width: 100%;
                    height: 100%;
                    text-decoration: none;
                    color: inherit;
                }

                .slide-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .slide-caption {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 40px;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    color: white;
                    transform: translateY(20px);
                    opacity: 0;
                    transition: all 0.5s ease 0.3s;
                }

                .slide.active .slide-caption {
                    transform: translateY(0);
                    opacity: 1;
                }

                .slide-caption h3 {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    letter-spacing: -0.5px;
                }

                .slide-caption p {
                    font-size: 16px;
                    margin-bottom: 20px;
                    opacity: 0.9;
                }

                .slide-cta {
                    padding: 12px 32px;
                    background: white;
                    color: black;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .slide-cta:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255,255,255,0.3);
                }

                .slide-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.3s ease;
                    opacity: 0;
                }

                .slideshow-wrapper:hover .slide-arrow {
                    opacity: 1;
                }

                .slide-arrow:hover {
                    background: white;
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                }

                .slide-prev {
                    left: 20px;
                }

                .slide-next {
                    right: 20px;
                }

                .slide-dots {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                    z-index: 10;
                }

                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 0;
                }

                .dot.active {
                    background: white;
                    width: 32px;
                    border-radius: 5px;
                }

                .dot:hover {
                    background: rgba(255, 255, 255, 0.8);
                }

                @media (max-width: 768px) {
                    .slide-caption {
                        padding: 24px;
                    }

                    .slide-caption h3 {
                        font-size: 24px;
                    }

                    .slide-caption p {
                        font-size: 14px;
                    }

                    .slide-arrow {
                        width: 40px;
                        height: 40px;
                        opacity: 1;
                    }
                }
            </style>
        `;
    }

    attachEventListeners() {
        const container = document.getElementById(this.containerId);

        // Arrow navigation
        if (this.showArrows) {
            container.querySelector('.slide-prev')?.addEventListener('click', () => this.prevSlide());
            container.querySelector('.slide-next')?.addEventListener('click', () => this.nextSlide());
        }

        // Dot navigation
        if (this.showDots) {
            container.querySelectorAll('.dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const slideIndex = parseInt(e.target.dataset.slide);
                    this.goToSlide(slideIndex);
                });
            });
        }

        // Pause on hover
        container.addEventListener('mouseenter', () => this.stopAutoPlay());
        container.addEventListener('mouseleave', () => {
            if (this.autoPlay) this.startAutoPlay();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;
        const container = document.getElementById(this.containerId);
        const slides = container.querySelectorAll('.slide');
        const dots = container.querySelectorAll('.dot');

        slides[this.currentSlide].classList.remove('active');
        if (dots[this.currentSlide]) dots[this.currentSlide].classList.remove('active');

        this.currentSlide = index;

        slides[this.currentSlide].classList.add('active');
        if (dots[this.currentSlide]) dots[this.currentSlide].classList.add('active');

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => this.nextSlide(), this.interval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    destroy() {
        this.stopAutoPlay();
        const container = document.getElementById(this.containerId);
        if (container) container.innerHTML = '';
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SlideshowWidget;
}