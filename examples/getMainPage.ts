import { DianCourse } from "../src/DianCourse"

async function main() {
    let identify = await DianCourse.auth("Account", "Password") as string
    let dianCourse = new DianCourse(identify)
    console.log("identify: " + dianCourse.identify)
    let getMainPage = await dianCourse.getMainPage() as Buffer

    console.log(getMainPage.toString("utf-8"))
}

main()