import "./Home.css"
import campusImage from '../assets/campus.jpg';
function Home(){
    return(
        <>
        <section className="home">
            <div className="content" >
                <span className="tagline">OFFICIAL CAMPUS RESOURCE</span>
                <h1 className="title">Campus Issue Reporting System</h1>
                <p className="description">
                    Ensuring a safer and better campus environment. Report
                    maintenance issues, safety concerns, or administrative
                    hurdles instantly.
                </p>
                <div className="buttons">
                    <button className="btn-1"> <i class="fa-solid fa-triangle-exclamation"></i> Report an Issue</button>
                    <button className="btn-2"><i class="fa-solid fa-eye"></i> Track Reports</button>
                </div>
            </div>
            <div className="image">
                <img src={campusImage} alt="Campus" />
            </div>
        </section>
        </>
    );
}
export default Home;