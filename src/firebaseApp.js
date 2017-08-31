import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyC7Jx55XqW7YAHZnp_1LjhDolxEt38uK_c",
  authDomain: "dm-shine-bright.firebaseapp.com",
  databaseURL: "https://dm-shine-bright.firebaseio.com",
  storageBucket: "dm-shine-bright.appspot.com",
};

export const firebaseApp = firebase;

export const createUser = function(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => console.log('create account complete'))
    .catch(function(error) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
};

export const login = function(email, password, onAuthStateChange = (user) => console.log(user)) {
  firebase
    .auth()
    .onAuthStateChanged(onAuthStateChange);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => console.log('sign in complete'))
    .catch(function(error) {
      console.log(error)
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};
