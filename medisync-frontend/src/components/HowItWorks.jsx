function HowItWorks() {
    const steps = [
        {
            num: "01",
            title: "Create an account",
            desc: "Register securely as a patient or doctor and set up your profile details."
        },
        {
            num: "02",
            title: "Find a doctor",
            desc: "Search through certified specialists by filters, ratings, and fields."
        },
        {
            num: "03",
            title: "Choose a slot",
            desc: "Pick an available date and time slot that perfectly suits your schedule."
        },
        {
            num: "04",
            title: "Manage your healthcare",
            desc: "Keep track of active appointments, symptom reports, and schedules."
        }
    ];

    return (
        <section id="how-it-works" className="landing-how-section">
            <div className="section-header">
                <h2>How MediSync works</h2>
                <p>Learn how our digital healthcare platform bridges patient concerns with professional medical consultations.</p>
            </div>

            <div className="how-grid">
                {steps.map((step, idx) => (
                    <div key={idx} className="how-card">
                        <span className="how-number">{step.num}</span>
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HowItWorks;
