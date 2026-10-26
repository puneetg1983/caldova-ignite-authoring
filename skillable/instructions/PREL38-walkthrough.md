# PREL38 walkthrough, timings, and instruction gaps

Run date: **25 October 2026 (UTC)**. Scope: the PREL38 SRE activities in the existing authorized learner VM, including the two optional activities. [Revised learner instructions](PREL38.md) | [Action-by-action timings](PREL38-walkthrough-actions.csv) | [Screenshot provenance](images/prel38-walkthrough/manifest.json).

## Result

Product search was reproduced as HTTP 500, diagnosed, and repaired in the running app. Repeating `jacket` returned **53 matches**, with **20 products** on the first page. Catalog browsing still returned **20 of 2,000 products**, and `/api/health` returned HTTP 200. The weekly cost task produced findings and a downloadable PowerPoint. The live report was saved through **v3**, with dependency health first, service grouping, and highlighted unhealthy components. The optional App Service Health check change completed and returned `healthCheckPath: /api/health`.

The measured trial took **72 minutes 35 seconds of operator wall time**, including facilitator repairs, investigation, evidence collection, layout retries, overlapping service work, and unattended approvals. Its **199 recorded actions** consumed **13 minutes 2 seconds inside the guarded UI wrapper**. These are not equivalent to 72 minutes of learner work or 13 minutes of human active work. One attempt was blocked by the wrapper; an `observed` action is not proof that its intended outcome succeeded.

**A human's required SRE work is estimated at 19-32 minutes of active interaction, including a provisional setup allowance, plus service waits that cannot all be predicted or eliminated. This does not yet establish a 45-minute end-to-end fit.** Fresh setup and the other teams' Modernization/ARM activities were not timed. PowerPoint slide review remains unmeasured because the VM lacks a compatible viewer.

That estimate covers the measured guide only. It excludes the later consumption review and optional configuration exercises described under **Revisions after the measured walkthrough**.

## Measurement method and boundaries

- The timed trial is **T01-T199**, from **00:30:32.838 to 01:43:07.940 UTC**. The CSV separately records guarded follow-up VM actions **T200-T226**, including native typing checks. Host-side publishing and administrative work are outside the action timer; their separate export/verification milestones are recorded below.
- Every guarded action records UTC start/finish, operation seconds, observation status, and a private screenshot when applicable. Operation time includes focus, typing, configured settling time, and screenshot capture; it is not a pure click or typing benchmark.
- The wall-time remainder includes reasoning, authoring, tooling, service processing, delayed inspection, and approvals left unattended while doing other work. It must not be labelled entirely as backend waiting.
- Service completion is reported as **first observed by**, not an exact compute duration, unless directly established. Independent waits overlap and must not be summed into a sequential learner total.
- Human active-time estimates assume a person reading the guide and using the visible controls directly. They are planning estimates, not a measured human trial or a blanket speed multiplier. Backend waits receive no human-speed discount.
- The VM was already signed in; GitHub import and OAuth were already configured. They were checked, not reset and repeated. No fresh sign-in/import/OAuth timing is claimed.
- The execution deliberately started cost automation and report generation early to overlap their waits. That differs from the written guide's section order. The proposed reordering below has **not** been silently applied to the learner instructions.

## Activity timing list

All timestamps below are UTC. Detailed action durations and corrections are in the CSV.

