// tslint:disable: no-console
// tslint:disable-next-line: no-var-requires
require("dotenv").config();

import program from "commander";

import download from "./download";
import project from "./project";
import projects from "./projects";

const { QUANTCONNECT_PROJECT_ID, QUANTCONNECT_TOKEN, QUANTCONNECT_USER_ID } = process.env;

program.version("0.0.1", "-v, --version");

program
  .command("projects")
  .description("Lists all projects from QuantConnect")
  .option("-u, --user <user>", "The QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "The QuantConnect API token", QUANTCONNECT_TOKEN)
  .action(cmd => {
    if (cmd.user && cmd.token) {
      projects(cmd.user, cmd.token);
    } else {
      cmd.outputHelp();
      console.log();
    }
  });

program
  .command("project")
  .description("Lists project details from QuantConnect")
  .option("-u, --user <user>", "The QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "The QuantConnect API token", QUANTCONNECT_TOKEN)
  .option("-p, --project <project>", "The QuantConnect project ID", QUANTCONNECT_PROJECT_ID)
  .action(cmd => {
    if (cmd.user && cmd.token && cmd.project) {
      project(cmd.user, cmd.token, cmd.project);
    } else {
      cmd.outputHelp();
      console.log();
    }
  });

program
  .command("download")
  .description("Downloads all files from QuantConnect to the local filesystem")
  .option("-u, --user <user>", "The QuantConnect user ID", QUANTCONNECT_USER_ID)
  .option("-t, --token <token>", "The QuantConnect API token", QUANTCONNECT_TOKEN)
  .option("-p, --project [project]", "The QuantConnect project ID to download files for", QUANTCONNECT_PROJECT_ID)
  // .option("-w, --watch", "Output SQL of unmapped markets")
  .action(cmd => {
    if (cmd.user && cmd.token) {
      download(cmd.user, cmd.token, cmd.project);
    } else {
      cmd.outputHelp();
      console.log();
    }
  });

program.parse(process.argv.filter(a => a !== "--files"));

export default program;
