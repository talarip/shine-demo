export const Database = (firebaseApp) => {
  if (window.db) {
    return window.db;
  }

  // Create An Instance If It Does Not Exist
  const db = firebaseApp.database;
  window.db = db;
  return db;
};
