/// <reference path="../typings/browser.d.ts"/>

import {bootstrap} from "@angular/platform-browser-dynamic";
import {App} from "./app";
import {ROUTER_PROVIDERS} from "@angular/router-deprecated";
import {HTTP_PROVIDERS} from "@angular/http";
import {AuthService} from "./services/auth.service";

bootstrap(App, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
//  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  AuthService
]);
