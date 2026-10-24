# PREL38 module 4: Build an automatic SRE response for Caldova

## Set up 

There a few things you will have to do before you get started with the lab.

**Login to Azure**

1. Navigate to https://portal.azure.com, login with the credentials in the "Resources" tab.


**Login to GitHub and Copilot**

1. Navigate at +++https://github.com/enterprises/skillable-events/sso+++ and login with the same Azure credentials

2. Keep login page from SSO portal above open in browser, open VS Code

3. Click "Signin" in VSCode GitHub Copilot and select "Continue with Github login"

!IMAGE[cfaawkpc.png](instructions359549/cfaawkpc.png)

4. authenticate profile through SSO portal and GHE is now active in their VS Code instance

**Install the ARM MCP server**

1. In edge, navigate to +++https://aka.ms/JoinARMMCP+++, this will open up VSCode
2. Click "Install" 
3. You will get automatically prompted to authenticate, do so with the same Azure credentials used previous!

Now you can use the VSCode GitHub Copilot chat to ask any questions about your Azure environment!

===

ARM MCP section STEVEN TODO

===

**Duration:** 50 minutes  
**Experience:** Configure Agent  
**Scenario:** Course recommendations are unavailable  
**Agent:** `sre-caldova-config-userN`

> [!IMPORTANT]
> Complete **exactly one scenario** in this module. Keep the default **Course recommendations are unavailable** scenario. The other packaged scenarios are four-hour-path or post-lab practice.

## Learning objectives

By the end of this module, you will:

1. investigate an isolated production symptom with Application Insights and Azure configuration evidence;
2. draft and apply a reusable diagnostic/remediation skill;
3. create and connect a symptom alert, custom agent, and incident response plan;
4. reset and retrigger the symptom to prove automatic diagnosis, permitted remediation, recovery, and closure.

## Timing

| Activity | Timebox |
|---|---:|
| Context and before-state | 5 minutes |
| Manual investigation | 8 minutes |
| Skill authoring | 7 minutes |
| Alert, custom agent, connector, and response plan | 15 minutes |
| Retrigger, verify, and cleanup | 15 minutes |

Azure Monitor evaluates the exercise alert every **5 minutes**. A fresh alert typically appears in **5-10 minutes**, the incident thread about **1-2 minutes later**, investigation and mitigation take **3-10 minutes**, and monitor resolution can take **5-20 minutes** after recovery.

While propagation is pending, continue the next configuration or evidence-review step. Return to the incident when it appears. Do not refresh repeatedly or start another scenario.

## Prepared environment

The learner environment is already provisioned. The public Caldova portal, Application Gateway, API health/readiness, courses, quizzes, PostgreSQL, and reporting are healthy.

The optional Course recommendations feature is intentionally unavailable. It is isolated from core readiness and customer-critical paths.

The Configure Agent starts with:

- Caldova context and Microsoft Learn;
- safe Application Insights and Azure CLI/ARM evidence access;
- a Getting started thread;
- no guided alert, skill, custom agent, response plan, or incident.

Direct Log Analytics queries from the SRE Agent runtime can return HTTP 403. Record that as unavailable evidence. Do not report it as a clean result. Use Application Insights, Azure CLI/ARM, metrics, and current configuration instead.

## Task 1: Review the before-state

1. Open `sre-caldova-config-userN`.
2. Open **Getting started: Caldova operations**.
3. Confirm the assigned resource group and Application Insights appId.
4. Open the Caldova portal and confirm:
   - core learning paths are healthy;
   - Course recommendations is degraded;
   - no core readiness check is red.
5. Confirm no guided alert, skill, custom agent, or response plan exists.

Live UI reference:

| View | Screenshot | What to verify |
|---|---|---|
| Prepared portal | IMAGE[Portal prepared state](instructions359549/01-portal-prepared-state.png) | Core learning is healthy; only Course recommendations is unavailable. |
| Configure onboarding | IMAGE[Configure Getting started](instructions359549/02-configure-onboarding-before.png) | Open the Configure Agent and its Getting started experience. |
| Build + setup | IMAGE[Starter setup surfaces](instructions359549/03-configure-build-setup-before.png) | Use **Build + setup** for skills, agents, connectors, tools, and monitoring. |
| Skills before | IMAGE[No guided custom skill](instructions359549/04-configure-no-guided-skill.png) | `course-recommendations-recovery` does not exist yet. |
| Agent Canvas before | IMAGE[No guided custom agent](instructions359549/05-configure-no-guided-agent.png) | `caldova-guided-feature-responder` does not exist yet. |
| Incidents before | IMAGE[No open Configure cases](instructions359549/07-configure-incidents-before.png) | No new or acknowledged alerts are open. |
| Response plans before | IMAGE[No guided response plan](instructions359549/08-configure-no-guided-plan.png) | `course-recommendations-learning-response` does not exist yet. |

