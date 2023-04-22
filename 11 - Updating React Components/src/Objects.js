export class Course {
  code: string;
  title: string;

  constructor(code: string, title: string) {
    this.code = code;
    this.title = title;
  }
}

export class Student {
  static nextId = 24586;
  id: number;

  firstName: string;
  lastName: string;
  email: string;
  courses: Course[];

  constructor(firstName: string, lastName: string, email: string, courses: Course[]) {
    this.id = Student.nextId++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.courses = courses;
  }
}
