import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
// import { firebaseApp } from './firebaseApp';

class App extends Component {
  handleLogin() {

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Shine Bright with React & Firebase</h2>
        </div>
        <p className="App-intro">
          Testing the Codeship integration!!!
        </p>
        <div className="container">
          <Login handleLogin={this.handleLogin.bind(this)} />
        </div>
      </div>
    );
  }
}

export default App;
