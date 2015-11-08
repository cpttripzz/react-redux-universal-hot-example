import superagent from 'superagent';
import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];
let headers;
function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return 'http://localhost:' + config.apiPort + adjustedPath;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api' + adjustedPath;
}

export default class c {

  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));
        if (typeof headers !== "undefined") {
          headers.forEach(function (header) {
            request.set(header.type, header.value);
          })
        }
        if (params) request.query(params);

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) request.send(data);

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }))

  }

  setHeaders(_headers) {
    headers = _headers;
  }
}

