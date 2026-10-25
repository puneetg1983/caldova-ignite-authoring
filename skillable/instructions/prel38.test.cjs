const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const source = readFileSync(join(__dirname, "PREL38.md"), "utf8").replace(/\r\n/g, "\n");
const visible = source.replace(/<!--[\s\S]*?-->/g, "");
const pages = visible.split(/\r?\n===\r?\n/);
const sre = pages[3];
const [main, guidance] = sre.split("## Additional guidance");
const section = heading => main.split(`## ${heading}\n`)[1]?.split("\n## ")[0];
const prompts = [...source.matchAll(/^\+{4}([^\r\n]+)\+{4}$/gm)].map(match => match[1]);
const template = JSON.parse(readFileSync(join(__dirname, "..",
    "Caldova-WebAppP1v3-with-SREAgent-MI.json"), "utf8"));

test("PREL38: identity and four native pages remain; authoring labels are hidden", () => {
    assert.match(source, /profile 224911, instruction set 359549/);
    assert.deepEqual(pages.map(page => page.match(/^# (.+)$/m)?.[1]),
        ["Start", "Modernization", "ARM/Azure Copilot", "SRE Agent"]);
    assert.doesNotMatch(visible, /Screenshot placeholder|Authoring placeholder|STEVEN TODO|UNPUBLISHED|SRE lab duration:|No new per-exercise|maximum 5 minutes/);
    assert.match(pages[0], /Need help\? See \*\*Additional guidance\*\* at the end/);
    assert.equal(pages[0].match(/^## (.+)$/m)?.[1], "1. Open Azure SRE Agent");
    assert.doesNotMatch(source, /## (?:\d\. )?Sign in to the lab VM|## (?:\d\. )?Azure Portal/);
    assert.doesNotMatch(sre, /## Sign in to Azure SRE Agent/);
    assert.match(sre, /Return to the SRE Agent tab opened on Start/);
});

test("PREL38: starts with an in-VM SRE URL and delegates VM/Azure prerequisites to Resources", () => {
    assert.match(pages[0], /VM access and Azure sign-in details are already provided in \*\*Resources\*\*/);
    assert.match(pages[0], /\*\*Microsoft Edge inside the lab VM\*\*.*address bar/);
    assert.ok(pages[0].includes("+++https://sre.azure.com+++"));
    assert.match(pages[0], /Press \*\*Enter inside the VM\*\*/);
    assert.match(pages[0], /\*\*Azure account\*\* in \*\*Resources > Azure Portal\*\*, not the VM account/);
    assert.match(pages[0], /At \*\*Temporary Access Pass\*\*, use the \*\*TAP\*\* control in Resources/);
    assert.match(pages[0], /\*\*More context\. Better investigations\.\*\* with \*\*Quickstart\*\* selected/);
    assert.match(pages[0], /Keep this \*\*context wizard\*\* open/);
    assert.ok(pages[0].includes("images/context-wizard/overview.png"));
    assert.doesNotMatch(source, /@lab\.VirtualMachine|@lab\.CtrlAltDelete|VM username \||VM password \|/);
    assert.doesNotMatch(source, /Azure password \||@lab\.CloudPortalCredential|@lab\.[^\s+]*TAP/i);
    assert.match(guidance, /Password requested instead of TAP/);
    assert.match(guidance, /Focus the destination field \*\*inside the VM\*\*/);
    assert.match(guidance, /keep it focused until typing finishes/);
    assert.doesNotMatch(source, /https:\/\/portal\.azure\.com\/#home|Start-Process msedge/);
    assert.match(guidance, /Type `https:\/\/sre\.azure\.com` manually/);
});

test("PREL38: all chat prompts use native Copy and Type Text, not static fences", () => {
    assert.equal(prompts.length, 9);
    assert.doesNotMatch(source, /^```text$/m);
    assert.equal((source.match(/^\+{4}/gm) || []).length, prompts.length);
    for (const line of source.split("\n").filter(line => line.startsWith("+++"))) {
        const wrapped = line.match(/^(\+{3,4})(?!\+)(.*?)(\+{3,4})$/);
        assert.ok(wrapped, `Invalid native typing control: ${line}`);
        assert.equal(wrapped[1], wrapped[3], `Mismatched native typing delimiters: ${line}`);
    }
    for (const prompt of prompts) {
        assert.ok(prompt.length < 650, `Overlong prompt: ${prompt}`);
        assert.doesNotMatch(prompt, /@lab\.|<suffix>/);
    }
    assert.ok(prompts.includes("List the configuration of the Caldova App Service."));
});

test("PREL38: Quickstart review and background import precede repository connection", () => {
    const review = section("Review Azure resources and telemetry before connecting GitHub");
    assert.match(review, /Stay on \*\*Quickstart\*\*/);
    assert.match(review, /GitHub is \*\*not connected yet\*\*/);
    assert.match(review, /configured \*\*Resource group\*\*\. Leave it unchanged/);
    assert.doesNotMatch(review, /Full setup|Builder|review.*\*\*Subscription\*\*/);
    for (const label of ["Azure resources", "Logs"]) {
        assert.ok(review.includes(`Under **${label}**, click **Show details**`));
        assert.ok(review.includes(`Click **+** under **${label}**`));
    }
    assert.equal((review.match(/Close or cancel without adding anything/g) || []).length, 2);
    assert.match(section("Start the GitHub import in the background"), /without waiting/);
    assert.ok(main.indexOf("## Start the GitHub import") < main.indexOf("## Connect the imported repository"));
    assert.ok(main.indexOf("## Connect the imported repository") < main.indexOf("## Review the Getting started thread"));
});

test("PREL38: OAuth uses the imported lab repository and retains source-readiness gate", () => {
    const connection = section("Connect the imported repository");
    assert.equal((connection.match(/^\d\. /gm) || []).length, 5);
    for (const control of ["Code", "GitHub", "Repository URL", "OAuth", "Sign in to GitHub",
        "Authorize Azure-SRE-Agent", "Connected to GitHub", "Next", "Save", "Show details"]) {
        assert.ok(connection.includes(`**${control}**`), control);
    }
    assert.match(connection, /https:\/\/github\.com\/User1-12345678_events\/caldova-ignite-authoring/);
    assert.match(connection, /Replace the example username/);
    assert.match(connection, /Confirm the repository connection is ready/);
    assert.deepEqual([...connection.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]),
        ["repository-connection.png", "github-oauth.png", "repository-saved.png"]
            .map(name => `images/context-wizard/${name}`));
    assert.doesNotMatch(connection, /Builder|Azure Portal/);
});

test("PREL38: background import has destination and progress screenshots", () => {
    const importing = section("Start the GitHub import in the background");
    assert.match(importing, /\*\*GitHub Enterprise \(GHE\) lab account\*\* configured in \*\*Start > GitHub and Copilot\*\*, not a personal GitHub account/);
    assert.match(importing, /Under \*\*Owner\*\*, select the \*\*same GHE lab account\*\*/);
    assert.match(importing, /visibility to \*\*Private\*\*/);
    assert.match(importing, /\*\*Begin import\*\*.*without waiting/);
    for (const file of ["destination.png", "progress.png"]) {
        const path = `images/github-import/${file}`;
        assert.ok(importing.includes(path), path);
        const png = readFileSync(join(__dirname, ...path.split("/")));
        assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        assert.ok(png.readUInt32BE(16) >= 600 && png.readUInt32BE(16) < 1779, path);
        assert.ok(png.readUInt32BE(20) >= 250, path);
    }
});

test("PREL38: Getting started has its time guidance in a note, not the heading", () => {
    const gettingStarted = section("Review the Getting started thread");
    assert.match(gettingStarted, /> \[!Note\] Spend up to 5 minutes here/);
    assert.match(gettingStarted, /\*\*Done and go to agent\*\*, then review your \*\*Getting started\*\* thread/);
    assert.match(gettingStarted, /application summary, architecture diagram, and health findings/);
    assert.match(gettingStarted, /Answer any open questions/);
    assert.ok(prompts.includes("What is this app about, and what can customers do with it?"));
    assert.doesNotMatch(gettingStarted, /Search Threads|Favorites|Operations hub|discovery/i);
});

test("PREL38: configuration inquiry is required; health-check change is optional and separate", () => {
    const configuration = section("Inquire and configure Web App");
    assert.match(configuration, /\*\*New chat\*\*.*separate configuration thread, not the Getting started thread/);
    assert.doesNotMatch(configuration, /In the same Getting started thread/);
    assert.match(configuration, /Keep this configuration thread for the app URL and optional Health check/);
    assert.match(configuration, /Health check configuration exercise is optional/);
    assert.doesNotMatch(main, /configure.*Health check path to \/api\/health/i);
    assert.match(guidance, /### Optional: App Service Health check/);
    assert.match(guidance, /successful endpoint response, restart impact, and rollback/);
    assert.match(guidance, /This endpoint does not detect the search fault/);
});

test("PREL38: debugging uses one natural prompt and verifies the original symptom", () => {
    const debug = section("Debug the product-search failure");
    assert.match(debug, /agent can retrieve source files/);
    assert.match(debug, /configuration response in the \*\*VM browser\*\*/);
    assert.match(debug, /`jacket`.*\*\*Search\*\*.*\*\*500 - Search failed\*\*/);
    assert.ok(prompts.includes("Product search fails with HTTP 500, but browsing works. Find out why, fix the running app, and check that searching for jacket returns products."));
    assert.equal((debug.match(/^\+{4}/gm) || []).length, 1);
    assert.match(debug, /repeat the same `jacket` search/);
    assert.match(debug, /catalog browsing still works/);
    assert.doesNotMatch(debug, /Review mode|Catalog__AsOfDate|Default domain/);
    assert.match(guidance, /Automatic URL population is not required to continue/);
    assert.match(guidance, /A source-code pull request is not a deployment/);
    assert.match(guidance, /Returning an empty result set is not recovery/);
    assert.doesNotMatch(source, /@lab\.CloudResourceTemplate.*Outputs|@lab\.Variable\(CaldovaAppUrl\)/);
});

test("PREL38: recurring cost review is created in chat, includes forecasts, and overlaps report work", () => {
    const cost = section("Schedule a weekly cost review");
    assert.match(cost, /\*\*New chat\*\*/);
    assert.doesNotMatch(cost, /Create task|New task|Frequency|scheduling questions|short PowerPoint/);
    for (const text of ["forecast next month", "recommend ways to save money", "beautiful, visually rich PowerPoint",
        "charts, tables", "label estimates and assumptions", "don't change any resources"]) {
        assert.ok(cost.includes(text), text);
    }
    assert.match(cost, /age of the lab, not a limitation of the agent/);
    assert.match(cost, /answer \*\*any questions from the agent\*\*/);
    assert.match(cost, /If no run has started, select \*\*Run task now\*\*/);
    assert.match(cost, /Once \*\*Weekly Caldova cost review\*\* appears/);
    assert.match(cost, /\*\*Don't wait for completion\.\*\*/);
    assert.match(cost, /latest execution thread/);
});

test("PREL38: report puts dependency health first; versions and sharing are required, iteration optional", () => {
    const report = section("Create a live traffic and health report");
    assert.match(report, /\*\*Live reports > \+ New report\*\*/);
    assert.match(report, /\*\*Enter a custom response\*\*/);
    assert.match(report, /Put a dependency graph at the top/);
    assert.match(report, /Label missing data and unknown health/);
    assert.match(report, /keep it read-only/);
    assert.match(report, /report-saving approval.*expected read-only telemetry tools/);
    assert.match(report, /\*\*Don't wait for completion\.\*\*/);
    assert.match(report, /Finish other pending activities/);
    assert.match(report, /\*\*version picker\*\*/);
    assert.match(report, /If an earlier version exists/);
    assert.match(report, /\*\*Copy link to report\*\*/);
    assert.match(report, /sharing the link does not grant access/);
    assert.doesNotMatch(report, /Reload|Builder|Open authoring thread/);
    assert.match(guidance, /### Optional: Keep improving your live report/);
    assert.match(guidance, /\*\*Live reports > Caldova Traffic and Health > Open authoring thread\*\*/);
    assert.ok(guidance.indexOf("### Optional: Keep improving") > guidance.indexOf("### Optional: App Service"));
});

test("PREL38: extra help is compiled once at the end and does not claim missing data is healthy", () => {
    assert.equal((source.match(/^## Additional guidance$/gm) || []).length, 1);
    assert.ok(main.indexOf("## Complete") > main.indexOf("## Create a live traffic and health report"));
    assert.doesNotMatch(main, /Operations hub > Overview|Search Threads|Browser did not open/);
    assert.match(guidance, /Missing data or unknown dependency health does not mean the app is healthy/);
    assert.match(guidance, /Do not start a duplicate run/);
    assert.match(guidance, /rather than relying on the run status alone/);
    assert.match(guidance, /check the report's authoring thread for pending questions or approvals/);
    assert.match(guidance, /saving the report does not change Azure resources/);
    assert.match(main, /Record anything still running or blocked/);
});

test("PREL38: consumption review drills into execution threads and separates AAU limits from Azure costs", () => {
    const consumption = section("Review agent consumption and the AAU budget");
    assert.ok(main.indexOf("## Review agent consumption") > main.indexOf("## Create a live traffic"));
    assert.ok(main.indexOf("## Complete") > main.indexOf("## Review agent consumption"));
    for (const control of ["Settings > Agent consumption", "Consumption by thread",
        "Chats", "Scheduled tasks", "Refresh", "Download", "Change AAU allocation"]) {
        assert.ok(consumption.includes(`**${control}**`), control);
    }
    assert.match(consumption, /Click a thread title/);
    assert.match(consumption, /execution thread, not just the chat that created the schedule/);
    assert.match(consumption, /close without saving/);
    assert.match(consumption, /always-on.*separate/s);
    assert.match(guidance, /500 to 1,000,000/);
    assert.match(guidance, /Increases take effect immediately; decreases apply next month/);
    assert.match(guidance, /Do not lower the allowance while lab work is still running/);
    assert.match(guidance, /does not cap the separate always-on charge or other Azure resource charges/);
    assert.match(guidance, /Do not stop or delete the assigned agent/);
});

test("PREL38: optional skills and custom agents have explicit creation and verification steps", () => {
    assert.match(guidance, /### Optional: Create a search-check skill/);
    assert.match(guidance, /\*\*Builder > Agent Canvas > Create > Skill\*\*/);
    assert.match(guidance, /`SKILL\.md`.*frontmatter/);
    assert.match(guidance, /confirm `caldova-search-check` appears/);
    assert.match(guidance, /Verify the agent loads the skill/);
    assert.match(guidance, /\*\*Builder > Agent Canvas > Create > Custom Agent\*\*/);
    assert.match(guidance, /\*\*Choose skills\*\*.*only `caldova-search-check`/);
    assert.match(guidance, /empty selection inherits global tools/);
    assert.match(guidance, /read-only tools are unavailable, cancel/);
    assert.match(guidance, /\*\*Test playground\*\*/);
    assert.match(guidance, /type `\/agent` and select `caldova-search-reviewer`/);
    assert.doesNotMatch(main, /## Optional:|SKILL\.md|Create > Custom Agent/);
});

test("PREL38: optional incident setup restricts alerts, explicitly selects Review, and disables its own test plan", () => {
    assert.match(guidance, /### Optional: Configure incident management/);
    assert.match(guidance, /\*\*Connect an incident platform > Choose platform > Azure Monitor\*\*/);
    assert.match(guidance, /Save\*\* only after the facilitator confirms isolated lab alerts/);
    assert.match(guidance, /Do not change pre-existing\/shared plans/);
    assert.match(guidance, /### Optional: Configure an incident response plan/);
    assert.match(guidance, /\*\*Title contains\*\* to `caldova-lab-search`/);
    assert.match(guidance, /\*\*Agent autonomy level > Review\*\*; new plans default to Autonomous/);
    assert.match(guidance, /cooldown\*\* enabled/);
    assert.match(guidance, /filters do not overlap another enabled plan/);
    assert.match(guidance, /empty preview is not proof of successful routing/);
    assert.match(guidance, /trigger the approved test alert without breaking the app/);
    assert.match(guidance, /select only `caldova-search-review`.*\*\*Turn off > Yes\*\*/);
    assert.match(guidance, /Do not disable other plans/);
});

test("PREL38: facilitator preparation distinguishes licensed VM software from the app ARM deployment", () => {
    const readme = readFileSync(join(__dirname, "..", "..", "README.md"), "utf8");
    assert.match(readme, /Facilitator preparation: PowerPoint and Azure MCP in the VM/);
    assert.match(readme, /Installation does not grant a license/);
    assert.match(readme, /Integration Services \*\*and a logged-in/);
    assert.match(readme, /actual learner's Windows profile/);
    assert.match(readme, /code --install-extension ms-azuretools\.vscode-azure-mcp-server/);
    assert.match(readme, /do not bake Azure\/GitHub credentials/i);
    assert.match(readme, /not a `Microsoft\.Compute\/virtualMachines` desktop/);
    assert.doesNotMatch(JSON.stringify(template), /Microsoft\.Compute\/virtualMachines/i);
});

test("PREL38: image links resolve and the original 40-image snapshot remains byte-identical", () => {
    for (const match of source.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
        assert.ok(existsSync(join(__dirname, ...match[1].split("/"))), match[1]);
    }
    const backup = join(__dirname, "backups", "2026-10-24", "PREL38");
    const manifest = JSON.parse(readFileSync(join(backup, "manifest.json"), "utf8"));
    const hash = bytes => createHash("sha256").update(bytes).digest("hex");
    assert.equal(manifest.profile_id, 224911);
    assert.equal(manifest.instruction_set_id, 359549);
    assert.equal(hash(readFileSync(join(backup, "content.md"))), manifest.content_sha256);
    assert.equal(manifest.media.length, 40);
    for (const image of manifest.media) {
        assert.doesNotMatch(image.path, /(^|\/)\.\.(\/|$)|^[\\/]/);
        assert.equal(hash(readFileSync(join(backup, ...image.path.split("/")))), image.sha256);
    }
});

test("PREL38: deployment seeds and probes the actual search failure without changing MI permissions", () => {
    assert.equal(template.variables.faultSettingName, "Catalog__AsOfDate");
    assert.equal(template.variables.faultSettingValue, "2026-12-15");
    assert.equal(template.variables.availabilityPath, "/api/search/by-name?name=jacket");
    assert.doesNotMatch(JSON.stringify(template), /BreakMyWebApp|YSOD\.aspx/);
    assert.equal(template.resources.find(resource => resource.type === "Microsoft.Web/serverfarms").sku.capacity, 1);
    const nested = template.resources.find(resource => resource.type === "Microsoft.Resources/deployments").properties.template;
    const contributor = nested.resources.find(resource =>
        resource.type === "Microsoft.Resources/deployments" &&
        JSON.stringify(resource).includes("b24988ac-6180-42a0-ab88-20f7382dd24c"));
    assert.ok(contributor, "Subscription Contributor deployment must be retained");
    assert.ok(template.outputs.webAppUrl);
});

test("PREL38: walkthrough links resolve and evidence crops match their provenance", () => {
    const walkthrough = readFileSync(join(__dirname, "PREL38-walkthrough.md"), "utf8");
    for (const match of walkthrough.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
        assert.ok(existsSync(join(__dirname, ...match[1].split("/"))), match[1]);
    }
    const directory = join(__dirname, "images", "prel38-walkthrough");
    const manifest = JSON.parse(readFileSync(join(directory, "manifest.json"), "utf8"));
    assert.ok(manifest.length >= 17);
    assert.equal(new Set(manifest.map(image => image.file)).size, manifest.length);
    for (const image of manifest) {
        assert.match(image.file, /^[a-z0-9-]+\.png$/);
        assert.match(image.source_capture, /^T\d+-[a-z0-9-]+-private\.png$/);
        assert.match(image.source_sha256, /^[a-f0-9]{64}$/);
        assert.ok(Number.isFinite(Date.parse(image.captured_at)));
        const bytes = readFileSync(join(directory, image.file));
        assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        assert.equal(createHash("sha256").update(bytes).digest("hex"), image.sha256);
        assert.equal(bytes.readUInt32BE(16), image.crop_xywh[2]);
        assert.equal(bytes.readUInt32BE(20), image.crop_xywh[3]);
        assert.ok(image.crop_xywh.every(value => Number.isInteger(value) && value >= 0));
    }
});

test("PREL38: measured operator time is distinguished from estimated human time and incomplete checks", () => {
    const walkthrough = readFileSync(join(__dirname, "PREL38-walkthrough.md"), "utf8");
    assert.match(walkthrough, /72 minutes 35 seconds of operator wall time/);
    assert.match(walkthrough, /13 minutes 2 seconds inside the guarded UI wrapper/);
    assert.match(walkthrough, /not.*measured human trial/);
    assert.match(walkthrough, /waits overlap/);
    assert.match(walkthrough, /slide-level visual quality.*not/i);
    assert.match(walkthrough, /reopening and recipient-access behavior remain unverified/);
    assert.match(walkthrough, /not yet establish a 45-minute end-to-end fit/);
    assert.match(walkthrough, /\/api\/products.*HTML fallback/);
    assert.match(walkthrough, /LAB720.*not been performed/);
    assert.match(walkthrough, /## Revisions after the measured walkthrough/);
    assert.match(walkthrough, /not a new live walkthrough/);
    assert.match(walkthrough, /earlier seven-prompt publication evidence refers to the measured revision/);
    const csv = readFileSync(join(__dirname, "PREL38-walkthrough-actions.csv"), "utf8");
    assert.match(csv, /"started_utc","finished_utc","operation_seconds","observation_status"/);
    assert.match(csv, /"timed-trial"/);
    assert.match(csv, /"follow-up-evidence-publication"/);
    assert.match(csv, /Annotation did not establish applied availability change/);
});
