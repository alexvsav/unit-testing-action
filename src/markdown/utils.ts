import * as core from "@actions/core";
import { Marked } from '@ts-stack/markdown';
import { readFileSync } from 'fs';
import * as fs from "fs";
import { TestFile } from "../cli/types";
import { getEnvironment, PLATFORM_ENDPOINTS, ponicodeConfigFile } from "../cli/utils";
import { IMessageInputs } from "./types";

const replace = require("replace-in-file");

const GITHUB_URL = "https://github.com";

export function initMarkdownTable(): string {
    let message = "";
    // Table Title
    message += "| File | Line Number | Type of alert | Criticity of the function | Go to | Testable by Ponicode |\n";
    // Table Column Definitions
    message += "| :--- | :---: | :---: | :---: | :---: | :---: |\n";

    return message;
}

export function buildGithubSecretURL(repoURL: string): string {
    const message = `${GITHUB_URL}/${repoURL}/settings/secrets/actions`;
    return message;
}

export function buildGithubPRURL(repoURL: string, repoOwner: string, pullId: number | undefined): string | undefined {
    // DEBUG
    core.debug(`buildGithubPRURL with pullId = ${pullId}`);

    if (pullId !== undefined) {
        const message = `${GITHUB_URL}/${repoOwner}/${repoURL}/pull/${pullId}`;
        return message;
    } else {
        return ;
    }
}

export function generateCriticityLegend(): string {
    const fileName = __dirname + "/criticity_legends.md";
    const message = readFileSync(fileName, "utf-8");
    return message;
}

export async function createErrorMessage(errorMessage: string | undefined, repoURL: string): Promise<string> {
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

export async function createUTErrorMessage(errorMessage: string | undefined, repoURL: string): Promise<string> {
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

export async function createPonicodeInitErrorMessage(): Promise<string> {
    const fileName = __dirname + "/ponicode_init_error_msg.md";
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
}

export async function generateMessageFromMDFile4PR(inputs: IMessageInputs): Promise<string> {

    const catMessage: string = generateCTAMessage(inputs);
    const insightsMessage: string = await generateInsightsMessage(inputs);
    const prLinkMessage: string = generatePrLinkMessage(inputs.url);

    const options = {
        files: inputs.file,
        from: [/%nbTestFiles%/g, /%prLinkMessage%/g, /%insightsMessage%/g, /%ctaMessage%/g],
        to: [ inputs.report?.nbTestFiles, prLinkMessage, insightsMessage, catMessage ],
    };

    await replace(options);

    const message = readFileSync(inputs.file, "utf-8");

    return message;

}

function generateCTAMessage(inputs: IMessageInputs): string {
    const turboCovUrl = PLATFORM_ENDPOINTS[getEnvironment().env] + "/turbo-cov/projects";

    if (fs.existsSync(ponicodeConfigFile)) {
        const catMEssage = "### 🚀 If you want more insights, and in particular the coverage gain brought by those tests, and the money you gain thanks to that, please go and connect to your [TurboCov dashboard](%turboCovUrl%) 🚀";
        return catMEssage.replace("%turboCovUrl%", turboCovUrl);
    } else {
        const catMEssage = fs.readFileSync(__dirname + "/turbocov_dashboard_benefices.md", "utf-8");
        return catMEssage.replace("%turboCovUrl%", turboCovUrl);
    }
}

function generatePrLinkMessage(url: string | undefined): string {
    // DEBUG
    core.debug(`generatePrLinkMessage: ${url}`);

    if (url !== undefined) {
        const message = "### The generated Unit-Tests have been pushed into the following Pull-Request: [Ponicode UT Bootstrap Pull-Request](%url%)";
        return message.replace("%url%", url);
    } else {
        return "";
    }
}

async function generateInsightsMessage(inputs: IMessageInputs): Promise<string> {

    const fileName = __dirname + "/insights_report_message.md";

    if (inputs.report?.testCaseReport !== undefined) {
        const options = {
            files: fileName,
            from: [ /%nbTestCasesAdded%/g, /%nbEdgeTestCasesAdded%/g, /%nbFunctionsWithNewTestCases%/g],
            to: [ inputs.report?.testCaseReport.nbTestCasesAdded,
                inputs.report?.testCaseReport.nbEdgeTestCasesAdded,
                inputs.report?.testCaseReport.nbFunctionsWithNewTestCases ],
        };

        await replace(options);

        const message = readFileSync(fileName, "utf-8");
        return message;

    } else {
        return "";
    }
}
