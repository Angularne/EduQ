import {Component, Input, OnInit} from "@angular/core";
import {Location} from "../../../interfaces/location";
import {LocationService} from "../../../services/location.service";

@Component({
  selector: "edit-locations",
  templateUrl: "app/components/edit.subject/location/location.html",
  providers: [LocationService]
})
export class EditLocationComponent implements OnInit {

  private _locations: Location[] = [];
  @Input() set locations(locations: Location[]){
    this._locations = locations;
    this.fetchAllLocations();
    this.query = "";
    this.suggestions = [];
  }
  get locations() {
    return this._locations;
  }

  private all: Location[];

  @Input() label: string;

  query: string = "";
  suggestions: Location[] = [];



  constructor(private locationService: LocationService) { }

  ngOnInit() {
  }

  fetchAllLocations() {
    this.locationService.getAllLocations().subscribe((locations) => {
      this.all = [];
      for (let location of locations) {
        if (!this.inLocations(location)) {
          this.all.push(location);
        }
      }
    });
  }

  private inLocations(location: Location) {
    for (let u of this.locations || []) {
      if (u._id === location._id) {
        return true;
      }
    }
    return false;
  }

  suggest() {
    let q = new RegExp(this.query, "i");
    this.suggestions = [];
    if (this.query.length) {
      for (let location of this.all) {
        if (q.test(location.name)) {
          this.suggestions.push(location);
        }
      }
    }
  }

  add() {
    if (this.suggestions.length) {
      this.addLocation(this.suggestions[0]);
    }
  }

  addLocation(location) {
    this.locations.push(location);
    this.query = "";
    this.suggestions = [];

    let i = 0;
    for (let u of this.all) {
      if (location._id === u._id) {
        this.all.splice(i, 1);
        break;
      }
      i++;
    }

  }

  removeLocation(location) {
    this.all.unshift(location);
    location.role = null;
    for (let i in this.locations) {
      if (this.locations[i]._id === location._id) {
        this.locations.splice(+i, 1);
        break;
      }
    }
  }

}
