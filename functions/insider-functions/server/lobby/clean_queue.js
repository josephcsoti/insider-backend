module.exports = class CleanQueue {

  constructor(database){
    this.database = database;
  }

  getFunction() {
    return event => {

      const queue_name = event.params.queue_name;
      const pushkey = event.params.pushkey;

      console.log('--- START: Clean queue_lobby(' + queue_name + ') for pushkey(' + pushkey + ')');
      
      return this.database.ref('/queue_lobby/' + queue_name + '/' + pushkey).remove()
      .then(
        console.log('SUCCESS | Clean Queue Entry')
      )
      .then(
        console.log('--- END: Clean queue_lobby(' + queue_name + ') for pushkey(' + pushkey + ')')
      )
      .catch(() => {
        console.log('FAILURE | Clean Queue Entry');
        console.log('$$$ FAIL: Clean queue_lobby(' + queue_name + ') for pushkey(' + pushkey + ')')
      })
    };
  }
};