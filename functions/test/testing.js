// Data
const data = {
  users: [
    {uid: 'TEST_USER_ID_1', email: 'TEST_EMAIL_1@tracestudios.xyz'},
    {uid: 'TEST_USER_ID_2', email: 'TEST_EMAIL_2@tracestudios.xyz'},
    {uid: 'TEST_USER_ID_3', email: 'TEST_EMAIL_3@tracestudios.xyz'},
    {uid: 'TEST_USER_ID_4', email: 'TEST_EMAIL_4@tracestudios.xyz'},
    {uid: 'TEST_USER_ID_5', email: 'TEST_EMAIL_5@tracestudios.xyz'},
    {uid: 'TEST_USER_ID_6', email: 'TEST_EMAIL_6@tracestudios.xyz'},
    {uid: 'TEST_USER_ID_7', email: 'TEST_EMAIL_7@tracestudios.xyz'},
    {uid: 'TEST_USER_ID_8', email: 'TEST_EMAIL_8@tracestudios.xyz'},
    {uid: 'TEST_USER_ID_9', email: 'TEST_EMAIL_9@tracestudios.xyz'},
    {uid: 'TEST_USER_ID_A', email: 'TEST_EMAIL_A@tracestudios.xyz'},
  ],
  lobbies: [
    'LOBBY_ID_A',
    'LOBBY_ID_B'
  ],
  pushkeys: [
    'PUSH_KEY_1',
    'PUSH_KEY_2',
    'PUSH_KEY_3',
    'PUSH_KEY_4',
    'PUSH_KEY_5',
    'PUSH_KEY_6',
    'PUSH_KEY_7',
    'PUSH_KEY_8',
    'PUSH_KEY_9',
    'PUSH_KEY_A',
  ]
};

// Data Helpers
var users = data.users;
var lobbies = data.lobbies;
var pushkeys = data.pushkeys;
var lobby_queues = data.lobby_queues;

// Consts
const LOBBY_COUNT = 2;
const SPLIT_POINT = ((users.length-LOBBY_COUNT) / 2) + LOBBY_COUNT; //Default is 1/2

// Create new user
for(var i=0; i<users.length; i++){
  Register({
    uid: users[i].uid, 
    email: users[i].email
  })
}

// Create Lobbies
for(var i=0; i<LOBBY_COUNT; i++){
  CreateLobby({
    userID: users[i].uid},
    {
      auth: {variable: {uid: users[i].uid}},
      params: {pushkey: lobbies[i]}
    }
  )
}

// Join lobbies
for(var i=LOBBY_COUNT; i<SPLIT_POINT; i++){
  JoinLobby({
    lobbyID: lobbies[0],
    userID: users[i].uid},
    {
      params: {pushkey: pushkeys[i]}
    }
  )
}
for(var i=SPLIT_POINT; i<users.length; i++){
  JoinLobby({
    lobbyID: lobbies[1],
    userID: users[i].uid},
    {
      params: {pushkey: pushkeys[i]}
    }
  ) 
}

// Update Player Count

// Empty player sets
var players_0 = {}
var players_a = {};
var players_b = {};

// Add "Leaders" seperately 
players_a[users[0].uid] = true;
players_b[users[1].uid] = true;

// Lobby A
for(var i=LOBBY_COUNT; i<SPLIT_POINT; i++){
  players_a[users[i].uid] = true;
}
// Lobby B
for(var i=SPLIT_POINT; i<users.length; i++){
  players_b[users[i].uid] = true;
}
// Lobby A
UpdateLobbyPlayerCount(
  {
    before: players_0,
    after: players_a
  },
  {params: {pushkey: lobbies[0]}}
)
// Lobby B
UpdateLobbyPlayerCount(
  {
    before: players_0,
    after: players_b
  },
  {params: {pushkey: lobbies[1]}}
)

// Clean Seen results

//Unseen result
var result_unseen = {
  seen: false,
  status: true,
  time: 11111111
}
//Seen result
var result_seen = {
  seen: true,
  status: true,
  time: 22222222
}

// clean lobby create
for(var i=0; i<LOBBY_COUNT; i++) {
  CleanLobbyResult(
    {
      //before: false,
      after: true
    },
    {params: {
      pushkey: lobbies[i],
      queue_name: 'create'
    }}
  )
}

// clean lobby join_unlocked
for(var i=0; i<pushkeys.length; i++) {
  CleanLobbyResult(
    {
      //before: false,
      after: true
    },
    {params: {
      pushkey: pushkeys[i],
      queue_name: 'join_unlocked'
    }}
  )
}