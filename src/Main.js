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
const db = Database(firebaseApp);
const refUsers = db().ref('Users');
const refNetworks = db().ref('Networks');
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
    return createUser(creds.email, creds.password, (user) => {
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

      this.setState({
        uid: user.uid,
        email: user.email,
        uname: uname,
        netId: userNetwork.key,
        invitations: []
      });


      userInfo
        .set({
          email: user.email,
          uname: user.email.split('@')[0],
          netId: userNetwork.key,
          myNetwork: {
            [userNetwork.key]: userNetwork.key
          }
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

  handleJoinNetworkNotAuth(joinInfo) {
    const {netId, invitationId, email, password} = joinInfo;
    console.log('joinInfo', joinInfo);

    // KtJGOrUlqlT_sA_ShAl/KtJKzgmA_CI999WJo5f

    // First Attempt To Create User Account
    this
      .handleCreateAccount({email, password})
      .then(() => {
        console.log('isPromise', true);
      })
      .catch((err) => console.log('error', err))
      .then(() => console.log('continue'))

    // const refPath = [netId, invitationId].join('\/');
    //
    // const userInvitations = refInvitations.child(refPath);
    // console.log('userInvitations', userInvitations);

    // if (!userInvitations) {
    //   console.log('failed');
    // } else {
    //   console.log('success');
    //   userInvitations
    //     .
    // }

    // console.log('userInvitations', userInvitations);
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
      <Router>
        <div>
          <AuthButton/>

          <Route exact path="/" {...this.state} render={(props) => {
            return <App {...this.state} />
          }} />

          <Route path="/network/:netId/:invitationId" render={
              (props) => {
                const routeProps = {...this.state, ...props};
                return <Network {...routeProps} />;
              }
            }
          />

          <PrivateRoute path="/protected" component={Protected}/>
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

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
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
    return !!this.state.uid ? (
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
