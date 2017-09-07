import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import Login from './Login';
import CreateAccount from './CreateAccount';

const Invitations = (props) => {
  console.log('invitations props', props);
  if (!props.uid || !props.invitations || !props.invitations.length) {
    return null;
  }

  return (
    <div>
      <h4>Invitations</h4>
      <ul>
        {props.invitations.map(
          (invitation, index) =>
            <li key={index}>{invitation.email + ' - ' + invitation.accepted}</li>
        )}
      </ul>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Welcome To Shine Bright
        </p>

        <div className="container">
          { !this.props.uid  ? <CreateAccount handleCreateAccount={this.props.handleCreateAccount} /> : ''}
          { !this.props.uid  ? <hr className="hr-text" data-content="Or" /> : ''}
          { !this.props.uid  ? <Login handleLogin={this.props.handleLogin} /> : ''}
        </div>
      </div>
    );
  }
}

export default App;
