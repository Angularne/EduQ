import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from 'angular2/core';
import {RangePipe} from '../../../common/range';
import {Requirement} from '../../../interfaces/subject';
@Component({
  selector: 'edit-requirement',
  templateUrl: 'app/components/edit.subject/requirement/requirement.html',
  pipes: [RangePipe]
})
export class EditRequirementComponent implements OnInit, OnChanges {
  @Input() requirements: Requirement[];
  @Input() count: number;


  changeFrom(req: Requirement, x: number) {
    req.from = +x;
  }
  changeTo(req: Requirement, x: number) {
    req.to = +x;
  }
  changeReq(req: Requirement, x: number) {
    req.required = +x;
  }

  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    // Validate requirement


    for (var req of this.requirements) {
      if (req.to <= 0) {
        req.to = 1;
      }
      if (req.to> this.count) {
        req.to = this.count;
      }
      if (req.from < 1) {
        req.from = 1;
      }
      if (req.from > req.to) {
        req.from = req.to;
      }
      if (req.required > (req.to - req.from + 1)) {
        console.log(req.required);
        req.required = req.to - req.from + 1;
      }
    }

  }

  add() {
    this.requirements.push({from: 1, to:this.count, required: 1});
  }

  remove(i: number) {
    this.requirements.splice(i, 1);
  }
}
