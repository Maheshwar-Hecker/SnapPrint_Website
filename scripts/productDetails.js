/**
 * Product Details Page Script
 */

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || 'prod-001';

/// Global state
let productData = null;

// Sample reviews data
const reviewsData = [
    {
        name: 'Rahul Sharma',
        rating: 5,
        date: '2 days ago',
        text: 'Excellent quality! The print is very sharp and the fabric feels premium. Highly recommended for custom printing.'
    },
    {
        name: 'Priya Patel',
        rating: 4,
        date: '1 week ago',
        text: 'Good product overall. The t-shirt fits well and the print quality is nice. Delivery was fast too.'
    },
    {
        name: 'Amit Kumar',
        rating: 5,
        date: '2 weeks ago',
        text: 'Best custom t-shirts I\'ve ordered! The quality is outstanding and the colors are vibrant. Will order again!'
    },
    {
        name: 'Sneha Verma',
        rating: 4,
        date: '3 weeks ago',
        text: 'Nice fabric quality and good print. Slightly expensive but worth it for the quality you get.'
    },
    {
        name: 'Vikram Singh',
        rating: 5,
        date: '1 month ago',
        text: 'Perfect for my business merchandise! Ordered 50 pieces and all came out perfectly. Great service!'
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Loading Product Details Page...');
    
    await window.dataService.init();
    await loadProductData();
    
    if (productData) {
        // Setup image gallery
        setupImageGallery();
        
        // Setup size selection
        setupSizeSelection();
        
        // Setup color selection
        setupColorSelection();
        
        // Setup quantity controls
        setupQuantityControls();
        
        // Setup action buttons
        setupActionButtons();
        
        // Setup customizer canvas
        setTimeout(() => setupCustomizer(), 500); // Small delay to let images load
        
        // Setup tabs
        setupTabs();
        
        // Load reviews (mock)
        loadReviews();
        
        // Load product sections dynamically
        const categoryName = productData.categoryName || productData.category;
        let related = await window.dataService.getProductsByCategory(categoryName);
        if (related.length === 0) related = await window.dataService.getRandomProducts(10);
        
        const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());
        
        renderProducts(shuffle(related).slice(0, 8), 'viral-products');
        renderProducts(await window.dataService.getRandomProducts(8), 'most-viewed-products');
        renderProducts(await window.dataService.getRandomProducts(12), 'mixed-category-products');
        renderProducts(shuffle(related).slice(0, 8), 'related-products');
        renderProducts(await window.dataService.getRandomProducts(6), 'customers-also-bought');
        
        const prevViewed = await window.dataService.getRandomProducts(4);
        prevViewed.forEach(p => p.viewedTime = 'Viewed recently');
        renderProducts(prevViewed, 'previously-viewed');
        
        const bundled = await window.dataService.getRandomProducts(4);
        bundled.forEach(p => p.badge = 'BUNDLE SAVE');
        renderProducts(bundled, 'bundled-offers');
        
        renderProducts(await window.dataService.getRandomProducts(10), 'mixed-categories-final');
    }
    
    console.log('✅ Product Details Page Ready!');
});

/**
 * Load product data into page
 */
