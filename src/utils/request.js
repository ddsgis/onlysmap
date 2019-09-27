import axios from 'axios';
import {
  Message,
  MessageBox
} from 'element-ui';
import store from '../store';
import router from '../router';
import {
  getToken,
  removeToken
} from '@/utils/auth';
/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
  Message({
    message: msg,
    type: 'error',
    duration: 5 * 1000
  });
};

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      tip('未登录状态，请重新登录');
      removeToken();
      toLogin();
      break;
      // 403 token过期
      // 清除token并跳转登录页
    case 403:
      tip('登录过期，请重新登录');
      removeToken();
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
      // 404请求不存在
    case 404:
      tip('请求的资源不存在');
      break;
    default:
      console.log(other);
  }
};

// 创建axios实例
const service = axios.create({
  timeout: 500000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = getToken();
    }
    return config;
  },
  error => {
    // Do something with request error
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    // const res = response.data;
    // if (res.code !== 20000) {
    //   // Message({
    //   //   message: res.message,
    //   //   type: 'error',
    //   //   duration: 5 * 1000
    //   // });
    //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     MessageBox.confirm(
    //       '你已被登出，可以取消继续留在该页面，或者重新登录',
    //       '确定登出', {
    //         confirmButtonText: '重新登录',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }
    //     ).then(() => {
    //       store.dispatch('FedLogOut').then(() => {
    //         location.reload(); // 为了重新实例化vue-router对象 避免bug
    //       });
    //     });
    //   }
    //   return Promise.reject('error');
    // } else {
    //   return response.data;
    // }
    const res = response.data;
    debugger;
    if (response.status === 401 || res.code === 40101 || res.status === 40101) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      });
      return Promise.reject('error');
    }
    if (res.code === 40301 || res.status === 40301) {
      Message({
        message: '当前用户无相关操作权限！',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject('error');
    }
    if (res.code === 40001 || res.status === 40001) {
      Message({
        message: '账户或密码错误！',
        type: 'warning'
      });
      return Promise.reject('error');
    }
    if (response.status !== 200 && (res.code !== 200 || res.status !== 200)) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      });
    } else {
      return response.data;
    }
  },
  error => {
    const {
      response
    } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    }
  }
);

export default service;
