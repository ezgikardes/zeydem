// src/components/TipsSection.jsx
import tips1 from "../assets/advices-section-images/close-up-woman-preparing-meal.jpg";
import tips2 from "../assets/advices-section-images/oliveoil-factory.jpg";
import tips3 from "../assets/advices-section-images/oliveoil-with-bread.jpg";

export default function Tips() {
    return (
        <section id="tips" className="timeline-section">
            <div className="container">
                <p className="eyebrow">UZMANINDAN NOTLAR</p>
                <h2 className="section-title">"İyi zeytinyağı" neden önemli? </h2>

                <ol className="timeline">
                    {/* 1 */}
                    <li className="t-item">
                        <div className="t-dot" aria-hidden="true" />
                        <div className="t-card">
                            <div className="t-media">
                                <img src={tips1} alt="Zeytinyağı döken kadın" />
                            </div>
                            <div className="t-body">
                                <h3 className="t-title">Zeytinyağıyla gelen sağlık</h3>
                                <p className="t-text">
                                    Zeytinyağı sağlıklı bir diyetin vazgeçilmezi. Gerçek natürel zeytinyağı sindirim ve kalp-damar sağlığını destekler, bağışıklık sistemini güçlendirir. Ama bu, ne yazık ki her zeytinyağını doğrudan sağlıklı yapmıyor.
                                </p>
                            </div>
                        </div>
                    </li>

                    {/* 2 */}
                    <li className="t-item">
                        <div className="t-dot" aria-hidden="true" />
                        <div className="t-card">
                            <div className="t-media">
                                <img src={tips2} alt="Endüstriyel üretim hattı" />
                            </div>
                            <div className="t-body">
                                <h3 className="t-title">İşlenmiş yağların farkı</h3>
                                <p className="t-text">
                                    Marketlerde bulduğumuz endüstriyel üretim yağlar genellikle yoğun kimyasal işlemlerden geçer. Bu tür yağların besin değeri oldukça düşüktür. Hele bir de yüksek sıcaklıkta işlem görmüşse, vitamin ve antioksidanlar neredeyse tamamen yok olur.
                                </p>
                            </div>
                        </div>
                    </li>

                    {/* 3 */}
                    <li className="t-item">
                        <div className="t-dot" aria-hidden="true" />
                        <div className="t-card">
                            <div className="t-media">
                                <img src={tips3} alt="Zeytinyağı tadımı" />
                            </div>
                            <div className="t-body">
                                <h3 className="t-title">Aromaya kulak verin</h3>
                                <p className="t-text">
                                    Peki gerçek natürel sızma zeytinyağını nasıl ayırt edebilirsiniz? Cevap çok
                                    basit: Tadı ve aromasıyla! İşlenmiş zeytinyağları neredeyse tatsızdır. Natürel
                                    sızma zeytinyağları ise yoğun ve meyvemsi bir tada sahiptir.
                                </p>
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
        </section>
    );
}
