import {Navbar} from "@/components/landing-page/Navbar";
import {Hero} from "@/components/landing-page/Hero";
import {Sponsors} from "@/components/landing-page/Sponsors";
import {About} from "@/components/landing-page/About";
import {HowItWorks} from "@/components/landing-page/HowItWorks";
import {Features} from "@/components/landing-page/Features";
import {Services} from "@/components/landing-page/Services";
import {Cta} from "@/components/landing-page/Cta";
import {Testimonials} from "@/components/landing-page/Testimonials";
import {Team} from "@/components/landing-page/Team";
import {Pricing} from "@/components/landing-page/Pricing";
import {Newsletter} from "@/components/landing-page/Newsletter";
import {FAQ} from "@/components/landing-page/FAQ";
import {Footer} from "@/components/landing-page/Footer";
import {ScrollToTop} from "@/components/landing-page/ScrollToTop";


export default function Home() {



      return (
        <div className={"w-full h-full overflow-x-hidden"}>
            <Navbar/>
            <div className={"mx-auto 2xl:max-w-7xl md:max-w-6xl px-4 sm:px-6 lg:px-8"}>
                <Hero/>
                <HowItWorks/>
                <Team/>
                <FAQ/>
                <Footer/>
                <ScrollToTop/>
            </div>
        </div>
    );
}
