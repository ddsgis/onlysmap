import base from '@/api/base.js';
import request from '@/utils/request';

export function fetchList(query) {
  return request({
    url: base.farm + '/transaction/list',
    method: 'get',
    params: query
  });
}
