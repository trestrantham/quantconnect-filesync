// tslint:disable:no-console
// tslint:disable-next-line:no-var-requires
require("dotenv").config();

import { getProjects } from "./client";
import { IQuantConnectProject } from "./types";
import { asyncForEach } from "./utils";

const run = async (userId: string, token: string) => {
  console.log(`\nProjects for user ID ${userId}:\n`);
  try {
    const projects: IQuantConnectProject[] = await getProjects(userId, token);

    await asyncForEach(projects, async project => {
      console.log(`${project.projectId}: ${project.name}`);
    });

    console.log();
  } catch (e) {
    console.log("ERROR", e);
  }
};

export default run;
