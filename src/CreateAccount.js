import React, { Component } from 'react';

class CreateAccount extends Component {
  createAcct(e) {
    e.preventDefault();
    const form = e.target.form;

    const creds = {
      email: form.elements.email.value,
      password: form.elements.password.value
    }

    this.props.handleCreateAccount(creds);
  }

  render() {
    return (
      <div className="CreateAccount">
        <form>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" name="password" placeholder="Password" />
          </div>
          <button className="btn btn-primary" onClick={this.createAcct.bind(this)}>Get Started</button>
        </form>
      </div>
    );
  }
}

export default CreateAccount;
