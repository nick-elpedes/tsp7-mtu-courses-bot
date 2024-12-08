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
    contexts: [0,1,2],
  },
  {
    name: "semesters",
    description: "Returns a list of semesters supported by the MTU Courses API",
    contexts: [0,1,2],
  },
  {
    name: "buildings",
    description: "Returns a list of buildings along with their coordinates",
    contexts: [0,1,2],
  },
  // new SlashCommandBuilder()
  //   .setName("getsection")
  //   .setDescription(
  //     "Get the first section from the MTU Courses API that matches the input parameters"
  //   )
  //   .addStringOption(
  //     new SlashCommandStringOption()
  //       .setName("crn")
  //       .setDescription("The CRN to limit section responses to")
  //       .setRequired(true)
  //   )
  //   .addStringOption(
  //     new SlashCommandStringOption()
  //       .setName("year")
  //       .setDescription("The year to limit section responses to")
  //       .setRequired(true)
  //   )
  //   .addStringOption(
  //     new SlashCommandStringOption()
  //       .setName("semester")
  //       .setDescription("The semester to limit section responses to")
  //       .setRequired(true)
  //   )
  //   .toJSON(),
  new SlashCommandBuilder()
    .setName("course")
    .setDescription("Search for MTU courses that match the input parameters")
    .addStringOption( simpleStringOption("subject", "The subject you want to look through courses for", true))
    .addStringOption( simpleStringOption("year", "The year you want to look at courses from", true))
    .addStringOption( simpleStringOption("semester", "The semester you want to look at courses from", true))
    .addStringOption( simpleStringOption("name", "The name, or partial name, of the course you want to look for", false))
    .addStringOption( simpleStringOption("number", "The number of the course you want to look for", false))
    .setContexts([0,1,2]),
  new SlashCommandBuilder()
    .setName("section")
    .setDescription("Search for sections from a specific class")
    .addStringOption( simpleStringOption("subject", "The subject you want to look through sections for", true))
    .addStringOption( simpleStringOption("year", "The year you want to look at sections from", true))
    .addStringOption( simpleStringOption("semester", "The semester you want to look at sections from", true))
    .addStringOption( simpleStringOption("coursenumber", "The number of the course you want to look at sections for", true))
    .addStringOption( simpleStringOption("crn", "The crn of the section you want to look at", false))
    .setContexts([0,1,2]),
  new SlashCommandBuilder()
    .setName("findinstructor")
    .setDescription("Search for MTU instructors by name")
    .addStringOption( simpleStringOption("name", "The name, or partial name, of the instructor you want to look for", true))
    .setContexts([0,1,2]),
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
    .setRequired(req)
}