// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const handleApiError = (error: any, defaultMessage: string = 'Something went wrong') => {
  console.error('API Error:', error);
  
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/';
    return 'Session expired. Please login again.';
  }
  
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  return getErrorMessage(error) || defaultMessage;
};