import createService from "../service";
// const baseUrl = 'http://192.168.1.225:8000';
const baseUrl = "http://123.207.5.12:8002";
const service = createService(baseUrl);
// 导出 baseUrl
export const BASE_URL = baseUrl;
export default service;
