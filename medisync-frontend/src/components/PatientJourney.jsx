function PatientJourney() {
    return (
        <section className="landing-journey-section">
            <div className="section-header">
                <h2>Healthcare that works around you</h2>
                <p>Follow three simple steps to start consulting with our certified medical professionals.</p>
            </div>

            <div className="journey-timeline">
                <div className="journey-step">
                    <div className="step-number-circle">01</div>
                    <h3>Create your account</h3>
                    <p>Create a secure patient account in seconds.</p>
                </div>

                <div className="journey-step">
                    <div className="step-number-circle">02</div>
                    <h3>Find your doctor</h3>
                    <p>Explore doctors based on specialization and availability.</p>
                </div>

                <div className="journey-step">
                    <div className="step-number-circle">03</div>
                    <h3>Book your appointment</h3>
                    <p>Choose an available slot and manage your appointments easily.</p>
                </div>
            </div>
        </section>
    );
}

export default PatientJourney;
