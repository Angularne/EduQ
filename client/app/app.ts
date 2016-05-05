import {Component, ApplicationRef} from "@angular/core";
import {Router, RouteConfig} from "@angular/router-deprecated";
import {LoginComponent} from "./components/login/login";
import {MainComponent} from "./components/main/main";
import {SubjectsComponent} from "./components/subjects/subjects";
import {AuthService} from "./services/auth.service";
import {MypageComponent} from "./components/me/me";
import {AdminpageComponent} from "./components/admin/admin";
import {LoggedInRouterOutlet} from "./common/LoggedInOutlet";
import {UserService} from "./services/user.service";
import {SiteHeaderComponent} from "./components/siteheader/siteheader";
import {SubjectService} from "./services/subject.service";

@Component({
  selector: "my-app",
  template: `
  <header id="page-header">
    <siteheader></siteheader>
  </header>
  <div id="page-wrapper">
    <div class="container">
      <auth-router-outlet></auth-router-outlet>
    </div>
  </div>
  `,
  directives: [LoggedInRouterOutlet, SiteHeaderComponent],
  providers: [UserService, SubjectService]
})

@RouteConfig([
  {path: "/", component: MainComponent, as: "MainPath", useAsDefault: true},
  {path: "/login", component: LoginComponent, as: "LoginPath"},

  /** My Page */
  {path: "/me", component: MypageComponent, as: "MypagePath"},

  /** Admin */
  {path: "/admin/...", component: AdminpageComponent, as: "AdminpagePath"},

  /** Subject */
  {path: "/subjects/...", component: SubjectsComponent, as: "SubjectsPath"},

  /** Redirect to main */
  {path: "/**", redirectTo: ["MainPath"]}

])


export class App {
  constructor(public auth: AuthService, private router: Router, private _applicationRef: ApplicationRef) {

    // router.subscribe(() => {
    //   this._applicationRef.tick();
    //   setTimeout(() => {
    //     this._applicationRef.tick();
    //   }, 100);
    // });
  }
}
