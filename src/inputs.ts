import {InputOptions} from "@actions/core";
import { ActionInputs } from "./types";

type GetInput = (name: string, options?: InputOptions | undefined) => string;

const parseJSON = <T>(getInput: GetInput, property: string): T | undefined => {
  const value = getInput(property);
  if (!value) {
    return;
  }
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    const error = e as Error;
    throw new Error(`invalid format for '${property}: ${error.toString()}`);
  }
};

const parseActionInputs = (getInput: GetInput): ActionInputs => {
  const repoURL = getInput("repoURL", {required: true});
  let impactedFiles = parseJSON<string[]>(getInput, "impactedFiles");
  const branch = getInput("branch", { required: true});
  const ponicodeUtToken = getInput("ponicodeUtToken", { required: true});
  const githubToken = getInput("githubToken", { required: true});

  if (!impactedFiles) {
    impactedFiles = [];
  }

  return {
    repoURL,
    impactedFiles,
    branch,
    ponicodeUtToken,
    githubToken
  };
};

export { parseActionInputs };
