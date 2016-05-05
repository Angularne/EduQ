import {Component, OnInit} from "@angular/core";
import {Router, RouteConfig, ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {AuthService} from "../../services/auth.service";
import {AdminUsersComponent} from "./users/users";
import {AdminSubjectsComponent} from "./subjects/subjects";
import {AdminLocationComponent} from "./location/location";

@Component({
  selector: "adminpage",
  templateUrl: "app/components/admin/admin.html",
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: "/subjects/...", component: AdminSubjectsComponent, as: "AdminSubjectsPath", useAsDefault: true},
  {path: "/users/...", component: AdminUsersComponent, as: "AdminUsersPath"},
  {path: "/locations/...", component: AdminLocationComponent, as: "AdminLocationsPath"}
])
export class AdminpageComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {
    this.auth.getUser().then(user => {
      if (user) {
        if (user.rights !== "Admin") {
          this.router.navigate(["MainPath"]);
        }
        // User is admin
      } else {
        this.router.navigate(["MainPath"]);
      }
    }).catch(err => {
      this.router.navigate(["MainPath"]);
    });
  }

  ngOnInit() {}
}
