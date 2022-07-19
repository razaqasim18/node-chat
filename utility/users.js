const users = [];


//join user to chat
function userjoin(id,username,room){
    const user = {id,username,room};
    users.push(user);
    return users;
}

// Get current user
function getCurrentuser(id) {
    return users.find(user => user.id === id);
  }
  
// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }

  // Get room users
function roomUsers(room) {
    return users.filter(user => user.room === room);
  }

module.exports = {
    userjoin,
    getCurrentuser,
    userLeave,
    roomUsers,
}