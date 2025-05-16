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
export const processPDFs = async (userId, files) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  files.forEach(file => formData.append('files[]', file));

  try {
    const response = await fetch(`${API_BASE_URL}/process-pdfs`, {
      method: 'POST',
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
export const processWithVision = async (userId, tempPathId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/process-with-vision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
export const skipVisionProcessing = async (tempPathId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/skip-vision-processing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
