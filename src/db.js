import { firebaseApp } from './firebaseApp';

export const db = firebaseApp.database();

window.db = db;

