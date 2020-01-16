// tslint:disable:no-console

import chalk from "chalk";
import fs from "fs";

import { getFiles, getProject } from "./client";
import { IQuantConnectProject } from "./types";
import { asyncForEach } from "./utils";

const fsPromises = fs.promises;

const run = async (userId: string, token: string, directory: string, projectId: string) => {
  console.log(chalk.cyan(`Syncing files for project ${projectId} from QuantConnect…\n`));

  try {
    const project: IQuantConnectProject = await getProject(userId, token, projectId);
    const files = await getFiles(userId, token, project.projectId);

    console.log(chalk.bold(`${project.name.split("/").join(chalk.cyan(" / "))}:`));

    await fsPromises.mkdir(`${directory}/${project.name}`, { recursive: true });

    await asyncForEach(files, async file => {
      await fsPromises.writeFile(`${directory}/${file.name}`, file.content);
      console.log(" -", file.name, chalk.green("✔️"));
    });
  } catch (e) {
    console.log(chalk.red("Could not download project files!"));

    if (process.env.DEBUG) {
      console.log(e);
    }
  }
};

export default run;
