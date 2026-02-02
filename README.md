# SnapPrint E-Commerce Website

A modern, Flipkart-inspired e-commerce website for custom printing services with a clean black and white theme.

## Features

### Design
- **Black & White Theme**: Minimal, elegant design using opacity-based grayscale
- **Responsive Layout**: Contained design (max-width: 1400px) for aesthetic appeal
- **Smooth Animations**: Fade-in, slide, and hover effects throughout
- **Adaptive Components**: Flexible widgets that adapt to content

### Components

#### 1. **Hero Slider** (`widgets/slidshowImage.js`)
- Auto-play carousel with pause on hover
- Adaptive width based on image aspect ratio
- Dot and arrow navigation
- Smooth transitions with caption overlays

#### 2. **Category Grid** (`widgets/category_unit.js`)
- Icon-based category cards
- Hover animations with scale and lift effects
- Product count display
- Fully customizable icons

#### 3. **Product Cards** (`widgets/productCard.js`)
- Multiple variants: default, curved-bottom, curved-all
- Wishlist functionality with localStorage
- Rating display with stars
- Discount percentage calculation
- Smooth image zoom on hover
- Heart animation on wishlist toggle

#### 4. **Special Cards** (`widgets/specialProductCards.js`)
- Promotional carousel cards
- Drag-to-scroll functionality
- Multiple layout options (horizontal, vertical, banner)
- Custom background gradients

### Sections

1. **Header**: Sticky navigation with search, wishlist, cart, and login
2. **Hero Slider**: Full-width promotional banners
3. **Category Grid**: Flipkart-style category exploration
4. **Featured Products**: Best deals section
5. **Special Offers**: Horizontal scrolling carousel
6. **Trending Products**: Curved-bottom variant cards
7. **Banner**: Promotional section with gradient background
8. **Most Loved**: Fully curved variant cards
9. **Footer**: Multi-column footer with links

## Usage

### Basic Setup
```html
<!-- Include in your HTML -->
<link rel="stylesheet" href="styles/homepage.css">
<script src="widgets/slidshowImage.js"></script>
<script src="widgets/category_unit.js"></script>
<script src="widgets/productCard.js"></script>
<script src="widgets/specialProductCards.js"></script>
<script src="scripts/homepage.js"></script>
```

### Creating a Product Card
```javascript
const card = createProductCard({
    title: 'Custom T-Shirt',
    description: 'Premium quality print',
    image: 'path/to/image.jpg',
    price: 499,
    originalPrice: 999,
    rating: 4.5,
    reviewCount: 234,
    badge: 'SALE',
    variant: 'curved-bottom', // or 'curved-all' or 'default'
    productId: 'unique-id'
});
```

### Creating a Category
```javascript
const category = createCategoryUnit({
    name: 'T-Shirts',
    icon: '👕',
    count: 150,
    link: '/category/tshirts'
});
```

### Initialize Slider
```javascript
new SlideshowWidget({
    containerId: 'hero-slider',
    slides: [
        {
            image: 'banner1.jpg',
            title: 'Custom Printing',
            description: 'Premium quality prints',
            buttonText: 'Shop Now',
            link: '/shop'
        }
    ],
    autoPlay: true,
    interval: 5000
});
```

## Customization

### Theme Colors
Edit CSS variables in `styles/homepage.css`:
```css
:root {
    --color-white: #FFFFFF;
    --color-black: #000000;
    --gray-900: #111111;
    /* ... more colors */
}
```

### Fonts
Primary font: **Inter** (weights: 400, 500, 600, 700)
- Headings: Inter 700
- Product titles: Inter 500
- Body text: Inter 400

### Product Categories
Located in `constants/products/` folders:
- 2DMobileCover
- childCostume
- cups
- facemask
- Hoodies
- KeyChain
- pendant
- slipperPrint
- stonePastings
- toteBags
- tshirts
- woodenFrame

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance
- Lazy loading for images
- CSS animations with GPU acceleration
- Smooth scrolling with `scroll-behavior: smooth`
- Optimized transitions using `cubic-bezier`

## Future Enhancements
- Product filtering and sorting
- User authentication
- Shopping cart functionality
- MySQL database integration
- Payment gateway integration
- Order tracking system

## Credits
- Design inspiration: Flipkart
- Icons: Custom SVG icons
- Fonts: Google Fonts (Inter)

---

**Built with ❤️ for SnapPrint Custom Printing Studio**
