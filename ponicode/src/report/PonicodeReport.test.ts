import * as PonicodeReport from "../../../src/report/PonicodeReport"

import * as fs from "fs"
// @ponicode
describe("getTestFiles", () => {
    let inst: any

    beforeEach(() => {
        inst = new PonicodeReport.PonicodeReport({ repoURL: "www.google.com", impactedFiles: ["bc23a9d531064583ace8f67dad60f6bb", "9876", "12345"], branch: "protocol-reboot", ponicodeUtToken: "v4.0.0-rc.4", githubToken: "WORD_", commentUTs: "Extensions" })
    })

    test("0", () => {
        let result: any = inst.getTestFiles()
        expect(result).toMatchSnapshot()
    })
})

// @ponicode
describe("generateCLIReport", () => {
    let inst: any

    beforeEach(() => {
        inst = new PonicodeReport.PonicodeReport({ repoURL: "Www.GooGle.com", impactedFiles: ["12345", "da7588892", "da7588892", "c466a48309794261b64a4f02cfcc3d64", "12345"], branch: "sensor-copy", ponicodeUtToken: "^5.0.0", githubToken: "is not", commentUTs: "Expressway" })
    })

    test("0", async () => {
        let spy: any = jest.spyOn(fs, "existsSync")
        let spy1: any = jest.spyOn(fs, "readFileSync")
        spy.mockReturnValue(false)
        spy1.mockReturnValue("Foo bar")
        await inst.generateCLIReport()
        spy.mockRestore()
        spy1.mockRestore()
    })

    test("1", async () => {
        let spy: any = jest.spyOn(fs, "existsSync")
        let spy1: any = jest.spyOn(fs, "readFileSync")
        spy.mockReturnValue(false)
        spy1.mockReturnValue("")
        await inst.generateCLIReport()
        spy.mockRestore()
        spy1.mockRestore()
    })
})
