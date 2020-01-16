#!/usr/bin/env node

// tslint:disable: no-console
// tslint:disable: no-var-requires
require("dotenv").config();

import chalk from "chalk";
// import clear from "clear";
import program from "commander";

import downloadProject from "./download/project";
import downloadProjects from "./download/projects";
import listProject from "./list/project";
import listProjects from "./list/projects";
import watchProject from "./watch/project";
// import watchProjects from "./watch/projects";

const { QUANTCONNECT_PROJECT_ID, QUANTCONNECT_TOKEN, QUANTCONNECT_USER_ID } = process.env;
const CONFIG = require("../package.json");

// clear();
console.log(chalk.green("QuantConnect FileSync"), `v${CONFIG.version}`);
console.log();

program.version(CONFIG.version, "-v, --version");

program
  .command("projects")
  .description("List all projects from QuantConnect")
  .option("-u, --user <user>", "The QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "The QuantConnect API token", QUANTCONNECT_TOKEN)
  .option("-p, --project <project>", "The QuantConnect project ID", QUANTCONNECT_PROJECT_ID)
  .action(async cmd => {
    if (cmd.user && cmd.token) {
      if (cmd.project && cmd.project.length) {
        await listProject(cmd.user, cmd.token, cmd.project);
      } else {
        await listProjects(cmd.user, cmd.token);
      }
    } else {
      cmd.outputHelp();
    }

    console.log();
  });

program
  .command("download")
  .description("Downloads all files from QuantConnect to the local filesystem")
  .option("-u, --user <user>", "The QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "The QuantConnect API token", QUANTCONNECT_TOKEN)
  .option("-p, --project [project]", "The QuantConnect project ID to download files for", QUANTCONNECT_PROJECT_ID)
  .option("-d, --directory [directory]", "The directory to download files to (defaults to current directory)", ".")
  .action(async cmd => {
    if (cmd.user && cmd.token) {
      if (cmd.project && cmd.project.length) {
        await downloadProject(cmd.user, cmd.token, cmd.directory, cmd.project);
      } else {
        await downloadProjects(cmd.user, cmd.token, cmd.directory);
      }
    } else {
      cmd.outputHelp();
    }

    console.log();
  });

program
  .command("watch")
  .description("Watch for local file updates and sync changes to QuantConnect")
  .option("-u, --user <user>", "The QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "The QuantConnect API token", QUANTCONNECT_TOKEN)
  .option("-p, --project [project]", "The QuantConnect project ID to upload files to", QUANTCONNECT_PROJECT_ID)
  .action(async cmd => {
    if (cmd.user && cmd.token) {
      if (cmd.project && cmd.project.length) {
        await downloadProject(cmd.user, cmd.token, ".", cmd.project);
        console.log();
        await watchProject(cmd.user, cmd.token, cmd.project);
      } else {
        // await watchProjects(cmd.user, cmd.token);
        console.log("watch projects");
      }
    } else {
      cmd.outputHelp();
    }
  });

program.parse(process.argv.filter(a => a !== "--files"));

export default program;
