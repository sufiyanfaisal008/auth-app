import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export const errMsg = (e) =>
  e?.response?.data?.message || (e?.request ? 'Unable to reach the server' : 'Something went wrong');

export default api;
