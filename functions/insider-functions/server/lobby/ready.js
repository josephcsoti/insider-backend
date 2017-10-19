module.exports = class CreateRoom {

  constructor(database){
    this.database = database;
    this.MIN_PLAYERS = 6;
  }

  getFunction() {
    return event => {
      const lobbyID = event.params.pushkey;

      return this.getPlayerList(lobbyID).then(players => {
        console.log('Old count: ' + num);

        //enough players
        if(p.length() < this.MIN_PLAYERS){
          console.log('Not enough players! ' + p.length() + '/' + this.MIN_PLAYERS);
          return Promise.resolve();
        }

        //All ready
        for(p in players){
          if(!p.ready){
            return Promise.resolve();
          }
        }
      })
      .then(() =>
        this.database.ref('/queue_server/create').push({
          lobbyID: lobbyID
        })
        .then(
          //write success
        )
      )

    }
  }

  getPlayerList(lobbyID){
    return this.database.ref('/lobby_player_props/' + lobbyID).once('value')
      .then(data => {
        return data;
      });
  }

};