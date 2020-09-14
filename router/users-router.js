const express = require("express");
const bcrypt = require("bcryptjs");

const Users = require("./users-helper"); //CHANGE321

const router = express.Router();

router.get("/", protected, (req, res) => {
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
          req.session.username = user.username;
          res.status(200).json({ message: "Logged in" });
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
  if (req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "You cannot pass" });
  }
}

module.exports = router;
