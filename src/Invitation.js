import React, { Component } from 'react';

class Invitation extends Component {
  render() {
    return (
      <div className="Invitation">
        <form>
          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            <small id="emailHelp" className="form-text text-muted">Invite</small>
          </div>
          <button type="submit" className="btn btn-primary">Invite Now</button>
        </form>
      </div>
    );
  }
}

export default Invitation;
