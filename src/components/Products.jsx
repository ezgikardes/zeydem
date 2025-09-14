import img5L from "../assets/products/tinned-oliveoil.png";
import img1L from "../assets/products/bottled-oliveoil.png";

export default function Products() {
    return (
        <section id="products" className="products-section">
            <div className="container">
                <h2 className="section-title">Ürünlerimiz</h2>

                <div className="products-row">
                    {/* 5L */}
                    <article className="product-card">
                        <img src={img5L} alt="5 Litre Zeytinyağı" className="product-img" />
                        <h3 className="product-title">5 Litre Zeytinyağı</h3>
                        <p className="product-price">1600 TL</p>
                        <p className="product-note">Litre başı %20 tasarruf · Kargo ücretsiz</p>
                        <div className="product-actions">
                            <button className="btn">Sepete Ekle</button>
                            <button className="btn outline">Hemen Al</button>
                        </div>
                    </article>

                    {/* 1L */}
                    <article className="product-card">
                        <img src={img1L} alt="1 Litre Zeytinyağı" className="product-img" />
                        <h3 className="product-title">1 Litre Zeytinyağı</h3>
                        <p className="product-price">400 TL</p>
                        <p className="product-note">İlk kargo ücreti bizden</p>
                        <div className="product-actions">
                            <button className="btn">Sepete Ekle</button>
                            <button className="btn outline">Hemen Al</button>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
