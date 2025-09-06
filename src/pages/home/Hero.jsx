import hero from "../../assets/hero-images/hero.png"

function Hero() {
    return (
        <section className="hero" id="zeytinyagi">
            <div className="container hero-grid">
                {/* Sol sütun: metin */}
                <div>
                    <h1>
                        Doğal Zeytinyağı, <br /> Özgün Tat. <br /> Doğrudan Çiftliğimizden.
                    </h1>
                    <p className="lead">
                        Düşük asitli ve soğuk sıkım gerçek natürel sızma zeytinyağı. Manisa’daki aile
                        çiftliğimizden taptaze ve doğal haliyle kapınızda.
                    </p>


                    <div className="hero-actions">
                        <a href="#satinal" className="btn">Hemen al</a>
                        <a href="#hakkimizda" className="btn outline">Daha fazla bilgi</a>
                    </div>
                </div>


                {/* Sağ sütun: görsel yerleşimi */}
                <div>
                    <div className="img-large">
                        <img src={hero} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
