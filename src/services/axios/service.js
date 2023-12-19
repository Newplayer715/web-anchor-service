/* eslint-disable */
import axios from 'axios';
// import router from '@/router';
// TODO: 待后端适配后使用
import store from '@/store';
import { getToken } from '@/utils/authCookie';
const TOKEN_KEY = 'client_token';

import { Message } from 'element-ui';
export default function createService(baseURL) {

  // axios拦截器
  const service = axios.create({
    baseURL, // 开发服务器接口
    timeout: 60000, // request timeout
  });


  // 请求拦截器
  service.interceptors.request.use(
    (config) => {
      if (store.getters.token) {
        config.headers['Authorization'] = 'Bearer ' + getToken(TOKEN_KEY);
      }
      
      //FIXME: mock token 不生效说明过期
      // const token =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aHJvd3BhcmsiLCJleHAiOjE3MDI1NDA1NTN9.QEO2S3q-U-AmAHg2oXmYmGs1dLceqydEwgfBuGRFpbA';
      // config.headers['Authorization'] = 'Bearer ' + token;
      return config;
    },
    (error) => {
      console.error(error); // for debug
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  service.interceptors.response.use(
    (response) => {
      const res = {
        statusCode: response.status,
        statusText: response.statusText,
        data: response.data,
      };
      return res;
    },
    async (error) => {
      // 未登录跳转
      if(error.response.status === 401){
        // router.push("/Login")
      }
      else{
        Message({
          message: '网络错误',
          type: 'error'
        });
      }
      console.error(error);
      return Promise.reject(error);
    }
  );

  return service;
}
