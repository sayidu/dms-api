import React from 'react';
import {render} from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import 'babel-polyfill';
import 'babel-core';

import _ from './styles/main.scss';

class App extends React.Component {
  render () {
    return (
    <div className="container">
         <div className="row">
            <div className="col s6" id="left">
              <h1> Welcome to Document Management System </h1>
              <i id="book" className="fa fa-book fa-5x" aria-hidden="true"></i>
            </div>
            <div className="col s6" id="right">
            <div>
              <div className="accessButtons right-align">
                 <a className="waves-effect waves-light btn" id="button1">Sign Up</a>
                 <a className="waves-effect waves-light btn" id="button2">Sign In</a>
              </div>
            </div>
              <div className="input-field col s10">
                   <input placeholder="User Name" id="user_name" value={this.state.credentials.username} type="text" className="validate"/>
              </div>
              <div className="input-field col s10">
                   <input placeholder="First Name" value={this.state.credentials.firstname} id="first_name" type="text" className="validate"/>
              </div>
              <div className="input-field col s10">
                   <input placeholder="Last Name" value={this.state.credentials.firstname} id="last_name" type="text" className="validate"/>
              </div>
              <div className="input-field col s10">
                   <input placeholder="Email" id="email" type="email" className="validate"/>
              </div>
              <div className="input-field col s10">
                   <i className="material-icons prefix">lock</i>
                   <input placeholder="Password" id="password" type="password" className="validate"/>
              </div>
              <p>
                  <a className="waves-effect waves-light btn" id="button">Sign Up</a>
              </p>
            </div>
         </div>
    </div>
    );
  }
}

render(<App/>, document.getElementById('container'));