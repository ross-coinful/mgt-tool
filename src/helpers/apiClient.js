import axios from 'axios';
import { localServer } from '../../data';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const ApiClient = {};

METHODS.forEach((method) => {
  ApiClient[method] = (path, { data, params } = {}) => new Promise((resolve, reject) => {

    const options = {
      method,
      url: `${localServer}${path}`,
      withCredentials: true
    };

    if (data) {
      options.data = data;
    }

    if (params) {
      options.params = params;
    }

    axios(options)
    .then((response) => {
      resolve(response.data);
    }, (error) => {
      reject(error);
    });
  });

});

export default ApiClient;
