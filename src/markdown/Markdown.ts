import * as core from "@actions/core";
import { readFileSync } from 'fs';
import { TestFile } from "../cli/types";

const replace = require("replace-in-file");

interface IMessageInputs {
    file: string;
    nb_tests: number;
    url: string;
    test_files: string;
}

class Markdown {

    public async createUTPRComment(url: string | undefined, testFiles: TestFile[]): Promise<string> {
        let message: string = "";

        if (url !== undefined) {

            let test_files: string = "";
            testFiles.forEach((file: TestFile) => {
                test_files += `- ${file.filePath}\n`;
            });

            const fileName = __dirname + "/pull_request.md";

            const inputs: IMessageInputs = {
                file: fileName,
                nb_tests: testFiles.length,
                url,
                test_files,
            };

            message += await this.generateMessageFromMDFile(inputs);

        } else {
            message += "## Something wrong happened during the creation of the PR.";
        }

        return message;
    }

    private async generateMessageFromMDFile(inputs: IMessageInputs): Promise<string> {
        const options = {
            files: inputs.file,
            from: [/%nb_tests%/g, /%url%/g, /%list_of_tests%/g],
            to: [ inputs.nb_tests, inputs.url, inputs.test_files ],
        };

        const results = await replace(options);
        core.debug(results);

        const message = readFileSync(inputs.file, "utf-8");
        core.debug(message);

        return message;

    }

}

export default new Markdown();
