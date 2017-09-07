import React from 'react';

const Network = ({ match, handleJoinNetworkNotAuth }) => {
  const parseId = (id) => /^[a-zA-Z0-9_]+$/.test(id) ? id : null;
  const netId = parseId(match.params.netId);
  const invitationId = parseId(match.params.invitationId);

  if (!netId) {
    return null;
  }

  const join = (e) => {
    e.preventDefault();
    const form = e.target.form;
    const joinInfo = {
      email: form.elements.joinEmail.value,
      password: form.elements.password.value,
      netId: netId,
      invitationId: invitationId,
    }

    handleJoinNetworkNotAuth(joinInfo);
  };

  return (
    <div className="Network container">
      <form>
        <div className="form-group">
          <label htmlFor="joinEmail">Email address</label>
          <input type="email" className="form-control" id="joinEmail" name="joinEmail" placeholder="Enter email" />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" name="password" placeholder="Password" />
        </div>
        <button className="btn btn-primary" onClick={join}>Join Now</button>
      </form>
    </div>
  );
};

export default Network;
