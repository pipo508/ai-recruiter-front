import React from 'react';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

const DetailCard = ({ details, onAccept }) => {
  const {
    message = 'Sin mensaje',
    processed = [],
    duplicates = [],
    needs_vision = [],
    failed = [],
  } = details;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 bg-black/70 border border-gray-700/50 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Resultado del Procesamiento
          </h3>
          <p className="text-sm text-gray-300">{message}</p>

          {/* Documentos Procesados */}
          {processed.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-400 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Procesados ({processed.length})
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-200">
                {processed.map((doc, index) => (
                  <li key={index}>{doc.filename || doc.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Documentos Duplicados */}
          {duplicates.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-yellow-400 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Duplicados ({duplicates.length})
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-200">
                {duplicates.map((doc, index) => (
                  <li key={index}>
                    {doc.filename}: {doc.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documentos que Requieren Vision */}
          {needs_vision.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-400 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Requieren Vision ({needs_vision.length})
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-200">
                {needs_vision.map((doc, index) => (
                  <li key={index}>
                    {doc.filename}: {doc.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documentos Fallidos */}
          {failed.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Fallidos ({failed.length})
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-200">
                {failed.map((doc, index) => (
                  <li key={index}>
                    {doc.filename}: {doc.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botón Aceptar */}
          <div className="flex justify-end">
            <button
              onClick={onAccept}
              className="py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition duration-300"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Añadimos el CSS directamente al componente para la animación
const AddAnimationStyles = () => {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-fade-in {
        animation: fade-in 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
};

// Componente envoltorio que incluye los estilos
const DetailCardWithAnimation = (props) => {
  return (
    <>
      <AddAnimationStyles />
      <DetailCard {...props} />
    </>
  );
};

export default DetailCardWithAnimation;