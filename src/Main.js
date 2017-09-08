import React, { Component } from 'react';
import App from './App';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import { firebaseApp, login, setOnAuthChange, logout, createUser } from './firebaseApp';
import { Database } from './Database';
import Invitation from './Invitation';
import Network from './Network'
import Dashboard from './Dashboard';
const db = Database(firebaseApp);
const refUsers = db().ref('Users');
// const refNetworks = db().ref('Networks');
const refParentNetworks = db().ref('UserParentNetworks');
const refChildNetworks = db().ref('UserChildNetworks');
const refInvitations = db().ref('Invitations');

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      email: null,
      uname: null,
      netId: null,
      invitations: [],
      handleLogin: this.handleLogin.bind(this),
      handleCreateAccount: this.handleCreateAccount.bind(this),
      handleInvite: this.handleInvite.bind(this),
      handleLogOut: this.handleLogOut.bind(this),
      handleJoinNetworkNotAuth: this.handleJoinNetworkNotAuth.bind(this),
      queryInvitations: this.queryInvitations.bind(this),
      renderInvitations: this.renderInvitations.bind(this)
    };
  }

  // Login
  handleLogin(creds) {
    console.log('creds', creds);
    login(creds.email, creds.password, (user) => {
      if (!user || !user.uid) {
        this.setState({uid: null});
        return;
      }

      console.log('Retreiving User Info On Login');
      const uid = user.uid;
      const currentUserRef = db().ref('Users/' + uid)
      currentUserRef
        .once('value')
        .then((data) => {
          console.log('User Info Queried On Login', userInfo);
          const userInfo = data.val();

          if (!userInfo) {
            return;
          }

          const {email, uname, fullname} = userInfo;
          console.log('User Info Retreived On Login', userInfo);

          if (!userInfo) {
            return;
          }

          console.log('Setting User Info To State', userInfo);
          this.setState({
            uid,
            email,
            uname,
            fullname
          });

          // this.queryInvitations();
        });
    });
  }

  // Create Account
  handleCreateAccount(creds) {
    return createUser(creds.email, creds.password, (user) => {
      const { fullName } = creds;
      const uname = user.email.split('@')[0];

      console.log('Adding Node To Users', user);
      const userInfoPromise = refUsers
        .child(user.uid)
        .set({
          'email': user.email,
          'uname': uname,
          'fullName': fullName
        });

      // console.log('Adding Node To Parent Networks');
      // const parentNetworks = refParentNetworks.push(user.uid);
      //
      // console.log('Adding Node To Child Networks');
      // const childNetworks = refChildNetworks.push(user.uid);

      // Add Reference To State
      console.log('Setting User Info To State');
      this.setState({
        uid: user.uid,
        email: user.email,
        uname: uname,
        fullName: fullName
      });

      return userInfoPromise
    });
  }

  // ~ Needs Work
  handleInvite(invitation) {
    console.log(this.state);
    console.log('invitation', invitation);

    // const userInvitations = refInvitations.child(this.state.netId);
    //
    // userInvitations
    //   .push({
    //     email: invitation.email,
    //     timestamp: (new Date()).toString(),
    //     netId: this.state.netId,
    //     accepted: 0
    //   });
  }

  // ~ Needs Work
  handleJoinNetworkNotAuth(joinInfo) {
    const {netId, invitationId, email, password} = joinInfo;
    console.log('joinInfo', joinInfo);

    // KtJGOrUlqlT_sA_ShAl/KtJKzgmA_CI999WJo5f

    // // First Attempt To Create User Account
    // this
    //   .handleCreateAccount({email, password})
    //   .then(() => {
    //     console.log('isPromise', true);
    //   })
    //   .catch((err) => console.log('error', err))
    //   .then(() => console.log('continue'))
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
    // if (!this.state.netId) {
    //   return '';
    // }
    //
    // return refInvitations
    //   .child(this.state.netId)
    //   .once('value')
    //   .then((data) => {
    //     return data.val();
    //   })
    //   .then((invitations) => {
    //     if (!invitations) {
    //       return '';
    //     }
    //
    //     const invitationsList = Object
    //       .keys(invitations)
    //       .map((key) => {
    //         return {
    //           'email': invitations[key].email,
    //           'accepted': (invitations[key].accepted ? 'Accepted' : 'Pending')
    //         };
    //       });
    //
    //     this.setState({
    //       invitations: invitationsList
    //     })
    //   })
  }

  renderInvitations() {
    return null;
    // if (!this.uid || !this.state.invitations || !this.state.invitations.length) {
    //   return '';
    // }
    //
    //
    // return this
    //   .state
    //   .invitations
    //   .map((invitation) => {
    //     return (
    //       <li>{invitation.email + '-' + invitation.accepted}</li>
    //     );
    //   })
  }

  componentDidMount() {
    setOnAuthChange((user) => {
      if (!user || !user.uid) {
        this.setState({uid: null});
        return;
      }

      console.log('Retreiving User Info On Mount');
      const uid = user.uid;
      const currentUserRef = db().ref('Users/' + uid)
      currentUserRef
        .once('value')
        .then((data) => {
          const userInfo = data.val();

          if (!userInfo) {
            return;
          }

          const {email, uname, fullname} = userInfo;
          console.log('User Info Retreived On Mount', userInfo);

          if (!userInfo) {
            return;
          }

          console.log('Setting User Info To State', userInfo);
          this.setState({
            uid,
            email,
            uname,
            fullname
          });

          // this.queryInvitations();
        });
    });
  }
  /* <PrivateRoute exact path="/dashboard" uid={this.state.uid} component={Dashboard}/> */
  render() {
    return (
      <Router>
        <div>
          { !!this.state.uid ? <button onClick={this.state.handleLogOut}>Logout</button> : '' }

          <Route path="/dashboard" render={
              (props) => {
                const routeProps = {...this.state, ...props};
                return !!this.state.uid ?
                  <Dashboard {...routeProps} />
                :
                  <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                  }}/>
              }
            }
          />

          <Route path="/" {...this.state} render={(props) => {
            return !this.state.uid ?
              <App {...this.state} />
            :
            <Redirect to={{
              pathname: '/dashboard',
              state: { from: props.location }
            }}/>
          }} />

          <Route path="/network/:netId/:invitationId" render={
              (props) => {
                const routeProps = {...this.state, ...props};
                return <Network {...routeProps} />;
              }
            }
          />

        </div>
      </Router>
    );
  }
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const AuthButton = withRouter(({ history, isAuth }) => (
  isAuth ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
    const routeProps = {...rest, ...props};
    console.log('routeProps', routeProps);
    return !!routeProps.uid ? (
      <Component {...routeProps} />
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  }}/>
)

const Protected = () => <h3>Protected</h3>;

class LoginExample extends React.Component {
  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

export default Main
