import {bootstrap} from 'angular2/platform/browser'
import {App} from './app'
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {Authentication} from './components/login/authentication';

console.log('bootstraping');

bootstrap(App, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  Authentication
]);
