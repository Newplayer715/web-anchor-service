import request from '@/services/axios/imRequest';
import fileRequest from '@/services/axios/fileRequest';
import liveChatRequest from '@/services/axios/liveChatRequest';

// 获取通讯推送频道
export function getCommunicationChannel(params) {
  return request({
    url: '/im-channel',
    method: 'get',
    params,
  });
}

// 获取直播间广场推送频道
export function getLiveChatChannel(params) {
  return liveChatRequest({
    url: `/live-chat-channel/${params.live_id}`,
    method: 'get',
    params,
  });
}
// 获取广场聊天联系人列表
export function getLiveChatContactList(params) {
  return liveChatRequest({
    url: '/live-contacts',
    method: 'get',
    params,
  });
}
// 获取直播间广场历史消息
export function getLiveChatHistoryMessage(params) {
  return liveChatRequest({
    url: '/history-messages',
    method: 'get',
    params,
  });
}
// 发送直播间消息
export function sendLiveChatMessage(data) {
  return liveChatRequest({
    url: '/customer-service/send-message',
    method: 'post',
    data,
  });
}

// 发送消息
export function sendMessage(data) {
  return request({
    url: '/customer-service/send-message',
    method: 'post',
    data,
  });
}
//  查询最近联系人消息列表
export function getRecentContactList(params) {
  return request({
    url: '/customer-service/recent-contacts',
    method: 'get',
    params,
  });
}
// 获取历史消息
export function getHistoryMessage(params) {
  return request({
    url: '/customer-service/history-messages',
    method: 'get',
    params,
  });
}

// 清除消息未读数
export function clearUnread(data) {
  return request({
    url: '/customer-service/clear-unread-message-count',
    method: 'post',
    data,
  });
}
// 上传图片
export function uploadImage(data) {
  return fileRequest({
    url: '/chat-images',
    method: 'post',
    data,
  });
}
// 静音联系人
export function muteContact(data) {
  return request({
    url: '/customer-service/mute-contacts',
    method: 'post',
    data,
  });
}
// 取消静音联系人
export function unmuteContact(data) {
  return request({
    url: '/customer-service/unmute-contacts',
    method: 'post',
    data,
  });
}
