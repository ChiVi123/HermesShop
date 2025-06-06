import { cloneDeep, omit } from 'lodash';
import { resolver } from './resolver';
import { FetchClient } from './types';

export const core: FetchClient = {
  baseUrl: '',
  options: {},
  catchers: new Map(),
  request(method, pathname, options) {
    const newOptions = Object.assign({ method }, this.options, omit(options, 'params'));
    const fetchClientCloned = cloneDeep(this);

    fetchClientCloned.options = newOptions;
    return resolver(pathname, fetchClientCloned);
  },
  get(pathname, options) {
    return this.request('GET', pathname, options);
  },
  post(pathname, options) {
    return this.request('POST', pathname, options);
  },
  put(pathname, options) {
    return this.request('PUT', pathname, options);
  },
  patch(pathname, options) {
    return this.request('PATCH', pathname, options);
  },
  delete(pathname, options) {
    return this.request('DELETE', pathname, options);
  },
};
