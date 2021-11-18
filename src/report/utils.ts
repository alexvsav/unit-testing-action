import * as core from "@actions/core";
import * as fs from "fs";
import { TestFile } from "../cli/types";
import { ActionInputs } from "../types";

export function extractTestFiles(ponicodeJsonReportItems: IPonicodeReportJsonItem[],
                                 actionInputs: ActionInputs): TestFile[] {

    const testFiles: TestFile[] = [];

    for ( const ponicodeJsonReportItem of ponicodeJsonReportItems ) {

        if (ponicodeJsonReportItem.testFilePath !== undefined) {

            const fileContent: string | undefined =
            getTestFileContent(ponicodeJsonReportItem.testFilePath, actionInputs);

            if (fileContent !== undefined) {

                const testFile: TestFile = {
                    filePath: ponicodeJsonReportItem.testFilePath.replace(process.env.GITHUB_WORKSPACE + "/", ""),
                    content: fileContent,
                };
                testFiles.push(testFile);
            }

        }

    }

    return testFiles;

}

function getTestFileContent(testFilePath: string, actionInputs: ActionInputs): string | undefined {

    if (fs.existsSync(testFilePath)) {

        if (actionInputs.commentUTs !== "true") {
            // Do nothing
        } else {
            // Comment all lines of the test file
            commentAllLinesofFile(testFilePath);
        }

        try {
            const fileContent = fs.readFileSync(testFilePath, "utf-8");
            return fileContent;

        } catch (e) {
            const error = e as Error;
            core.debug(error.message);
            return undefined;
        }

    } else {
        return undefined;
    }

}

function commentAllLinesofFile(filePath: string): void {
    const addPrefix = (str: string) => "// " + str;
    let fileContent: string = "";

    // DEBUG
    core.debug(`Read file ${filePath} for appending comments`);
    const data = fs.readFileSync(filePath, "utf-8");
    // split the contents by new line
    const lines = data.split(/\r?\n/);

    // print all lines
    lines.forEach((l) => {
        const prefixedLine = addPrefix(l) + "\n";
        fileContent += prefixedLine;
    });

    fs.writeFileSync(filePath, fileContent);

}
