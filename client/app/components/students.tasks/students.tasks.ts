import {Component, OnInit} from "@angular/core";
import {RouteParams, ROUTER_DIRECTIVES, Router} from "@angular/router-deprecated";
import {SubjectService} from "../../services/subject.service";
import {Subject, SubjectUser} from "../../interfaces/subject";
@Component({
  selector: "students-tasks",
  templateUrl: "app/components/students.tasks/students.tasks.html",
  directives: [ROUTER_DIRECTIVES]
})

export class StudentsTasksComponent implements OnInit {
  subject: Subject;
  students: SubjectUser[];

  constructor(private subjectService: SubjectService, private routeParams: RouteParams, private router: Router) { }


  ngOnInit() {

    let code = this.routeParams.get("code");
    if (code) {
      this.subjectService.getSubject(code).subscribe(sub => {
        this.subject = sub;
        // Filter Students
        this.students = this.subject.users.filter((usr) => {
          return usr.role === "Student";
        });

        this.mapTasks();
      });
    }
  }

  /* Map tasks */
  mapTasks() {
    for (let stud of this.students) {
      let tasks = [];
      for (let i = 0; i < this.subject.tasks.length; i++) {
        tasks.push({
        number: i + 1,
        title: this.subject.tasks[i].title
        });
      }
      if (stud.tasks) {
        for (let task of stud.tasks) {
          let t = tasks[task.number - 1];
          t.completed = true;
          t.date = new Date(task.date).toLocaleDateString();
          t.approvedBy = task.approvedBy;
        }
      }
      stud.tasks = tasks;
      this.checkTasks(stud);
    }
  }

  setTask(user, task, completed: boolean = null) {
    task.completed = completed != null ? completed : !(task.completed || false);
    this.checkTasks(user);
  }

  // Check if requirements are met
  checkTasks(user) {
    user.completed = true;
    for (let req of this.subject.requirements) {
      let count = 0;
      for (let t = req.from; t <= req.to; t++) {
        if (user.tasks[t - 1].completed) {
          count++;
        }
      }
      if (count < req.required) {
        user.completed = false;
        break;
      }
    }
  }



  save() {

    let users: {
      _id: string,
      tasks: number[]
    }[] = [];

    for (let stud of this.students) {
      let u = {
        _id: stud._id,
        tasks: []
      };

      for (let task of stud.tasks) {
        if (task.completed) {
          u.tasks.push(task.number);
        }
      }
      users.push(u);
    }

    this.subjectService.updateTasks(this.subject.code, users).subscribe((res) => {
      if (res) {
        // saving
        this.close();
      } else {
        // not
      }
    });
  }


  close() {
    let path = this.router.parent.parent.currentInstruction.component.routeName;
    switch (path) {
      case "AdminSubjectsPath":
      this.router.parent.navigate([this.router.parent.parent.currentInstruction.component.routeName]);
      break;

      case "SubjectsPath":
      this.router.parent.navigate([this.router.parent.parent.currentInstruction.component.routeName, "QueuePath", {code: this.subject.code}]);
      break;
    }
  }
}
