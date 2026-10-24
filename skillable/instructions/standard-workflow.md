<!--
SHARED SETUP REFERENCE ONLY: use PREL38.md or LAB720.md for the full working guides.
AUTHORING DRAFT: Preview on test profile 226994 before event publication.
The Modernization and ARM/Azure Copilot teams must supply their exercises.
This source does not replace the complete PREL38 or LAB720 SRE manual.
Keep native Resources, profile durations, cloud configuration and VM profiles unchanged.
-->

# Start

> [!Note] Agent responses, repository imports, and other background activities can take time. Continue with independent exercises instead of waiting for processing to finish. Return before a later step that requires the result.

## 1. Sign in to the lab VM

1. Select the lab VM: @lab.VirtualMachine(Win11-Pro-Base).SelectLink.
2. If Windows shows a lock screen, select @lab.CtrlAltDelete.
3. Click the Windows username field **inside the VM**, then click the username below. Click the password field inside the VM, then click the password below.

| Field | Click to type into the focused VM field |
| --- | --- |
| VM username | +++@lab.VirtualMachine(Win11-Pro-Base).Username+++ |
| VM password | +++@lab.VirtualMachine(Win11-Pro-Base).Password+++ |

4. Complete Windows sign-in and open a browser **inside the VM**.

> [!Note] Click-to-type controls send text to the current cursor position in the selected VM. Open the browser or sign-in screen first, then focus the destination field before clicking a value here or in Resources. VM credentials and Azure credentials are different.

## 2. Azure SRE Agent

With the lab VM selected and Windows signed in, use this native VM command:

@[Open Azure SRE Agent in the VM](`Start-Process 'https://sre.azure.com'`){PowerShell}

If the browser does not open, use the browser already running **inside the VM**: focus its address bar, click +++https://sre.azure.com+++, then press **Enter inside the VM**. Do not paste the URL into your own computer's browser.

1. Select **Sign in** on the SRE Agent page.
2. Use the **same Azure account and sign-in method shown in Resources > Azure Portal**, not the VM account.
3. Focus the username field in the VM before clicking the username below. If password sign-in is requested, focus its password field before clicking the password.

| Field | Click to type into the focused VM field |
| --- | --- |
| Azure username | +++@lab.CloudPortalCredential(User1).Username+++ |
| Azure password | +++@lab.CloudPortalCredential(User1).Password+++ |

For **Temporary Access Pass (TAP)** sign-in, focus the TAP field inside the VM, open **Resources > Azure Portal**, and click its existing **TAP** control. Return to Instructions afterward. Do not enter the TAP in a password-only field unless the sign-in flow requests that method.

4. Select your assigned agent, named `caldova-sreagent-<suffix>`. Use the full name displayed in your lab; `<suffix>` represents a generated suffix, not text to type.
5. Reuse this selected agent throughout the lab. Do not create another agent.

**Screenshot placeholder: SRE Agent Sign in button and agent selection with an example generated suffix; hide all credentials.**

## 3. Azure Portal

Keep the existing **Resources > Azure Portal** card and its credentials unchanged. For this workflow, open the portal in the VM rather than using a link that opens on your own computer:

@[Open Azure Portal in the VM](`Start-Process 'https://portal.azure.com/#home'`){PowerShell}

If the command does not open the browser, focus the browser address bar **inside the VM**, click +++https://portal.azure.com/#home+++, then press **Enter inside the VM**.

Use the existing Azure Portal username, password, or TAP controls in **Resources** after focusing the appropriate field inside the VM. Select only the lab subscription and resource group.

> [!Note] The open-in-VM commands require working VM Integration Services. If a command fails, use the Type Text fallback above. If Type Text also fails, type the URL manually inside the VM and notify the facilitator; do not change VM or Azure permissions.

Use the lab's **Next** control to continue to Modernization.

===

# Modernization

> [!Alert] Authoring placeholder: the Modernization team's approved exercise has not been supplied for this draft. Insert that content here before learner publication; do not replace it with invented steps.

Keep the shared VM sign-in and Azure credentials from Start. Preserve the Modernization team's resource names, tasks, and prerequisites when their content is added.

Use **Next** to continue to ARM/Azure Copilot.

===

# ARM/Azure Copilot

> [!Alert] Authoring placeholder: the ARM/Azure Copilot team's approved exercise has not been supplied for this draft. Insert that content here before learner publication; do not replace it with invented steps.

Keep the existing lab environment and credentials. Preserve this team's approved deployment instructions; this navigation draft does not authorize template or permission changes.

Use **Next** to continue to SRE Agent.

===

# SRE Agent

Use the assigned `caldova-sreagent-<suffix>` selected on Start. Resource names can have generated suffixes throughout the lab. Always select the actual resource in your lab, not a literal example name.

