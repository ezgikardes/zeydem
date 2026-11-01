import Features from "./Features"
import Hero from "./Hero"
import Products from "./Products"
import Testimonials from "./Testimonials"
import Tips from "./Tips"

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
