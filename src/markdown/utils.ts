import { readFileSync } from 'fs';
import { Marked } from '@ts-stack/markdown';
import { TestFile } from "../cli/types";

const replace = require("replace-in-file");

const GITHUB_URL = "https://github.com";

function initMarkdownTable(): string {
    let message = "";
    // Table Title
    message += "| File | Line Number | Type of alert | Criticity of the function | Go to | Testable by Ponicode |\n";
    // Table Column Definitions
    message += "| :--- | :---: | :---: | :---: | :---: | :---: |\n";

    return message;
}

function buildGithubSecretURL(repoURL: string): string {
    const message = `${GITHUB_URL}/${repoURL}/settings/secrets/actions`;
    return message;
}

function buildGithubPRURL(repoURL: string, repoOwner: string, pullId: number | undefined): string | undefined {
    if (pullId !== undefined) {
        const message = `${GITHUB_URL}/${repoOwner}/${repoURL}/pull/${pullId}`;
        return message;
    } else {
        return ;
    }
}

function generateCriticityLegend(): string {
    const fileName = __dirname + "/criticity_legends.md";
    const message = readFileSync(fileName, "utf-8");
    return message;
}

async function createSQUARErrorMessage(errorMessage: string | undefined, repoURL: string): Promise<string> {
    const fileName = __dirname + "/error_message.md";
    const url = buildGithubSecretURL(repoURL);
    const options = {
        files: fileName,
        from: [/%errorMessage%/g, /%url%/g],
        to: [errorMessage, url],
    };

    await replace(options);

    const message = readFileSync(fileName, "utf-8");
    return message;
}

async function createUTErrorMessage(errorMessage: string | undefined, repoURL: string): Promise<string> {
    const fileName = __dirname + "/ut_error_message.md";
    const url = buildGithubSecretURL(repoURL);
    const options = {
        files: fileName,
        from: [/%errorMessage%/g, /%url%/g],
        to: [errorMessage, url],
    };

    await replace(options);

    const message = readFileSync(fileName, "utf-8");
    return message;
}

function createTestCodeComment(testFiles: TestFile[]): string {
    let message = `## Overview of Unit-Tests generated for your impacted files\n`;
    message += appendUTOverviewMessages(testFiles);
    return message;
}

function appendUTOverviewMessages(testFiles: TestFile[]): string {
    let message: string = "";

    testFiles?.forEach((testFile: TestFile) => {
        message += `### Unit-Tests proposal for file ${testFile.filePath}\n`;
        message += Marked.parse(testFile.content);
    });

    return message;
};

export { initMarkdownTable, buildGithubSecretURL, buildGithubPRURL, generateCriticityLegend, createSQUARErrorMessage };
