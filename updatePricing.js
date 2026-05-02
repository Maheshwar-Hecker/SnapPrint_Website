const fs = require('fs');
const file = 'data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

data.categories.forEach(c => {
    if (!c.subcategories) return;
    c.subcategories.forEach(s => {
        if (!s.products) return;
        s.products.forEach(p => {
            if (!p.price) return;
            p.bulkPricing = [
                { min: 1, max: 5, price: p.price },
                { min: 6, max: 10, price: Math.round(p.price * 0.98) },
                { min: 11, max: 20, price: Math.round(p.price * 0.96) },
                { min: 21, max: 1000, price: Math.round(p.price * 0.94) }
            ];
        });
    });
});

fs.writeFileSync(file, JSON.stringify(data, null, 4));
console.log('Successfully updated JSON.');
