import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri =
  "mongodb+srv://saidumarovjafarxon:3hq0F4dsnamY2POo@cluster0.com3cmr.mongodb.net/?retryWrites=true&w=majority";

async function connectToDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db().collection("users");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  try {
    const usersCollection = await connectToDatabase();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  try {
    const usersCollection = await connectToDatabase();
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "User deleted successfully" });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  const updatedUser = await request.json();
  try {
    const usersCollection = await connectToDatabase();
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );
    if (result.matchedCount === 1) {
      return NextResponse.json({ message: "User updated successfully" });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
}
