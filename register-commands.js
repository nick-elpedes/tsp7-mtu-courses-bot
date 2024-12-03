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
  },
  {
    name: "semesters",
    description: "Returns a list of semesters supported by the MTU Courses API",
  },
  {
    name: "buildings",
    description: "Returns a list of buildings along with their coordinates",
  },
  new SlashCommandBuilder()
    .setName("getcourse")
    .setDescription(
      "Get the first course from the MTU Courses API that matches the input parameters"
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("year")
        .setDescription("The year to limit courses responses to")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("semester")
        .setDescription("The semester to limit courses responses to")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("course")
        .setDescription("The course to limit courses responses to")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("subject")
        .setDescription("The subject to limit courses responses to")
        .setRequired(true)
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName("getsection")
    .setDescription(
      "Get the first section from the MTU Courses API that matches the input parameters"
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("crn")
        .setDescription("The CRN to limit section responses to")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("year")
        .setDescription("The year to limit section responses to")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("semester")
        .setDescription("The semester to limit section responses to")
        .setRequired(true)
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName("findcourses")
    .setDescription("Search for MTU courses that match the input parameters")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("subject")
        .setDescription("The subject you want to look through courses for")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("year")
        .setDescription("The year you want to look at courses from")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("semester")
        .setDescription("The semester you want to look at courses from")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("name")
        .setDescription(
          "The name, or partial name, of the course you want to look for"
        )
        .setRequired(false)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("number")
        .setDescription("The number of the course you want to look for")
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("findinstructor")
    .setDescription("Search for MTU instructors by name")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("name")
        .setDescription("The name, or partial name, of the instructor you want to look for")
        .setRequired(true)
    ),
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
