import {bootstrap} from 'angular2/platform/browser'
import {App} from './app'
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';

console.log('bootstraping');

bootstrap(App, [ROUTER_PROVIDERS]);
