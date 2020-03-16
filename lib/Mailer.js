/* eslint-env node */

const nodemailer = require("nodemailer");

class Mailer {

  static send(options) {
    return new Promise(function(resolve, reject) {
      let transport = Mailer.createTransport(options);
      transport.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.text,
      }, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }

  static createTransport(options) {
    return nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure,
      auth: {
        user: options.user,
        pass: options.password,
      },
      tls: {rejectUnauthorized: false},
    });
  }
}

module.exports = Mailer;