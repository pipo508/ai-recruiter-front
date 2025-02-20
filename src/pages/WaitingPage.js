
import Backgroundwait from "../components/WAITING/Backgroundwait";
import Navbar from "../components/Navbar";
import MainContent from "../components/WAITING/MainContent";


const WaitingPage = () => {
    return <div className="relative min-h-screen bg-primary">
        
        <Backgroundwait />
        <Navbar />
        <MainContent />
            </div>
  };
  
  export default WaitingPage;
  