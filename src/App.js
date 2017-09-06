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

const Invitations = (props) => {
  console.log('invitations props', props);
  if (!props.uid || !props.invitations || !props.invitations.length) {
    return null;
  }

  return (<ul>
    {props.invitations.map(
      (invitation, index) =>
        <li key={index}>{invitation.email + ' - ' + invitation.accepted}</li>
    )}
  </ul>);
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      email: null,
      uname: null,
      netId: null,
      invitations: []
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
          console.log('current user', user);

          this.setState({
            uid: uid,
            email: user.email,
            uname: user.uname,
            netId: user.netId
          });

          this.queryInvitations();
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
        netId: userNetwork.key,
        invitations: []
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

  queryInvitations() {
    if (!this.state.netId) {
      return '';
    }

    return refInvitations
      .child(this.state.netId)
      .once('value')
      .then((data) => {
        return data.val();
      })
      .then((invitations) => {
        if (!invitations) {
          return '';
        }

        const invitationsList = Object
          .keys(invitations)
          .map((key) => {
            return {
              'email': invitations[key].email,
              'accepted': (invitations[key].accepted ? 'Accepted' : 'Pending')
            };
          });

        this.setState({
          invitations: invitationsList
        })
      })
  }

  renderInvitations() {
    if (!this.uid || !this.state.invitations || !this.state.invitations.length) {
      return '';
    }


    return this
      .state
      .invitations
      .map((invitation) => {
        return (
          <li>{invitation.email + '-' + invitation.accepted}</li>
        );
      })
  }

  componentDidMount() {
    console.log('logging in');
    setOnAuthChange((user) => {
      if (!user || !user.uid) {
        this.setState({uid: null});
        return;
      }

      const uid = user.uid;
      const currentUserRef = db().ref('Users/' + uid)
      currentUserRef
        .once('value')
        .then((data) => {
          const user = data.val();
          console.log('current user', user);

          this.setState({
            uid: uid,
            email: user.email,
            uname: user.uname,
            netId: user.netId
          });

          this.queryInvitations();

        });
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
          { !!this.state.uid ? <Invitation userData={this.state} handleInvite={this.handleInvite.bind(this)} /> : '' }
          <Invitations {...this.state} />
          { !!this.state.uid ? <button onClick={this.handleLogOut.bind(this)}>Logout</button> : '' }
        </div>
      </div>
    );
  }
}

export default App;
