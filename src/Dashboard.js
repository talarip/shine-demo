import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
// import Invitation from './Invitation';


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

const Invitation = (props) => {
  return (
    <div>
      Send Invitations
    </div>
  )
};

const GiftCardSender = (props) => {
  return (
    <div>
      Send Gift Card
    </div>
  )
};

const GiftSender = (props) => {
  return (
    <div>
      Send Gift
    </div>
  )
};

const Kindness = (props) => {
  return (
    <div>
      Acts Of Kindness
    </div>
  )
};

const ReceiedInvitations = (props) => {
  return (
    <div>
      Invitations Received
    </div>
  )
};

const ReceiedGiftCards = (props) => {
  return (
    <div>
      Gift Cards Received
    </div>
  )
};

const ReceivedGifts = (props) => {
  return (
    <div>
      Gift Giver Info
    </div>
  )
};

const SentInvitations = (props) => {
  return (
    <div>
      Sent Invitations
    </div>
  )
};

const SentGiftCards = (props) => {
  return (
    <div>
      Gift Cards Sent
    </div>
  )
};

const SentGifts = (props) => {
  return (
    <div>
      Gift Sent
    </div>
  )
};

const DashboardDefault = (props) => {
  return (
    <div>
      Your Dashboard
    </div>
  )
};


class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        <p className="App-intro">
          Shine Bright
        </p>

        <div className="container">
          <Switch>
            <Route path="/dashboard/invite"  component={Invitation} />
            <Route path="/dashboard/send-gift-card"  component={GiftCardSender} />
            <Route path="/dashboard/send-gift"  component={GiftSender} />
            <Route path="/dashboard/kindness"  component={Kindness} />
            <Route path="/dashboard/view-invitation"  component={ReceiedInvitations} />
            <Route exact path="/dashboard/view-gift-cards"  component={ReceiedGiftCards} />
            <Route exact path="/dashboard/view-gift-cards"  component={ReceivedGifts} />
            <Route exact path="/dashboard/invitations-sent"  component={SentInvitations} />
            <Route exact path="/dashboard/gift-cards-sent"  component={SentGiftCards} />
            <Route exact path="/dashboard/gift-sent"  component={SentGifts} />
            <Route component={DashboardDefault}/>
          </Switch>

          <hr />

          <h4>Things That You Can Do</h4>
          <ul>
            <li><Link to="/dashboard/invite">Send Invitations</Link></li>
            <li><Link to="/dashboard/send-gift-card">Send Card</Link></li>
            <li><Link to="/dashboard/send-gift">Send Gift</Link></li>
            <li><Link to="/dashboard/kindness">Acts Of Kindness</Link></li>
          </ul>

          <hr />

          <h4>What You Have Received</h4>
          <ul>
            <li><Link to="/dashboard/view-invitation">View Invitations</Link></li>
            <li><Link to="/dashboard/view-gift-cards">View Gift Cards</Link></li>
            <li><Link to="/dashboard/view-gifts">View Gift Giver</Link></li>
          </ul>

          <hr />

          <h4>Your Generosity Effect</h4>
          <ul>
            <li><Link to="/dashboard/invitations-sent">Invitations Sent</Link></li>
            <li><Link to="/dashboard/gift-cards-sent">Gift Cards Sent</Link></li>
            <li><Link to="/dashboard/gift-sent">Gifts Sent</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Dashboard;

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
