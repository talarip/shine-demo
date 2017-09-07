import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyC7Jx55XqW7YAHZnp_1LjhDolxEt38uK_c",
  authDomain: "dm-shine-bright.firebaseapp.com",
  databaseURL: "https://dm-shine-bright.firebaseio.com",
  storageBucket: "dm-shine-bright.appspot.com",
};

firebase.initializeApp(config);
export const firebaseApp = firebase;

export const isAuth = function() {
  return !!firebase.auth().currentUser;
};

export const createUser = function(email, password, fnc = (user) => console.log('user created', user)) {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(fnc)
    .catch(function(error) {
      console.log(error);
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
    });
};

export const joinNetwork = ({}) => {

};

export const setInvitation = ({}) => {

};

export const logout = function() {
  return firebase.auth().signOut();
};

export const setOnAuthChange = (fnc) => {
  return firebase
    .auth()
    .onAuthStateChanged(fnc);
};

export const login = function(email, password, fnc = (user) => console.log(user)) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(fnc)
    .catch(function(error) {
      console.log(error)
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
    });
};
