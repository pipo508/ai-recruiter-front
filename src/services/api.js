//const API_BASE_URL = 'http://127.0.0.1:5000/api/document'; // para PDFs
//const API_AUTH_URL = 'http://127.0.0.1:5000/api/user'; // para login y register
//const API_SEARCH_URL = 'http://127.0.0.1:5000/api/search'; // para búsquedas




const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Construimos las URLs completas
export const API_DOCUMENT_URL = `${API_BASE_URL}/api/document`; // para PDFs
export const API_AUTH_URL = `${API_BASE_URL}/api/user`;     // para login y register
export const API_SEARCH_URL = `${API_BASE_URL}/api/search`;   // para búsquedas
// Función helper para manejar errores de respuesta
const handleApiError = async (response, context = '') => {
  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error(`${context} - Non-JSON response:`, text);
    throw new Error(`Respuesta inesperada del servidor: ${text}`);
  }

  const data = await response.json();
  
  // Mapear códigos de error específicos a mensajes user-friendly
  const errorMessages = {
    400: {
      'EOF marker not found': 'El archivo PDF está corrupto o no es válido. Por favor, verifica el archivo e intenta nuevamente.',
      'Archivo no es un PDF válido': 'El archivo seleccionado no es un PDF válido o está dañado.',
      'default': data.error || 'Error en la solicitud. Verifica los datos enviados.'
    },
    401: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'El recurso solicitado no se encontró.',
    409: {
      'duplicado': 'Este documento ya existe en tu biblioteca. No se pueden subir archivos duplicados.',
      'default': data.error || 'Conflicto: El recurso ya existe.'
    },
    422: 'Los datos enviados no son válidos. Verifica la información.',
    429: 'Demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.',
    500: 'Error interno del servidor. Por favor, intenta más tarde.',
    503: 'El servicio no está disponible temporalmente. Intenta más tarde.'
  };

  let errorMessage = data.error || 'Error desconocido';

  // Buscar mensaje específico basado en el código de estado
  if (errorMessages[response.status]) {
    if (typeof errorMessages[response.status] === 'object') {
      // Buscar mensaje específico dentro del error
      const specificError = Object.keys(errorMessages[response.status])
        .find(key => key !== 'default' && data.error?.includes(key));
      
      errorMessage = specificError 
        ? errorMessages[response.status][specificError]
        : errorMessages[response.status].default;
    } else {
      errorMessage = errorMessages[response.status];
    }
  }

  const error = new Error(errorMessage);
  error.status = response.status;
  error.originalError = data.error;
  throw error;
};

// Login
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log('loginUser - Response status:', response.status);

    if (!response.ok) {
      await handleApiError(response, 'loginUser');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en loginUser:', error.message);
    throw error;
  }
};

