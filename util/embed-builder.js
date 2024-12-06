import { EmbedBuilder } from "discord.js";
import { formatSectionList } from "../mongo/helper-commands.js";

/**
 * Builds an embed for the semesters command
 * @param {Object} json - The JSON response from the API
 * @returns {EmbedBuilder} - The completed embed
 */
export function buildSemestersEmbed(json) {
  // make sure that the object provided is actually json
  if (!json || typeof json !== "object") {
    return { completed: false, error: "Invalid JSON object" };
  }

  // put each semester type (season) into its own array
  const seasons = {
    FALL: [],
    SPRING: [],
    SUMMER: [],
  };

  json.map((semester) => {
    seasons[semester.semester].push(semester.year);
  });

  // sort the years in each season array
  for (const season in seasons) {
    seasons[season].sort();
  }

  return new EmbedBuilder()
    .setTitle("Available Semesters")
    .addFields(
      {
        name: "Spring",
        value: `${seasons.SPRING[0]}-${
          seasons.SPRING[seasons.SPRING.length - 1]
        }`,
        inline: false,
      },
      {
        name: "Summer",
        value: `${seasons.SUMMER[0]}-${
          seasons.SUMMER[seasons.SUMMER.length - 1]
        }`,
        inline: false,
      },
      {
        name: "Fall",
        value: `${seasons.FALL[0]}-${seasons.FALL[seasons.FALL.length - 1]}`,
        inline: false,
      }
    )
    .setColor("#ffea00")
    .setFooter({
      text: "Retrieved from MTU Courses",
    })
    .setTimestamp();
}

export function buildBuildingsEmbed(json) {
  // make sure that the object provided is actually json
  if (!json || typeof json !== "object") {
    return { completed: false, error: "Invalid JSON object" };
  }

  const embed = new EmbedBuilder().setTitle(`Buildings`);

  for (const building of json) {
    embed.addFields({
      name: `${building.name} (${building.shortName})`,
      value: `Lat: ${building.lat}, Long: ${building.lon}`,
      inline: false,
    });
  }

  embed
    .setColor("#ffea00")
    .setFooter({
      text: "Retrieved from MTU Courses",
    })
    .setTimestamp();

  return embed;
}

/**
 * Builds an embed for a single course from /course
 * @param {Object} json - The JSON response from the API
 * @returns {EmbedBuilder} - The completed embed
 */
export function buildCourseDataEmbed(json) {
  // make sure that the object provided is actually json
  if (!json || typeof json !== "object") {
    return { completed: false, error: "Invalid JSON object" };
  }

  let formatOffer = "";
  let offered = json.offered;
  for (var whence of offered) {
    formatOffer += whence + ", ";
  }
  formatOffer = formatOffer.substring(0, formatOffer.length - 2); // cut off the extra ", " i added

  let formatCredits = "" + json.minCredits;
  if (json.minCredits != json.maxCredits) {
    formatCredits += ` - ${json.maxCredits}`;
  }

  // create section list
  let sectionList = "";
  if (json.sections && json.sections.length >= 0) {
    const sections = formatSectionList(json.sections);
    for (const section of sections) {
      sectionList += `${section}\n`;
    }
  } else {
    sectionList = "No sections found";
  }

  let embed = new EmbedBuilder();
  try {
    embed.setAuthor({
      name: `${json.subject} ${json.crse}`,
    });
    embed.setTitle(`${json.title ?? "Unknown"}`);
    embed.setDescription(`${json.description ?? "Unknown"}`);
    embed.setFields(
      {
        name: "Offered",
        value: (formatOffer && formatOffer.length != 0) ? formatOffer : "Unknown; See MTU Courses/Banweb",
        inline: false,
      },
      {
        name: "Credits",
        value: formatCredits ?? "N/A",
        inline: true,
      },
      {
        name: "Pre-Requisites",
        value: json.prereqs ?? "N/A",
        inline: true,
      },
      {
        name: "Sections",
        value: sectionList.substring(0, 1024), // needs to be fixed or section data will be cut off.
        inline: false,
      }
    );
    embed.setColor("#ffea00");
    embed.setFooter({
      text: "Retrieved from MTU Courses",
    });
    embed.setTimestamp();
    return embed;
  } catch (error) {
   // console.error(error);
    return build404Embed();
  }
}

