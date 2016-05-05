import {Injectable} from "@angular/core";
import {Http, Request, RequestMethod} from "@angular/http";
import {Location} from "../interfaces/location";
import {authHeaders} from "../common/headers";

@Injectable()
export class LocationService {

  _locations: Location[] = [];

  constructor(private http: Http) {}

  getLocation(id: string) {
    return this.http.get("/api/location/" + id, {headers: authHeaders()}).map((res) => {
      if (res.status === 200) {
        return res.json();
      }
      else {
        return null;
      }
    });
  }

  getAllLocations() {
    return this.http.get("/api/location", {headers: authHeaders()}).map(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });
  }

  saveLocation(location: Location) {
    let request: Request = new Request({
      url: "/api/location/",
      headers: authHeaders(),
      body: JSON.stringify(location)
    });

    if (location._id) {
      // _id exists - update user
      request.method = RequestMethod.Put;
      request.url += location._id;
    } else {
      // create new user
      request.method = RequestMethod.Post;
    }

    return this.http.request(request).map((res) => {
      if (res.status === 200 || res.status === 201) {
        // Location saved
        return res.json();
      } else {
        // Error
        console.error(res);
        return false;
      }
    });
  }

  deleteLocation(id: string) {
    return this.http.delete("/api/location/" + id, {headers: authHeaders()}).map(res => {
      if (res.status = 200) {
        return true;
      } else {
        return false;
      }
    });
  }

  getLocations(code: string, select: string = null, populate: string = null) {

    let url = "/api/location/" + code + "?"
    + (select ? "select=" + select + "&" : "")
    + (populate ? "populate=" + populate : "");
    return this.http.get(url, {
      headers: authHeaders()
    }).map((res: any) => {
      if (res.status === 200) {
        this._locations = res.json();
        return this._locations;
      } else return null;
    });


  }


}
