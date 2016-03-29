import {User} from './user';

export interface Queue {
  list: List[];
  active: boolean;
}

export interface List {
  timeEntered: Date;
  users: User[];
  helper: string;
}
