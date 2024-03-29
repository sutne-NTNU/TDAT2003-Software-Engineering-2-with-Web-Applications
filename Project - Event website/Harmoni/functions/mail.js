const nodemailer = require("nodemailer");
const isCI = require("is-ci");
const properties = isCI ? "" : require("./properties.js");
const defMail = require("./defaultMail.js");
const express = require("express");
const moment = require("moment");

const mailProps = isCI ? "" : new properties.MailProperties();
const defaultMail = new defMail.DefaultMail();
const deployed = true;

const username = isCI ? "" : mailProps.username;
const password = isCI ? "" : mailProps.password;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: username,
    pass: password,
  },
});

let sendMail = (mail) => {
  transporter.sendMail(mail).then((error, info) => {
    if (error) {
      console.error(error);
      return false;
    } else {
      return true;
    }
  });
};

addMailEndpoints = (app, db) => {
  /**
   * Mail midpoint sets relevant attributes for building the mails
   * body:
   * {
   *     username: string
   *     text: string
   *     email: string
   *     subject: string
   * }
   */
  app.use("/mail", (req, res, next) => {
    if (deployed) {
      defaultMail.user = req.body.username;
      defaultMail.date = moment().format("YYYY-MM-DD");
      defaultMail.text = req.body.text;
      defaultMail.subject = req.body.subject;
      defaultMail.email = req.body.email;
      req.body.mailToDev = {
        from: req.body.email,
        to: username,
        subject: defaultMail.subject,
        text: defaultMail.text,
      };
      req.body.mailToUser = {
        from: username,
        to: req.body.email,
        subject: defaultMail.subject,
        text: defaultMail.text,
      };
      next();
    } else {
      res.sendStatus(503);
    }
  });

  /**
   * Endpoint for sending a bug report
   */
  app.post("/mail/bug", (req, res) => {
    req.body.mailToDev.subject = `Feilrapport: ${defaultMail.subject}`;
    req.body.mailToDev.text = `Feilrapport fra ${defaultMail.user}, mailadresse: ${defaultMail.email}\n\n${defaultMail.text}`;

    req.body.mailToUser.subject = `RE: Feilrapport: ${req.body.mailToUser.subject}`;
    req.body.mailToUser.text = defaultMail.bugText;

    return Promise.allSettled([
      sendMail(req.body.mailToDev),
      sendMail(req.body.mailToUser),
      db.createBug(req.body),
    ]).then(() => res.sendStatus(200));
  });

  app.post("/mail/password", (req, res) => {
    req.body.mailToUser.subject = `Glemt passord: ${req.body.email}`;

    return db
      .forgotPassword(req.body.email)
      .then((response) => {
        if (response) {
          defaultMail.password = response;
          req.body.mailToUser.text = defaultMail.passwordText;
          sendMail(req.body.mailToUser);
          res.sendStatus(201);
        } else {
          throw new Error("No new password received from dao");
        }
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(500);
      });
  });

  app.post("/mail/contact", (req, res) => {
    req.body.mailToDev.subject = `Kontakt: ${req.body.mailToDev.subject}`;
    req.body.mailToDev.text = `Kontakt fra ${defaultMail.user}, mailadresse: ${defaultMail.email}\n\n${defaultMail.text}`;

    req.body.mailToUser.subject = `RE: Kontakt: ${req.body.mailToUser.subject}`;
    req.body.mailToUser.text = defaultMail.contactText;

    return Promise.allSettled([
      sendMail(req.body.mailToDev),
      sendMail(req.body.mailToUser),
    ]).then((results) => {
      results.forEach((res) => res.sendStatus(200));
    });
  });

  /**
   * body:
   * {
   *     //mail body
   *     to: string[]
   * }
   */
  app.post("/mail/info", (req, res) => {
    let to = req.body.to;

    new Promise((resolve, reject) => {
      let dm = new defMail.DefaultMail();
      dm.email = req.body.email;
      let mail = {
        from: username,
        replyTo: dm.email,
        to: to,
        subject: "FW: " + defaultMail.subject,
        text: defaultMail.infoText,
        bcc: [dm.email],
      };
      return sendMail(mail);
    })
      .then(res.sendStatus(202))
      .catch((error) => {
        console.error(error);
        res.sendStatus(503);
      });
  });
};

module.exports = { addMailEndpoints, sendMail };
