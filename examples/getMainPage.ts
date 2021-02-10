import { DianCourse } from "../src/DianCourse"

async function main() {
    let identify = await DianCourse.auth("Account", "Password")
    let dianCourse = new DianCourse(identify as string)
    console.log(identify)
    let mainPage = await dianCourse.getMainPage() as Buffer
    console.log(mainPage.toString("utf-8"))
}

main()