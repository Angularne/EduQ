import {Injectable} from 'angular2/core';
import {Http, Headers, Request, RequestMethod} from "angular2/http";
import {Location} from '../interfaces/location';
import {authHeaders} from '../common/headers';

let SERVER_ADDRESS = 'http://localhost:3000';

@Injectable()
export class LocationService {

  _locations: Location[] = [];

  constructor(private http: Http) {}

  getLocations(code: string, select: string = null, populate: string = null) {
    // let url = '/api/location/' + code + '?'
    // + (select ? 'select=' + select + '&': '')
    // + (populate ? 'populate=' + populate : '');
    // return this.http.get(url, {
    //   headers: authHeaders()
    // }).map((res:any) => {
    //   if (res.status == 200) {
    //     this._locations = res.json();
    //     return this._locations;
    //   } else return null;
    // });
    if(this._locations.length < 1) {
      this._locations.push(this.mock);
      this._locations.push(this.mock2);
    }
    return this._locations;
  }

mock : Location = {
  name: 'BR166',
  imagePath: '/app/resources/labben.jpg',
  count: 3
}
mock2: Location = {
  name: 'BR231',
  imagePath: '/app/resources/p-lab.jpg',
  count: 4
}

}
