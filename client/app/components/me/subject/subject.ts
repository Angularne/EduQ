import {Component, Input} from "@angular/core";
import {Subject} from '../../../interfaces/subject';
import {UserSubject} from '../../../interfaces/user';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';


@Component({
  selector: 'subject-tasks',
  templateUrl: 'app/components/me/subject/subject.html',
  inputs: ['subject'],
  directives: [ROUTER_DIRECTIVES]
})

export class SubjectTaskDetailComponent{
  _subject: UserSubject;
  tasks: boolean[];
  completed: boolean;

  constructor(){}

  get subject(){
    return this._subject;
  }

  @Input()
  set subject(subject:any){
    this._subject = subject;
    this.checkTasks();
  }


  checkTasks() {
    this.tasks = [];
    if (this.subject.subjectTasks) {
      for (var i = 1; i <= this.subject.subjectTasks.length; i++) {
        this.tasks.push(false);
      }
      if (this.subject.tasks) {
        for (var task of this.subject.tasks) {
          this.tasks[task.number - 1] = true;
        }
      }

      this.completed = true;
      for (var req of this._subject.requirements) {
        var count = 0;
        for (var t = req.from; t <= req.to; t++) {
          if (this.tasks[t-1]) {
            count++;
          }
        }
        if (count < req.required) {
          this.completed = false;
          break;
        }
      }
    }
  }
}
