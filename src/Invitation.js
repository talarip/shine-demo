import React from 'react';

export default (props) => {
  const invite = (e) => {
    e.preventDefault();
    const form = e.target.form;
    console.log('props', props);

    const inivation = {
      email: form.elements.email.value
    }

    props.handleInvite(inivation);
  }

  return (
    <div>
      <h4>Invite Someone</h4>
      <form>
        <div className="form-group">
          <label htmlFor="inviteEmail">Email address</label>
          <input type="email" className="form-control" id="inviteEmail" name="email" placeholder="Enter email" />
        </div>
        <button className="btn btn-primary" onClick={invite}>Invite Now</button>
      </form>
    </div>
  )
}
