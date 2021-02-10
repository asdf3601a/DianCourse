import { DianCourse } from "../src/DianCourse"

async function main() {
    let identify = await DianCourse.auth("Account", "Password")
    let dianCourse = new DianCourse(identify as string)
    console.log(identify)
    console.log(await dianCourse.getMainPage())
}

main()