## Task 2: Generate evidence and investigate manually

Start the simulator:

```powershell
pwsh -NoProfile -File scripts/start-simulator.ps1 -LearnerNumber N
```

1. Select **Configure**.
2. Keep **Course recommendations are unavailable**.
3. Select **Check configuration**.
4. Select **Start scenario** once.

The simulator generates deterministic evidence immediately. No alert or automatic incident is expected yet.

Ask:

> Investigate why course recommendations are unavailable. Prove that core learning remains healthy, map the request and Azure resource path, use Application Insights plus current Container Apps configuration, separate confirmed evidence from inference, and propose the smallest reversible remediation. Do not use Log Analytics or make changes yet.

Require:

- the degraded request evidence and UTC timestamp;
- healthy adjacent core paths;
- the API Container App revision and non-secret configuration setting;
- one smallest reversible remediation;
- rollback and post-fix checks.

Live UI reference:

| Step | Screenshot | Expected result |
|---|---|---|
| Symptom prompt | IMAGE[Manual investigation prompt](instructions359549/09-configure-symptom-prompt.png) | The prompt explicitly excludes Log Analytics and asks for Application Insights and configuration evidence. |
| Diagnosis | IMAGE[Evidence-backed root cause](instructions359549/10-configure-manual-investigation.png) | The agent identifies `CALDOVA_RECOMMENDATIONS_MODE=unavailable` on the API revision and proposes the reversible one-setting fix without applying it. |

The simulator is a facilitator-provided PowerShell experience, not an SRE Agent portal blade. The learner runs it in the Skillable terminal and returns to this retained chat for the evidence review.

## Task 3: Draft and save the reusable skill

Ask:

> Draft a reusable skill for diagnosing and safely remediating this exact symptom. Include evidence order, the resource-group boundary, action and rollback, core-path isolation, post-fix checks, monitor resolution, and alert closure. Do not assign tools to the skill. Then explain how to create it manually.

Create:

- Name: `course-recommendations-recovery`
- Evidence: Application Insights first, Azure configuration second
- Safety: learner resource group only
- Isolation: core health must remain healthy
- Tools: none owned by the skill

Live UI reference:

| Step | Screenshot | Click path and callout |
|---|---|---|
| Corrected draft contract | IMAGE[Draft-only final contract](instructions359549/11-configure-corrected-draft-contract.png) | In the investigation chat, confirm the response says **DRAFT REFERENCE ONLY** and that nothing was applied. |
| Generated skill content | IMAGE[Reusable skill draft](instructions359549/12-configure-skill-draft.png) | Confirm evidence order, one-setting remediation, rollback, isolation, and closure steps. |
| Create skill | IMAGE[Create skill form](instructions359549/17-configure-skill-form.png) | **Build + setup → Agent Canvas → Create skill**. Enter `course-recommendations-recovery`, paste the generated `SKILL.md`, and leave **Tools** empty. |

## Task 4: Create the disabled alert

Create:

- Name: `Course-recommendations-unavailable`
- Scope: learner Application Insights component
- Signal: degraded `CaldovaRecommendationsHealth` evidence for `/recommendations/health`
- Evaluation interval: 5 minutes
- Window: 5 minutes
- Auto-resolution: enabled
- State: disabled until the chain is complete

Live UI reference:

IMAGE[Disabled reference alert](instructions359549/19-preconfigured-guided-alert-disabled.png)

Use **Application Insights → Alerts → Create → Alert rule**. The screenshot shows the expected AFTER configuration: exact rule name, Application Insights scope, `AggregatedValue > 0`, and an **Enable** action because the rule is disabled. During creation, also verify the **5-minute** window, **5-minute** evaluation frequency, auto-resolution, and no action group dependency.

## Task 5: Create the custom agent and connector

Create custom agent:

- Name: `caldova-guided-feature-responder`
- Skill: only `course-recommendations-recovery`
- Agent-owned tools:
  - `RunAzCliReadCommands`
  - `RunAzCliWriteCommands`
  - `GetAzCliHelp`
