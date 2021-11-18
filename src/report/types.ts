interface ITestCase {
    existing: number;
    added: number;
    edgeCasesAdded: number;
}

interface IFunction {
    supported: boolean;
    name: string;
    startIndex: number;
    startLine: number;
    functionLineCount: number;
    testCases: ITestCase[];
    lastSuccessfulStep: number;
}

interface IPonicodeReportJsonItem {
    supported: boolean;
    filePath: string;
    reason: string | undefined;
    testFilePath: string | undefined;
    functions: IFunction[];
}

interface ITestCasesReport {
    nbTestCasesAdded: number;
    nbEdgeTestCasesAdded: number;
    nbFunctionsWithNewTestCases: number;
    nbFunctionsWithEnoughExistingTestCases: number;
}

interface ICLIReport {
    testCaseReport: ITestCasesReport;
    coverage?: number | undefined;
    nbTestFiles: number;
}