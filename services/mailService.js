const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_SERVICE_USER,
    pass: process.env.MAIL_SERVICE_PASSWORD,
  },
  from: "notes-share@gmail.com",
});

transport.verify((err, succ) => {
  if (err) {
    console.log(err);
  } else if (succ) {
    console.log("Mail Service Connected");
  }
});

module.exports = transport;