| Activity and learning goal | What actually happened / measured observations | Estimated human active time | Wait or measurement limitation |
| --- | --- | --- | --- |
| VM, Azure, and shared GitHub setup: enter the assigned environment | Existing signed-in session reused; fresh setup not rerun | **4-8 min, provisional only** | Must be measured with a fresh authorized learner. This estimate is not evidence of successful VM launch or credential injection. |
| Azure/Logs/repository context: understand connected scope and data | T18-T33, **00:38:30-00:42:43**, about **4 min 13 sec** including inspection/capture; explored both **+** dialogs and cancelled | **2-3 min** | Only the assigned resource group was reviewed; no new scope or connector was added. Import/OAuth were already complete. |
| Getting started: understand the app and architecture | Overview requested **00:38:02**; completed answer and endpoint table inspected later. Real source-file reads verified **01:09:24**. Diagram follow-up submitted **01:10:12**; rendered diagram observed later | **3-5 min** | Delayed inspection is not response latency. An optional follow-up question was initially misclassified as blocking; that interpretation was corrected. |
| Configuration inquiry: understand the App Service | Request click **00:43:19**; hostname and configuration observed by **00:51:17** | **1-2 min** | Inspection was delayed by other activities. Resuming the wizard opened New chat, so the inquiry ran there rather than in onboarding. |
| Original debug trial: test whether the initial wording repairs production behavior | Request **01:14:43**; by **01:19:20**, agent created a source PR with a null guard, but live search still failed | **Not a successful completion budget** | An undeployed PR and an empty search result are not recovery. This failed trial is retained, not hidden in the revised timing. |
| Revised debug trial: repair the running app and verify customer results | Request **01:21:13**; proposed live fix inspected **01:26:34**; approved **01:27:27**; direct recovery observed **01:28:11**; VM search confirmed **01:29:16**. About **8 min 3 sec** to customer-visible confirmation | **2-3 min** | Includes delayed approval/inspection. Do not claim the full interval was backend compute. Confirm the original search returns products, not just HTTP 200. |
| Weekly cost automation: schedule analysis, forecast, and savings | Request **00:32:09**; enabled task first observed **00:44:02**; one run started **00:45:04**; findings inspected **00:54:33**; PPTX downloaded **00:55:52** | **3-5 min**, excluding slide review | About **11 min 53 sec** to first observed task appearance and **10 min 48 sec** from run click to verified download, with other work in between. Neither is an exact backend duration. |
| Live report: inspect dependencies, traffic, versions, and sharing | Request **00:35:24**; v1 saved by **00:47:48** after approval. Layout correction requested **00:49:04**, approved **00:54:00**. Current v2, charts, URLs, geography, and versions inspected **01:02-01:05**; share control clicked **01:03:44** | **4-6 min** | First save interval includes an unattended approval. The graph-first requirement needed a correction. Copy-link control was invoked; a pasted/reopened sharing round trip was not verified. |
| Optional Health check: learn liveness monitoring separately from search | Request **01:30:12**; impact accepted **01:33:06**; exact write approved **01:35:40**; saved configuration confirmed **01:37:25**. About **7 min 13 sec** observed wall interval | **1-2 min** | Includes unattended questions/approvals. `/api/health` was already 200 while search failed; this does not diagnose the search problem. |
| Optional report iteration: conversationally improve an existing report | Exact optional prompt submitted **01:21:32**; save approved **01:24:44** and revised report preview visible by **01:24:48**. Persisted v3 gallery checked **01:40:55**, full graph **01:43:07** | **1-2 min** | About **3 min 16 sec** from submission to the revised preview, including approval. These are observation bounds, not exact compute time; later inspection is not extra generation time. |

Required estimated active time: **19-32 minutes**; optional activities add **2-4 minutes**. These estimates exclude slide review, the other teams' activities, and any unoverlapped service waits. They are not a committed learner schedule.

## Executed flow and evidence

### 1. Verify context and actual source access

Reviewed **Quickstart > Azure resources > Show details** and **Logs > Show details**, explored the two **+** dialogs without saving changes, and checked the existing imported repository. A saved repository or a dash in its Status cell was not treated as indexing proof.

The agent actually retrieved `CaldovaRetailOps.csproj` (24 lines), `appsettings.json` (10 lines), and `README.md` (187 lines).

![Actual source-file reads from the connected repository](images/prel38-walkthrough/repository-source-retrieved.png)

![Telemetry branch of the agent-generated onboarding architecture diagram](images/prel38-walkthrough/onboarding-telemetry-detail.png)

The diagram capture shows its telemetry branch, not the complete diagram.

### 2. Reproduce and repair search

The original live deployment did not reproduce the written scenario: search worked, and the old `/YSOD.aspx` availability URL returned 404. Facilitator preparation added the real future-date fault and removed the unused `BreakMyWebApp` setting. Those writes and their approval delays are **not learner debug time**.

The original debug wording produced an undeployed PR whose null guard would return an empty result. It was not merged or accepted as recovery. A fresh trial used:

> Product search fails with HTTP 500, but browsing works. Find out why, fix the running app, and check that searching for jacket returns products.

The agent proposed restoring `Catalog__AsOfDate` from `2026-12-15` to `2026-10-25` on the assigned app. After reviewing the exact target, subscription, and command, the change was approved through the existing platform gate. Rollback was the previous setting value. Search then returned real jacket products.

![Before: the actual jacket search fails](images/prel38-walkthrough/search-failure.png)

![After: the same search returns 53 matches and real products](images/prel38-walkthrough/search-recovered.png)

Direct checks used the **actual JSON catalog endpoint** `/api/search?page=1`, not `/api/products`. The latter returns the SPA HTML fallback with HTTP 200 and therefore is not API-success evidence.

### 3. Inspect cost automation and its deliverable

