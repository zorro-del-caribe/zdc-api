if (process.env.NODE_ENV === 'production') {
  throw new Error('running script in production mode');
}

const shipHold = require('ship-hold');
const conf = require('conf-load')();

const sh = shipHold(conf.value('db'));

sh.getConnection()
  .then(function ({client, done}) {
    client.query(`
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS classifieds CASCADE;
      CREATE TABLE users
      (
      id uuid PRIMARY KEY,
      email varchar(128),
      name varchar (128),
      "createdAt" timestamp DEFAULT current_timestamp,
      "updatedAt" timestamp DEFAULT current_timestamp
      );
      CREATE TABLE classifieds
      (
      id serial PRIMARY KEY,
      title varchar(255),
      content text,
      "createdAt" timestamp DEFAULT current_timestamp,
      "updatedAt" timestamp DEFAULT current_timestamp,
      "userId" uuid REFERENCES users 
      );
`, function (err, result) {
      if (err)
        throw err;

      done();
      sh.stop();
    });
  })
  .catch(e=> {
    throw e;
  });