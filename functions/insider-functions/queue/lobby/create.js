module.exports = class Create {

  constructor(database){
    this.database = database;
  }

  getFunction() {
    return event => {

      const lobbyID = event.params.pushkey;
        
      const data = event.data.val();
      const userID = data.userID;

      console.log('--- START: Create lobby(' + lobbyID + ') for user(' + userID + ')');

      const p1 = this.getLobbyCode();
      
      const p2 = this.database.ref('/lobby/' + lobbyID).set(true)
                  .then(this.log(true, "Add lobby list"));

      const p3 = this.database.ref('/lobby_admin/' + lobbyID).set(userID)
                  .then(this.log(true, "Add lobby admin"));

      const p4 = this.database.ref('/lobby_props/' + lobbyID).set({
                  created: new Date().getTime(),
                  players: 0,
                  cardpack: "default",
                  cpu_players: false,
                  locked: false,
                  lobby_name: "A cool lobby",
                  slots: 8
                  })
                    .then(this.log(true, "Add lobby props"));

      return Promise.all([p1,p2,p3,p4])
                    .then(result => {
                      let code = result[0];
                      this.updateLobbyWithCode(code, lobbyID);
                    })
                    .then(() => {
                      this.updateQueueStatus(true, lobbyID);
                      console.log('--- END: Create lobby(' + lobbyID + ') for user(' + userID + ')');
                    })
                    .catch(err => {
                      this.updateQueueStatus(false, lobbyID)
                      console.log('$$$ FAIL: Create lobby(' + lobbyID + ') for user(' + userID + ')');
                    }); 
    };
  }

  updateLobbyWithCode(code, lobbyID){
    const p1 = this.database.ref('/lobby_props/' + lobbyID + '/lobby_code').set(code)
                .then(this.log(true, "Update lobby props - Code"));

    const p2 = this.database.ref('/lobby_codes/' + code).set({
                lobbyID: lobbyID,
                password: false
                })
                  .then(this.log(true, "Add lobby code"));

    return Promise.all(p1,p2);
  }

  updateQueueStatus(status, lobbyID){
    return this.database.ref('/queue_lobby_result/create/' + lobbyID).set({
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

  getLobbyCode(){
    const CODE_LENGTH = 5;
    const CODE_VALUES = ['0','1','2','3','4','5','6','7','8','9',
                         'a','b','c','d','e','f','g','h','i','j',
                         'k','l','m','n','o','p','q','r','s','t',
                         'u','v','w','x','y','z'];

    var code = "";

    for(var i=0; i<CODE_LENGTH; i++)
      code += CODE_VALUES[0 + this.getRandomInt()];
    
    this.log(true, 'Lobby code generated - code('+ code.toUpperCase() +')')
    return code;
  }

  getRandomInt(){
    return Math.floor(Math.random() * 36); 
  }
};