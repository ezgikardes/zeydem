import Features from "../components/Features"
import Hero from "../components/Hero"
import Products from "../components/Products"
import Testimonials from "../components/Testimonials"
import Tips from "../components/Tips"

function Home() {
    return (
        <div>
            <Hero />
            <Features />
            <Tips />
            <Products />
            <Testimonials />
        </div>
    )
}

export default Home