- Optional supporting tools: memory, Python, and Microsoft Learn as required
- No Azure MCP dependency

Add the managed-identity `caldova-guided-alerts` connector. It exposes only `close_guided_alert` for the exact resolved guided alert in the learner scope.

Live UI reference:

| Step | Screenshot | Click path and callout |
|---|---|---|
| Custom-agent form | IMAGE[Guided custom-agent form](instructions359549/15-configure-custom-agent-form.png) | **Build + setup → Agent Canvas → Create**. Enter the exact name and instructions. |
| Agent-owned tools | IMAGE[Choose tools panel](instructions359549/16-configure-agent-owned-tools.png) | Select `RunAzCliReadCommands`, `RunAzCliWriteCommands`, and `GetAzCliHelp` on the agent, not on the skill. |
| Expected connector | IMAGE[Guided connector reference](instructions359549/31-preconfigured-guided-connector.png) | The API/script-owned reference connector is connected with one hard-scoped tool. Learners follow the facilitator-provided managed-identity connector step; do not paste credentials. |

## Task 6: Create and connect the response plan

Create:

- Name: `course-recommendations-learning-response`
- Exact title match: `Course-recommendations-unavailable`
- Handler: `caldova-guided-feature-responder`
- Skill: `course-recommendations-recovery`
- Merge: disabled
- State: disabled

Connect:

`alert → response plan → custom agent → skill`

Verify every link, then enable the alert and response plan.

Live UI reference:

| Step | Screenshot | Click path and expected result |
|---|---|---|
| Create plan | IMAGE[Response-plan form](instructions359549/18-configure-response-plan-form.png) | **Incidents → Triggers & response plans → Create a response plan**. Enter the exact plan and title filter, select the guided custom agent, choose **Review**, and keep reinvestigation/merge disabled. |
| Verify links | IMAGE[Applied guided plan detail](instructions359549/33-preconfigured-guided-plan-detail.png) | The plan points to `caldova-guided-feature-responder`; the agent owns the skill and tools. |
| Verify states | IMAGE[Main On, guided Off](instructions359549/32-preconfigured-response-plans.png) | The reference AFTER-state keeps the broad Caldova plan On and the guided plan Off. For the learner run, enable the guided plan first and the alert second. |
| Timing | IMAGE[Link, enable, and timing callout](instructions359549/14-configure-link-enable-timing.png) | Allow the 5-minute evaluation cycle: alert 5-10 minutes, incident 1-2 minutes later, investigation 3-10 minutes, resolution 5-20 minutes. |

## Task 7: Reset, retrigger, and verify automatic handling

1. Select **Fix** if required, then **Reset**.
2. Select **Check configuration**.
3. Select **Start scenario** once.
4. While alert propagation is pending, inspect the saved artifacts and links.
5. Verify:
   - a fresh alert;
   - the exact response plan;
   - the guided custom agent and skill;
   - Application Insights/configuration evidence;
   - the one-setting remediation;
   - HTTP 200 and a ready revision;
   - healthy core paths;
   - monitor condition `Resolved`;
   - alert state `Closed`;
   - a completed incident summary.
6. Select **Check recovery**.
7. Select **Reset** and wait for **Baseline restored**.

Retained completed reference evidence:

| Evidence | Screenshot | What it proves |
|---|---|---|
| Active investigation | IMAGE[Guided investigation](instructions359549/35-guided-incident-created.png) | The exact guided incident selected the configuration and Application Insights evidence path. |
| Recovery and summary | IMAGE[Recovery pending final closure](instructions359549/36-guided-active-investigation.png) | The replacement revision recovered the feature and core learning remained healthy. |
| Resolved/completed row | IMAGE[Guided incident filtered view](instructions359549/39-guided-alert-resolved-completed.png) | `Course-recommendations-unavailable` is Resolved, Completed, and routed through `course-recommendations-learning-response`; open counters remain zero. |

These are retained completed evidence from the proven reference run. Do not imply they were generated during screenshot capture.

## Task 8: Cleanup and compare the AFTER-state

1. Disable the response plan.
2. Disable the alert.
3. Retain the skill, custom agent, connector, and completed incident evidence.
4. Open `sre-caldova-prerun-userN`.
5. Compare its completed reference artifacts and retained incident evidence.

The Preconfigured Agent also includes:

