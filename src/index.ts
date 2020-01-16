#!/usr/bin/env node

// tslint:disable: no-console
// tslint:disable: no-var-requires
require("dotenv").config();

import chalk from "chalk";
// import clear from "clear";
import program from "commander";

import downloadAll from "./download-all";
import downloadProject from "./download-project";
import project from "./project";
import projects from "./projects";

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
        await project(cmd.user, cmd.token, cmd.project);
      } else {
        await projects(cmd.user, cmd.token);
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
        await downloadAll(cmd.user, cmd.token, cmd.directory);
      }
    } else {
      cmd.outputHelp();
    }

    console.log();
  });

program.parse(process.argv.filter(a => a !== "--files"));

export default program;
