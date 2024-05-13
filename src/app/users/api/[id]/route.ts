// import { NextRequest, NextResponse } from "next/server";
// import data from "../data.json";
// export function GET(
//   request: Request,
//   context: {
//     params: {
//       id: string;
//     };
//   }
// ) {
//   const id = +context.params.id;
//   if (id > data.users.length) {
//     return NextResponse.json(
//       { message: "Comment not found" },
//       {
//         status: 404,
//       }
//     );
//   }
//   const comment = data.users.find((cm) => cm.id === id);
//   return Response.json(comment);
// }

// export function DELETE(
//   request: Request,
//   context: {
//     params: {
//       id: string;
//     };
//   }
// ) {
//   const id = +context.params.id;
//   const index = data.users.findIndex((cm) => cm.id === id);
//   data.users.splice(index, 1);
//   return NextResponse.json(data);
// }

// export async function PUT(
//   request: Request,
//   context: {
//     params: {
//       id: string;
//     };
//   }
// ) {
//   const id = +context.params.id;
//   const comment = await request.json();
//   const newComments = data.users.map((c) => (c.id === id ? comment : c));
//   return NextResponse.json(newComments);
// }

import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri =
  "mongodb+srv://your_username:your_password@cluster0.odgtuwd.mongodb.net/your_database?retryWrites=true&w=majority";

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
    const user = await usersCollection.findOne({ _id: ObjectId(id) });
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
    const result = await usersCollection.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "User deleted successfully" });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

// export async function PUT(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   const id = context.params.id;
//   const updatedUser = await request.json();
//   try {
//     const usersCollection = await connectToDatabase();
//     const result = await usersCollection.updateOne(
//       { _id: ObjectId(id) },
//       { $set: updatedUser }
//     );
//     if (result.matchedCount === 1) {
//       return NextResponse.json({ message: "User updated successfully" });
//     } else {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return NextResponse.error("Internal Server Error", { status: 500 });
//   }
// }
