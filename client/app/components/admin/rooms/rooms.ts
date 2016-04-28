import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
//import {Location} from "../../../interfaces/location";
//import {LocationService} from "../../../services/location.service";

@Component({
  selector: 'admin-rooms',
  templateUrl: 'app/components/admin/rooms/rooms.html',
  directives: [ROUTER_DIRECTIVES]
})
export class AdminRoomsComponent implements OnInit {
  //locations: Location[];
  //filteredLocations: Location[];

  activePane: string = 'all'
  constructor(private routeParams: RouteParams, private router: Router) { }

  ngOnInit() {
    let pane = this.routeParams.get('action') || 'all';
    this.activePane = pane;
  //
  //   if (pane == 'edit') {
  //     let id = this.routeParams.get('id');
  //     if (id) {
  //       this.locationService.getUser(id).subscribe(user => {
  //         this.selected = user;
  //         this.activePane = pane
  //       });
  //     }
  //   } else {
  //     this.activePane = pane;
  //   }
  //
  //   this.userService.getAllUsers().subscribe(res => {
  //     this.users = res;
  //     this.filteredUsers = res;
  //   });
  // }
  //
  // delete(location: Location) {
  //   if (confirm('Slett?\nBytt ut denne')) {
  //     this.locationService.deleteLocation(location._id).subscribe((res) => {
  //       this.ngOnInit();
  //     });
  //   }
  }


  saved() {
    this.router.navigate(['AdminOption2Path',{component: 'rooms', action: 'all'}]);
  }
  canceled() {
    this.router.navigate(['AdminOption2Path',{component: 'rooms', action: 'all'}]);
  }
}
