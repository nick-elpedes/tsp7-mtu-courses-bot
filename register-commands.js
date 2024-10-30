import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config(".env");

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'semesters',
    description: 'returns what the semesters get returns',
  },
  {
    name: 'buildings',
    description: 'returns what the buildings get returns',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}