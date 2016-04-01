/// <reference path="../typings/browser.d.ts"/>
/// <reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {bootstrap} from 'angular2/platform/browser'
import {App} from './app'
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS, RequestOptions} from "angular2/http";
import {UserService} from "./services/user";
import {AuthService} from "./services/auth.service";

bootstrap(App, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
//  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  AuthService
]);
