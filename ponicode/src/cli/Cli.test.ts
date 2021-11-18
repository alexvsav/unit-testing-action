import * as Cli from "../../../src/cli/Cli"

import * as PullRequest from "../../../src/pull_request/PullRequest"
import * as PonicodeReport from "../../../src/report/PonicodeReport"
import * as Login from "../../../src/cli/Login"
import * as utils from "../../../src/cli/utils"
// @ponicode
describe("ponicodeTestCommandHook", () => {
    let inst: any

    beforeEach(() => {
        inst = new Cli.CLI({ repoURL: "Www.GooGle.com", impactedFiles: ["da7588892", "12345"], branch: "sensor-copy", ponicodeUtToken: "^5.0.0", githubToken: "string", commentUTs: "Harbors" })
    })

    test("0", async () => {
        let spy: any = jest.spyOn(PullRequest.PullRequest.prototype, "createCommit")
        let spy1: any = jest.spyOn(PonicodeReport.PonicodeReport.prototype, "generateCLIReport")
        let spy2: any = jest.spyOn(PullRequest.PullRequest.prototype, "createUTPullRequest")
        spy.mockReturnValue(undefined)
        spy1.mockReturnValue(-0.5)
        spy2.mockReturnValue(undefined)
        await inst.ponicodeTestCommandHook()
        spy.mockRestore()
        spy1.mockRestore()
        spy2.mockRestore()
    })

    test("1", async () => {
        let spy: any = jest.spyOn(PullRequest.PullRequest.prototype, "createCommit")
        let spy1: any = jest.spyOn(PonicodeReport.PonicodeReport.prototype, "generateCLIReport")
        let spy2: any = jest.spyOn(PullRequest.PullRequest.prototype, "createUTPullRequest")
        spy.mockReturnValue(undefined)
        spy1.mockReturnValue(NaN)
        spy2.mockReturnValue(undefined)
        await inst.ponicodeTestCommandHook()
        spy.mockRestore()
        spy1.mockRestore()
        spy2.mockRestore()
    })
})

// @ponicode
describe("login", () => {
    let inst: any

    beforeEach(() => {
        inst = new Cli.CLI({ repoURL: "Www.GooGle.com", impactedFiles: ["da7588892"], branch: "port-generate", ponicodeUtToken: "^5.0.0", githubToken: "keyword", commentUTs: "Harbors" })
    })

    test("0", async () => {
        let spy: any = jest.spyOn(Login.Login.prototype, "setXdgConfigToken")
        let spy1: any = jest.spyOn(Login.Login.prototype, "getConfigFileContent")
        spy.mockReturnValue(undefined)
        spy1.mockReturnValue(undefined)
        await inst.login(() => undefined)
        spy.mockRestore()
        spy1.mockRestore()
    })

    test("1", async () => {
        let spy: any = jest.spyOn(Login.Login.prototype, "setXdgConfigToken")
        let spy1: any = jest.spyOn(Login.Login.prototype, "getConfigFileContent")
        spy.mockReturnValue(undefined)
        spy1.mockReturnValue("")
        await inst.login(() => undefined)
        spy.mockRestore()
        spy1.mockRestore()
    })
})

// @ponicode
describe("startCLI", () => {
    let inst: any

    beforeEach(() => {
        inst = new Cli.CLI({ repoURL: "www.google.com", impactedFiles: ["c466a48309794261b64a4f02cfcc3d64", "9876"], branch: "port-generate", ponicodeUtToken: "v1.2.4", githubToken: "define", commentUTs: "Port" })
    })

    test("0", async () => {
        let spy: any = jest.spyOn(utils, "buildFilesArgument")
        let spy1: any = jest.spyOn(utils, "deleteInitErrorMessageIfExists")
        let spy2: any = jest.spyOn(Cli.CLI.prototype, "login")
        let spy3: any = jest.spyOn(utils, "checkIfPonicodeConfigFile")
        let spy4: any = jest.spyOn(Cli.CLI.prototype, "ponicodeTestCommandHook")
        spy.mockReturnValue("9876")
        spy1.mockReturnValue(undefined)
        spy2.mockReturnValue(undefined)
        spy3.mockReturnValue(true)
        spy4.mockReturnValue(undefined)
        await inst.startCLI(undefined)
        spy.mockRestore()
        spy1.mockRestore()
        spy2.mockRestore()
        spy3.mockRestore()
        spy4.mockRestore()
    })

    test("1", async () => {
        let spy: any = jest.spyOn(utils, "buildFilesArgument")
        let spy1: any = jest.spyOn(utils, "deleteInitErrorMessageIfExists")
        let spy2: any = jest.spyOn(Cli.CLI.prototype, "login")
        let spy3: any = jest.spyOn(utils, "checkIfPonicodeConfigFile")
        let spy4: any = jest.spyOn(Cli.CLI.prototype, "ponicodeTestCommandHook")
        spy.mockReturnValue("")
        spy1.mockReturnValue(undefined)
        spy2.mockReturnValue(undefined)
        spy3.mockReturnValue(false)
        spy4.mockReturnValue(undefined)
        await inst.startCLI(undefined)
        spy.mockRestore()
        spy1.mockRestore()
        spy2.mockRestore()
        spy3.mockRestore()
        spy4.mockRestore()
    })
})
