// tslint:disable:no-console
import chalk from "chalk";
import chokidar from "chokidar";
// import fs from "fs";
// import path from "path";

// import { getProject, updateFile } from "../client";
import { getProject } from "../client";
import { IQuantConnectProject } from "../types";

// const fsPromises = fs.promises;

const run = async (userId: string, token: string, projectId: string) => {
  try {
    const project: IQuantConnectProject = await getProject(userId, token, projectId);

    if (project) {
      chokidar
        .watch(".", { ignored: /(^|[\/\\])\../, ignoreInitial: true })
        // .on("change", async filePath => {
        //   const contents = await fsPromises.readFile(filePath, { encoding: "utf-8" });
        //   const filename = path.basename(filePath);

        //   try {
        //     process.stdout.write(
        //       `${chalk.yellow("CHANGE")} ${[...project.name.split("/"), filename].join(chalk.cyan(" / "))} `,
        //     );
        //     await updateFile(userId, token, project.projectId, filename, contents);
        //     console.log(chalk.green("✔️"));
        //   } catch (e) {
        //     console.log(chalk.red("✗"));

        //     if (process.env.DEBUG) {
        //       console.log(e);
        //     }
        //   }
        // })
        .on("ready", () => console.log(chalk.cyan(`Watching for local changes to project ${projectId}…\n`)))
        .on("all", (event, path) => {
          switch (event) {
            case "addDir":
              if (path !== ".") {
                console.log(
                  `${chalk.green("ADD")} ${[...project.name.split("/"), ...path.split("/")].join(chalk.cyan(" / "))}`,
                );
              }
              break;
            case "add":
              console.log(
                `${chalk.green("ADD")} ${[...project.name.split("/"), ...path.split("/")].join(chalk.cyan(" / "))} `,
              );
              break;
            case "change":
              console.log(
                `${chalk.yellow("CHANGE")} ${[...project.name.split("/"), ...path.split("/")].join(
                  chalk.cyan(" / "),
                )} `,
              );
              break;
            case "unlink":
              console.log(
                `${chalk.red("DELETE")} ${[...project.name.split("/"), ...path.split("/")].join(chalk.cyan(" / "))} `,
              );
              break;
            case "unlinkDir":
              console.log(
                `${chalk.red("DELETE")} ${[...project.name.split("/"), ...path.split("/")].join(chalk.cyan(" / "))} `,
              );
              break;
          }
          console.log(event, path);
        });
    } else {
      console.log(chalk.yellow("No project found"));
    }
  } catch (e) {
    console.log(chalk.red("Could not fetch projects!"));

    if (process.env.DEBUG) {
      console.log(e);
    }
  }
};

export default run;
