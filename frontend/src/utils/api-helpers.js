export const getErrorMessage = (error, defaultMessage = 'An error occurred') => {
  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return defaultMessage;
};

export const handleApiCall = async (apiFunction, errorMessage) => {
  try {
    const response = await apiFunction();
    return [response.data, null];
  } catch (error) {
    return [null, getErrorMessage(error, errorMessage)];
  }
};

export const confirmAction = (message) => window.confirm(message);

export const copyToClipboard = (text, successMessage = 'Copied to clipboard!') => {
  if (text && navigator.clipboard) {
    navigator.clipboard.writeText(text);
    alert(successMessage);
  }
};