Created **Weekly Caldova cost review** through chat. The task displayed **Weekly on Monday at 2:00 AM**; the summary did not show a timezone. Exactly one manual run was triggered with **Run task now**.

An immediate **Success** status was not treated as completed analysis: the execution thread and attachment were checked separately. Findings included right-sizing and estimated savings, with no resource changes approved. The agent's monetary estimates are not independently verified prices or actual billed costs.

![Run controls and the linked execution thread](images/prel38-walkthrough/cost-task-run.png)

![Actual cost-review recommendations; monetary amounts are agent estimates](images/prel38-walkthrough/cost-findings.png)

![The generated PowerPoint downloaded in the VM](images/prel38-walkthrough/cost-powerpoint-download.png)

![The VM has no PowerPoint-compatible viewer](images/prel38-walkthrough/powerpoint-viewer-gap.png)

The file was `Weekly-Caldova-Cost-Review-2026-10-25.pptx`. Download is verified; slide-level visual quality and slide-reading time are not. No Office installation or permission expansion was attempted.

### 4. Inspect the live report, not just its creation status

The initial save waited on **Allow once** for `SaveReport` and one read-only resource-log query tool. The first generated layout put KPIs above the graph. A correction produced v2; comparing v1 with the current version verified the change.

The exact optional prompt, "Group the dependency graph by service and make unhealthy components stand out.", produced v3. The current graph grouped components and used distinct unhealthy styling. Traffic/response-time charts, requested/failing URL tables, and country/region data were inspected.

![Saved report in the gallery](images/prel38-walkthrough/live-report-gallery.png)

![Saved v1, v2, and v3 versions](images/prel38-walkthrough/live-report-v3-versions.png)

![Current dependency-health graph grouped by service](images/prel38-walkthrough/live-report-v3-grouped.png)

![Measured response-time chart](images/prel38-walkthrough/live-report-response-times.png)

![Requested and failing URL tables](images/prel38-walkthrough/live-report-url-tables.png)

![Geography and availability caveats](images/prel38-walkthrough/live-report-geography.png)

Historical traffic was dominated by old `/YSOD.aspx` 404 probes. The last-24-hour report therefore remained red after fresh search requests recovered. Historical failure metrics do not establish that the current repair failed. The graph is an authored view over connected data, not independent proof that every dependency is healthy.

### 5. Complete the separate optional Health check change

Reviewed the successful endpoint, assigned target, restart/single-instance impact, and rollback to an empty Health check path. Both the conversational confirmation and the platform's exact write approval were exercised. The completed operation returned `healthCheckPath: /api/health`.

![Saved Health check path returned by the completed operation](images/prel38-walkthrough/health-check-saved.png)

## Instruction gaps and disposition

| Gap | Evidence / consequence | Disposition |
| --- | --- | --- |
| Seeded deployment did not match product-search instructions | Original setting was unused; old probe returned 404 | Versioned and hosted templates changed in exactly three variables. The real deployed package was validated, and the current app was seeded/repaired through guarded writes. The existing probe update completed after the timed trial. A fresh lab deployment is still untested. |
| A "fix" created only an undeployed PR with empty-result behavior | First debug trial did not restore live search | Revised the single natural prompt to require a running-app fix and jacket products. Added PR-versus-deployment and nonempty-result guidance at the end. |
| Status labels can precede deliverables | Cost run showed Success before the PPTX was verified | Added execution-thread and attachment checks. Do not rerun a task just because a deliverable is not yet visible. |
| The VM cannot open PPTX files | Windows offered Notepad, VS Code, and Media Player | Recorded as a viewing gap. Supply an approved viewer/preview before a slide-review exercise is considered complete. |
| Empty report gallery hid a pending approval | `SaveReport` waited while other work continued | Added a reminder to check the authoring thread for questions/approvals while multitasking. Kept read-only scope and one-time approval. |
| First report ignored graph-first ordering | v1 had KPIs first | Corrected and compared saved versions. Keep visual acceptance checks rather than trusting the generated summary. |
| Resuming setup did not open the existing onboarding thread | **Done and go to agent** returned to New chat in this resumed session | Main text no longer promises automatic opening. Existing **Search Threads > get to know** guidance remains at the end. Fresh-user behavior is not certified by this resumed run. |
| Browser automation and actual user work differ | Stale send/navigation coordinates, focus retries, and clipped approvals | Corrections retained in the CSV. These are operator overhead, not service latency or evidence that a human would require the same retries. |
| HTTP 200 was an insufficient browsing proxy | `/api/products` returned HTML | Corrected verification to `/api/search?page=1`, parsed product counts, and checked the customer UI. |
| Sharing was only partially exercised | **Copy link to report** clicked without granting access | Control invocation verified; link reopening and recipient-access behavior remain unverified. |
| Fresh setup and one-click VM launching remain unmeasured | Existing authenticated session reused | Deferred rather than blocking the other exercises. Manual use of the actual app URL in the VM worked. Do not reset a working lab to manufacture a timing. |
| Other teams' pages are incomplete | Modernization/ARM content is not a measured part of this SRE rehearsal | Preserve their content/placeholders; do not certify total event fit or invent their exercises. |
| Native Copy & Type Text is asynchronous | T225 captured only part of the prompt; T226 confirmed the full text without submission | Added a short reminder in the compiled guidance to keep the VM field focused until typing finishes before Send/Enter. The early partial capture is not a failed prompt or a measured completion latency. |
| Browser refresh required confirmation and a VM unlock | Initial F5 paused at **Reload site?**; completed refresh reconnected to a Windows lock screen | Confirmed the normal browser reload, unlocked the same session through the native runtime credential control, and verified the revised learner rendering. No new lab, VM reset, credential extraction, or permission change. |

