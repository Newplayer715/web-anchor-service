import request from "@/services/axios/commonRequest/index";

// 获取群的信息
export function getGroupChatInfo(params) {
  return request({
    url: "/groupsinfo/",
    method: "get",
    params,
  });
}

// 修改群的信息
export function updateGroupChatInfo(id, data) {
  return request({
    url: `/groupsinfo/${id}/`,
    method: "put",
    data,
  });
}

// 获取群公告
export function getGroupAnnouncement(params) {
  return request({
    url: "/groupsnotice/",
    method: "get",
    params,
  });
}

// 新增群公告
export function addGroupAnnouncement(data) {
  return request({
    url: `/groupsnotice/`,
    method: "post",
    data,
  });
}

// 删除群公告
export function delGroupAnnouncement(id) {
  return request({
    url: `/groupsnotice/${id}/`,
    method: "delete",
  });
}

// 获取群成员
export function getGroupMembers(params) {
  return request({
    url: "/groupsmember/",
    method: "get",
    params,
  });
}

// 新增群成员
export function addGroupMembers(data) {
  return request({
    url: `/groups/add/`,
    method: "post",
    data,
  });
}

// 删除群成员
export function delGroupMembers(data) {
  return request({
    url: `/groups/batch/`,
    method: "delete",
    data,
  });
}
