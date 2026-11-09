-- Sample products, run at every startup.
-- The descriptions are placeholders until the real texts are written.
INSERT INTO products (id, slug, name, photo_url, price, amount, unit, description) VALUES
    (1, 'naturel-sizma-zeytinyagi-1l', 'Natürel Sızma Zeytinyağı', '/products/zeytinyagi-1l.png',
     450.00, 1, 'L',
     'Manisa''daki bahçemizin zeytinlerinden sıkılan natürel sızma zeytinyağı. 1 litrelik şişe, günlük kullanım için.'),
    (2, 'naturel-sizma-zeytinyagi-5l', 'Natürel Sızma Zeytinyağı', '/products/zeytinyagi-5l.png',
     1950.00, 5, 'L',
     'Manisa''daki bahçemizin zeytinlerinden sıkılan natürel sızma zeytinyağı. 5 litrelik ambalaj, bütün yıl yetecek kadar.'),
    (3, 'cig-badem-500g', 'Çiğ Badem', '/products/badem-500g.jpg',
     320.00, 500, 'g',
     'Bahçemizden toplanan, kavrulmamış ve tuzsuz çiğ badem. 500 gramlık paket.')
ON CONFLICT (id) DO NOTHING;
