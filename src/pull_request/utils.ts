import * as core from "@actions/core";
import * as github from "@actions/github";
import { context } from "@actions/github/lib/utils";
import leven from "leven";
import { ActionInputs } from "../types";
import { GithubRepo, PONICODE_UT_BRANCH } from "./types";

// get the inputs of the action. The "token" input
// is not defined so far - we will come to it later.
const githubToken = core.getInput("githubToken");
const octokit = github.getOctokit(githubToken);

const LEVEN_DISTANCE = 2;

async function getAllComments(repo: { owner: any; repo: any; }, issue_number: number | undefined): Promise<any[]> {

    if (issue_number) {
        // Get all comments we currently have...
        // (this is an asynchronous function)
        const { data: comments } = await octokit.rest.issues.listComments({
            owner: repo.owner,
            repo: repo.repo,
            issue_number,
        });

        return comments;
    } else {
        return [];
    }

}

async function checkIfCommentALreadyExists(comments: any[], message: string): Promise<any> {

    const startOfMessage = message.slice(0, 50);
    // ... and check if there is already a comment by us
    // tslint:disable-next-line: no-shadowed-variable
    const comment = comments.find((comment) => {
        if ((comment) && (comment.user) && (comment.body)) {
            const startOfComment = comment.body.slice(0, 50);
            const lenDistance = leven(startOfMessage, startOfComment);

            return (
                comment.user.login === "github-actions[bot]" &&
                ( lenDistance <= LEVEN_DISTANCE)
            );
        }
    });
    return comment;

}

function getPRBranchName(inputs: ActionInputs): string {
    return PONICODE_UT_BRANCH + `-4-${inputs.branch}`;
}

function getOriginalPullRequestNumber(): number | undefined {
    const context = github.context;
    const originalPullRequestNumber: number | undefined = context.payload.pull_request?.number;
    return originalPullRequestNumber;
}

async function generatePRComment(pullRequestNumber: number | undefined, message: string | undefined,
                                 repo: GithubRepo ): Promise<void> {

    // The github module has a member called "context",
    // which always includes information on the action workflow
    // we are currently running in.
    // For example, it let's us check the event that triggered the workflow.
    if (github.context.eventName !== "pull_request") {
      // The core module on the other hand let's you get
      // inputs or create outputs or control the action flow
      // e.g. by producing a fatal error
      core.debug("Can only run on pull requests!");
      return;
    }

    if (!message) {
      core.debug("Message to display is empty");
      return;
    }

    // The Octokit is a helper, to interact with
    // the github REST interface.
    // You can look up the REST interface
    // here: https://octokit.github.io/rest.js/v18

    if (pullRequestNumber) {

      try {

          /* un comment this if you want to keep only one Ponicode SQUAR report in the 
          * comments of the PR, and it is updated in case there is alreayd one
          */
          const comments = await getAllComments(repo, pullRequestNumber);

          const comment = await checkIfCommentALreadyExists(comments, message);

          // If yes, update that
          if (comment) {
              core.debug("There is already one comment that matches, then delete it.");
              // await updateComment(comment, message);
              await deleteComment(comment, repo);
          // if not, create a new comment
          } /*else {
              core.debug("No comment matches, then create it.");
              await createComment(repo, pullRequestNumber, message);
          }*/

        // Create the comment in the PR
          await createComment(repo, pullRequestNumber, message);

      } catch (e) {
          const error = e as Error;
          core.setFailed(error.message);
      }
    }

  }

async function createComment(repo: GithubRepo, pullRequestNumber: number, message: string): Promise<void> {
    await octokit.rest.issues.createComment({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: pullRequestNumber,
        body: message,
    });

  }

async function deleteComment(comment: any, repo: GithubRepo): Promise<void> {
    await octokit.rest.issues.deleteComment({
        owner: repo.owner,
        repo: repo.repo,
        comment_id: comment.id,
    });
}

function getWorkingRepo(): GithubRepo {
    return context.repo;
}

export { getAllComments, checkIfCommentALreadyExists, getPRBranchName,
    getOriginalPullRequestNumber, generatePRComment, getWorkingRepo, deleteComment };
