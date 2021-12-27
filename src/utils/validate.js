/*
 *
 * 使用方式 import { isWscnEmail,validateURL,... } from 'utils/validate';
 * 例如：邮箱验证使用  return isWscnEmail(value)
 *
 */

/* 邮箱验证 */
export function isWscnEmail(str) {
  const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wz\.com$/i;
  return reg.test(str.trim());
}

/* URL验证 */
export function validateURL(textval) {
  const urlregex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/* json 字母排序转成字符串 */
export function sortByKey(obj, flag) {
  if (!obj) {
    return {};
  }
  var newObj = {};
  var sortKeys;
  //对对象递归去null，但是递归不会排序
  if (flag) {
    sortKeys = Object.keys(obj);
  } else {
    sortKeys = Object.keys(obj).sort(function (key1, key2) {
      return key1 > key2 ? 1 : -1;
    });
  }
  sortKeys.forEach((v) => {
    if (obj[v] != null) {
      newObj[v] = obj[v];
    }
    if (
      obj[v] &&
      Object.prototype.toString.call(obj[v]) === "[object Object]"
    ) {
      newObj[v] = sortByKey(obj[v], true);
    } else if (obj[v] != null) {
      newObj[v] = obj[v];
    }
  });
  return newObj;
}
export function textRule(rule, value, callback) {
  var reg = new RegExp("[\\u4E00-\\u9FFF]+$", "g");
  if (!reg.test(value)) {
    callback(new Error("请输入中文"));
  } else {
    callback();
  }
}
export function descRule(rule, value, callback) {
  var reg = new RegExp(
    "[\\u4E00-\\u9FFF\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+$",
    "g"
  );
  if (!reg.test(value)) {
    callback(new Error("请输入中文和正确的标点符号"));
  } else {
    callback();
  }
}
export function cnbRule(rule, value, callback) {
  var reg = new RegExp(
    "[\\u4E00-\\u9FFF\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b0-9]+$",
    "g"
  );
  if (!reg.test(value)) {
    callback(new Error("请输入中文、数字、正确的标点符号"));
  } else {
    callback();
  }
}
export function codeRule(rule, value, callback) {
  var reg = new RegExp("^[0-9]*$");
  if (!reg.test(value)) {
    callback(new Error("请输入数字"));
  } else {
    callback();
  }
}