- exactly five Active weekly read-only tasks: NSG, RBAC, cost, capacity, and CVE;
- **Caldova FinOps** (`CALDOVA-FINOPS-V2`) with explicit ActualCost/forecast/estimate provenance;
- **Caldova Operations Command Center** (`CALDOVA-OCC-V2`) with Operations Overview, Dependency Mapping, and Resource Explorer;
- session insights and consumption surfaces.

Preconfigured AFTER reference:

| Surface | Screenshot | Expected result |
|---|---|---|
| Code access | IMAGE[Connected GitHub source](instructions359549/22-preconfigured-code-access.png) | The private authoring repository connection is present on Preconfigured only. |
| Knowledge | IMAGE[Knowledge sources](instructions359549/23-preconfigured-knowledge-sources.png) | Caldova architecture, operations, FinOps, deployment, and CVE evidence context are available. |
| Managed resources | IMAGE[Managed-resource scope](instructions359549/24-preconfigured-managed-resources.png) | Scope is the isolated learner resource group. |
| Skills | IMAGE[Guided skill applied](instructions359549/27-preconfigured-guided-skill.png) | `course-recommendations-recovery` is visible with the other curated skills. |
| Custom agents | IMAGE[Two prepared custom agents](instructions359549/28-preconfigured-custom-agents.png) | The guided responder and main incident responder are both present. |
| Guided agent detail | IMAGE[Agent tools and guided skill](instructions359549/29-preconfigured-guided-agent-detail.png) | The agent owns Azure CLI read/write/help and the guided skill. |
| Connectors | IMAGE[Connector list](instructions359549/30-preconfigured-connector-list.png) | Azure, FinOps, guided closure, and Microsoft Learn connectors are connected. |
| Alert | IMAGE[Guided alert disabled](instructions359549/19-preconfigured-guided-alert-disabled.png) | The reference alert remains disabled in the prepared state. |
| Response plans | IMAGE[Guided plan disabled](instructions359549/32-preconfigured-response-plans.png) | Main plan On; guided exact-match plan Off. |
| Automations | IMAGE[Exactly five weekly tasks](instructions359549/21-preconfigured-five-weekly-tasks.png) | NSG, RBAC, cost, capacity, and CVE are the only scheduled tasks. |
| Incidents | IMAGE[Zero open cases](instructions359549/34-preconfigured-incidents-zero-open.png) | New, Acknowledged, Pending, and In progress are all zero. |
| Live Reports | IMAGE[Two v2 reports](instructions359549/40-preconfigured-live-reports-v2.png) | Caldova FinOps and Operations Command Center retain version 2. |
| FinOps | IMAGE[Dynamic cost and provenance](instructions359549/41-preconfigured-finops-v2.png) | Billed ActualCost is separate from forecast and retail estimate, with live connector freshness. |
| OCC overview | IMAGE[Operations Overview](instructions359549/42-occ-operations-overview.png) | Unknown or missing evidence is shown explicitly, never as healthy. |
| OCC dependencies | IMAGE[Dependency Mapping](instructions359549/43-occ-dependency-mapping.png) | The application and reporting dependencies are mapped. |
| OCC resources | IMAGE[Resource Explorer](instructions359549/44-occ-resource-explorer.png) | Learners can inspect the scoped Azure resource inventory. |
| Insights | IMAGE[Session insights](instructions359549/26-preconfigured-session-insights.png) | Retained investigations produce inspectable session insights. |
| Consumption | IMAGE[Agent consumption](instructions359549/45-preconfigured-agent-consumption.png) | Chats, incidents, tasks, and triggers are separated. |
| Final prepared workload | IMAGE[Portal prepared state](instructions359549/01-portal-prepared-state.png) | Core healthy; recommendations intentionally unavailable only. |

## Facilitator fallback

If alert propagation is still pending near the end of the module:

1. preserve the alert and investigation links;
2. complete the artifact review;
3. do not start another scenario;
4. hand the environment to the facilitator for cleanup.

For the reporting scenario only, if a fresh alert fired or was acknowledged but automatic incident ingestion did not produce a thread within the bounded wait, the facilitator may use supported `sreagent incidents create` with the exact alert ID. This is an operator fallback, not the normal learner flow.

## Final state

- Core Caldova paths healthy
- Course recommendations intentionally unavailable
- Guided alert disabled
- Guided response plan disabled
- Zero open alerts
- Completed evidence retained
