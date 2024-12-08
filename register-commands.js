import {
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import dotenv from "dotenv";

dotenv.config(".env");

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
    contexts: [0, 1, 2],
  },
  {
    name: "semesters",
    description: "Returns a list of semesters supported by the MTU Courses API",
    contexts: [0, 1, 2],
  },
  {
    name: "buildings",
    description: "Returns a list of buildings along with their coordinates",
    contexts: [0, 1, 2],
  },
  new SlashCommandBuilder()
    .setName("course")
    .setDescription("Search for MTU courses that match the input parameters")
    .addStringOption(
      simpleStringOption("subject", "The subject you want to look for data in (Examples: SS, UN, HU)", true)
    )
    .addStringOption(
      simpleStringOption(
        "year",
        "The year you want to look at courses from",
        true
      )
    )
    .addStringOption(semesterStringOption())
    .addStringOption(
      simpleStringOption(
        "name",
        "The name, or partial name, of the course you want to look for",
        false
      )
    )
    .addStringOption(
      simpleStringOption(
        "number",
        "The number of the course you want to look for",
        false
      )
    )
    .setContexts([0, 1, 2]),
  new SlashCommandBuilder()
    .setName("section")
    .setDescription("Search for sections from a specific class")
    .addStringOption(
      simpleStringOption("subject", "The subject you want to look for data in (Examples: SS, UN, HU)", true)
    )
    .addStringOption(
      simpleStringOption(
        "year",
        "The year you want to look at sections from",
        true
      )
    )
    .addStringOption(semesterStringOption())
    .addStringOption(
      simpleStringOption(
        "coursenumber",
        "The number of the course you want to look at sections for",
        true
      )
    )
    .addStringOption(
      simpleStringOption(
        "crn",
        "The crn of the section you want to look at",
        false
      )
    )
    .setContexts([0, 1, 2]),
  new SlashCommandBuilder()
    .setName("instructor")
    .setDescription("Search for MTU instructors by name")
    .addStringOption(
      simpleStringOption(
        "name",
        "The name, or partial name, of the instructor you want to look for",
        true
      )
    )
    .setContexts([0, 1, 2]),
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}

// i cant read this js file to just find a command, this makes the string options less annoying
function simpleStringOption(name, desc, req) {
  return new SlashCommandStringOption()
    .setName(name)
    .setDescription(desc)
    .setRequired(req);
}

function semesterStringOption() {
  return new SlashCommandStringOption()
    .setName("semester")
    .setDescription("The semester you want to look for data in")
    .setRequired(true)
    .addChoices(
      { name: "Fall", value: "FALL" },
      { name: "Spring", value: "SPRING" },
      { name: "Summer", value: "SUMMER" }
    );
}

// function subjectStringOption() {
//   return new SlashCommandStringOption()
//     .setName("subject")
//     .setDescription("The subject you want to look for data in")
//     .setRequired(true)
//     .addChoices(
//       { name: "Accounting", value: "ACC" },
//       { name: "Air Force ROTC", value: "AF" },
//       { name: "Army ROTC", value: "AR" },
//       { name: "Art", value: "ART" },
//       { name: "Biological Studies", value: "BL" },
//       { name: "Biomedical Engineering", value: "BE" },
//       { name: "Business", value: "BUS" },
//       { name: "Chemical Engineering", value: "CM" },
//       { name: "Chemistry", value: "CH" },
//       { name: "Civil and Environmental Engineering", value: "CEE" },
//       { name: "Computer Science", value: "CS" },
//       { name: "Construction Management", value: "CMG" },
//       { name: "Data Science", value: "DATA" },
//       { name: "Economics", value: "EC" },
//       { name: "Electrical and Computer Engineering", value: "EE" },
//       { name: "Electrical Engineering Technology", value: "EET" },
//       { name: "Engineering Fundamentals", value: "ENG" },
//       { name: "Enterprise", value: "ENT" },
//       { name: "Finance", value: "FIN" },
//       { name: "Forest Resources and Environmental Science", value: "FW" },
//       { name: "Geological and Mining Engineering and Sciences", value: "GE" },
//       { name: "Human Factors", value: "HF" },
//       { name: "Honors, Pavlis", value: "HON" },
//       { name: "Humanities", value: "HU" },
//       { name: "Kinesiology and Integrative Physiology", value: "KIP" },
//       { name: "Management", value: "MGT" },
//       { name: "Management Information Systems", value: "MIS" },
//       { name: "Marketing", value: "MKT" },
//       { name: "Materials Science and Engineering", value: "MSE" },
//       { name: "Mathematical Sciences", value: "MA" },
//       { name: "Mechanical Engineering-Engineering Mechanics", value: "MEEM" },
//       { name: "Mechanical Engineering Technology", value: "MET" },
//       { name: "Music", value: "MUS" },
//       { name: "Nursing", value: "NUR" },
//       { name: "Operations and Supply Chain Management", value: "OSM" },
//       { name: "Physical Education", value: "PE" },
//       { name: "Physics", value: "PH" },
//       { name: "Psychology", value: "PSY" },
//       { name: "Sciences and Arts", value: "SA" },
//       { name: "Social Sciences", value: "SS" },
//       { name: "Sound", value: "SND" },
//       { name: "Surverying", value: "SU" },
//       { name: "Systems Administration Technology", value: "SAT" },
//       { name: "Theatre", value: "THEA" },
//       { name: "University Wide", value: "UN" }
//     );
// }
