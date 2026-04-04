#!/usr/bin/env node

const { Command } = require("commander");
const { Chalk } = require("chalk");

const program = new Command();
const chalk = new Chalk();
program
  .command("start")
  .option("--port <number>", "port number")
  .option(
    "--origin <url>",
    "url of the server for which response needs to be cached",
  )
  .action((options) => {
    const port = options.port ;
    const url = options.origin;
    console.log(chalk.blue(`port : ${port} url : ${url}`));
  });

program.parse(process.argv);