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

    const courseData = await courseSections
      .find({ year, semester, subject }, { sort: [["crse", 1]] })
      .toArray();
    const titles = courseData.map(
      (course) => `${course.subject}${course.crse} - ${course.title}`
    );
    return titles;
  } finally {
    await client.close();
  }
}

/**
 * Get list of courses by year, semester, and subject.
 */
export async function getSections(year, semester, subject, crse) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const courseSections = database.collection("course_sections");

    const returnData = {
      year: parseInt(year),
      semester,
      subject,
      crse,
      sectionData: [],
    };
    const sectionData = await courseSections
      .findOne({ year: parseInt(year), semester, subject, crse }, { sort: [["crse", 1]] });
      console.log(typeof sectionData);
    returnData.sectionData = sectionData.sections;
    console.log(returnData);
    return returnData;
  } finally {
    await client.close();
  }
}

getSections("2022", "SPRING", "CS", "3141");