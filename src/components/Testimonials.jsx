import customer1 from "../assets/customers/linda-carol-cakmak.jpg"
import customer2 from "../assets/customers/mert-tevetoglu.jpg"
import customer3 from "../assets/customers/murat-eren.jpg"
import customer4 from "../assets/customers/selin-arikan.jpg"


export default function Testimonials() {
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
                            <img className="avatar" src={customer1} alt="" />
                            <div className="q-copy">
                                <p className="q-text">
                                    Hem lezzetli hem doğal olması. Zararlı kimyasallardan uzak olması içimi rahatlatıyor.
                                </p>
                                <p className="q-name">— Selin Arıkan</p>
                            </div>
                        </article>

                        {/* 2 */}
                        <article className="quote-card">
                            <img className="avatar" src={customer2} alt="" />
                            <div className="q-copy">
                                <p className="q-text">
                                    Aslında çok zeytinyağı seven birisi değildim ama bu başka. Diğer yağları unuttum diyebilirim.
                                </p>
                                <p className="q-name">— Tayfun Eren</p>
                            </div>
                        </article>

                        {/* 3 */}
                        <article className="quote-card">
                            <img className="avatar" src={customer3} alt="" />
                            <div className="q-copy">
                                <p className="q-text">
                                    Bir arkadaşım tavsiye etti. Anlatıldığı kadar varmış. Çok sevdim.
                                </p>
                                <p className="q-name">— Linda Carol Çakmak</p>
                            </div>
                        </article>

                        {/* 4 */}
                        <article className="quote-card">
                            <img className="avatar" src={customer4} alt="" />
                            <div className="q-copy">
                                <p className="q-text">
                                    1 litreyle başladık. Artık depoluyoruz. Markettekilerle fark çok bariz.
                                </p>
                                <p className="q-name">— Mert Kaptanoğlu</p>
                            </div>
                        </article>
                    </div>
                </div>

                {/* Sağ: görsel ızgara */}
                <div className="gallery">
                    {/* 3 sütun kare ızgara – 12 görsel örneği */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div className="g-item" key={i}>
                            <img src={`/images/gallery/g${i + 1}.jpg`} alt="" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
