module.exports = class Register {

  constructor(database){
    this.database = database;
  }

  getFunction() {
    return event => {
      const functions = require('firebase-functions');

      const user = event.data; // The Firebase user.
      const email = user.email; // The email of the user.
      const uid = user.uid; //The uid of the user

      console.log('Adding new user to db: ' + email);

      // Push email to database
      return this.database.ref('/users/' + uid).child('email').set(email)
      .then(console.log('Added new user to db: ' + email))
    };
  }
};