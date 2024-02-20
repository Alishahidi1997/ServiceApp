import axios from 'axios';

const baseAddress = '/api';

const REQUEST_TIMEOUT = 30000;

const initAxios = () => {
  let userString = localStorage.getItem('user');
  userString = JSON.parse(userString);

  if (!userString || !userString.token) return;

  const { token } = userString;
  axios.defaults.headers = {
    Authorization: token && `Bearer ${token}`,
  };
};

const ajax = {
  get: (url, _, config) => axios.get(url, config),
  post: (url, data, config) => axios({
    url,
    method: 'POST',
    data,
    ...config,
  }),
  put: (url, data, config) => axios({
    url,
    method: 'PUT',
    data,
    ...config,
  }),
  delete: (url, _, config) => axios.delete(url, config),
};

const send = async (func, path, data, config, cancelSource) => {
  const timeout = setTimeout(() => {
    cancelSource.cancel('ERR_TIMEOUT_EXPIRED');
  }, REQUEST_TIMEOUT);

  if (config && config.ignoreTimout) clearTimeout(timeout);

  const result = await func(path, data, { ...config, cancelToken: cancelSource.token });

  clearTimeout(timeout);

  return result;
};

const sendRequest = async (type, path, options = {}) => {
  try {
    const { data, config } = options;
    initAxios();

    let url = path;
    if (url.indexOf(baseAddress) !== 0) {
      if (!url.startsWith('/')) {
        url = '/'.concat(url);
      }
      url = baseAddress + url;
    }

    const cancelSource = axios.CancelToken.source();
    const headers = (config && config.headers) || {};
    const resp = await send(ajax[type], url, data, { ...config, headers }, cancelSource);
    if (resp.status === 200) return resp.data;
    throw new Error(`${resp.data && (resp.data.message || resp.data.error)}`);
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        localStorage.removeItem('user');
        window.location.reload();
      }
      if (err.response.status === 404) throw new Error('API not found!');
      throw new Error(`${err.response.data}`);
    } else {
      throw err;
    }
  }
};

export default sendRequest;
