/* eslint-env node */

const fs = require("fs"),
  path = require("path");

class Config {

  constructor(file) {
    this.path = file;
    this.load();
  }

  static from(file) {
    return new Config(file);
  }

  load() {
    let content = fs.readFileSync(this.path),
      jsonContent = JSON.parse(content);
    this.url = jsonContent.url;
    this.lastUpdate = jsonContent.lastUpdate;
    this.mailHost = jsonContent.mailHost;
    this.mailPort = jsonContent.mailPort;
    this.mailSecure = jsonContent.mailSecure;
    this.mailUser = jsonContent.mailUser;
    this.mailPass = jsonContent.mailPass;
    this.mailSubject = jsonContent.mailSubject;
    this.mailSender = jsonContent.mailSender;
    this.mailRecipients = jsonContent.mailRecipients;
    this.mailTemplateFile = jsonContent.mailTemplateFile;
    this.mailText = fs.readFileSync(path.join(__dirname, "../" + this.mailTemplateFile), "utf8");
  }

  save() {
    let jsonContent = {
        url: this.url,
        lastUpdate: this.lastUpdate,
        mailHost: this.mailHost,
        mailPort: this.mailPort,
        mailSecure: this.mailSecure,
        mailUser: this.mailUser,
        mailPass: this.mailPass,
        mailSubject: this.mailSubject,
        mailSender: this.mailSender,
        mailRecipients: this.mailRecipients,
        mailTemplateFile: this.mailTemplateFile,
      },
      jsonString = JSON.stringify(jsonContent);
    fs.writeFileSync(this.path, jsonString);
  }
}

module.exports = Config;