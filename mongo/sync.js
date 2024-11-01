import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(".env");

/**
 * Syncs the courses and sections from the MTU Courses API to the MongoDB database.
 */
export async function syncCourses() {
  // MongoDB URI is stored in the environment variable MONGO_URI
  const uri = process.env.MONGO_URI;
  // Create the MongoDB client
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    // attempt to connect to the MongoDB client
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const courses = database.collection("courses");

    // Get the data from the MTU Courses API
    // Fair warning that this will get A LOT of data.
    const courseData = await fetch(
      "https://api.michigantechcourses.com/courses",
      {
        method: "GET",
      }
    );
    // Get JSON from response
    const courseJSON = await courseData.json();
    console.log(`Fetched ${courseJSON.length} courses from the API`);

    // Upsert each course. This is definitly a good idea. Nothing can go wrong here.
    for (const course of courseJSON) {
      await courses.updateOne(
        { id: course.id },
        { $set: course },
        { upsert: true }
      );
    }
    console.log("Upserted courses");
  } finally {
    await client.close();
  }
}

/** sync sections */
export async function syncSections() {
  const uri = process.env.MONGO_URI; //todo fix this
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const sections = database.collection("sections");

    const sectionData = await fetch(
      "https://api.michigantechcourses.com/sections",
      {
        method: "GET",
      }
    );
    const sectionJSON = await sectionData.json();
    console.log(`Fetched ${sectionJSON.length} sections from the API`);

    for (const section of sectionJSON) {
      await sections.updateOne(
        { id: section.id },
        { $set: section },
        { upsert: true }
      );
    }
    console.log("Upserted sections");
  } finally {
    await client.close();
  }
}

export async function aggrtegateSections() {
  const uri = process.env.MONGO_URI; // todo fix
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const courses = database.collection("courses");
    const sections = database.collection("sections");

    // drop the course_sections collection
    await database.dropCollection("course_sections");

    const pipeline = [
      {
        $lookup: {
          from: "sections",
          localField: "id",
          foreignField: "courseId",
          as: "sections",
        },
      },
    ];

    const courseSections = await courses.aggregate(pipeline).toArray();

    // insert the course_sections collection
    await database.collection("course_sections").insertMany(courseSections);
    console.log("Recreated course_sections collection");
  } finally {
    await client.close();
  }
}

/**
 * Update the last accessed document in the metadata collection
 */
export async function updateLastAccessed() {
  const uri = process.env.MONGO_URI; // todo fix
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const metadata = database.collection("metadata");

    const now = new Date();
    await metadata.updateOne(
      { name: "lastAccessed" },
      { $set: { value: now } },
      { upsert: true }
    );
    console.log("Updated last accessed time");
  } finally {
    await client.close();
  }
}

// Run the sync function
await syncCourses();
await syncSections();
await updateLastAccessed();
await aggrtegateSections();