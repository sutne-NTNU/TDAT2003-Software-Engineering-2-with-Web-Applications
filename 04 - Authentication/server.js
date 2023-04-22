const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const nettside = express();
nettside.use(bodyParser.json());

let privateKey = (publicKey = "shhhhhverysecret");

function loginOk(username, password) {
  return username === "sivert" && password === "utne";
}

// Server klientapplikasjonen (i public-mappa) på rot-url'en http://localhost:8080
nettside.use(express.static("public"));

// Håndterer login og sender JWT-token tilbake som JSON
nettside.post("/login", (req, res) => {
  if (loginOk(req.body.brukernavn, req.body.passord)) {
    console.log("Brukernavn & passord ok");
    let token = jwt.sign({ brukernavn: req.body.brukernavn }, privateKey, {
      expiresIn: 60,
    });
    res.json({ jwt: token });
  } else {
    console.log("Brukernavn & passord IKKE ok");
    res.status(401);
    res.json({ error: "Not authorized" });
  }
});

nettside.get("/token", (req, res) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, publicKey, (err, decoded) => {
    if (err) {
      res.status(401);
      res.json({ error: "Not authorized" });
    } else {
      let token = jwt.sign({ brukernavn: req.body.brukernavn }, privateKey, {
        expiresIn: 60,
      });
      res.json({ jwt: token });
    }
  });
});

// Plasserer denne MÌDDLEWARE-funksjonen
// foran alle endepunktene under samme path

nettside.use("/api", (req, res, next) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, publicKey, (err, decoded) => {
    if (err) {
      console.log("Token IKKE ok");
      res.status(401);
      res.json({ error: "Not authorized" });
    } else {
      console.log("Token ok: " + decoded.brukernavn);
      next();
    }
  });
});

nettside.get("/api/person", (req, res) => {
  res.json([{ name: "Hei Sveisen" }, { name: "Sivert utne" }]);
});

nettside.get("/api/person/:personId", (req, res) => {
  res.json({ name: "Sivert Utne er nå logget inn" });
});

nettside.post("/api/person", (req, res) => {
  res.send("");
});

const server = nettside.listen(8080);
