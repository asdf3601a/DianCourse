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
			let postData = "f_id="+account+"&f_pwd="+password

			let request = https.request(
				{
					hostname: "webs.asia.edu.tw",
					port: 443,
					path: "/stdinfo/login_std.asp",
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Content-Length": postData.length
					}
				},
				(response) => {
					response.on("data", (chunk) => {
						let $ = cheerio.load(chunk.toString("utf-8"))
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

			request.write(postData)

			request.end()
		})
	}

	getMainPage() {
		return this.getPath("/stdinfo/main.asp")
	}

	getPathByID(id: string) {
		return this.getPath("/stdinfo/main.asp?FID=" + id)
	}

	getPath(path: string) {
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
						resolve(chunk)
					})
				}
			)

			request.on("error", (err) => {
				reject(err)
			})

			request.end()
		})
	}

	postPathByID(id: string, postData: string) {
		return this.postPath("?FID="+id, postData)
	}

	postPath(path: string, postData: string) {
		return new Promise((resolve, reject) => {
			let request = https.request(
				{
					hostname: "webs.asia.edu.tw",
					port: 443,
					path: path,
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Content-Length": postData.length,
						"Cookie": this.identify
					}
				},
				(response) => {
					response.on("data", (chunk) => {
						resolve(chunk)
					})
				}
			)

			request.on("error", (err) => {
				reject(err)
			})
	
			request.write(postData)
	
			request.end()	
		})
	}
}

export { DianCourse }