import base from '@/api/base.js';
import request from '@/utils/request';

export function getList(params) {
  return request({
    url: base.farm + '/MyPrograms/getList',
    method: 'get',
    params
  });
}

export function getCropList(params) {
  return request({
    // url: base.farm + '/muckManage/getCropList',
    url: base.farm + '/Crops/grainListByPage',
    method: 'get',
    params
  });
}
// 作物种子列表
export function getCropSeedList(params) {
  return request({
    // url: base.farm + '/muckManage/getCropList',
    url: base.farm + '/Crops/getSeedByPage',
    method: 'get',
    params
  });
}

// 作物种子列表
export function getCropSeedInfo(id) {
  return request({
    // url: base.farm + '/muckManage/getCropList',
    url: base.farm + '/Crops/cropSeed?id=' + id,
    method: 'get'
  });
}

// 肥料列表
export function getMuckList(params) {
  return request({
    // url: base.farm + '/muckManage/getCropList',
    url: base.farm + '/knowledgeBase/getMuckList',
    method: 'get',
    params
  });
}

export function save(model) {
  return request({
    url: base.farm + '/MyPrograms/save',
    method: 'post',
    data: model
  });
}

export function deleteMuck(id) {
  return request({
    url: base.farm + '/MyPrograms/delete/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
