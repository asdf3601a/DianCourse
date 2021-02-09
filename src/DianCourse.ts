import * as https from "https"
import * as cheerio from "cheerio"
import * as querystring from "querystring"

class DianCourse {
	constructor() { }

	auth(account: string, password: string) {
		return new Promise((resolve, rejects) => {
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
						let $ = cheerio.load(buffer.toString())
						let isSuccess = $("a").attr('href') == "main.asp"

						if (response.headers["set-cookie"] && isSuccess) {
							resolve(response.headers["set-cookie"][0].split(";")[0])
						} else rejects(new Error("Fail to login."))
					})
				}
			)
			
			request.on("error", (err) => {
				rejects(err)
			})

			request.write(stringifyData)

			request.end()
		})
	}
}