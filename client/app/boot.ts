/// <reference path="../typings/browser.d.ts"/>

import {bootstrap} from '@angular/platform-browser-dynamic'
import {App} from './app'
import {provide} from '@angular/core';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {HTTP_PROVIDERS, RequestOptions} from "@angular/http";
import {UserService} from "./services/user.service";
import {AuthService} from "./services/auth.service";

bootstrap(App, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
//  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  AuthService
]);
