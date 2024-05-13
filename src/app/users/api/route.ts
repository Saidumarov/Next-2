import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";

const uri =
  "mongodb+srv://saidumarovjafarxon:3hq0F4dsnamY2POo@cluster0.com3cmr.mongodb.net/?retryWrites=true&w=majority";

async function connectToDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function GET() {
  const db = await connectToDatabase();
  const collection = db.collection("users");
  const users = await collection.find().toArray();
  return Response.json(users);
}

export async function POST(request: NextRequest) {
  try {
    const { fullname, age } = await request.json();

    const db = await connectToDatabase();

    const collection = db.collection("users");

    const result = await collection.insertOne({ fullname, age });
    const newComment = { fullname, age };

    return Response.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
  }
}
