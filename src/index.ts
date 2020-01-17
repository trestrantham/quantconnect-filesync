#!/usr/bin/env node

// tslint:disable: no-console
// tslint:disable: no-var-requires
require("dotenv").config();

import chalk from "chalk";
import program from "commander";

import download from "./download";
import listProject from "./list/project";
import listProjects from "./list/projects";
import upload from "./upload";
import watch from "./watch";

const { QUANTCONNECT_PROJECT_ID, QUANTCONNECT_TOKEN, QUANTCONNECT_USER_ID } = process.env;
const CONFIG = require("../package.json");

console.log(chalk.green("QuantConnect FileSync"), `v${CONFIG.version}`);
console.log();

program.name("quantconnect-filesync").version(CONFIG.version, "-v, --version");

program
  .command("projects")
  .description("List projects from QuantConnect")
  .option("-u, --user <user>", "QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "QuantConnect API token", QUANTCONNECT_TOKEN)
  .option("-p, --project [project]", "QuantConnect project ID")
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
  });

program
  .command("download")
  .description("Downloads all files from QuantConnect to the current directory")
  .option("-u, --user <user>", "QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "QuantConnect API token", QUANTCONNECT_TOKEN)
  .option("-p, --project <project>", "QuantConnect project ID to download files for", QUANTCONNECT_PROJECT_ID)
  .action(async cmd => {
    if (cmd.user && cmd.token && cmd.project && cmd.project.length) {
      await download(cmd.user, cmd.token, cmd.project);
    } else {
      cmd.outputHelp();
    }
  });

program
  .command("upload")
  .description("Uploads all files from current directory to QuantConnect")
  .option("-u, --user <user>", "QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "QuantConnect API token", QUANTCONNECT_TOKEN)
  .option("-p, --project <project>", "QuantConnect project ID to upload files for", QUANTCONNECT_PROJECT_ID)
  .action(async cmd => {
    if (cmd.user && cmd.token && cmd.project && cmd.project.length) {
      await upload(cmd.user, cmd.token, cmd.project);
    } else {
      cmd.outputHelp();
    }
  });

program
  .command("watch")
  .description("Watch for file updates in the current directory and sync changes to QuantConnect")
  .option("-u, --user <user>", "QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "QuantConnect API token", QUANTCONNECT_TOKEN)
  .option("-p, --project <project>", "QuantConnect project ID to sync files for", QUANTCONNECT_PROJECT_ID)
  .action(async cmd => {
    if (cmd.user && cmd.token && cmd.project && cmd.project.length) {
      await download(cmd.user, cmd.token, cmd.project);
      console.log();
      await watch(cmd.user, cmd.token, cmd.project);
    } else {
      cmd.outputHelp();
    }
  });

program.parse(process.argv.filter(a => a !== "--files"));

const args = process.argv.slice(2);
if (!args.length || args[0] === "--files") {
  program.outputHelp();
}

export default program;
