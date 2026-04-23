// API CONFIG - Shared functions
const API_BASE = 'http://localhost:3000';

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro na requisição');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro API:', error);
    throw error;
  }
}

export { apiRequest };
