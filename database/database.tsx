
import { MongoClient, ServerApiVersion, MongoClientOptions, Db } from "npm:mongodb";
import dbConfig from './dbConfig.tsx';
const uri = `mongodb+srv://${dbConfig.userName}:${dbConfig.password}@${dbConfig.hostname}?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri);

await client.connect();
const db: Db = client.db("otrio");
export default db