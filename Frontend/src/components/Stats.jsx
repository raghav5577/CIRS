import './Stats.css';

function Stats(){

    const stats = [
        { icon: 'fa-solid fa-circle-check', value: '1,200+', label: 'Issues Resolved' },
        { icon: 'fa-solid fa-pen-to-square', value: '24h', label: 'Average Response' },
        { icon: 'fa-solid fa-shield-halved', value: '100%', label: 'Encrypted & Secure' }
    ]

    return(
        <>
        <section className="stats">
            {stats.map((stat,index)=>(
                <div className="stat-card" key={index}>
                    <div className="stat-icon">
                        <i className={stat.icon}></i>
                    </div>
                    <h3 className="stat-value">{stat.value}</h3>
                    <p className="stat-label">{stat.label}</p>
                </div>
            ))}
        </section>
        </>
    );
}
export default Stats;
