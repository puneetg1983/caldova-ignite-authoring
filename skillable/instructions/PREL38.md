<!--
UNPUBLISHED AUTHORING DRAFT - PREL38, profile 224911, instruction set 359549.
Original instructions and media: backups/2026-10-24/PREL38/.
Modernization and ARM/Azure Copilot owners must review their pages before publication.
Setup screenshots were captured in PREL38; remaining placeholders are intentional.
Publish manually through the running lab's Edit Instructions > Code editor.
Do not enable GitHub sync or change Resources, themes, infrastructure or permissions.
-->

# Start

**PREL38 - Pre-Ignite-Day Lab: Operating Caldova Retail Ops with Azure SRE Agent**

**SRE lab duration: 45 minutes.** No new per-exercise time estimates are assigned.

> [!Note] Need help? See **Additional guidance** at the end, grouped by section, or ask the facilitator.

## 1. Sign in to the lab VM

1. Select the lab VM: @lab.VirtualMachine(Win11-Pro-Base).SelectLink.
2. If Windows shows a lock screen, select @lab.CtrlAltDelete.
3. Click the username field **inside the VM**, then click the VM username below.
4. Click the password field **inside the VM**, then click the VM password below.
5. Complete Windows sign-in and open a browser **inside the VM**.

| Field | Click to type into the focused VM field |
| --- | --- |
| VM username | +++@lab.VirtualMachine(Win11-Pro-Base).Username+++ |
| VM password | +++@lab.VirtualMachine(Win11-Pro-Base).Password+++ |

**Screenshot placeholder START-01: Windows sign-in and the focused destination field. Do not show passwords or TAP values.**

## 2. Azure SRE Agent

With Windows signed in and the lab VM selected, use:

@[Open Azure SRE Agent in the VM](`Start-Process 'https://sre.azure.com'`){PowerShell}

1. Select **Sign in** on the SRE Agent page.
2. Use the **same Azure account and sign-in method shown in Resources > Azure Portal**, not the VM account.
3. Focus the username field in the VM, then click the Azure username below.
4. If password sign-in is requested, focus its password field, then click the Azure password below.

| Field | Click to type into the focused VM field |
| --- | --- |
| Azure username | +++@lab.CloudPortalCredential(User1).Username+++ |
| Azure password | +++@lab.CloudPortalCredential(User1).Password+++ |

5. Select your assigned agent, named `caldova-sreagent-<suffix>`. The suffix is generated for your lab; use the actual full name shown.
6. Reuse this agent throughout the lab. Do not create another agent.

After sign-in, keep the **context wizard** open. Review configuration and connect the imported repository before selecting **Done and go to agent**.

**Screenshot placeholder START-02: SRE Agent Sign in, Azure sign-in field focus, and the assigned agent selection. Hide account-specific information and all credentials.**

## 3. Azure Portal

Keep the existing **Resources > Azure Portal** card and its username, password, and TAP controls unchanged. To open the portal inside the VM, use:

@[Open Azure Portal in the VM](`Start-Process 'https://portal.azure.com/#home'`){PowerShell}

1. Sign in using the credentials in **Resources > Azure Portal**, with the VM destination field focused before clicking each value.
2. Confirm you are using the lab account and subscription, not a personal account.

**Screenshot placeholder START-03: Azure Portal inside the VM and selection of the assigned lab subscription; hide credentials.**

## Existing shared setup: GitHub and Copilot

The following shared sign-in steps are retained from PREL38. Open all pages inside the VM and complete them before the modules that use GitHub Copilot.

1. Navigate at +++https://github.com/enterprises/skillable-events/sso+++ and login with the same Azure credentials
2. Keep login page from SSO portal above open in browser, open VS Code
3. Click "Signin" in VSCode GitHub Copilot and select "Continue with Github login"
4. authenticate profile through SSO portal and GHE is now active in their VS Code instance

**Screenshot placeholder START-04: Lab GitHub enterprise SSO and VS Code's Continue with GitHub option, without credentials.**

Select **Next** to continue to Modernization.

===

# Modernization

> [!Alert] Authoring placeholder: no approved Modernization exercise is present in the exported PREL38 instructions. The Modernization owner must supply or confirm this page before publication. Do not overwrite another team's newer live content with this placeholder.

Use the same VM and lab credentials from Start.

Select **Next** to continue to ARM/Azure Copilot.

===

# ARM/Azure Copilot

## Existing shared setup: Install the ARM MCP server

These existing PREL38 instructions are retained for their owning team to review:

1. In edge, navigate to +++https://aka.ms/JoinARMMCP+++, this will open up VSCode
2. Click "Install"
3. You will get automatically prompted to authenticate, do so with the same Azure credentials used previous!

