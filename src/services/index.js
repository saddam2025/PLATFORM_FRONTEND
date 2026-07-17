// src/services/index.js
import api, { setAuthToken } from './api';
import authService from './authService';
import instructorService from './instructorService';

export { api, setAuthToken, authService, instructorService };
export default { api, setAuthToken, authService, instructorService };
