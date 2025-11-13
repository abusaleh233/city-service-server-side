const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;


// millelWare
app.use(cors());
app.use(express.json());

//app.Get
app.get('/',(req,res)=>{
    res.send('city-service-port')
})


// mongodb-url
const uri = "mongodb+srv://issue-db:nR6zPuXWC8v6EhHn@cluster0.1quotkl.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    
    await client.connect();

        // mongodb-collection
        const db = client.db('issue-db');
        const issueCollection = db.collection('issues');
        const contributionCollection = db.collection('contribution');

        // home-page-url
        app.get('/latest-issues', async (req,res)=>{
            const cursor = issueCollection.find().sort({date: 1 }).limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        // all-issue-url
        app.get('/issues', async (req,res)=>{
            const cursor = issueCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        // details-page-url
        app.get('/issues/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await issueCollection.findOne(query);
            res.send(result);
        })

        app.post('/issues', async(req,res) => {
            const newIssue = req.body;
            const result = await issueCollection.insertOne(newIssue);
            res.send(result);
        })

        // My-iissues-id
          app.get('/myissues/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await issueCollection.findOne(query);
            res.send(result);
        })

         app.get('/my-issues', async(req,res) => {
            const email = req.query.email
            const result = await issueCollection.find({email: email}).toArray()
            res.send(result);
        })

        // update-issue
        app.put('/issues/:id',async(req,res) => {
            const id = req.params.id;
            const updateissue = req.body;
            const query = {_id: new ObjectId(id)};
            const update = {
                $set: updateissue
    
            }
            const option ={}
            const result = await issueCollection.updateOne(query, update, option)
            res.send(result);
        })

        app.delete('/issues/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await issueCollection.deleteOne(query);
            res.send(result);
        })

         app.post('/contribution', async(req,res) => {
            const newcontribution = req.body;
            const result = await contributionCollection.insertOne(newcontribution);
            res.send(result);
        })

        app.get('/contribution', async (req,res)=>{
            const cursor = contributionCollection.find()
            const result = await cursor.toArray();
            res.send(result);

        })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
  }
}
run().catch(console.dir);




// listen
app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
})




