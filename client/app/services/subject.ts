export class Subject {
  id: number;
  name: string;
  constructor(id:number, name:string) {
    this.id = id;
    this.name = name;
  }
}

export class SubjectService {
  subjects: Subject[] = [];
  constructor() {
    this.subjects.push(new Subject(1, "Maths"));
    this.subjects.push(new Subject(2, "Computers"));
  }
  getSubjects() {
    return this.subjects;
  }
}
