import Vue from 'vue';
import Router from 'vue-router';

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import Layout from '../views/layout/Layout';

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/signUp',
    component: () => import('@/views/login/signup'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: {
          title: '首页',
          icon: 'icon-dashboard',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/farmManage',
    component: Layout,
    redirect: '/farmManage/account',
    name: 'farmManage',
    meta: {
      title: '管理',
      icon: 'icon-jiatingnongchangguanli'
    },
    children: [
      {
        path: 'account',
        name: 'account',
        redirect: '/farmManage/account/dashboard',
        component: () => import('@/views/home/index'),
        meta: {
          title: '台账',
          icon: 'icon-taizhang'
        },
        children: [
          {
            path: 'dashboard',
            name: 'dashboard',
            hidden: true,
            component: () => import('@/views/home/components/dashboard')
          },
          {
            path: 'timeline',
            name: 'timeline',
            hidden: true,
            component: () => import('@/views/home/components/timeline')
          }
        ],
        hidden: true
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/farmManage/map'),
        meta: {
          title: '地图',
          icon: 'icon-ditu'
        }
      },
      {
        path: 'shape',
        name: 'shape',
        hidden: true,
        component: () => import('@/views/farmManage/components/shape'),
        meta: {
          title: '上传shape文件'
        }
      },
    ]
  },

  // {
  //   path: '/data',
  //   component: Layout,
  //   redirect: '/data',
  //   children: [
  //     {
  //       path: 'data',
  //       name: 'data',
  //       component: () => import('@/views/data/index'),
  //       meta: {
  //         title: '数据',
  //         icon: 'icon-shuju'
  //       }
  //     }
  //   ]
  // },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});