// Registro
export const registerUser = async (username, email, password) => {
  console.log('🔄 registerUser - Iniciando con:', { username, email, password: '***' });
  
  try {
    console.log('📤 Enviando petición a:', `${API_AUTH_URL}/register`);
    
    const response = await fetch(`${API_AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    console.log('📥 registerUser - Response status:', response.status);
    console.log('📥 registerUser - Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      await handleApiError(response, 'registerUser');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en registerUser:', error.message);
    throw error;
  }
};

// Procesar PDFs enviados con soporte para AI toggle
export const processPDFs = async (userId, files, token, aiEnabled = false) => {
  // --- LOG DE DIAGNÓSTICO: INICIO DE LA FUNCIÓN ---
  console.log(`[DIAGNÓSTICO] Iniciando 'processPDFs' para ${files.length} archivo(s).`, { userId, aiEnabled });

  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('ai_enabled', aiEnabled.toString());
  files.forEach(file => formData.append('files[]', file));

  try {
    // --- LOG DE DIAGNÓSTICO: ANTES DEL FETCH ---
    console.log("[DIAGNÓSTICO] Enviando petición al backend en '/api/document/process-pdfs'.");

    const response = await fetch(`${API_BASE_URL}/process-pdfs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    // --- LOG DE DIAGNÓSTICO: DESPUÉS DEL FETCH ---
    console.log(`[DIAGNÓSTICO] Respuesta recibida del backend. Estado: ${response.status}`);

    if (!response.ok) {
        // Si la respuesta no es OK (ej: 400, 403, 500), se maneja el error.
        console.error("[DIAGNÓSTICO] La respuesta del servidor no fue OK.");
        await handleApiError(response, 'processPDFs'); // handleApiError ya tiene sus propios logs
    }

    const data = await response.json();

    // --- LOG DE DIAGNÓSTICO: ANÁLISIS DE LA RESPUESTA ---
    console.log("[DIAGNÓSTICO] Datos recibidos en la respuesta JSON:", data);

    if (data.needs_vision && data.needs_vision.length > 0) {
        console.warn("[DIAGNÓSTICO] El backend ha indicado que uno o más archivos necesitan procesamiento con Vision.");
    }
    if (data.processed && data.processed.length > 0) {
        console.log("[DIAGNÓSTICO] El backend ha confirmado el procesamiento exitoso de algunos archivos.");
    }

    return data;

  } catch (error) {
    // --- LOG DE DIAGNÓSTICO: ERROR DE RED O EN EL FETCH ---
    console.error("[DIAGNÓSTICO] Error crítico durante la ejecución de 'fetch' en processPDFs:", error);
    throw error; // Re-lanzar el error para que el componente lo pueda capturar
  }
};

// Procesar un PDF con Vision
export const processWithVision = async (userId, tempPathId, token) => {
  try {
    
    console.log('DEBUG: Datos enviados a processWithVision:', { userId, tempPathId });

    const response = await fetch(`${API_BASE_URL}/process-with-vision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId, temp_path_id: tempPathId }),
    });

    console.log('processWithVision - Response status:', response.status);

    if (!response.ok) {
      await handleApiError(response, 'processWithVision');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en processWithVision:', error.message);
    throw error;
  }
};

// Descartar procesamiento con Vision
export const skipVisionProcessing = async (tempPathId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/skip-vision-processing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ temp_path_id: tempPathId }),
    });

    console.log('skipVisionProcessing - Response status:', response.status);

    if (!response.ok) {
      await handleApiError(response, 'skipVisionProcessing');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en skipVisionProcessing:', error.message);
    throw error;
  }
};

export const fetchUserDocuments = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleApiError(response, 'fetchUserDocuments');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Error en fetchUserDocuments:', error);
    return [];
  }
};

export const deletePDF = async (s3_path, user_id, token) => {
  try {
    console.log('Deleting PDF with:', { s3_path, user_id, token: token ? 'present' : 'missing' });
    
    if (!token) {
      throw new Error('Token de autorización faltante. Por favor, inicia sesión nuevamente.');
    }
    
    const response = await fetch(`${API_BASE_URL}/delete-file`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ s3_path, user_id }),
    });

    console.log('deletePDF - Response status:', response.status);

    if (!response.ok) {
      await handleApiError(response, 'deletePDF');
    }

    const data = await response.json();
    console.log('Delete successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en deletePDF:', error.message);
    throw error;
  }
};

export const searchDocuments = async (query, token) => {
  try {
    const response = await fetch(`${API_SEARCH_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    console.log('searchDocuments - Response status:', response.status);

    if (!response.ok) {
      await handleApiError(response, 'searchDocuments');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en searchDocuments:', error.message);
    throw error;
  }
};

export const fetchCandidateById = async (documentId, token) => {
  try {
    if (!documentId) {
      throw new Error('ID del documento es requerido');
    }
    
    if (!token) {
      throw new Error('Token de autenticación es requerido');
    }

    console.log('fetchCandidateById - Iniciando petición:', { documentId, tokenPresent: !!token });

    const response = await fetch(`${API_BASE_URL}/${documentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('fetchCandidateById - Response status:', response.status);

    if (!response.ok) {
      await handleApiError(response, 'fetchCandidateById');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchCandidateById:', error.message);
    throw error;
  }
};

export const getSearchHistory = async (token) => {
  try {
    if (!token) {
      throw new Error('Token de autenticación es requerido para ver el historial');
    }

    const response = await fetch(`${API_SEARCH_URL}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleApiError(response, 'getSearchHistory');
    }

    const data = await response.json();
    console.log('getSearchHistory - Response data:', data);
    return data;

  } catch (error) {
    console.error('Error en getSearchHistory:', error.message);
    throw error;
  }
};

export const updateProfileSection = async (documentId, sectionData, token) => {
  try {
    if (!documentId || !sectionData || !token) {
      throw new Error('Faltan parámetros para actualizar la sección del perfil.');
    }

    console.log('updateProfileSection - Enviando:', { documentId, sectionData });

    const response = await fetch(`${API_BASE_URL}/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(sectionData),
    });

    console.log('updateProfileSection - Response status:', response.status);

    if (!response.ok) {
      await handleApiError(response, 'updateProfileSection');
    }

    const data = await response.json();
    console.log('Sección actualizada exitosamente:', data);
    return data;

  } catch (error) {
    console.error('Error en updateProfileSection:', error.message);
    throw error;
  }
};

// Función helper para manejar actualizaciones de campos anidados
export const updateNestedProfileField = async (documentId, fieldPath, value, token) => {
  try {
    const updateData = {};
    
    // Construir el objeto de actualización basado en el path del campo
    const keys = fieldPath.split('.');
    let current = updateData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    
    return await updateProfileSection(documentId, updateData, token);
  } catch (error) {
    console.error('Error en updateNestedProfileField:', error.message);
    throw error;
  }
};


export const deleteAllDocuments = async (token) => {
  try {
    console.log('🔍 DEBUGGING deleteAllDocuments:');
    console.log('🔍 Token:', token ? `Presente (${token.substring(0, 20)}...)` : 'AUSENTE');
    console.log('🔍 API_BASE_URL:', API_BASE_URL);
    console.log('🔍 URL completa:', `http://127.0.0.1:5000/api/document/delete-all`);
    
    if (!token) {
      throw new Error('Token de autorización faltante. Por favor, inicia sesión nuevamente.');
    }
    
    const requestConfig = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        confirmation: "DELETE_ALL_DOCUMENTS" 
      }),
    };
    
    console.log('🔍 Configuración de la solicitud:', requestConfig);
    
    const response = await fetch(`http://127.0.0.1:5000/api/document/delete-all`, requestConfig);
    
    console.log('🔍 Response recibida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response body:', errorText);
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Delete all successful:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error completo en deleteAllDocuments:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};


// Agregar esta función al final de tu archivo api.js
export const deleteSearchResult = async (searchId, token) => {
  try {
    if (!token) {
      throw new Error('Token de autorización faltante. Por favor, inicia sesión nuevamente.');
    }
    
    if (!searchId) {
      throw new Error('ID del resultado de búsqueda es requerido.');
    }
    
    console.log('deleteSearchResult - Eliminando resultado:', { searchId, tokenPresent: !!token });
    
    const response = await fetch(`${API_SEARCH_URL}/history/${searchId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('deleteSearchResult - Response status:', response.status);

    if (!response.ok) {
      await handleApiError(response, 'deleteSearchResult');
    }

    const data = await response.json();
    console.log('Delete search result successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en deleteSearchResult:', error.message);
    throw error;
  }
};