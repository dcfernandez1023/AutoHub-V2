export const getApiBaseUrl = () => {
  const origin = window.location.origin;
  return origin.includes('localhost') ? 'http://localhost:5000' : origin;
};