## Start the GitHub import in the background

1. In the VM browser, sign in with the **lab GitHub account**, following the lab's GitHub sign-in instructions. Do not use your personal GitHub account.
2. Focus the browser address bar inside the VM, click +++https://github.com/new/import+++, then press **Enter inside the VM**.
3. In the field labelled **The URL for your source repository\***, enter:

+++https://github.com/puneetg1983/caldova-ignite-authoring.git+++

4. Set **Owner** to the lab GitHub account, use repository name `caldova-ignite-authoring`, and select **Private** visibility.
5. Select **Begin import**, leave its status tab open, and continue immediately. Do not wait here for the import to finish.

**Screenshot placeholder: GitHub importer source-repository field, owner, and visibility; hide account-specific information.**

## Interact with onboarding - maximum 5 minutes

1. Return to your selected SRE Agent in the VM.
2. If the onboarding conversation is open, read it. Otherwise, select **Team onboarding** under **Favorites**.
3. If it is not listed, select **Search Threads**, search for `get to know`, and open the greeting addressed to your lab user.
4. Review the environment summary and any missing connections. Reply as the on-call engineer for Caldova Retail Co.; do not enter personal or confidential information.
5. Keep the interaction read-only. At **5 minutes**, or while the agent is processing, continue to the configuration review below. Return later to read the response.

**Screenshot placeholder: Favorites, Team onboarding, Search Threads, and the read-only conversation.**

## Review Azure resources and telemetry before connecting GitHub

1. In the agent's Operations Hub, select **Overview**, then **Complete setup** if it is offered. Review the **Azure resources** card and its connected-scope summary.
2. Identify the lab subscription and the resource group containing the Caldova Web App. In Azure Portal, select that subscription and resource group to inspect their resources. Do not add or remove scopes or change role assignments.
3. In SRE Agent, open **Builder > Connectors**. Inspect any **Log Analytics** and **Application Insights** entries and their connection status.
4. If a telemetry connector is present, verify that it refers to the lab's actual workspace or Application Insights resource. Do not substitute the agent's own telemetry resource for the Web App's telemetry.
5. If a connector is missing, record that observation. Do not assume that telemetry is already connected: built-in Azure access and an explicitly configured telemetry connector are different. Follow the facilitator's approved setup before activities that require a connector.
6. If the documented navigation is not available in this lab's UI, ask the facilitator to confirm the current path rather than changing unrelated settings.

**Screenshot placeholder: Overview > Complete setup and the connected Azure subscription/resource group summary.**

**Screenshot placeholder: Builder > Connectors showing the lab's Log Analytics and Application Insights entries or their absence.**

## Connect the imported repository

GitHub is **not assumed to be connected** just because a repository import was started.

1. Return to the GitHub import tab and confirm the import completed. Open the imported repository and confirm its source files are visible.
2. If the import is not ready, continue independent read-only activities and check again later. Do not begin source-code debugging until the import and connection are ready.
3. In your selected agent, open **Builder > Knowledge base > Add repository**.
4. Review existing connections first. If your imported repository is already connected, keep that connection and do not add a duplicate.
5. Otherwise, choose **GitHub**, select the OAuth sign-in option, and select **Sign in to GitHub**. Use the lab GitHub account.
6. Confirm the connected account is the lab account, then select **Next**.
7. In **Repository URL**, select the imported `caldova-ignite-authoring` repository under your lab account. If needed, enter that imported repository's actual URL, not the original source repository URL.
8. Select **Add repository** to save the connection. Do not remove other repositories or create a personal access token unless the facilitator explicitly requires a different approved authentication method.
9. Ask the agent: "What does the Caldova repository I just connected do, and which services does it contain?" Review the repository/tool evidence, not only a generic answer.
10. If enterprise authorization or account provisioning blocks the connection, stop this setup step and notify the facilitator. Continue independent activities; do not use a personal account or weaken permissions.

**Screenshot placeholder: Builder > Knowledge base > Add repository, OAuth account confirmation, imported repository selection, and saved connection.**

## Continue the SRE exercise

Continue with the approved SRE exercise for your session: discovery, reviewing and approving a reversible Web App configuration change, debugging, and the scheduled-task/live-report activities appropriate to its time budget.

Before source-code debugging, confirm both the **import** and **repository connection** are ready. Before a live report, confirm its required telemetry connector is connected and the Web App emits telemetry.

Keep approval gates enabled. Review each proposed change and rollback before approving it, then verify the customer-visible behavior afterward.

<!--
AUTHOR: Merge the remaining approved SRE exercises from the relevant PREL38
or LAB720 manual here before publication. This shared setup draft deliberately
does not replace those exercises or change the profile's duration.
-->
