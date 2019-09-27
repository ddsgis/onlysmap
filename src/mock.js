const Mock = require('mockjs');

const userLogin = function() {
  return {
    code: 20000,
    data: {
      data: {
        token: 'admin'
      }
    }
  };
};

Mock.mock('/user/login', 'post', userLogin);

const userInfo = function() {
  return {
    code: 20000,
    data: {
      roles: ['admin'],
      name: 'admin',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    }
  };
};

Mock.mock('/user/info', 'get', userInfo);
