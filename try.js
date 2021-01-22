import mongo from "mongodb";
import { Settings } from './settings.js';
import './imports/settingsImports.js';

const MongoClient = mongo.MongoClient;
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://username:password@cluster0.l2xjw.azure.mongodb.net/tryProj?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let changeStream;
async function run() {
  try {
    await client.connect();
    const database = client.db("sample_mflix");
    const collection = database.collection("movies");

    // open a Change Stream on the "movies" collection
    changeStream = collection.watch({ fullDocument: 'updateLookup' });

    // set up a listener when change events are emitted
    changeStream.on("change", next => {
      // process any change event
      console.log("received a change to the collection: \t", next);
      Settings.execute(next);
    });

    // use a timeout to ensure the listener is registered before the insertOne
    // operation is called.
    await new Promise(resolve => {
      setTimeout(async () => {
        const doc = await collection.findOne({ name: 'aviv'});
        await collection.updateOne({
          name: "aviv",
        }, { $set: { 'value': !doc.value  } });
        
        // wait to close `changeStream` after the listener receives the event
        setTimeout(async () => {
          resolve(await changeStream.close());
        }, 1000);
      }, 1000);
    });
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
