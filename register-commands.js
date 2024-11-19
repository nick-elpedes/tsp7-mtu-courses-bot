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
      "Returns the first course that matches the given parameters, if one is found"
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
        .setName("subject")
        .setDescription("The subject to limit courses responses to")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("course")
        .setDescription("The course to limit courses responses to")
        .setRequired(false)
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName("getsection")
    .setDescription(
      "Returns the first section that matches the given parameters, if one is found"
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("crn")
        .setDescription("The crn to search for")
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
