#!/usr/bin/env node

const { Command } = require("commander");
const { Chalk } = require("chalk");
const express = require("express");
const axios = require("axios");
const cacheMiddleware = require("./middlewares/cache");
const program = new Command();
const chalk = new Chalk();
const app = express();
program
  .command("start")
  .option("--port <number>", "port number")
  .option(
    "--origin <url>",
    "url of the server for which response needs to be cached",
  )
  .action((options) => {
    const port = options.port;
    const url = options.origin;
    app.use(cacheMiddleware);
    app.use(async (req, res, next) => {
      try {
        const { path, body, method, query } = req;
        axios.defaults.baseURL = url;
        const response = await axios({
          method: method,
          url: path,
          params: query,
          data: body,
        });
        // res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
        // res.header("X-Cache", "MISS");
        res.json(response.data);
      } catch (e) {
        res.status(500).send({ message: e.message });
      }
    });
    app.listen(port, async () => {
      console.log(chalk.blue(`Server is running on localhost:${port}`));
    });
  });

program.parse(process.argv);
