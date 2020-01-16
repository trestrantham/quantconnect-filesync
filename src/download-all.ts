// tslint:disable:no-console

import chalk from "chalk";
import fs from "fs";

import { getFiles, getProjects } from "./client";
import { IQuantConnectProject } from "./types";
import { asyncForEach } from "./utils";

const fsPromises = fs.promises;

const run = async (userId: string, token: string, directory: string) => {
  console.log(chalk.cyan("Syncing all project files from QuantConnect…"));

  try {
    const projects: IQuantConnectProject[] = await getProjects(userId, token);

    if (projects && projects.length) {
      await asyncForEach(projects, async project => {
        const files = await getFiles(userId, token, project.projectId);

        await fsPromises.mkdir(`${directory}/${project.name}`, { recursive: true });

        console.log();
        console.log(chalk.bold(`${project.name.split("/").join(chalk.cyan(" / "))}:`));
        await asyncForEach(files, async file => {
          await fsPromises.writeFile(`${directory}/${project.name}/${file.name}`, file.content);
          console.log(" -", file.name, chalk.green("✔️"));
        });
      });
    } else {
      console.log(chalk.gray("No projects found"));
    }
  } catch (e) {
    console.log(chalk.red("Could not download files for all projects!"));

    if (process.env.DEBUG) {
      console.log(e);
    }
  }
};

export default run;
