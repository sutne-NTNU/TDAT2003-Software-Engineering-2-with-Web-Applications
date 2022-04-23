// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';





/**
 * Renders alert messages using Bootstrap classes.
 */
export class Alert extends Component
{
  alerts: { id: number, text: React.Node, type: string }[] = [];
  static nextId = 0;



  render()
  {
    return (
      <>
        {this.alerts.map((alert, i) => (
          <div key = {alert.id} className = {'alert alert-' + alert.type} role = "alert">
            {alert.text}
            <button
              type = "button"
              className = "close"
              onClick = {() =>
              {
                this.alerts.splice(i, 1);
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </>
    );
  }



  static success(text: React.Node)
  {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() =>
    {
      for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'success' });
    });
  }



  static info(text: React.Node)
  {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() =>
    {
      for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'info' });
    });
  }



  static warning(text: React.Node)
  {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() =>
    {
      for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'warning' });
    });
  }



  static danger(text: React.Node)
  {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() =>
    {
      for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'danger' });
    });
  }
}





class NavBarLink extends Component<{ exact?: boolean, to: string, children?: React.Node }>
{
  render()
  {
    return (
      <NavLink className = "nav-link" activeClassName = "active" exact = {this.props.exact} to = {this.props.to}>
        {this.props.children}
      </NavLink>
    );
  }
}





/**
 * Renders a navigation bar using Bootstrap classes
 */
export class NavBar extends Component<{ brand?: React.Node, children?: React.Node }>
{
  static Link = NavBarLink;



  render()
  {
    return (
      <nav className = "navbar navbar-expand-sm bg-dark navbar-dark">
        {
          <NavLink className = "navbar-brand" activeClassName = "active" exact to = "/">
            {this.props.brand}
          </NavLink>
        }
        <ul className = "navbar-nav">{this.props.children}</ul>
      </nav>
    );
  }
}





/**
 * Renders an information card using Bootstrap classes
 */
export class Card extends Component<{ title: React.Node, children?: React.Node }>
{
  render()
  {
    return (
      <div className = "card">
        <div className = "card-body">
          <h5 className = "card-title">{this.props.title}</h5>
          <div className = "card-text">{this.props.children}</div>
        </div>
      </div>
    );
  }
}





/**
 * Renders a row using Bootstrap classes
 */
export class Row extends Component<{ children?: React.Node }>
{
  render()
  {
    return <div className = "row">{this.props.children}</div>;
  }
}





/**
 * Renders a column with specified width using Bootstrap classes
 */
export class Column extends Component<{ width?: number, right?: boolean, children?: React.Node }>
{
  render()
  {
    return (
      <div
        className = {'col' + (this.props.width ? '-' + this.props.width : '') + (this.props.right ? ' text-right' : '')}
      >
        {this.props.children}
      </div>
    );
  }
}





class ButtonRed extends Component<{
  onClick: () => mixed, // Any function
  children?: React.Node
}>
{
  render()
  {
    return (
      <button type = "button" className = "btn btn-danger"
              onClick = {this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}





class ButtonBlue extends Component<{
  onClick: () => mixed, // Any function
  children?: React.Node
}>
{
  render()
  {
    return (
      <button type = "button" className = "btn btn-primary"
              onClick = {this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}





class ButtonGreen extends Component<{
  onClick: () => mixed, // Any function
  children?: React.Node
}>
{
  render()
  {
    return (
      <button type = "button" className = "btn btn-success"
              onClick = {this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}





/**
 * Renders a button using Bootstrap classes
 */
export class Button
{
  static Red = ButtonRed;
  static Blue = ButtonBlue;
  static Green = ButtonGreen;
}





export class Link extends Component<{ to: React.Node, title: React.Node }>
{
  render()
  {
    return (
      <NavLink activeStyle = {{fontWeight: 'bold', color: 'darkblue' }}
               exact to = {this.props.to}>{this.props.title}
      </NavLink>
    );
  }
}





class FormInput extends Component<{ text?: React.Node }>
{
  text = '';



  render()
  {
    let text = this.props.text;
    return (
      <input
        type = "text"
        value = {this.text}
        onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.text = event.target.value)}>
      </input>
    );
  }



  mounted()
  {
    this.text = this.props.text;
  }
}





export class Form
{
  static input = FormInput;
}





class ListGroupItem extends Component<{
  href: React.Node,
  children?: React.Node
}>
{
  render()
  {
    return (
      <a className = "list-group-item list-group-item-action active"
         id = "list-home-list"
         data-toggle = "list"
         href = {this.props.href}
         role = "tab"
         aria-controls = "home">{this.props.children}
      </a>
    );
  }
}





export class ListGroup extends Component<{ children?: React.Node }>
{
  static item = ListGroupItem;



  render()
  {
    return (
      <div className = "row">
        <div className = "col-4">
          <div className = "list-group" id = "list-tab" role = "tablist">
            {this.props.children}
          </div>
        </div>
        <div className = "col-8">
          <div className = "tab-content" id = "nav-tabContent">
            <div className = "tab-pane fade show active" id = "list-home" role = "tabpanel"
                 aria-labelledby = "list-home-list">
            </div>
          </div>
        </div>
      </div>
    );
  }
}








