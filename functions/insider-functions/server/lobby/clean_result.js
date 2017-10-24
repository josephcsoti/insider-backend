module.exports = class CleanResult {

  constructor(database){
    this.database = database;
  }

  getFunction() {
    return event => {
      // Only edit data when it is first created.
      if (!event.data.previous.exists()) {
        //return;
      }
      
      // Exit when the data is deleted.
      if (!event.data.exists()) {
        console.log('Data does not exist - Exiting...')
        return;
      }

      //TODO: get data with ref.once()???

      console.log('*** - data: ' + event.data.val());

      // exit when hasnt been seen
      if(!event.data.val()) {
        console.log('seen: ' + event.params.seen);
        console.log('Result not seen - Exiting...');
        return;
      }

      const queue_name = event.params.queue_name;
      const pushkey = event.params.pushkey;
      
      console.log('--- START: Clean queue_lobby_result(' + queue_name + ') for pushkey(' + pushkey + ')');

      return this.database.ref('/queue_lobby_result/' + queue_name + '/' + pushkey).remove()
      .then(
        console.log('SUCCESS | Clean Result Queue Entry')
      )
      .then(
        console.log('--- END: Clean queue_lobby_result(' + queue_name + ') for pushkey(' + pushkey + ')')
      )
      .catch(() => {
        console.log('FAILURE | Clean Queue Result Entry');
        console.log('$$$ FAIL: Clean queue_lobby_result(' + queue_name + ') for pushkey(' + pushkey + ')')
      })
      
    };
  }
};