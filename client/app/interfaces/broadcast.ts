import {User} from './user';

export interface Broadcast {
  author: User;
  title: string;
  content: string;
  created: Date;
}
