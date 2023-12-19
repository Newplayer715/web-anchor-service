import request from "@/services/axios/commonRequest/index";
import QS from "qs"; //数据序列化

// 获取客户基本信息
export function getCustomerBaseInfo(params) {
  return request({
    url: "/customer/baseinfo/",
    method: "get",
    params,
  });
}

// 修改客户基本信息
export function updateCustomerBaseInfo(id, data) {
  return request({
    url: `/customer/baseinfo/${id}/`,
    method: "put",
    data: QS.stringify(data),
  });
}

// 新增客户基本信息
export function addCustomerBaseInfo(data) {
  return request({
    url: `/customer/baseinfo/`,
    method: "post",
    data: QS.stringify(data),
  });
}

// 删除客户基本信息
export function delCustomerBaseInfo(id) {
  return request({
    url: `/customer/baseinfo/${id}/`,
    method: "delete",
  });
}

// 获取客户通讯信息
export function getCommunicationInfo(params) {
  return request({
    url: "/customer/communicationinfo/",
    method: "get",
    params,
  });
}

// 修改客户通讯信息
export function updateCommunicationInfo(id, data) {
  return request({
    url: `/customer/communicationinfo/${id}/`,
    method: "put",
    data: QS.stringify(data),
  });
}

// 新增客户通讯信息
export function addCommunicationInfo(data) {
  return request({
    url: `/customer/communicationinfo/`,
    method: "post",
    data: QS.stringify(data),
  });
}

// 删除客户通讯信息
export function delCommunicationInfo(id) {
  return request({
    url: `/customer/communicationinfo/${id}/`,
    method: "delete",
  });
}

// 新增重要事件
export function addImportantEvent(data) {
  return request({
    url: `/events/`,
    method: "post",
    data: QS.stringify(data),
  });
}

// 删除重要事件
export function delImportantEvent(id) {
  return request({
    url: `/events/${id}/`,
    method: "delete",
  });
}

// 获取重要事件
export function getImportantEvent(params) {
  return request({
    url: "/events/",
    method: "get",
    params,
  });
}
