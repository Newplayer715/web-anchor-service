// 导入 day.js 库
import dayjs from "dayjs";

// 时间戳处理工具
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const localTimestamp = new Date(
    date.getTime() + date.getTimezoneOffset() * 60000
  );
  return localTimestamp.toISOString().slice(0, 16).replace("T", " ");
}

/**
 * 处理时间戳
 * @param { String } timestamp
 * @returns date 格式"YYYY/MM/DD"
 */
export function formatDate(timestamp) {
  const dateObj = dayjs(timestamp * 1000); // 转换为毫秒
  const date = dateObj.format("YYYY/MM/DD");
  return date;
}

/**
 * 处理时间戳
 * @param { String } timestamp
 * @returns time 格式"09:23 AM"
 */
export function formatTime(timestamp) {
  const dateObj = dayjs(timestamp * 1000); // 转换为毫秒
  const time = dateObj.format("hh:mm A");
  return time;
}
