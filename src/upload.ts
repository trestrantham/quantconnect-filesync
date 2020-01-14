// tslint:disable:no-console

// tslint:disable-next-line:no-var-requires
require("dotenv").config();

// import chokidar from "chokidar";
// import fs from "fs";
// import path from "path";

// import { updateFile } from "client";

// const fsPromises = fs.promises;

const run = async () => {
  // chokidar.watch("./**/*.cs", { ignored: /(^|[\/\\])\../ }).on("change", async filePath => {
  //   const contents = await fsPromises.readFile(filePath, { encoding: "utf-8" });
  //   const project = projects.find(p => filePath.startsWith(p.name));
  //   const filename = path.basename(filePath);
  //   try {
  //     process.stdout.write(`Uploading ${project.name}/${filename}... `);
  //     await updateFile(project.projectId, filename, contents);
  //     console.log("✔️");
  //   } catch (e) {
  //     console.log("❌", e);
  //   }
  // });
};

export default run;
