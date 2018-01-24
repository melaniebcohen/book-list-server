'use strict';

// require modules
const fs = require('fs');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const CLIENT_URL = process.env.CLIENT_URL;

// use modules
const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);

client.connect();

// middleware components
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('./client'));

// routes
app.get('/', (req, res) => res.send('hello world'));

app.get('/api/v1/books', function(req,res) {
  client.query(`SELECT * FROM books`)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      console.error('no data loaded:',err);
    })
})

// LOAD BOOKS FROM FORM
app.post('/api/v1/books', function(req,res) {
  client.query(`INSERT INTO books(author, title, isbn, image_url, description)
  VALUES($1, $2, $3, $4, $5);`,
    [ // when we get a post request to API, query DB, dynamically pass values
      req.body.author,
      req.body.title,
      req.body.isbn,
      req.body.image_url,
      req.body.description,
    ]
  )
    .then(function(data) {
      console.log('data passed:',data);
      res.redirect('/')
    })
})

// CRUD applications
// loadDB();

// function loadBooks() {
//   fs.readFile('../book-list-client/data/books.json', function(err, fd) {
//     console.log(err);
//     JSON.parse(fd.toString()).forEach(function(ele) {
//       client.query(
//         'INSERT INTO books(title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
//         [ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
//       )
//     })
//   })
// }

// function loadDB() {
//   client.query(`
//    CREATE TABLE IF NOT EXISTS
//    books(id SERIAL PRIMARY KEY, title VARCHAR(255), author VARCHAR(255), isbn VARCHAR(255), image_url VARCHAR(255), description TEXT NOT NULL);
//    `)
//     .then(loadBooks());
// }

// get server up and running
app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
})