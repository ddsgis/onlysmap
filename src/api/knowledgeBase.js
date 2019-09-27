import base from '@/api/base.js';
import request from '@/utils/request';

export function getMuckList(params) {
  return request({
    url: base.farm + '/knowledgeBase/getMuckList',
    method: 'get',
    params
  });
}
export function saveMuck(model) {
  return request({
    url: base.farm + '/knowledgeBase/fertilizer/save',
    method: 'post',
    data: model
  });
}

export function deleteMuck(id) {
  return request({
    url: base.farm + '/knowledgeBase/fertilizer/delete/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
export function getPestList(params) {
  return request({
    url: base.farm + '/knowledgeBase/getPestList',
    method: 'get',
    params
  });
}

export function savePest(model) {
  return request({
    url: base.farm + '/knowledgeBase/Pest/save',
    method: 'post',
    data: model
  });
}

export function deletePest(id) {
  return request({
    url: base.farm + '/knowledgeBase/Pest/delete/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function getCrop() {
  return request({
    url: base.farm + '/Crops/getAll',
    method: 'get'
  });
}

export function getCropInfo(id) {
  return request({
    url: base.farm + '/Crops/cropinfo?id=' + id,
    method: 'get'
  });
}

export function getEnvInfo(id) {
  return request({
    url: base.farm + '/Crops/cropEnviment?id=' + id,
    method: 'get'
  });
}

export function getCropPestList(params) {
  return request({
    url: base.farm + '/Crops/cropPestList',
    method: 'get',
    params
  });
}
