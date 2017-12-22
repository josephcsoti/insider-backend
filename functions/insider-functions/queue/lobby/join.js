module.exports = class Join {

  constructor(database, MODE){
    this.database = database;
    this.MODE = MODE;
  }

  getFunction() {
    return event => {
      this.pushkey = event.params.pushkey;
      this.data = event.data.val();
      switch(this.MODE){
        case 'MODE_PRIVATE': this.joinPrivate();
          break;
        case 'MODE_PUBLIC': this.joinPublic();
          break;
        default: return; // mode needed
      }
    };
  }

  joinPrivate(){

    //CHECKS specific
    // if is private
    // if code is supplied && correct

    if(!this.isJoinable())
      return; //cant join

    if(!this.isCodeValid())
      return;

    let lobbyID = "12345abc"; //get lobbyID from code

    join(this.data.userID, lobbyID, this.generateNickname());
  }

  joinPublic(){

    if(!this.isJoinable())
      return; //cant join

    join(this.data.userID, this.data.lobbyID, this.generateNickname());
  }

  isCodeValid(){
    return true;
  }

  isJoinable(){

    //Generic checks
    //enough slots
    // is not kicked

    return true;
  }

  generateNickname(){
    return "NICKNAME";
  }

  //Generically adds user to lobby
  join(userID, lobbyID, nickname){

    // join list
    const p1 = this.database.ref('/lobby_players/'+lobbyID+'/'+userID).set(true)
      .then(() => {
        console.log('Added player('+userID+') to lobby('+lobbyID+')')
        
      });

    //make props
    const p2 = this.database.ref('/lobby_player_props/'+lobbyID+'/'+userID).set({
        nickname: nickname,
        ready: false
      })
      .then(() => {
        console.log('Added player('+userID+') to lobby('+lobbyID+')')
        
      });

      return Promise.all([p1, p2]).then(
        this.updateQueueStatus(true, lobbyID)
      );
    
  }

  updateQueueStatus(status, lobbyID){

    let url = (MODE == "MODE_PRIVATE" ? "private" : "public");

    return this.database.ref('/queue_lobby_result/join_'+url+'/' + this.pushkey).set({
      status: status,
      time: new Date().getTime(),
      seen: false
    })
    .then(
      console.log('Wrote result(' + status + ') for lobby('+lobbyID+')')
    );
  }
};