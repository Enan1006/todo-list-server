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
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1riwc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    await client.connect();
    const dataCollections = client.db('todoList').collection('data');
    app.get('/todos', async (req, res) => {
        const cursor = dataCollections.find({});
        const result = await cursor.toArray();
        res.send(result)
    });

}
run().catch(console.dir)


app.listen(port, () => {
    console.log(`Todo app running on ${port}`)
})