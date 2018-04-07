const childProcess = require("child_process");
const electron = require("electron");
const webpack = require("webpack");
const config = require("./webpack.app.config");
const jetpack = require('fs-jetpack');
const fsextra = require('fs-extra');

const projectDir = jetpack;
const srcDir = jetpack.cwd('./src');
const destDir = jetpack.cwd('./app');

fsextra.removeSync(destDir.path('services'));
projectDir.copy(srcDir.path('services'), destDir.path('services'));

const env = "development";
const compiler = webpack(config(env));
let electronStarted = false;

const watching = compiler.watch({}, (err, stats) => {
  if (!err && !stats.hasErrors() && !electronStarted) {
    electronStarted = true;

    childProcess
      .spawn(electron, ["."], { stdio: "inherit" })
      .on("close", () => {
        watching.close();
      });
  }
});
