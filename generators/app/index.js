"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome ${chalk.red("Javascript library")} generator!`));
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your library name",
        default: this.appname
      },
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
    // Copy all file in template to destination
    this.fs.copyTpl(this.templatePath(), this.destinationPath(), {
      name: this.answers.name
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

    // Extends package.json

    const { name, version, description } = this.answers;

    const pkgJson = {
      name,
      version,
      description,
      main: `lib/${name}.cjs.js`,
      module: `lib/${name}.es.js`,
      unpkg: `umd/${name}.js`
    };

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  install() {
    // Install all package with yarn
    this.yarnInstall();
  }
};
