/**
 * api接口的统一出口
 */

// 【农田实验】管理接口
import farmExperiment from './farmExperiment';
// 【农场管理】模块接口
import farmManage from './farmManage';
// 【地图】模块接口
import farmmap from './farmmap';
// 【知识库】模块接口
import knowledgeBase from './knowledgeBase';
// 【登录】模块接口
import login from './login';
// 【我的计划】模块接口
import muckManage from './muckManage';
// ？
import table from './table';
// ？
import transaction from './transaction';

export default {
  farmExperiment,
  farmManage,
  farmmap,
  knowledgeBase,
  login,
  muckManage,
  table,
  transaction
};
