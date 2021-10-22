import * as core from "@actions/core";
import * as dotenv from "dotenv";
import CLI from "./cli/Cli";
import { parseActionInputs } from "./inputs";
import { ActionInputs } from "./types";

dotenv.config({ path: __dirname + "/.env" });

function processActionInputs(): ActionInputs {
    core.debug(`Parsing inputs`);
    const inputs = parseActionInputs(core.getInput);
    return inputs;
}

function removeDuplicateInImpactedFiles(impactedFiles: string[] | undefined): string[] {
    const result = [...Array.from(new Set(impactedFiles))];
    return result;
}

/** 
* Main entry point.
* @param {string[]} args - arguments received from the command-line
* @return {void} 
*/
async function run(): Promise<void> {

    try {

        // Get the inputs from the CI
        const actionInputs: ActionInputs = processActionInputs();

            // Extract PR impacted files
        const impactedFiles = removeDuplicateInImpactedFiles(actionInputs.impactedFiles);

        if ((impactedFiles !== undefined) && (impactedFiles.length > 0)) {
            // Start Ponicode CLI on the impacted files only
            await CLI.startCLI(actionInputs, impactedFiles);
            // Outpu the action
            core.setOutput("impacted_files", impactedFiles);

        }

    } catch (e) {
        const error = e as Error;
        core.debug(error.toString());
        core.setFailed(error.message);
    }

}

void run();

// E2E Test
