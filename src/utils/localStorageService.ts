
// Service for managing API key in localStorage
const API_KEY_KEY = 'rule-harvester-api-key';

export const localStorageService = {
  saveApiKey: (apiKey: string) => {
    try {
      localStorage.setItem(API_KEY_KEY, apiKey);
      return true;
    } catch (error) {
      console.error('Error saving API key to localStorage:', error);
      return false;
    }
  },

  getApiKey: (): string => {
    try {
      return localStorage.getItem(API_KEY_KEY) || '';
    } catch (error) {
      console.error('Error getting API key from localStorage:', error);
      return '';
    }
  },

  clearApiKey: () => {
    try {
      localStorage.removeItem(API_KEY_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing API key from localStorage:', error);
      return false;
    }
  }
};
