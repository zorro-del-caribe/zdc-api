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
      DROP TABLE IF EXISTS tags CASCADE;
      DROP TABLE IF EXISTS classifieds_tags CASCADE;
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
      price numeric(14,2),
      "createdAt" timestamp DEFAULT current_timestamp,
      "updatedAt" timestamp DEFAULT current_timestamp,
      "userId" uuid REFERENCES users
      );
      CREATE TABLE tags
      (
      id serial PRIMARY KEY,
      title varchar(128),
      description text,
      "createdAt" timestamp DEFAULT current_timestamp,
      "updatedAt" timestamp DEFAULT current_timestamp
      );
      CREATE TABLE classifieds_tags
      (
      id serial PRIMARY KEY,
      "tagId" integer REFERENCES tags,
      "classifiedId" integer REFERENCES classifieds
      );
`, function (err, result) {
      if (err)
        throw err;

      done();
      sh.stop();
    });
  })
  .catch(e=> {
    console.log(e)
    throw e;
  });