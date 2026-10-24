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

| Lab | Unpublished working guide | Original instruction/media snapshot |
| --- | --- | --- |
| PREL38, pre-Ignite, 45 minutes | [PREL38.md](skillable/instructions/PREL38.md) | [2026-10-24 PREL38](skillable/instructions/backups/2026-10-24/PREL38/content.md) |
| LAB720, Ignite-day, 25 minutes | [LAB720.md](skillable/instructions/LAB720.md) | [2026-10-24 LAB720](skillable/instructions/backups/2026-10-24/LAB720/content.md) |

The working guides use native Skillable Markdown with this page order:
**Start -> Modernization -> ARM/Azure Copilot -> SRE Agent**. No custom theme or
JavaScript is required. Start orders VM login, SRE Agent, then Azure Portal.
The guides contain the full SRE activities from the respective Word manuals,
with the requested setup corrections, explicit import/connection prerequisites,
and named screenshot placeholders. They do not update the Word files.
The SRE sequence is background repository import, configuration review in the
context wizard shown at sign-in, connection of the completed imported repository,
then **Done and go to agent**, the Getting started thread (at most five minutes),
and the remaining exercises. Environment/health findings are reviewed in that
thread, not repeated as a separate discovery exercise. Optional thread-finding
and wizard-navigation fallbacks appear after the main steps under **Need guidance?**.
Configuration review and repository connection stay inside the SRE Agent context
wizard; the review does not require an Azure Portal or Builder detour.

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
Browser-opening commands run in the selected VM using Integration Services,
with address-bar Type Text/manual-entry fallbacks rather than host-browser links.

The existing native Resources cards, including the external SRE link, are
unchanged. The new instructions provide in-VM opening controls; they do not
change where an existing External Link resource opens.

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

1. Finish the team-owned pages and review the screenshot placeholders. Placeholders
   are intentional in these drafts; replacing them with captures is deferred.
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
   image references. Do not paste local disk paths or assume an upload succeeded.
   Account for autosave: a paste can affect live instructions before a separate
   Save Changes click. Do not paste an unapproved or incomplete draft.
6. Allow autosave to finish, use **Save Changes** if enabled, reopen the editor,
   and inspect the rendered learner pages and images. Preserve profile duration,
   Resources, themes, cloud templates, identities, permissions, VM profiles, and
   lifecycle actions. Do not use VM **Commit Changes** for instruction updates.

Source checks:
`node --test skillable\instructions\standard-workflow.test.cjs skillable\instructions\lab-guides.test.cjs`.
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
