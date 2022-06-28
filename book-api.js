const express = require('express');
const path=require('path')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const port = process.env.PORT
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

const connectionString=process.env.MONGODB_CONNECTION_STRING

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('books-api')
    const booksCollection = db.collection('books')

    app.use(express.static('public'))
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

 

      app.get('/', (req, res) => {
        res.sendFile(__dirname + '/new-book.html')

      })



      app.get('/book', (req, res) => {

        db.collection('books').find().toArray()
          .then(results => {
            res.render('index.ejs', { books: results})
          })
          .catch(error => console.error(error))
      })



app.post('/bookUpdate', (req, res) => {
  booksCollection.findOneAndUpdate(
    { isbn: req.body.isbn },
    {
      $set: {
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        publish_date: req.body.publish_date,
        publisher: req.body.publisher,
        numOfPages: req.body.numOfPages
      }
    }
  )
    .then(result => res.redirect('/book'))
    .catch(error => console.error(error))
})



      app.post('/book', (req, res) => {
        booksCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })



      app.delete('/books', (req, res) => {
        booksCollection.deleteOne(
          { isbn: req.body.isbn }
        )
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('Book could not be deleted')
            }
            res.json('Deleted book quote successfully')
          })
          .catch(error => console.error(error))
      })


    
    app.listen(port, function() {
        console.log('listening on port ',port)
      })
  })

