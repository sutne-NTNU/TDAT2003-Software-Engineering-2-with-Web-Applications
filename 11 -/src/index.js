// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { Component, sharedComponentData } from 'react-simplified';
import { createHashHistory } from 'history';

import { Alert, Button, Card, Column, Form, Link, NavBar, Row } from './widgets';
import { Course, Student } from './Objects';

const history = createHashHistory();



let shared = new sharedComponentData({
		courses: [
			new Course('TDAT2001', 'Realfag for dataingeniører'),
			new Course('TDAT2002', 'Mattematikk 2'),
			new Course('TDAT2003', 'Systemutvikling 2'),
			new Course('TDAT2005', 'Algoritmer og Datastrukturer')
		]
	}, { students: [] }
);

shared.students = [
	new Student('Ola', 'Jensen', 'ola.jensen@ntnu.no', [shared.courses[0], shared.courses[1], shared.courses[2]]),
	new Student('Kari', 'Larsen', 'kari.larsen@ntnu.no', [shared.courses[1], shared.courses[2], shared.courses[3]]),
	new Student('Bjørn', 'Bjørnson', 'bjørn.bjørnson@ntnu.no', [shared.courses[1], shared.courses[3]]),
	new Student('Kristoffer', 'Kristoffersen', 'kristoffer.kristoffersen@ntnu.no', [shared.courses[0], shared.courses[2], shared.courses[3]]),
	new Student('Sivert', 'Utne', 'sivvi@ntnu.no', shared.courses)
];





class Menu extends Component
{
	render()
	{
		return (
			<NavBar brand = "Øving 11">
				<NavBar.Link to = "/students">Students</NavBar.Link>
				<NavBar.Link to = "/courses">Courses</NavBar.Link>
			</NavBar>
		);
	}
}





class Home extends Component
{
	render()
	{
		return (
			<Card title = "Systemutvikling 2 - Oppdatering av komponentvisninger i React">
				<br/>Som i forrige øving skal du ha med påmeldte fag i student-visningen, og visning for fag med påmeldte studenter.
				<br/>
				<br/>I tillegg legg til muligheter for å:
				<br/>
				<br/>legge til, slette og endre studenter
				<br/>legge til, slette og endre fag
				<br/>Frivillig: legge til studenter i fag, og ta bort studenter fra fag
				<br/>Frivillig: prøv å lag andre gjenbrukbare komponenter i src/widgets.js-filen slik at du slipper å bruke bootstrap-klasser i src/index.js-filen. For eksempel kan følgende widgets lages i tillegg:
				<br/>
				<br/>Button.Success, Button.Light
				<br/>Form.Input
				<br/>ListGroup, ListGroup.Item
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
				<Row>
					<Column>
						<Button.Blue onClick = {() => history.push('/courses/add')}>Add Course</Button.Blue>
					</Column>
				</Row>
				<br/>
				{shared.courses.map(course => (
					<Row key = {course.code}>
						<Column width = {3}>
							<Link to = {'/courses/' + course.code} title = {course.title}/>
						</Column>
					</Row>
				))}
			</Card>
		);
	}
}





class CourseAdd extends Component
{
	code = '';
	title = '';



	render()
	{
		return (
			<Card title = "Add Course">
				<form>
					<Row>
						<Column width = {2}>Code</Column>
						<Column>
							<input
								type = "text"
								value = {this.code}
								size = '30'
								onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.code = event.target.value)}
							/>
						</Column>
					</Row>
					<Row>
						<Column width = {2}>Title</Column>
						<Column>
							<input
								type = "text"
								value = {this.title}
								size = '30'
								onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.title = event.target.value)}
							/>
						</Column>
					</Row>
					<br/>
					<Row>
						<Column width = {2}/>
						<Column><Button.Green onClick = {this.save}>Add</Button.Green></Column>
					</Row>
				</form>
			</Card>
		);
	}



	save()
	{
		this.code = this.code.toUpperCase();
		if (shared.courses.find(course => course.code == this.code))
		{
			Alert.danger('A Course with code ' + this.code + ' already exists');
			return;
		}

		let course = new Course(this.code, this.title);
		if (!course)
		{
			Alert.danger('Something went wrong when adding the course, please try again');
			return;
		}

		shared.courses.push(course);
		history.push('/courses/' + this.code + '/edit');
	};
}





