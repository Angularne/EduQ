import {Component, Input} from "angular2/core";
import {Subject} from '../../../interfaces/subject';
import {UserSubjects} from '../../../interfaces/user';

@Component({
  selector: 'subject-tasks',
  templateUrl: 'app/components/mypage/subject/subject.html',
  inputs: ['subject']
})

export class SubjectTaskDetailComponent{
  _subject: UserSubjects;
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
    for (var i = 1; i <= this._subject.subject.tasks.length; i++) {
      this.tasks.push(false);
    }
    for (var task of this.subject.tasks) {
      this.tasks[task - 1] = true;
    }

    this.completed = true;
    for (var req of this._subject.subject.requirements) {
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
