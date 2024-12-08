import { Client, GatewayIntentBits } from "discord.js";
import {
  buildSemestersEmbed,
  buildCoursesEmbed,
  buildCourseDataEmbed,
  buildBuildingsEmbed,
  buildSectionsEmbed,
  buildSectionDataEmbed,
  buildInstructorsEmbed,
  build404Embed,
  buildNotSpecificEnoughEmbed
} from "./util/embed-builder.js";
import {
  getCourses,
  getCourseData,
  getSections,
  getSectionData,
  findInstructor,
} from "./mongo/helper-commands.js";
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
  } else if (interaction.commandName === "semesters") {
    // this is where the bot accesses all the get API calls from mtu courses
    const semesters = await fetch(
      "https://api.michigantechcourses.com/semesters",
      {
        method: "GET",
      }
    );
    const embed = buildSemestersEmbed(await semesters.json());

    await interaction.reply({ embeds: [embed] });
  } else if (interaction.commandName === "buildings") {
    const buildings = await fetch(
      "https://api.michigantechcourses.com/buildings",
      {
        method: "GET",
      }
    );
    const embed = buildBuildingsEmbed(await buildings.json());

    await interaction.reply({ embeds: [embed] });
  // } else if (interaction.commandName === "getsection") {
  //   await interaction.deferReply();

  //   // Get arguments
  //   let year = interaction.options.getString("year") ?? "";
  //   let crn = interaction.options.getString("crn") ?? "";
  //   let semester = interaction.options.getString("semester") ?? "";

  //   // Format arguments into API readable format
  //   let args = ""; // op between API args     // arg
  //   if (year != "") args += (args == "" ? "?" : "&") + `year=${year}`;
  //   if (crn != "") args += (args == "" ? "?" : "&") + `crn=${crn}`;
  //   if (semester != "")
  //     args += (args == "" ? "?" : "&") + `semester=${semester}`;

  //   // Get API data and turn it into an embed
  //   const sectionData = await fetch(
  //     `https://api.michigantechcourses.com/sections/first${args}`,
  //     {
  //       method: "GET",
  //     }
  //   );

  //   const data = await sectionData.json();
  //   const embed = buildSectionEmbed(data);

  //   // Display embed
  //   await interaction.editReply({ embeds: [embed] });
  } else if (interaction.commandName == "course") {
    await interaction.deferReply();

    // Get args
    let subject = interaction.options.getString("subject") ?? "";
    let year = interaction.options.getString("year") ?? "";
    let semester = interaction.options.getString("semester").toUpperCase() ?? "";
    let name = interaction.options.getString("name") ?? "";
    let num = interaction.options.getString("number") ?? "";

    // Get all matching courses
    let courseNames = await getCourses(year, semester, subject, name, num);
    let embed = null;
    if (courseNames.length == 0) {
      embed = build404Embed();
    } else if (courseNames.length == 1) {
      // only one course matched, display more detailed information instead
      let courseData = await getCourseData(year, semester, subject, name, num);

      try {
        embed = buildCourseDataEmbed(courseData);
      } catch (error) {
        console.log(JSON.stringify(courseData));
        console.error(JSON.stringify(error));
        embed = build404Embed();
      }
    } else {
      embed = buildCoursesEmbed(courseNames);
    }

    interaction.editReply({ embeds: [embed] });
  } else if (interaction.commandName == "section") {
    await interaction.deferReply();

    // Get args
    let subject = interaction.options.getString("subject") ?? "";
    let year = interaction.options.getString("year") ?? "";
    let semester = interaction.options.getString("semester").toUpperCase() ?? "";
    let num = interaction.options.getString("coursenumber") ?? "";
    let crn = interaction.options.getString("crn") ?? "";

    let embed = null;
    try {
        // Get all matching courses, and ensure that there is only one match
        let courseNames = await getCourses(year, semester, subject, "", num);
        if (courseNames.length > 1) {
          embed = buildNotSpecificEnoughEmbed("courses");
        } else if (courseNames.length == 1) {
          // get all the sections
          let sections = await getSections(year, semester, subject, num);
          if (sections.length != 0 && crn != "") { // specific CRN given to lookup
            for (let i = 0; i < sections.length; i++) {
              if (sections[i].crn == crn) {
                embed = buildSectionDataEmbed(sections[i], subject, num);
                break;
              }
            }
          } else if (sections.length == 1) { // display detailed section info
            embed = buildSectionDataEmbed(sections[0], subject, num);
          } else if (sections.length > 1) { // display section summary list
            embed = buildSectionsEmbed(sections, subject, num);
          }
        }
    } catch(error) {
      console.log(error);
      embed = build404Embed();
    }

    if (embed == null) { // If an embed was un-generateable for one of many reasons:
      // courseNames.length == 0 |OR| crn not in the sections for given course |OR| sections.length == 0 |OR| issue i am unaware of
      embed = build404Embed();
    }
    interaction.editReply({ embeds: [embed] });
  } else if (interaction.commandName == "findinstructor") {
    await interaction.deferReply();

    // Get args
    let name = interaction.options.getString("name") ?? "";

    //await findInstructor(name);
    let data = await findInstructor(name);

    let embed;
    if (!data) {
      embed = build404Embed();
    } else {
      embed = buildInstructorsEmbed(data);
    }

    interaction.editReply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
