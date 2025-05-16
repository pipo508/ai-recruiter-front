import React, { useRef, useState } from 'react';
import { PDF_PROCESSOR_CONSTANTS as CONSTANTS } from '../../constants/constants';
import { UploadCloud, FileText, XCircle } from 'lucide-react';
import { processPDFs, processWithVision, skipVisionProcessing } from '../../services/api';
import DetailCard from './DetailCard';

const UploadForm = () => {
  const userIdRef = useRef(null);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visionDocuments, setVisionDocuments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  // Estado para el modal de resultados
  const [processResult, setProcessResult] = useState(null);

  const addAlert = (message, type = 'info') => {
    const id = Date.now(); // ID único para cada alerta
    setAlerts([...alerts, { id, message, type }]);
    // Autoeliminar después de 5 segundos
    setTimeout(() => {
      setAlerts((current) => current.filter((alert) => alert.id !== id));
    }, 5000);
  };

  const removeAlert = (id) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === 'application/pdf'
      );
      handleFiles(files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    setSelectedFiles(files);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = userIdRef.current.value;
    const files = fileInputRef.current.files;

    if (files.length === 0) {
      addAlert('Por favor, selecciona al menos un archivo PDF.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await processPDFs(userId, Array.from(files));

      // Mostrar resultado en el modal
      setProcessResult(response);

      // Guardar documentos que necesitan Vision
      if (response.needs_vision && response.needs_vision.length > 0) {
        setVisionDocuments(response.needs_vision);
      } else {
        // Limpiar formulario si no hay documentos pendientes y el usuario cierra el modal
        // (Esto se hará en handleCloseModal)
      }
    } catch (error) {
      addAlert(`Error: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    // Si no hay documentos que necesiten Vision, limpiar el formulario
    if (!visionDocuments.length) {
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    setProcessResult(null);
  };

  const handleVisionProcessing = async (doc) => {
    const userId = userIdRef.current.value;
    try {
      const response = await processWithVision(userId, doc.temp_path_id);
      addAlert(response.message, 'success');
      // Remover documento procesado
      setVisionDocuments(visionDocuments.filter(d => d.temp_path_id !== doc.temp_path_id));
    } catch (error) {
      addAlert(`Error al procesar con Vision: ${error.message}`, 'error');
    }
  };

  const handleSkipVision = async (doc) => {
    try {
      const response = await skipVisionProcessing(doc.temp_path_id);
      addAlert(response.message, 'success');
      // Remover documento descartado
      setVisionDocuments(visionDocuments.filter(d => d.temp_path_id !== doc.temp_path_id));
    } catch (error) {
      addAlert(`Error al descartar: ${error.message}`, 'error');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-16 bg-transparent">
      <div className="w-full max-w-lg relative z-10">
        {/* Mostrar alertas */}
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}

        {/* Modal de resultados */}
        {processResult && (
          <DetailCard
            details={processResult}
            onAccept={handleCloseModal}
          />
        )}

        <div className="backdrop-blur-xl bg-black/30 border border-gray-700/50 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {CONSTANTS.LABELS.TITLE}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="userId" className="block text-sm font-medium text-gray-300">
                  {CONSTANTS.LABELS.USER_ID}
                </label>
                <input
                  type="text"
                  id="userId"
                  ref={userIdRef}
                  name="user_id"
                  placeholder={CONSTANTS.PLACEHOLDERS.USER_ID}
                  className="w-full px-4 py-3 bg-gray-800/60 text-white placeholder-gray-400 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  {CONSTANTS.LABELS.PDF_FILES}
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl h-36 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800/40 hover:bg-gray-800/60'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    id="pdfFiles"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    name="files[]"
                    multiple
                    accept=".pdf"
                    required
                  />
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-300 text-center px-4">
                    Arrastra y suelta PDFs aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Solo archivos PDF</p>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 customScrollbar">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-lg bg-gray-800/60 p-3 border border-gray-700/30"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-blue-400" />
                        <div className="truncate max-w-[200px]">
                          <p className="text-sm text-gray-200 truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || selectedFiles.length === 0}
                className={`w-full py-3.5 px-6 text-white font-medium rounded-xl transition duration-300 flex items-center justify-center space-x-2
                ${isSubmitting ? 'bg-blue-600/70 cursor-not-allowed' : `${CONSTANTS.COLORS.PRIMARY} hover:shadow-lg hover:shadow-blue-500/20`}
                ${selectedFiles.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    <span>{CONSTANTS.LABELS.SUBMIT}</span>
                  </>
                )}
              </button>
            </form>

            {visionDocuments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Documentos que requieren procesamiento con Vision
                </h3>
                {visionDocuments.map((doc, index) => (
                  <div
                    key={`${doc.filename}-${index}`}
                    className="flex items-center justify-between rounded-lg bg-gray-800/60 p-3 border border-gray-700/30 mb-2"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-yellow-400" />
                      <div>
                        <p className="text-sm text-gray-200">{doc.filename}</p>
                        <p className="text-xs text-gray-400">{doc.reason}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleVisionProcessing(doc)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Procesar con Vision
                      </button>
                      <button
                        onClick={() => handleSkipVision(doc)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          Procesador de PDFs v2.0 · Protección de datos garantizada
        </p>
      </div>

      <style jsx>{`
        .customScrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .customScrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.2);
          border-radius: 10px;
        }
        .customScrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 10px;
        }
        .customScrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8);
        }
      `}</style>
    </div>
  );
};

// Componente de alerta pequeña para mensajes breves
const Alert = ({ type, message, onClose }) => {
  const bgColor = {
    success: 'bg-green-500/20 border-green-500/50',
    error: 'bg-red-500/20 border-red-500/50',
    info: 'bg-blue-500/20 border-blue-500/50',
    warning: 'bg-yellow-500/20 border-yellow-500/50',
  };

  const textColor = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400',
  };

  return (
    <div className={`${bgColor[type]} ${textColor[type]} border p-3 rounded-lg mb-4 flex justify-between items-center`}>
      <p className="text-sm">{message}</p>
      <XCircle className="w-5 h-5 cursor-pointer hover:opacity-70" onClick={onClose} />
    </div>
  );
};

export default UploadForm;