import local from "../assets/why-png-icons/local-sustainable.png"
import oliveLeaf from "../assets/why-png-icons/olive-leaf-colorful.png"
import qualityJug from "../assets/why-png-icons/quality-jug.png"
import transparentJug from "../assets/why-png-icons/transparent-jug.png"

function Features() {
    return (
        <section id="features">
            <div className="container">
                <p className="eyebrow">Kısaca Zeydem</p>
                <h2 className="section-title">Neden Zeydem natürel sızma zeytinyağı?</h2>

                <div className="features-grid">
                    <article className="feature">
                        <img className="feature-icon" alt="olive leaf" src={oliveLeaf} />
                        <div className="feature-body">
                            <h3 className="feature-title">Doğal</h3>
                            <p className="feature-text">
                                Ağaçlarımızda pestisid kullanmıyoruz. Yağımız kimyasal işlem görmüyor.
                                Geleneksel yöntemlere dayanıyoruz.
                            </p>
                        </div>
                    </article>

                    <article className="feature">
                        <img className="feature-icon" alt="quality jug" src={qualityJug} />
                        <div className="feature-body">
                            <h3 className="feature-title">Kaliteli</h3>
                            <p className="feature-text">
                                Zeytinyağımız ilk soğuk sıkım ve asit oranı %0,5'i geçmiyor.
                            </p>
                        </div>
                    </article>

                    <article className="feature">
                        <img className="feature-icon" alt="local" src={local} />
                        <div className="feature-body">
                            <h3 className="feature-title">Yerel</h3>
                            <p className="feature-text">
                                Yerelle bütünleşmiş bir aile çiftliğiyiz. Aracı ve market zincirleriyle çalışmıyoruz.
                            </p>
                        </div>
                    </article>

                    <article className="feature">
                        <img className="feature-icon" alt="transparant" src={transparentJug} />
                        <div className="feature-body">
                            <h3 className="feature-title">Şeffaf</h3>
                            <p className="feature-text">
                                Yağımızın tüm bilgileri sitede. Merak ettikleriniz için bize ulaşın.
                                Manisa'daki çiftliğimiz herkese açık.
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}

export default Features
