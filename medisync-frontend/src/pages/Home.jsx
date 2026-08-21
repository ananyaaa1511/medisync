import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import AISymptomSection from "../components/AISymptomSection";
import PatientJourney from "../components/PatientJourney";
import DoctorSection from "../components/DoctorSection";
import HowItWorks from "../components/HowItWorks";
import SecuritySection from "../components/SecuritySection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
    return (
        <div className="home-landing">
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <AISymptomSection />
            <PatientJourney />
            <DoctorSection />
            <HowItWorks />
            <SecuritySection />
            <CTASection />
            <Footer />
        </div>
    );
}

export default Home;
