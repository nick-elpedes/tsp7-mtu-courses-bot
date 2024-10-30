import { Client, GatewayIntentBits } from "discord.js";
import { buildSemestersEmbed } from "./util/embed-builder.js";
import dotenv from "dotenv";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

dotenv.config(".env");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (interaction.commandName === "semesters") { // this is where the bot accesses all the get API calls from mtu courses
    const semesters = await fetch("https://api.michigantechcourses.com/semesters", {
      method: "GET",
    });
    const embed = buildSemestersEmbed(await semesters.json());

    await interaction.reply({ embeds: [embed] });
  } else if (interaction.commandName === "buildings") { 
    const buildings = await fetch("https://api.michigantechcourses.com/buildings", {
      method: "GET",
    });
    const embed = buildBuildingsEmbed(await buildings.json());

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
