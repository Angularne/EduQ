import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {SubjectService} from "../../../../services/subject.service";
import {Subject} from "../../../../interfaces/subject";
import {ConfirmModalOptions, ConfirmModalComponent} from "../../../confirm.modal/confirm.modal";


@Component({
  selector: "admin-subjects-all",
  templateUrl: "app/components/admin/subjects/all/all.html",
  directives: [ROUTER_DIRECTIVES, ConfirmModalComponent]
})
export class AdminSubjectsAllComponent {
  subjects: Subject[];
  filteredSubjects: Subject[];
  modal: ConfirmModalOptions = {};

  constructor(private subjectService: SubjectService) { }

  ngOnInit() {
    this.subjectService.getAllSubjects().subscribe(res => {
      this.subjects = res;
      this.filteredSubjects = res;
    });
  }

  ngOnDestroy() {
    ($(".modal-backdrop") as any).remove();
  }

  filter(query: string) {
    let regexp = new RegExp(query, "i");

    this.filteredSubjects = this.subjects.filter(u => {
      return regexp.test(u.code + " " + u.name);
    });
  }

  delete(subject: Subject) {
        /** Setup modal */
        this.modal = {
          title: "Delete Subject",
          body: "Are you sure you want to delete subject " + subject.code + " " + subject.name + "?",
          confirmed: (con) => {
            if (con) {
              this.subjectService.deleteSubject(subject.code).subscribe((res) => {
                this.ngOnInit();
              });
            }
          }
        };

        ($("#confirmModal") as any).modal("show");
  }
}
