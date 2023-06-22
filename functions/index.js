const serverlessHTTP = require("serverless-http");
const server = require("../server");
const express = require("express");

const app = express();

app.use("/.netlify/functions/index", server);

exports.handler = serverlessHTTP(app);