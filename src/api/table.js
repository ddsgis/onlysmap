import base from '@/api/base.js';
import request from '@/utils/request';

export function getList(params) {
  return request({
    url: base.farm + '/table/list',
    method: 'get',
    params
  });
}
