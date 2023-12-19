// config.js
// const BASE_API = '/api'; // 基础API地址
// const BASE_API = 'http://192.168.1.38:8004/api'; // 基础API地址
import { BASE_URL } from "@/services/axios/commonRequest/index"

export const fileUpload = {
  FILE_UPLOAD: `${BASE_URL}/file/`, // 文件上传API
  // 其他API...
};


export const ProfileUpload = {
  FILE_UPLOAD: `${BASE_URL}/owninformation/avatar/`, // 头像上传API
  // 其他API...
};
