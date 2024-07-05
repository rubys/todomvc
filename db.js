var pg = require('pg');

var pubsub = require('./pubsub');

var db = null;

async function executeQuery(query, params, callback) {
  // if the db is not connected, connect
  if (!db) {
    db = new pg.Client({ connectionString: process.env.DATABASE_URL });

    await db.connect();

    await db.query("CREATE TABLE IF NOT EXISTS todos ( \
      id SERIAL PRIMARY KEY, \
      title TEXT NOT NULL, \
      completed INTEGER \
    )");

    db.on('end', err => {
      console.error('Database connection ended', err);
      process.exit(1)
    });
  }

  // replace ? with $1, $2, etc.
  let i=0;
  query = query.replace(/\?/g, () => `$${++i}`);

  // execute the query, call the callback with the results
  db.query(query, params)
    .then(result => { callback(null, result.rows) })
    .catch(callback);
}
 
// mimic the behavior of the sqlite3 module;
// broadcast changes to all web socket clients
module.exports = {
  all: executeQuery,

  run: (query, params, callback) => {
    executeQuery(query, params, (err, rows) => {
      pubsub.publish();
      callback(err, rows);
    });
  }
}
