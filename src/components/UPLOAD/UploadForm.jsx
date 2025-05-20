import React, { useRef, useState } from 'react';
import { PDF_PROCESSOR_CONSTANTS as CONSTANTS } from '../../constants/constants';
import { UploadCloud, FileText, XCircle, Download } from 'lucide-react';
import { processPDFs, processWithVision, skipVisionProcessing } from '../../services/api';
import DetailCard from './DetailCard';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../Spinner';

const UploadForm = () => {
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visionDocuments, setVisionDocuments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [confirmationAlerts, setConfirmationAlerts] = useState([]);
  const [processResult, setProcessResult] = useState(null);
  const [processingVisionDocs, setProcessingVisionDocs] = useState({});

  const addAlert = (message, type = 'info') => {
    const id = Date.now();
    setAlerts(current => [...current, { id, message, type }]);
    setTimeout(() => setAlerts(current => current.filter(a => a.id !== id)), 5000);
  };

  const removeAlert = id => setAlerts(current => current.filter(a => a.id !== id));

  const addConfirmationAlert = (message, type, docId) => {
    const id = Date.now();
    setConfirmationAlerts(current => [...current, { id, message, type, docId }]);
  };

  const removeConfirmationAlert = (id, docId) => {
    setConfirmationAlerts(current => current.filter(a => a.id !== id));
    setVisionDocuments(current => current.filter(d => d.temp_path_id !== docId));
  };

  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
      handleFiles(files);
    }
  };

  const handleFileChange = e => {
    if (e.target.files.length) {
      const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      handleFiles(files);
    }
  };

  const handleFiles = files => {
    setSelectedFiles(prev => {
      const newFiles = files.filter(
        newFile => !prev.some(existingFile => existingFile.name === newFile.name)
      );
      if (newFiles.length < files.length) {
        addAlert('Algunos archivos ya están seleccionados y fueron omitidos.', 'warning');
      }
      const updatedFiles = [...prev, ...newFiles];
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        updatedFiles.forEach(f => dt.items.add(f));
        fileInputRef.current.files = dt.files;
      }
      return updatedFiles;
    });
  };

  const removeFile = index => {
    setSelectedFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        updated.forEach(f => dt.items.add(f));
        fileInputRef.current.files = dt.files;
      }
      return updated;
    });
  };

  // Download PDF
  const handleDownloadPDF = async filename => {
    if (!user || !token) {
      addAlert('Debes iniciar sesión para descargar el documento.', 'error');
      return;
    }
    try {
      const url = `/get-pdf?user_id=${user.id}&filename=${encodeURIComponent(filename)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      const blob = await res.blob();
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlBlob);
      addAlert(`Descarga de '${filename}' completada.`, 'success');
    } catch (e) {
      addAlert(`Error: ${e.message}`, 'error');
    }
  };

  // Vision
  const handleVisionProcessing = async doc => {
    if (!user || !token) {
      addAlert('Debes iniciar sesión para procesar con Vision.', 'error');
      return;
    }
    setProcessingVisionDocs(prev => ({ ...prev, [doc.temp_path_id]: true }));
    try {
      await processWithVision(user.id, doc.temp_path_id, token);
      addConfirmationAlert(`Documento '${doc.filename}' procesado con Vision.`, 'success', doc.temp_path_id);
    } catch (e) {
      addConfirmationAlert(`Error al procesar '${doc.filename}': ${e.message}`, 'error', doc.temp_path_id);
    } finally {
      setProcessingVisionDocs(prev => ({ ...prev, [doc.temp_path_id]: false }));
    }
  };

  const handleSkipVision = async doc => {
    if (!user || !token) {
      addAlert('Debes iniciar sesión.', 'error');
      return;
    }
    setProcessingVisionDocs(prev => ({ ...prev, [doc.temp_path_id]: true }));
    try {
      await skipVisionProcessing(doc.temp_path_id, token);
      addConfirmationAlert(`Documento '${doc.filename}' descartado.`, 'info', doc.temp_path_id);
    } catch (e) {
      addConfirmationAlert(`Error al descartar '${doc.filename}': ${e.message}`, 'error', doc.temp_path_id);
    } finally {
      setProcessingVisionDocs(prev => ({ ...prev, [doc.temp_path_id]: false }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user || !token) {
      addAlert('Debes iniciar sesión para procesar documentos.', 'error');
      return;
    }
    if (!fileInputRef.current.files.length) {
      addAlert('Selecciona al menos un PDF.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const resp = await processPDFs(user.id, Array.from(fileInputRef.current.files), token);
      setProcessResult(resp);

      // Procesar archivos exitosos (status 200)
      if (resp.processed?.length) {
        const successfulFiles = resp.processed
          .filter(result => result.status === 200)
          .map(result => result.filename);
        
        if (successfulFiles.length > 0) {
          addAlert(
            `Procesados con éxito: ${successfulFiles.join(', ')}`,
            'success'
          );
          
          // Filtrar los archivos exitosos de selectedFiles
          setSelectedFiles(prev => {
            const updatedFiles = prev.filter(
              file => !successfulFiles.includes(file.name)
            );
            
            // Actualizar fileInputRef
            if (fileInputRef.current) {
              const dt = new DataTransfer();
              updatedFiles.forEach(f => dt.items.add(f));
              fileInputRef.current.files = dt.files;
            }
            
            return updatedFiles;
          });
        }
      }

      // Manejar documentos que necesitan Vision
      if (resp.needs_vision?.length) {
        setVisionDocuments(resp.needs_vision);
      }
    } catch (e) {
      addAlert(`Error: ${e.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = b => {
    if (b < 1024) return `${b} bytes`;
    if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-16 bg-transparent">
      <div className="w-full max-w-lg relative z-10">
        {confirmationAlerts.map(a => (
          <ConfirmationAlert
            key={a.id}
            type={a.type}
            message={a.message}
            onConfirm={() => removeConfirmationAlert(a.id, a.docId)}
          />
        ))}
        {alerts.map(a => (
          <Alert key={a.id} type={a.type} message={a.message} onClose={() => removeAlert(a.id)} />
        ))}
        {processResult && <DetailCard details={processResult} onAccept={() => setProcessResult(null)} />}
        <div className="backdrop-blur-xl bg-black/30 border border-gray-700/50 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
          <h2 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {CONSTANTS.LABELS.TITLE}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm font-medium text-gray-300">{CONSTANTS.LABELS.PDF_FILES}</label>
            <div
              className={`relative border-2 border-dashed rounded-xl h-36 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
                dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-800/40 hover:border-gray-500 hover:bg-gray-800/60'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
              />
              <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-300 text-center px-4">Arrastra o haz clic para seleccionar PDFs</p>
              <p className="text-xs text-gray-400 mt-1">Solo archivos PDF</p>
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 customScrollbar">
                {selectedFiles.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between rounded-lg bg-gray-800/60 p-3 border border-gray-700/30"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-blue-400" />
                      <div className="truncate max-w-[200px]">
                        <p className="text-sm text-gray-200 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF(file.name)}
                        className="text-gray-400 hover:text-green-400 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !selectedFiles.length || !user}
              className={`w-full py-3.5 px-6 text-white font-medium rounded-xl flex items-center justify-center space-x-2 ${
                isSubmitting ? 'bg-blue-600/70 cursor-not-allowed' : `${CONSTANTS.COLORS.PRIMARY} hover:shadow-lg hover:shadow-blue-500/20`
              } ${(!selectedFiles.length || !user) && 'opacity-60 cursor-not-allowed'}`}
            >
              {isSubmitting ? (
                <>
                  <Spinner size={20} color="white" />
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
              {visionDocuments.map((doc, i) => (
                <div
                  key={`${doc.filename}-${i}`}
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
                    {processingVisionDocs[doc.temp_path_id] ? (
                      <div className="flex items-center space-x-2 text-sm text-blue-400">
                        <Spinner size={16} />
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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

const ConfirmationAlert = ({ type, message, onConfirm }) => {
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
  const btnColor = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
  };
  return (
    <div className={`${bgColor[type]} border p-4 rounded-lg mb-4 flex flex-col`}>
      <p className={`${textColor[type]} text-sm font-medium`}>{message}</p>
      <div className="flex justify-end mt-2">
        <button
          onClick={onConfirm}
          className={`${btnColor[type]} text-white text-sm px-4 py-1.5 rounded-md`}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

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