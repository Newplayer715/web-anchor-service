import createService from "../service";
const basePath = process.env.VUE_APP_BASE_URL;
let baseUrl = '';
if (process.env.NODE_ENV === 'development') {
    baseUrl = `${basePath}:8001/api/im/v1`;
  } else {
    baseUrl = '/api/im/v1';
  }


const service = createService(baseUrl);
export default service;