## Scenario validation and publication

The exact deployed `webapp.zip` was separately validated locally with .NET 8. With the future catalog date, health and browsing were 200 while product search was 500. With the corrected date, all were 200. The isolated checks took approximately **1.93 seconds** and **0.64 seconds**, including local startup; they are not live-agent recovery or learner timings.

Only these deployment variables changed in `Caldova-WebAppP1v3-with-SREAgent-MI.json`:

| Variable | Revised value |
| --- | --- |
| `faultSettingName` | `Catalog__AsOfDate` |
| `faultSettingValue` | `2026-12-15` |
| `availabilityPath` | `/api/search/by-name?name=jacket` |

Managed identity, RBAC, agent safeguards, and other resources were not changed by this source revision. Existing-instance repair does not update future lab deployments.

Hosted **cloud template 6969** was subsequently updated through its supported editor. **Used By (1)** was followed and verified as PREL38 profile **224911** before editing. An official rollback download was taken, the source editor was compared with it, only the three variable values were replaced, and a required change note was supplied. A fresh official download confirmed the exact intended result with no other template changes at **02:09:33 UTC**. Before SHA256: `ea56aac264c463a3918c7e283a923d482ac332abf9b79202dde170530899b5fb`; after SHA256: `c2c973a2b433773d1711b882e79d55d62372b5f15c72fa4a1002f11806a07466`. This verifies persistence, not a new lab deployment.

The revised instructions were saved to **PREL38 profile 224911 / instruction set 359549**. An official post-save export matched the converted source exactly: **four native pages, seven chat prompts, and 47 hosted images**. All 44 previously hosted images were preserved byte-for-byte. The original **480-minute profile duration** was preserved; it is not the 45-minute SRE allowance.

Private rollback exports were retained. Before-publication ZIP SHA256: `1c6433865e4d2775c635950927fcc627c2367f03855b70d7a12530b0417f7e49`. After-publication ZIP SHA256: `317634051970e10a5741b5c08ed3f801707040ce3b05989958dd870cd14ed1bb`. Publication does not mean that a currently open client has refreshed its cached instructions; learner rendering and native input must be checked separately.

The existing learner client was then genuinely refreshed after accepting its normal **Reload site?** confirmation. It displayed the revised debug wording, all **seven images**, native **Copy & Type Text** controls instead of the old fenced-code controls, and **no visible authoring/duration/screenshot-placeholder warnings**. Its Windows session required an unlock; the native runtime VM password control worked without extracting or logging the credential. Azure/browser state and the existing thread were preserved.

The subsequent one-sentence typing reminder was saved and verified through another official export at **02:14:56 UTC**. The persisted source matched exactly, all **47 image files remained byte-identical**, and page/prompt counts and profile duration were unchanged. Latest export SHA256: `3b5410860c796667ac7485eddc7584a361cbf43e488fd3ac9abf6eaa2493b8d0`. This final text-only reminder was export-verified after the core learner rendering/native-input test.

The configuration prompt's actual native button was exercised with the VM chat input focused. The complete sentence appeared in that input; it was **not submitted**, avoiding a duplicate request. The typing call returned before all characters appeared, so its invocation duration is not the full typing duration.

![The real native control typed the complete configuration prompt into the VM](images/prel38-walkthrough/native-copy-type.png)

