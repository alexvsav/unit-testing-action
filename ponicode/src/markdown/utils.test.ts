import * as utils from "../../../src/markdown/utils"
import * as fs from "fs"
// @ponicode
describe("utils.initMarkdownTable", () => {
    test("0", () => {
        let result: any = utils.initMarkdownTable()
        expect(result).toMatchSnapshot()
    })
})

// @ponicode
describe("utils.buildGithubSecretURL", () => {
    test("0", () => {
        let result: any = utils.buildGithubSecretURL("https://twitter.com/path?abc")
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = utils.buildGithubSecretURL("http://www.example.com/route/123?foo=bar")
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = utils.buildGithubSecretURL("https://")
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = utils.buildGithubSecretURL("www.google.com")
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = utils.buildGithubSecretURL("")
        expect(result).toMatchSnapshot()
    })
})

// @ponicode
describe("utils.buildGithubPRURL", () => {
    test("0", () => {
        let result: any = utils.buildGithubPRURL("https://twitter.com/path?abc", "commit 380428b6b61b64631d941b27db3e91df27bfff8e\r\nAuthor: Lera Swift <Lela.Lubowitz@yahoo.com>\r\nDate: Wed Jul 28 2021 23:21:29 GMT+0200 (Central European Summer Time)\r\n\r\n    reboot digital application\r\n", 1)
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = utils.buildGithubPRURL("ponicode.com", "commit f20ba84baadcbd1f3a45d95e9bb5aef588f4e902\r\nAuthor: Marty Douglas <Rubie_Boehm29@yahoo.com>\r\nDate: Thu Jul 29 2021 09:06:18 GMT+0200 (Central European Summer Time)\r\n\r\n    override solid state microchip\r\n", 400)
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = utils.buildGithubPRURL("http://base.com", "commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n", 350)
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = utils.buildGithubPRURL("www.google.com", "commit 03ccef2ffa982df061ae86ca8730cd9ad0af05b3\r\nAuthor: Ladarius Zboncak <Ricky.Schultz37@hotmail.com>\r\nDate: Wed Jul 28 2021 16:52:11 GMT+0200 (Central European Summer Time)\r\n\r\n    program wireless program\r\n", 90)
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = utils.buildGithubPRURL("ponicode.com", "commit f20ba84baadcbd1f3a45d95e9bb5aef588f4e902\r\nAuthor: Marty Douglas <Rubie_Boehm29@yahoo.com>\r\nDate: Thu Jul 29 2021 09:06:18 GMT+0200 (Central European Summer Time)\r\n\r\n    override solid state microchip\r\n", 30)
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = utils.buildGithubPRURL("", "", -Infinity)
        expect(result).toMatchSnapshot()
    })
})

// @ponicode
describe("utils.generateCriticityLegend", () => {
    test("0", () => {
        let spy: any = jest.spyOn(fs, "readFileSync")
        spy.mockReturnValue("foo bar")
        let result: any = utils.generateCriticityLegend()
        expect(result).toMatchSnapshot()
        spy.mockRestore()
    })

    test("1", () => {
        let spy: any = jest.spyOn(fs, "readFileSync")
        spy.mockReturnValue("")
        let result: any = utils.generateCriticityLegend()
        expect(result).toMatchSnapshot()
        spy.mockRestore()
    })
})
