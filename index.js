const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Todo app is running')
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1riwc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    await client.connect();
    const dataCollections = client.db('todoList').collection('data');
    app.get('/todos', async (req, res) => {
        const cursor = dataCollections.find({});
        const result = await cursor.toArray();
        res.send(result);
    });
    app.post('/todo', async (req, res) => {
        const data = req.body;
        console.log(data);
        const result = await dataCollections.insertOne(data);
        console.log(result)
        res.send(result);
    });
    app.put('/todo/:id', async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        console.log(data);
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                name: data.name,
                message: data.message,
            },
        };
        const result = await dataCollections.updateOne(filter, updateDoc, options);
        res.send(result);
    });
    app.delete('/todo/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await dataCollections.deleteOne(filter);
        if (result.deletedCount === 1) {
            console.log("Data is deleted with id", id)
        }
        else {
            console.log("Data is already deleted")
        }
        res.send(result)
    })

}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`Todo app running on ${port}`)
})