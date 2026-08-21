import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleScrollToSection = (sectionId) => {
        setMenuOpen(false);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className={`landing-navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
            <div className="landing-navbar">
                <div onClick={() => navigate("/")} className="landing-navbar-brand">
                    <span className="landing-navbar-symbol">+</span>
                    <span>MediSync</span>
                </div>

                {/* Desktop Links */}
                <nav>
                    <ul className="landing-navbar-links">
                        <li><a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</a></li>
                        <li><a onClick={() => handleScrollToSection("features")}>Features</a></li>
                        <li><a onClick={() => handleScrollToSection("how-it-works")}>How It Works</a></li>
                        <li><a onClick={() => handleScrollToSection("doctors-section")}>For Doctors</a></li>
                        <li><a onClick={() => handleScrollToSection("about-section")}>About</a></li>
                    </ul>
                </nav>

                <div className="landing-navbar-actions">
                    <button onClick={() => navigate("/login")} className="btn-nav-login">
                        Login
                    </button>
                    <button onClick={() => navigate("/register")} className="btn-nav-register">
                        Get Started
                    </button>
                </div>

                {/* Hamburger button */}
                <button onClick={toggleMenu} className="hamburger-btn" aria-label="Toggle Navigation Menu">
                    {menuOpen ? "✕" : "☰"}
                </button>

                {/* Mobile Menu */}
                <div className={`mobile-navbar-menu ${menuOpen ? "open" : ""}`}>
                    <ul className="mobile-navbar-links">
                        <li><a onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Home</a></li>
                        <li><a onClick={() => handleScrollToSection("features")}>Features</a></li>
                        <li><a onClick={() => handleScrollToSection("how-it-works")}>How It Works</a></li>
                        <li><a onClick={() => handleScrollToSection("doctors-section")}>For Doctors</a></li>
                        <li><a onClick={() => handleScrollToSection("about-section")}>About</a></li>
                    </ul>
                    <div className="mobile-navbar-actions">
                        <button onClick={() => navigate("/login")} className="btn-nav-login">
                            Login
                        </button>
                        <button onClick={() => navigate("/register")} className="btn-nav-register">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
