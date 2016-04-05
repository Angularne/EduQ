import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from 'angular2/core';
import {RangePipe} from '../../../common/range';
import {BSColDirective} from '../../../directives/bs.col.directive';

@Component({
  selector: 'edit-requirement',
  templateUrl: 'app/components/edit.subject/requirement/requirement.html',
  directives: [BSColDirective],
  pipes: [RangePipe]
})
export class EditRequirementComponent implements OnInit, OnChanges {
  @Input()  requirement: Requirement;
  @Input() count: number;

  @Output() remove: EventEmitter<any> = new EventEmitter();


  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    // Validate requirement
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
    }
  }

  private setStart(start) {
    this.requirement.start = +start;
  }
  private setEnd(end) {
    this.requirement.end = +end;
  }
  private setRequired(required) {
    this.requirement.required = +required;
  }
}

interface Requirement {
  start: number;
  end: number;
  required: number;
}
