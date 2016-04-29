import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {Location} from "../../../interfaces/location";
import {LocationService} from "../../../services/location.service";
import {EditLocationComponent} from '../../edit.location/edit.location';

@Component({
  selector: 'admin-locations',
  templateUrl: 'app/components/admin/location/location.html',
  directives: [ROUTER_DIRECTIVES, EditLocationComponent],
  providers: [LocationService]
})
export class AdminLocationComponent implements OnInit {
  locations: Location[];
  filteredLocations: Location[];

  activePane: string = 'all'
  constructor(private locationService: LocationService, private routeParams: RouteParams, private router: Router) { }

  ngOnInit() {
    let pane = this.routeParams.get('action') || 'all';
    this.activePane = pane;

    if (pane == 'edit') {
      let id = this.routeParams.get('id');
      if (id) {
        this.locationService.getLocation(id).subscribe(user => {
          this.activePane = pane
        });
      }
    } else {
      this.activePane = pane;
    }

    this.locationService.getAllLocations().subscribe(res => {
      this.locations = res;
      this.filteredLocations = res;
    });
   }

   filter(query: string) {
     let regexp = new RegExp(query, 'i');

     this.filteredLocations = this.locations.filter(u => {
       return regexp.test(u.name);
     });
   }

   delete(location: Location) {
     if (confirm('Slett?\nBytt ut denne')) {
       this.locationService.deleteLocation(location._id).subscribe((res) => {
         this.ngOnInit();
       });
     }
  }


  saved() {
    this.router.navigate(['AdminOption2Path',{component: 'locations', action: 'all'}]);
  }
  canceled() {
    this.router.navigate(['AdminOption2Path',{component: 'locations', action: 'all'}]);
  }
}
