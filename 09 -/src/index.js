// @flow
/* eslint eqeqeq: "off" */


import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Alert, Card, Column, NavBar, Row } from './components';

const root = document.getElementById('root');



if (root)
{
  let div = document.createElement('div');
  root.appendChild(div);

  let b = document.createElement('b');
  b.innerText = 'Hello World';
  div.appendChild(b);
}



class Course
{
  code: string;
  title: string;



  constructor(code: string, title: string)
  {
    this.code = code;
    this.title = title;
  }
}



class Student
{
  static nextId = 24586;
  id: number;

  firstName: string;
  lastName: string;
  email: string;
  courses: Course[];



  constructor(firstName: string, lastName: string, email: string, courses: Course[])
  {
    this.id = Student.nextId++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.courses = courses;
  }
}



let tdat2001 = new Course('TDAT2001', 'Realfag for dataingeniører');
let tdat2002 = new Course('TDAT2002', 'Mattematikk 2');
let tdat2003 = new Course('TDAT2003', 'Systemutvikling 2');
let tdat2005 = new Course('TDAT2005', 'Algoritmer og Datastrukturer');

let courses = [
  tdat2001,
  tdat2002,
  tdat2003,
  tdat2005
];

let students = [
  new Student('Ola', 'Jensen', 'ola.jensen@ntnu.no', [tdat2001, tdat2002, tdat2003]),
  new Student('Kari', 'Larsen', 'kari.larsen@ntnu.no', [tdat2002, tdat2003, tdat2005]),
  new Student('Bjørn', 'Bjørnson', 'bjørn.bjørnn@ntnu.no', [tdat2002, tdat2003]),
  new Student('Ole', 'Hansen', 'ole.hansen@ntnu.no', [tdat2005, tdat2001]),
  new Student('Bjarne', 'Guttulsrød', 'bjarne.abdullah@ntnu.no', [tdat2005, tdat2001, tdat2003]),
  new Student('Sivert', 'Utne', 'sivvi@ntnu.no', [tdat2001, tdat2003, tdat2005])
];



class Home extends Component
{
  render()
  {
    return <Card
      title = "React example with static pages">User input and application state are covered next week.</Card>;
  }
}



class Menu extends Component
{
  render()
  {
    return (
      <NavBar>
        <NavBar.Link to = "/students">Students</NavBar.Link>
        <NavBar.Link to = "/courses">Courses</NavBar.Link>
      </NavBar>
    );
  }
}



class StudentList extends Component
{
  render()
  {
    return (
      <Card title = "Students">
        {students.map(student => (
          <Row key = {student.id}>
            <Column width = {2}>
              <NavLink activeStyle = {{ color: 'darkblue' }} exact to = {'/students/' + student.id}>
                {student.firstName} {student.lastName}
              </NavLink>
            </Column>
          </Row>
        ))}
      </Card>
    );
  }
}



class CourseList extends Component
{
  render()
  {
    return (
      <Card title = "Courses">
        {courses.map(course => (
          <Row key = {course.code}>
            <Column width = {5}>
              <NavLink activeStyle = {{ color: 'darkblue' }} exact to = {'/courses/' + course.code}>
                {course.title}
              </NavLink>
            </Column>
          </Row>
        ))}
      </Card>
    );
  }
}



class CourseDetails extends Component<{ match: { params: { code: string } } }>
{
  render()
  {
    let course = courses.find(course => course.code === this.props.match.params.code);
    let course_students = students.filter(student => student.courses.find(scourse => scourse.code == course.code));

    if (!course)
    {
      Alert.danger('subject ' + this.props.match.params.code + ' does not exist');
      return null;
    }
    return (
      <Card title = {course.code + ' - ' + course.title}>
        <Card title = {'Students'}>{course_students.map(student => (
          <Row key = {student.id}>
            <Column width = {2}>
              {student.firstName + ' ' + student.lastName}
            </Column>
          </Row>))}
        </Card>
      </Card>
    );
  }
}



class StudentDetails extends Component<{ match: { params: { id: number } } }>
{
  render()
  {
    let student = students.find(student => student.id == this.props.match.params.id);
    if (!student)
    {
      Alert.danger('Student not found');
      return null;
    }
    return (
      <Card title = {student.firstName + ' ' + student.lastName}>
        <Row>
          <Column width = {1}>Student ID</Column>
          <Column>{student.id}</Column>
        </Row>
        <Row>
          <Column width = {1}>Email</Column>
          <Column>{student.email}</Column>
        </Row>
        <Row><br/></Row>
        <Row>
          <Column width = {1}>Courses</Column>
          <Column>{student.courses.map(course =>
            <Row key = {course.code}>
              <Column width = {4}>
                {course.code + ' ' + course.title}
              </Column>
            </Row>)}</Column>
        </Row>
      </Card>
    );
  }
}



if (root)
{
  ReactDOM.render(
    <HashRouter>
      <div>
        <Menu/>
        <Route exact path = "/" component = {Home}/>
        <Route path = "/students" component = {StudentList}/>
        <Route path = "/students/:id" component = {StudentDetails}/>
        <Route path = "/courses" component = {CourseList}/>
        <Route path = "/courses/:code" component = {CourseDetails}/>
      </div>
    </HashRouter>,
    root
  );
}