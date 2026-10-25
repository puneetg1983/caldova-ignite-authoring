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
    assert.doesNotMatch(pages[0], /Open Azure SRE Agent/);
    assert.match(sre, /## Sign in to Azure SRE Agent/);
});

test("PREL38: sign-in retains runtime VM credentials and TAP-first Azure flow", () => {
    for (const field of ["Username", "Password"]) {
        assert.ok(source.includes(`+++@lab.VirtualMachine(Win11-Pro-Base).${field}+++`));
    }
    assert.match(source, /@lab.CtrlAltDelete/);
    assert.match(source, /At \*\*Temporary Access Pass\*\*.*\*\*TAP\*\*/);
    assert.doesNotMatch(source, /Azure password \||@lab\.CloudPortalCredential|@lab\.[^\s+]*TAP/i);
    assert.match(guidance, /Password requested instead of TAP/);
    assert.match(guidance, /Focus the destination field \*\*inside the VM\*\*/);
    assert.match(guidance, /keep it focused until typing finishes/);
    for (const url of ["https://sre.azure.com", "https://portal.azure.com/#home"]) {
        assert.ok(source.includes(`+++${url}+++`));
    }
    assert.match(guidance, /type the URL manually/);
});

test("PREL38: all chat prompts use native Copy and Type Text, not static fences", () => {
    assert.equal(prompts.length, 7);
    assert.doesNotMatch(source, /^```text$/m);
    assert.equal((source.match(/^\+{4}/gm) || []).length, prompts.length);
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
    assert.doesNotMatch(connection, /Builder|Azure Portal/);
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
    assert.match(section("Inquire and configure Web App"), /Health check configuration exercise is optional/);
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
    const csv = readFileSync(join(__dirname, "PREL38-walkthrough-actions.csv"), "utf8");
    assert.match(csv, /"started_utc","finished_utc","operation_seconds","observation_status"/);
    assert.match(csv, /"timed-trial"/);
    assert.match(csv, /"follow-up-evidence-publication"/);
    assert.match(csv, /Annotation did not establish applied availability change/);
});
