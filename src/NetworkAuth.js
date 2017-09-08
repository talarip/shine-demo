import React from 'react';

const InvitationInfo = (props) => {
  console.log('InvitationInfo', props);
  const invitationId = props.match.params.invitationId;
  if (!props.match.params.invitationId) {
    return null;
  }

  console.log('sent_by_uid', props.invitationsInfo[invitationId] && props.invitationsInfo[invitationId].sent_by_uid);
  console.log('uid', props.uid);
  console.log('Same UID', props.invitationsInfo[invitationId] && props.invitationsInfo[invitationId].sent_by_uid === props.uid);

  if (!props.invitationsInfo[invitationId]) {
    console.log('checking invitation');
    props.getInvitationInfo(invitationId);
    return (<div>...Searching For Invitation Id: {invitationId}</div>);
  } else if (props.invitationsInfo[invitationId] && props.invitationsInfo[invitationId].sent_by_uid === props.uid) {
    return (<div>You cannot join your own network</div>);
  }

  return (
    <div>
      <div>{props.invitationsInfo[invitationId] ? props.invitationsInfo[invitationId].sent_by_uid : null}</div>
      Network Id: {props.match.params.invitationId}
      <button className="btn btn-primary" onClick={props.join}>Join Now</button>
    </div>
  );
};

const NetworkAuth = (props) => {
  const { match, handleJoinNetworkAuth } = props;
  const parseId = (id) => /^[a-zA-Z0-9_]+$/.test(id) ? id : null;
  const invitationId = parseId(match.params.invitationId);

  const join = (e) => {
    e.preventDefault();

    const joinInfo = {
      invitationId: invitationId,
      invitationInfo: props.invitationsInfo[invitationId]
    };

    handleJoinNetworkAuth(joinInfo);
  };

  return (
    <div className="Network container">
      <h4>Join a Network Auth!</h4>
      <form>
        <InvitationInfo {...props} join={join} />
      </form>
    </div>
  );
};

export default NetworkAuth;
