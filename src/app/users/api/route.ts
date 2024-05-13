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
    const newComment = { id: result.insertedId, fullname, age };

    return Response.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
  }
}

// export async function DELETE(request: NextRequest) {
//   try {
//     // Get the user ID from the request body
//     const { id } = await request.json();

//     // Connect to MongoDB
//     const db = await connectToDatabase();

//     // Get the users collection
//     const collection = db.collection("users");

//     // Delete the user by ID
//     const result = await collection.deleteOne({ _id: ObjectId(id) });

//     if (result.deletedCount === 1) {
//       return Response.json({ message: "User deleted successfully" });
//     } else {
//       console.error("Error handling DELETE request:");
//     }
//   } catch (error) {
//     console.error("Error handling DELETE request:", error);
//   }
// }

// export async function PUT(request: NextRequest) {
//   try {
//     // Get the user ID and updated data from the request body
//     const { id, fullname, age } = await request.json();

//     // Connect to MongoDB
//     const db = await connectToDatabase();

//     // Get the users collection
//     const collection = db.collection("users");

//     // Update the user by ID
//     const result = await collection.updateOne(
//       { _id: ObjectId(id) },
//       { $set: { fullname, age } }
//     );

//     if (result.matchedCount === 1) {
//       return Response.json({ message: "User updated successfully" });
//     } else {
//       console.error("Error handling PUT request:", error);
//     }
//   } catch (error) {
//     console.error("Error handling PUT request:", error);
//   }
// }
