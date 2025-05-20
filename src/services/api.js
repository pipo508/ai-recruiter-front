const API_BASE_URL = 'http://127.0.0.1:5000/document'; // para PDFs
const API_AUTH_URL = 'http://127.0.0.1:5000/user'; // para login y register



// Login
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log('loginUser - Response status:', response.status);
    console.log('loginUser - Response headers:', [...response.headers.entries()]);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('loginUser - Non-JSON response:', text);
      throw new Error(`La respuesta del servidor no es JSON: ${text}`);
    }

    const data = await response.json();
    console.log('loginUser - Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Error en login');
    }

    return data;
  } catch (error) {
    console.error('Error en loginUser:', error.message, error.stack);
    throw error;
  }
};

// Registro
export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    console.log('registerUser - Response status:', response.status);
    console.log('registerUser - Response headers:', [...response.headers.entries()]);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('registerUser - Non-JSON response:', text);
      throw new Error(`La respuesta del servidor no es JSON: ${text}`);
    }

    const data = await response.json();
    console.log('registerUser - Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Error en registro');
    }

    return data;
  } catch (error) {
    console.error('Error en registerUser:', error.message, error.stack);
    throw error;
  }
};

// Procesar PDFs enviados
export const processPDFs = async (userId, files, token) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  files.forEach(file => formData.append('files[]', file));

  try {
    const response = await fetch(`${API_BASE_URL}/process-pdfs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('processPDFs - Response status:', response.status);
    console.log('processPDFs - Response headers:', [...response.headers.entries()]);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('processPDFs - Non-JSON response:', text);
      throw new Error(`La respuesta del servidor no es JSON: ${text}`);
    }

    const data = await response.json();
    console.log('processPDFs - Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Error al procesar los PDFs');
    }

    return data;
  } catch (error) {
    console.error('Error en processPDFs:', error.message, error.stack);
    throw error;
  }
};

// Procesar un PDF con Vision
export const processWithVision = async (userId, tempPathId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/process-with-vision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId, temp_path_id: tempPathId }),
    });

    console.log('processWithVision - Response status:', response.status);
    console.log('processWithVision - Response headers:', [...response.headers.entries()]);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('processWithVision - Non-JSON response:', text);
      throw new Error(`La respuesta del servidor no es JSON: ${text}`);
    }

    const data = await response.json();
    console.log('processWithVision - Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Error al procesar con Vision');
    }

    return data;
  } catch (error) {
    console.error('Error en processWithVision:', error.message, error.stack);
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
    console.log('skipVisionProcessing - Response headers:', [...response.headers.entries()]);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('skipVisionProcessing - Non-JSON response:', text);
      throw new Error(`La respuesta del servidor no es JSON: ${text}`);
    }

    const data = await response.json();
    console.log('skipVisionProcessing - Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Error al descartar procesamiento');
    }

    return data;
  } catch (error) {
    console.error('Error en skipVisionProcessing:', error.message, error.stack);
    throw error;
  }
};

export const fetchUserDocuments = async (token) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/document/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener documentos');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Error en fetchUserDocuments:', error);
    return [];
  }
};


// Versión corregida de la función deletePDF en api.js
export const deletePDF = async (s3_path, user_id, token) => {
  try {
    console.log('Deleting PDF with:', { s3_path, user_id, token: token ? 'present' : 'missing' });
    
    // Verificar que el token esté presente
    if (!token) {
      console.error('Token de autorización faltante');
      throw new Error('Token de autorización faltante. Por favor, inicia sesión nuevamente.');
    }
    
    const response = await fetch('http://127.0.0.1:5000/document/delete-file', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Asegúrate de que el token tenga el formato correcto
      },
      body: JSON.stringify({ s3_path, user_id }),
    });

    console.log('deletePDF - Response status:', response.status);
    console.log('deletePDF - Response headers:', [...response.headers.entries()]);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('deletePDF - Non-JSON response:', text);
      throw new Error(`Respuesta inesperada del servidor: ${text}`);
    }

    const data = await response.json();
    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.error || 'Error al eliminar el archivo');
    }

    console.log('Delete successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en deletePDF:', error.message);
    throw error;
  }
};













