import base from '@/api/base.js';
import request from '@/utils/request';

export function getPestType() {
  return request({
    url: base.farm + '/datadictionary/getPestType',
    method: 'get'
    // params: {
    //     token
    // }
  });
}