Final independent HTTP checks at **02:14:57 UTC** still returned health 200, search 200 with 53 total jacket matches and 20 matching product names, and catalog 200 with 2,000 total products and 20 returned rows.

Public screenshots are crops of actual captures, not mockups. Their manifest records capture UTC, source basename/hash, crop coordinates, and final hash. Full per-action screenshots and exports remain private because they can contain account details, credentials, or browser state. The immutable original instruction/media snapshots were not altered.

## Revisions after the measured walkthrough

The subsequent learner-guide revision explicitly starts configuration in **New chat**, separate from Getting started. This matches where the configuration inquiry actually ran during the original trial; it does not require another discovery exercise.

The section-by-section review subsequently removed duplicated Windows and Azure Portal sign-in instructions, which are already available in Resources. Start now begins with opening `https://sre.azure.com` inside the VM and selecting the assigned agent. This revised entry path has not been rerun or timed; there is no sanitized initial sign-in capture in the evidence set.

The user supplied a context-wizard landing screenshot during that review. A header-free crop is now used in the opening section to identify **More context. Better investigations.** and **Quickstart**. This is user-provided overview evidence, separate from the original 19 timed-walkthrough screenshots and four detail captures; it does not show the sign-in sequence.

The user also supplied the **Add repositories** dialog showing GitHub selected and the Repository URL field. The already cropped image is preserved unchanged before the OAuth screenshot in the repository-connection section. It contains no account details and does not establish OAuth or indexing success; it is not part of the timed evidence set.

The user selected an earlier, wider onboarding-thread screenshot for Getting started. The account/agent header is excluded and the account name in its greeting is masked. This is an illustrative earlier-session example, not a new capture or part of the timed trial. Its connection suggestions predate the revised repository-first flow; the learner's generated content can differ. The existing partial telemetry-diagram capture and the missing full-architecture evidence remain unchanged.

The background-import section now includes two cropped screenshots from the earlier 2026-10-24 setup: destination fields with Private selected, and the import-progress screen. The destination account name is masked. These are not new captures or timed-trial records; the original screenshot manifest and action timings remain unchanged.

The review removed the extra repository-readiness gate before debugging. An initial manual-hostname lookup was rejected: debugging must provide the full learner-specific URL directly. The source now uses `@lab.Variable(CaldovaWebAppUrl)` in a native typing control. The separate `Set-CaldovaWebAppUrl.ps1` cloud lifecycle script reads the deployed App Service's actual hostname and publishes that variable after checking the assigned subscription and resource group. It does not change Azure resources or permissions. At that source-only stage, live lifecycle configuration and rendered-token verification were still pending; the later configuration evidence is recorded below. The existing T56 crop remains an example configuration response, not a required URL-discovery exercise or new timed evidence. Native text-entry instructions consistently offer copy/paste, manual typing, or clicking the text after selecting the VM field. The missing-URL question remains only a temporary troubleshooting control. These revisions have not been rerun or retimed.

The guide now also includes a required thread-level AAU consumption/budget review and optional skill, custom-agent, incident-source, and response-plan setup. These additions are based on the product documentation, **not a new live walkthrough**. Their UI flows, screenshots, active time, and end-to-end wait time have not been measured in this trial. The original 199-action timing baseline, 226-record CSV, 19 evidence screenshots, and human estimates above have not been rewritten to include them. The expanded guide contains ten chat prompts; the earlier seven-prompt publication evidence refers to the measured revision, not this expansion.

AAU allocation changes, incident-source connections, custom skills/agents, and response plans were not applied to the running agent during this revision. No PowerPoint/Azure MCP installation, VM image change, lifecycle action, or new lab launch was performed during the source-only review. Facilitator preparation choices are documented in the repository README. The earlier live Skillable instruction publication remains the last runtime-verified revision; the expanded source needs a separate supported publication and runtime check.

An earlier publication attempt was blocked when the previous learner URL redirected to PREL38's profile and guarded foreground checks refused editor input while another window owned focus; no instruction save was attempted.

The user subsequently supplied a new running PREL38 lab. Its client opened in corporate Edge with the guest Windows sign-in screen displayed, and the profile's lifecycle settings were accessible through the supported authoring UI. At the initial access check, an unsaved cloud-action dialog and the profile edit form were cancelled without saving. No lifecycle action was installed or executed at that check, no instructions were published, and no replacement lab was launched by the agent. This access check is not a new walkthrough, timing measurement, or proof of resolved app-URL rendering.

### Automatic URL binding: deferred; preview restored

