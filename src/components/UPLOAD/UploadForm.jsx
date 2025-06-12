import React, { useRef, useState } from 'react';
import { PDF_PROCESSOR_CONSTANTS as CONSTANTS } from '../../constants/constants';
import { UploadCloud} from 'lucide-react';
import { processPDFs, processWithVision, skipVisionProcessing } from '../../services/api';
import DetailCard from './DetailCard';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../Spinner';
import FileUploadZone from './file_upload_zone';
import FileList from './file_list';
import VisionDocumentsList from './vision_documents_list';
import Alert from './alert_component';
import ConfirmationAlert from './confirmation_alert';

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

      if (resp.processed?.length) {
        const successfulFiles = resp.processed
          .filter(result => result.status === 200)
          .map(result => result.filename);
        
        if (successfulFiles.length > 0) {
          addAlert(
            `Procesados con éxito: ${successfulFiles.join(', ')}`,
            'success'
          );
          
          setSelectedFiles(prev => {
            const updatedFiles = prev.filter(
              file => !successfulFiles.includes(file.name)
            );
            
            if (fileInputRef.current) {
              const dt = new DataTransfer();
              updatedFiles.forEach(f => dt.items.add(f));
              fileInputRef.current.files = dt.files;
            }
            
            return updatedFiles;
          });
        }
      }

      if (resp.needs_vision?.length) {
        setVisionDocuments(resp.needs_vision);
      }
    } catch (e) {
      addAlert(`Error: ${e.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-16 bg-transparent">
      <div className="w-full max-w-2xl relative z-10">
        {/* Alerts */}
        <div className="space-y-3 mb-6">
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
        </div>

        {/* Process Result Detail */}
        {processResult && (
          <div className="mb-6">
            <DetailCard details={processResult} onAccept={() => setProcessResult(null)} />
          </div>
        )}

        {/* Main Form Card */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 border border-gray-700/30 shadow-2xl rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <div className="text-center mb-2">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
                {CONSTANTS.LABELS.TITLE}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-3 rounded-full"></div>
            </div>
            <p className="text-gray-400 text-center text-sm mt-4">
              Sube tus documentos PDF para procesamiento inteligente
            </p>
          </div>

          {/* Form Content */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload Zone */}
              <FileUploadZone
                dragActive={dragActive}
                onDrag={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              />
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
              />

              {/* File List */}
              {selectedFiles.length > 0 && (
                <FileList
                  files={selectedFiles}
                  onRemove={removeFile}
                  onDownload={handleDownloadPDF}
                />
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedFiles.length || !user}
                className={`
                  w-full py-4 px-6 text-white font-semibold rounded-xl 
                  flex items-center justify-center space-x-3 
                  transition-all duration-300 transform
                  ${isSubmitting 
                    ? 'bg-gradient-to-r from-blue-500/70 to-purple-500/70 cursor-not-allowed scale-[0.98]' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25'
                  }
                  ${(!selectedFiles.length || !user) && 'opacity-60 cursor-not-allowed hover:scale-100'}
                `}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size={20} color="white" />
                    <span>Procesando documentos...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    <span>{CONSTANTS.LABELS.SUBMIT}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Vision Documents */}
        {visionDocuments.length > 0 && (
          <div className="mt-6">
            <VisionDocumentsList
              documents={visionDocuments}
              processingDocs={processingVisionDocs}
              onProcessVision={handleVisionProcessing}
              onSkipVision={handleSkipVision}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            Procesador de PDFs v2.0 · Protección de datos garantizada
          </p>
          <div className="flex justify-center items-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Sistema activo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;