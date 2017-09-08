import React, { Component } from 'react';
import App from './App';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  // withRouter
} from 'react-router-dom';
import { firebaseApp, login, setOnAuthChange, logout, createUser } from './firebaseApp';
import { Database } from './Database';
// import Invitation from './Invitation';
import Network from './Network';
import Dashboard from './Dashboard';
const db = Database(firebaseApp);
// const refUsers = db().ref('Users');
const getDBRef = (refKey) => db().ref(refKey);
// const refNetworks = db().ref('Networks');
// const refParentNetworks = db().ref('UserParentNetworks');
// const refChildNetworks = db().ref('UserChildNetworks');
const refInvitations = db().ref('Invitations');
const refUserLeads = db().ref('UserLeads');
const NULL_VAL = '';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      email: null,
      uname: null,
      netId: null,
      invitations: [],
      sentInvitations: [],
      invitationsInfo: {},
      isAuth: this.isAuth.bind(this),
      handleLogin: this.handleLogin.bind(this),
      handleCreateAccount: this.handleCreateAccount.bind(this),
      handleInvite: this.handleInvite.bind(this),
      handleLogOut: this.handleLogOut.bind(this),
      handleJoinNetwork: this.handleJoinNetwork.bind(this),
      handleJoinNetworkAuth: this.handleJoinNetworkAuth.bind(this),
      getInvitationInfo: this.getInvitationInfo.bind(this),
      refreshInvitations: this.refreshInvitations.bind(this)
    };
  }

  isAuth() {
    return !!this.state.uid;
  }

  // Login
  handleLogin(creds) {
    login(creds.email, creds.password, (user) => {
      if (!user || !user.uid) {
        this.setState({uid: null});
        return;
      }

      console.log('Retreiving User Info On Login', user);
      const uid = user.uid;
      const currentUserRef = db().ref('Users/' + uid)

      currentUserRef
        .once('value')
        .then((data) => {
          const userInfo = data.val();
          console.log('User Info Queried On Login', userInfo);

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
      const dbUsers = getDBRef('Users');

      console.log('Adding Node To Users', user);
      const userInfoPromise = dbUsers
        .child(user.uid)
        .set({
          'uid': user.uid,
          'email': user.email,
          'uname': uname,
          'fullName': fullName
        })
        .then(() => {
          console.log('Setting User Info To State');
          this.setState({
            uid: user.uid,
            email: user.email,
            uname: uname,
            fullName: fullName
          });
        });

      // console.log('Adding Node To Parent Networks');
      // refParentNetworks.push(user.uid);
      //
      // console.log('Adding Node To Child Networks');
      // refChildNetworks.push(user.uid);

      // Add Reference To State
      return userInfoPromise
    });
  }

  refreshInvitations() {
    const uid = this.state.uid;

    if (!uid) {
      return;
    }

    return getDBRef('Users/' + uid)
      .child('user_invitations')
      .once('value')
      .then((data) => {
        const invitationsCollection = data.val();
        console.log('invitationsCollection', invitationsCollection);

        if (!invitationsCollection) {
          // No Invitations To Show
          return;
        }

        const invitationsToShow = Object
          .keys(invitationsCollection)
          .map((invitationRef) => {
            return {
              'id': invitationRef,
              'url': '/join/' + invitationRef
            };
          });

        console.log('invitationsToShow', invitationsToShow);
        this.setState({
          'sentInvitations': invitationsToShow
        });
      });
  }

  // ~ Needs Work
  handleInvite(invitation, { history }) {
    console.log('invitation', invitation);
    const { uid } = this.state;
    // Invite Others
    // Create the record in the UserLeads by the Email
    // Create the record in the UserInvitations by Lead id
    // Update the Users of the User record by adding the user_invitations - by invitation_id
    // Show the Updated User Invitations

    // Create the record in the UserLeads by the Email
    // Node Ref - UserLeads
    // referred_by_uid - uid
    // email - of lead
    // name - ?? - What can have is it optional
    // type - "Invitation"
    // type_id - null
    console.log('Creating User Lead');
    const userLead = refUserLeads.push();
    const userLeadId = userLead.key;
    userLead
      .set({
        'referred_by_uid': uid,
        'email': invitation.email,
        'name': invitation.name || NULL_VAL,
        'address': NULL_VAL,
        'type': 'UI',
        'type_id': NULL_VAL
      });

    // Create the record in the UserInvitations by Lead id
    // Node Ref - UserInvitations
    // invitation_id_1 - Created From Record Saved
    // to - [lead_id_1] - from the UserLeads Record Created
    // accepted - 0 - initial value
    // timestamp - 0 - [Current Date]
    // sent_by_uid - UID - user signed in creating the invitation
    console.log('Creating User Invitation');
    const userInvitation = refInvitations.push();
    const userInvitationId = userInvitation.key;
    userInvitation
      .set({
        'sent_by_uid': uid,
        'email': invitation.email,
        'to': userLeadId,
        'lead_id': userLeadId,
        'timestamp': (new Date()).toString(),
        'accepted': 0
      });


    // Update the Users of the User record by adding the user_invitations - by invitation_id
    // Node Ref - Users - user_invitations -
    // Add invitation_id_1 Created From UserInvitations
    console.log('Adding Invitation Reference To User');
    const userDB = getDBRef('Users/' + uid);
    userDB.child('user_invitations/' + userInvitationId).set(true);

    this
      .refreshInvitations()
      .then(() => history.push('/dashboard/invitations-sent'))
  }

  getInvitationInfo(invitationId) {
    console.log('invitationId', invitationId);

    if (!invitationId) {
      return;
    }

    return refInvitations
      .child(invitationId)
      .once('value')
      .then((data) => {
        const invitationInfo = data.val();
        if (!invitationInfo) {
          return null;
        }

        this.setState({
          invitationsInfo: {...this.state.invitationsInfo,
            [invitationId]: invitationInfo
          }
        });

        // const { sent_by_uid } = invitationInfo;

        // if (sent_by_uid) {
        //   getDBRef('Users/' + sent_by_uid = '/uname')
        //     .once('value')
        //     .then((unameData) => {
        //       console.log('unameData', unameData);
        //       this.setState({
        //         invitationsInfo: {...this.state.invitationsInfo,
        //           [invitationId]: {...this.state.invitationsInfo[invitationId],
        //             'fromName': unameData
        //           }
        //         }
        //       })
        //     });
        // }
      });


  }

  // ~ Needs Work
  handleJoinNetwork(joinInfo) {
    // const {netId, invitationId, email, password} = joinInfo;
    // console.log('joinInfo', joinInfo);

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

  handleJoinNetworkAuth() {

  }

  handleLogOut() {
    this.setState({
      uid: null,
      email: null,
      uname: null
    });

    logout();
  }

  componentDidMount() {
    console.log('mount');
    setOnAuthChange((user) => {
      if (!user || !user.uid) {
        this.setState({uid: null});
        return;
      }

      const hasInfo = this.state.email &&
        this.state.uid &&
        this.state.uname;

      if (hasInfo) {
        console.log('hasInfo', hasInfo);
        // Cancel
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

          const {email, uname, fullname } = userInfo;
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

          if (userInfo.user_invitations) {
            this.refreshInvitations();
          }
        });
    });
  }

  render() {
    return (
      <Router>
        <div>
          { !!this.state.uid ? <button onClick={this.state.handleLogOut}>Logout</button> : '' }
          <Switch>
            <Route path="/dashboard" render={
                (props) => {
                  console.log('match /dashboard');
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
            <Route exact path="/join/:invitationId" render={
                (props) => {
                  const routeProps = {...this.state, ...props};
                  console.log('isAuth', !!this.state.uid);
                  return <Network {...routeProps} />;
                }
              }
            />
            <Route path="/" {...this.state} render={(props) => {
              console.log('match /');
              console.log('isAuth', !!this.state.uid);
              return !!this.state.uid ?
                <Redirect to={{
                  pathname: '/dashboard',
                  state: { from: props.location }
                }}/>
              :
                <App {...this.state} />
            }} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Main