On **2026-10-25**, the separate **Publish Caldova app URL** cloud action
(**187064**) was subsequently saved on PREL38 profile **224911**. Its event is
**Post-Build**, with **Blocking** and **Enabled** selected, using PowerShell
**PS 7.1.3 | Az 6.0.0**. Failure handling is **Notify User**, with an explicit
message to contact the facilitator rather than a guessed URL.

An official full-profile rollback export was retained privately before the change.
An independent post-save export verified the following at **19:03:13 UTC**:

| Check | Result |
| --- | --- |
| New action script | Matches `Set-CaldovaWebAppUrl.ps1`, allowing line endings and the trailing newline only |
| Lifecycle actions | Five total; all four original actions preserved unchanged |
| Other profile fields | Unchanged |
| Live instructions and existing media | Unchanged; the URL-only correction and broader review draft are not published |
| Cloud execution and learner URL | Not yet verified |

The supplied running instance **66592651** predates this action. Installing a
Post-Build action does not execute it retroactively. Its exact instance-management
page was reached through the supported profile search, but no script was run.
At **19:12:01 UTC**, the host Windows foreground process was confirmed as
`LockApp`; guarded browser interaction stopped. This is a host-desktop lock,
separate from the guest Windows sign-in screen observed earlier.

After the user unlocked the host, a temporary, unscored cloud activity
(**490606**) was added to execute the publisher on the existing instance.
Only an owned verification prefix was added above the original native guide;
the broader review draft was not published.

The first check, requested at **19:40:49 UTC**, returned Azure module-load
information as a red CLIXML error. After suppressing only the Azure information
stream and preserving actual failures and native variable metadata, the next
observed result was a resource-group-name validation error. The profile's
resource-group replacement alias is `ResourceGroup1`, not `1`. The repository
script and mocked behavior coverage were corrected, but the revised production
script was not saved to the live action or verified end to end. Host locking and
foreground-window problems also interrupted authoring. No actual app URL or
successful native VM entry was established.

URL debugging was then deferred rather than continuing an open-ended UI
automation attempt. Cleanup was persisted through the supported authoring UI:

| Cleanup check | Verified outcome |
| --- | --- |
| Native instructions | Original guide restored; temporary heading and URL control removed |
| Temporary activity 490606 | Deleted; profile activities restored to empty |
| Pending publisher draft | Discarded without deploying the revised script |
| Publisher 187064 | Disabled at **22:18:22 UTC** so the unverified blocking action cannot delay new launches |
| Independent full export at **22:19:23 UTC** | Only publisher `Enabled` changed to `false`; all four original actions and other profile fields preserved |
| Existing media/export entries | All 47 byte-identical |

A later continuation saved the corrected repository script in action
**187064**, still disabled. An independent full export at **22:28:47 UTC**
verified that only its script changed from the disabled profile. A proposed
new verification activity remained an unsaved draft and was cancelled at
**22:42:11 UTC**. No new activity or instruction controls were published,
and no further cloud execution or resolved URL was established.

Keep the publisher disabled until a supported live check proves the exact
learner-specific URL, resolved instruction rendering, native VM entry, and the
deployed application. The URL-only correction and broader review draft remain
unpublished. Do not rerun unrelated provisioning actions or replace the
learner's lab. No new build or screenshot of successful URL delivery is claimed.

These are configuration-verification timestamps, not learner-action timings.
The user subsequently approved manual URL discovery through the web resource.
At that stage, the PREL38 review draft directed learners to **Azure Portal > Resource groups >
assigned resource group > caldova-webapp-... (App Service) > Overview**, then
**Default domain / Browse**. It includes a clearly marked example, preserves
regional hostname components, and removes the unresolved automatic-variable
control and contradictory troubleshooting text. The publisher remains disabled.
This revised manual path has not been rerun, retimed, or published to the live
guide; it does not change the historical measurements below.

In the next review, the user moved URL discovery into the preceding configuration
conversation: the prompt now also requests the full HTTPS website link. Learners
open it and bookmark or copy the URL for the search exercise. The manual Portal
steps and example remain under Additional guidance only if that link is missing
or does not open. This revised handoff has not been rerun, retimed, or published;
the existing configuration screenshot predates the expanded prompt.

The next review clarified that Additional guidance is for troubleshooting and
help following the instructions, not optional activities. The optional Health
check now appears directly under configuration, report refinement under the
report exercise, and approved AAU changes under consumption. Skills, custom
agents, incident management, and response plans are grouped in Optional exercises
before completion. Their safeguards and dependency order are unchanged. This is
an authoring reorganization, not a new timed run or live-guide publication.

The historical CSV, screenshot manifest, operator durations, and human estimates
remain unchanged.

