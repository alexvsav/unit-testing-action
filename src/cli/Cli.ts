import * as core from "@actions/core";
import PullRequest from "../pull_request/PullRequest";
import { generatePRComment, getOriginalPullRequestNumber,
    getPRBranchName, getWorkingRepo } from "../pull_request/utils";
import { PonicodeReport } from "../report/PonicodeReport";
import { ActionInputs } from "../types";
import Login from "./Login";
import { TestFile } from "./types";
import { buildFilesArgument, checkIfPonicodeConfigFile, deleteInitErrorMessageIfExists, execCommand,
    exportPreprodEnvVariables,
    getProjectName} from "./utils";

class CLI {

    private actionInputs: ActionInputs;

    constructor(actionInputs: ActionInputs) {
        this.actionInputs = actionInputs;
    }

    public async login(callback: () => void): Promise<void> {
        core.debug("Authenticating Ponicode CLI");
        await Login.setXdgConfigToken(this.actionInputs);

        // DEBUG
        const confContent: string | undefined = Login.getConfigFileContent();
        if (confContent) {
            core.debug(confContent);
        }

        let command = `ponicode login`;
        command = exportPreprodEnvVariables(command);

        core.debug("Loging Ponicode CLI");
        execCommand(command, () => {
            core.debug("Ponicoed CLI is well authenticated");
            callback();
        });
    }

    public async startCLI(files: string[] | undefined): Promise<void> {
        if (files !== undefined) {
            const fileArguments = buildFilesArgument(files);

            // if exists delete the Ponicode init error message from the PR conversation history
            deleteInitErrorMessageIfExists(getOriginalPullRequestNumber(), getWorkingRepo(), [ "/ponicode_init_error_msg.md", "/error_message.md"]);

            await this.login(() => {

                //DEBUG
                core.debug(`Start generating Tests for ${files.toString()}`);

                let command = "";

                // Check if the project already have a ponicode.config file.
                // If not run ponicode test withotu dashboarding
                if (checkIfPonicodeConfigFile()) {
                    command = `INTERNAL_REPORT=1 ponicode --telemetry test --json -d ${fileArguments} > /dev/null`;
                } else {
                    command = `ponicode --telemetry test ${fileArguments} --json > /dev/null`;
                }

                // Add preprod env variables on command if needed
                command = exportPreprodEnvVariables(command);

                // DEBUG
                core.debug(`Final command that will be executed is: ${command}`);

                execCommand(command, async () => {
                    // Call ponicode test hook
                    await this.ponicodeTestCommandHook();
                });
            });

        }
    }

    private async ponicodeTestCommandHook(): Promise<void> {

        // TODO CLI output is OK when there is a report ponicode-report.synthesis.json file
        const ponicodeReport = new PonicodeReport(this.actionInputs);
        const testFiles: TestFile[] = ponicodeReport.getTestFiles();
        if ((testFiles !== undefined) && (testFiles.length > 0)) {
            // core.debug(JSON.stringify(testFiles));

            // Implement processing of the test Files=
            // 1/ Create a PR with those files using 
            //    https://github.com/gr2m/octokit-plugin-create-pull-request
            // 2/ Generate a comment with an extract of the generateg UT
            // PullRequest.generatePRComment(Markdown.createTestCodeComment(testFiles));

            const check: number | undefined =
                await PullRequest.isPRExist(getPRBranchName(this.actionInputs), this.actionInputs.branch );

            if (check !== undefined) {
                core.debug("PR already exists, create a commit");
                PullRequest.createCommit(testFiles, this.actionInputs, check, await ponicodeReport.generateCLIReport());
            } else {
                core.debug("PR does not exist: create the PR");
                PullRequest.createUTPullRequest(testFiles, this.actionInputs, await ponicodeReport.generateCLIReport());
            }

        } else {

            // DEBUG
            core.debug("No generated Tests files");

            generatePRComment(getOriginalPullRequestNumber(), "Sorry, we couldn't generate the Unit-Tests for your files...\
                Please try later", getWorkingRepo());
        }

    }

}

export { CLI };
