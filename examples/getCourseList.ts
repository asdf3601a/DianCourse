import { DianCourse } from "../src/DianCourse"
import * as fs from "fs"

async function main() {
    let token = await DianCourse.auth("Account", "Password") as string
    let dianCourse = new DianCourse(token)

    let poke = await dianCourse.getPath("/stdinfo/rpt/asycoslessonrpt.asp?smtr=" + "學期" + "&sel_txt=" + "學號")
    if (poke) {
        let coursePDF = await dianCourse.getPath("/stdinfo/rpt/RDCrptserver11.asp?cmd=export&export_fmt=crxf_pdf:0") as Buffer
        fs.writeFile("example.pdf", coursePDF, (err) => {console.error(err)})
    }
}

main()