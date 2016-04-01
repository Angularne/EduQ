import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {isLoggedin} from '../main/is-loggedin';
import {AuthService} from '../../services/auth.service';
import {Subject} from '../../interfaces/subject';
import {SubjectsComponent} from '../subjects/subjects';

@Component({
  selector: 'siteheader',
  template: `

  <a [routerLink]="['SocketPath']">Socket</a>

  <span class="dropdown">
    <button (click)="toggleDrop()">
      Subjects
      <span class="caret"></span>
    </button>

    <ul style="position:relative;"  *ngIf="checkToggle()">
      <li *ngFor="#subject of subjects">
        <a [routerLink]="['SubjectsPath', {code:subject.subject.code}]">{{subject.subject.name}}</a>
      </li>
    </ul>
  </span>

  <a [routerLink]="['AdminpagePath']">Adminpage</a>

  <a [routerLink]="['MypagePath']">Mypage</a>

  <a href="#" (click)="onLogout()">Logout</a>
  `,
  directives: [ROUTER_DIRECTIVES, SubjectsComponent],
  inputs: ['subjects']
})

export class SiteHeaderComponent {
  subjects: Subject[];
  toggleDropdown: boolean=false;
  constructor(public router: Router, public auth: AuthService) {
  }
  checkLogin() {
    return isLoggedin();
  }
  toggleDrop() {
    this.toggleDropdown = !this.toggleDropdown;
  }
  checkToggle() {
    return this.toggleDropdown;
  }
  onLogout() {
    this.auth.logout()
    .subscribe(
      () => this.router.navigate(['LoginPath'])
    );
  }
}
