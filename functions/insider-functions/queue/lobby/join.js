module.exports = class Join {

  constructor(database, JOIN_METHOD){
    this.database = database;
    this.JOIN_METHOD = JOIN_METHOD;
  }

  getFunction() {
    return event => {
      this.pushkey = event.params.pushkey;
      this.data = event.data.val();
      switch(this.JOIN_METHOD){
        case 'CODE': this.joinByCode();
          break;
        case 'LINK': this.joinByLink();
          break;
        case 'PASSWORD': this.joinPassword();
          break;
        case 'UNLOCKED':
        default: this.joinUnlocked();
      }
    };
  }

  joinByCode(){
    //
  }

  joinByLink(){
    //
  }

  joinPassword(){
    //
  }

  joinUnlocked(){
    //do checks

    const userID = this.data.userID;
    const lobbyID = this.data.lobbyID;

    this.join(userID, "nicknamee", lobbyID);
  }

  //Generically adds user to lobby
  join(userID, nickname, lobbyID){

    // join list
    const p1 = this.database.ref('/lobby_players/'+lobbyID+'/'+userID).set(true)
      .then(() => {
        console.log('Added player to lobby('+lobbyID+')')
        
      });

    //make props
    const p2 = this.database.ref('/lobby_player_props/'+lobbyID+'/'+userID).set({
        nickname: nickname,
        ready: false
      })
      .then(() => {
        console.log('Added player to lobby('+lobbyID+')')
        
      });

      return Promise.all([p1, p2]).then(
        this.updateQueueStatus(true, lobbyID)
      );
    
  }

  updateQueueStatus(status, lobbyID){
    return this.database.ref('/queue_lobby_result/join_unlocked/' + this.pushkey).set({
      status: status,
      time: new Date().getTime(),
      seen: false
    })
    .then(
      console.log('Wrote result(' + status + ') for lobby('+lobbyID+')')
    );
  }
};