class CourseDetails extends Component<{ match: { params: { code: string } } }>
{
	render()
	{
		if (this.props.match.params.code == 'add')
		{
			return null;
		}
		let course = shared.courses.find(course => course.code == this.props.match.params.code);
		if (!course)
		{
			Alert.danger('subject ' + this.props.match.params.code + ' does not exist');
			return null;
		}
		let course_students = shared.students.filter(student => student.courses.find(scourse => scourse.code == course.code));
		return (
			<Card title = "Details">
				<Row>
					<Column width = {2}/>
					<Row>
						<Column>
							<Button.Blue
								onClick = {() => history.push('/courses/' + course.code + '/edit')}>edit
							</Button.Blue>
						</Column>
					</Row>
					<Column>
						<Button.Red
							onClick = {this.delete}>delete
						</Button.Red>
					</Column>
				</Row>
				<br/>
				<Row>
					<Column width = {2}>Code</Column>
					<Column>{course.code}</Column>
				</Row>
				<Row>
					<Column width = {2}>Title</Column>
					<Column>{course.title}</Column>
				</Row>
				<br/>
				<Card title = {'Students'}>
					{course_students.map(student => (
						<Row key = {student.id}>
							<Column width = {2}>
								{student.firstName + ' ' + student.lastName}
							</Column>
						</Row>))}
				</Card>
			</Card>
		);
	}



	delete()
	{
		history.push('/courses');
		let course = shared.courses.find(course => course.code == this.props.match.params.code);
		shared.students.map(student => student.courses = student.courses.filter(rcourse => rcourse.code != course.code));
		shared.courses = shared.courses.filter(rcourse => rcourse.code != course.code);
		Alert.success(course.title + ' was deleted');
	}
}





class CourseEdit extends Component<{ match: { params: { code: string } } }>
{
	code = '';
	title = '';
	course_students = [];
	not_course_students = [];



	render()
	{
		return (
			<Card title = "Edit">
				<form>
					<Row>
						<Column width = {2}>Code</Column>
						<Column>{this.code}</Column>
					</Row>
					<Row>
						<Column width = {2}>Title</Column>
						<Column>
							<input
								type = "text"
								value = {this.title}
								size = "30"
								onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.title = event.target.value)}/>
						</Column>
					</Row>
					<br/>
					<Row>
						<Column width = {2}/>
						<Column>
							<Button.Green onClick = {this.save}>Save</Button.Green>
						</Column>
					</Row>
					<br/>
					<Card title = {'Students'}>
						<Row>
							<Column>
								{this.course_students.map(student =>
									<Row key = {student.id}>
										<Column width = {2}>{student.firstName + ' ' + student.lastName}</Column>
										<Column>
											<Button.Red onClick = {() => this.remove(student)}>remove</Button.Red>
										</Column>
									</Row>)}
							</Column>
						</Row>
						<br/>
						<Row>
							<Column>
								{this.not_course_students.map(student =>
									<Row key = {student.id}>
										<Column width = {2}>{student.firstName + ' ' + student.lastName}</Column>
										<Column>
											<Button.Green
												onClick = {() => this.add(student)}>add</Button.Green>
										</Column>
									</Row>)}
							</Column>
						</Row>
					</Card>
				</form>
			</Card>
		);
	}



	mounted()
	{
		let course = shared.courses.find(course => course.code == this.props.match.params.code);
		if (!course)
		{
			Alert.danger('Course not found: ' + this.props.match.params.code);
			history.push('/courses');
			return;
		}
		this.code = course.code;
		this.title = course.title;
		this.course_students = shared.students.filter(student => student.courses.find(scourse => scourse.code == this.code));
		this.not_course_students = shared.students.filter(student => !student.courses.find(scourse => scourse.code == this.code));
	}



	remove(stud: Student)
	{
		this.course_students = this.course_students.filter(student => student.id != stud.id);
		this.not_course_students.push(stud);
	}



	add(stud: Student)
	{
		this.not_course_students = this.not_course_students.filter(student => student.id != stud.id);
		this.course_students.push(stud);
	}



	save()
	{
		let course = shared.courses.find(course => course.code == this.code);
		if (!course)
		{
			Alert.danger('Course not found: ' + this.props.match.params.code);
			return;
		}
		course.title = this.title;

		//går igjennom alle studentene
		shared.students.map(student =>
			//true hvis stud er i course_student tabellen, false ellers
			(this.course_students.find(cstudent => cstudent.id == student.id)) ?

				//studenten skal ha faget
				(student.courses.find(scourse => scourse.code == this.code) ?
					//studenten har allerede faget - trenger ikke gjøre noe
					null
					:
					//legger til faget for studenten
					student.courses.push(course))
				:

				//studenten skal ikke ha faget
				(student.courses.find(scourse => scourse.code == this.code) ?
						//faget fjernes fra studenten
						student.courses = student.courses.filter(scourse => scourse.code != this.code)
						:
						//studenten har ikke faget - trenger ikke gjøre noe
						null
				)
		);
		history.push('/courses/' + course.code);
	}
}





