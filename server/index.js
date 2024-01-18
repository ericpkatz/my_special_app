// imports here for express and pg
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_notes_db')

app.use(express.static(path.join(__dirname, '../client/dist')));

// static routes here (you only need these for deployment)
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));

// app routes here
app.get('/api/notes', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from notes;
    `
    const response = await client.query(SQL)
    res.send(response.rows)
  } catch (ex) {
    next(ex)
  }
})

// create your init function
const init = async () => {
  await client.connect()
  const SQL = `
    DROP TABLE IF EXISTS notes;
    CREATE TABLE notes(
      id SERIAL PRIMARY KEY,
      txt VARCHAR(255),
     starred BOOLEAN DEFAULT FALSE
    );
    INSERT INTO notes(txt, starred) VALUES('learn express', false);
    INSERT INTO notes(txt, starred) VALUES('write SQL queries', true);
   INSERT INTO notes(txt) VALUES('create routes');
  `
  await client.query(SQL)
console.log('data seeded')
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`listening on port ${port}`))
}

init()


// init function invocation
