import React, { Component } from 'react';

class Invitation extends Component {
  constructor(props) {
    super(props);

    // Very annoying
    this.invite = this.invite.bind(this);
  }

  invite(e) {
    e.preventDefault();
    const form = e.target.form;
    console.log('props', this.props);

    const inivation = {
      email: form.elements.inviteEmail.value
    }

    this.props.handleInvite(inivation);

    form.elements.inviteEmail.value = '';
  }

  render() {
    return (
      <div>
        <h4>Invite Someone</h4>
        <form>
          <div className="form-group">
            <label htmlFor="inviteEmail">Email address</label>
            <input type="email" className="form-control" id="inviteEmail" name="inviteEmail" placeholder="Enter email" />
          </div>
          <button className="btn btn-primary" onClick={this.invite}>Invite Now</button>
        </form>
      </div>
    )
  }
}

export default Invitation;
