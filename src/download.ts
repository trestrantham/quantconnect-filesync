// tslint:disable:no-console

// tslint:disable-next-line:no-var-requires
require("dotenv").config();

import fs from "fs";

import { getFiles, getProject, getProjects } from "./client";
import { IQuantConnectProject } from "./types";
import { asyncForEach } from "./utils";

const fsPromises = fs.promises;

const run = async (userId: string, token: string, projectId: string) => {
  try {
    let projects: IQuantConnectProject[] = [];

    if (projectId && projectId.length) {
      const project = await getProject(userId, token, projectId);
      projects = [project];
    } else {
      projects = await getProjects(userId, token);
    }

    await asyncForEach(projects, async project => {
      const files = await getFiles(userId, token, project.projectId);

      console.log(`\n${project.name}:`);

      await fsPromises.mkdir(project.name, { recursive: true });

      await asyncForEach(files, async file => {
        if (projectId && projectId.length) {
          await fsPromises.writeFile(file.name, file.content);
        } else {
          await fsPromises.writeFile(`${project.name}/${file.name}`, file.content);
        }
        console.log(` - ${file.name}️️ ✔️`);
      });
    });

    console.log();
  } catch (e) {
    console.log("ERROR", e);
  }
};

export default run;
