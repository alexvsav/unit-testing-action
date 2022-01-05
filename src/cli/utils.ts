import * as core from "@actions/core";
import { exec } from "child_process";
import * as fs from "fs";
import { GithubRepo } from "../pull_request/types";
import { checkIfCommentALreadyExists, deleteComment, generatePRComment, getAllComments,
    getOriginalPullRequestNumber, getWorkingRepo } from "../pull_request/utils";
import { IEnvironment, IPonicodeInitParams, TestFile } from "./types";

export const ponicodeConfigFile = process.env.GITHUB_WORKSPACE + "/ponicode.config.json";

export const ENV_PREPROD_COMMAND = [ "PONICODE_ENDPOINT=https://ponicode-pulpfiction-preprod.azurewebsites.net",
    "PLATFORM_ENDPOINT=https://wizard.preprod.ponicode.com",
    "DASHBOARD_ENDPOINT=https://api.preprod.ponicode.com/platform" ];

export const PLATFORM_ENDPOINTS = {
    PROD: `https://app.ponicode.com/`,
    PREPROD: `https://wizard.preprod.ponicode.com/`,
};

export function checkIfPonicodeConfigFile(): boolean {
    return fs.existsSync(ponicodeConfigFile);
}

export function buildFilesArgument(files: string[]): string {
    let fileArguments = "";
    for (const file of files) {
        if (fs.existsSync(file)) {
            fileArguments += ` ${file}`;
        }
    }

    return fileArguments;
}

export function execCommand(command: string, callback: () => void) {
    const execProcess = exec(command, { 'encoding': 'utf8' }, (error, stdout) => {
        core.debug(`exec stdout: ${stdout} error: ${error}`);
    });
    execProcess.on("spawn", () => {
        core.debug("spawn on spawn");
    });
    execProcess.stderr?.on("data", (data) => {
        core.debug(`spawn on error ${data}`);
    });
    execProcess.on("exit", (code, signal) => {
        core.debug(`spawn on exit code: ${code} signal: ${signal}`);
    });
    execProcess.on("close", (code: number, args: any[]) => {
        core.debug(`spawn on close code: ${code} args: ${args}`);
        if (code === 0) {
            callback();
        } else {
            core.debug("Command fails");
            generatePRComment(getOriginalPullRequestNumber(), "## Sorry, we couldn't generate the Unit-Tests for your files.\
                You should update your PONICODE_TOKEN in your secrets. It might have expired.", getWorkingRepo());
        }
    });
}

export async function deleteInitErrorMessageIfExists(pullRequestNumber: number | undefined,
                                                     repo: GithubRepo, mdErrorFilesName: string[]): Promise<void> {
    const comments = await getAllComments(repo, pullRequestNumber);

    for (const filename of mdErrorFilesName) {

        const message = fs.readFileSync(__dirname + "/" + filename, "utf-8");
        const comment = await checkIfCommentALreadyExists(comments, message);

        // If yes, update that
        if (comment) {
            core.debug("There is already one comment that matches, then delete it.");
            // await updateComment(comment, message);
            await deleteComment(comment, repo);
        // if not, create a new comment
        }

    }

}

export function getProjectName(): string | undefined {
    if (fs.existsSync(ponicodeConfigFile)) {
        const ponicodeInitParams: IPonicodeInitParams = JSON.parse(fs.readFileSync(ponicodeConfigFile, "utf-8"));
        return ponicodeInitParams.name;
    } else {
        return undefined;
    }

}

export function getEnvironment(): IEnvironment {
    if (process.env.ENVIRONMENT !== undefined ) {
        const result: IEnvironment = {
            env: (process.env.ENVIRONMENT === "PREPROD") ? "PREPROD" : "PROD",
        };
        return result;
    } else {
        const result: IEnvironment = {
            env: "PROD",
        };
        return result;
    }

}

export function exportPreprodEnvVariables(command: string): string {
    // If we are in PREPROD env, then set some global variable to point to Preperod
    if (getEnvironment().env === "PREPROD") {
        for (const envVar of ENV_PREPROD_COMMAND ) {
            command = envVar + " " + command;
        }
    }

    return command;
}

export function getXdgConfigFilePath(): string {
    return (getEnvironment().env === "PREPROD") ? "settings.preprod.json" : "settings.json";
}
