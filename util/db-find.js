import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(".env");

export async function findCourses(subj, yr, sem, name, num) {
  // MongoDB URI is stored in the environment variable MONGO_URI
  const uri = process.env.MONGO_URI;
  // Create the MongoDB client
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    // attempt to connect to the MongoDB client
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const courses = database.collection("courses");

    // format argument data into DB readable format
    let query = {};
    if (subj != "") query["subject"] = subj;
    if (yr != "") query["year"] = parseInt(yr);
    if (sem != "") query["semester"] = sem;
    if (name != "") query["title"] = dbRegex(name);
    if (num != "") query["crse"] = dbRegex(num);

    // get Cursor for specified arguments
    const result = await courses.find(query).toArray();
    console.log("Result fetched! Logging...")

    for await (const course of result) {
      console.log(course);
    }
    console.log("Done logging!");

  } finally {
    await client.close();
  }
}

function dbRegex(txt) {
  return {
    $regex: `${txt}`, $options: 'i'
  }
}