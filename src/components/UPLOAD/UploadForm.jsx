import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PDF_PROCESSOR_CONSTANTS as CONSTANTS } from '../../constants/constants';
import { UploadCloud} from 'lucide-react';
import DetailCard from './DetailCard';
import { useAuth } from '../../context/AuthContext';
import { useUpload } from '../../context/UploadContext';
import { Spinner } from '../Spinner';
import FileUploadZone from './file_upload_zone';
import FileList from './file_list';
import VisionDocumentsList from './vision_documents_list';
import Alert from './alert_component';
import UploadProgress from './UploadProgress';
import AIToggle from './AIToggle'; // Importar el componente AIToggle
import { processWithVision, skipVisionProcessing } from '../../services/api';

const UploadForm = () => {
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showDetailCard, setShowDetailCard] = useState(false);

  const { 
    // Estados principales
    uploadQueue, 
    isUploading, 
    uploadResults, 
    progress,
    
    // Estados de Vision
    visionDocuments,
    processingVisionDocs,
    hasVisionDocuments,
    
    // Estado de AI
    aiEnabled,
    
    // Acciones principales
    addFilesToQueue, 
    removeFileFromQueue, 
    startUpload, 
    clearResults,
    
    // Acciones de AI
    setAIEnabled,
    
    // Acciones de Vision
    removeVisionDocument,
    setVisionProcessing,
    clearAllResults
  } = useUpload();

  const addAlert = useCallback((message, type = 'info', details = null) => {
    const id = Date.now();
    const alert = { id, message, type };
    
    if (details) {
      alert.details = details;
    }
    
    setAlerts(current => [...current, alert]);
    
    // Auto-remove alert after 7 seconds for errors, 5 seconds for others
    const timeout = type === 'error' ? 7000 : 5000;
    setTimeout(() => setAlerts(current => current.filter(a => a.id !== id)), timeout);
  }, []);
  
  const removeAlert = id => setAlerts(current => current.filter(a => a.id !== id));

  const handleUploadError = useCallback((error, filename = null) => {
    console.error('Upload error details:', {
      message: error.message,
      status: error.status,
      originalError: error.originalError,
      filename
    });

    let alertMessage = error.message;
    let alertType = 'error';

    if (error.status === 409) {
      alertMessage = filename 
        ? `El archivo "${filename}" ya existe en tu biblioteca`
        : 'Algunos archivos ya existen en tu biblioteca';
      alertType = 'warning';
    } else if (error.status === 400 && error.originalError?.includes('EOF marker not found')) {
      alertMessage = filename 
        ? `El archivo "${filename}" está corrupto o no es un PDF válido`
        : 'Uno o más archivos están corruptos o no son PDFs válidos';
    } else if (error.status === 401) {
      alertMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente';
    } else if (error.status === 413) {
      alertMessage = filename 
        ? `El archivo "${filename}" es demasiado grande`
        : 'Uno o más archivos son demasiado grandes';
    } else if (error.status === 422) {
      alertMessage = 'Los archivos no tienen el formato correcto. Solo se permiten archivos PDF válidos';
    }

    addAlert(alertMessage, alertType, {
      status: error.status,
      originalError: error.originalError,
      filename
    });
  }, [addAlert]);

  const handleAcceptDetailCard = () => {
    setShowDetailCard(false);
    if (!hasVisionDocuments) {
      clearResults();
    }
  };

  const handleClearAllResults = () => {
    setShowDetailCard(false);
    clearAllResults();
  };

  const handleVisionProcessing = async (doc) => {
    if (!user || !token) {
      addAlert('Debes iniciar sesión para procesar con Vision.', 'error');
      return;
    }
    
    setVisionProcessing(doc.temp_path_id, true);
    
    try {
      await processWithVision(user.id, doc.temp_path_id, token);
      addAlert(`Documento '${doc.filename}' enviado a procesamiento con Vision.`, 'success');
      removeVisionDocument(doc.temp_path_id);
    } catch (error) {
      handleUploadError(error, doc.filename);
    } finally {
      setVisionProcessing(doc.temp_path_id, false);
    }
  };

  const handleSkipVision = async (doc) => {
    if (!user || !token) {
      addAlert('Debes iniciar sesión.', 'error');
      return;
    }
    
    setVisionProcessing(doc.temp_path_id, true);
    
    try {
      await skipVisionProcessing(doc.temp_path_id, token);
      addAlert(`Documento '${doc.filename}' descartado.`, 'info');
      removeVisionDocument(doc.temp_path_id);
    } catch (error) {
      handleUploadError(error, doc.filename);
    } finally {
      setVisionProcessing(doc.temp_path_id, false);
    }
  };

  // Manejar el toggle de AI
  const handleAIToggle = (enabled) => {
    setAIEnabled(enabled);

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
    if (e.dataTransfer.files?.length) { 
      handleFiles(Array.from(e.dataTransfer.files)); 
    } 
  };
  
  const handleFileChange = e => { 
    if (e.target.files?.length) { 
      handleFiles(Array.from(e.target.files)); 
    } 
  };
  
  const handleFiles = files => {
    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.type === 'application/pdf') {
        if (file.size > 10 * 1024 * 1024) {
          addAlert(`El archivo "${file.name}" es demasiado grande (máximo 10MB)`, 'warning');
        } else {
          validFiles.push(file);
        }
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      const fileList = invalidFiles.length > 3 
        ? `${invalidFiles.slice(0, 3).join(', ')} y ${invalidFiles.length - 3} más`
        : invalidFiles.join(', ');
      addAlert(`Los siguientes archivos no son PDFs válidos: ${fileList}`, 'warning');
    }
    
    if (validFiles.length > 0) { 
      addFilesToQueue(validFiles); 
      addAlert(`Se agregaron ${validFiles.length} archivo(s) a la cola de procesamiento`, 'success');
    }
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!user) {
      addAlert('Debes iniciar sesión para procesar documentos.', 'error');
      return;
    }
    
    if (!uploadQueue.length) { 
      addAlert('Añade al menos un PDF a la cola de subida.', 'warning'); 
      return; 
    }
    
    try {
      await startUpload();
    } catch (error) {
      handleUploadError(error);
    }
  };
  
  useEffect(() => {
    if (!uploadResults) return;
    
    const { processed = [], errors = [], needs_vision = [] } = uploadResults;
    
    if (processed.length > 0 || errors.length > 0) {
      setShowDetailCard(true);
    }
    
    if (processed.length > 0) { 
      const message = processed.length === 1 
        ? `Se procesó el documento "${processed[0].filename}" con éxito`
        : `Se procesaron ${processed.length} documentos con éxito`;
      addAlert(message, 'success'); 
    }
    
    if (errors.length > 0) {
      errors.forEach(err => {
        const errorObj = {
          message: err.reason || 'Error desconocido',
          originalError: err.reason,
          status: err.status || 400
        };
        handleUploadError(errorObj, err.filename);
      });
    }

    if (needs_vision.length > 0) {
      const message = needs_vision.length === 1
        ? `El documento "${needs_vision[0].filename}" requiere procesamiento adicional con Vision`
        : `${needs_vision.length} documentos requieren procesamiento adicional con Vision`;
      addAlert(message, 'info');
    }
  }, [uploadResults, handleUploadError, addAlert]);

  useEffect(() => {
    if (!hasVisionDocuments && !showDetailCard && uploadResults) {
      clearResults();
    }
  }, [hasVisionDocuments, showDetailCard, uploadResults, clearResults]);

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-16 bg-transparent">
      <div className="w-full max-w-2xl relative z-10">
        <div className="space-y-3 mb-6">
          {alerts.map(a => (
            <Alert 
              key={a.id} 
              type={a.type} 
              message={a.message} 
              onClose={() => removeAlert(a.id)}
              details={a.details}
            />
          ))}
        </div>
        
        {!isUploading && showDetailCard && uploadResults && (
          <div className="mb-6">
            <DetailCard details={uploadResults} onAccept={handleAcceptDetailCard} />
          </div>
        )}
        
        <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 border border-gray-700/30 shadow-2xl rounded-3xl overflow-hidden">
          <div className="px-8 pt-8 pb-4 text-center">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
              {CONSTANTS.LABELS.TITLE}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-3 rounded-full"></div>
            <p className="text-gray-400 text-center text-sm mt-4">
              Sube tus documentos PDF para procesamiento inteligente
            </p>
          </div>
          
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* AI Toggle Section */}
              <div className="border-b border-gray-700/30 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Modo de Procesamiento
                    </h3>
                    <p className="text-sm text-gray-400">
                      {aiEnabled 
                        ? 'GPT-4o-mini: Mayor precisión y análisis detallado'
                        : 'GPT-3.5-turbo: Procesamiento rápido y estándar'
                      }
                    </p>
                  </div>
                  <AIToggle 
                    isEnabled={aiEnabled}
                    onToggle={handleAIToggle}
                    disabled={isUploading}
                  />
                </div>
              </div>

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
              
              {!isUploading && uploadQueue.length > 0 && (
                <FileList 
                  files={uploadQueue} 
                  onRemove={removeFileFromQueue} 
                />
              )}
              
              {isUploading && <UploadProgress progress={progress} />}
              
              <button 
                type="submit" 
                disabled={isUploading || !uploadQueue.length || !user} 
                className={`w-full py-4 px-6 text-white font-semibold rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 transform ${
                  isUploading 
                    ? 'bg-gradient-to-r from-blue-500/70 to-purple-500/70 cursor-not-allowed scale-[0.98]' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25'
                } ${(!uploadQueue.length || !user) && 'opacity-60 cursor-not-allowed hover:scale-100'}`}
              >
                {isUploading ? (
                  <>
                    <Spinner size={20} color="white" />
                    <span>
                      Procesando{aiEnabled ? ' con AI+' : ''}...
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    <span>
                      {`Procesar ${uploadQueue.length} Archivo(s)${aiEnabled ? ' con AI+' : ''}`}
                    </span>
                  </>
                )}
              </button>

              {!user && (
                <p className="text-center text-sm text-gray-400 mt-2">
                  Debes <span className="text-blue-400">iniciar sesión</span> para procesar documentos
                </p>
              )}
            </form>
          </div>
        </div>

        {!isUploading && hasVisionDocuments && (
          <div className="mt-6">
            <VisionDocumentsList 
              documents={visionDocuments}
              processingDocs={processingVisionDocs}
              onProcessVision={handleVisionProcessing}
              onSkipVision={handleSkipVision}
            />
            
            <div className="mt-4 text-center">
              <button
                onClick={handleClearAllResults}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Limpiar todos los resultados
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;