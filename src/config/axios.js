import http from 'axios';
import qs from 'qs';
export const getType = (o) =>
  Object.prototype.toString
    .call(o)
    .match(/\w+/g)[1]
    .toLowerCase();

export let DEV = false;

export let host = DEV
  ? 'http://localhost:90/api/'
  : 'http://10.8.1.25:100/api/';
export let uploadHost = DEV ? '//localhost/upload/' : '//10.8.2.133/upload/';

// 自动处理token更新，data 序列化等
export let axios = async (option) => {
  option = Object.assign(option, {
    method: option.method || 'get'
  });

  return await http
    .create({
      baseURL: host,
      timeout: 10000,
      transformRequest: [
        function(data) {
          let dataType = getType(data);
          switch (dataType) {
            case 'object':
            case 'array':
              data = qs.stringify(data);
              break;
            default:
              break;
          }
          return data;
        }
      ]
    })(option)
    .then(({ data }) => data)
    .catch((e) => {
      console.log(e);
      return Promise.reject(e);
    });
};
