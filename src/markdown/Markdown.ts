import * as core from "@actions/core";
import * as fs from "fs";
import { IMessageInputs } from "./types";
import { generateMessageFromMDFile4PR } from "./utils";

class Markdown {

    public async createUTPRComment(url: string | undefined, cliReport: ICLIReport | undefined): Promise<string> {
        let message: string = "";

        let inputs: IMessageInputs;
        const fileName = __dirname + "/pull_request.md";
        const fileNameToUse = fileName + ".copy";
        fs.copyFile(fileName, fileNameToUse, (err) => {
            if (err) {
                // DEBUG
                core.debug(`Couldn't copy MD file to generate PR comment`);
                return `ERROR while generating PR Comment: ${err.message}`;
            }
        });

        if (url !== undefined) {

            inputs = {
                file: fileNameToUse,
                report: cliReport,
                url: url,
            };

        } else {

            inputs = {
                file: fileNameToUse,
                report: cliReport,
                url: undefined,
              };
        }

        message += await generateMessageFromMDFile4PR(inputs);

        return message;
    }

}

export default new Markdown();
