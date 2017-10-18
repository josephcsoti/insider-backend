module.exports = class Leave {

  constructor(database){
    this.database = database;
  }

  getFunction() {
    return event => {

    this.pushkey = event.params.pushkey;
    const data = event.data.val();

    const userID = data.userID;
    const lobbyID = data.lobbyID;

    //leave list
    const p1 = this.database.ref('/lobby_players/'+lobbyID+'/'+userID).remove()
                .then(() => {
                  console.log('Removed user('+userID+') from lobby('+lobbyID+')')
                  this.updateQueueStatus(true, lobbyID)
                });
    
    //remove props
    const p2 = this.database.ref('/lobby_player_props/'+lobbyID+'/'+userID).remove()
                .then(() => {
                  console.log('Removed user('+userID+') props from lobby('+lobbyID+')')
                  this.updateQueueStatus(true, lobbyID)
                });

    // leave
    return Promise.all([p1,p2]);

    };
  }

  updateQueueStatus(status, lobbyID){
    return this.database.ref('/queue_lobby_result/leave/' + this.pushkey).set({
      status: status,
      time: new Date().getTime(),
      seen: false
    })
    .then(
      console.log('Wrote result(' + status + ') for lobby('+lobbyID+')')
    );
  }
};