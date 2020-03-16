/* eslint-env node */

const https = require("https");

class HTTPSClient {

	static get(url) {
		return new Promise(function(resolve, reject){
			let data = "";
			https.get(url, (res) => {
				res.on("data", (chunk) => {
					data += chunk;
				});
				res.on("end", () => {
					resolve(data);
				});
				res.on("error", (error) => {
					reject(error);
				});
			});
		});
	}
}

module.exports = HTTPSClient;