import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router-deprecated";
import {Location} from "../../../../interfaces/location";
import {LocationService} from "../../../../services/location.service";
import {ConfirmModalOptions, ConfirmModalComponent} from "../../../confirm.modal/confirm.modal";


@Component({
  selector: "admin-location-all",
  templateUrl: "app/components/admin/location/all/all.html",
  directives: [ROUTER_DIRECTIVES, ConfirmModalComponent]
})
export class AdminLocationsAllComponent {
  locations: Location[];
  filteredLocations: Location[];
  modal: ConfirmModalOptions = {};

  constructor(private locationService: LocationService, private router: Router) { }

  ngOnInit() {
    this.locationService.getAllLocations().subscribe(res => {
      this.locations = res;
      this.filteredLocations = res;
    });
   }

   ngOnDestroy() {
     ($(".modal-backdrop") as any).remove();
   }

   filter(query: string) {
     let regexp = new RegExp(query, "i");

     this.filteredLocations = this.locations.filter(u => {
       return regexp.test(u.name);
     });
   }

   delete(location: Location) {
     /** Setup modal */
     this.modal = {
       title: "Delete Subject",
       body: "Are you sure you want to delete subject " + location.name + "?",
       confirmed: (con) => {
         if (con) {
           this.locationService.deleteLocation(location._id).subscribe((res) => {
             this.ngOnInit();
           });
         }
       }
     };

     ($("#confirmModal") as any).modal("show");
  }


  saved() {
    this.router.navigate(["AllPath"]);
  }
  canceled() {
    this.router.navigate(["AllPath"]);
  }
}
