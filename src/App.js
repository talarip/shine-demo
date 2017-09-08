import React, { Component } from 'react';
import './App.css';
import {
  Route,
  Link,
  Switch
} from 'react-router-dom';
import Login from './Login';
import CreateAccount from './CreateAccount';

const EntryPage = (props) => {
  return (
    <div>
      <CreateAccount handleCreateAccount={props.handleCreateAccount} />
      <hr className="hr-text" data-content="Or" />
      <Login handleLogin={props.handleLogin} />
    </div>
  );
};

// const NetworkToJoin = (props) => {
//   return (
//     <div>
//       <h4>Join a Network!</h4>
//       <CreateAccount buttonText="Join Now" handleCreateAccount={props.handleCreateAccount}>
//         <div className="form-group">
//           <label htmlFor="networkId">Network Code</label>
//           <input type="text" className="form-control" id="networkId" name="networkId" placeholder="Optional" />
//         </div>
//       </CreateAccount>
//     </div>
//   )
// };

const GiftCardToClaim = (props) => {
  return (
    <div>
      Claim Gift Card!
    </div>
  )
};

const GiftGiver = (props) => {
  return (
    <div>
      Reveal Gift Giver!
    </div>
  )
};

const TopInfluencers = (props) => {
  return (
    <div>
      Top Influencers!
    </div>
  )
};

const renderComponent = (RenderComponent, props = {}, excludeRouteProps = false) => {
  return (routeProps) => {
    const renderProps = excludeRouteProps ? props : {...props, ...routeProps};
    return <RenderComponent {...renderProps} />
  };
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Welcome To Shine Bright
        </p>

        <div className="container">
          <Switch>

            <Route path="/claim-gift-card" render={renderComponent(GiftCardToClaim, this.props)} />
            <Route path="/reveal-giver" render={renderComponent(GiftGiver, this.props)} />
            <Route path="/top-influencers" render={renderComponent(TopInfluencers, this.props)} />
            <Route path="/login" render={renderComponent(Login, this.props)} />
            <Route path="/create-account"  render={renderComponent(CreateAccount, this.props)} />
            <Route render={renderComponent(EntryPage, this.props)}/>
          </Switch>

          <hr />

          <ul>
            <li><Link to="/join">Join A Network</Link></li>
            <li><Link to="/claim-gift-card">Claim A Gift Card</Link></li>
            <li><Link to="/reveal-giver">Reveal A Gift Giver</Link></li>
            <li><Link to="/top-influencers">See Top Influencers</Link></li>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/create-account">Create Account</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

/*

entry: /
dashboard: /dashboard

create account:  /create-account
login: /login
logout: /logout

join network:  /join or /join/:netid

claim gift card: /claim-gift-card
get giver info:  /reveal-giver
influencers: /top-influencers

send gift card: /send-gift-card
send gift: /send-gift
send invitation: /invite
pledge kindness :/kindness

++++++++++++++++++++++++++++++++++++++++++

- Logout
- If Auth Redirect To /dashboard

Actions:
--------------------
- Send Invitation
- Send Gift Card
- Send Gift
- Pledge Kindness
- Complete Pledge

You have received:
--------------------
- Receive Invitations
- Receive Gift Card
- Receive Gift Details

Generous Progress:
--------------------
- Invitations Sent
- Gift Cards Sent
- Gifts Sent

Info:
--------------------
- See Top Influencers

*/
