import axios from 'axios';
import jwt from 'jsonwebtoken';

function injectAuthorizationHeader(config) {
  // TODO: Implement session expiration and refresh
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

export function createSession(token) {
  const tokenContent = jwt.decode(token);
  sessionStorage.setItem('token', token);
  Object.keys(tokenContent).forEach(i => sessionStorage.setItem(i, tokenContent[i]));
  axios.interceptors.request.use(injectAuthorizationHeader);
}

export function destroySession() {
  sessionStorage.clear();
  const interceptor = axios.interceptors.request.use(() => { /* */ });
  axios.interceptors.request.eject(interceptor);
}

export function checkExistingSession() {
  // TODO: Implement what to do with expired session
  const token = sessionStorage.getItem('token');
  if (token) {
    axios.interceptors.request.use(injectAuthorizationHeader);
    return true;
  }
  return false;
}

