import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(".env");

/**
 * Get list of courses by year, semester, and subject.
 * @param {string|number} year - The year the course is offered.
 * @param {"SPRING"|"FALL"|"SUMMER"} semester - The semester the course is offered.
 * @param {string} subject - The subject of the course. (MUST BE UPPERCASE)
 */
export async function getCourses(year, semester, subject) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const courseSections = database.collection("course_sections");

    const courseData = await courseSections
      .find({ year: parseInt(year), semester, subject }, { sort: [["crse", 1]] })
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
 * Gets the full course json for the first course that matches the input parameters
 * @param {string|number} yr - The year the course is offered
 * @param {"SPRING"|"FALL"|"SUMMER"} sem - The semester the course is offered.
 * @param {string} subj - The subject of the course. (MUST BE UPPERCASE)
 * @param {string} name - The name, or part of the name, of the course.
 * @param {string} num - The course number.
 */
export async function getCourseData(yr, sem, subj, name, num) {
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
    if (num != "") query["crse"] = num;

    // get Cursor for specified arguments
    const result = await courses.findOne(query);
    return result;

  } finally {
    await client.close();
  }
}

/**
 * Get list of sections by year, semester, subject, and course number.
 * @param {string|number} year - The year the course is offered.
 * @param {"SPRING"|"FALL"|"SUMMER"} semester - The semester the course is offered.
 * @param {string} subject - The subject of the course. (MUST BE UPPERCASE)
 * @param {string} crse - The course number.
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
    returnData.sectionData = sectionData.sections;
    return returnData;
  } finally {
    await client.close();
  }
}

// i am lazy :)
function dbRegex(txt) {
  return {
    $regex: `${txt}`, $options: 'i'
  }
}