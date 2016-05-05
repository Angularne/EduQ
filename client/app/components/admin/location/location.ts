import {Component} from "@angular/core";
import {Router, RouteConfig, ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {LocationService} from "../../../services/location.service";
import {EditLocationComponent} from "../../edit.location/edit.location";
import {AdminLocationsAllComponent} from "./all/all";

@Component({
  selector: "admin-locations",
  templateUrl: "app/components/admin/location/location.html",
  directives: [ROUTER_DIRECTIVES],
  providers: [LocationService]
})
@RouteConfig([
  {path: "/", component: AdminLocationsAllComponent, as: "AllPath", useAsDefault: true},
  {path: "/add", component: EditLocationComponent, as: "AddPath"},
  {path: "/:id", component: EditLocationComponent, as: "EditPath"}
])
export class AdminLocationComponent {
  constructor(private router: Router) {}
}