Now you can use the VSCode GitHub Copilot chat to ask any questions about your Azure environment!

**Screenshot placeholder ARM-01: ARM MCP installation and authentication in the VM, without credentials.**

ARM MCP section STEVEN TODO

> [!Alert] Authoring placeholder: the existing ARM MCP placeholder above has no exercise body. The ARM/Azure Copilot owner must provide the approved exercises and screenshot callouts before publication. No deployment or permission changes are introduced by this draft.

Select **Next** to continue to SRE Agent, the final module.

===

# SRE Agent

## Welcome to Caldova operations

Act as the on-call engineer for Caldova Retail Co., a storefront and operations app running on Azure App Service. Review the environment, approve a reversible configuration change, investigate a customer-visible search failure, and verify the fix without a code deployment.

Use the assigned `caldova-sreagent-<suffix>` selected on Start. The Web App, resource group, and telemetry resources may also have generated suffixes. Whenever this guide says **Caldova Web App**, use the full actual name in your lab; do not type `<suffix>` or assume a fixed example name.

## What you will accomplish

1. Start a GitHub import in the background.
2. Review the existing configuration in the sign-in context wizard: subscription, resource group, Log Analytics, and Application Insights, without changing their access scope.
3. Connect the completed imported repository to the agent.
4. Review the environment and health findings in the Getting started thread for at most **5 minutes**.
5. Review and approve a reversible App Service health-check configuration change.
6. Reproduce the product-search failure, investigate its configuration cause, approve a precise fix, and verify search recovery.
7. Create and run a recurring, read-only cost audit.
8. Build and check a reusable live traffic-and-health report.

## Start the GitHub import in the background

1. In the VM browser, complete the **GitHub and Copilot** sign-in steps on Start using the lab account.
2. Focus the browser address bar inside the VM, click +++https://github.com/new/import+++, then press **Enter inside the VM**.
3. In **The URL for your source repository\***, enter:

+++https://github.com/puneetg1983/caldova-ignite-authoring.git+++

4. Under **Owner**, select the lab GitHub account. Set **Repository Name** to `caldova-ignite-authoring` and visibility to **Private**.
5. Select **Begin import**, leave the status tab open, and return to the SRE Agent's context wizard for the configuration review **without waiting**.

**Screenshot placeholder SRE-01: GitHub Importer with the exact source-repository label, lab owner, repository name, and Private visibility.**

## Review Azure resources and telemetry before connecting GitHub

After sign-in, you should see the **context wizard**. If not, follow **Additional guidance > Review Azure resources and telemetry** at the end to open it.

Review only in the **context wizard**. GitHub is **not connected yet**. You will connect the imported repository later in this section.

1. Click **Full setup**.
2. Under **Azure resources**, click **Show details**. In **Resource group scope**, review the **Resource group** and **Subscription**. **Do not change these settings.**
3. Under **Logs**, click **Show details**. Confirm **Application Insights** and **Log Analytics** both show **Connected**.

**Screenshot SRE-02: Azure resource details; subscription value redacted.**

![Azure resources expanded to show Resource group scope](images/context-wizard/azure-resource-scope.png)

**Screenshot SRE-03: Both log providers connected.**

![Logs details with Application Insights and Log Analytics Connected](images/context-wizard/logs-connected.png)

## Connect the imported repository

1. Confirm the GitHub import is complete and its source files are visible. Copy the imported repository's URL, not the original source URL.
2. In the **same context wizard**, under **Code**, click **+**. Select **GitHub** and paste your URL into **Repository URL**.
3. Scroll to **Connection method**. Keep **OAuth**, then click **Sign in to GitHub**. Confirm the **lab GitHub account**, review access, and click **Authorize Azure-SRE-Agent**. When **Connected to GitHub** appears, click **Next**.
4. Under **Add repositories**, confirm your imported repository's URL, then click **Save**.
5. Under **Code**, click **Show details** and confirm the imported repository appears. Confirm the repository connection is ready before source-code debugging.

**Screenshot SRE-04: OAuth controls and saved repository; URL redacted.**

![OAuth connection method and Sign in to GitHub](images/context-wizard/github-oauth.png)

![Code details with one saved repository](images/context-wizard/repository-saved.png)

## Review the Getting started thread - maximum 5 minutes

1. In the context wizard, select **Done and go to agent**. The **Getting started** thread opens.
2. Read its environment summary and the Web App's health and configuration findings.
3. Reply as Caldova's on-call engineer and ask a follow-up if useful. Keep it read-only; do not enter personal or confidential information.
4. At **5 minutes**, or while the agent is processing, continue to **Update Web App configuration**. Return later to read its response.

