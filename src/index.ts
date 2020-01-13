// tslint:disable:no-console

// tslint:disable-next-line:no-var-requires
require("dotenv").config();

import fs from "fs";
const fsPromises = fs.promises;

// import chokidar from "chokidar";
// import crypto from "crypto";

import { getFiles, getProjects } from "client";
import { IQuantConnectProject } from "types";
import { asyncForEach } from "utils";

const { QUANTCONNECT_USER_ID, QUANTCONNECT_TOKEN, QUANTCONNECT_PROJECT_ID } = process.env;

(async () => {
  console.log("STARTED", QUANTCONNECT_USER_ID, QUANTCONNECT_TOKEN, QUANTCONNECT_PROJECT_ID);

  try {
    const projects: IQuantConnectProject[] = await getProjects();

    await asyncForEach(projects, async project => {
      const files = await getFiles(project.projectId);
      console.log(project.name);
      console.log(files);

      await fsPromises.mkdir(project.name, { recursive: true });

      await asyncForEach(files, async file => {
        await fsPromises.writeFile(`${project.name}/${file.name}`, file.content);
      });
    });
  } catch (e) {
    console.log("ERROR", e);
  }

  // chokidar.watch("./**/*.cs").on("change", (event, path) => {
  //   console.log(event, path);

  //   const ts = Math.floor(Number(new Date()) / 1000);
  //   const hash = crypto
  //     .createHash("sha256")
  //     .update(`${QUANTCONNECT_TOKEN}:${ts}`)
  //     .digest("hex");

  //   console.log(ts, hash);
  // });
})();