/**
 * Builds an embed for multiple course from /course
 * @param {Object} json - The JSON response from the API
 * @returns {EmbedBuilder} - The completed embed
 */
export function buildCoursesEmbed(json) {
  // make sure that the object provided is actually json
  if (!json || typeof json !== "object") {
    return { completed: false, error: "Invalid JSON object" };
  }

  let courseList = "";
  for (let i = 0; i < json.length; i++) {
    courseList += json[i];
    if (i + 1 < json.length) courseList += "\n"; // spacing if there is another element
  }

  return new EmbedBuilder()
    .setTitle(`Matched Courses:`)
    .setDescription(courseList)
    .setColor("#ffea00")
    .setFooter({
      text: "Retrieved from MTU Courses",
    })
    .setTimestamp();
}

/**
 * Builds an embed for a section object from /sections or /sections/first
 * @param {Object} json - The JSON response from the API
 * @returns {EmbedBuilder} - The completed embed
 */
export function buildSectionEmbed(json) {
  // make sure that the object provided is actually json
  if (!json || typeof json !== "object") {
    return { completed: false, error: "Invalid JSON object" };
  }

  var days = "";
  if (
    json.time.rrules != null &&
    json.time.rrules.length > 0 &&
    json.time.rrules[0].config.byDayOfWeek != null &&
    json.time.rrules[0].config.byDayOfWeek.length > 0
  ) {
    for (var whence of json.time.rrules[0].config.byDayOfWeek) {
      switch (whence) {
        case "MO":
          days += "Monday";
          break;
        case "TU":
          days += "Tuesday";
          break;
        case "WE":
          days += "Wednesday";
          break;
        case "TH":
          days += "Thursday";
          break;
        case "FR":
          days += "Friday";
          break;
        default:
          days += "?";
          break;
      }
      days += ", ";
    }
  }

  // Finish formatting days
  if (days == "") {
    days = "None";
  } else {
    days = days.substring(0, days.length - 2);
  }

  return new EmbedBuilder()
    .setAuthor({
      name: `${json.course.subject} ${json.course.crse}: ${json.section}`,
    })
    .setTitle(`${json.course.title}`)
    .setDescription(`${json.course.description}`)
    .setFields(
      {
        name: "Days",
        value: days,
        inline: false,
      },
      {
        name: "Location",
        value: `${json.buildingName} ${json.room}`,
        inline: false,
      },
      {
        name: "Seats",
        value: `${json.totalSeats} Total\n${
          json.totalSeats - json.takenSeats
        } Left`,
        inline: false,
      }
    )
    .setColor("#ffea00")
    .setFooter({
      text: "Retrieved from MTU Courses",
    })
    .setTimestamp();
}

export function buildInstructorsEmbed(json) {
  // make sure that the object provided is actually json
  if (!json || typeof json !== "object") {
    return { completed: false, error: "Invalid JSON object" };
  }

  const embed = new EmbedBuilder()
    .setTitle(`Instructor`)
    .setDescription(`Instructor`)
    .addFields({
      name: `${json?.fullName}`,
      value: `${json?.email}`,
      inline: false,
    })
    .setColor("#ffea00")
    .setFooter({
      text: "Retrieved from MTU Courses",
    })
    .setTimestamp();

  return embed;
}

/**
 * Build 404 error embed
 */
export function build404Embed() {
  return new EmbedBuilder()
    .setTitle("Not Found, or Error")
    .setDescription("That combination of parameters didn't find anything, or there was an error.")
    .setColor("#ff0000")
    .setFooter({
      text: "NOT Retrieved from MTU Courses. Can't find it, there's only soup.",
    })
    .setTimestamp();
}
