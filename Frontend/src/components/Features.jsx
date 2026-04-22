import './Features.css';

function Features(){
    const features =[
        {
            icon: 'fa-solid fa-file-lines',
            title: 'Easy Reporting',
            description: 'Submit issues in seconds with our streamlined interface designed for quick input.',
        },
        {
        icon: 'fa-solid fa-location-crosshairs',
        title: 'Live Tracking',
        description: "Follow your report's status in real-time with automated notifications and progress bars.",
        },
        {
        icon: 'fa-solid fa-bolt',
        title: 'Quick Resolution',
        description: 'Automated routing ensures your request reaches the right maintenance or admin team immediately.',
        },
        {
        icon: 'fa-solid fa-shield-halved',
        title: 'Secure & Transparent',
        description: 'Role-based access controls and full issue history keep everything secure and accountable.',
        }
    ]

    return(
        <>
        <section className="features">
            <h2 className="features-title">Platform Features</h2>
            <p className="features-subtitle">
                Everything you need to report and track campus issues efficiently in one place.
            </p>
            <div className="features-grid">
                {features.map((feature, index) => (
                <div className="feature-card" key={index}>
                    <div className="feature-icon">
                        <i className={feature.icon}></i>
                    </div>
                    <h3 className="feature-name">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                </div>
        ))}
            </div>
    </section>
    </>
  );
}
export default Features;
