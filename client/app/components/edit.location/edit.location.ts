import {Component, OnInit, Output, EventEmitter} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {LocationService} from '../../services/location.service';
import {Location} from '../../interfaces/location';


@Component({
  selector: 'edit-location',
  templateUrl: 'app/components/edit.location/edit.location.html'
})
export class EditLocationComponent implements OnInit{

  message: string;

  location: Location = {name: '', count:0, imagePath: ''};

  @Output() saved: EventEmitter<Location> = new EventEmitter<Location>();
  @Output() canceled: EventEmitter<Location> = new EventEmitter<Location>();


  constructor(private routeParams: RouteParams, private locationService: LocationService) { }

  ngOnInit() {
    let id = this.routeParams.get('user_id') || this.routeParams.get('id');
      if (id) {
        this.locationService.getLocation(id).subscribe((location) => {
          this.location = location;
        });
      }
  }

  validate(){

    if (this.location.name.trim() == '') {
      this.message = "Name is not set."
      return false;
    }

    if (this.location.count < 0) {
      this.message = "Count must be greater than 0."
      return false;
    }


    return true;
  }

  save(){
    if (this.validate()) {
      this.locationService.saveLocation(this.location).subscribe(loc => {
        this.saved.emit(loc);
      });
    }

  }
}
