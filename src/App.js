import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './Login';
import CreateAccount from './CreateAccount';
import { firebaseApp, login, setOnAuthChange, logout, createUser } from './firebaseApp';
import { Database } from './Database';
import Invitation from './Invitation';
const db = Database(firebaseApp);
const refUsers = db().ref('Users');
const refNetworks = db().ref('Networks');
const refInvitations = db().ref('Invitations');

console.log(db);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      email: null,
      uname: null,
      netId: null
    };
  }

  handleLogin(creds) {
    console.log('creds', creds);
    login(creds.email, creds.password, (user) => {
      const uid = user.uid;
      const currentUserRef = db().ref('Users/' + uid)
      currentUserRef
        .once('value')
        .then((data) => {
          const user = data.val();
          console.log(user);

          this.setState({
            uid: uid,
            email: user.email,
            uname: user.uname,
            netId: user.netId
          });
        });
    });
  }

  handleCreateAccount(creds) {
    createUser(creds.email, creds.password, (user) => {
      const uname = user.email.split('@')[0];

      console.log('adding user', user);
      const userNetwork = refNetworks
        .push({
          uid: user.uid
        });

      userNetwork
        .child('members')
        .set({
          [user.uid]: user.email
        });

      const userInfo = refUsers.child(user.uid);

      userInfo
        .set({
          email: user.email,
          uname: user.email.split('@')[0],
          netId: userNetwork.key,
          myNetwork: {
            [userNetwork.key]: userNetwork.key
          }
        });

      this.setState({
        uid: user.uid,
        email: user.email,
        uname: uname,
        netId: userNetwork.key
      });
    });
  }

  handleInvite(invitation) {
    console.log(this.state);
    console.log('invitation', invitation);

    const userInvitations = refInvitations.child(this.state.netId);

    userInvitations
      .push({
        email: invitation.email,
        timestamp: (new Date()).toString(),
        netId: this.state.netId,
        accepted: 0
      });
  }


  handleLogOut() {
    this.setState({
      uid: null,
      email: null,
      uname: null,
      netId: null
    });

    logout();
  }

  componentDidMount() {
    console.log('logging in');
    setOnAuthChange((user) => {
      if (!user || !user.uid) {
        this.setState({uid: null});
        return;
      }

      console.log(user);
      this.setState({uid: user.uid});
    });
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Welcome To Shine Bright
        </p>
        <div className="container">
          { !this.state.uid  ? <CreateAccount handleCreateAccount={this.handleCreateAccount.bind(this)} /> : ''}
          { !this.state.uid  ? <hr className="hr-text" data-content="Or" /> : ''}
          { !this.state.uid  ? <Login handleLogin={this.handleLogin.bind(this)} /> : ''}
          { !!this.state.uid ? <Invitation handleInvite={this.handleInvite.bind(this)} /> : '' }
          { !!this.state.uid ? <button onClick={this.handleLogOut.bind(this)}>Logout</button> : '' }
        </div>
      </div>
    );
  }
}

export default App;