async function loadProductData() {
    productData = await window.dataService.getProductById(productId);
    
    if (!productData) {
        console.error("Product not found:", productId);
        // Load a random product as fallback if dev test links are broken
        const randoms = await window.dataService.getRandomProducts(1);
        productData = randoms[0];
        if (!productData) return;
    }

    // Build the dynamic image paths if they exist
    let imageArray = productData.images || [];
    if (productData.baseImagePath && productData.images) {
        imageArray = productData.images.map(img => productData.baseImagePath + img);
    } else if (productData.image) {
        imageArray = [productData.image];
    }
    productData.images = imageArray;

    // Fill missing mock data since JSON might be sparse
    productData.category = productData.categoryName || 'T-Shirts';
    productData.categoryLink = `productCategory.html?category=${encodeURIComponent(productData.category)}`;
    productData.description = productData.description || 'Premium quality print material.';
    productData.sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    productData.colors = [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Navy', hex: '#001f3f' }
    ];
    productData.highlights = [
        'Premium quality material',
        'Vibrant & long-lasting colors',
        'Custom verified print'
    ];
    
    // Update breadcrumb
    const breadCat = document.getElementById('breadcrumb-category');
    if (breadCat) {
        breadCat.textContent = productData.category;
        breadCat.href = productData.categoryLink;
    }
    const breadProd = document.getElementById('breadcrumb-product');
    if (breadProd) breadProd.textContent = productData.title;
    
    // Update product info
    document.getElementById('product-category').textContent = productData.category;
    document.getElementById('product-title').textContent = productData.title;
    document.getElementById('rating-value').textContent = productData.rating || 4.5;
    
    let rvCount = productData.reviewCount || 100;
    document.getElementById('review-count').textContent = rvCount.toLocaleString();
    if(document.getElementById('review-count-tab')) document.getElementById('review-count-tab').textContent = rvCount.toLocaleString();
    
    // Calculate discount
    const discount = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
    document.getElementById('discount-badge').textContent = `-${discount}%`;
    document.getElementById('current-price').textContent = `₹${productData.price}`;
    document.getElementById('original-price').textContent = `₹${productData.originalPrice}`;
    
    // Update badge
    const badgeEl = document.getElementById('product-badge');
    if (productData.badge) {
        badgeEl.textContent = productData.badge;
        badgeEl.style.display = 'inline-block';
    } else {
        if(badgeEl) badgeEl.style.display = 'none';
    }
    
    // Update description
    document.getElementById('product-description').textContent = productData.description;
    
    // Update highlights
    const highlightsList = document.getElementById('product-highlights-list');
    if (highlightsList) highlightsList.innerHTML = productData.highlights.map(h => `<li>${h}</li>`).join('');
    
    document.title = `${productData.title} - SnapPrint`;
}

/**
 * Setup image gallery
 */
function setupImageGallery() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    
    // Create thumbnails
    thumbnailGallery.innerHTML = productData.images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
            <img src="${img}" alt="Product view ${index + 1}">
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Update main image
            mainImage.src = thumb.dataset.image;
            
            // Update active state
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

/**
 * Setup size selection
 */
function setupSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/**
 * Setup color selection
 */
function setupColorSelection() {
    const colorButtons = document.querySelectorAll('.color-btn');
    
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/**
 * Setup quantity controls
 */
function setupQuantityControls() {
    const qtyInput = document.getElementById('qty-input');
    const decreaseBtn = document.getElementById('qty-decrease');
    const increaseBtn = document.getElementById('qty-increase');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const base = productData.price || 649;
    
    // Check if JSON has bulkPricing, else use fallback
    let tiers = productData.bulkPricing || [
        { min: 1, max: 5, price: base },
        { min: 6, max: 10, price: Math.round(base * 0.98) },
        { min: 11, max: 20, price: Math.round(base * 0.96) },
        { min: 21, max: 1000, price: Math.round(base * 0.94) }
    ];

    // Populate UI table dynamically
    const tableHeaderRow = document.querySelector('.bulk-table thead tr');
    const tableBodyRow = document.querySelector('.bulk-table tbody tr');
    
    if (tableHeaderRow && tableBodyRow) {
        tableHeaderRow.innerHTML = '<th>Qty:</th>';
        tableBodyRow.innerHTML = '<td>Price:</td>';
        
        tiers.forEach((tier, index) => {
            const rangeStr = tier.max === 1000 ? `${tier.min}+` : `${tier.min}-${tier.max}`;
            tableHeaderRow.innerHTML += `<th>${rangeStr}</th>`;
            tableBodyRow.innerHTML += `<td id="price-tier-${index + 1}">₹${tier.price}</td>`;
        });
    }

    function updatePrice() {
        const qty = parseInt(qtyInput.value) || 1;
        let unitPrice = base;
        
        for (const tier of tiers) {
            if (qty >= tier.min && qty <= tier.max) {
                unitPrice = tier.price;
                break;
            }
        }
        
        totalPriceDisplay.textContent = `₹${unitPrice * qty}`;
    }
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
            updatePrice();
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue < 100) {
            qtyInput.value = currentValue + 1;
            updatePrice();
        }
    });
    
    qtyInput.addEventListener('input', updatePrice);
    updatePrice(); // Init
}

/**
 * Setup action buttons
 */
