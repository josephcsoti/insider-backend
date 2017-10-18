// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const database = admin.database();

//Custom Insider functions
const insider = require('./insider-functions');

  const Register = insider.auth.register;

  const CreateLobby = insider.queue.lobby.create;
  const DeleteLobby = insider.queue.lobby.delete;
  const JoinLobby = insider.queue.lobby.join;
  const LeaveLobby = insider.queue.lobby.leave;

  const CleanLobbyQueue = insider.server.lobby.clean_queue;
  const CleanLobbyResult = insider.server.lobby.clean_result;
  const UpdateLobbyPlayerCount = insider.server.lobby.update_player_count;
  const ReadyUp = insider.server.lobby.ready;


// -- AUTH -- //

  //New Account
  exports.Register = functions.auth.user().onCreate(
    new Register(database).getFunction()
  );

// -- QUEUE -- //

  // Create Lobby
  exports.CreateLobby = functions.database.ref('/queue_lobby/create/{pushkey}').onCreate(
    new CreateLobby(database).getFunction()
  );

  // Delete Lobby
  exports.DeleteLobby = functions.database.ref('/queue_lobby/delete/{pushkey}').onCreate(
    new DeleteLobby(database).getFunction()
  );

  // Join lobby (open)
  exports.JoinLobby = functions.database.ref('/queue_lobby/join_unlocked/{pushkey}').onCreate(
    new JoinLobby(database).getFunction()
  );

  // Leave lobby
  exports.LeaveLobby = functions.database.ref('/queue_lobby/leave/{pushkey}').onCreate(
    new LeaveLobby(database).getFunction()
  );

// -- SERVER -- //

  // Clean lobby queue after result
  exports.CleanLobbyQueue = functions.database.ref('/queue_lobby_result/{queue_name}/{pushkey}').onCreate(
    new CleanLobbyQueue(database).getFunction()
  );

  // Clean seen results
  exports.CleanLobbyResult = functions.database.ref('/queue_lobby_result/{queue_name}/{pushkey}/was_seen').onUpdate(
    new CleanLobbyResult(database).getFunction()
  );

  // Update player count
  exports.UpdateLobbyPlayerCount = functions.database.ref('/lobby_players/{pushkey}').onUpdate(
    new UpdateLobbyPlayerCount(database).getFunction()
  );

  // Ready
  exports.ReadyUp = functions.database.ref('/lobby_player_props/{pushkey}/ready').onUpdate(
    new ReadyUp(database).getFunction()
  );