import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from 'angular2/core';
import {RangePipe} from '../../../common/range';
import {Requirement} from '../../../interfaces/subject';
@Component({
  selector: 'edit-requirement',
  templateUrl: 'app/components/edit.subject/requirement/requirement.html',
  pipes: [RangePipe]
})
export class EditRequirementComponent implements OnInit, OnChanges {
  @Input()  requirements: Requirement[];
  @Input() count: number;


  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    // Validate requirement
    /*
    if (this.requirement.end <= 0) {
      this.requirement.end = 1;
    }
    if (this.requirement.end> this.count) {
      this.requirement.end = this.count;
    }
    if (this.requirement.start < 1) {
      this.requirement.start = 1;
    }
    if (this.requirement.start > this.requirement.end) {
      this.requirement.start = this.requirement.end;
    }
    if (this.requirement.required > (this.requirement.end - this.requirement.start + 1)) {
      console.log(this.requirement.required);
      this.requirement.required = this.requirement.end - this.requirement.start + 1;
    }*/
  }

  add() {
    this.requirements.push({from: 1, to:this.count, required: 1});
  }

  remove(i: number) {
    this.requirements.splice(i, 1);
  }
}
