import axios from 'axios';
import { localServer } from '../../data';

const METHODS = ['get', 'post', 'put', 'patch', 'del'];

class ApiClient {
  constructor (httpclient = axios) {

    METHODS.forEach((method) => {
      this[method] = (path, { data = {}, types = [], commit } = {}) => new Promise((resolve, reject) => {
        commit(types[0]);

        axios({
          method: method,
          url: `${localServer}${path}`
          // data
        })
        .then((response) => {
          commit(types[1], response.data);
          resolve(response.data);
        }, (error) => {
          commit(types[2], error);
          reject(error);
        });
      });

    });
  }
}

export default ApiClient;
