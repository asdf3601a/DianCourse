import { DianCourse } from "../src/DianCourse"

async function main() {
    let token = await DianCourse.auth("Account", "Password") as string
    let dianCourse = new DianCourse(token)
    console.log("identify: " + dianCourse.token)
    let getMainPage = await dianCourse.getMainPage() as Buffer

    console.log(getMainPage.toString("utf-8"))
}

main()