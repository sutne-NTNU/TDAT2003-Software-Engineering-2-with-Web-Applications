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