// tslint:disable:no-console
import chalk from "chalk";
import chokidar from "chokidar";
import fs from "fs";

import { addFile, deleteFile, getProject, updateFile } from "./client";
import { IQuantConnectProject } from "./types";

const fsPromises = fs.promises;

const run = async (userId: string, token: string, projectId: string) => {
  try {
    const project: IQuantConnectProject = await getProject(userId, token, projectId);

    if (project) {
      chokidar
        .watch(".", { ignored: /(^|[\/\\])\../, ignoreInitial: true })
        .on("ready", () => console.log(chalk.cyan(`Watching for local changes to project ${projectId}…\n`)))
        .on("all", async (event, filePath) => {
          let contents;

          switch (event) {
            // case "addDir":
            //   if (filePath !== ".") {
            //     console.log(
            //       `${chalk.green("ADD")} ${[...project.name.split("/"), ...filePath.split("/")].join(
            //         chalk.cyan(" / "),
            //       )}`,
            //     );
            //   }
            //   break;
            case "add":
              contents = await fsPromises.readFile(filePath, { encoding: "utf-8" });

              process.stdout.write(
                `${chalk.green("ADD")} ${[...project.name.split("/"), ...filePath.split("/")].join(
                  chalk.cyan(" / "),
                )} `,
              );

              try {
                await addFile(userId, token, project.projectId, filePath, contents);
                console.log(chalk.green("✔️"));
              } catch (e) {
                console.log(chalk.red("✗"));

                if (process.env.DEBUG) {
                  console.log(e);
                }
              }
              break;
            case "change":
              contents = await fsPromises.readFile(filePath, { encoding: "utf-8" });

              process.stdout.write(
                `${chalk.yellow("CHANGE")} ${[...project.name.split("/"), ...filePath.split("/")].join(
                  chalk.cyan(" / "),
                )} `,
              );

              try {
                await updateFile(userId, token, project.projectId, filePath, contents);
                console.log(chalk.green("✔️"));
              } catch (e) {
                console.log(chalk.red("✗"));

                if (process.env.DEBUG) {
                  console.log(e);
                }
              }
              break;
            case "unlink":
              process.stdout.write(
                `${chalk.red("DELETE")} ${[...project.name.split("/"), ...filePath.split("/")].join(
                  chalk.cyan(" / "),
                )} `,
              );

              try {
                await deleteFile(userId, token, project.projectId, filePath);
                console.log(chalk.green("✔️"));
              } catch (e) {
                console.log(chalk.red("✗"));

                if (process.env.DEBUG) {
                  console.log(e);
                }
              }
              break;
            // case "unlinkDir":
            //   console.log(
            //     `${chalk.red("DELETE")} ${[...project.name.split("/"), ...filePath.split("/")].join(
            //       chalk.cyan(" / "),
            //     )} `,
            //   );
            //   break;
          }
          console.log(event, filePath);
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
