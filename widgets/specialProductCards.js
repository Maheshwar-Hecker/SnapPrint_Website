/**
 * Special Product Cards Widget
 * Creates special promotional cards for carousels and featured sections
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.title - Card title
 * @param {string} config.subtitle - Card subtitle/tagline
 * @param {string} config.image - Background/product image
 * @param {string} config.link - Card link
 * @param {string} config.ctaText - Call-to-action button text
 * @param {string} config.layout - Layout type ('horizontal', 'vertical', 'banner')
 * @param {string} config.bgColor - Background color (hex or gradient)
 * @param {string} config.textColor - Text color
 * @param {boolean} config.showCta - Show CTA button (default: true)
 * @returns {string} HTML string for special card
 */

function createSpecialCard(config) {
    const {
        title,
        subtitle = '',
        image,
        link = '#',
        ctaText = 'Shop Now',
        layout = 'vertical',
        bgColor = null,
        textColor = '#000000',
        showCta = true
    } = config;

    const bgStyle = bgColor 
        ? (bgColor.includes('gradient') ? `background: ${bgColor};` : `background-color: ${bgColor};`)
        : '';

    return `
        <div class="special-card special-card-${layout}" style="${bgStyle}">
            <a href="${link}" class="special-card-link">
                <div class="special-card-image">
                    <img src="${image}" alt="${title}" loading="lazy">
                </div>
                <div class="special-card-content" style="color: ${textColor};">
                    ${subtitle ? `<p class="special-subtitle">${subtitle}</p>` : ''}
                    <h3 class="special-title">${title}</h3>
                    ${showCta ? `
                        <button class="special-cta">
                            ${ctaText}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </a>
        </div>
    `;
}

/**
 * Create a deal/offer card
 * @param {Object} config - Configuration object
 */
function createDealCard(config) {
    const {
        title,
        discount,
        image,
        link = '#',
        badge = 'DEAL',
        bgColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    } = config;

    return `
        <div class="deal-card" style="background: ${bgColor};">
            <a href="${link}" class="deal-card-link">
                <div class="deal-badge">${badge}</div>
                <div class="deal-content">
                    <h3 class="deal-title">${title}</h3>
                    <p class="deal-discount">${discount}</p>
                </div>
                <div class="deal-image">
                    <img src="${image}" alt="${title}" loading="lazy">
                </div>
            </a>
        </div>
    `;
}

/**
 * Render carousel of special cards
 * @param {Array} cards - Array of card config objects
 * @param {string} containerId - Container element ID
 * @param {Object} options - Carousel options
 */
function renderSpecialCarousel(cards, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { scrollAmount = 340, enableDrag = true } = options;

    const html = cards.map(card => createSpecialCard(card)).join('');
    container.innerHTML = html;

    // Setup carousel controls
    setupCarouselControls(containerId, scrollAmount);

    // Enable drag scrolling if requested
    if (enableDrag) {
        enableDragScroll(container);
    }
}

/**
 * Setup carousel navigation controls
 * @param {string} containerId - Container ID
 * @param {number} scrollAmount - Amount to scroll on button click
 */
function setupCarouselControls(containerId, scrollAmount) {
    const prevBtn = document.querySelector(`.carousel-btn.prev[data-carousel="${containerId}"]`);
    const nextBtn = document.querySelector(`.carousel-btn.next[data-carousel="${containerId}"]`);
    const container = document.getElementById(containerId);

    if (!container) return;

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Enable drag-to-scroll functionality
 * @param {HTMLElement} container - Container element
 */
function enableDragScroll(container) {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });
}

// Add special card styles (wrap in IIFE to avoid global scope pollution)
(function() {
    // Check if styles already added
    if (document.getElementById('special-card-styles')) return;
    
    const specialCardStyle = document.createElement('style');
    specialCardStyle.id = 'special-card-styles';
    specialCardStyle.textContent = `
    .special-card {
        min-width: 320px;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .special-card-link {
        display: block;
        width: 100%;
        height: 100%;
        text-decoration: none;
        color: inherit;
    }

    .special-card-vertical {
        display: flex;
        flex-direction: column;
    }

    .special-card-horizontal {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .special-card-banner {
        min-width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 40px;
    }

    .special-card-image {
        width: 100%;
        height: 200px;
        overflow: hidden;
        flex-shrink: 0;
    }

    .special-card-horizontal .special-card-image,
    .special-card-banner .special-card-image {
        height: 100%;
    }

    .special-card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .special-card:hover .special-card-image img {
        transform: scale(1.1);
    }

    .special-card-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .special-subtitle {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.7;
        margin: 0;
    }

    .special-title {
        font-size: 20px;
        font-weight: 700;
        margin: 0;
        line-height: 1.3;
    }

    .special-cta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid currentColor;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        align-self: flex-start;
        margin-top: auto;
    }

    .special-cta:hover {
        background: rgba(0, 0, 0, 0.2);
        transform: translateX(4px);
    }

    /* Deal Cards */
    .deal-card {
        min-width: 280px;
        height: 160px;
        border-radius: 14px;
        padding: 24px;
        position: relative;
        overflow: hidden;
        color: white;
    }

    .deal-card-link {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        text-decoration: none;
        color: inherit;
    }

    .deal-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 12px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1px;
    }

    .deal-content {
        z-index: 1;
    }

    .deal-title {
        font-size: 22px;
        font-weight: 700;
        margin: 0 0 8px 0;
    }

    .deal-discount {
        font-size: 16px;
        font-weight: 600;
        opacity: 0.9;
        margin: 0;
    }

    .deal-image {
        width: 120px;
        height: 120px;
        z-index: 1;
    }

    .deal-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
        transition: transform 0.4s ease;
    }

    .deal-card:hover .deal-image img {
        transform: scale(1.1) rotate(5deg);
    }

    /* Drag scroll cursor */
    .special-carousel.draggable {
        cursor: grab;
    }

    .special-carousel.draggable:active {
        cursor: grabbing;
    }

    @media (max-width: 768px) {
        .special-card {
            min-width: 280px;
        }

        .deal-card {
            min-width: 240px;
            height: 140px;
            padding: 20px;
        }

        .deal-title {
            font-size: 18px;
        }

        .deal-image {
            width: 100px;
            height: 100px;
        }
    }
`;
    document.head.appendChild(specialCardStyle);
})();

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        createSpecialCard, 
        createDealCard, 
        renderSpecialCarousel,
        setupCarouselControls,
        enableDragScroll
    };
}