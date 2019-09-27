import base from '@/api/base.js';
import request from '@/utils/request';

/**
 * 获得项目信息接口
 * @param {*} params
 */
export function getFieldInfo(id) {
  return request({
    url: base.farm + '/farmManage/getFieldInfo?id=' + id,
    method: 'get'
  });
}

export function getList(params) {
  return request({
    url: base.farm + '/farmManage/getList',
    method: 'get',
    params
  });
}

export function save(model) {
  return request({
    url: base.farm + '/farmManage/save',
    method: 'post',
    data: model
  });
}

export function deleteModel(id) {
  return request({
    url: base.farm + '/farmManage/farm/delete/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function getFarmField() {
  return request({
    url: base.farm + '/farmManage/farmfield',
    method: 'get'
  });
}

export function getScoutList(params) {
  return request({
    url: base.farm + '/FarmService/getScottList',
    method: 'get',
    params
  });
}
export function getScoutInfo(Id) {
  return request({
    url: base.farm + '/FarmService/getScottInfo?id=' + Id,
    method: 'get'
  });
}
export function saveScout(model) {
  return request({
    url: base.farm + '/FarmService/scott/save',
    method: 'post',
    data: model
  });
}

export function deleteScout(id) {
  return request({
    url: base.farm + '/FarmService/scott/delete/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function getTreatList(params) {
  return request({
    url: base.farm + '/FarmService/getTreatList',
    method: 'get',
    params
  });
}

export function getTreatInfo(Id) {
  return request({
    url: base.farm + '/FarmService/getTreatInfo?id=' + Id,
    method: 'get'
  });
}

export function saveTreat(model) {
  return request({
    url: base.farm + '/FarmService/treat/save',
    method: 'post',
    data: model
  });
}

export function deleteTreat(id) {
  return request({
    url: base.farm + '/FarmService/treat/delete/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
