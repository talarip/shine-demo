import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './Login';
import CreateAccount from './CreateAccount';
// import { firebaseApp, login, setOnAuthChange, logout, createUser } from './firebaseApp';
// import { Database } from './Database';
import Invitation from './Invitation';
// const db = Database(firebaseApp);
// const refUsers = db().ref('Users');
// const refNetworks = db().ref('Networks');
// const refInvitations = db().ref('Invitations');

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
          { !!this.props.uid ? <Invitation userData={this.props} handleInvite={this.props.handleInvite} /> : '' }
          <Invitations {...this.props} />
          { !!this.props.uid ? <button onClick={this.props.handleLogOut}>Logout</button> : '' }
        </div>
      </div>
    );
  }
}

export default App;
