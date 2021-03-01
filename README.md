<img alt="Ponicode Logo_product_hunt" target="_blank" src="https://uploads-ssl.webflow.com/5f85a5ab7da846bd78f988af/5fbedb0ac44e97553238dde5_Couv%20readme-Ponicode%20Unit%20Test.png"/>

# Disclaimer 🦄
Oh no 😱, Ponicode Unit Test is not currently available.  
Our GitHub Action is getting a facelift and the Ponicode team is working hard to bring it back online. We promise you that it will be more beautiful than ever.  
You can continue using Ponicode in VS Code for free.  
Our unique unit test generating AI is available as a VS Code extension for you to create unit tests twice faster than ever. Go to [www.ponicode.com](https://ponicode.com) to get started.  
We apologize for the disturbance it might cause on your code quality journey and we hope we will forgive us for it.  
If you have any questions please shoot us a message at ping(at)ponicode.com and we will get back to you asap.

# 🦄 Automatically writes unit tests for your project 🦄

This github action generates automated unit tests for your JavaScript functions with the Ponicode AI engine (this action is currently a beta version)

```yaml
- uses: ponicode/unit-testing-action@master
  id: ponicode
  with:
      repoPath: ./
      authToken: ${{ secrets.PONICODE_TOKEN }}
```


Once the unit tests are written, use the [create pull request action](https://github.com/peter-evans/create-pull-request) to see the results in the branch of your choice.
You can use the variable `steps.ponicode.outputs.ponicodeSummary`

```yaml
# Creates pull request with all changes in file
- name: Create Pull Request
  uses: peter-evans/create-pull-request@v2
  with:
      token: ${{ secrets.GITHUB_TOKEN }}
      commit-message: "[ponicode-pull-request] Ponicode found unit tests to write!"
      branch: ponicode-tests
      title: "[Ponicode] Unit tests created"
      body: ${{ steps.ponicode.outputs.ponicodeSummary }}
```

## Requirements

-   A [Ponicode](https://ponicode.com/) account

## Terms of use

When you use this action, Ponicode will send the content of all the JavaScript files of your project to the Ponicode API in order to provide you with relevant unit test suggestions. Some of your code might be stored to improve our prediction models, but it will never be shared with a third-party.

# How to setup (You must follow steps 1 and 2 to make the action work)

## **Step 1**: Create a yaml workflow file in your project

Go to the root of your project, and create the path to your workflow file. For example

```
mkdir -p .github/workflows
```

Here is an example of what to put in your `.github/workflows/ponicode.yml` file to trigger the action.

```yaml
name: Ponicode unit test generation
on:
    push:
        branches: [master]
jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            # checkout your code with your git history (mandatory to changedFilesOnly option)
            - uses: actions/checkout@v2
              with:
                  fetch-depth: 0

            # Unit tests your functions with Ponicode action
            - uses: ponicode/unit-testing-action@master
              id: ponicode
              with:
                  repoPath: ./
                  authToken: ${{ secrets.PONICODE_TOKEN }}

              # Creates pull request with all changes in file
            - name: Create Pull Request
              uses: peter-evans/create-pull-request@v2
              with:
                  token: ${{ secrets.GITHUB_TOKEN }}
                  commit-message: "[ponicode-pull-request] Ponicode found unit tests to write!"
                  branch: ponicode-tests
                  title: "[Ponicode] Unit tests created"
                  body: ${{ steps.ponicode.outputs.ponicodeSummary }}
```

**This yaml file writes your unit tests everytime you push on master and makes a pull request on a ponicode-tests branch with the test files created**

## **Step 2:** Add your Ponicode token to github secrets

To get a Ponicode token follow these steps:

-   Connect to your Ponicode member page at https://app.ponicode.com/actions
-   Copy your Ponicode token

To add the Ponicode token to your Github Secrets follow these steps:

-   Open your project on Githubgi
-   Click on `Settings`
-   Click on `Secrets`
-   Click on `New Secret`
-   Name: `PONICODE_TOKEN`, Value: (Paste your token from VS code)

That's it! Once this is done, the action will be triggered on every push.

# Ponicode Action inputs

| Name               | Description                                                                                                                      | Required | Default |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `repoPath`         | The relative path in your repo to the files you want Ponicode to test. By default, Ponicode tests your whole repo.               | true     | `./`    |
| `authToken`        | The Ponicode token. By default, the value is empty. The Ponicode secret is required for the action to work.                      | true     | ` `     |
| `changedFilesOnly` | Decide if you want Ponicode to write the tests for the changes from your last commit(s) (`true`) or for the whole repo (`false`) | false    | `false` |
| `coverageJsonPath` | If you already have an LCOV coverage file, you can add its path to calculate the coverage difference after ponicode run.         | false    |         |

## Project compilation

In order to get the test results, the github action use `npm install` to install your project''s dependencies and `npm run build` to build it. Please make sure your project is building before running the Ponicode github action.

## Coverage file

If you want to generate a LCOV coverage file, please run: `jest --coverage`.

## Contact us

We would love to hear your feedback! Tell us what you loved and what you want us to improve about this action at feedback@ponicode.com, or feel free to open a Github Issue.<br />
We also have a [Slack community channel](https://ponicode-community.slack.com/join/shared_invite/zt-fiq4fhkg-DE~a_FkJ7xtiZxW7efyA4Q#/), where people can ask for help if they encounter problems with our products and where we keep you informed about our latest releases.<br />
If you want to know more about Ponicode and the different services we propose, check out our website [www.ponicode.com](https://ponicode.com)! <br /> <br/>
<img alt="Ponicode Footer" src="./shared/footer.png" width="100%"/>
