import {Component, OnInit, Input} from 'angular2/core';
import {SubjectService} from '../../services/subject';
import {Subject} from '../../interfaces/subject';
import {EditRequirementComponent} from './requirement/requirement';
import {BSColDirective} from '../../directives/bs.col.directive';


@Component({
  selector: 'edit-subject',
  templateUrl: 'app/components/edit.subject/edit.subject.html',
  directives: [EditRequirementComponent, BSColDirective]
})
export class EditSubjectComponent implements OnInit {
  @Input() subject: Subject;
  @Input() new: boolean = false;

  constructor(private subjectService: SubjectService) { }


  ngOnInit() {
    if (!this.subject) {
      this.subject = {
        code: '',
        name: '',
        broadcasts: [],
        queue: null,
        tasks: {
          requirements: [],
          count: 0
        },
        students: null
      }
    }
  }

  addRequirement() {
    this.subject.tasks.requirements.push({start:1, end: this.subject.tasks.count, required:1});
  }

  removeRequirement(index: number) {
    this.subject.tasks.requirements.splice(index, 1);
  }

  validateRequirement(req: any) {
    console.log(req);
    if (req.end - req.start + 1 < req.required) {
      req.required = req.end - req.start + 1;
    }
  }

}
