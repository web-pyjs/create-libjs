"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdir = require("mkdirp");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    // Get arguments
    this.argument("appName", { type: String, required: true });
    this.argument("appPath", { type: String, required: false });
    // Get options
    this.option("circleci");
    this.option("travis");
    this.option("cmd");
    this.option("yarn");
  }

  default() {
    const appPath = this.destinationPath(
      this.options.appPath || this.options.appName
    );
    mkdir(appPath);
    this.destinationRoot(appPath);
    this.log(`Create new folder for library in ${chalk.green(appPath)}`);
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
    const { appName, travis, circleci, cmd } = this.options;

    // Copy all file in template to destination
    this.fs.copyTpl(this.templatePath(), this.destinationPath(), {
      name: appName,
      cmd
    });

    // Copy eslintrc config file
    this.fs.copy(
      this.templatePath(".eslintrc.json"),
      this.destinationPath(".eslintrc.json")
    );
    // Copy gitignore file
    this.fs.copy(
      this.templatePath(".gitignore"),
      this.destinationPath(".gitignore")
    );

    if (circleci) {
      this.fs.copy(
        this.templatePath(".circleci"),
        this.destinationPath(".circleci")
      );
    } else if (travis) {
      this.fs.copy(
        this.templatePath(".travis"),
        this.destinationPath(".travis")
      );
    }

    // Extends package.json

    const pkgJson = {
      name: appName,
      version,
      description,
      main: `${cmd ? "bin/" : "lib/cjs"}${appName}.js`
    };
    if (!cmd) {
      pkgJson.module = `lib/${appName}.es.js`;
      pkgJson.unpkg = `umd/${appName}.js`;
    }

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  install() {
    this.installDependencies({
      bower: false,
      yarn: this.options.yarn,
      npm: !this.options.yarn
    });
  }
};
