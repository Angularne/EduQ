import {EQUIPMENTS} from './mock-equipment';
import {Equipment} from './equipment';
import {Injectable} from 'angular2/core';
import {Http, Response} from "angular2/http";

let SERVER_URL = 'http://localhost:3000/api'

@Injectable()
export class EquipmentService{
  private equipment;
  constructor(private _http:Http) {

  }

/**
Commented sections are future implementation of rest api and database.
*/

  getEquipments(){
    /**
    return new Promise((resolve, reject) => {
      this._http.get(SERVER_URL + '/equipments')
      .subscribe(
        res => resolve(res.json()),
        err => reject(err)
      );
    });
    */
    return new Promise((resolve, reject) => {

    })
  }
  addEquipment(equipment:Equipment) {
    /**
    return new Promise((resolve, reject) => {
      this._http.put(SERVER_URL + `/equipment?id=${equipment.id}&name=${equipment.name}&count=${equipment.count}`, '')
      .subscribe(
        res => resolve(res),
        err => reject(err)
      );
    });
    */
  }
  deleteEquipment(equipment:Equipment) {
    /**
    return new Promise((resolve, reject) => {
      this._http.delete(SERVER_URL + `/equipment/${equipment.id}`)
      .subscribe(
        res => resolve(res),
        err => reject(err)
      );
    });
    */
  }

  updateEquipment(equipment:Equipment) {
    /**
    return new Promise((resolve, reject) => {
      this._http.post(SERVER_URL + `/equipment/${equipment.id}?name=${equipment.name}&count=${equipment.count}`, '')
      .subscribe(
        res => resolve(res),
        err => reject(err)
      );
    });
    */
  }


}
