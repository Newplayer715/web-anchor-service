import request from "@/services/axios/commonRequest/index";
import QS from "qs"; //数据序列化

// 获取好友列表
export function getFriends(params) {
  return request({
    url: "/friends/",
    method: "get",
    params,
  });
}

// 修改好友信息
export function updateFriendInfo(id, data) {
  return request({
    url: `/friends/${id}/`,
    method: "put",
    data,
  });
}

// 获取标签列表
export function getTags(params) {
  return request({
    url: "/labels/",
    method: "get",
    params,
  });
}

// 新增标签
export function createTag(data) {
  return request({
    url: "/labels/",
    method: "post",
    data: QS.stringify(data),
  });
}

// 删除标签
export function delTag(id) {
  return request({
    url: `/labels/${id}/`,
    method: "delete",
  });
}

// 新增分类
export function addClassification(data) {
  return request({
    url: `/classifications/`,
    method: "post",
    data,
  });
}

// 删除指定的分类
export function delClassification(data) {
  return request({
    url: "/classifications/batch/",
    method: "delete",
    data,
  });
}

// 获取分类列表
export function getClassifications(params) {
  return request({
    url: "/classifications/",
    method: "get",
    params,
  });
}

// 新增群聊
export function addGroupChat(data) {
  return request({
    url: `/groups/`,
    method: "post",
    data,
  });
}
