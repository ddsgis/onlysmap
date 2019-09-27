import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n
import '@/styles/index.scss'; // global css

import './assets/iconfont/iconfont.css';

import VCharts from 'v-charts'; // 饿了么封装的echarts 官网：https://v-charts.js.org/#/
import VueLazyload from 'vue-lazyload';
import App from './App';
import router from './router';
import store from './store';
import moment from 'moment';

import '@/icons'; // icon
import '@/permission'; // permission control

import {
  Calendar,
  Drawer
} from 'ant-design-vue';
Vue.use(Calendar);
Vue.use(Drawer);
// require('./mock.js'); // https://www.easy-mock.com/ 网站有时候会挂掉，挂掉时启用本地mock

Vue.use(ElementUI, {
  locale
});
Vue.use(VCharts);
Vue.use(VueLazyload);

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern);
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
