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

  const {match, handleJoinNetwork } = props;
  const parseId = (id) => /^[a-zA-Z0-9_]+$/.test(id) ? id : null;
  const invitationId = parseId(match.params.invitationId);

  const join = (e) => {
    e.preventDefault();
    const form = e.target.form;
    const joinInfo = {
      email: form.elements.inviteEmail.value,
      invitationId: invitationId
    }

    handleJoinNetwork(joinInfo);
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
        <button className="btn btn-primary" onClick={join}>Create Account & Join Now</button> Or <button className="btn btn-primary" onClick={join}>Sign In & Join Now</button>
      </form>
    </div>
  );
};

export default Network;
