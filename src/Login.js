import React, { Component } from 'react';
// import { firebaseApp } from './firebaseApp';

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <form>
          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            <small id="emailHelp" className="form-text text-muted">Please Sign In</small>
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input type="checkbox" className="form-check-input" />
              Check me out
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

export default Login;
