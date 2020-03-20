module.exports = client => {
  console.log(`Logged in as ${client.user.username}`);
  client.user.setActivity('Ready to help.', {type: 'WATCHING'});
};
