// src/context/UploadContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { processPDFs } from '../services/api';
import { useAuth } from './AuthContext';

const UploadContext = createContext();

// Estados del upload
const UPLOAD_STATES = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Reducer para manejar el estado del upload
const uploadReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FILES':
      return {
        ...state,
        uploadQueue: [...state.uploadQueue, ...action.payload]
      };
    
    case 'REMOVE_FILE':
      return {
        ...state,
        uploadQueue: state.uploadQueue.filter((_, index) => index !== action.payload)
      };
    
    case 'CLEAR_QUEUE':
      return {
        ...state,
        uploadQueue: []
      };
    
    case 'START_UPLOAD':
      return {
        ...state,
        status: UPLOAD_STATES.UPLOADING,
        progress: { currentFile: 0, totalFiles: state.uploadQueue.length, currentFileName: '' },
        uploadResults: null,
        errors: []
      };
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: action.payload
      };
    
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        status: UPLOAD_STATES.SUCCESS,
        uploadResults: action.payload,
        uploadQueue: [], // Limpiar la cola después del éxito
        // Añadir documentos Vision al estado global
        visionDocuments: action.payload.needs_vision || []
      };
    
    case 'UPLOAD_ERROR':
      return {
        ...state,
        status: UPLOAD_STATES.ERROR, // Esto cambia isUploading a false
        errors: [action.payload] // Guardamos el error en el estado
      };
    
    case 'CLEAR_RESULTS':
      return {
        ...state,
        uploadResults: null,
        errors: [],
        status: UPLOAD_STATES.IDLE
      };

    // Acciones para AI Toggle
    case 'SET_AI_ENABLED':
      return {
        ...state,
        aiEnabled: action.payload
      };

    case 'SET_VISION_DOCUMENTS':
        return {
            ...state,
            visionDocuments: action.payload
        };
    case 'ADD_VISION_DOCUMENTS':
        return {
            ...state,
            visionDocuments: [...state.visionDocuments, ...action.payload]
        };
    case 'REMOVE_VISION_DOCUMENT':
        return {
            ...state,
            visionDocuments: state.visionDocuments.filter(doc => doc.temp_path_id !== action.payload)
        };
    case 'CLEAR_VISION_DOCUMENTS':
        return {
            ...state,
            visionDocuments: []
        };
    case 'SET_VISION_PROCESSING':
        return {
            ...state,
            processingVisionDocs: {
                ...state.processingVisionDocs,
                [action.payload.docId]: action.payload.isProcessing
            }
        };
    case 'CLEAR_ALL_RESULTS':
        return {
            ...state,
            uploadResults: null,
            errors: [],
            status: UPLOAD_STATES.IDLE,
            visionDocuments: [],
            processingVisionDocs: {}
        };
    
    default:
      return state;
  }
};

// Estado inicial
const initialState = {
  uploadQueue: [],
  status: UPLOAD_STATES.IDLE,
  progress: { currentFile: 0, totalFiles: 0, currentFileName: '' },
  uploadResults: null,
  errors: [],
  visionDocuments: [],
  processingVisionDocs: {},
  aiEnabled: false // Estado para el AI Toggle
};

