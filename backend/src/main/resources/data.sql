-- Sample products, run at every startup.
INSERT INTO products (id, name, photo_url, price, amount, unit) VALUES
    (1, 'Natürel Sızma Zeytinyağı', '/products/zeytinyagi-1l.png', 450.00, 1, 'L'),
    (2, 'Natürel Sızma Zeytinyağı', '/products/zeytinyagi-5l.png', 1950.00, 5, 'L'),
    (3, 'Çiğ Badem', '/products/badem-500g.jpg', 320.00, 500, 'g')
ON CONFLICT (id) DO NOTHING;
