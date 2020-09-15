const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./users-helper"); //CHANGE321

const router = express.Router();

router.get("/users", protected, (req, res) => {
  Users.find()
    .then((rez) => {
      res.status(200).json(rez);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/register", (req, res) => {
  const userInfo = req.body;

  const isValid = validateUser(userInfo);

  if (isValid) {
    const hash = bcrypt.hashSync(userInfo.password, 4);
    userInfo.password = hash;
    Users.add(userInfo).then((user) => {
      res.status(201).json({ data: user });
    });
  } else {
    res.status(400).json({ message: "Invalid info" });
  }
});

router.post("/login", (req, res) => {
  const creds = req.body;

  const isValid = validateCredentials(creds);

  if (isValid) {
    Users.findBy({ username: creds.username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          const token = makeJwt(user);
          // req.session.username = user.username;
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: "You shall not pass" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({ message: "Invalid info" });
  }
});

router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "You can't leave" });
      } else {
        res.status(204).end();
      }
    });
  } else {
    res.status(204).end();
  }
});

// router.delete("/:id", (req, res) => {
//   res.status(200).json({ msg: "working" });
// });

function validateUser(user) {
  return user.username && user.password ? true : false;
}
function validateCredentials(creds) {
  return creds.username && creds.password ? true : false;
}
function protected(req, res, next) {
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET || "secret";

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Not allowed" });
      } else {
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No token" });
  }
}
function makeJwt(user) {
  const payload = {
    username: user.username,
    department: user.department,
    subject: user.id,
  };
  const config = {
    jwtSecret: process.env.JWT_SECRET || "secret",
  };
  const options = {
    expiresIn: "8 hours",
  };
  return jwt.sign(payload, config.jwtSecret, options);
}

module.exports = router;
