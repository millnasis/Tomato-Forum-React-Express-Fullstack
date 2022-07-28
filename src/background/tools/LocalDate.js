export default function formatDate(time) {
  var date = new Date(time);

  var year = date.getFullYear(),
    month = date.getMonth() + 1, //月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  month = +month >= 10 ? month : "0" + month;
  day = +day >= 10 ? day : "0" + day;
  hour = +hour >= 10 ? hour : "0" + hour;
  min = +min >= 10 ? min : "0" + min;
  sec = +sec >= 10 ? sec : "0" + sec;
  var newTime =
    year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec;
  return newTime;
}
