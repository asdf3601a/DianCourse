const cheerio = require('cheerio')
const https = require('https')
const { on } = require('process')

hostname = "webs.asia.edu.tw"
cookies = ""

var options = {
    hostname: hostname,
    port: 443,
    path: "/stdinfo/login_std.asp",
    method: "GET",
}

var request = https.request(options, (response) => {
    if (response.statusCode != 302) return
    console.log(response.headers['set-cookie'][0].split(";")[0])
})

request.on("error", (error) => {
    console.error(error)
})

request.end()
