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
   
    
    
   
    
    return embed = new EmbedBuilder()
    .addFields(
    {
      name: `${name} (${shorthand})`,
      value: `Lat: ${latitude},Long: ${longitude}`,
      inline: false
    },
  );
}
