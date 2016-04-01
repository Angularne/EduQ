import {Headers} from 'angular2/http';
export const headers = new Headers();
let batoken = sessionStorage.getItem('authToken');
headers.append('Authorization', `Basic ${batoken}`);
