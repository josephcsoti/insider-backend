module.exports = class UpdatePlayerCount {

  constructor(database){
    this.database = database;
  }

  getFunction() {
    return event => {
      const lobbyID = event.params.pushkey;

      return this.getPlayerCount(lobbyID).then(num => {
        console.log('Old count: ' + num);
        this.database.ref('/lobby_props/' + lobbyID + '/players').set(num);
      })
      .then(() => {
        console.log('Player Count updated');
      });
    }
  }

  getPlayerCount(lobbyID){
    return this.database.ref('/lobby_players/' + lobbyID).once('value')
      .then(data => {
        console.log('data string: ' + data.toString());
        console.log('players num: ' + data.numChildren());
        return data.numChildren() || 0;
      });
  }

};