## Targeted checks for the numbered revision

The subsequent review numbers the SRE module's eleven exercises, moves opening
the agent to exercise 2 after the background import, and explains each
exercise's operational purpose. Scheduled tasks now request a self-contained
HTML slide deck. Agent consumption is explicitly agent-attention budgeting,
and optional capabilities are exploration-only rather than creation exercises.
Task creation must be confirmed before opening Automation; independent work
continues while agent replies, task execution, and report authoring run.
The current numbered draft has seven native typing prompts: six activity
prompts and one conditional icon-correction prompt in Additional guidance.
Each is under 650 characters. The larger historical expansion described above
is not the current prompt count or a new publication claim.

A fresh user-supplied lab was used on **2026-10-26 UTC** for a targeted
resource-list, context, and Live Report check. Its existing context showed two
log providers and one resource group connected. This check continued with that
Azure/log context only: the GitHub import, OAuth connection, search repair,
scheduled HTML-deck execution, and other modules were not rerun.

| Observed event | UTC |
| --- | --- |
| Fresh SRE Agent resource-list capture | 02:01:58 |
| More context / Quickstart capture | 02:03:15 |
| Initial Live Report design submitted | 02:05:43 |
| SaveReport approval observed | 02:10:42 |
| Save approved with the single read-only Monitor log-query connector | 02:11:40 |
| First saved report visible | 02:11:45 |
| Loaded report with real metrics visible | 02:12:11 |
| Existing-report graph correction submitted | 02:14:22 |
| Small-edit steering message sent to the same authoring thread | 02:23:23 |
| Corrected SaveReport approved, same report ID and read-only connector | 02:27:11 |
| Corrected report visible with health rings and inferred edges | 02:27:15 |
| Web App node clicked | 02:31:01 |
| Below-graph Web App telemetry panel inspected | 02:32:21 |
| Official-icon-only correction submitted to the same report | 02:33:59 |
| Icon-only SaveReport scope reviewed | 02:38:30 |
| Same-report icon version approved | 02:39:03 |
| SaveReport completion observed | 02:39:09 |
| Official SVGs visibly rendered in the current saved report | 02:39:27 |
| Version picker showed v1, v2, and current v3 | 02:40:01 |
| Earlier v2 inspected without restoring it | 02:40:34 |
| Returned to current v3 | 02:40:54 |
| Complete graph and legend captured | 02:41:27 |
| Official Web App icon clicked; details inspected | 02:42:00-02:42:04 |
| Application Insights node and its distinct panel inspected | 02:42:52 |
| Lower-chart inspection blocked by corporate-window foreground guard | 02:43:51 |

The first saved report appeared about **6 minutes 2 seconds after submission**.
That observed interval includes authoring, overlapping documentation work,
approval inspection, and the operator's approval delay; it is not isolated
service execution time. The report showed 27 requests, a 66.7% failure rate,
11.6 ms average response time, and 0.0% availability at that observation.
Those are this instance's historical telemetry, not search-recovery evidence.
The authoring thread reported no AppDependencies rows; relationships must not
be presented as traced dependencies when they are inferred.

The first graph used text rectangles rather than the requested service icons
and rings. A correction was therefore requested through the **same report's
authoring thread**, preserving read-only queries and saving a new version
rather than creating a duplicate. The learner prompt was strengthened to
request SVG service icons, circular health rings, a graph before metric cards,
inferred-connection labels, and a responsive layout. This is not evidence that
the final source prompt produced the final design in one turn.

The corrected report appeared **12 minutes 53 seconds after the correction
request**, including the steering message, overlapping work, approval handling,
and delayed inspection of the latest thread output. It used generic inline
globe/chart glyphs, not the requested Azure architecture icons. Clicking the
Web App node did open a real in-report panel below the graph: 39 requests,
30.8% success, 27 failed requests, 10.4 ms average response, and 74.0 ms p95.
Its endpoint table listed 27 `GET /api/search/by-name` requests and 12
`GET /index.html` requests. These later query results differ from the first
capture; they are not a fixed snapshot or evidence of recovery.

The panel summarizes existing Monitor log queries. It does not invoke ARM,
Azure Resource Health, or fresh per-node requests. The report's scrollbar
revealed the panel when a wheel attempt over the graph did not move the view.

Two original Microsoft SVGs were copied unchanged from the official Azure
architecture icon archive, with archive-entry and SHA-256 provenance in
`images/prel38-revision/azure-icons.json`. Public URLs pinned to commit
`b4d549a6e6d38b260cde398873ec44c5d3caf43c` returned identical bytes without
authentication. A **617-character** follow-up requested only those two icon
replacements, a nondistorted 400px graph-height cap, preserved handlers and
queries, and another version of the same report. This exact fallback is in
Additional guidance, not an extra creation exercise.

