import * as utils from "../../../src/pull_request/utils"
// @ponicode
describe("utils.checkIfCommentALreadyExists", () => {
    test("0", async () => {
        await utils.checkIfCommentALreadyExists(["da7588892", "12345", "bc23a9d531064583ace8f67dad60f6bb"], "Wait time out reached, while waiting for results")
    })

    test("1", async () => {
        await utils.checkIfCommentALreadyExists(["bc23a9d531064583ace8f67dad60f6bb"], "Sorry, The video you are looking for does not exist.")
    })

    test("2", async () => {
        await utils.checkIfCommentALreadyExists(["da7588892", "9876", "9876"], "Unable to find your git executable - Shutdown SickBeard and EITHER <a href=\"http://code.google.com/p/sickbeard/wiki/AdvancedSettings\" onclick=\"window.open(this.href); return false;\">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.")
    })

    test("3", async () => {
        await utils.checkIfCommentALreadyExists(["da7588892", "12345", "9876"], "Invalid Invitation Token.")
    })

    test("4", async () => {
        await utils.checkIfCommentALreadyExists(["12345", "9876", "12345"], "The line-by-line profiler can only be used in dev.")
    })

    test("5", async () => {
        await utils.checkIfCommentALreadyExists([], "")
    })
})

// @ponicode
describe("utils.getAllComments", () => {
    test("0", async () => {
        await utils.getAllComments({ owner: "da7588892", repo: "commit 380428b6b61b64631d941b27db3e91df27bfff8e\r\nAuthor: Lera Swift <Lela.Lubowitz@yahoo.com>\r\nDate: Wed Jul 28 2021 23:21:29 GMT+0200 (Central European Summer Time)\r\n\r\n    reboot digital application\r\n" }, undefined)
    })

    test("1", async () => {
        await utils.getAllComments({ owner: "da7588892", repo: "commit f20ba84baadcbd1f3a45d95e9bb5aef588f4e902\r\nAuthor: Marty Douglas <Rubie_Boehm29@yahoo.com>\r\nDate: Thu Jul 29 2021 09:06:18 GMT+0200 (Central European Summer Time)\r\n\r\n    override solid state microchip\r\n" }, 0)
    })

    test("2", async () => {
        await utils.getAllComments({ owner: "da7588892", repo: "commit e6d1117d97e7cc250166120d2eee1c2662c58150\r\nAuthor: Keagan Cole <Crystal69@gmail.com>\r\nDate: Thu Jul 29 2021 05:36:16 GMT+0200 (Central European Summer Time)\r\n\r\n    override wireless alarm\r\n" }, 100)
    })

    test("3", async () => {
        await utils.getAllComments({ owner: "bc23a9d531064583ace8f67dad60f6bb", repo: "commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n" }, undefined)
    })

    test("4", async () => {
        await utils.getAllComments({ owner: "c466a48309794261b64a4f02cfcc3d64", repo: "commit f20ba84baadcbd1f3a45d95e9bb5aef588f4e902\r\nAuthor: Marty Douglas <Rubie_Boehm29@yahoo.com>\r\nDate: Thu Jul 29 2021 09:06:18 GMT+0200 (Central European Summer Time)\r\n\r\n    override solid state microchip\r\n" }, -5.48)
    })

    test("5", async () => {
        await utils.getAllComments({ owner: "", repo: "" }, undefined)
    })
})

// @ponicode
describe("utils.getPRBranchName", () => {
    test("0", () => {
        let result: any = utils.getPRBranchName({ repoURL: "https://", impactedFiles: ["da7588892", "9876", "c466a48309794261b64a4f02cfcc3d64"], branch: "microchip-bypass", ponicodeUtToken: "4.0.0-beta1\t", githubToken: "Bearer ", commentUTs: "Extensions" })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = utils.getPRBranchName({ repoURL: "www.google.com", impactedFiles: ["12345", "da7588892"], branch: "port-generate", ponicodeUtToken: "v1.2.4", githubToken: "DEFAULT", commentUTs: "Harbors" })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = utils.getPRBranchName({ repoURL: "https://", impactedFiles: ["bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb", "9876"], branch: "sensor-copy", ponicodeUtToken: "v4.0.0-rc.4", githubToken: "color", commentUTs: "Extensions" })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = utils.getPRBranchName({ repoURL: "http://base.com", impactedFiles: ["da7588892", "bc23a9d531064583ace8f67dad60f6bb", "da7588892"], branch: "sensor-copy", ponicodeUtToken: "1.0.0", githubToken: ",", commentUTs: "Port" })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = utils.getPRBranchName({ repoURL: "http://www.example.com/route/123?foo=bar", impactedFiles: ["c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb"], branch: "microchip-bypass", ponicodeUtToken: "4.0.0-beta1\t", githubToken: "qvar", commentUTs: "Expressway" })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = utils.getPRBranchName({ repoURL: "", impactedFiles: [], branch: "", ponicodeUtToken: "", githubToken: "", commentUTs: "" })
        expect(result).toMatchSnapshot()
    })
})

