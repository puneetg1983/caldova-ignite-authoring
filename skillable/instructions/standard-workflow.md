<!--
SHARED SETUP REFERENCE ONLY: use PREL38.md or LAB720.md for the full working guides.
AUTHORING DRAFT: Preview on test profile 226994 before event publication.
The Modernization and ARM/Azure Copilot teams must supply their exercises.
This source does not replace the complete PREL38 or LAB720 SRE manual.
Keep native Resources, profile durations, cloud configuration and VM profiles unchanged.
-->

# Start

> [!Note] Need help? See **Additional guidance** at the end, grouped by section, or ask the facilitator.

## 1. Sign in to the lab VM

1. Select the lab VM: @lab.VirtualMachine(Win11-Pro-Base).SelectLink.
2. If Windows shows a lock screen, select @lab.CtrlAltDelete.
3. Click the Windows username field **inside the VM**, then click the username below. Click the password field inside the VM, then click the password below.

| Field | Click to type into the focused VM field |
| --- | --- |
| VM username | +++@lab.VirtualMachine(Win11-Pro-Base).Username+++ |
| VM password | +++@lab.VirtualMachine(Win11-Pro-Base).Password+++ |

4. Complete Windows sign-in and open a browser **inside the VM**.

## 2. Azure SRE Agent

With the lab VM selected and Windows signed in, use this native VM command:

@[Open Azure SRE Agent in the VM](`Start-Process 'https://sre.azure.com'`){PowerShell}

1. Select **Sign in** on the SRE Agent page.
2. Use the **same Azure account and sign-in method shown in Resources > Azure Portal**, not the VM account.
3. Focus the username field in the VM before clicking the username below. If password sign-in is requested, focus its password field before clicking the password.

| Field | Click to type into the focused VM field |
| --- | --- |
| Azure username | +++@lab.CloudPortalCredential(User1).Username+++ |
| Azure password | +++@lab.CloudPortalCredential(User1).Password+++ |

4. Select your assigned agent, named `caldova-sreagent-<suffix>`. Use the full name displayed in your lab; `<suffix>` represents a generated suffix, not text to type.
5. Reuse this selected agent throughout the lab. Do not create another agent.

After sign-in, keep the **context wizard** open. Review configuration and connect the imported repository before selecting **Done and go to agent**.

**Screenshot placeholder: SRE Agent Sign in button and agent selection with an example generated suffix; hide all credentials.**

## 3. Azure Portal

Keep the existing **Resources > Azure Portal** card and its credentials unchanged. For this workflow, open the portal in the VM rather than using a link that opens on your own computer:

@[Open Azure Portal in the VM](`Start-Process 'https://portal.azure.com/#home'`){PowerShell}

Use the existing Azure Portal username, password, or TAP controls in **Resources** after focusing the appropriate field inside the VM. Select only the lab subscription and resource group.

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
5. Select **Begin import**, leave its status tab open, and return to the SRE Agent context wizard for the configuration review. Do not wait here for the import to finish.

**Screenshot placeholder: GitHub importer source-repository field, owner, and visibility; hide account-specific information.**

## Review Azure resources and telemetry before connecting GitHub

Review only in the **context wizard**. GitHub is **not connected yet**. You will connect the imported repository later in this section.

1. Review the selected **subscription** and **resource group**.
2. Review the existing resource access modes. **Do not change these settings.**
3. Review the **Log Analytics** and **Application Insights** configuration.

**Screenshot placeholder: Context wizard showing the subscription, resource group, and access modes.**

**Screenshot placeholder: Context wizard showing Log Analytics and Application Insights configuration.**

## Connect the imported repository

1. Confirm the GitHub import is complete and its source files are visible.
2. In the **same context wizard**, use the GitHub repository connection to sign in with the **lab GitHub account**.
3. Select the imported repository under your lab account, not the original source repository, and save.
4. Confirm the repository connection is ready before source-code debugging.

**Screenshot placeholder: Context wizard showing the imported GitHub repository connection.**

## Review the Getting started thread - maximum 5 minutes

1. In the context wizard, select **Done and go to agent**. The **Getting started** thread opens.
2. Read its environment summary and the Web App's health and configuration findings.
3. Reply as Caldova's on-call engineer and ask a follow-up if useful. Keep it read-only; do not enter personal or confidential information.
4. At **5 minutes**, or while the agent is processing, continue with the SRE exercise below. Return later to read the response.

**Screenshot placeholder: Done and go to agent and the Getting started thread's environment and health findings.**

## Continue the SRE exercise

Continue with the approved SRE exercise for your session: reviewing and approving a reversible Web App configuration change, debugging, and the scheduled-task/live-report activities appropriate to its time budget. Use the findings already provided in the Getting started thread; do not repeat discovery in a new chat.

Before source-code debugging, confirm both the **import** and **repository connection** are ready. Before a live report, confirm its required telemetry connector is connected and the Web App emits telemetry.

Keep approval gates enabled. Review each proposed change and rollback before approving it, then verify the customer-visible behavior afterward.

<!--
AUTHOR: Merge the remaining approved SRE exercises from the relevant PREL38
or LAB720 manual here before publication. This shared setup draft deliberately
does not replace those exercises or change the profile's duration.
-->

## Additional guidance

### Start: VM sign-in

Click-to-type controls send text to the current cursor position in the selected VM. Open the destination screen and focus its field first, then click the matching value here or in Resources. VM credentials and Azure credentials are different.

### Start: Azure SRE Agent

- **Browser did not open?** Focus the address bar **inside the VM**, click +++https://sre.azure.com+++, then press **Enter inside the VM**. Do not paste the URL into your own computer's browser.
- **TAP requested?** For **Temporary Access Pass (TAP)** sign-in, focus the TAP field inside the VM, open **Resources > Azure Portal**, and click its existing **TAP** control. Return to Instructions afterward. Do not substitute a TAP into an unrelated password field.

### Start: Azure Portal

- **Browser did not open?** Focus the address bar **inside the VM**, click +++https://portal.azure.com/#home+++, then press **Enter inside the VM**.
- The open-in-VM commands require working VM Integration Services. If a command fails, use the Type Text fallback. If Type Text also fails, type the URL manually inside the VM and notify the facilitator; do not change VM or Azure permissions.

### Background activities

Agent responses, repository imports, and other background activities can take time. Continue independent exercises while processing runs. Return before a later step that requires the result. Do not start a second copy of the same operation.

### Review Azure resources and telemetry

**Wizard closed?** In the agent's Operations Hub, open **Overview > Complete setup**, if available.

### Connect the imported repository

- **Import still running?** Continue independent exercises and return to connect the repository before debugging.
- **Repository already connected?** Keep it and do not add a duplicate.
- **Sign-in or connection failed?** Notify the facilitator; do not use a personal account.

### Review the Getting started thread

**Thread not open?** Under **Favorites**, select **Team onboarding**. If absent, use **Search Threads**, search `get to know`, and open the greeting for your lab user.
