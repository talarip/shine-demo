import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './Login';
import CreateAccount from './CreateAccount';
import { firebaseApp, login, setOnAuthChange, logout, createUser } from './firebaseApp';
import { Database } from './Database';
const db = Database(firebaseApp);
console.log(db);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null
    };
  }

  handleLogin(creds) {
    console.log('creds', creds);
    login(creds.email, creds.password);
  }

  handleCreateAccount(creds) {
    createUser(creds.email, creds.password);
  }

  handleLogOut() {
    logout();
  }

  componentDidMount() {
    console.log('logging in');
    setOnAuthChange((user) => {
      if (!user || !user.uid) {
        this.setState({uid: null});
        return;
      }

      console.log(user);
      this.setState({uid: user.uid});
    });
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Welcome To Shine Bright
        </p>
        <div className="container">
          { !this.state.uid  ? <CreateAccount handleCreateAccount={this.handleCreateAccount.bind(this)} /> : ''}
          { !this.state.uid  ? <hr className="hr-text" data-content="Or" /> : ''}
          { !this.state.uid  ? <Login handleLogin={this.handleLogin.bind(this)} /> : ''}
          { !!this.state.uid ? <button onClick={this.handleLogOut.bind(this)}>Logout</button> : '' }
        </div>
      </div>
    );
  }
}

export default App;
