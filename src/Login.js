import React, { Component } from 'react';

class Login extends Component {
  signIn(e) {
    e.preventDefault();
    const form = e.target.form;

    const creds = {
      email: form.elements.email.value,
      password: form.elements.password.value
    }

    this.props.handleLogin(creds);
  }

  render() {
    return (
      <div className="Login">
        <form>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" name="password" placeholder="Password" />
          </div>
          <button className="btn btn-primary" onClick={this.signIn.bind(this)}>Sign In</button>
        </form>
      </div>
    );
  }
}

export default Login;
