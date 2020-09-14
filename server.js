const express = require("express");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const usersRotuer = require("./router/users-router"); //CHANGE321
const dbConnection = require("./data/db-config");

const server = express();

const sessionConfig = {
  name: "goodName",
  secret: process.env.SESSION_SECRET || "it's a secret",
  resave: false,
  saveUnintialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: process.env.USE_SECURE_COOKIES || false,
    httpOnly: true,
  },
  store: new knexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(express.json());
// server.use(helmet());
server.use(session(sessionConfig));
server.use("/api/users", usersRotuer); //CHANGE321

server.get("/", (req, res) => {
  res.status(200).json({ Victor_Frankenstein: "It LIVEEEESSSSSSS" });
});

module.exports = server;