The icon-only save completed about **5 minutes 10 seconds after submission**,
including reasoning, the small file edit, inspection, and approval delay. The
current v3 visibly rendered the original blue App Service icon and purple
Application Insights icon inside the preserved rings. The full graph and
legend were revealed with the report's scrollbar; a height-cap request did
not remove the need to scroll at this VM's displayed scale. Synthetic-probe
and telemetry edges were labelled inferred, and the legend included unknown.

The official Web App icon still opened its panel: **47 requests, 29.8% success,
33 failures, 9.6 ms average response, and 16.2 ms p95**. Endpoint counts were
33 for `GET /api/search/by-name` and 14 for `GET /index.html`. Clicking
Application Insights replaced the panel with **116 total events**: 47 request,
33 exception, and 36 availability events, one exception type, and collection
**Active**. This verifies distinct node interactions, not that the Web App
was healthy. Versions v1-v3 were listed; v2's generic glyphs were inspected
and the view returned to current v3 without restoring or overwriting history.

Public `live-report-graph.png`, `live-report-service-details.png`, and
`live-report-versions.png` are reviewed crops of those actual captures. Their
provenance is in the revision manifest. The service-detail screenshot reflects
the later query results, not the earlier 39-request observation above.

No new chart-filter or share-recipient-access success is claimed. During a
final attempt to page down to lower charts, the exact corporate Edge window
was no longer foreground. The guard blocked the action before input; no
alternative window, browser, host Azure context, or focus bypass was used.
The successful node, icon, version, and screenshot checks precede that block.

The new lab's **Settings** view exposed **General** and **Workspace
configuration**, not **Agent consumption**. The offered legacy-navigation
switch displayed **Restart and Save**; it was cancelled at **02:07:02 UTC**.
No restart, feature enablement, permissions change, or AAU allocation save was
performed. Live AAU consumption, thread drill-down, and limit inspection were
therefore unavailable, not zero.

The AAU images are unchanged Microsoft Learn documentation examples from
`https://learn.microsoft.com/en-us/azure/sre-agent/monitor-agent-usage`,
attributed to Microsoft under CC BY 4.0. They are labelled as references in the
learner guide and must not be represented as this lab's usage.

New assets and provenance are separate from the frozen timed-trial evidence:
`images/prel38-revision/manifest.json` records fresh private capture hashes,
UTC capture times, crops and masks, or documentation source URLs, retrieval
times, licensing and hashes. Browser chrome and account headers are excluded
from public lab images; the resource-list subscription is masked.
The original 72m35s trial, 13m02s guarded-operation total, action CSV and image
manifest remain unchanged. These targeted checks are not a fresh end-to-end
45-minute timing claim, live-guide publication, or Word/LAB720 synchronization.

## Historical options discussed after the original trial

These options predate the numbered revision above. In particular, the user has
now chosen browser-viewable HTML slides and exploration-only optional work;
the old viewer/creation tradeoffs are not pending learner requirements.

| Option | Benefit / tradeoff |
| --- | --- |
| Start cost-task and report generation immediately after their Azure/log prerequisites are ready | Overlaps the observed long waits with onboarding, configuration, and debugging. This was the execution strategy here, but the main guide has not yet been reordered. |
| Keep onboarding conversational review to roughly 3-5 minutes | Preserves the app/architecture learning goal without repeatedly reading every generated section. Do not add another discovery exercise. |
| Keep Health check and report refinement optional | Saves an estimated 2-4 active minutes plus approval/revisit time; neither is necessary to prove search recovery. |
| Keep cost automation required but defer deep slide review until a viewer exists | Preserves scheduling, forecast, savings, and artifact checks without pretending the deck can currently be reviewed in this VM. |
| Make detailed geography/URL analysis optional while retaining graph, key metrics, versions, and sharing | Reduces report-reading time, but also reduces telemetry exploration. No scope reduction has been applied yet. |
| Add a short scheduled-task timezone check | The observed summary omitted timezone; useful before relying on the recurring schedule. |
| Add a short current-health versus historical-failure comparison | Explains why a repaired app can coexist with a red last-24-hour report. Reuse existing evidence rather than creating another workload. |

Next planning gate: decide these PREL38 tradeoffs using the evidence, then measure a fresh-user path. **LAB720's separate 25-minute optimization/publication and Word-manual synchronization have not been performed in this phase.**
