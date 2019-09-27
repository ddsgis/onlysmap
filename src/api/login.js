import base from '@/api/base.js';
import request from '@/utils/request';

export function login(username, password) {
  return request({
    // url: base.user + '/user/login',
    url: '/api/auth/jwt/token',
    method: 'post',
    data: {
      username: username,
      password: password
    }
  });
}

export function getInfo(token) {
  return request({
    url: base.user + '/user/front/info',
    method: 'get',
    params: {
      token
    }
  });
}

export function logout(token) {
  return request({
    url: '/api/auth/jwt/verify',
    method: 'get',
    params: { token }
  });
}

export function signUp(data) {
  return request({
    url: base.user + '/mail/signup',
    method: 'post',
    data: data
  });
}

export function sendEmail(Email) {
  return request({
    url: base.user + '/user/sendEmail',
    method: 'post',
    data: Email
  });
}
