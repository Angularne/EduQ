import {Headers} from 'angular2/http';

export function authHeaders() {
  let headers = new Headers();
  let batoken = sessionStorage.getItem('authToken');
  if (batoken) {
    headers.append('Authorization', `Basic ${batoken}`);
  }
  return headers;
}
