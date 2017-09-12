import React from 'react';
import NetworkAuth from './NetworkAuth';

const InvitationInfo = ({sent_by_uid}) => {
  return (
    <div>
      {sent_by_uid}
    </div>
  );
};


const Network = (props) => {
  if (!!props.uid) {
    return <NetworkAuth {...props} />;
  }

  const { handleJoinNetwork, handleJoinNetworkAuth } = props;
  const parseId = (id) => /^[a-zA-Z0-9_-]+$/.test(id) ? id : null;

  const joinNew = (e) => {
    e.preventDefault();
    const form = e.target.form;
    const invitationId = parseId(props.match.params.invitationId);
    const email = form.elements.joinEmail.value;
    const password = form.elements.password.value;
    const creds = {
      email,
      password
    };

    const joinInfo = {
      email,
      invitationId
    }

    props
      .handleCreateAccount(creds)
      .then(() => {
        return handleJoinNetwork(joinInfo);
      });
  };

  const joinExisting = (e) => {
    e.preventDefault();
    const form = e.target.form;
    const invitationId = parseId(props.match.params.invitationId);
    const email = form.elements.joinEmail.value;
    const password = form.elements.password.value;

    const creds = {
      email,
      password
    };

    const joinInfo = {
      email,
      invitationId
    };

    props
      .handleLogin(creds)
      .then(() => {
        form.elements.joinEmail.value = '';
        form.elements.password.value = '';
        return handleJoinNetworkAuth(joinInfo);
      });
  };


  return (
    <div className="Network container">
      <h4>Join a Network!</h4>
      <form>
        <InvitationInfo {...props} />
        <div className="form-group">
          <label htmlFor="joinEmail">Email address</label>
          <input type="email" className="form-control" id="joinEmail" name="joinEmail" placeholder="Enter email" />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" name="password" placeholder="Password" />
        </div>
        <button className="btn btn-primary" onClick={joinNew}>Create Account & Join Now</button> Or <button className="btn btn-primary" onClick={joinExisting}>Sign In & Join Now</button>
      </form>
    </div>
  );
};

export default Network;
