const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { existsSync, readFileSync, readdirSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const labs = [
    { name: "PREL38", duration: 45, profile: 224911, instructions: 359549, images: 40 },
    { name: "LAB720", duration: 25, profile: 226801, instructions: 362436, images: 1 }
];
const hash = buffer => createHash("sha256").update(buffer).digest("hex");
const instructionWords = section => section.replace(/^\*\*Screenshot.*$|^!\[.*$/gm, "")
    .trim().split(/\s+/).length;
const setupImages = [
    "azure-resource-scope.png",
    "logs-connected.png",
    "github-oauth.png",
    "repository-saved.png"
].map(name => `images/context-wizard/${name}`);
const reviewImages = ["overview.png", "repository-connection.png"]
    .map(name => `images/context-wizard/${name}`);
const allowedTokens = new Set([
    "@lab.VirtualMachine(Win11-Pro-Base).SelectLink",
    "@lab.VirtualMachine(Win11-Pro-Base).Username",
    "@lab.VirtualMachine(Win11-Pro-Base).Password",
    "@lab.CtrlAltDelete",
    "@lab.CloudPortalCredential(User1).Username",
    "@lab.CloudPortalCredential(User1).Password"
]);
const requiredSreHeadings = [
    "Welcome to Caldova operations",
    "What you will accomplish",
    "Start the GitHub import in the background",
    "Review Azure resources and telemetry before connecting GitHub",
    "Connect the imported repository",
    "Review the Getting started thread - maximum 5 minutes",
    "Update Web App configuration",
    "Debug a scenario",
    "Scheduled tasks: read-only weekly cost audit",
    "Live reports: traffic and health",
    "Complete",
    "Additional guidance"
];

// PREL38's approved conversational flow is covered by prel38.test.cjs.
for (const lab of labs.filter(lab => lab.name !== "PREL38")) {
    const revisedStart = lab.name === "PREL38";
    const source = readFileSync(join(__dirname, `${lab.name}.md`), "utf8");
    const pages = source.split(/\r?\n===\r?\n/);
    const backup = join(__dirname, "backups", "2026-10-24", lab.name);
    const original = readFileSync(join(backup, "content.md"), "utf8");

    test(`${lab.name}: complete guide has the correct identity, duration, and native page order`, () => {
        assert.match(source, new RegExp(`profile ${lab.profile}, instruction set ${lab.instructions}`));
        if (revisedStart) {
            assert.doesNotMatch(source, /SRE lab duration:|No new per-exercise time estimates/);
            assert.match(pages[0], /Sign in to the lab VM and prepare the shared tools/);
            assert.doesNotMatch(pages[0], /## \d\. Azure SRE Agent|Open Azure SRE Agent/);
            assert.match(pages[3], /## Sign in to Azure SRE Agent/);
        } else {
            assert.match(source, new RegExp(`SRE lab duration: ${lab.duration} minutes`));
        }
        assert.equal(pages.length, 4);
        assert.deepEqual(pages.map(page => page.match(/^# (.+)$/m)?.[1]),
            ["Start", "Modernization", "ARM/Azure Copilot", "SRE Agent"]);
        assert.deepEqual([...pages[0].matchAll(/^## \d\. (.+)$/gm)].map(match => match[1]),
            revisedStart ? ["Sign in to the lab VM", "Azure Portal"] :
                ["Sign in to the lab VM", "Azure SRE Agent", "Azure Portal"]);
        assert.deepEqual([...pages[3].matchAll(/^## (.+)$/gm)].map(match => match[1]),
            revisedStart ? [...requiredSreHeadings.slice(0, 2), "Sign in to Azure SRE Agent",
                ...requiredSreHeadings.slice(2)] : requiredSreHeadings);
        assert.match(pages[1], /Authoring placeholder/);
        assert.match(pages[2], /Authoring placeholder/);
        assert.match(source, /UNPUBLISHED AUTHORING DRAFT/);
    });

    test(`${lab.name}: VM sign-in uses runtime credentials and field focus, not stored values`, () => {
        const tokens = source.match(/@lab\.[A-Za-z][A-Za-z0-9_]*(?:\([^\r\n)]+\))?(?:\.[A-Za-z][A-Za-z0-9_]*)*/g);
        assert.ok(tokens.length >= (revisedStart ? 4 : 6));
        for (const token of tokens) assert.ok(allowedTokens.has(token), `Unexpected token: ${token}`);
        for (const token of [...allowedTokens].filter(token => /\.(Username|Password)$/.test(token) &&
            (!revisedStart || token.startsWith("@lab.VirtualMachine")))) {
            assert.ok(source.includes(`+++${token}+++`), `Missing Type Text control: ${token}`);
        }
        assert.match(source, /focus its field first/);
        if (revisedStart) {
            assert.doesNotMatch(source, /@lab.CloudPortalCredential|Azure password \|/);
            const signIn = pages[3].split("## Sign in to Azure SRE Agent")[1]
                .split("## Start the GitHub import")[0];
            assert.match(signIn, /At \*\*Temporary Access Pass\*\*.*\*\*TAP\*\* control in Resources/);
            assert.match(signIn, /Open \*\*Resources > Azure Portal\*\*/);
            assert.match(source, /Password requested instead of TAP/);
        } else {
            assert.match(source, /same Azure account and sign-in method shown in Resources > Azure Portal/);
            assert.match(source, /Resources > Azure Portal.*existing.*TAP/);
        }
        assert.doesNotMatch(source, /@lab\.[^\s+]*TAP/i);
        assert.match(source, /Do not enable GitHub sync/);
    });

    test(`${lab.name}: destination URLs target the VM and retain manual fallbacks`, () => {
        const commands = [...source.matchAll(/@\[[^\]]+\]\(`([^`]+)`\)\{PowerShell(?: visible)?\}/g)]
            .map(match => match[1]);
        assert.deepEqual(commands, revisedStart ? [
            "Start-Process msedge.exe -ArgumentList 'https://portal.azure.com/#home'",
            "Start-Process msedge.exe -ArgumentList 'https://sre.azure.com'"
        ] : [
            "Start-Process 'https://sre.azure.com'",
            "Start-Process 'https://portal.azure.com/#home'"
        ]);
        if (revisedStart) assert.equal((source.match(/\{PowerShell visible\}/g) || []).length, 2);
        for (const url of ["https://sre.azure.com", "https://portal.azure.com/#home",
            "https://github.com/new/import", "https://github.com/enterprises/skillable-events/sso"]) {
            assert.ok(source.includes(`+++${url}+++`));
        }
        assert.match(source, /require working VM Integration Services/);
        assert.match(source, /type the URL manually inside the VM/);
        assert.match(source, /Keep the existing \*\*Resources > Azure Portal\*\* card/);
        assert.doesNotMatch(source, /!?\[[^\]]*\]\(https?:\/\//i);
        assert.doesNotMatch(source, /<(?:script|style|iframe|button)\b/i);
    });

    test(`${lab.name}: setup dependencies and the requested five-minute cap are explicit`, () => {
        assert.ok(pages[0].indexOf("Need help? See **Additional guidance** at the end") <
            pages[0].indexOf("## 1. Sign in to the lab VM"));
        assert.match(pages[0], /grouped by section, or ask the facilitator/);
        assert.match(source, /The URL for your source repository\\\*/);
        assert.doesNotMatch(source, /Your old repository's clone URL|is already connected to the Caldova GitHub/i);
        assert.match(source, /context wizard for the configuration review \*\*without waiting\*\*/);
        assert.match(source, /At \*\*5 minutes\*\*/);
        assert.match(source, /GitHub is \*\*not connected yet\*\*\. You will connect the imported repository later in this section\./);
        assert.doesNotMatch(source, /not assumed to be connected/);
        assert.ok(pages[3].indexOf("## Review Azure resources and telemetry") <
            pages[3].indexOf("## Connect the imported repository"));
        assert.ok(pages[3].indexOf("## Connect the imported repository") <
            pages[3].indexOf("## Review the Getting started thread"));
        assert.match(source, /After sign-in, keep the \*\*context wizard\*\* open/);
        const gettingStarted = pages[3].split("## Review the Getting started thread")[1]
            .split("## Update Web App configuration")[0];
        assert.match(gettingStarted, /continue to \*\*Update Web App configuration\*\*/);
        assert.doesNotMatch(gettingStarted, /continue to the configuration review/);
        assert.match(source, /confirm both the \*\*import\*\* and \*\*repository connection\*\* are ready/i);
        assert.match(source, /caldova-sreagent-<suffix>/);
        assert.match(source, /full actual name/);
        assert.match(source, /do not add a duplicate/);
    });

    test(`${lab.name}: configuration review is concise, review-only, and stays in the context wizard`, () => {
        const review = pages[3].split("## Review Azure resources and telemetry before connecting GitHub")[1]
            .split("## Connect the imported repository")[0];
        const connection = pages[3].split("## Connect the imported repository")[1]
            .split("## Review the Getting started thread")[0];
        assert.match(review, revisedStart ? /Stay on \*\*Quickstart\*\* in the \*\*context wizard\*\*/ :
            /Review only in the \*\*context wizard\*\*/);
        assert.match(review, /After sign-in, you should see the \*\*context wizard\*\*\. If not, follow \*\*Additional guidance > Review Azure resources and telemetry\*\* at the end to open it\./);
        assert.equal((review.match(/^\d\. /gm) || []).length, revisedStart ? 2 : 3);
        if (revisedStart) {
            const [main, optional] = review.split("> [!Note]");
            assert.match(main, /\*\*Goal:\*\* Understand which resource group and log sources/);
            assert.match(main, /Review the configured \*\*Resource group\*\*\. Leave it unchanged/);
            assert.doesNotMatch(main, /Full setup|review.*Subscription/i);
            assert.match(optional, /Optional - explore connection options/);
            assert.match(optional, /Click \*\*\+\*\* under \*\*Azure resources\*\*/);
            assert.match(optional, /management group, subscription, or another resource group/);
            assert.match(optional, /Click \*\*\+\*\* under \*\*Logs\*\*/);
            assert.equal((optional.match(/Close or cancel without adding anything/g) || []).length, 2);
            assert.ok(instructionWords(main) <= 130);
            assert.ok(instructionWords(optional) <= 85);
        } else {
            assert.match(review, /Click \*\*Full setup\*\*/);
            assert.match(review, /\*\*Resource group scope\*\*.*\*\*Resource group\*\* and \*\*Subscription\*\*/);
            assert.match(review, /Do not change these settings/);
            assert.ok(instructionWords(review) <= 130);
        }
        assert.match(review, /Under \*\*Azure resources\*\*, click \*\*Show details\*\*/);
        assert.match(review, /Under \*\*Logs\*\*, click \*\*Show details\*\*/);
        assert.match(review, /\*\*Application Insights\*\* and \*\*Log Analytics\*\* both show \*\*Connected\*\*/);
        assert.match(connection, /same context wizard/);
        assert.equal((connection.match(/^\d\. /gm) || []).length, 5);
        assert.match(connection, /under \*\*Code\*\*, click \*\*\+\*\*/);
        assert.match(connection, /\*\*GitHub\*\*.*\*\*Repository URL\*\*/);
        assert.match(connection, /\*\*OAuth\*\*.*\*\*Sign in to GitHub\*\*/);
        assert.match(connection, /review access.*\*\*Authorize Azure-SRE-Agent\*\*/);
        assert.match(connection, /\*\*Connected to GitHub\*\*.*\*\*Next\*\*/);
        assert.match(connection, /Under \*\*Add repositories\*\*.*\*\*Save\*\*/);
        assert.match(connection, /Under \*\*Code\*\*, click \*\*Show details\*\*/);
        assert.match(connection, /Confirm the repository connection is ready/);
        assert.ok(instructionWords(connection) <= 160);
        assert.doesNotMatch(review + connection,
            /Azure Portal|Builder|Contributor|RBAC|managed identity|Grant permissions|Complete setup|access modes/i);
    });

    test(`${lab.name}: Getting started is the main path, with guidance at the end and no repeated discovery`, () => {
        const main = pages[3].split("## Review the Getting started thread")[1]
            .split("## Update Web App configuration")[0];
        const guidance = source.split("## Additional guidance")[1];
        assert.ok(guidance, "Missing guidance at the end of the guide");
        assert.match(main, /select \*\*Done and go to agent\*\*\. The \*\*Getting started\*\* thread opens/);
        assert.equal((main.match(/^\d\. /gm) || []).length, 4);
        assert.match(main, /environment summary.*health and configuration findings/);
        assert.doesNotMatch(main, /Favorites|Search Threads|Operations Hub|Otherwise|If absent/);
        assert.match(guidance, /Operations Hub.*Overview > Complete setup/);
        assert.match(guidance, /Favorites.*Team onboarding.*Search Threads/);
        assert.match(guidance, /Import still running/);
        assert.match(guidance, /do not add broader access/);
        assert.match(guidance, /organization \*\*Request\*\* buttons untouched/);
        assert.match(guidance, /not proof that indexing or source-code retrieval has finished/);
        assert.doesNotMatch(source, /## First chat thread|Discover all Azure resources|continue read-only discovery|Run read-only discovery/);
        assert.match(source, /In the same Getting started thread, if its findings identified a missing health-check path/);
    });

    test(`${lab.name}: optional help is grouped by section after all exercises, not interleaved`, () => {
        const [main, guidance, duplicate] = source.split("## Additional guidance");
        assert.ok(guidance);
        assert.equal(duplicate, undefined);
        assert.ok(main.indexOf("## Complete") > main.indexOf("## Live reports: traffic and health"));
        assert.doesNotMatch(guidance, /^## /m);
        assert.doesNotMatch(main, /### Need guidance|Operations Hub|Search Threads|Browser did not open|If enterprise sign-in|Some lab versions|If search already succeeds|Estimates are not actual billing|Data delayed or empty/);
        assert.deepEqual([...guidance.matchAll(/^### (.+)$/gm)].map(match => match[1]), [
            "Start: VM sign-in",
            ...(!revisedStart ? ["Start: Azure SRE Agent"] : []),
            "Start: Azure Portal",
            "Start: GitHub and Copilot",
            ...(revisedStart ? ["Sign in to Azure SRE Agent"] : []),
            "Background activities",
            "Review Azure resources and telemetry",
            "Connect the imported repository",
            "Review the Getting started thread",
            "Update Web App configuration",
            "Debug a scenario",
            "Scheduled tasks: read-only weekly cost audit",
            "Live reports: traffic and health"
        ]);
        assert.match(guidance, revisedStart ? /Password requested instead of TAP/ : /TAP requested/);
        assert.match(guidance, /require working VM Integration Services/);
        assert.match(guidance, /Automation > New task/);
        assert.match(guidance, /Run now absent/);
        assert.match(guidance, /Estimates are not actual billing/);
        assert.match(guidance, /Treat unavailable geographic data or failed queries as limitations/);
        assert.match(main, /Select \*\*Approve action\*\* only for the intended lab Web App change/);
        assert.match(main, /repeat the same `jacket` search/);
        assert.match(main, /Keep the task in \*\*Review\*\* mode/);
        assert.match(main, /Confirm the Web App itself emits telemetry/);
    });

    test(`${lab.name}: all SRE activities retain evidence, approval, and verification gates`, () => {
        assert.equal((source.match(/^```text$/gm) || []).length, 5);
        assert.match(source, /Health check path is an App Service configuration property/);
        assert.match(source, /Instead of deleting Catalog__AsOfDate/);
        assert.match(source, /repeat the same `jacket` search/);
        assert.match(source, /Keep Review mode and wait for approval/);
        assert.match(source, /keep the task in \*\*Review\*\* mode/i);
        assert.match(source, /Change no Azure resources or permissions/);
        assert.match(source, /estimates are not actual billing/i);
        assert.match(source, /does not prove application instrumentation/);
        assert.match(source, /Treat unavailable geographic data or failed queries as limitations/);
        assert.match(source, /confirm which objectives you completed/i);
        assert.doesNotMatch(source, /temporarily borrows your own credentials|Build \+ setup|Extensions > Connectors/);
    });

    test(`${lab.name}: screenshot slots retain unique IDs with verified setup images and remaining placeholders`, () => {
        const ids = [...source.matchAll(/^\*\*Screenshot(?: placeholder)? ([A-Z]+-\d+):/gm)]
            .map(match => match[1]);
        assert.equal(ids.length, lab.name === "PREL38" ? 18 : 17);
        assert.equal(new Set(ids).size, ids.length);
        assert.deepEqual(ids.filter(id => id.startsWith("SRE-")),
            Array.from({ length: revisedStart ? 14 : 13 },
                (_, i) => `SRE-${String(i + (revisedStart ? 0 : 1)).padStart(2, "0")}`));
        assert.equal((source.match(/^\*\*Screenshot placeholder /gm) || []).length,
            lab.name === "PREL38" ? 15 : 14);
        assert.deepEqual([...source.matchAll(/!\[[^\]]+\]\(([^)]+)\)/g)].map(match => match[1]),
            setupImages);
        assert.doesNotMatch(source, /!IMAGE\[|User1-\d+|[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}/i);
        if (lab.name === "LAB720") assert.match(source, /PREL38 example/);
        assert.match(source, /Do not show passwords or TAP values/);
    });

    test(`${lab.name}: original Markdown and every exported image match the recorded snapshot hashes`, () => {
        const manifest = JSON.parse(readFileSync(join(backup, "manifest.json"), "utf8"));
        assert.equal(manifest.profile_id, lab.profile);
        assert.equal(manifest.instruction_set_id, lab.instructions);
        assert.equal(hash(readFileSync(join(backup, "content.md"))), manifest.content_sha256);
        assert.equal(manifest.media.length, lab.images);
        assert.match(manifest.source_archive_sha256, /^[a-f0-9]{64}$/);
        for (const image of manifest.media) {
            assert.doesNotMatch(image.path, /(^|\/)\.\.(\/|$)|^[\\/]/);
            const path = join(backup, ...image.path.split("/"));
            assert.ok(existsSync(path), `Missing original image: ${image.path}`);
            assert.equal(hash(readFileSync(path)), image.sha256, image.path);
        }
        for (const match of original.matchAll(/!?IMAGE\[[^\]]*\]\(([^)]+)\)/g)) {
            assert.ok(existsSync(join(backup, ...match[1].split("/"))), `Missing referenced image: ${match[1]}`);
        }
        assert.deepEqual(readdirSync(backup).sort(),
            ["content.md", `instructions${lab.instructions}`, "manifest.json"].sort());
    });
}

test("setup assets are real cropped PNGs and all guides retain the shared repository connection controls", () => {
    for (const image of [...setupImages, ...reviewImages]) {
        const png = readFileSync(join(__dirname, ...image.split("/")));
        assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
        assert.ok(png.readUInt32BE(16) >= 600, image);
        assert.ok(png.readUInt32BE(20) >= 250, image);
        assert.ok(png.readUInt32BE(16) < 1779, `Uncropped capture: ${image}`);
    }
    assert.deepEqual(readdirSync(join(__dirname, "images", "context-wizard")).sort(),
        [...setupImages, ...reviewImages].map(path => path.split("/").at(-1)).sort());
    const guides = ["standard-workflow", "PREL38", "LAB720"].map(name =>
        readFileSync(join(__dirname, `${name}.md`), "utf8"));
    const steps = source => source.replace(/^## \d+\. /gm, "## ")
        .split("## Connect the imported repository")[1]
        .split("## Review the Getting started thread")[0].match(/^\d\. .+$/gm)
        .map(step => step.replace(" Confirm the repository connection is ready before source-code debugging.", ""));
    for (const guide of guides.slice(1)) assert.deepEqual(steps(guide), steps(guides[0]));
    const reviewSteps = source => source.split("## Review Azure resources and telemetry before connecting GitHub")[1]
        .split("## Connect the imported repository")[0].match(/^\d\. .+$/gm);
    assert.deepEqual(reviewSteps(guides[2]), reviewSteps(guides[0]));
});

test("retains each lab's existing shared setup and PREL38's ARM-team placeholder", () => {
    const prel = readFileSync(join(__dirname, "PREL38.md"), "utf8");
    const lab720 = readFileSync(join(__dirname, "LAB720.md"), "utf8");
    const prelOriginal = readFileSync(join(__dirname, "backups", "2026-10-24", "PREL38", "content.md"), "utf8");
    const lab720Original = readFileSync(join(__dirname, "backups", "2026-10-24", "LAB720", "content.md"), "utf8");
    const prelShared = prelOriginal.split("**Login to GitHub and Copilot**")[1]
        .split("**Install the ARM MCP server**")[0]
        .split(/\r?\n/).map(line => line.trim())
        .filter(line => /^\d\./.test(line));
    const lab720Shared = lab720Original.split(/\r?\n/).map(line => line.trim())
        .filter(line => /^[a-d]\./.test(line));
    for (const line of prelShared) assert.ok(prel.includes(line), `Missing PREL38 shared step: ${line}`);
    for (const line of lab720Shared) assert.ok(lab720.includes(line), `Missing LAB720 shared step: ${line}`);
    const arm = prelOriginal.split("**Install the ARM MCP server**")[1].split("===")[0]
        .split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    for (const line of arm) assert.ok(prel.includes(line), `Missing ARM-team setup: ${line}`);
    assert.ok(prel.includes("ARM MCP section STEVEN TODO"));
    assert.doesNotMatch(lab720, /JoinARMMCP/);
});
