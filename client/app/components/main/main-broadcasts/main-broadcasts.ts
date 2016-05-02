import {Component, EventEmitter, Output, Input, OnInit, OnChanges} from 'angular2/core';
import {Broadcast} from '../../../interfaces/subject';
import {User} from "../../../interfaces/user";
import {BroadcastDetailComponent} from '../../subject/broadcasts/broadcast/broadcast';
import {UserService} from '../../../services/user.service';
import {BroadcastService} from "../../../services/broadcast.service";
import {AuthService} from "../../../services/auth.service";
import {ReversePipe} from '../../../common/reverse';
import {OrderByPipe} from "../../../common/order-by";

@Component({
  selector: 'main-broadcasts',
  templateUrl: '/app/components/main/main-broadcasts/main-broadcasts.html',
  directives: [BroadcastDetailComponent],
  pipes: [ReversePipe, OrderByPipe],
  providers: [BroadcastService]
})

export class MainBroadcastComponent implements OnInit, OnChanges{

  user: User = null;
  broadcasts: Broadcast[] = [];

  constructor(private userService: UserService, private broadcastService: BroadcastService, private auth: AuthService) {}

  ngOnInit() {
    this.auth.getUser().then((user) => {
      this.user = user;
      for (let sub of this.user.subjects) {
        for (let broad of sub.broadcasts) {
          this.broadcasts.push(broad);
        }
      }
      this.sortList();
    });
  }

  ngOnChanges() {
    this.sortList();
    console.log("onchanges");
  }

  sortList() {
      this.broadcasts = this.broadcasts.sort((a: any, b: any) => {
      if(a.created < b.created) {
        return -1 * -1; // Negative for a reverse sort
      } else if (a.created > b.created) {
        return 1 * -1; // Negative for a reverse sort
      } else {
        return 0 * -1; // Important with patterns
      }
    });

  }

  createBroadcast(title, content) {
    this.broadcastService.createBroadcast({title: title, content: content}).subscribe();
  }

  updateBroadcast(broadcast: Broadcast) {

  }

  deleteBroadcast(broadcast: Broadcast) {
    this.broadcastService.deleteBroadcast(broadcast._id).subscribe();
  }
}
