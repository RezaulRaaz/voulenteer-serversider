const express = require('express')
const bodyParser = require('body-parser');
const cors =require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const port =5000


const app = express()
app.use(cors());
app.use(bodyParser.json());

const password= 'Raaz12345'


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtt4b.mongodb.net/voulenteerDb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("voulenteerDb").collection("events");
  console.log('db connected successfully')
  app.post('/addEvennt',(req,res) => {
      const newEvent =req.body;
     eventCollection.insertOne(newEvent)
     .then(result => {
        res.send(result.insertedCount > 0 )
     })
  })

  app.get('/events', (req, res)=>{
   
    eventCollection.find({email:req.query.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  
  app.get('/allEvents', (req, res)=>{
    eventCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.delete('/deleteEvent/:id', (req, res)=>{
    console.log(req.params.id)
    eventCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then((result) =>{
      console.log(result)
    })
  })

});



app.get('/', (req, res) => {
  res.send('Hello World! dfdsaf')
})

app.listen(port)