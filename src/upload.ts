// tslint:disable:no-console
import chalk from "chalk";
import fs from "fs";
import path from "path";

import { getProject, updateFile } from "./client";
import { IQuantConnectProject } from "./types";
import { asyncForEach } from "./utils";

const fsPromises = fs.promises;

const findInDir = (dir, filter, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      findInDir(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  });

  return fileList;
};

const run = async (userId: string, token: string, projectId: string) => {
  console.log(chalk.cyan(`Uploading files for project ${projectId} to QuantConnect…\n`));

  try {
    const project: IQuantConnectProject = await getProject(userId, token, projectId);

    if (project) {
      const files = findInDir(".", /^[^.].*$/);

      console.log(chalk.bold(`${project.name.split("/").join(chalk.cyan(" / "))}:`));

      asyncForEach(files, async filePath => {
        const contents = await fsPromises.readFile(filePath, { encoding: "utf-8" });
        process.stdout.write(` - ${filePath.split("/").join(chalk.cyan(" / "))} `);
        try {
          await updateFile(userId, token, project.projectId, filePath, contents);
          console.log(chalk.green("✔️"));
        } catch (e) {
          console.log(chalk.red("✗"));
          if (process.env.DEBUG) {
            console.log(e);
          }
        }
      });
    } else {
      console.log(chalk.yellow("No project found"));
    }
  } catch (e) {
    console.log(chalk.red("There was a problem uploading project files to QuantConnect"));

    if (process.env.DEBUG) {
      console.log(e);
    }
  }
};

export default run;
