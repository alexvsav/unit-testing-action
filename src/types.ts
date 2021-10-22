// Action Inputs Type definition
interface ActionInputs {
    repoURL: string;
    impactedFiles: string[];
    branch: string;
    ponicodeUtToken: string;
    githubToken: string;
}

export { ActionInputs };
