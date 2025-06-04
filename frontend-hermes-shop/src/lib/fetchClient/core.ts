import { FetchClient } from './types';

export const core: FetchClient = {
  baseUrl: '',
  options: {},
  async get(pathname, options) {
    return (await fetch(this.baseUrl + pathname, Object.assign({ method: 'get' }, this.options, options))).json();
  },
  async post(pathname, options) {
    return (await fetch(this.baseUrl + pathname, Object.assign({ method: 'post' }, this.options, options))).json();
  },
  async put(pathname, options) {
    return (await fetch(this.baseUrl + pathname, Object.assign({ method: 'put' }, this.options, options))).json();
  },
  async patch(pathname, options) {
    return (await fetch(this.baseUrl + pathname, Object.assign({ method: 'patch' }, this.options, options))).json();
  },
  async delete(pathname, options) {
    return (await fetch(this.baseUrl + pathname, Object.assign({ method: 'delete' }, this.options, options))).json();
  },
};
