import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {SubjectService} from './subject.service';
import {Subject} from '../interfaces/subject';

@Injectable()
export class BroadcastService {

  subject: Subject;

  constructor(private http: Http) { }
}