export const UploadProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);
  const { user, token } = useAuth();

  const addFilesToQueue = useCallback((files) => {
    dispatch({ type: 'ADD_FILES', payload: files });
  }, []);

  const removeFileFromQueue = useCallback((index) => {
    dispatch({ type: 'REMOVE_FILE', payload: index });
  }, []);

  const clearQueue = useCallback(() => {
    dispatch({ type: 'CLEAR_QUEUE' });
  }, []);

  // Nueva función para manejar el AI Toggle
  const setAIEnabled = useCallback((enabled) => {
    dispatch({ type: 'SET_AI_ENABLED', payload: enabled });
  }, []);

  // Función principal de upload actualizada con AI model selection
  const startUpload = useCallback(async () => {
    // 1. Comprobaciones iniciales para asegurar que podemos iniciar la subida.
    if (!user || !token || state.uploadQueue.length === 0) {
      console.error("Subida abortada: Falta usuario, token o no hay archivos en la cola.");
      return;
    }

    // 2. Inicia el proceso de subida, actualizando el estado general.
    dispatch({ type: 'START_UPLOAD' });

    // 3. Preparamos un objeto para ir acumulando los resultados de cada archivo.
    const accumulatedResults = { processed: [], failed: [], needs_vision: [] };
    const filesToProcess = [...state.uploadQueue]; // Creamos una copia para no mutar el estado directamente.
    const totalFiles = filesToProcess.length;

    // 4. El bucle secuencial: la clave de la solución.
    for (let i = 0; i < totalFiles; i++) {
      const file = filesToProcess[i];
      
      // 5. ANTES de subir cada archivo, actualizamos el progreso.
      //    Esto es lo que hará que la barra de carga avance.
      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: {
          currentFile: i + 1,
          totalFiles: totalFiles,
          currentFileName: file.name
        }
      });

      try {
        // 6. Llamamos a la API, pasando el estado de AI habilitado
        const response = await processPDFs(user.id, [file], token, state.aiEnabled);
        
        // 7. Acumulamos los resultados de esta llamada individual.
        if (response.processed) accumulatedResults.processed.push(...response.processed);
        if (response.failed) accumulatedResults.failed.push(...response.failed);
        if (response.needs_vision) accumulatedResults.needs_vision.push(...response.needs_vision);

      } catch (error) {
        // 8. Si la llamada a la API falla, guardamos el error en nuestra lista de fallidos.
        accumulatedResults.failed.push({ filename: file.name, reason: error.message, status: error.status || 500 });
      }
    }

    // 9. Una vez que el bucle termina, enviamos todos los resultados acumulados al estado.
    dispatch({ type: 'UPLOAD_SUCCESS', payload: accumulatedResults });

  }, [user, token, state.uploadQueue, state.aiEnabled]);

  const setVisionDocuments = useCallback((documents) => {
    dispatch({ type: 'SET_VISION_DOCUMENTS', payload: documents });
    }, []);

    const addVisionDocuments = useCallback((documents) => {
        dispatch({ type: 'ADD_VISION_DOCUMENTS', payload: documents });
    }, []);

    const removeVisionDocument = useCallback((docId) => {
        dispatch({ type: 'REMOVE_VISION_DOCUMENT', payload: docId });
    }, []);

    const clearVisionDocuments = useCallback(() => {
        dispatch({ type: 'CLEAR_VISION_DOCUMENTS' });
    }, []);

    const setVisionProcessing = useCallback((docId, isProcessing) => {
        dispatch({
            type: 'SET_VISION_PROCESSING',
            payload: { docId, isProcessing }
        });
    }, []);

    const clearResults = useCallback(() => {
        dispatch({ type: 'CLEAR_RESULTS' });
    }, []);

    const clearAllResults = useCallback(() => {
        dispatch({ type: 'CLEAR_ALL_RESULTS' });
    }, []);

  // Getters derivados
  const isUploading = state.status === UPLOAD_STATES.UPLOADING;
  const hasVisionDocuments = state.visionDocuments.length > 0;
  const hasProcessingVisionDocs = Object.values(state.processingVisionDocs).some(Boolean);

  const value = {
    uploadQueue: state.uploadQueue,
    isUploading,
    uploadResults: state.uploadResults,
    progress: state.progress,
    errors: state.errors,
    status: state.status,
    visionDocuments: state.visionDocuments,
    processingVisionDocs: state.processingVisionDocs,
    hasVisionDocuments,
    hasProcessingVisionDocs,
    aiEnabled: state.aiEnabled, // Nuevo estado
    addFilesToQueue,
    removeFileFromQueue,
    clearQueue,
    startUpload,
    setAIEnabled, // Nueva función
    setVisionDocuments,
    addVisionDocuments,
    removeVisionDocument,
    clearVisionDocuments,
    setVisionProcessing,
    clearResults,
    clearAllResults
  };

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};