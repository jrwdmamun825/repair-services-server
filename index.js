const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());


const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsyzd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const reviewCollection = client.db("mobileRepair").collection("userReview");
  const servicesCollection = client.db("mobileRepair").collection("services");
  const orderCollection = client.db("mobileRepair").collection("orders");
  const adminCollection = client.db("mobileRepair").collection("admins");

  app.post('/reviews', (req, res) => {
    const review = req.body;
    console.log(review);
    reviewCollection.insertOne(review)
      .then(documents => {
        res.send(documents.insertedCount > 0)
        //   console.log(documents);
      })

  })
  app.get('/testomonials', (req, res) => {
    reviewCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  console.log('database connect')

  app.post('/addService', (req, res) => {
    const serviceInfo = req.body;
    console.log(serviceInfo);
    servicesCollection.insertOne(serviceInfo)
      .then(documents => {
        res.send(documents.insertedCount > 0)
        console.log(documents);
      })
  })
  app.get('/services', (req, res) => {
    servicesCollection.find()
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.get('/orderById/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    console.log(id);
    servicesCollection.findOne(id)
      .then((result) => {
        res.send(result)
      })

  })
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
      .then((documents) => {
        res.send(documents)
        console.log(documents);
      })

  })
  app.get('/orderLists', (req, res) => {
    orderCollection.find()
      .toArray((err, result) => {
        res.send(result)
      })
  })
  app.get('/yourOrder', (req, res) => {
    const email = req.query.email;
    console.log(email);
    orderCollection.find({email: req.query.email})
      .toArray((err, results) => {
        res.send(results)
        console.log(results)
      })
  })


  app.post('/makeAdmin', (req, res) => {
    const admin = req.body;
    const email = req.body.email;
    console.log(email);
    adminCollection.insertOne(admin)
      .then((result) => {
        res.send(result.insertedCount > 0)
        console.log(result);
      })

  })

  app.delete('/deleted/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    console.log(id);
    servicesCollection.findOneAndDelete({ _id: id })
      .then((result) => {
        res.send(!!result.value)
      })
  })
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err,admins) => {
        res.send(admins.length > 0)
      })
  })


});



const port = 5050

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)