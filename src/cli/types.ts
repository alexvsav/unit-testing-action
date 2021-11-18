export interface TestFile {
    filePath: string;
    content: string;
}

export interface Settings {
    "auth.token": string | undefined;
}

export interface IPonicodeInitParams {
    schemaVersion: string;
    name: string;
    rootDir: string;
    testEnvironment: string;
    testLocationStrategy: string;
    testLocationFolder: string;
    testNamePattern: string;
}

export interface IEnvironment {
    env: "PROD" | "PREPROD";
}
