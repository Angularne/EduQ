/// <reference path="../typings/browser.d.ts"/>
/// <reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {bootstrap} from 'angular2/platform/browser'
import {App} from './app'
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';

console.log('bootstraping');

bootstrap(App, [ROUTER_PROVIDERS]);
