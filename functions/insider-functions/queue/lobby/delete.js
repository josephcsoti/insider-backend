module.exports = class Delete {

  constructor(database){
    this.database = database;
  }

  getFunction() {
    return event => {

      const lobbyID = event.params.pushkey;

      const data = event.data.val();
      const userID = data.userID;


      //verify user is admin
      return this.isUserAdmin(userID, lobbyID).then(
        result => {
          if(!result){
            console.log('--- EXIT: User('+userID+') is not admin for lobby('+lobbyID+')');
            return;
          }
          else
            return this.deleteData(lobbyID);
        }
      );
    };
  }

  deleteData(lobbyID){
    console.log('--- START: Delete lobby(' + lobbyID + ')');

      // Get lobby code
      const p1 = this.database.ref('/lobby_props/'+lobbyID+'/lobby_code').once('value')
                  .then(data => {this.log(true, "Got Lobby code("+data.toString()+')')});

      // Delete from lobby list
      const p2 = this.database.ref('/lobby/' + lobbyID).remove()
                  .then(this.log(true, "Removed lobby list"));

      // Delete players
      const p3 = this.database.ref('/lobby_players/' + lobbyID).remove()
                  .then(this.log(true, "Removed lobby players"));

      // Delete admin
      const p4 = this.database.ref('/lobby_admin/' + lobbyID).remove()
                  .then(this.log(true, "Removed lobby admin"));

      // Execute all
      const p5 = Promise.all([p1,p2,p3,p4])
                  .then(result => {
                    console.log('RES: ', result[0]);
                    return this.database.ref('/lobby_code/' + result[0].val().toString()).remove()
                      .then(this.log(true, "Removed lobby code"))
                  });

      // Remove props
      return p5
              .then(
                this.database.ref('/lobby_props/' + lobbyID).remove()
                  .then(this.log(true, "Removed lobby props")))
              .then(() => {
                 return this.updateQueueStatus(true, lobbyID);
                console.log('--- END: Delete lobby(' + lobbyID + ')');
              })
              .catch(err => {
                console.log('ERR: ',err);
                console.log('$$$ FAIL: Delete lobby(' + lobbyID + ')');
                return this.updateQueueStatus(false, lobbyID);
              });
  }

  updateQueueStatus(status, lobbyID){
    return this.database.ref('/queue_lobby_result/delete/' + lobbyID).set({
      status: status,
      time: new Date().getTime(),
      seen: false
    })
    .then(
      console.log('Wrote result(' + status + ') for lobby('+lobbyID+')')
    );
  }

  log(sign, str){
    sign ? console.log('SUCCESS | ', str) : console.log('FAILIURE | ', str);
  }

  isUserAdmin(userID, lobbyID){
    return this.database.ref('/lobby_admin/'+lobbyID).once('value')
      .then(data => {
        console.log('data', data.val().toString());
        console.log('istrue???', (userID === data.val().toString()));
        return (userID === data.val().toString());
      });
  }
};