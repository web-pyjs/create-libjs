"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("appName", { type: String, required: true });
    this.argument("appPath", { type: String, required: false });
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome ${chalk.red("Javascript library")} generator!`));
    this.answers = await this.prompt([
      {
        type: "input",
        name: "version",
        message: "Your library version",
        default: "0.0.1"
      },
      {
        type: "input",
        name: "description",
        message: "Your library description",
        default: "Javascript library"
      }
    ]);
  }

  writing() {
    const { version, description } = this.answers;
    const { appName, appPath } = this.options;
    const appPrefix = appPath || appName;

    // Copy all file in template to destination
    this.fs.copyTpl(this.templatePath(), this.destinationPath(appPrefix), {
      name: appName
    });

    // Copy eslintrc config file
    this.fs.copy(
      this.templatePath(".eslintrc.json"),
      this.destinationPath(path.join(appPrefix, ".eslintrc.json"))
    );
    // Copy gitignore file
    this.fs.copy(
      this.templatePath(".gitignore"),
      this.destinationPath(path.join(appPrefix, ".gitignore"))
    );

    // Extends package.json

    const pkgJson = {
      name: appName,
      version,
      description,
      main: `lib/${appName}.cjs.js`,
      module: `lib/${appName}.es.js`,
      unpkg: `umd/${appName}.js`
    };

    this.fs.extendJSON(
      this.destinationPath(path.join(appPrefix, "package.json")),
      pkgJson
    );
  }

  install() {
    // Install all package with yarn
    process.chdir(path.join(this.options.appPath || this.options.appName));
    this.yarnInstall();
  }
};