function setupActionButtons() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    const wishlistBtn = document.getElementById('main-product-wishlist');
    
    addToCartBtn.addEventListener('click', () => {
        const size = document.querySelector('.size-btn.active')?.dataset.size || 'M';
        const color = document.querySelector('.color-btn.active')?.dataset.color || 'Black';
        const quantity = document.getElementById('qty-input').value;
        
        alert(`Added to cart!\n\nProduct: ${productData.title}\nSize: ${size}\nColor: ${color}\nQuantity: ${quantity}`);
    });
    
    buyNowBtn.addEventListener('click', () => {
        const size = document.querySelector('.size-btn.active')?.dataset.size || 'M';
        const color = document.querySelector('.color-btn.active')?.dataset.color || 'Black';
        const quantity = document.getElementById('qty-input').value;
        
        alert(`Proceeding to checkout...\n\nProduct: ${productData.title}\nSize: ${size}\nColor: ${color}\nQuantity: ${quantity}\nTotal: ₹${productData.price * quantity}`);
    });

    if (wishlistBtn && window.wishlistService) {
        // Init state
        if (window.wishlistService.has(productId)) wishlistBtn.classList.add('active');

        wishlistBtn.addEventListener('click', () => {
            const user = window.authService?.getCurrentUser();
            if (!user) {
                window.dispatchEvent(new CustomEvent('wishlist:require-login'));
                return;
            }

            const isActive = wishlistBtn.classList.contains('active');
            if (isActive) {
                wishlistBtn.classList.remove('active');
                window.wishlistService.remove(productId);
            } else {
                wishlistBtn.classList.add('active');
                window.wishlistService.add(productId);
            }
        });

        // Sync with global updates
        window.addEventListener('wishlist:updated', () => {
            if (window.wishlistService.has(productId)) wishlistBtn.classList.add('active');
            else wishlistBtn.classList.remove('active');
        });
    }
}

/**
 * Setup tabs
 */
function setupTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const tabName = header.dataset.tab;
            
            // Update headers
            tabHeaders.forEach(h => h.classList.remove('active'));
            header.classList.add('active');
            
            // Update contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Load reviews
 */
