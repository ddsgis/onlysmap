import base from '@/api/base.js';
import request from '@/utils/request';
// import axios from 'axios';
export function getMapLayers() {
  return request({
    url: base.farm + '/map/getlayers',
    method: 'get'
    // params: {
    //     token
    // }
  });
}

export function getMapRect(id) {
  return request({
    url: base.farm + '/DataDictionary/getRect?fieldId=' + id,
    method: 'get'
    // params: {
    //     token
    // }
  });
}

export function FarmManageSave(farm) {
  return request({
    url: base.farm + '/FarmManage/save',
    method: 'post',
    data: farm
  });
  // axios.post("http://localhost:46344/api/FarmManage/save",{
  //     data:{farm}
  // })
}

export function getCrops() {
  return request({
    url: base.farm + '/Crops/grainList',
    method: 'get'
  });
}

export function getVariety(id) {
  return request({
    url: base.farm + '/Crops/seedList?id=' + id,
    method: 'get'
  });
}

export function getMethod(params) {
  return request({
    url: base.farm + '/FarmService/grain/get',
    method: 'get',
    params
  });
}

export function saveCrop(data) {
  return request({
    url: base.farm + '/FarmService/grain/save',
    method: 'post',
    data: data
  });
}
