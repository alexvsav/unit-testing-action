import * as utils from "../../../src/cli/utils"
import * as fs from "fs"
// @ponicode
describe("utils.checkIfPonicodeConfigFile", () => {
    test("0", () => {
        let spy: any = jest.spyOn(fs, "existsSync")
        spy.mockReturnValue(true)
        let result: any = utils.checkIfPonicodeConfigFile()
        expect(result).toMatchSnapshot()
        spy.mockRestore()
    })

    test("1", () => {
        let spy: any = jest.spyOn(fs, "existsSync")
        spy.mockReturnValue(null)
        let result: any = utils.checkIfPonicodeConfigFile()
        expect(result).toMatchSnapshot()
        spy.mockRestore()
    })
})
