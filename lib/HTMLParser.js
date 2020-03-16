/* eslint-env node */

const jsdom = require("jsdom"),
  { JSDOM } = jsdom;

class HTMLParser {

  constructor(html) {
    this.dom = new JSDOM(html);
  }

  getUpdateDate() {
    let el = this.dom.window.document.querySelector(".author"),
      dateString = el.textContent.split("-")[1].trim(),
      datePart = dateString.split(" ")[0],
      timePart = dateString.split(" ")[1],
      date = new Date(datePart.split(".")[2], datePart.split(".")[1] - 1,
        datePart.split(".")[0], timePart.split(":")[0], timePart.split(":")[1]
      );
    return date;
  }

  getNews() {
    let news = [],
      els = this.dom.window.document.querySelectorAll(
        ".content_toggle_switch");
    els.forEach((el) => {
      let title = el.textContent.trim();
      if (title.startsWith("Updates")) {
        news.push({
          title: title,
          content: el.nextSibling.nextSibling.innerHTML.trim(),
        });
      }
    });
    return news;
  }

}

module.exports = HTMLParser;