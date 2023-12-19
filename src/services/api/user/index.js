import request from "@/services/axios/commonRequest/index";
import QS from "qs"; //数据序列化

// 获取个人信息
export function getUser(data) {
  return request({
    url: "/ownerinformation/" + data,
    method: "get",
  });
}

//登录
export function login(data) {
  return request({
    url: "/login/",
    method: "post",
    data: QS.stringify(data),
  });
}

// 修改客服消息
export function updateUser(userId, data) {
  return request({
    url: `/ownerinformation/${userId}/`,
    method: "put",
    data: QS.stringify(data),
  });
}
// 修改客服头像
// export function updateUserProfile(userId, data) {
//   return request({
//     url: `/ownerinformation/${userId}/`,
//     method: "post",
//     data: QS.stringify(data),
//   });
// }

// 话术获取
export function getScripts(user_id,region_id,category_name) {
  return request({
    url: "/scripts/",
    method: "get",
    params:{
      user_id:user_id,
      region_id:region_id,
      category_name:category_name
    },
  });
}
// 话术增加
export function addScripts(user_id,region_id,category_name,content) {
  return request({
    url: "/scripts/",
    method: "post",
    data: {
      "user_id":user_id,
      "region_id":region_id,
      "category_name":category_name,
      "content":content
    },
  });
}
// 话术批量删除
export function deleteScripts(user_id,region_id,category_name) {
  return request({
    url: "/scripts/batch/",
    method: "delete",
    data:{
      "user_id":user_id,
      "region_id":region_id,
      "category_name":category_name,

    }
  });
}

// 话术删除
export function deleteScript(data) {
  return request({
    url: "/scripts/" + data,
    method: "delete",
  });
}
// 话术修改
export function editScript(id,data) {
  return request({
    url: `/scripts/${id}/`,
    method: "put",
    data: QS.stringify(data),
  });
}
// 话术批量修改
export function editScripts(user_id,region_id,category_name,contents) {
  return request({
    url: "/scripts/batchupdate/",
    method: "put",
    data:{
      user_id:user_id,
      region_id:region_id,
      category_name:category_name,
      contents:contents
    }
  });
}

// 链接查询
export function getLinks(user_id) {
  return request({
    url: "/links/",
    method: "get",
    params:{
      user_id:user_id,
    },
  });
}

// 添加链接
export function addLinks(data) {
  return request({
    url: "/links/",
    method: "post",
    data: QS.stringify(data),
  });
}

// 链接编辑
export function editLinks(userId,data) {
  return request({
    url: `/links/${userId}/`,
    method: "put",
    data: QS.stringify(data),
  });
}

// 链接删除
export function deleteLinks(data) {
  return request({
    url: "/links/" + data,
    method: "delete",
  });
}


// 知识库查询
export function getKnowledges(user_id) {
  return request({
    url: "/knowledges/",
    method: "get",
    params:{
      user_id:user_id,
    },
  });
}

// 知识库添加
export function addKnowledges(data) {
  return request({
    url: "/knowledges/",
    method: "post",
    data: QS.stringify(data),
  });
}

// 知识库编辑
export function editKnowledges(userId,data) {
  return request({
    url: `/knowledges/${userId}/`,
    method: "put",
    data: QS.stringify(data),
  });
}

// 知识库删除
export function deleteKnowledges(data) {
  return request({
    url: "/knowledges/" + data,
    method: "delete",
  });
}

// 文件上传
export function filesUpload(data) {
  return request({
    url: "/file/",
    method: "post",
    data: QS.stringify(data),
  });
}

// 文件获取
export function filesGet(user_id) {
  return request({
    url: "/file/" ,
    method: "get",
    params:{
      user_id:user_id,
    },
  });
}

// 文件删除
export function filesDelete(data) {
  return request({
    url: "/file/" + data,
    method: "delete",
  });
}