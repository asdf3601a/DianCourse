import * as https from "https"
import * as cheerio from "cheerio"
import * as querystring from "querystring"

class DianCourse {
	identify: string

	constructor(identify: string) {
		this.identify = identify
	}

	static auth(account: string, password: string) {
		return new Promise((resolve, reject) => {
			type dataParams = {
				readonly f_id: string,
				readonly f_pwd: string
			}

			let postData: dataParams = { f_id: account, f_pwd: password }
			let stringifyData = querystring.stringify(postData)

			let request = https.request(
				{
					hostname: "webs.asia.edu.tw",
					port: 443,
					path: "/stdinfo/login_std.asp",
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Content-Length": stringifyData.length
					}
				},
				(response) => {
					response.on("data", (chunk) => {
						let buffer = Buffer.from(chunk)
						let $ = cheerio.load(buffer.toString("utf-8"))
						let isSuccess = $("a").attr("href") == "main.asp"

						if (response.headers["set-cookie"] && isSuccess) {
							resolve(response.headers["set-cookie"][0].split(";")[0])
						} else {
							reject(new Error("Wrong ID or Password."))
						}
					})
				}
			)

			request.on("error", (err) => {
				reject(err)
			})

			request.write(stringifyData)

			request.end()
		})
	}

	getMainPage() {
		return this.get("/stdinfo/main.asp")
	}

	getPageByID(id: string) {
		return this.get("/stdinfo/main.asp?FID=" + id)
	}

	private get(path: string) {
		return new Promise((resolve, reject) => {
			let request = https.request(
				{
					hostname: "webs.asia.edu.tw",
					port: 443,
					path: path,
					method: "GET",
					headers: {
						"Cookie": this.identify
					}
				},
				(response) => {
					response.on("data", (chunk) => {
						let buffer = Buffer.from(chunk)
						resolve(buffer.toString("utf-8"))
					})
				}
			)

			request.on("error", (err) => {
				reject(err)
			})

			request.end()
		})
	}
}

export { DianCourse }