import { useNavigate } from "react-router-dom";
import { DOCUMENTS_VIEW_CONSTANTS } from "../../constants/constants";

const ButtonSubir = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/upload")} // Cambiado a /upload
      aria-label="Subir nuevo documento"
      className={`mt-4 md:mt-0 px-4 py-2 rounded-lg ${DOCUMENTS_VIEW_CONSTANTS.COLORS.BUTTON} flex items-center space-x-2 transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      <span>Subir Currículums</span>
    </button>
  );
};

export default ButtonSubir;