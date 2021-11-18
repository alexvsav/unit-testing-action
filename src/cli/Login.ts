import * as core from "@actions/core";
import fs from "fs";
import path from "path";
import { createErrorMessage } from "../markdown/utils";
import { generatePRComment, getOriginalPullRequestNumber, getWorkingRepo } from "../pull_request/utils";
import { ActionInputs } from "../types";
import { Settings } from "./types";
import { getXdgConfigFilePath } from "./utils";

const xdg = require("@folder/xdg");

class Login {

    private configFile: string | undefined;

    public async setXdgConfigToken(inputs: ActionInputs): Promise<void> {
        try {
            const configDir = xdg().config as string;
            this.configFile = path.join(configDir, "ponicode", getXdgConfigFilePath());

            const settings: Settings = {
                "auth.token": inputs.ponicodeUtToken,
            };
            fs.mkdirSync(path.join(configDir, "ponicode"), { recursive: true, mode: 0o755 });

            fs.writeFileSync(this.configFile, JSON.stringify(settings, null, 4));

        } catch (e) {
            const error: Error = e as Error;
            const errorMessage = `Failed to locate settings folder: ${error.message}`;
            // Push an error message in PR comment
            const message = await createErrorMessage(errorMessage, inputs.repoURL);
            generatePRComment(getOriginalPullRequestNumber(), message, getWorkingRepo());
            core.setFailed(errorMessage);
        }

    }

    public getConfigFile(): string | undefined {
        return this.configFile;
    }

    public getConfigFileContent(): string | undefined {
        if (this.configFile) {
            const confContent = fs.readFileSync(this.configFile, "utf-8");
            return `${this.configFile}: ${confContent}`;
        } else {
            return ;
        }

    }

}

export default new Login();
