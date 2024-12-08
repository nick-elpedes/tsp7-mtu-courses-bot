import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import escapeStringRegexp from "escape-string-regexp";

dotenv.config(".env");

/**
 * Get list of courses by year, semester, and subject.
 * @param {string|number} year - The year the course is offered.
 * @param {"SPRING"|"FALL"|"SUMMER"} semester - The semester the course is offered.
 * @param {string} subject - The subject of the course. (MUST BE UPPERCASE)
 */
export async function getCourses(year, semester, subject, name, num) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const courseSections = database.collection("course_sections");

    // setup the query with the required and optional args given
    let query = {
      year: parseInt(year),
      semester: semester,
      subject: subject,
    };
    if (name != "") query["title"] = dbRegex(name);
    if (num != "") query["crse"] = num;

    const courseData = await courseSections
      .find(query, { sort: [["crse", 1]] })
      .toArray();
    const titles = courseData.map(
      (course) => `${course.subject}${course.crse} - ${course.title}`
    );
    return titles;
  } catch (error) {
    console.error(error);
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
export async function getCourseData(year, semester, subject, name, num) {
  // MongoDB URI is stored in the environment variable MONGO_URI
  const uri = process.env.MONGO_URI;
  // Create the MongoDB client
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    // attempt to connect to the MongoDB client
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const courses = database.collection("courses"); // this should be using course_sections since that is where the indexes are

    // format argument data into DB readable format
    let query = {
      year: parseInt(year),
      semester: semester,
      subject: subject,
    };
    if (name != "") query["title"] = dbRegex(name);
    if (num != "") query["crse"] = num;

    // get Cursor for specified arguments
    const result = await courses.findOne(query);

    const sections = await getSections(
      result.year,
      result.semester,
      result.subject,
      result.crse
    );

    result.sections = sections;
    return result;
  } finally {
    await client.close();
  }
}

/**
 * Formats a list of sections into a readable format.
 * @param {Array} sections - The sections to format.
 */
export function formatSectionList(sections) {
  let formattedSections = [];
  for (const section of sections) {
    const scheduleData = parseSchedules(section);

    // need to cast available seats to a number
    const availableSeats = parseInt(section.availableSeats);

    // seats left: regular text
    //  <= 5 seats left: bold text
    // no seats left: strike through text
    // overfilled: italic text
    if (availableSeats < 0) {
      formattedSections.push(
        `🚫~~*${section.section} (${section.crn}): ${
          scheduleData.building ?? ""
        } ${section.room ?? ""} - ${scheduleData.days ?? "TBD"} ${
          scheduleData.startTime ?? ""
        } - ${scheduleData.endTime ?? ""} (Overfilled by ${
          section.takenSeats - section.totalSeats
        } seats)*~~`
      );
    } else if (availableSeats == 0) {
      formattedSections.push(
        `🚫~~${section.section} (${section.crn}): ${
          scheduleData.building ?? ""
        } ${section.room ?? ""} - ${scheduleData.day ?? "TBD"} ${
          scheduleData.startTime ?? ""
        } - ${scheduleData.endTime ?? ""} (No seats left)~~`
      );
    } else if (availableSeats == 1) {
      formattedSections.push(
        `‼️**${section.section} (${section.crn}): ${
          scheduleData.building ?? ""
        } ${section.room ?? ""} - ${scheduleData.days ?? "TBD"} ${
          scheduleData.startTime ?? ""
        } - ${scheduleData.endTime ?? ""} (1 seat left)**`
      );
    } else if (availableSeats <= 5) {
      formattedSections.push(
        `❗**${section.section} (${section.crn}): ${
          scheduleData.building ?? ""
        } ${section.room ?? ""} - ${scheduleData.days ?? "TBD"} ${
          scheduleData.startTime ?? ""
        } - ${scheduleData.endTime ?? ""} (${
          section.availableSeats
        } seat(s) left)**`
      );
    } else {
      formattedSections.push(
        `${section.section} (${section.crn}): ${scheduleData.building ?? ""} ${
          section.room ?? ""
        } - ${scheduleData.days ?? "TBD"} ${scheduleData.startTime ?? ""} - ${
          scheduleData.endTime ?? ""
        } (${section.availableSeats} seats left)`
      );
    }
  }
  return formattedSections;
}

/**
 * Parses the schedule of a section into something human-readable.
 * !! Written with AI assistance (Was explicitly told this was allowed for this project)
 * @param sections- The section to parse.
 * @returns
 */
function parseSchedules(section) {
  if (section.time.rrules.length == 0) {
    return {
      section: section.section ?? "N/A",
      building: section.buildingName ?? "N/A",
      room: section.room ?? "N/A",
      days: "TBA - see MTU Courses/Banweb",
      startTime: "N/A",
      endTime: "N/A",
    };
  }

  const rule = section.time.rrules[0]?.config;
  const start = rule.start;
  const end = rule.end;
  const days = rule.byDayOfWeek.join(", ");

  // Format start and end times into human-readable format
  const formatTime = ({ hour, minute }) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute.toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  return {
    section: section.section,
    building: section.buildingName,
    room: section.room,
    days,
    startTime: formatTime(start),
    endTime: formatTime(end),
  };
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

    const sectionData = await courseSections.findOne(
      { year: parseInt(year), semester, subject, crse },
      { sort: [["crse", 1]] }
    );

    // sort sections based on section identifier
    sectionData.sections.sort((a, b) => {
      if (a.section < b.section) return -1;
      if (a.section > b.section) return 1;
      return 0;
    });

    return sectionData.sections;
  } finally {
    await client.close();
  }
}

/**
 * Get a single section by year, semester, and CRN number
 * @param {string|number} year - The year the course is offered.
 * @param {"SPRING"|"FALL"|"SUMMER"} semester - The semester the course is offered.
 * @param {string|number} crn - the section's CRN number
 */
export async function getSectionData(year, semester, crn) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const courseSections = database.collection("course_sections");

    const sectionData = await courseSections.findOne(
      { year: parseInt(year), semester, subject, crse },
      { sort: [["crse", 1]] }
    );

    // sort sections based on section identifier
    sectionData.sections.sort((a, b) => {
      if (a.section < b.section) return -1;
      if (a.section > b.section) return 1;
      return 0;
    });

    return sectionData.sections;
  } finally {
    await client.close();
  }
}

/**
 * Find an instructor by name.
 * @param {string} name - The name of the instructor.
 */
export async function findInstructor(name) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();

    const database = client.db("tsp7_mtu_courses_discord_db");
    const instructors = database.collection("instructors");

    const query = { fullName: dbRegex(name) };

    const instructor = await instructors.findOne(query);
    return instructor;
  } finally {
    await client.close();
  }
}

// i am lazy :)
function dbRegex(txt) {
  return {
    $regex: new RegExp(escapeStringRegexp(txt)),
    $options: "i",
  };
}
