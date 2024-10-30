import { REST, Routes, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config(".env");

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'test',
    description: 'Test command for MTU Courses API',
  },
  new SlashCommandBuilder().setName("testcoursesfirst")
    .setDescription("Test command for MTU Courses API: /courses/first")
    .addStringOption(new SlashCommandStringOption().setName("year")
      .setDescription("The year to limit courses responses to")
      .setRequired(true))
    .addStringOption(new SlashCommandStringOption().setName("semester")
      .setDescription("The semester to limit courses responses to")
      .setRequired(true))
    .addStringOption(new SlashCommandStringOption().setName("course")
      .setDescription("The course to limit courses responses to")
      .setRequired(false))
    .addStringOption(new SlashCommandStringOption().setName("subject")
      .setDescription("The subject to limit courses responses to")
      .setRequired(false))
  .toJSON(),
  new SlashCommandBuilder().setName("testsectionsfirst")
    .setDescription("Test command for MTU Courses API: /sections/first")
    .addStringOption(new SlashCommandStringOption().setName("coursenum")
      .setDescription("The course number to limit section responses to")
      .setRequired(false))
    .addStringOption(new SlashCommandStringOption().setName("year")
      .setDescription("The year to limit section responses to")
      .setRequired(false))
    .addStringOption(new SlashCommandStringOption().setName("semester")
      .setDescription("The semester to limit section responses to")
      .setRequired(false))
  .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}