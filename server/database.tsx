import { Db, MongoClient } from "npm:mongodb";
import bcrypt from "npm:bcryptjs";
import dbConfig from "./dbConfig.tsx";
const uri =
  `mongodb+srv://${dbConfig.userName}:${dbConfig.password}@${dbConfig.hostname}?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri);

await client.connect();
const db: Db = client.db("otrio");
// AFTER THIS IS FOR THIS PROJECT
export async function fetchScores() {
  const scores = scoreCollection.find({}).toArray();
  return new Response(JSON.stringify(await scores), {
    headers: { "Content-Type": "application/json" },
  });
}

export const userCollection = db.collection("users");
export const scoreCollection = db.collection("scores");
export function getUser(info: LoginRequest) {
  return userCollection.findOne({ username: info.username });
}

export function getUserByToken(token: string) {
  return userCollection.findOne({ token: token }).then((doc) => {
    return ((doc as unknown) as User);
  });
}

export interface LoginRequest {
  username: string;
  password: string;
}
export interface User {
  _id?: string;
  username: string;
  password: string;
  token: string;
}

export async function createUser(info: LoginRequest): Promise<User> {
  const user = {
    username: info.username,
    password: await bcrypt.hash(info.password, 10),
    token: crypto.randomUUID(),
  };
  await userCollection.insertOne(user);

  return user;
}
