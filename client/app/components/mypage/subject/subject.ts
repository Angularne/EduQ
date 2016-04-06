import {Component} from "angular2/core";

@Component({
  selector: 'subject-tasks',
  templateUrl: 'app/components/mypage/subject/subject.html',
  inputs: ['subject']
})

export class SubjectTaskDetailComponent{
  _subject: any;
  tasks: boolean[];
  completed: boolean;

  constructor(){}

  get subject(){
    return this._subject;
  }

  set subject(subject:any){
    this._subject = subject;
    this.checkTasks();
  }


  checkTasks() {
    this.tasks = [];
    for (var i = 1; i <= this._subject.subject.tasks.count; i++) {
      this.tasks.push(false);
    }
    for (var task of this.subject.tasks) {
      this.tasks[task - 1] = true;
    }

    this.completed = true;
    for (var req of this._subject.subject.tasks.requirements) {
      var count = 0;
      for (var t = req.start; t <= req.end; t++) {
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
