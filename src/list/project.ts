// tslint:disable:no-console
import chalk from "chalk";

import { getProject } from "../client";
import { IQuantConnectProject } from "../types";

const run = async (userId: string, token: string, projectId: string) => {
  console.log(chalk.cyan(`Listing project ${projectId} from QuantConnect…\n`));

  try {
    const project: IQuantConnectProject = await getProject(userId, token, projectId);

    if (project) {
      console.log(`${chalk.magenta("Name")}:`, project.name.split("/").join(chalk.cyan(" / ")));
      console.log(`${chalk.magenta("Description")}:`, project.description);
      console.log(`${chalk.magenta("Project ID")}:`, project.projectId);
      console.log(`${chalk.magenta("Created")}:`, project.created);
      console.log(`${chalk.magenta("Last modified")}:`, project.modified);
      console.log(`${chalk.magenta("Owner ID")}:`, project.ownerId);
      console.log(`${chalk.magenta("Language")}:`, project.language);
    } else {
      console.log(chalk.gray("No project found"));
    }
  } catch (e) {
    console.log(chalk.red("Could not fetch projects!"));

    if (process.env.DEBUG) {
      console.log(e);
    }
  }
};

export default run;
