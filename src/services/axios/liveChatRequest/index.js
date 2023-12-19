import createService from "../service";
const basePath = process.env.VUE_APP_BASE_URL;
let baseUrl = '';
if (process.env.NODE_ENV === 'development') {
  baseUrl = `${basePath}:8002/api/live-chat/v1`;
} else {
  baseUrl = '/api/live-chat/v1';
}
const service = createService(baseUrl);
export default service;