class StudentList extends Component
{
	render()
	{
		return (
			<Card title = "Students">
				<Row>
					<Column>
						<Button.Blue onClick = {() => history.push('/students/add')}>Add Student</Button.Blue>
					</Column>
				</Row>
				<br/>
				{shared.students.map(student => (
					<Row key = {student.id}>
						<Column width = {2}>
							<Link to = {'/students/' + student.id}
							      title = {student.firstName + ' ' + student.lastName}/>
						</Column>
					</Row>
				))}
			</Card>
		);
	}
}





class StudentAdd extends Component
{
	firstName = '';
	lastName = '';
	email = '';
	courses = [];



	render()
	{
		let not_signed = shared.courses.filter(x => !this.courses.find(y => x.code == y.code));
		return (
			<Card title = "Add student">
				<form>
					<Row>
						<Column width = {2}>First name</Column>
						<Column>
							<input
								type = "text"
								value = {this.firstName}
								onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.firstName = event.target.value)}
							/>
						</Column>
					</Row>
					<Row>
						<Column width = {2}>Last name</Column>
						<Column>
							<input
								type = "text"
								value = {this.lastName}
								onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.lastName = event.target.value)}
							/>
						</Column>
					</Row>
					<Row>
						<Column width = {2}>Email</Column>
						<Column>
							<input
								type = "text"
								value = {this.email}
								onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.email = event.target.value)}
							/>
						</Column>
					</Row>
					<Row>
						<Column width = {2}/>
						<Column><Button.Green onClick = {this.save}>Add Student</Button.Green></Column>
					</Row>
					<br/>
					<Card title = 'Courses'>
						<Row>
							<Column>
								{this.courses.map(course =>
									<Row key = {course.code}>
										<Column width = {3}>{course.code + ' ' + course.title}</Column>
										<Column>
											<Button.Red
												onClick = {() => {this.courses = this.courses.filter(scourse => scourse.code != course.code);}}>remove</Button.Red>
										</Column>
									</Row>)}
							</Column>
						</Row>
						<br/>
						<Row>
							<Column>
								{not_signed.map(course =>
									<Row key = {course.code}>
										<Column width = {3}>{course.code + ' ' + course.title}</Column>
										<Column>
											<Button.Green onClick = {() => this.courses.push(course)}>add</Button.Green>
										</Column>
									</Row>)}
							</Column>
						</Row>
					</Card>
				</form>
			</Card>
		);
	}



	save()
	{
		let student = new Student(this.firstName, this.lastName, this.email, this.courses);
		if (!student)
		{
			Alert.danger('Something went wrong when adding the student, please try again');
			return;
		}

		shared.students.push(student);
		history.push('/students/' + student.id);
	};
}





class StudentDetails extends Component<{ match: { params: { id: number } } }>
{
	render()
	{
		if (this.props.match.params.id == 'add')
		{
			return null;
		}
		let student = shared.students.find(student => student.id == this.props.match.params.id);
		if (!student)
		{
			Alert.danger('Student not found: ' + this.props.match.params.id);
			return null;
		}
		return (
			<Card title = "Details">
				<Row>
					<Column width = {2}/>
					<Row>
						<Column> <Button.Blue onClick = {this.edit}>edit</Button.Blue></Column>
						<Column> <Button.Red onClick = {this.delete}>delete</Button.Red></Column>
					</Row>
				</Row>
				<br/>
				<Row>
					<Column width = {2}>Student ID</Column>
					<Column>{student.id}</Column>
				</Row>
				<Row>
					<Column width = {2}>First name</Column>
					<Column>{student.firstName}</Column>
				</Row>
				<Row>
					<Column width = {2}>Last name</Column>
					<Column>{student.lastName}</Column>
				</Row>
				<Row>
					<Column width = {2}>Email</Column>
					<Column>{student.email}</Column>
				</Row>
				<br/>
				<Row>
					<Column width = {2}>Courses</Column>
					<Column>
						{student.courses.map(course =>
							<Row key = {course.code}>
								<Column width = {4}>{course.code + ' ' + course.title}</Column>
							</Row>)}
					</Column>
				</Row>
			</Card>
		);
	}



