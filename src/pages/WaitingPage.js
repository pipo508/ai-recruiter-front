import Backgroundwait from "../components/WAITING/Backgroundwait";
import Navbar from "../components/Navbar";
import MainContent from "../components/WAITING/MainContent";

const WaitingPage = () => {
  return (
    <div className="relative w-full h-screen bg-black text-white">
      <Backgroundwait />
      <Navbar />
      <MainContent />
    </div>
  );
};

export default WaitingPage;