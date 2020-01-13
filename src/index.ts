// tslint:disable:no-console

// tslint:disable-next-line:no-var-requires
require("dotenv").config();

import chokidar from "chokidar";
import fs from "fs";
import path from "path";

import { getFiles, getProjects, updateFile } from "client";
import { IQuantConnectProject } from "types";
import { asyncForEach } from "utils";

const fsPromises = fs.promises;
let projects: IQuantConnectProject[] = [];

(async () => {
  try {
    projects = await getProjects();

    await asyncForEach(projects, async project => {
      const files = await getFiles(project.projectId);

      process.stdout.write(`Downloading ${project.name}... `);

      await fsPromises.mkdir(project.name, { recursive: true });

      await asyncForEach(files, async file => {
        await fsPromises.writeFile(`${project.name}/${file.name}`, file.content);
      });

      console.log("✔️");
    });
  } catch (e) {
    console.log("❌", e);
  }

  chokidar.watch("./**/*.cs", { ignored: /(^|[\/\\])\../ }).on("change", async filePath => {
    const contents = await fsPromises.readFile(filePath, { encoding: "utf-8" });
    const project = projects.find(p => filePath.startsWith(p.name));
    const filename = path.basename(filePath);

    try {
      process.stdout.write(`Uploading ${project.name}/${filename}... `);
      await updateFile(project.projectId, filename, contents);
      console.log("✔️");
    } catch (e) {
      console.log("❌", e);
    }
  });
})();
