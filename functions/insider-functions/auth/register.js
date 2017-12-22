module.exports = class Register {

  constructor(database){
    this.database = database;
  }

  getFunction() {
    return event => {

      const user = event.data; // The Firebase user.
      const email = user.email; // The email of the user.
      const uid = user.uid; //The uid of the user

      console.log('Adding new user to db: ' + email);

      // Push email to database
      return this.database.ref('/users/' + uid).set({
        email: email,
        photo: 'tracestudios.xyz/insider/1.png',
        wins: 0,
        losses: 0
      })
      .then(console.log('SUCCESS | added new user to db: ' + email))
    };
  }
};