// @ponicode
describe("utils.getOriginalPullRequestNumber", () => {
    test("0", () => {
        let result: any = utils.getOriginalPullRequestNumber()
        expect(result).toMatchSnapshot()
    })
})

// @ponicode
describe("utils.deleteComment", () => {
    test("0", async () => {
        await utils.deleteComment("https://croplands.org/app/a/reset?token=", { owner: "da7588892", repo: "commit 380428b6b61b64631d941b27db3e91df27bfff8e\r\nAuthor: Lera Swift <Lela.Lubowitz@yahoo.com>\r\nDate: Wed Jul 28 2021 23:21:29 GMT+0200 (Central European Summer Time)\r\n\r\n    reboot digital application\r\n" })
    })

    test("1", async () => {
        await utils.deleteComment("Www.GooGle.com", { owner: "c466a48309794261b64a4f02cfcc3d64", repo: "commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n" })
    })

    test("2", async () => {
        await utils.deleteComment("http://base.com", { owner: "da7588892", repo: "commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n" })
    })

    test("3", async () => {
        await utils.deleteComment("http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg", { owner: "12345", repo: "commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n" })
    })

    test("4", async () => {
        await utils.deleteComment("https://api.telegram.org/", { owner: "c466a48309794261b64a4f02cfcc3d64", repo: "commit e6d1117d97e7cc250166120d2eee1c2662c58150\r\nAuthor: Keagan Cole <Crystal69@gmail.com>\r\nDate: Thu Jul 29 2021 05:36:16 GMT+0200 (Central European Summer Time)\r\n\r\n    override wireless alarm\r\n" })
    })

    test("5", async () => {
        await utils.deleteComment("", { owner: "", repo: "" })
    })
})

// @ponicode
describe("utils.generatePRComment", () => {
    test("0", async () => {
        await utils.generatePRComment(-100, "Unknown Error", { owner: "bc23a9d531064583ace8f67dad60f6bb", repo: "commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n" })
    })

    test("1", async () => {
        await utils.generatePRComment(undefined, "Error getting key from: %s", { owner: "12345", repo: "commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n" })
    })

    test("2", async () => {
        await utils.generatePRComment(undefined, undefined, { owner: "9876", repo: "commit d3f6bf9bcee016096098e88aced2d5afdc68c424\r\nAuthor: Edna Rice <Shanie.Pagac@yahoo.com>\r\nDate: Wed Jul 28 2021 22:05:49 GMT+0200 (Central European Summer Time)\r\n\r\n    bypass cross-platform hard drive\r\n" })
    })

    test("3", async () => {
        await utils.generatePRComment(-5.48, "No error", { owner: "9876", repo: "commit e6d1117d97e7cc250166120d2eee1c2662c58150\r\nAuthor: Keagan Cole <Crystal69@gmail.com>\r\nDate: Thu Jul 29 2021 05:36:16 GMT+0200 (Central European Summer Time)\r\n\r\n    override wireless alarm\r\n" })
    })

    test("4", async () => {
        await utils.generatePRComment(undefined, undefined, { owner: "c466a48309794261b64a4f02cfcc3d64", repo: "commit d3f6bf9bcee016096098e88aced2d5afdc68c424\r\nAuthor: Edna Rice <Shanie.Pagac@yahoo.com>\r\nDate: Wed Jul 28 2021 22:05:49 GMT+0200 (Central European Summer Time)\r\n\r\n    bypass cross-platform hard drive\r\n" })
    })

    test("5", async () => {
        await utils.generatePRComment(Infinity, undefined, { owner: "", repo: "" })
    })
})

// @ponicode
describe("utils.getWorkingRepo", () => {
    test("0", () => {
        let result: any = utils.getWorkingRepo()
        expect(result).toMatchSnapshot()
    })
})
