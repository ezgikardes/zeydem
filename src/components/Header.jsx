
import darkLogo from "../assets/logos/zeydem-logo.png"

function Header() {
    return (
        <header className="site-header">
            <div className="navbar">
                <a href="#" className="brand" aria-label="Zeydem Ana Sayfa">
                    <img alt="Zeydem" src={darkLogo} />
                </a>


                <nav className="nav" aria-label="Ana gezinme">
                    <a href="#zeytinyagi">Zeytinyağı</a>
                    <a href="#hakkimizda">Hakkımızda</a>
                    <a href="#iletisim">İletişim</a>
                    <a href="#satinal" className="btn nav-btn">Satın al</a>
                </nav>
            </div>
        </header>
    )
}

export default Header
