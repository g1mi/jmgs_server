'use strict';
const crypto = require('crypto');

const decodeUserInfo = (encryptedData, iv, appId, sk, ctx) => {
  // base64 decode
  const sessionKey = new Buffer(sk, 'base64');
  encryptedData = new Buffer(encryptedData, 'base64');
  iv = new Buffer(iv, 'base64');
  let decoded;
  try {
    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    decoded = decipher.update(encryptedData, 'binary', 'utf8');
    decoded += decipher.final('utf8');

    decoded = JSON.parse(decoded);

  } catch (err) {
    ctx.throw(403, '解密失败！');
  }

  if (decoded.watermark.appid !== appId) {
    ctx.throw(403, '解密失败！');
  }

  return decoded;
};

const formatUrl = (url, params) => {
  let length = 0;
  let str = '';
  // 计长, 只适用于一层
  for (const i in params) {
    length++;
  }
  for (const key in params) {
    str += key + '=' + params[key];
    if (--length) {
      str += '&';
    }
  }
  return url + '?' + str;
};
exports.formatUrl = formatUrl;
exports.decodeUserInfo = decodeUserInfo;