	edit()
	{
		history.push('/students/' + this.props.match.params.id + '/edit');
	}



	delete()
	{
		history.push('/students');
		let student = shared.students.find(student => student.id == this.props.match.params.id);
		shared.students = shared.students.filter(rstudent => rstudent.id != this.props.match.params.id);
		Alert.success('Student ' + student.firstName + ' ' + student.lastName + ' was deleted');
	}
}





class StudentEdit extends Component<{ match: { params: { id: number } } }>
{
	id = '';
	firstName = '';
	lastName = '';
	email = '';
	courses = [];



	render()
	{
		let not_signed = shared.courses.filter(x => !this.courses.find(y => x.code == y.code));
		return (
			<Card title = "Edit">
				<form>
					<Row>
						<Column width = {2}/>
						<Column><Button.Green onClick = {this.save}>Save</Button.Green></Column>
					</Row>
					<br/>
					<Row>
						<Column width = {2}>Student ID</Column>
						<Column>{this.id}</Column>
					</Row>
					<Row>
						<Column width = {2}>First name</Column>
						<Column><Form.input text = {this.firstName}/></Column>
					</Row>
					<Row>
						<Column width = {2}>Last name</Column>
						<Column>
							<input
								type = "text"
								value = {this.lastName}
								onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.lastName = event.target.value)}
							/>
						</Column>
					</Row>
					<Row>
						<Column width = {2}>Email</Column>
						<Column>
							<input
								type = "text"
								value = {this.email}
								onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.email = event.target.value)}
							/>
						</Column>
					</Row>
					<br/>
					<Card title = 'Courses'>
						<Row>
							<Column>{this.courses.map(course =>
								<Row key = {course.code}>
									<Column width = {3}>
										{course.code + ' ' + course.title}
									</Column>
									<Column><Button.Red
										onClick = {() => {this.courses = this.courses.filter(scourse => scourse.code != course.code);}}>remove</Button.Red></Column>
								</Row>)}
							</Column>
						</Row>
						<br/>
						<Row>
							<Column>{not_signed.map(course =>
								<Row key = {course.code}>
									<Column width = {3}>
										{course.code + ' ' + course.title}
									</Column>
									<Column>
										<Button.Green onClick = {() => this.courses.push(course)}>add</Button.Green>
									</Column>
								</Row>)}
							</Column>
						</Row>
					</Card>
				</form>
			</Card>
		);
	}



	mounted()
	{
		let student = shared.students.find(student => student.id == this.props.match.params.id);
		if (!student)
		{
			Alert.danger('Student ' + this.props.match.params.id + ' doesn\'t exist');
			return;
		}

		this.id = student.id;
		this.firstName = student.firstName;
		this.lastName = student.lastName;
		this.email = student.email;
		this.courses = student.courses;
	}



	save()
	{
		let student = shared.students.find(student => student.id == this.props.match.params.id);
		if (!student)
		{
			Alert.danger('Student not found: ' + this.props.match.params.id);
			return;
		}

		student.firstName = this.firstName;
		student.lastName = this.lastName;
		student.email = this.email;
		student.courses = this.courses;

		history.push('/students/' + student.id);
	}
}





const root = document.getElementById('root');
if (root)
{
	ReactDOM.render(
		<HashRouter>
			<div>
				<Alert/>
				<Menu/>
				<Route exact path = "/" component = {Home}/>
				<Route path = "/students" component = {StudentList}/>
				<Route exact path = "/students/add" component = {StudentAdd}/>
				<Route exact path = "/students/:id" component = {StudentDetails}/>
				<Route exact path = "/students/:id/edit" component = {StudentEdit}/>
				<Route path = "/courses" component = {CourseList}/>
				<Route exact path = "/courses/add" component = {CourseAdd}/>
				<Route exact path = "/courses/:code" component = {CourseDetails}/>
				<Route exact path = "/courses/:code/edit" component = {CourseEdit}/>
			</div>
		</HashRouter>,
		root
	);
}
