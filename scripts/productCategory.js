/**
 * Product Category Page Script
 * Handles category display, subcategories, and product listings
 */

// Get category from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const currentCategory = urlParams.get('category') || 'tshirts';

let categoryData = null;

// Sample product data for demonstration
const generateCategoryProducts = (categoryName, count = 6) => {
    const products = [];
    const baseImages = [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop'
    ];
    
    const badges = ['NEW', 'HOT', 'SALE', 'POPULAR', 'BESTSELLER'];
    const cardColors = ['#FFE5E5', '#E5E5FF', '#E5FFE5', '#FFFFE5', '#FFE5F0', '#F0E5FF'];
    
    for (let i = 0; i < count; i++) {
        products.push({
            title: `${categoryName} Design ${i + 1}`,
            description: `Premium custom ${categoryName.toLowerCase()}`,
            image: baseImages[i % baseImages.length],
            price: Math.floor(Math.random() * 500) + 299,
            originalPrice: Math.floor(Math.random() * 800) + 599,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviewCount: Math.floor(Math.random() * 500) + 50,
            badge: i % 3 === 0 ? badges[i % badges.length] : null,
            link: `#product-${i}`,
            productId: `cat-${currentCategory}-${i}`,
            cardColor: cardColors[i % cardColors.length]
        });
    }
    
    return products;
};

// Mixed categories products (4-5 rows = 24-30 products)
const mixedCategoryProducts = [
    ...generateCategoryProducts('Mug', 6),
    ...generateCategoryProducts('Hoodie', 6),
    ...generateCategoryProducts('Phone Case', 6),
    ...generateCategoryProducts('Frame', 6),
    ...generateCategoryProducts('Keychain', 6)
];

// Previously viewed products
const previouslyViewedProducts = [
    {
        title: 'Custom Design Pro',
        description: 'Viewed 2 hours ago',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: 499,
        originalPrice: 999,
        rating: 4.8,
        reviewCount: 234,
        link: '#prev-1',
        productId: 'prev-001',
        cardColor: '#F0F0F0'
    },
    {
        title: 'Premium Quality Item',
        description: 'Viewed yesterday',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        rating: 4.7,
        reviewCount: 189,
        link: '#prev-2',
        productId: 'prev-002',
        cardColor: '#FFF5E5'
    },
    {
        title: 'Classic Design',
        description: 'Viewed 3 days ago',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 999,
        rating: 4.6,
        reviewCount: 156,
        link: '#prev-3',
        productId: 'prev-003',
        cardColor: '#E5FFE5'
    },
    {
        title: 'Modern Style',
        description: 'Viewed last week',
        image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1499,
        rating: 4.9,
        reviewCount: 345,
        link: '#prev-4',
        productId: 'prev-004',
        cardColor: '#E5F5FF'
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Loading Product Category Page...');
    console.log('Current Category:', currentCategory);
    
    // Initialize hamburger menu
    initHamburgerMenu();
    
    // Load category data
    await loadCategoryData();
    
    // Render page sections
    if (categoryData) {
        updatePageHeader();
        renderSubcategories();
        renderRelatedProducts();
        renderPreviouslyViewed();
        renderMixedCategories();
    }
    
    console.log('✅ Product Category Page Ready!');
});

/**
 * Load category data from JSON
 */
async function loadCategoryData() {
    try {
        const response = await fetch('data/product_sub.json');
        const allCategories = await response.json();
        categoryData = allCategories[currentCategory];
        
        if (!categoryData) {
            console.error('Category not found:', currentCategory);
            // Fallback to tshirts
            categoryData = allCategories['tshirts'];
        }
    } catch (error) {
        console.error('Error loading category data:', error);
    }
}

/**
 * Update page header with category info
 */
function updatePageHeader() {
    document.getElementById('category-name').textContent = categoryData.name;
    document.getElementById('category-icon').textContent = categoryData.icon;
    document.getElementById('category-title').textContent = categoryData.name;
    document.getElementById('category-description').textContent = categoryData.description;
    document.title = `SnapPrint - ${categoryData.name}`;
}

/**
 * Render subcategory cards
 */
function renderSubcategories() {
    const subcategories = categoryData.subcategories || [];
    
    // Split into two sections: New Arrivals (first half) and Collections (second half)
    const midPoint = Math.ceil(subcategories.length / 2);
    const newArrivals = subcategories.slice(0, midPoint);
    const collections = subcategories.slice(midPoint);
    
    // Render New Arrivals
    const newArrivalsGrid = document.getElementById('new-arrivals-grid');
    newArrivalsGrid.innerHTML = newArrivals.map(sub => createSubcategoryCard(sub)).join('');
    
    // Render Collections
    const collectionsGrid = document.getElementById('collections-grid');
    collectionsGrid.innerHTML = collections.map(sub => createSubcategoryCard(sub)).join('');
}

/**
 * Create subcategory card HTML
 */
function createSubcategoryCard(subcategory) {
    return `
        <div class="subcategory-card" onclick="navigateToSubcategory('${subcategory.id}')">
            <div class="subcategory-card-image">
                <img src="${subcategory.image}" alt="${subcategory.name}" loading="lazy">
            </div>
            <div class="subcategory-card-content">
                <h3 class="subcategory-name">${subcategory.name}</h3>
                <p class="subcategory-description">${subcategory.description}</p>
                <div class="subcategory-count">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    ${subcategory.productCount} Products
                </div>
                <button class="view-subcategory-btn">
                    View Collection
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

/**
 * Navigate to subcategory
 */
function navigateToSubcategory(subcategoryId) {
    console.log('Navigate to:', currentCategory, subcategoryId);
    // TODO: Navigate to product listing page
    alert(`Navigating to ${subcategoryId} products...`);
}

/**
 * Render related products sections
 */
function renderRelatedProducts() {
    const categoryName = categoryData.name;
    
    // Section 1: Popular Choices
    document.getElementById('related-section-1-title').textContent = `Popular ${categoryName}`;
    const products1 = generateCategoryProducts(categoryName, 6);
    renderProducts(products1, 'related-products-1', { variant: 'default' });
    
    // Section 2: Trending Now
    document.getElementById('related-section-2-title').textContent = `Trending ${categoryName}`;
    const products2 = generateCategoryProducts(categoryName, 6);
    renderProducts(products2, 'related-products-2', { variant: 'curved-bottom' });
    
    // Section 3: Best Sellers
    document.getElementById('related-section-3-title').textContent = `Best Selling ${categoryName}`;
    const products3 = generateCategoryProducts(categoryName, 6);
    renderProducts(products3, 'related-products-3', { variant: 'curved-all' });
}

/**
 * Render previously viewed products
 */
function renderPreviouslyViewed() {
    renderProducts(previouslyViewedProducts, 'previously-viewed', { 
        variant: 'colored', 
        enableCardColors: true 
    });
}

/**
 * Render mixed categories section
 */
function renderMixedCategories() {
    renderProducts(mixedCategoryProducts, 'mixed-categories', { 
        variant: 'colored', 
        enableCardColors: true,
        gridCols: 6
    });
}

/**
 * Initialize hamburger menu
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const headerActions = document.querySelector('.header-actions');

    if (hamburger && headerActions) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            headerActions.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !headerActions.contains(e.target)) {
                hamburger.classList.remove('active');
                headerActions.classList.remove('active');
            }
        });
    }
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}
