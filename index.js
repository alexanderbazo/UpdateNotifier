/* eslint-env node */

const Config = require("./lib/Config.js"),
  HTTPSClient = require("./lib/HTTPSClient.js"),
  HTMLParser = require("./lib/HTMLParser.js"),
  Mailer = require("./lib/Mailer.js"),
  appConfig = Config.from("./config.json");

function getHTML() {
  return HTTPSClient.get(appConfig.url);
}

function createDOMParser(html) {
  return new Promise(function(resolve, reject) {
    resolve(new HTMLParser(html));
  });
}

function update(dom) {
  let updateDate = dom.getUpdateDate(),
    lastUpdate = new Date(appConfig.lastUpdate);
  if (appConfig.lastUpdate === null || lastUpdate.getTime() !== updateDate.getTime()) {
    console.log("Sending E-Mail with status update");
    let news = dom.getNews(),
      newsText = "";
    news.forEach((news) => {
      newsText += "<h2>" + news.title + "</h2>\n" + news.content;
    });
    Mailer.send({
      host: appConfig.mailHost,
      port: appConfig.mailPort,
      secure: appConfig.mailSecure,
      user: appConfig.mailUser,
      password: appConfig.mailPass,
      from: appConfig.mailSender,
      to: appConfig.mailRecipients,
      subject: appConfig.mailSubject.replace("$DATE", updateDate),
      text: appConfig.mailText.replace("$NEWS", newsText),
    }).then(() => {
      appConfig.lastUpdate = updateDate;
      appConfig.save();
    }).catch((error) => {
      console.log(error);
    });
  } else {
    console.log("No updates detected.");
  }
}

function run() {
  getHTML().then(createDOMParser).then(update);
}

run();