import {Component} from 'angular2/core';
import {ComponentInstruction, Router, RouteConfig, ROUTER_DIRECTIVES, CanDeactivate} from 'angular2/router';
import {LoginComponent} from "./components/login/login";
import {MainComponent} from "./components/main/main";
import {isLoggedin} from './components/main/is-loggedin';


@Component({
  selector: 'my-app',
  template: `
  <router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  {path: '/...', component: MainComponent, as: "MainPath"},
  {path: '/login', component: LoginComponent, as: 'LoginPath'}
])


export class App implements CanDeactivate{
  constructor(public router: Router) {

    if (isLoggedin()) {
      this.router.navigate(['MainPath']);
    } else {
      this.router.navigate(['LoginPath']);
    }
  }

  checkLogin() {
    return isLoggedin();
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {
    return isLoggedin();
  }

}
