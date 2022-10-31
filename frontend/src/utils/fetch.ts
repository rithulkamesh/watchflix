type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

const fetchFromAPI = async (endpoint: string, method?: Methods, options?: RequestInit) => {
    const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: method || 'GET',
        credentials: 'include',
        ...options
    });
    const data = await response.json();
    return data;
}

// Validate from /api/auth/validate

const validateLogin = async (bind?: () => void, errf?: () => void) => {
    const response = await fetchFromAPI('/auth/validate', 'POST');
    if (response.status === 200) {
        bind && bind();
    } else {
        errf && errf();
    }
}

export { fetchFromAPI, validateLogin }