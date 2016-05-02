import {Component, EventEmitter, Output, Input, OnInit} from 'angular2/core';
import {Broadcast} from '../../../interfaces/subject';
import {BroadcastDetailComponent} from '../../subject/broadcasts/broadcast/broadcast';
import {UserService} from '../../../services/user.service';
import {BroadcastService} from "../../../services/broadcast.service";
import {ReversePipe} from '../../../common/reverse';

@Component({
  selector: 'main-broadcasts',
  templateUrl: '/app/components/main/main-broadcasts/main-broadcasts.html',
  directives: [BroadcastDetailComponent],
  pipes: [ReversePipe],
  providers: [BroadcastService]
})

export class MainBroadcastComponent {

  broadcasts: Broadcast[] = [];

  constructor(private userService: UserService, private broadcastService: BroadcastService) {}

  ngOnInit() {
    //this.broadcasts = this.userService.getBroadcasts();
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