**Screenshot placeholder SRE-05: Done and go to agent and the Getting started thread's environment and health findings.**

## Update Web App configuration

1. In the same Getting started thread, if its findings identified a missing health-check path, send:

```text
For the Caldova Web App identified in this conversation, configure the App Service Health check path to /api/health. First show the current state, proposed change, exact command, and rollback. Keep Review mode and wait for my approval before applying the change.
```

2. Review the exact target, command, impact, and rollback. The Health check path is an App Service configuration property, not a new application setting.
3. Select **Approve action** only for the intended lab Web App change.
4. Confirm completion and ask the agent to read back the configured path.

**Screenshot placeholder SRE-06: Health-check proposal, exact command, rollback, approval, and verified resulting path.**

## Debug a scenario

### See the problem

1. In Azure Portal inside the VM, open the assigned Web App's **Overview** and its **Default domain** in the VM browser.
2. Select **Catalog**. Confirm the paginated product catalog loads.
3. In **Search by product name**, enter `jacket` and select **Search**.
4. Confirm the customer symptom: **500 - Search failed**, while catalog browsing still works.

**Screenshot placeholder SRE-07: Product-search HTTP 500 alongside the working catalog table.**

### Debug it with the agent

1. Confirm both the **import** and **repository connection** are ready, with source files visible in the imported repository.
2. Start a new chat and describe only the symptom:

```text
Users report that searching the product catalog on the Caldova Web App assigned to this lab fails with HTTP 500, while browsing the catalog works. Investigate the root cause using request evidence, current configuration, and the connected repository. Cite the affected source code. Do not change anything yet.
```

3. Review how the agent separates the symptom from the cause, cites `Catalog__AsOfDate` and the relevant source, and ranks mitigation options.
4. If evidence confirms a future date is responsible, request a precise correction rather than deleting the setting:

```text
Instead of deleting Catalog__AsOfDate, propose updating its value to today's correct date in the format and time basis expected by the application. Show the current value, exact change, and rollback. Keep Review mode and wait for approval.
```

5. Review the proposed command. It must update `Catalog__AsOfDate` on the assigned Web App, not delete it or change unrelated settings.
6. Select **Approve action**, confirm completion, then repeat the same `jacket` search in the VM browser.
7. Confirm results appear instead of the error and catalog browsing still works. Do not claim recovery from the agent's summary alone.

**Screenshot placeholder SRE-08: Evidence-backed root cause, precise date-setting update and rollback, approval, and successful repeat search.**

## Scheduled tasks: read-only weekly cost audit

1. In SRE Agent, select **Scheduled tasks** in the sidebar, then **Create task**.
2. Name it **Weekly Cloud Cost Audit (Caldova deck)**.
3. In the task details, enter:

```text
Run a weekly, read-only Cloud Cost Audit for the Azure resources this agent manages. Discover the actual lab subscription and resource group; do not assume names. Use billed cost data where available. Otherwise estimate from inventory and clearly label estimates. Compare this week with last week, identify top cost drivers and idle, oversized, or orphaned resources, and rate findings SEV1-SEV3 by cost impact with recommendations and rough monthly savings. Post a short summary and a downloadable PowerPoint deck. Change no Azure resources or permissions, do not use agent memory, and state data sources and limitations. Use 16:9 slides with a navy #1F3A5F header, CALDOVA wordmark, teal #00A39A accents, red/amber/slate severity colors, one idea per slide, and consistent headers and footers. Prefer charts over tables over text.
```

4. Set **Frequency** to **Weekly**, choose a day/time, and review the displayed time zone. Keep the task in **Review** mode.
5. Select **Create task** and confirm it appears with the intended schedule.
6. Select the task and **Run now**, then open the execution thread.
7. While it runs, review other independent work. Return to inspect data sources, cost-impact findings, recommendations, and the generated deck.

**Screenshot placeholder SRE-09: Task creation, Weekly schedule, Review mode, and Run now.**

**Screenshot placeholder SRE-10: Completed cost-audit thread and downloadable Caldova-branded deck, with data-source limitations.**

## Live reports: traffic and health

1. Return to **Builder > Connectors** and confirm a healthy Application Insights or Log Analytics connector for the Web App.
2. Confirm the Web App itself emits telemetry.
3. Select **Live Reports > + New report**.
4. Enter:

```text
Build a read-only live report called "Caldova Web App Traffic & Health" using the connected telemetry source for the actual Web App assigned to this lab. Use the last 24 hours. Include request count, failure rate, average response time, a traffic trend chart, the top 10 requested URLs, top failing URLs with status codes, and country/region breakdown if the source contains that data. Retrieve current data when opened or reloaded. Identify the resource and source, label missing data, and add no write actions or permissions.
```

