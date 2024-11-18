import { Client, GatewayIntentBits } from "discord.js";
import { buildSemestersEmbed, buildCourseEmbed, buildBuildingsEmbed, buildSectionEmbed } from "./util/embed-builder.js";
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
  } else if (interaction.commandName === "testcoursesfirst") {
    await interaction.deferReply();
    // Get arguments
    let year = interaction.options.getString("year") ?? "";
    let semester = interaction.options.getString("semester") ?? "";
    let course = interaction.options.getString("course") ?? "";
    let subject = interaction.options.getString("subject") ?? "";

    // Format arguments into API readable format
    let args = ""; // op between API args     // arg
    if (year != "") args += (args == "" ? "?" : "&") + `year=${year}`;
    if (semester != "")
      args += (args == "" ? "?" : "&") + `semester=${semester}`;
    if (course != "") args += (args == "" ? "?" : "&") + `crse=${course}`;
    if (subject != "") args += (args == "" ? "?" : "&") + `subject=${subject}`;

    // Get API data and turn it into an embed
    const courseData = await fetch(
      `https://api.michigantechcourses.com/courses/first${args}`,
      {
        method: "GET",
      }
    );
    const data = await courseData.json();
    const embed = buildCourseEmbed(data);

    // Display embed
    await interaction.editReply({ embeds: [embed] });
  } else if (interaction.commandName === "testsectionsfirst") {
    await interaction.deferReply();

    let year = interaction.options.getString("year") ?? "";
    let semester = interaction.options.getString("semester") ?? "";
    let crn = interaction.options.getString("coursenum") ?? "";

    // Format arguments into API readable format
    let args = ""; // op between API args     // arg
    if (crn != "") args += (args == "" ? "?" : "&") + `crn=${crn}`;
    if (year != "") args += (args == "" ? "?" : "&") + `year=${year}`;
    if (semester != "")
      args += (args == "" ? "?" : "&") + `semester=${semester}`;

    // Get API data and turn it into an embed
    const sectionData = await fetch(
      `https://api.michigantechcourses.com/sections/first${args}`,
      {
        method: "GET",
      }
    );
    const data = await sectionData.json();
    const embed = buildSectionEmbed(data);

    // Display embed
    await interaction.editReply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
