import * as https from "https"
import * as cheerio from "cheerio"

interface options {
	hostname: string,
	port: number,
	path: string,
	method: string,
	headers: object
}

class DianCourse {
	token: string
	options: options

	constructor(token: string) {
		this.options = {
			hostname: "webs.asia.edu.tw",
			port: 443,
			path: "",
			method: "",
			headers: {},
		}
		this.token = token
	}

	static auth(id: string, pwd: string) {
		return new Promise((resolve, reject) => {
			let postData = "f_id=" + id + "&f_pwd=" + pwd

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

						if (response.headers["set-cookie"] && $("a").attr("href") == "main.asp") {
							resolve(response.headers["set-cookie"][0].split(";")[0])
						} else {
							reject(new Error("Wrong ID or Password."))
						}
					})
				}
			)

			request.on("error", (err) => { reject(err) })
			request.write(postData)
			request.end()
		})
	}

	getPath(path: string) {
		return new Promise((resolve, reject) => {
			let options = this.options
			options["path"] = path
			options["method"] = "GET"
			options["headers"] = { "Cookie": this.token }

			let request = https.request(
				options as object,
				(response) => {
					let buf: any[] = []
					response.on("data", (chunk) => { buf.push(chunk) })
					response.on("error", () => { reject })
					response.on("close", () => { resolve(Buffer.concat(buf)) })
				}
			)

			request.on("error", (err) => { reject(err) })
			request.end()
		})
	}

	postPath(path: string, postData: any) {
		return new Promise((resolve, reject) => {
			let options = this.options
			options["path"] = path
			options["method"] = "POST"
			options["headers"] = {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": postData.length,
				"Cookie": this.token
			}

			let request = https.request(
				options as object,
				(response) => {
					let buf: any[] = []
					response.on("data", (chunk) => { buf.push(chunk) })
					response.on("error", () => { reject })
					response.on("close", () => { resolve(Buffer.concat(buf)) })
				}
			)

			request.on("error", (err) => { reject(err) })
			request.end()
		})
	}

	getMainPage() {
		return this.getPath("/stdinfo/main.asp")
	}
}

export { DianCourse }