5. Review the exact connector, resource, tools, and requested permissions. Approve only the expected read-only calls; use **Allow once** if that is the offered action. Do not broaden permissions.
6. Confirm the report saves to the gallery, then open it and inspect the health tiles, charts, URL tables, and available location data.
7. Select **Reload** to retrieve fresh data.

**Screenshot placeholder SRE-11: Live Reports creation, connector/tool review, and saved report tile.**

**Screenshot placeholder SRE-12: Health summary and traffic chart.**

**Screenshot placeholder SRE-13: Requested/failing URL tables and country/region results or an explicit missing-data message.**

## Complete

Review the pattern you practiced: connected operational context, evidence-based investigation, a reversible change with human approval, and customer-visible verification. Confirm which objectives you completed, and record any blocked import, connection, task, or report instead of claiming it succeeded.

Keep the lab's existing cleanup policy. Do not delete shared resources, change role assignments, commit VM changes, or reset the lab as part of editing these instructions.

## Additional guidance

### Start: VM sign-in

Click-to-type sends text to the current cursor position in the selected VM. Open the destination screen and focus its field first, then click the matching value in Instructions or Resources. VM credentials and Azure credentials are different.

### Start: Azure SRE Agent

- **Browser did not open?** Focus the address bar **inside the VM**, click +++https://sre.azure.com+++, then press **Enter inside the VM**. Do not use an external Resources link that opens on your own computer.
- **TAP requested?** For **Temporary Access Pass (TAP)** sign-in, focus the TAP field inside the VM, open **Resources > Azure Portal**, and click its existing **TAP** control. Return to Instructions afterward. Do not substitute a TAP into an unrelated password field.

### Start: Azure Portal

- **Browser did not open?** Focus the address bar **inside the VM**, click +++https://portal.azure.com/#home+++, then press **Enter inside the VM**.
- The open-in-VM commands require working VM Integration Services. If a command fails, use the Type Text fallback. If Type Text also fails, type the URL manually inside the VM and notify the facilitator. Do not change VM settings or permissions to work around a failure.

### Start: GitHub and Copilot

If enterprise sign-in or account provisioning is blocked, notify the facilitator. Do not substitute a personal GitHub account or change access policies.

### Background activities

Agent responses, repository imports, and other background activities can take time. Continue independent exercises while processing runs. Return before a later step that requires the result. Do not start a second copy of the same operation.

### Review Azure resources and telemetry

**Wizard not open?** In the agent's Operations Hub, open **Overview > Complete setup**, if available.

**Empty broader scopes?** Leave management-group and subscription scopes unchanged. Review the existing **Resource group scope** only; do not add broader access.

### Connect the imported repository

- **Import still running?** Continue independent exercises and return to connect the repository before debugging.
- **Repository already connected?** Keep it and do not add a duplicate.
- **Organization access requested?** Leave the organization **Request** buttons untouched; this exercise uses the private repository under your lab account.
- **Status shows a dash?** A saved repository is not proof that indexing or source-code retrieval has finished. Confirm the agent can retrieve source files before debugging; ask the facilitator if it cannot.
- **Sign-in or connection failed?** Notify the facilitator; do not use a personal account.

### Review the Getting started thread

**Thread not open?** Under **Favorites**, select **Team onboarding**. If absent, use **Search Threads**, search `get to know`, and open the greeting for your lab user.

### Update Web App configuration

If the health-check path is already configured, verify it rather than repeating the change. If the agent reports failure, inspect the error rather than treating it as success.

### Debug a scenario

If search already succeeds, record that state and ask the facilitator; do not deliberately break a shared environment.

### Scheduled tasks: read-only weekly cost audit

- **Different labels?** Some lab versions use **Automation > New task**; use the equivalent task list, not incident triggers.
- **Autonomous default?** Keep **Review** mode rather than accepting that default to complete the form.
- **Run now absent?** Ask the facilitator for the supported immediate-run path; do not create duplicate tasks.
- **Data or deck unavailable?** Record the limitation. Estimates are not actual billing, and a missing artifact is not a completed deck.

### Live reports: traffic and health

- **Connector missing?** Ask the facilitator for the approved setup; do not invent a connector wizard or grant roles.
- A connected agent connector does not prove application instrumentation is configured.
- **Data delayed or empty?** Generate normal browsing/search traffic, return after other activities, and inspect the source/time range before concluding the Web App is healthy.
- Treat unavailable geographic data or failed queries as limitations, not zero failures. Record any connector or query error for the facilitator.
