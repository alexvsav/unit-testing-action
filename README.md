## :unicorn_face: Ponicode has been acquired by CircleCI :rocket: [Read the announcement here](http://www.ponicode.com/blog/circleci-completes-acquisition-of-ponicode) 

<p align="center">
<img src="https://ponicodefilesstorage.blob.core.windows.net/githubaction/Couv_readme-Ponicode-Unit-Testing_GA.png">

# 🦄 Automatically writes unit tests for your project🦄
**Ponicode Unit Test GitHub Action** is an action that automatically raises your testing coverage by generating the Unit-Tests of your files in all you Pull-Requests!

**Ponicode Unit Test GitHub Action** is the newest tool on the Ponicode platform to accelerate developers on their code quality journey

**Combined with [Ponicode SQUAR Action](https://github.com/marketplace/actions/ponicode-squar)**, you can generate Unit-tests on files that require it based on Ponicode SQUAR report that identifies the most critical part of your code that should be tested. 

# 💥 Benefits

- __RAISE YOUR CODE QUALITY FAST__ - Accelerate the remediation of your code quality weaknesses on your high risk functions
- __FIND YOUR PRIORITIES__ - Prioritize your code quality efforts by combining Ponicode Unit Test action together with [Ponicode SQUAR Action](https://github.com/marketplace/actions/ponicode-squar)


# 🔎 How does it work
- Ponicode Unit Test GitHub Action enables you to accelerate your coverage catch-up by generating missing unit tests, test cases and edge cases on your PR files.

# 😳 Why should I use this GitHub Action
- Keep your codebase at a high test coverage
- Reduce the chances of facing bugs in production

# ⚙️ How to setup this action

### If you didn't do before, init ponicode on your project:
```
npm install -g ponicode
ponicode init
```
In case you develop in a language that is supported by Ponicode TurboCov Dashboard, those commands will create a ```ponicode.config.json```. This file has to be indexed in your git repo. It permits you to have all your code quality insights available in your TurboCov Dashboard [here](https://app.ponicode.com/turbo-cov/projects/)

### If it does not exist, create a yaml workflow file in your project

Add the following lines to any of your Github Action workflow.

Go to the root of your project, and create the path to your workflow file. For example
```
mkdir -p .github/workflows
```
You can also just create a folder named ``.github``, in it create another folder named ``workflows``. You can now create a YAML file named **``ponicode.yml``** and copy one of the following example in it! <br />

### Existing workflow
Here is what you must add in your ```.github/workflows/ponicode.yml``` file to activate and use Ponicode Unit-Testing Action  to trigger the action.

```yaml
jobs:
  ponicode:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - run: |
        npm install -g ponicode
        npm i --save-dev rewire @types/rewire jest@26 ts-jest@26 @types/jest
    
    # Identify which files are impacted by the Push / PR
    - id: get_changed_files
      uses: jitterbit/get-changed-files@v1
      continue-on-error: true
      with:
        format: 'json'

    # Extract branch name
    - id: extract_branch
      if: github.event_name == 'pull_request'
      run: echo "::set-output name=BRANCH_NAME::$(echo ${GITHUB_HEAD_REF})"
    
    # Run Ponicode Unit Test Action
    - uses: ponicode/unit-testing-action@master
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeUtToken: ${{ secrets.PONICODE_TOKEN }} # DO NOT MODIFY
        impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY IF YOU WANT TO GENERATE TESTS ON PR IMPACTED FILES ONLY
        commentUTs: "false"
```
### Once configured, this workflow:

1. bootstraps the unit-tests for the functions included in the PR into a dedicated new PR
![Unit-tests generation workflow](https://ponicodefilesstorage.blob.core.windows.net/githubaction/gif_UT.gif)

**Optionally**, combined with [Ponicode SQUAR Action](https://github.com/marketplace/actions/ponicode-squar), it gives the following workflow (See Use-Cases section hereafter for more details)
![SQUAR + Unit-test generation workflow](https://ponicodefilesstorage.blob.core.windows.net/githubaction/ezgif.com-gif-maker.gif)


### Ponicode Unit Test Action parameters
| Name | Description | Required | Default |
|------|-------------|----------|---------|
| ``ponicodeUtToken`` | This parameter has to be configured as **``PONICODE_TOKEN``** in Repository Github Secrets. The token can be retrieved on [Ponicode UT Generation App](https://app.ponicode.com/home). | Yes if ``bootstrapUT`` is set to ``true``, No if not | No default. This parameter has to be set-up in your GITHUB SECRETS (see below on how to do that) |
| ``impactedFiles`` | Indicate on which files, Unit-Tests have to be generated | Yes | Default value is the output of ``get-changed-files`` step. When Combined with [Ponicode SQUAR Action](https://github.com/marketplace/actions/ponicode-squar), the parameter is ``${{ steps.ponicode_squar.outputs.impacted_files }}`` |
| ``commentUTs`` | Set to ``"true"`` to comment the genrated Unit-Tests, ``"false"`` if not. | Yes | Set to ``"false"`` by default. | 
| ``githubToken`` | **Required if Ponicode SQUAR is activated** This parameter has to be configured as **``GITHUB_TOKEN``** in Repository Github Secrets. The token can be retrieved on [Ponicode SQUAR App](https://squar.ponicode.com/token). | Required if you want SQUAR analysis to be activated | No default. This parameter has to be set-up in your GITHUB SECRETS (see below on how to do that) |

**NB: all the other parameters must be let un-changed, since they are automatically filled-in from previous steps in the workflow**
- ``repoURL``
- ``branch``
- ``githubToken``

**NB2: you can find the procedure on how to setup Github Secrets here**: [Github Secrets setup](https://docs.github.com/en/actions/security-guides/encrypted-secrets). Here is an overview:
To add the Ponicode token to your github secrets follow these steps:

- Open your project on Github
- Click on Settings
- Click on Secrets
- Click on New Secret
- Name: PONICODE_TOKEN, Value: (Paste the token you got previously)

# 👩‍💻 Use-Cases
Here are some examples of ```.github/workflows/ponicode.yml``` file to setup Ponicode Unit Test Action
#### 1. Raises Tests Quality alerts and bootstrap remediation Unit-Tests on each created / updated PR. Also includes Ponicode SQUAR report for the whole project.
```yaml
name: "ponicode-ci"
on:
  pull_request:
    types: [ opened, edited, synchronize ]  # rebuild any PRs and main branch changes

jobs:
  ponicode:
    runs-on: ubuntu-latest
    env:
      SQUAR_API_URL: "https://ponicode-glados-prod.azurewebsites.net"
      FETCH_REPORT_RETRY_MILLISEC: 5000
    steps:
    - uses: actions/checkout@v1
    - run: |
        npm install -g ponicode
        npm i --save-dev rewire @types/rewire jest@26 ts-jest@26 @types/jest
    
    # Identify which files are impacted by the Push / PR
    - id: get_changed_files
      uses: jitterbit/get-changed-files@v1
      continue-on-error: true
      with:
        format: 'json'

    # Extract branch name
    - id: extract_branch
      if: github.event_name == 'pull_request'
      run: echo "::set-output name=BRANCH_NAME::$(echo ${GITHUB_HEAD_REF})"
    
    # Run Ponicode SQUAR action
    - uses: ponicode/squar_action@master
      id: ponicode_squar
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }} # DO NOT MODIFY
        displayFullReport: 'true'

    # Run Ponicode Unit-Testing Action
    - uses: ponicode/unit-testing-action@master
      id: ponicode_unit_testing
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeUtToken: ${{ secrets.PONICODE_TOKEN }} # DO NOT MODIFY
        impactedFiles: ${{ steps.ponicode_squar.outputs.impacted_files }} # DO NOT MODIFY IF YOU WANT TO GENERATE TESTS ON SQUAR OUTCOME ONLY
        commentUTs: "true"
```
##### Gihub Action parameters
| Name | Description | Required | Default |
|------|-------------|----------|---------|
| ``ponicodeUtToken`` | This parameter has to be configured as **``PONICODE_TOKEN``** in Repository Github Secrets. The token can be retrieved on [Ponicode UT Generation App](https://app.ponicode.com/home). | Yes if ``bootstrapUT`` is set to ``true``, No if not | No default. This parameter has to be set-up in your GITHUB SECRETS (see below on how to do that) |
| ``githubToken`` | This parameter has to be configured as **``GITHUB_TOKEN``** in Repository Github Secrets. The token can be retrieved on [Ponicode SQUAR App](https://squar.ponicode.com/token). | Required if you want SQUAR analysis to be activated | No default. This parameter has to be set-up in your GITHUB SECRETS (see below on how to do that) |
| ``impactedFiles`` | Indicate on which files, Unit-Tests have to be generated | Yes | Default value is the output of ``get-changed-files`` step. When Combined with [Ponicode SQUAR Action](https://github.com/marketplace/actions/ponicode-squar), the parameter is ``${{ steps.ponicode_squar.outputs.impacted_files }}`` |
| ``commentUTs`` | Set to ``"true"`` to comment the genrated Unit-Tests, ``"false"`` if not. | Yes | Set to ``"false"`` by default. | 

**NB: all the other parameters must be let un-changed, since they are automatically filled-in from previous steps in the workflow**
- ``repoURL``
- ``branch``
- ``githubToken``

**NB2: you can find the procedure on how to setup Github Secrets here**: [Github Secrets setup](https://docs.github.com/en/actions/security-guides/
#### 2. Generate non-commented Unit-Tests for all files impacted in your PR
```yaml
name: "ponicode-ci"
on:
  pull_request:
    types: [ opened, edited, synchronize ]  # rebuild any PRs and main branch changes

jobs:
  ponicode:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - run: |
        npm install -g ponicode
        npm i --save-dev rewire @types/rewire jest@26 ts-jest@26 @types/jest
    
    # Identify which files are impacted by the Push / PR
    - id: get_changed_files
      uses: jitterbit/get-changed-files@v1
      continue-on-error: true
      with:
        format: 'json'

    # Extract branch name
    - id: extract_branch
      if: github.event_name == 'pull_request'
      run: echo "::set-output name=BRANCH_NAME::$(echo ${GITHUB_HEAD_REF})"
    
    # Run Ponicode Unit-Testing Action
    - uses: ponicode/unit-testing-action@master
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeUtToken: ${{ secrets.PONICODE_TOKEN }} # DO NOT MODIFY
        impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY IF YOU WANT TO GENERATE TESTS ON SQUAR OUTCOME ONLY
        commentUTs: "false"
```
##### GitHub Action parameters
| Name | Description | Required | Default |
|------|-------------|----------|---------|
| ``ponicodeUtToken`` | This parameter has to be configured as **``PONICODE_TOKEN``** in Repository Github Secrets. The token can be retrieved on [Ponicode UT Generation App](https://app.ponicode.com/home). | Yes if ``bootstrapUT`` is set to ``true``, No if not | No default. This parameter has to be set-up in your GITHUB SECRETS (see below on how to do that) |
| ``impactedFiles`` | Indicate on which files, Unit-Tests have to be generated | Yes | Default value is the output of ``get-changed-files`` step. When Combined with [Ponicode SQUAR Action](https://github.com/marketplace/actions/ponicode-squar), the parameter is ``${{ steps.ponicode_squar.outputs.impacted_files }}`` |
| ``commentUTs`` | Set to ``"true"`` to comment the genrated Unit-Tests, ``"false"`` if not. | Yes | Set to ``"false"`` by default. | 

**NB: all the other parameters must be let un-changed, since they are automatically filled-in from previous steps in the workflow**
- ``repoURL``
- ``branch``
- ``githubToken``

**NB2: you can find the procedure on how to setup Github Secrets here**: [Github Secrets setup](https://docs.github.com/en/actions/security-guides/

# 🧐 Examples of SQUAR reporting in Pull-Requests
When combining [Ponicode SQUAR Action](https://github.com/marketplace/actions/ponicode-squar) together with Ponicode Unit Test Action in your workflow, you get immediate feedbacks on the quality of your tests for the files impacted by the PR:
### List of Testing Quality alerts on files impacted by a PR
![Ponicode SQUAR for Delta](https://ponicodefilesstorage.blob.core.windows.net/githubaction/SQUAR_ACTION_on_delta.png)
### Ponicode SQUAR report on the whole project
With [Ponicode SQUAR Action](https://github.com/marketplace/actions/ponicode-squar), you can also have exhaustive report on the quality of your tests for the whole project:
![Ponicode SQUAR Full](https://ponicodefilesstorage.blob.core.windows.net/githubaction/SQUAR_ACTION_full_report.png)

# 🤔 What is a critical piece of code ? 
Ponicode research and development work enables us to fine tune a proprietary formula to spot the most important functions of your codebase. This formula is based on how much of an impact the function has on the overall behavior of your application. This translates into getting a better visibility over how likely a weakness in a function could generate an impactful bug for your software. Still unsure about what makes a high risk function? Here’s 2 weighted elements we put into our equation.
- __Complexity to Repair__: Measure of how difficult a function is to intuitively understand and modify. This measure is between 0 and 1
- __Impact of a function on the code-base__: Measure of how much the function is used in the project. This measure is between 0 and 1

**This technology is implemented in [Ponicode SQUAR Action](https://github.com/marketplace/actions/ponicode-squar)**


# ⽭ Supported languages and frameworks
| Language | Test Framework |
|------|-------------|
| TypeScript | [Jest](https://jestjs.io/) |
| Javascript | [Jest](https://jestjs.io/) |


# 📄 Terms of use
By using this action, you will have to register on the [Ponicode platform](https://app.ponicode.com). The terms & conditions of both apply when using this Github Action.

**Highlights to our Terms & Conditions**
- Ponicode does not store your code
- Ponicode use anonymous usage data to improve your experience 

# Bug and feature Request
Have a bug or a feature request? Please open a new [issue](https://github.com/ponicode/unit-testing-action/issues) or reach out to us on the Ponicode Slack community https://ponicode-community.slack.com/join/shared_invite/zt-fiq4fhkg-DE~a_FkJ7xtiZxW7efyA4Q#/ using the channel #help or #feedback starting your message with “Ponicode Unit Test GitHub Action”

We would love to have your feedback! Tell us what you love and what you want us to improve about this action!

# 👯‍♀️ Community
Our slack community is a place where people not only give feedback and get support but also an opportunity to share information and best practices about code quality. It’s also where you will get premium access to our new products and first hand information about our latest releases. Join us here: https://ponicode-community.slack.com/join/shared_invite/zt-fiq4fhkg-DE~a_FkJ7xtiZxW7efyA4Q#/


# Learn More
Want to find out more about our project? All our solutions are available on [ponicode.com](https://ponicode.com)

You can generate a [Ponicode SQUAR](https://squar.ponicode.com) report for any of your GitHub repositories straight from our platform. Get started on [Ponicode SQUAR Self Assessment](https://www.ponicode.com/squar-self-assessment)

We also offer a unique [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ponicode.ponicode) to accelerate your unit testing efforts. 

Our AI-powered unit testing bulk generation is also available in the command line interface. Go discover our [npm package](https://www.npmjs.com/package/ponicode) today! 

We also have a [docstring generating GitHub Action](https://github.com/marketplace/actions/ponicode-dogstring-automatic-ai-based-docstring-generation) for Python 
