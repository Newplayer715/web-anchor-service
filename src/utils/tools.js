import dayjs from "dayjs";

const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
//daj.js格式化消息时间显示格式,传入时间戳,返回格式化后的字符串，本周内显示星期几和时间，超过本周显示日期和时间，超过一年显示年月日
export function formatTimeText(time) {
  if (!time) return "";
  // day.js 计算时间差
  const now = dayjs();

  const diff = Math.abs(dayjs(time).diff(now, "day"));
  let timeText = "";
  if (diff <= 1) {
    if (dayjs(time).day() === dayjs().day()) {
      timeText = dayjs(time).format("HH:mm");
    } else {
      timeText = "yesterday" + " " + dayjs(time).format("HH:mm");
    }
  } else if (diff > 1 && diff < 7) {
    // dayjs().day() 获取当前星期几
    const dayOfWeek = dayjs(time).day();
    const weekdayText = daysOfWeek[dayOfWeek];
    timeText = weekdayText + " " + dayjs(time).format("HH:mm");
  } else if (diff > 7 && diff < 365) {
    // 是否是今年
    if (dayjs(time).year() === dayjs().year()) {
      timeText = dayjs(time).format("MM/DD HH:mm");
    } else {
      timeText = dayjs(time).format("YYYY/MM/DD HH:mm");
    }
  } else if (diff > 365) {
    timeText = dayjs(time).format("YYYY/MM/DD");
  }
  return timeText;
}
