/**
 * Category Unit Widget
 * Creates Flipkart-style category cards with icons
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.name - Category name
 * @param {string} config.icon - Icon (emoji or SVG)
 * @param {number} config.count - Number of products in category
 * @param {string} config.link - Link to category page
 * @param {string} config.theme - Theme variant ('default', 'minimal')
 * @param {boolean} config.showCount - Show product count (default: true)
 * @returns {string} HTML string for category unit
 */

function createCategoryUnit(config) {
    const {
        name,
        icon = '📦',
        count = 0,
        link = '#',
        theme = 'default',
        showCount = true
    } = config;

    const countText = count > 0 ? `${count} Product${count !== 1 ? 's' : ''}` : 'Explore';

    return `
        <a href="${link}" class="category-unit category-${theme}" data-category="${name}">
            <div class="category-icon">
                ${icon}
            </div>
            <div class="category-name">${name}</div>
            ${showCount ? `<div class="category-count">${countText}</div>` : ''}
        </a>
    `;
}

/**
 * Batch create multiple category units
 * @param {Array} categories - Array of category config objects
 * @param {string} containerId - Container element ID
 */
function renderCategories(categories, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = categories.map(category => createCategoryUnit(category)).join('');
    container.innerHTML = html;

    // Add staggered animation
    const categoryElements = container.querySelectorAll('.category-unit');
    categoryElements.forEach((el, index) => {
        el.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s both`;
    });
}

// Category icons mapping (can be extended)
const categoryIcons = {
    'T-Shirts': '👕',
    'Hoodies': '🧥',
    'Mugs & Cups': '☕',
    'Phone Cases': '📱',
    'Photo Frames': '🖼️',
    'Key Chains': '🔑',
    'Face Masks': '😷',
    'Tote Bags': '👜',
    'Pendants': '💎',
    'Slippers': '🩴',
    'Wooden Items': '🪵',
    'Stone Pasting': '💍',
    'Child Costume': '👶',
    'Custom Prints': '🎨'
};

/**
 * Get icon for category name
 * @param {string} categoryName - Name of the category
 * @returns {string} Icon (emoji or default)
 */
function getCategoryIcon(categoryName) {
    return categoryIcons[categoryName] || '📦';
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createCategoryUnit, renderCategories, getCategoryIcon, categoryIcons };
}