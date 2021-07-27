const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const knex = require("knex")(
  require("../knexfile.js")[process.env.NODE_ENV || "development"]
);
const cookieParser = require("cookie-parser");

express().use(cookieParser());

async function encrypt(password, expense) {
  const result = await bcrypt.hash(password, expense);
  return result;
}

async function compareEncrypt(password, hashPassword) {
  const result = await bcrypt.compare(password, hashPassword);
  return result;
}

router.get("/", async (req, res) => {
  await knex("users")
    .select("*")
    .then((data) => {
    res.status(200).json(data).end()
    })
})

router.post("/post", async (req, res) => {
  let password = await encrypt(`${req.body.password}`, 12);
  await knex("users")
    .insert({
      rank: req.body.rank,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: password,
    })
    .returning("id")
    .then((data) =>
      res.status(200).json({ message: `Success`, data: data }).end()
    )
    .catch(() =>
      res
        .status(404)
        .json({
          message: `Provided email has already been registered and exists in our database. Please try registering again with a different email or login with the existing email.`,
        })
        .end()
    );
});

router.delete("/delete", async (req, res) => {
  await knex("users")
    .del()
    .where({
      id: req.body.userId,
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }))
    .then(res.status(200).json({message: `Success`}).end())
});

router.post("/login", async (req, res) => {
  await knex("users")
    .select("*")
    .where({
      email: req.body.email,
    })
    .then(async (rows) => {
      let match = await compareEncrypt(
        `${req.body.password}`,
        rows[0].password
      );

      if (!match) {
        res
          .status(401)
          .json({
            message:
              "The provided email or password does not match our records. Please try again or register as a new user.",
          })
          .end();
      } else {
        let token = await encrypt(`${req.body.email}`, 12);
        await knex("users")
          .update({ token: token })
          .where({ email: req.body.email });
        res
          .cookie("token", token, { maxAge: 90000000 })
          .json({
            userId: rows[0].id,
            rank: rows[0].rank,
            fname: rows[0].fname,
            lname: rows[0].lname,
            password: `${req.body.password}`,
            email: rows[0].email,
            role: rows[0].role
          })
          .status(200)
          .end();
      }
    })
    .catch((err) =>
      res.status(404).json({
        message:
          "The provided email or password does not match our records. Please try again or register as a new user.",
        error: err,
      })
    );
});

router.post("/persist", async (req, res) => {
  let token = req.cookies.token;
  await knex("users")
    .select("*")
    .where({
      token: `${token}`,
    })
    .then(async (rows) => {
      res
        .json({
          userId: rows[0].id,
          username: rows[0].name,
          password: "For security reasons please login again to see your password.",
          email: rows[0].email,
        })
        .status(200)
        .end();
    })
    .catch((err) => res.status(404).json({ message: `Encountered ${err}` }));
});

module.exports = router;