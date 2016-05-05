import {Component, Input, OnChanges} from "@angular/core";
import {RangePipe} from "../../../common/range";
import {Task} from "../../../interfaces/subject";

@Component({
  selector: "edit-tasks",
  templateUrl: "app/components/edit.subject/task/task.html",
  pipes: [RangePipe]
})
export class EditTaskComponent implements OnChanges {

  @Input()  tasks: Task[] = [];

  constructor() { }

  ngOnChanges() {
    this.tasks.sort((a, b) => {
      return a.number - b.number;
    });
  }

  add() {
    this.tasks.push({number: this.tasks.length + 1, title: ""});
  }

  remove(i: number) {
    this.tasks.splice(i, 1);
    for (let t = i; t < this.tasks.length; t++) {
      this.tasks[t].number--;
    }
  }

  moveTaskUp(i) {
    if (i > 0 && i < this.tasks.length) {
      this.tasks[i].number--;
      this.tasks[i - 1].number++;

      let tmp = this.tasks[i];
      this.tasks[i] = this.tasks[i - 1];
      this.tasks[i - 1] = tmp;
    }
  }

  moveTaskDown(i) {
    if (i >= 0 && i < this.tasks.length - 1) {
      this.tasks[i].number++;
      this.tasks[i + 1].number--;

      let tmp = this.tasks[i];
      this.tasks[i] = this.tasks[i + 1];
      this.tasks[i + 1] = tmp;
    }
  }
}
