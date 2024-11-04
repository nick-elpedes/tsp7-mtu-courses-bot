import { EmbedBuilder } from "discord.js";

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

  // create the embed
  return new EmbedBuilder()
    .setTitle("Available Semesters")
    .addFields(
      {
        name: "Spring",
        value: `${seasons.SPRING[0]}-${seasons.SPRING[seasons.SPRING.length - 1]}`,
        inline: false,
      },
      {
        name: "Summer",
        value: `${seasons.SUMMER[0]}-${seasons.SUMMER[seasons.SUMMER.length - 1]}`,
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

/**
 * Builds an embed for a course object from /courses or /courses/first
 * @param {Object} json - The JSON response from the API
 * @returns {EmbedBuilder} - The completed embed
 */
export function buildCourseEmbed(json) {
  // make sure that the object provided is actually json
  if (!json || typeof json !== "object") {
    return { completed: false, error: "Invalid JSON object" };
  }

  let formatOffer = "";
  let offered = json.offered;
  for (var whence of offered) {
    formatOffer += whence + ", "
  }
  formatOffer = formatOffer.substring(0, formatOffer.length - 2); // cut off the extra ", " i added

  let formatCredits = "" + json.minCredits;
  if (json.minCredits != json.maxCredits) {
    formatCredits += ` - ${json.maxCredits}`;
  }

  return new EmbedBuilder()
    .setAuthor({
      name: `${json.subject} ${json.crse}`,
    })
    .setTitle(`${json.title}`)
    .setDescription(`${json.description}`)
    .addFields(
      {
        name: "Offered",
        value: formatOffer,
        inline: false
      },
      {
        name: "Credits",
        value: formatCredits,
        inline: false
      },
      {
        name: "Pre-Requisites",
        value: json.prereqs,
        inline: false
      }
    )
    .setColor("#ffea00")
    .setFooter({
      text: "Retrieved from MTU Courses",
    })
    .setTimestamp();
}

/**
 * Builds an embed for a course object from /courses or /courses/first
 * @param {Object} json - The JSON response from the API
 * @returns {EmbedBuilder} - The completed embed
 */
export function buildSectionEmbed(json) {
  // make sure that the object provided is actually json
  if (!json || typeof json !== "object") {
    return { completed: false, error: "Invalid JSON object" };
  }

  var days = "";
  if (json.time.rrules != null && json.time.rrules.length > 0 && json.time.rrules[0].config.byDayOfWeek != null && json.time.rrules[0].config.byDayOfWeek.length > 0) {
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
          days += "?"
          break;
      }
      days += ", ";
    }
  }

  // Finish formatting days
  if (days == "") {
    days = "None"
  } else {
    days = days.substring(0, days.length - 2);
  }

  return new EmbedBuilder()
    .setAuthor(
      {
        name: `${json.course.subject} ${json.course.crse}: ${json.section}`
      }
    )
    .setTitle(`${json.course.title}`)
    .setDescription(`${json.course.description}`)
    .setFields(
      {
        name: "Days",
        value: days,
        inline: false
      },
      {
        name: "Location",
        value: `${json.buildingName} ${json.room}`,
        inline: false
      },
      {
        name: "Seats",
        value: `${json.totalSeats} Total\n${json.totalSeats - json.takenSeats} Left`,
        inline: false
      }
    )
    .setColor("#ffea00")
    .setFooter({
      text: "Retrieved from MTU Courses",
    })
    .setTimestamp();
}
