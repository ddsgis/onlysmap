import moment from 'moment';
// 根据数组对象的某个属性去重
export function uniqueArrayObject(arr, key) {
  var obj = {};
  arr = arr.reduce(function(count, curVal) {
    obj[curVal[key]] ? '' : obj[curVal[key]] = true && count.push(curVal);
    return count;
  }, []);
  return arr;
}

// 处理时间问题
export function timeFormat(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern);
}
