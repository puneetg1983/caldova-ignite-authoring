const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { readFileSync, existsSync, readdirSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const source = readFileSync(join(__dirname, "PREL38.md"), "utf8").replace(/\r\n/g, "\n");
const visible = source.replace(/<!--[\s\S]*?-->/g, "");
const pages = visible.split(/\r?\n===\r?\n/);
const sre = pages[3];
const [numberedMain, guidance] = sre.split("## Additional guidance");
const main = numberedMain.replace(/^## \d+\. /gm, "## ");
const section = heading => main.split(`## ${heading}\n`)[1]?.split("\n## ")[0];
const optionalExercises = section("Explore agent capabilities (optional)");
const prompts = [...source.matchAll(/^\+{4}([^\r\n]+)\+{4}$/gm)].map(match => match[1]);
const template = JSON.parse(readFileSync(join(__dirname, "..",
    "Caldova-WebAppP1v3-with-SREAgent-MI.json"), "utf8"));

test("PREL38: identity and four native pages remain; authoring labels are hidden", () => {
    assert.match(source, /profile 224911, instruction set 359549/);
    assert.deepEqual(pages.map(page => page.match(/^# (.+)$/m)?.[1]),
        ["Start", "Modernization", "ARM/Azure Copilot", "SRE Agent"]);
    assert.doesNotMatch(visible, /Screenshot placeholder|Authoring placeholder|STEVEN TODO|UNPUBLISHED|SRE lab duration:|No new per-exercise|maximum 5 minutes/);
    assert.match(pages[0], /Need help\? See \*\*Additional guidance\*\* at the end/);
    assert.equal(pages[0].match(/^## (.+)$/m)?.[1], "GitHub and Copilot");
    assert.doesNotMatch(source, /## (?:\d\. )?Sign in to the lab VM|## (?:\d\. )?Azure Portal/);
    assert.doesNotMatch(pages[0], /## .*Open Azure SRE Agent|More context\. Better investigations/);
    const exercises = [...numberedMain.matchAll(/^## (\d+)\. (.+)$/gm)];
    assert.deepEqual(exercises.map(match => Number(match[1])),
        Array.from({ length: 11 }, (_, index) => index + 1));
    assert.equal(exercises[1][2], "Open Azure SRE Agent");
    for (const exercise of exercises) {
        assert.match(section(exercise[2]), /\*\*Goal:\*\*/);
    }
    assert.match(main, /Keep work moving.*Imports, agent replies, task creation, report authoring/s);
    assert.match(main, /Return before a dependent step/);
});

test("PREL38: opens SRE Agent in exercise 2 and delegates VM/Azure prerequisites to Resources", () => {
    const opening = section("Open Azure SRE Agent");
    assert.match(pages[0], /VM access and Azure sign-in details are already provided in \*\*Resources\*\*/);
    assert.match(opening, /\*\*Microsoft Edge inside the lab VM\*\*.*address bar/);
    assert.ok(opening.includes("+++https://sre.azure.com+++"));
    assert.match(opening, /Press \*\*Enter inside the VM\*\*/);
    assert.match(opening, /\*\*Azure account\*\* in \*\*Resources > Azure Portal\*\*, not the VM account/);
    assert.match(opening, /At \*\*Temporary Access Pass\*\*, use the \*\*TAP\*\* control in Resources/);
    assert.match(opening, /SRE Agent resource list.*select your assigned/);
    assert.match(opening, /\*\*More context\. Better investigations\.\*\*.*\*\*Quickstart\*\*/);
    assert.match(opening, /\*\*context wizard\*\* open/);
    const agentList = opening.indexOf("images/prel38-revision/agent-list.png");
    const wizard = opening.indexOf("images/prel38-revision/context-wizard.png");
    assert.ok(agentList > 0);
    assert.ok(wizard > agentList);
    assert.doesNotMatch(source, /@lab\.VirtualMachine|@lab\.CtrlAltDelete|VM username \||VM password \|/);
    assert.doesNotMatch(source, /Azure password \||@lab\.CloudPortalCredential|@lab\.[^\s+]*TAP/i);
    assert.match(guidance, /Password requested instead of TAP/);
    assert.match(guidance, /Focus the destination field \*\*inside the VM\*\*/);
    assert.match(guidance, /keep it focused until typing finishes/);
    assert.doesNotMatch(source, /https:\/\/portal\.azure\.com\/#home|Start-Process msedge/);
    assert.match(guidance, /Type `https:\/\/sre\.azure\.com` manually/);
});

test("PREL38: all chat prompts use native Copy and Type Text, not static fences", () => {
    assert.equal(prompts.length, 6);
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
    for (const match of source.matchAll(/^\+{4}([^\r\n]+)\+{4}$/gm)) {
        const instruction = source.slice(0, match.index).trimEnd().split("\n").at(-1);
        assert.match(instruction, /\*\*inside the VM\*\*/);
        assert.match(instruction, /Copy\/paste or type the prompt below, or click it to type automatically:/);
    }
    assert.doesNotMatch(source, /use \*\*Copy & Type Text\*\*/i);
    assert.ok(prompts.includes("List the configuration of the Caldova App Service and provide the full HTTPS link to its website."));
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

test("PREL38: OAuth uses the imported lab repository and confirms its saved entry without another readiness gate", () => {
    const connection = section("Connect the imported repository");
    assert.equal((connection.match(/^\d\. /gm) || []).length, 5);
    for (const control of ["Code", "GitHub", "Repository URL", "OAuth", "Sign in to GitHub",
        "Authorize Azure-SRE-Agent", "Connected to GitHub", "Next", "Save", "Show details"]) {
        assert.ok(connection.includes(`**${control}**`), control);
    }
    assert.match(connection, /https:\/\/github\.com\/User1-12345678_events\/caldova-ignite-authoring/);
    assert.match(connection, /Replace the example username/);
    assert.match(connection, /Under \*\*Code\*\*, click \*\*Show details\*\* and confirm the imported repository appears/);
    assert.doesNotMatch(connection, /Confirm the repository connection is ready/);
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
    assert.ok(gettingStarted.includes("images/getting-started/thread-overview.png"));
    assert.match(gettingStarted, /Example from an earlier lab session/);
    const png = readFileSync(join(__dirname, "images", "getting-started", "thread-overview.png"));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.ok(png.readUInt32BE(16) >= 1200);
    assert.ok(png.readUInt32BE(20) >= 500);
    assert.doesNotMatch(gettingStarted, /Search Threads|Favorites|Operations hub|discovery/i);
});

test("PREL38: configuration inquiry saves the website URL; optional Health check stays read-only", () => {
    const configuration = section("Inquire and configure Web App");
    assert.match(configuration, /\*\*New chat\*\*.*separate configuration thread, not the Getting started thread/);
    assert.doesNotMatch(configuration, /In the same Getting started thread/);
    assert.match(configuration, /Keep this configuration thread for the optional Health check/);
    assert.match(configuration, /provide the full HTTPS link to its website/);
    assert.match(configuration, /Open the website link in a new \*\*VM browser\*\* tab and confirm the app loads/);
    assert.match(configuration, /\*\*Bookmark the page or copy the full URL for the next exercise\.\*\*/);
    assert.doesNotMatch(configuration, /link is missing|manual URL steps|portal\.azure\.com/);
    assert.match(guidance, /Website link missing or not opening/);
    assert.doesNotMatch(configuration, /Find \*\*Default Hostname\*\*|followed by that hostname/);
    assert.ok(configuration.includes("images/app-configuration/default-hostname.png"));
    assert.match(configuration, /### Optional: Explore App Service Health check/);
    assert.doesNotMatch(configuration.split("\n### Optional:")[0], /configure.*Health check path to \/api\/health/i);
    assert.match(configuration, /In the same configuration conversation/);
    assert.match(configuration, /Inspect only; do not change any settings/);
    assert.match(configuration, /does not prove that product search works/);
    assert.match(configuration, /Do not approve a configuration write/);
    assert.match(configuration, /If it is still running, start the independent scheduled-task or live-report exercise/);
});

test("PREL38: debugging uses one natural prompt and verifies the original symptom", () => {
    const debug = section("Debug the product-search failure");
    assert.doesNotMatch(debug, /repository|indexing|retrieve source files/i);
    assert.match(debug, /^1\. Open your bookmarked website in the \*\*VM browser\*\*/m);
    assert.match(debug, /paste or type the full URL copied during \*\*Inquire and configure Web App\*\*/);
    assert.doesNotMatch(debug, /portal\.azure\.com|Resource groups|Default domain/);
    const urlFallback = guidance.split("### Debug the product-search failure\n")[1]
        .split("\n### ")[0];
    assert.match(urlFallback, /Website link missing or not opening/);
    assert.ok(urlFallback.includes("+++https://portal.azure.com+++"));
    assert.match(urlFallback, /Copy\/paste or type the Azure Portal URL below, or click it to type automatically/);
    assert.match(urlFallback, /\*\*Resource groups\*\*.*resource group assigned to this lab/);
    assert.match(urlFallback, /\*\*caldova-webapp-\.\.\.\*\* with type \*\*App Service\*\*, not the App Service plan/);
    assert.match(urlFallback, /\*\*Overview\*\*.*\*\*Default domain\*\*.*\*\*Browse\*\*/);
    assert.match(urlFallback, /copy the domain and paste or type `https:\/\/`/);
    assert.match(urlFallback, /Example only: `https:\/\/caldova-webapp-<unique-suffix>\.azurewebsites\.net`/);
    assert.match(urlFallback, /Use the complete \*\*Default domain\*\* shown for your app, not this example/);
    assert.match(debug, /press \*\*Enter inside the VM\*\*/i);
    assert.doesNotMatch(debug, /configuration thread|Default Hostname|followed by that hostname/);
    assert.equal((debug.match(/^\d\. /gm) || []).length, 5);
    assert.match(debug, /Confirm matching products appear and catalog browsing still works/);
    assert.match(debug, /`jacket`.*\*\*Search\*\*.*\*\*500 - Search failed\*\*/);
    assert.ok(prompts.includes("Product search fails with HTTP 500, but browsing works. Find out why, fix the running app, and check that searching for jacket returns products."));
    assert.equal((debug.match(/^\+{4}/gm) || []).length, 1);
    assert.match(debug, /repeat the same `jacket` search/);
    assert.match(debug, /catalog browsing still works/);
    assert.doesNotMatch(debug, /Review mode|Catalog__AsOfDate/);
    assert.match(guidance, /assigned subscription from \*\*Resources\*\*/);
    assert.match(guidance, /do not create resources or change permissions/);
    assert.doesNotMatch(source, /@lab\.Variable\(CaldovaWebAppUrl\)|automated URL setup|automatic URL setup|What is the Caldova web app URL\?/);
    assert.match(guidance, /A source-code pull request is not a deployment/);
    assert.match(guidance, /Returning an empty result set is not recovery/);
    assert.doesNotMatch(source, /@lab\.CloudResourceTemplate.*Outputs|@lab\.Variable\(CaldovaAppUrl\)/);
});

test("PREL38: URL lifecycle action publishes only the assigned app's actual HTTPS hostname",
    { skip: process.platform !== "win32" }, () => {
    const cases = [
        { name: "standard", count: 1, hostname: "caldova-webapp-test.azurewebsites.net" },
        { name: "regional", count: 1, hostname: "caldova-webapp-test-abc.westus-01.azurewebsites.net" },
        { name: "module information", count: 1, hostname: "caldova-webapp-test.azurewebsites.net",
            moduleInformation: true },
        { name: "missing", count: 0, error: "exactly one" },
        { name: "ambiguous", count: 2, error: "exactly one" },
        { name: "unrelated", count: 1, appName: "another-webapp", error: "exactly one" },
        { name: "empty hostname", count: 1, hostname: "", error: "valid App Service hostname" },
        { name: "invalid hostname", count: 1, hostname: "app.azurewebsites.net/extra", error: "valid App Service hostname" },
        { name: "missing context", count: 1, noContext: true, error: "assigned Azure subscription" },
        { name: "wrong subscription", count: 1, wrongSubscription: true, error: "assigned Azure subscription" },
        { name: "Azure module failure", count: 1, importFailure: true, error: "Azure module load failed" },
        { name: "Azure failure", count: 1, readFailure: true, error: "Azure read failed" },
        { name: "noisy Azure failure", count: 1, moduleInformation: true,
            readFailure: true, error: "Azure read failed" },
        { name: "publication failure", count: 1, hostname: "caldova-webapp-test.azurewebsites.net",
            publishFailure: true, error: "Variable publication failed" },
    ];
    const harness = `
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$source = Get-Content -LiteralPath $env:CALDOVA_URL_SCRIPT -Raw
$source = $source.Replace('@lab.CloudSubscription.Id', '11111111-1111-1111-1111-111111111111')
$source = $source.Replace('@lab.CloudResourceGroup(ResourceGroup1).Name', 'ResourceGroup1')
$cases = '${JSON.stringify(cases)}' | ConvertFrom-Json
function Import-Module {
    param($Name)
    if (($Name -join ',') -ne 'Az.Accounts,Az.Websites') { throw 'Unexpected Azure module import' }
    if ($script:current.moduleInformation) {
        Write-Information "Loaded Azure modules" -InformationAction Continue
    }
    if ($script:current.importFailure) { throw 'Azure module load failed' }
}
function Get-AzContext {
    if ($script:current.moduleInformation) {
        Write-Information "Loaded Module 'Az.Accounts'" -InformationAction Continue
    }
    if ($script:current.noContext) { return }
    $id = if ($script:current.wrongSubscription) { '22222222-2222-2222-2222-222222222222' }
        else { '11111111-1111-1111-1111-111111111111' }
    [pscustomobject]@{ Subscription = [pscustomobject]@{ Id = $id } }
}
function Get-AzWebApp {
    param($ResourceGroupName)
    if ($script:current.moduleInformation) {
        Write-Information "Loaded Module 'Az.Websites'" -InformationAction Continue
    }
    $script:queried = $true
    if ($ResourceGroupName -cne 'ResourceGroup1') { throw 'Wrong resource group' }
    if ($script:current.readFailure) { throw 'Azure read failed' }
    for ($i = 0; $i -lt $script:current.count; $i++) {
        $name = if ($script:current.appName) { $script:current.appName } else { "caldova-webapp-$i" }
        [pscustomobject]@{ Name = $name; DefaultHostName = $script:current.hostname }
    }
}
function Set-LabVariable {
    param($Name, $Value)
    if ($script:current.publishFailure) { throw 'Variable publication failed' }
    $script:published = @{ Name = $Name; Value = $Value }
    'native-variable-metadata'
}
$results = foreach ($case in $cases) {
    $script:current = $case
    $script:published = $null
    $script:queried = $false
    $failure = $null
    $output = @()
    try { $output = @(& ([scriptblock]::Create($source)) 6>&1) } catch { $failure = $_.Exception.Message }
    [pscustomobject]@{ Name = $case.name; Published = $script:published; Queried = $script:queried;
        Error = $failure; OutputCount = $output.Count; Metadata = ($output -contains 'native-variable-metadata') }
}
ConvertTo-Json -InputObject @($results) -Depth 4 -Compress
`;
    const results = JSON.parse(execFileSync("powershell.exe",
        ["-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(harness, "utf16le").toString("base64")],
        { encoding: "utf8", env: { ...process.env,
            CALDOVA_URL_SCRIPT: join(__dirname, "..", "Set-CaldovaWebAppUrl.ps1") } }));
    assert.equal(results.length, cases.length);
    for (const [index, result] of results.entries()) {
        const expected = cases[index];
        assert.equal(result.Name, expected.name);
        if (expected.error) {
            assert.equal(result.Published, null, expected.name);
            assert.ok(result.Error?.includes(expected.error), `${expected.name}: ${result.Error}`);
            assert.equal(result.OutputCount, 0, expected.name);
        } else {
            assert.equal(result.Error, null, expected.name);
            assert.deepEqual(result.Published,
                { Name: "CaldovaWebAppUrl", Value: `https://${expected.hostname}` });
            assert.equal(result.OutputCount, 1, expected.name);
            assert.equal(result.Metadata, true, expected.name);
        }
        assert.equal(result.Queried,
            !(expected.wrongSubscription || expected.noContext || expected.importFailure), expected.name);
    }
});

test("PREL38: scheduled automation explains recurring workflows and produces HTML slides without blocking", () => {
    const cost = section("Schedule a weekly cost review");
    assert.match(cost, /\*\*New chat\*\*/);
    assert.doesNotMatch(cost, /Create task|New task|Frequency|scheduling questions|short PowerPoint/);
    for (const text of ["forecast next month", "recommend savings", "self-contained HTML slide deck",
        "charts, tables", "label estimates and assumptions", "do not change any resources",
        "NSG-rule", "RBAC-access", "CVE", "vulnerability", "FinOps", "anomaly detection", "pull requests"]) {
        assert.ok(cost.includes(text), text);
    }
    assert.match(cost, /age of the lab, not a limitation of the agent/);
    assert.match(cost, /answer \*\*any questions from the agent\*\*/);
    assert.match(cost, /Only after the agent confirms the scheduled task has been created/);
    assert.match(cost, /If no run has started or is pending, select \*\*Run task now\*\* once/);
    assert.match(cost, /do not duplicate an agent-triggered run/);
    assert.match(cost, /Task creation can take several minutes/);
    assert.match(cost, /open the HTML slide deck in the VM browser/);
    assert.doesNotMatch(source, /PowerPoint|PPT installed|compatible viewer/);
    assert.match(cost, /\*\*Don't wait for completion\.\*\*/);
    assert.match(cost, /latest execution thread/);
});

test("PREL38: Live Reports explain UI for AI and request service icons, health rings and supported drill-down", () => {
    const report = section("Create a live traffic and health report");
    assert.match(report, /\*\*Live reports > \+ New report\*\*/);
    assert.match(report, /\*\*Enter a custom response\*\*/);
    assert.match(report, /Live Reports are a UI for AI/);
    assert.match(report, /Before the metric cards.*dependency graph using Azure service SVG icons/);
    assert.match(report, /circular health-colored rings, not text-only rectangles/);
    assert.match(report, /Include a legend; label unknown health and inferred connections/);
    assert.match(report, /Where supported, make nodes clickable/);
    assert.match(report, /do not invent links/);
    assert.match(report, /interactive charts and filters where supported/);
    assert.match(report, /label missing data/);
    assert.match(report, /keep it read-only/);
    assert.match(report, /report-saving approval.*expected read-only telemetry tools/);
    assert.match(report, /\*\*Don't wait for completion\.\*\*/);
    assert.match(report, /Finish other pending activities/);
    assert.match(report, /\*\*version picker\*\*/);
    assert.match(report, /If an earlier version exists/);
    assert.match(report, /\*\*Copy link to report\*\*/);
    assert.match(report, /sharing the link does not grant access/);
    assert.match(report, /If a graph node offers a drill-down, click it/);
    assert.match(report, /do not treat a decorative node as a working link/);
    assert.match(report, /\*\*Open authoring thread\*\*.*existing report, not a duplicate/);
    assert.match(report, /if it confirms creation, check the task/);
});

test("PREL38: extra help is compiled once at the end and does not claim missing data is healthy", () => {
    assert.equal((source.match(/^## Additional guidance$/gm) || []).length, 1);
    assert.doesNotMatch(guidance, /^### Optional:|^## Optional exercises/m);
    assert.match(guidance, /if you are stuck or need more help following an instruction/);
    assert.ok(main.indexOf("## Complete") > main.indexOf("## Explore agent capabilities (optional)"));
    assert.ok(main.indexOf("## Complete") > main.indexOf("## Create a live traffic and health report"));
    assert.doesNotMatch(main, /Operations hub > Overview|Search Threads|Browser did not open/);
    assert.match(guidance, /Missing data or unknown dependency health does not mean the app is healthy/);
    assert.match(guidance, /Do not start a duplicate run/);
    assert.match(guidance, /rather than relying on the run status alone/);
    assert.match(guidance, /check the report's authoring thread for pending questions or approvals/);
    assert.match(guidance, /saving the report does not change Azure resources/);
    assert.match(main, /Record anything still running or blocked/);
});

test("PREL38: consumption review budgets agent attention using actual execution threads", () => {
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
    assert.match(consumption, /budgeting exercise, not another Azure resource-cost analysis/);
    assert.match(consumption, /Set an active-flow allowance in advance/);
    assert.match(consumption, /which workflows deserve the agent's attention/);
    assert.match(consumption, /Start with a small set of high-value workflows/);
    assert.match(consumption, /Compare observed consumption per completed run and intended frequency/);
    assert.match(consumption, /Do not save a budget change in this lab/);
    assert.ok(consumption.includes("images/prel38-revision/agent-consumption-reference.png"));
    assert.ok(consumption.includes("images/prel38-revision/consumption-threads-reference.png"));
    assert.match(consumption, /documentation examples, not measurements from this lab/);
    assert.match(consumption, /CC BY 4\.0.*reproduced unchanged/);
    assert.match(guidance, /If \*\*Agent consumption\*\* is not offered under \*\*Settings\*\*/);
    assert.match(guidance, /Do not restart the agent, switch navigation modes, enable features, or change permissions/);
    assert.match(guidance, /live consumption and allocation inspection were unavailable, not that usage was zero/);
});

test("PREL38: optional Agent Canvas and Skill Builder explain capabilities without creating them", () => {
    assert.match(optionalExercises, /exploration-only/);
    assert.match(optionalExercises, /\*\*Build \+ setup\*\* \(\*\*Builder\*\* in the earlier navigation\)/);
    assert.match(optionalExercises, /explore \*\*Agent Canvas\*\*, if available/);
    assert.match(optionalExercises, /Skill Builder/);
    for (const capability of ["Skill", "Custom agent", "Connector", "Tool", "Policy", "Hook"]) {
        assert.ok(optionalExercises.includes(`| ${capability} |`), capability);
    }
    assert.match(optionalExercises, /do not create or save skills, custom agents, connectors, policies, hooks/);
    assert.match(optionalExercises, /leave any draft without saving/);
    assert.doesNotMatch(optionalExercises, /Create > Skill|Create > Custom Agent|Set \*\*Name\*\*|select \*\*Create\*\*/);
});

test("PREL38: optional incident and HTTP triggers explain routing without creating or invoking anything", () => {
    assert.match(optionalExercises, /Explore incident management and HTTP triggers/);
    assert.match(optionalExercises, /\*\*Incidents > Triggers \+ response plans\*\*/);
    assert.match(optionalExercises, /without connecting or enabling anything/);
    assert.match(optionalExercises, /do not create a trigger, copy access-bearing callback URLs, or send a request/);
    assert.match(optionalExercises, /Narrow filters and cooldowns/);
    assert.match(optionalExercises, /Scheduled tasks run by time; incident triggers react to alerts; HTTP triggers react/);
    assert.doesNotMatch(optionalExercises, /trigger the approved test alert|Title contains|Turn off > Yes/);
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

test("PREL38: revision evidence distinguishes fresh lab captures from attributed documentation references", () => {
    const directory = join(__dirname, "images", "prel38-revision");
    const manifest = JSON.parse(readFileSync(join(directory, "manifest.json"), "utf8"));
    assert.deepEqual(manifest.map(image => image.file).sort(),
        readdirSync(directory).filter(file => file.endsWith(".png")).sort());
    assert.equal(new Set(manifest.map(image => image.file)).size, manifest.length);
    assert.ok(manifest.length >= 4);
    for (const image of manifest) {
        assert.match(image.file, /^[a-z0-9-]+\.png$/);
        const bytes = readFileSync(join(directory, image.file));
        assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        assert.equal(createHash("sha256").update(bytes).digest("hex"), image.sha256);
        if (image.kind === "lab-capture") {
            assert.match(image.source_capture, /^R\d+-[a-z0-9-]+-private\.png$/);
            assert.match(image.source_sha256, /^[a-f0-9]{64}$/);
            assert.ok(Number.isFinite(Date.parse(image.captured_at)));
            assert.equal(image.crop_xywh.length, 4);
            assert.ok(image.crop_xywh.every(value => Number.isInteger(value) && value >= 0));
            assert.equal(bytes.readUInt32BE(16), image.crop_xywh[2]);
            assert.equal(bytes.readUInt32BE(20), image.crop_xywh[3]);
            for (const rectangle of image.masks_xywh) {
                assert.equal(rectangle.length, 4);
                assert.ok(rectangle.every(value => Number.isInteger(value) && value >= 0));
                assert.ok(rectangle[0] + rectangle[2] <= image.crop_xywh[2]);
                assert.ok(rectangle[1] + rectangle[3] <= image.crop_xywh[3]);
            }
        } else {
            assert.equal(image.kind, "documentation-reference");
            assert.match(image.source_url,
                /^https:\/\/learn\.microsoft\.com\/en-us\/azure\/sre-agent\/media\/monitor-agent-usage\/[a-z-]+\.png$/);
            assert.equal(image.license_url, "https://creativecommons.org/licenses/by/4.0/");
            assert.equal(image.unchanged, true);
            assert.ok(Number.isFinite(Date.parse(image.retrieved_at)));
        }
    }
    assert.ok(manifest.find(image => image.file === "agent-list.png").masks_xywh.length > 0);
});

test("PREL38: service icons preserve Microsoft's official SVG assets and usage terms", () => {
    const directory = join(__dirname, "images", "prel38-revision");
    const metadata = JSON.parse(readFileSync(join(directory, "azure-icons.json"), "utf8"));
    assert.equal(metadata.source_url,
        "https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip");
    assert.match(metadata.source_sha256, /^[a-f0-9]{64}$/);
    assert.equal(metadata.terms_url, "https://learn.microsoft.com/en-us/azure/architecture/icons/#icon-terms");
    assert.equal(metadata.unchanged, true);
    assert.ok(Number.isFinite(Date.parse(metadata.retrieved_at)));
    assert.deepEqual(metadata.icons.map(icon => icon.file).sort(),
        ["azure-app-service.svg", "azure-application-insights.svg"]);
    for (const icon of metadata.icons) {
        const bytes = readFileSync(join(directory, icon.file));
        assert.equal(createHash("sha256").update(bytes).digest("hex"), icon.sha256);
        assert.match(icon.entry, /^Azure_Public_Service_Icons\/Icons\/(?:web|monitor)\/\d+-icon-service-[a-z-]+\.svg$/i);
        assert.match(bytes.toString("utf8"), /<svg\b/);
        assert.doesNotMatch(bytes.toString("utf8"), /<script\b|<foreignObject\b|\bonload\s*=/i);
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
