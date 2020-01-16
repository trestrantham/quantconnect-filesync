// tslint:disable:no-console

import chalk from "chalk";

import { getProjects } from "./client";
import { IQuantConnectProject } from "./types";
import { asyncForEach } from "./utils";

const run = async (userId: string, token: string) => {
  console.log(chalk.cyan("Fetching all projects from QuantConnect…\n"));

  try {
    const projects: IQuantConnectProject[] = await getProjects(userId, token);

    if (projects && projects.length) {
      await asyncForEach(
        projects.sort((a, b) => (a.name < b.name ? -1 : 1)),
        async project => {
          console.log(`${chalk.magenta(project.projectId)}:`, project.name.split("/").join(chalk.cyan(" / ")));
        },
      );
    } else {
      console.log(chalk.gray("No projects found"));
    }
  } catch (e) {
    console.log(chalk.red("Could not fetch projects!"));

    if (process.env.DEBUG) {
      console.log(e);
    }
  }
};

export default run;
