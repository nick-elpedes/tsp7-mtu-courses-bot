import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(".env");

/**
 * Get list of courses by year, semester, and subject.
 */
export async function getCourses(year, semester, subject) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const courseSections = database.collection("course_sections");

    const courseData = await courseSections.find({ year, semester, subject }, {sort: [["crse", 1]]}).toArray();
    const titles = courseData.map((course) => `${course.subject}${course.crse} - ${course.title}\n`);
    return titles;
  } finally {
    await client.close();
  }
}
