# Caldova Retail Ops

Caldova Retail Co. designs and sells gear for trail, camp, and everyday
adventure. This repository is the storefront and lightweight operations
dashboard our team uses to browse the product catalog, search for items,
review daily sales, and manage checkout and recommendations.

## Architecture

- **Backend**: ASP.NET Core Web API (C#, `net8.0`), minimal APIs.
- **Frontend**: Static HTML/CSS/JS served from `wwwroot/`, calling the
  backend's JSON endpoints.
- Both are hosted together as a single ASP.NET Core app.

## Skillable deployment sources

| Lab profile | Cloud template | Versioned source |
|-------------|----------------|------------------|
| [LAB720 (226801)](https://labondemand.com/LabProfile/226801) | [6961](https://labondemand.com/CloudTemplate/6961) | `skillable/LAB720-Caldova-WebAppP1v3-with-SREAgent.json` |
| PREL38 | [6969](https://labondemand.com/CloudTemplate/6969) | `skillable/Caldova-WebAppP1v3-with-SREAgent-MI.json` |

LAB720's source is based on its own served template, not PREL38's template
or the generic files in `skillable/`. Preserve its profile-specific settings.
Template 6961's Used By list contained only LAB720 when updated on 2026-10-24;
check that list again before making future changes.

For future LAB720 deployments, the SRE Agent's user-assigned managed identity
receives Azure Contributor at the lab subscription scope. The deployment
principal therefore needs permission to create subscription-level role
assignments. Telemetry roles, the managed resource group, Review/Low agent
settings, and the separate learner-access lifecycle script are unchanged.
Agent Reader/Privileged resource modes are distinct from Azure RBAC.
Updating this template does not grant roles in existing lab instances or
publish the DOCX lab instructions to Skillable.

## Skillable instruction authoring

Author Markdown in this repository, review it, then **manually publish** the
approved content to Skillable. GitHub synchronization is not configured by this
workflow. Saving or merging a file here does not change a live lab.

| Lab | Working guide | Original instruction/media snapshot |
| --- | --- | --- |
| PREL38, pre-Ignite, 45 minutes | [PREL38.md](skillable/instructions/PREL38.md) | [2026-10-24 PREL38](skillable/instructions/backups/2026-10-24/PREL38/content.md) |
| LAB720, Ignite-day, 25 minutes | [LAB720.md](skillable/instructions/LAB720.md) | [2026-10-24 LAB720](skillable/instructions/backups/2026-10-24/LAB720/content.md) |

The working guides use native Skillable Markdown with this page order:
**Start -> Modernization -> ARM/Azure Copilot -> SRE Agent**. No custom theme or
JavaScript is required. PREL38 now begins with opening `https://sre.azure.com`
inside the VM and selecting the assigned agent. VM and Azure Portal sign-in
instructions are delegated to Resources instead of repeated in the guide.
Shared GitHub/Copilot setup remains on Start. SRE sign-in uses Temporary Access
Pass (TAP) from Resources by default, with password guidance at the end and no
inline credential table or duplicate sign-in section on the final SRE page.
LAB720 and the shared reference retain their previous setup until reviewed.
The guides contain the SRE activities with the requested setup corrections and
explicit import/connection prerequisites. PREL38 has been revised and exercised
against the running lab; LAB720 retains its earlier draft and named screenshot
placeholders. These Markdown changes do not update the Word files.
The SRE sequence is background repository import, configuration review in the
context wizard shown at sign-in, connection of the completed imported repository,
then **Done and go to agent**, the Getting started thread (at most five minutes),
and the remaining exercises. Environment/health findings are reviewed in that
thread, not repeated as a separate discovery exercise. A short note at the top
points learners to **Additional guidance** at the end or to the facilitator.
Optional help is collected there by section, including sign-in and browser
fallbacks, thread/wizard navigation, and task/report troubleshooting, rather
than interrupting the main instructions. Required approval and verification
steps stay in the main flow.
Configuration review and repository connection stay inside the SRE Agent context
wizard; the review does not require an Azure Portal or Builder detour.
PREL38 stays on **Quickstart** for **Azure resources -> Show details** and
**Logs -> Show details**. Learners review only the configured resource group and
connected log sources. An optional note lets them explore **+** under either card,
then close or cancel without adding scopes or connectors. LAB720 and the shared
reference retain the earlier Full setup review pending approval.
Repository setup uses **Code -> + -> GitHub**,
the imported repository URL, **OAuth -> Sign in to GitHub**, consent,
**Next -> Save**, and **Code -> Show details** to verify the saved entry.

The four detail images in `skillable/instructions/images/context-wizard/` are cropped
from the existing authorized PREL38 learner VM on 2026-10-24. Browser chrome,
account headers, and credentials are excluded; the subscription value and
saved repository URL are masked in black. The import completed with source files
visible, OAuth showed **Connected to GitHub** after user-approved consent,
and the saved repository survived a reload. Its Status cell showed a dash;
this does not establish completed indexing or source-code retrieval.
LAB720 reuses explicitly labelled PREL38 examples and still needs its own
runtime check before publication.

The separate `overview.png` is cropped from the user's context-wizard screenshot
provided on 2026-10-25. It shows **More context. Better investigations.**,
**Quickstart**, the unconnected Code card, and part of Logs. Its account/agent
header is excluded. It illustrates the opening section, not a new agent-side
capture or evidence that fresh sign-in was rerun.

The user also supplied `repository-connection.png` on 2026-10-25. This already
cropped **Add repositories** dialog contains no account details and is preserved
unchanged before the OAuth and saved-repository images in PREL38. It illustrates
provider selection and the Repository URL field, not OAuth or indexing success.

The user selected `images/getting-started/thread-overview.png` from an earlier
onboarding-thread capture for the Getting started section. Its account/agent
header is cropped out and the account name in the greeting is masked.
This example predates the revised repository-first flow, so its suggestions
to connect more sources are not a statement of the current lab's configuration.
It is separate from the timed trial and does not supply the missing full
architecture-diagram capture.

The two images in `skillable/instructions/images/github-import/` show the
destination fields and import progress from the earlier 2026-10-24 setup.
Browser chrome and account headers are excluded, and the destination account
name is masked. They are not new captures or part of the timed trial.

The [PREL38 walkthrough](skillable/instructions/PREL38-walkthrough.md) records
the actual actions, UTC timings, cropped screenshots, gaps, and separately
labelled human-time estimates. Its 72-minute operator trial includes
facilitator repairs, tooling/evidence overhead, overlapping work, and delayed
approvals; it is not a measured 45-minute human completion. Fresh setup, slide
review without a compatible viewer, and the other teams' pages remain outside
that timing claim. LAB720's 25-minute optimization is deferred for discussion.

PREL38 starts configuration inquiry in **New chat**, separate from Getting
started, and keeps the optional `/api/health` change in that configuration
thread. Debugging provides the full learner-specific app URL through
`@lab.Variable(CaldovaWebAppUrl)`, with native text entry into the VM browser.
Learners do not need to find a hostname or ask the agent for their URL.
An existing T56 capture illustrates the configuration response in
`images/app-configuration/default-hostname.png`, not a required URL lookup.
There is no separate repository-readiness exercise before debugging.
Debugging must repair the running app and return real `jacket`
products; an undeployed code PR or empty result is not recovery. Cost automation
and live-report generation overlap other activities, with explicit checks for
pending questions/approvals and completed artifacts. Report versions and sharing
are required; conversational refinement remains optional at the end.

The expanded source adds **Settings -> Agent consumption** with per-thread AAU
review, execution-thread inspection, filtered CSV export, and active-flow
allocation controls. Budget changes are deferred until the other exercises
finish and require a facilitator-approved value. Always-on charges and other
Azure resource costs are not covered by the active-flow limit. Additional
guidance contains optional skill, custom-agent, incident-source, and narrowly
filtered Review-mode response-plan exercises, including turning off the new
test plan. These additions have not been runtime-tested or retimed, and have
not replaced the earlier live Skillable revision. The walkthrough retains its
original measurement baseline and explicitly distinguishes this expansion.

The PREL38 deployment source seeds the package's actual search failure using
`Catalog__AsOfDate=2026-12-15` and probes
`/api/search/by-name?name=jacket`, replacing the unused fault flag and old
`/YSOD.aspx` probe. These are the only three template-variable changes.
Source/package validation, repair of an existing instance, and publication of
hosted cloud template 6969 are separate operations; do not treat one as proof
of the others. Template 6969 was subsequently published and independently
downloaded to verify exactly those three changes, after confirming PREL38
profile 224911 is its sole consumer. A new lab deployment remains untested.
The refreshed PREL38 learner page shows seven images without authoring warnings;
its actual native configuration-prompt typing control was exercised in the VM.

PREL38 already has the GHE group assignment and GH-Sync action used by LAB720;
enterprise SSO worked for the running PREL38 lab account. No provisioning
groups or existing GHE lifecycle scripts were changed. LAB720's additional `_Skillable-E7`
group has not been established as necessary for this flow and was not copied.

The existing shared GitHub/Copilot setup is retained for each lab. PREL38 also
retains its ARM MCP setup and the owning team's existing placeholder. Neither
export supplied Modernization exercises; LAB720 supplied no ARM exercise.
These missing team pages are explicitly marked, not invented. The legacy
PREL38 course-recommendations/response-plan exercise remains in its immutable
snapshot; the working guide uses the newer App Service/product-search scenario.
Do not publish over another team's newer live content.

`skillable/instructions/standard-workflow.md` is the earlier shared setup
reference, not the complete working guide or a publication target.

Credentials use runtime tokens and native Type Text controls. TAP continues
to use the existing Resources control; no unverified TAP token is introduced.
PREL38 consistently offers copy/paste, manual typing, or clicking native text
after selecting the destination VM field. Its address-bar flow does not rely
on a browser-launch command. LAB720 and the shared reference retain their
guest-browser commands until reviewed. Earlier rendering/native-input checks
do not establish a fresh end-to-end run of the revised instructions.

The existing native Resources cards, including the external SRE link, are
unchanged. The new instructions provide in-VM opening controls; they do not
change where an existing External Link resource opens.

PREL38 was manually published as a live preview on 2026-10-24; the team-owned
placeholders remain. LAB720 has not been published by this workflow. Revisions
are reviewed section by section before updating the live PREL38 preview.

### Automatic learner-specific app URL

Skillable documents [setting lab variables from lifecycle actions](https://docs.skillable.com/docs/variables-1)
with `Set-LabVariable` and displaying them using `@lab.Variable(name)`.
The ARM template's `webAppUrl` output alone does not populate an instruction token.

PREL38 profile **224911** contains the separate **Publish Caldova app URL**
action (**187064**), **disabled while live verification is deferred**. It was
initially saved through the supported authoring UI. A full-profile export at
**2026-10-25 19:03:13 UTC** verified the then-current script, all four original
lifecycle actions unchanged, and all other profile settings and instructions
unchanged.

For this binding, use an **Execute Script in Cloud Platform** action targeting the lab's
assigned Azure subscription. Use **Post-Build**, **Blocking**, and the Azure
PowerShell runtime, after the resource template has finished. Paste
[`skillable/Set-CaldovaWebAppUrl.ps1`](skillable/Set-CaldovaWebAppUrl.ps1)
as the command. Preserve all existing lifecycle actions and their settings.
Configure an error notification explaining that the application URL could not
be prepared; do not hide a failed action behind a fixed or guessed URL.

The script checks the assigned subscription and resource group, requires exactly
one Caldova App Service, and sets `CaldovaWebAppUrl` from its actual
`DefaultHostName`, the same Azure-returned value used by the ARM output.
The resource-group token uses the profile's alias,
`@lab.CloudResourceGroup(ResourceGroup1).Name`, not a numeric ordinal.
It performs no Azure resource or RBAC writes and supports regional hostnames.
It must run in Skillable's cloud action environment, which supplies both the
Azure context and `Set-LabVariable`, not in a learner terminal or on the host.
Do not prefill the variable with an example URL.

Current-instance checks reached the cloud runner but exposed Azure module
information being reported as an error, followed by an invalid resource-group
binding. The repository script now suppresses only Azure informational output
and uses the correct profile alias. The corrected script is saved in the
**disabled** live action but is **not runtime-verified**. Post-Build execution
on a new lab has not been tested.

URL debugging is deferred. The temporary verification heading, URL control,
and activity were removed, and the original native guide was restored.
An independent full-profile export at **2026-10-25 22:19:23 UTC** verified
zero activities, all four original lifecycle actions unchanged, all other
profile fields unchanged, and all 47 media/export entries byte-identical.
Publisher **187064.Enabled = false** prevents the unverified action from
delaying new lab launches. A later export at **22:28:47 UTC** verified the
corrected script saved in that disabled action, with all other profile fields
unchanged. A proposed new verification activity was cancelled without saving;
no new activity or instruction controls were published.

The current PREL38 review draft asks the agent for the full HTTPS website link
alongside the App Service configuration. Learners open it and bookmark or copy
the URL for the search-debugging exercise. If the link is missing or does not
open, Additional guidance provides the manual route: **Azure Portal > Resource
groups > assigned resource group > caldova-webapp-... (App Service) > Overview >
Default domain / Browse**. Its URL example is illustrative only; learners use
their app's complete default domain. This flow does not depend on the disabled
publisher. Do not enable that action
without a successful supported runtime check. No replacement lab was launched,
and the broader review draft remains unpublished.

### Facilitator preparation: PowerPoint and Azure MCP in the VM

**Prefer a prepared VM image over installation during learner time.** Neither
software installation nor related VM lifecycle/image changes are included in this
instruction revision.

For **PowerPoint**, ask the VM/image owner for an approved Office-enabled lab
image, or install Microsoft 365 Apps with PowerPoint in the image using the
[Office Deployment Tool](https://learn.microsoft.com/en-us/microsoft-365-apps/deploy/overview-office-deployment-tool).
Use the Office Customization Tool to generate the installation configuration
for the organization's licensed product, then run the ODT's
`.\setup.exe /download configuration.xml` and
`.\setup.exe /configure configuration.xml` during image preparation. Validate
that a generated `.pptx` opens without a license or first-run blocker before
capturing the image using the VM platform's supported image process. Do not
capture signed-in Office sessions, activation tokens, or credentials.

Installation does not grant a license. Confirm the lab users' Office
entitlements with Skillable/the licensing owner; Azure sign-in and a Temporary
Access Pass do not establish a Microsoft 365 Apps license. For shared-computer
deployments, use an eligible license and
[shared computer activation](https://learn.microsoft.com/en-us/microsoft-365-apps/licensing-activation/overview-shared-computer-activation)
when applicable; every user still needs the required entitlement. If desktop
Office licensing is unavailable, choose and test an approved viewing alternative
before requiring slide review. Do not send learners to a personal account or an
unapproved upload service.

A [Skillable lifecycle action](https://docs.skillable.com/docs/life-cycle-actions-5)
can install guest software: **Lab Profile -> Advanced -> Life Cycle Actions ->
Add Life Cycle Action -> Execute Script in Virtual Machine**, targeting
`Win11-Pro-Base`. This requires Skillable Integration Services **and a logged-in
guest session**; Post-Build alone does not guarantee either. Coordinate a ready
session/build sequence with the VM owner, use Blocking and an appropriate
timeout/error action, and make the script idempotent with explicit installer
exit-code checks. A cloud-platform script runs in the cloud context, not the
desktop VM. Large Office downloads and activation make an installation LCA less
predictable than an image; do not make learners wait for it during the exercise.

For **Azure MCP Server in VS Code**, the
[official extension](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/get-started/tools/visual-studio-code)
is the simplest option. Preinstall it in the image, or use a guest lifecycle
script running in the **actual learner's Windows profile**:

```powershell
code --install-extension ms-azuretools.vscode-azure-mcp-server
code --list-extensions
```

Validate the extension appears in the learner's VS Code, select Copilot
**Agent** mode, enable the Azure MCP tools, and perform a read-only lab resource
query after the learner signs in with the lab Azure account. Check the actual
account/subscription before using tools. Do not bake Azure/GitHub credentials
into the image or assume installation performs authentication. Test and pin
the extension/package version for event reproducibility; do not rely on an
untested latest-version download during every lab startup. If using the
documented npm configuration instead, provision its Node.js/runtime
prerequisites as well.

This is **Azure MCP Server**, not an automatic replacement for the ARM MCP
server in the other team's module. A VM-local MCP server also does not
automatically become a connector for the hosted SRE Agent; that requires a
separately supported connection. Preserve the existing ARM module until its
owner approves a change.

The current Caldova ARM template provisions the app/observability/SRE resources,
**not a `Microsoft.Compute/virtualMachines` desktop**. It therefore cannot
install PowerPoint or VS Code extensions in the separate Skillable VM. An
Azure-hosted VM deployed by a different template can use a supported guest
extension/bootstrap, but that is a separate infrastructure change, not an
addition to this app template.

### Backups and rollback

The dated snapshots contain exact UTF-8 instruction text and all exported
media: 40 PREL38 images and one LAB720 image. Each `manifest.json` records the
profile/instruction-set IDs, private source archive hash, instruction hash,
and every media hash. The source exports were preserved privately; full-profile
exports, account metadata, credentials, and authentication files are not added
to this repository. Media was screened locally before copying.
Snapshot Markdown is excluded from Git newline conversion so its recorded
content hash survives checkout on both Windows and Linux.

Do not edit a dated snapshot. Make a new snapshot before each approved live
publication and compare it with the working guide to preserve concurrent edits.
These exports are baselines from 2026-10-24, not proof of the current live state.

To roll back instruction content, republish the matching snapshot's `content.md`
through the instruction editor. Its `instructions<ID>/...` references target
the original hosted media. If any media is missing, upload the matching backed-up
files and use the paths returned by Skillable. A different instruction set may
require different paths. This rollback restores instructions/media only, not
infrastructure or profile configuration.

### Manual publication

1. Finish the team-owned pages and replace the remaining screenshot placeholders.
   Review the PREL38 setup captures and verify the same flow in LAB720.
   Confirm the intended lab's duration and activity scope before delivery.
2. Use an existing authorized lab in corporate Edge. For PREL38, the running
   lab's **Settings -> Developer Tools -> Edit Instructions** route opened a
   writable editor on 2026-10-24, even though the profile-side route returned
   Access Denied. Verify the target profile and instruction set before editing:
   PREL38 **224911 / 359549**, LAB720 **226801 / 362436**. LAB720's running-lab
   route has not yet been verified. A new lab launch requires authorization.
   If the supported route denies access, stop and ask the organization
   administrator to check **Organization Instruction Editor** and organization
   scope; do not work around the denial.
3. Back up current instructions and media using **Export -> Lab Metadata:
   Instructions Only**. Keep full-profile backups private. Review and reconcile
   any live changes since the dated snapshot, especially other teams' sections.
4. With approval, preview on isolated profile **226994** before event publication.
   Confirm `Win11-Pro-Base` and the Azure credential tokens in the token picker.
   Verify VM browser opening, focused-field credential typing, actual SRE
   navigation, and GitHub OAuth with the lab account. Source checks alone do not
   establish any of these runtime behaviors.
5. In **Edit Instructions -> Code**, publish only the approved lab's Markdown.
   Upload new screenshots through the media control and use Skillable's returned
   image references. Repository-relative `images/context-wizard/...` paths are
   for source preview only: replace each with the actual hosted reference
   returned by Skillable before publication. Do not invent hosted paths, paste
   local disk paths, or assume an upload succeeded.
   Account for autosave: a paste can affect live instructions before a separate
   Save Changes click. Do not paste an unapproved or incomplete draft.
6. Allow autosave to finish, use **Save Changes** if enabled, reopen the editor,
   and inspect the rendered learner pages and images. Preserve profile duration,
   Resources, themes, cloud templates, identities, permissions, VM profiles, and
   lifecycle actions. Do not use VM **Commit Changes** for instruction updates.

Source checks:
`node --test skillable\instructions\standard-workflow.test.cjs skillable\instructions\lab-guides.test.cjs skillable\instructions\prel38.test.cjs`.
These check source structure, activity coverage, backup hashes, and safety
constraints, not Skillable rendering or successful VM input. The earlier
custom-theme experiment is separate and is not required here.

References:
[Skillable Markdown](https://docs.skillable.com/docs/creating-instructions-with-markdown-syntax),
[Skillable authoring roles](https://docs.skillable.com/docs/studio-user-roles),
[SRE setup](https://learn.microsoft.com/en-us/azure/sre-agent/complete-setup),
[SRE repository connection](https://learn.microsoft.com/en-us/azure/sre-agent/connect-source-code),
[SRE scheduled tasks](https://learn.microsoft.com/en-us/azure/sre-agent/create-scheduled-task),
[SRE live reports](https://learn.microsoft.com/en-us/azure/sre-agent/live-reports).

## Running locally

```powershell
dotnet run
```

Then open `http://localhost:5000` (or the URL printed on startup).

## Features

- **Catalog** — browse the full product catalog in a paginated table, or
  search for a product by name.
- **Checkout** — view a simulated order confirmation.
- **Reports** — daily sales summaries.
- **Recommendations** — personalized product suggestions for a given
  customer.
- **About / Contact** — general store information.

## API endpoints

| Route                                   | Description                          |
|------------------------------------------|----------------------------------------|
| `GET /api/health`                        | Liveness check                        |
| `GET /api/status`                        | Uptime and runtime info               |
| `GET /api/checkout`                      | Simulated checkout                    |
| `GET /api/search?page=`                  | Paginated catalog browse              |
| `GET /api/search/by-name?name=&page=`    | Search the catalog by product name    |
| `GET /api/reports?day=`                  | Daily sales report (1=Mon ... 7=Sun)  |
| `GET /api/recommendations?customerId=`   | Personalized recommendations          |
| `GET /api/ping`                          | Simple liveness/load endpoint         |
| `GET /api/version`                       | Service/runtime version info          |
| `GET /api/store-locator?zip=`            | Nearby store lookup                   |
| `GET /api/inventory-summary`             | Warehouse inventory summary           |
