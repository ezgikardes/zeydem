// src/components/Testimonials.jsx
import customer1 from "../assets/customers/linda-carol-cakmak.jpg";
import customer2 from "../assets/customers/mert-tevetoglu.jpg";
import customer3 from "../assets/customers/murat-eren.jpg";
import customer4 from "../assets/customers/selin-arikan.jpg";

import g1 from "../assets/gallery/g1.jpg";
import g2 from "../assets/gallery/g2.jpeg";
import g3 from "../assets/gallery/g3.jpg";
import g4 from "../assets/gallery/g4.jpg";
import g5 from "../assets/gallery/g5.jpg";
import g6 from "../assets/gallery/g6.jpg";
import g7 from "../assets/gallery/g7.jpg";
import g8 from "../assets/gallery/g8.jpg";
import g9 from "../assets/gallery/g9.jpg";
import g10 from "../assets/gallery/g10.jpg";
import g11 from "../assets/gallery/g11.jpg";
import g12 from "../assets/gallery/g12.jpg";

export default function Testimonials() {
    const galleryImages = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12];

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container testimonials-wrap">
                {/* Sol: Başlık + yorumlar */}
                <div className="testi-left">
                    <p className="eyebrow">Deneyimler</p>
                    <h2 className="section-title">Bizi tercih edenler ne dedi?</h2>

                    <div className="testi-grid">
                        {/* 1 */}
                        <article className="quote-card">
                            <div className="q-avatar">
                                <img className="avatar" src={customer4} alt="Selin Arıkan" />
                            </div>
                            <div className="q-textwrap">
                                <p className="q-text">
                                    Hem lezzetli hem doğal olması. Zararlı kimyasallardan uzak olması içimi rahatlatıyor.
                                </p>
                            </div>
                            <div className="q-sign">— Selin Arıkan</div>
                        </article>

                        {/* 2 */}
                        <article className="quote-card">
                            <div className="q-avatar">
                                <img className="avatar" src={customer3} alt="Tayfun Eren" />
                            </div>
                            <div className="q-textwrap">
                                <p className="q-text">
                                    Aslında çok zeytinyağı seven birisi değildim ama bu başka. Diğerlerini unuttum diyebilirim.
                                </p>
                            </div>
                            <div className="q-sign">— Tayfun Eren</div>
                        </article>

                        {/* 3 */}
                        <article className="quote-card">
                            <div className="q-avatar">
                                <img className="avatar" src={customer1} alt="Linda Carol Çakmak" />
                            </div>
                            <div className="q-textwrap">
                                <p className="q-text">
                                    Bir arkadaşım tavsiye etti. Anlatıldığı kadar varmış. Çok sevdim.
                                </p>
                            </div>
                            <div className="q-sign">— Linda Carol Çakmak</div>
                        </article>

                        {/* 4 */}
                        <article className="quote-card">
                            <div className="q-avatar">
                                <img className="avatar" src={customer2} alt="Mert Kaptanoğlu" />
                            </div>
                            <div className="q-textwrap">
                                <p className="q-text">
                                    1 litreyle başladık. Artık depoluyoruz. Markettekilerle fark çok bariz.
                                </p>
                            </div>
                            <div className="q-sign">— Mert Kaptanoğlu</div>
                        </article>
                    </div>
                </div>

                {/* Sağ: görsel ızgara */}
                <div className="gallery">
                    {galleryImages.map((src, i) => (
                        <div className="g-item" key={i}>
                            <img src={src} alt={`gallery-${i + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
