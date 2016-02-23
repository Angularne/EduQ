/// <reference path="../typings/browser.d.ts"/>
/// <reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {bootstrap} from 'angular2/platform/browser'
import {App} from './app'
import {provide,} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from "angular2/http";

bootstrap(App, [ROUTER_PROVIDERS, HTTP_PROVIDERS]);
