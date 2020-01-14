// tslint:disable:no-console

// tslint:disable-next-line:no-var-requires
require("dotenv").config();

import { getProject } from "./client";
import { IQuantConnectProject } from "./types";

const run = async (userId: string, token: string, projectId: string) => {
  try {
    const project: IQuantConnectProject = await getProject(userId, token, projectId);

    console.log();
    console.log("Name:", project.name);
    console.log("Project ID:", project.projectId);
    console.log("Created:", project.created);
    console.log("Last modified:", project.modified);
    console.log("Owner ID:", project.ownerId);
    console.log();
  } catch (e) {
    console.log("ERROR", e);
  }
};

export default run;