function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    
    reviewsList.innerHTML = reviewsData.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${review.name.charAt(0)}</div>
                    <div>
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `).join('');
}

/**
 * Setup Fabric.js Customizer
 */
function setupCustomizer() {
    const canvasEl = document.getElementById('product-canvas');
    const wrapper = document.querySelector('.canvas-wrapper');
    const mainImage = document.getElementById('main-product-image');
    
    if (!canvasEl || !wrapper || !mainImage) return;

    // Make wrapper interactive
    wrapper.classList.add('active');
    document.querySelector('.safe-zone-indicator').style.display = 'flex';

    // Base dimensions on the main image
    const width = mainImage.clientWidth;
    const height = mainImage.clientHeight;
    
    // We create a central print area (e.g., 60% of width, 80% of height)
    const printWidth = width * 0.6;
    const printHeight = height * 0.8;

    const canvas = new fabric.Canvas('product-canvas', {
        width: printWidth,
        height: printHeight,
        preserveObjectStacking: true
    });

    // Style the canvas container
    const container = document.querySelector('.canvas-container');
    if (container) {
        container.style.border = '1px dashed rgba(0,0,0,0.3)';
        container.style.boxShadow = '0 0 0 9999px rgba(255,255,255,0.4)'; // Dim outside
    }

    // --- Multi-View Logic ---
    let currentView = 'front';
    const canvasStates = {
        front: null,
        back: null,
        left_sleeve: null,
        right_sleeve: null
    };
    
    // Mock image for the back view if none exists
    const frontImgSrc = mainImage.src;
    const backImgSrc = productData.images && productData.images.length > 1 ? productData.images[1] : frontImgSrc;
    // For sleeves, we'll just mock it with the front image for now if no specific sleeve image exists
    const lSleeveImgSrc = frontImgSrc;
    const rSleeveImgSrc = frontImgSrc;

    const printSidesHeader = document.getElementById('print-sides-header');
    const viewSwitcherTabs = document.getElementById('view-switcher-tabs');
    const backCheckbox = document.getElementById('side-back-cb');
    const lSleeveCheckbox = document.getElementById('side-lsleeve-cb');
    const rSleeveCheckbox = document.getElementById('side-rsleeve-cb');
    const viewTabs = document.querySelectorAll('.view-tab');

    // Hide optional tabs initially
    document.querySelector('.view-tab[data-view="back"]').style.display = 'none';
    document.querySelector('.view-tab[data-view="left_sleeve"]').style.display = 'none';
    document.querySelector('.view-tab[data-view="right_sleeve"]').style.display = 'none';

    // Show headers if this is a multi-sided product (e.g. T-shirt)
    if (productData.category && productData.category.toLowerCase().includes('t-shirt')) {
        if(printSidesHeader) printSidesHeader.style.display = 'block';
        if(viewSwitcherTabs) viewSwitcherTabs.style.display = 'flex';
    } else {
        if(printSidesHeader) printSidesHeader.style.display = 'none';
        if(viewSwitcherTabs) viewSwitcherTabs.style.display = 'none';
    }

    function calculateDynamicPrice() {
        let basePrice = productData.price;
        if (backCheckbox && backCheckbox.checked) basePrice += 150;
        if (lSleeveCheckbox && lSleeveCheckbox.checked) basePrice += 50;
        if (rSleeveCheckbox && rSleeveCheckbox.checked) basePrice += 50;
        
        document.getElementById('current-price').textContent = `₹${basePrice}`;
        // Update the global base price for the bulk pricing logic
        window.currentBasePrice = basePrice;
        if(typeof updatePrice === 'function') updatePrice();
    }

    // Enable/Disable Back View
    if (backCheckbox) {
        backCheckbox.addEventListener('change', (e) => {
            const backTab = document.querySelector('.view-tab[data-view="back"]');
            if (e.target.checked) {
                backTab.style.display = 'block';
            } else {
                backTab.style.display = 'none';
                if (currentView === 'back') switchView('front');
            }
            calculateDynamicPrice();
        });
    }

    // Enable/Disable Left Sleeve
    if (lSleeveCheckbox) {
        lSleeveCheckbox.addEventListener('change', (e) => {
            const tab = document.querySelector('.view-tab[data-view="left_sleeve"]');
            if (e.target.checked) {
                tab.style.display = 'block';
            } else {
                tab.style.display = 'none';
                if (currentView === 'left_sleeve') switchView('front');
            }
            calculateDynamicPrice();
        });
    }

    // Enable/Disable Right Sleeve
    if (rSleeveCheckbox) {
        rSleeveCheckbox.addEventListener('change', (e) => {
            const tab = document.querySelector('.view-tab[data-view="right_sleeve"]');
            if (e.target.checked) {
                tab.style.display = 'block';
            } else {
                tab.style.display = 'none';
                if (currentView === 'right_sleeve') switchView('front');
            }
            calculateDynamicPrice();
        });
    }

    // Switch View function
    function switchView(viewName) {
        // Save current state
        canvasStates[currentView] = JSON.stringify(canvas.toJSON());
        
        currentView = viewName;
        
        // Update tabs
        viewTabs.forEach(tab => {
            tab.style.background = tab.dataset.view === viewName ? '#000' : 'transparent';
            tab.style.color = tab.dataset.view === viewName ? '#fff' : '#000';
            tab.classList.toggle('active', tab.dataset.view === viewName);
        });

        // Swap Image
        if(viewName === 'front') mainImage.src = frontImgSrc;
        else if(viewName === 'back') mainImage.src = backImgSrc;
        else if(viewName === 'left_sleeve') mainImage.src = lSleeveImgSrc;
        else if(viewName === 'right_sleeve') mainImage.src = rSleeveImgSrc;

        // Load new state
        canvas.clear();
        if (canvasStates[viewName]) {
            canvas.loadFromJSON(canvasStates[viewName], canvas.renderAll.bind(canvas));
        }
    }

    // Tab Listeners
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => switchView(tab.dataset.view));
    });

    // --- Tools Setup ---
    document.getElementById('tool-add-text').addEventListener('click', () => {
        const text = new fabric.IText('Your Text', {
            left: 50,
            top: 50,
            fontFamily: 'Inter',
            fontSize: 24,
            fill: '#000000'
        });
        canvas.add(text);
        canvas.setActiveObject(text);
    });

    // --- Add Image Modal Logic ---
    const imageModal = document.getElementById('add-image-modal');
    
    document.getElementById('tool-add-image').addEventListener('click', () => {
        imageModal.classList.add('active');
    });

    document.getElementById('close-image-modal').addEventListener('click', () => {
        imageModal.classList.remove('active');
    });

    // Close on outside click
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) imageModal.classList.remove('active');
    });

    // Modal Tabs
    const imgTabs = document.querySelectorAll('.img-tab');
    const imgTabContents = document.querySelectorAll('.img-tab-content');
    imgTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            imgTabs.forEach(t => t.classList.remove('active'));
            imgTabContents.forEach(c => c.style.display = 'none');
            
            tab.classList.add('active');
            const target = document.getElementById(`tab-${tab.dataset.tab}`);
            if (target) {
                target.style.display = 'block';
                
                // Lazy load designs if clicked
                if (tab.dataset.tab === 'designs' && document.getElementById('designs-grid').children.length === 0) {
                    loadMockDesigns();
                }
            }
        });
    });

    // Device Upload Trigger inside Modal
    document.getElementById('trigger-file-upload').addEventListener('click', () => {
        document.getElementById('custom-image-upload').click();
    });

    document.getElementById('custom-image-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (f) => {
            fabric.Image.fromURL(f.target.result, (img) => {
                img.scaleToWidth(printWidth * 0.5); // Scale to 50% of print area
                canvas.add(img);
                canvas.centerObject(img);
                canvas.setActiveObject(img);
                imageModal.classList.remove('active'); // Close modal on add
            });
        };
        reader.readAsDataURL(file);
    });

    function loadMockDesigns() {
        const grid = document.getElementById('designs-grid');
        // Emojis as mock cliparts
        const emojis = ['😀','😎','❤️','✨','🔥','🎉','🎈','👑','⭐','💯','💪','🌟','⚽','🏀','🎸','🎵','🍕','🍔','🍩','☕'];
        grid.innerHTML = emojis.map(e => `<div class="design-item">${e}</div>`).join('');
        
        // Add to canvas on click
        grid.querySelectorAll('.design-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = new fabric.IText(item.textContent, {
                    left: 50,
                    top: 50,
                    fontSize: 64
                });
                canvas.add(text);
                canvas.centerObject(text);
                canvas.setActiveObject(text);
                imageModal.classList.remove('active');
            });
        });
    }

    // Action Bar - Download
    const downloadBtn = document.getElementById('btn-download-design');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Deselect to remove handles
            canvas.discardActiveObject();
            canvas.renderAll();
            
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1
            });
            const link = document.createElement('a');
            link.download = 'my-snapprint-design.png';
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Action Bar - Zoom
    const zoomBtn = document.getElementById('btn-zoom-design');
    if (zoomBtn) {
        let isZoomed = false;
        zoomBtn.addEventListener('click', () => {
            isZoomed = !isZoomed;
            const wrapper = document.querySelector('.canvas-wrapper');
            if (isZoomed) {
                wrapper.style.transform = 'scale(1.5)';
                wrapper.style.zIndex = '50';
                wrapper.style.backgroundColor = '#fff';
                zoomBtn.style.color = '#2563eb';
            } else {
                wrapper.style.transform = 'scale(1)';
                wrapper.style.zIndex = '1';
                wrapper.style.backgroundColor = 'transparent';
                zoomBtn.style.color = 'inherit';
            }
        });
    }

    // Action Bar - Wishlist (Mock Saving Custom Design)
    const wishlistBtn = document.getElementById('main-product-wishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            wishlistBtn.style.color = '#ef4444';
            alert("Custom design saved to your wishlist / profile!");
            // In a real app, this would serialize canvas JSON and save to user profile.
            canvasStates[currentView] = JSON.stringify(canvas.toJSON());
            localStorage.setItem('saved_custom_design', JSON.stringify(canvasStates));
        });
    }

    // --- QR Code Generator Logic ---
    const btnGenerateQr = document.getElementById('btn-generate-qr');
    if (btnGenerateQr) {
        btnGenerateQr.addEventListener('click', () => {
            const content = document.getElementById('qr-content').value;
            if (!content) {
                alert("Please enter content for the QR code.");
                return;
            }
            const color = document.getElementById('qr-color').value.replace('#', '');
            const bg = document.getElementById('qr-bg').value.replace('#', '');
            
            // Using a free QR code API
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}&color=${color}&bgcolor=${bg}`;
            
            btnGenerateQr.textContent = "Generating...";
            fabric.Image.fromURL(qrUrl, (img) => {
                img.scaleToWidth(100);
                canvas.add(img);
                canvas.centerObject(img);
                canvas.setActiveObject(img);
                imageModal.classList.remove('active');
                btnGenerateQr.textContent = "Generate QR code";
            }, { crossOrigin: 'anonymous' });
        });
    }

    // --- Web Search Logic (Mock) ---
    const btnWebSearch = document.getElementById('btn-web-search');
    const searchInput = document.getElementById('web-search-input');
    const searchGrid = document.getElementById('search-results-grid');
    
    if (btnWebSearch) {
        btnWebSearch.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (!query) return;
            
            searchGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Searching...</div>';
            
            // Mock fetching 12 random Unsplash images based on query
            setTimeout(() => {
                let html = '';
                for(let i=0; i<12; i++) {
                    const url = `https://source.unsplash.com/150x150/?${encodeURIComponent(query)}&sig=${i}`;
                    html += `<div class="design-item" style="padding:0; overflow:hidden;">
                                <img src="${url}" style="width:100%; height:100%; object-fit:cover;" crossorigin="anonymous">
                             </div>`;
                }
                searchGrid.innerHTML = html;
                
                searchGrid.querySelectorAll('.design-item img').forEach(imgEl => {
                    imgEl.addEventListener('click', (e) => {
                        const url = e.target.src;
                        fabric.Image.fromURL(url, (img) => {
                            img.scaleToWidth(150);
                            canvas.add(img);
                            canvas.centerObject(img);
                            canvas.setActiveObject(img);
                            imageModal.classList.remove('active');
                        }, { crossOrigin: 'anonymous' });
                    });
                });
            }, 800);
        });
    }

    // --- Drawing Logic ---
    let drawingCanvas;
    const tabDrawingBtn = document.querySelector('[data-tab="drawing"]');
    if (tabDrawingBtn) {
        tabDrawingBtn.addEventListener('click', () => {
            if (!drawingCanvas) {
                // Initialize secondary canvas only when tab is opened
                drawingCanvas = new fabric.Canvas('drawing-modal-canvas', {
                    isDrawingMode: true,
                    width: 600,
                    height: 300
                });
                // Sync properties
                drawingCanvas.freeDrawingBrush.color = document.getElementById('drawing-color').value;
                drawingCanvas.freeDrawingBrush.width = parseInt(document.getElementById('drawing-size').value, 10);
            }
        });
    }

    document.getElementById('drawing-color').addEventListener('change', (e) => {
        if (drawingCanvas) drawingCanvas.freeDrawingBrush.color = e.target.value;
    });

    document.getElementById('drawing-size').addEventListener('change', (e) => {
        if (drawingCanvas) drawingCanvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
    });

    document.getElementById('btn-clear-drawing').addEventListener('click', () => {
        if (drawingCanvas) drawingCanvas.clear();
    });

    document.getElementById('btn-add-drawing').addEventListener('click', () => {
        if (!drawingCanvas || drawingCanvas.getObjects().length === 0) {
            alert("Please draw something first!");
            return;
        }
        
        // Export drawing to image and add to main canvas
        const dataUrl = drawingCanvas.toDataURL('png');
        fabric.Image.fromURL(dataUrl, (img) => {
            // Trim empty space (optional advanced feature, skipping for now)
            img.scaleToWidth(200);
            canvas.add(img);
            canvas.centerObject(img);
            canvas.setActiveObject(img);
            imageModal.classList.remove('active');
        });
    });

    document.getElementById('tool-delete').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active) {
            canvas.remove(active);
            canvas.discardActiveObject();
        }
    });

    // --- Properties Panel Setup ---
    const propsBox = document.getElementById('properties-box');
    const textControls = document.getElementById('prop-text-controls');
    const imgControls = document.getElementById('prop-image-controls');
    
    const textInput = document.getElementById('prop-text-input');
    const fontSelect = document.getElementById('prop-font-select');
    const colorInput = document.getElementById('prop-color-input');
    const opacitySlider = document.getElementById('prop-opacity-slider');

    canvas.on('selection:created', updateProps);
    canvas.on('selection:updated', updateProps);
    canvas.on('selection:cleared', () => {
        propsBox.style.display = 'none';
    });

    function updateProps() {
        const active = canvas.getActiveObject();
        if (!active) return;
        
        propsBox.style.display = 'block';

        if (active.type === 'i-text') {
            textControls.style.display = 'block';
            imgControls.style.display = 'none';
            textInput.value = active.text;
            fontSelect.value = active.fontFamily;
            colorInput.value = active.fill;
            
            // Advanced Text States
            document.getElementById('prop-bold').style.background = active.fontWeight === 'bold' ? '#e2e8f0' : '';
            document.getElementById('prop-italic').style.background = active.fontStyle === 'italic' ? '#e2e8f0' : '';
            document.getElementById('prop-shadow').checked = !!active.shadow;
            document.getElementById('prop-outline').checked = active.stroke ? true : false;
        } else {
            textControls.style.display = 'none';
            imgControls.style.display = 'block';
            opacitySlider.value = active.opacity;
            
            // Image Filters
            document.getElementById('prop-filter-gray').checked = active.filters.some(f => f && f.type === 'Grayscale');
            document.getElementById('prop-filter-sepia').checked = active.filters.some(f => f && f.type === 'Sepia');
        }
    }

    // Prop Events
    textInput.addEventListener('input', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            active.set('text', e.target.value);
            canvas.renderAll();
        }
    });

    fontSelect.addEventListener('change', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            active.set('fontFamily', e.target.value);
            canvas.renderAll();
        }
    });

    colorInput.addEventListener('input', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            active.set('fill', e.target.value);
            canvas.renderAll();
        }
    });

    opacitySlider.addEventListener('input', (e) => {
        const active = canvas.getActiveObject();
        if (active) {
            active.set('opacity', parseFloat(e.target.value));
            canvas.renderAll();
        }
    });

    // Advanced Text
    document.getElementById('prop-bold').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            const isBold = active.fontWeight === 'bold';
            active.set('fontWeight', isBold ? 'normal' : 'bold');
            document.getElementById('prop-bold').style.background = isBold ? '' : '#e2e8f0';
            canvas.renderAll();
        }
    });

    document.getElementById('prop-italic').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            const isItalic = active.fontStyle === 'italic';
            active.set('fontStyle', isItalic ? 'normal' : 'italic');
            document.getElementById('prop-italic').style.background = isItalic ? '' : '#e2e8f0';
            canvas.renderAll();
        }
    });

    document.getElementById('prop-shadow').addEventListener('change', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            if (e.target.checked) {
                active.set('shadow', new fabric.Shadow({
                    color: 'rgba(0,0,0,0.5)', blur: 4, offsetX: 2, offsetY: 2
                }));
            } else {
                active.set('shadow', null);
            }
            canvas.renderAll();
        }
    });

    document.getElementById('prop-outline').addEventListener('change', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            if (e.target.checked) {
                active.set('stroke', '#000000');
                active.set('strokeWidth', 1);
            } else {
                active.set('stroke', null);
                active.set('strokeWidth', 0);
            }
            canvas.renderAll();
        }
    });

    // Image Filters
    document.getElementById('prop-filter-gray').addEventListener('change', (e) => {
        applyFilter(0, e.target.checked ? new fabric.Image.filters.Grayscale() : null);
    });

    document.getElementById('prop-filter-sepia').addEventListener('change', (e) => {
        applyFilter(1, e.target.checked ? new fabric.Image.filters.Sepia() : null);
    });

    function applyFilter(index, filter) {
        const active = canvas.getActiveObject();
        if (active && active.type === 'image') {
            active.filters[index] = filter;
            active.applyFilters();
            canvas.renderAll();
        }
    }

    // Layer Controls
    document.getElementById('prop-bring-front').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active) active.bringToFront();
    });

    document.getElementById('prop-send-back').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active) active.sendToBack();
    });
}

