import * as core from "@actions/core";
import * as fs from "fs";
import { TestFile } from "../cli/types";
import { ActionInputs } from "../types";
import { extractTestFiles } from "./utils";

export const PONICODE_REPORT_JSON = process.env.GITHUB_WORKSPACE + "/ponicode-report.json";
export const PONICODE_REPORT_SYNTHESIS_JSON = process.env.GITHUB_WORKSPACE + "/ponicode-report.synthesis.json";

export class PonicodeReport {

    private ponicodeJsonReport: IPonicodeReportJsonItem[];
    private testFiles: TestFile[];
    private actionInputs: ActionInputs;

    constructor(actionInputs: ActionInputs) {
        this.actionInputs = actionInputs;
        this.ponicodeJsonReport = JSON.parse(fs.readFileSync(PONICODE_REPORT_JSON, "utf-8"));
        this.testFiles = extractTestFiles(this.ponicodeJsonReport, this.actionInputs);
    }

    public getTestFiles(): TestFile[] {
        return this.testFiles;
    }

    public async generateCLIReport(): Promise<ICLIReport | undefined> {

        const report: ICLIReport = {} as ICLIReport;

        if (fs.existsSync(PONICODE_REPORT_SYNTHESIS_JSON)) {
            const content = JSON.parse(fs.readFileSync(PONICODE_REPORT_SYNTHESIS_JSON, "utf-8"));
            report.testCaseReport = content.testCaseReport;
            report.coverage = content.coverage;

        }

        report.nbTestFiles = this.testFiles.length;

        return report;

    }

}
