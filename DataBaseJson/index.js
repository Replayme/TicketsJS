const {
    JsonDatabase,
  } = require("wio.db");
  
  const general = new JsonDatabase({
    databasePath: "./DataBaseJson/general.json"
  });
  
  const tickets = new JsonDatabase({
    databasePath: "./DataBaseJson/ticket.json"
  });

  const perms = new JsonDatabase({
    databasePath: "./DataBaseJson/perms.json"
  });
  
  
  module.exports = {
    general,
    tickets,
    perms
  }