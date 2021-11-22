/* eslint-env node */

const path = require("path"),
  Config = require("./lib/Config.js"),
  HTTPSClient = require("./lib/HTTPSClient.js"),
  InfoPage = require("./lib/InfoPage.js"),
  Mailer = require("./lib/Mailer.js"),
  appConfig = Config.from(path.join(__dirname, "config.json"));

function getHTML() {
  return HTTPSClient.get(appConfig.url);
}

function createInfoPage(html) {
  return new Promise(function(resolve, reject) {
    resolve(InfoPage.fromHTML(html));
  });
}

function checkForUpdates(page) {
  return new Promise(function(resolve, reject) {
    let updateDate = page.getUpdateDate(),
      lastUpdate = new Date(appConfig.lastUpdate);
    if (appConfig.lastUpdate === null || lastUpdate.getTime() !==
      updateDate.getTime()) {
      let news = page.getNews(),
        newsText = "";
      news.forEach((news) => {
        newsText += "<h2>" + news.title + "</h2>\n" + news.content;
      });
      resolve({
        date: updateDate,
        text: newsText,
      });
    } else {
      reject("No updates detected");
    }
  });
}

function sendMail(update) {
  return new Promise(function(resolve, reject) {
    Mailer.send({
      host: appConfig.mailHost,
      port: appConfig.mailPort,
      secure: appConfig.mailSecure,
      user: appConfig.mailUser,
      password: appConfig.mailPass,
      from: appConfig.mailSender,
      to: appConfig.mailRecipients,
      subject: appConfig.mailSubject.replace("$DATE", update.date),
      text: appConfig.mailText.replace("$DATE", update.date).replace("$NEWS",
        update.text),
    }).then(() => {
      resolve(update.date);
    }).catch((error) => {
      reject(error);
    });
  });
}

function updateConfig(date) {
  appConfig.lastUpdate = date;
  appConfig.save();
  log("Email send and config.json updated");
}

function log(msg) {
  /* eslint-disable no-console */
  console.log(msg);
  /* eslint-enable no-console */
}

function run() {
  getHTML().then(createInfoPage).then(checkForUpdates).then(sendMail).then(updateConfig).catch(log);
}

run();