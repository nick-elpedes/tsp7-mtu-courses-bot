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

    return embed = new EmbedBuilder()
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


export function buildBuildingsEmbed(json) {
    // make sure that the object provided is actually json
    if (!json || typeof json !== "object") {
        return { completed: false, error: "Invalid JSON object" };
    }
    console.log(json);
    
    const embed = new EmbedBuilder()
    .setTitle(`Buildings`);

    for(const building of json) {
        embed.addFields(
            {
            name: `${building.name} (${building.shortName})`,
            value: `Lat: ${building.lat}, Long: ${building.lon}`,
            inline: false
            }
        );
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

  return new EmbedBuilder()
    .setTitle(`nyi`)
    .setDescription(`nyi`)
    .setColor("#ffea00")
    .setFooter({
      text: "Retrieved from MTU Courses",
    })
    .setTimestamp();
}
