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
    "Interact with the onboarding thread - maximum 5 minutes",
    "First chat thread: discover the environment",
    "Update Web App configuration",
    "Debug a scenario",
    "Scheduled tasks: read-only weekly cost audit",
    "Live reports: traffic and health",
    "Complete"
];

for (const lab of labs) {
    const source = readFileSync(join(__dirname, `${lab.name}.md`), "utf8");
    const pages = source.split(/\r?\n===\r?\n/);
    const backup = join(__dirname, "backups", "2026-10-24", lab.name);
    const original = readFileSync(join(backup, "content.md"), "utf8");

    test(`${lab.name}: complete guide has the correct identity, duration, and native page order`, () => {
        assert.match(source, new RegExp(`profile ${lab.profile}, instruction set ${lab.instructions}`));
        assert.match(source, new RegExp(`SRE lab duration: ${lab.duration} minutes`));
        assert.equal(pages.length, 4);
        assert.deepEqual(pages.map(page => page.match(/^# (.+)$/m)?.[1]),
            ["Start", "Modernization", "ARM/Azure Copilot", "SRE Agent"]);
        assert.deepEqual([...pages[0].matchAll(/^## \d\. (.+)$/gm)].map(match => match[1]),
            ["Sign in to the lab VM", "Azure SRE Agent", "Azure Portal"]);
        assert.deepEqual([...pages[3].matchAll(/^## (.+)$/gm)].map(match => match[1]),
            requiredSreHeadings);
        assert.match(pages[1], /Authoring placeholder/);
        assert.match(pages[2], /Authoring placeholder/);
        assert.match(source, /UNPUBLISHED AUTHORING DRAFT/);
    });

    test(`${lab.name}: VM sign-in uses runtime credentials and field focus, not stored values`, () => {
        const tokens = source.match(/@lab\.[A-Za-z][A-Za-z0-9_]*(?:\([^\r\n)]+\))?(?:\.[A-Za-z][A-Za-z0-9_]*)*/g);
        assert.ok(tokens.length >= 6);
        for (const token of tokens) assert.ok(allowedTokens.has(token), `Unexpected token: ${token}`);
        for (const token of [...allowedTokens].filter(token => /\.(Username|Password)$/.test(token))) {
            assert.ok(source.includes(`+++${token}+++`), `Missing Type Text control: ${token}`);
        }
        assert.match(source, /focus its field first/);
        assert.match(source, /same Azure account and sign-in method shown in Resources > Azure Portal/);
        assert.match(source, /Resources > Azure Portal.*existing.*TAP/);
        assert.doesNotMatch(source, /@lab\.[^\s+]*TAP/i);
        assert.match(source, /Do not enable GitHub sync/);
    });

    test(`${lab.name}: destination URLs target the VM and retain manual fallbacks`, () => {
        const commands = [...source.matchAll(/@\[[^\]]+\]\(`([^`]+)`\)\{PowerShell\}/g)]
            .map(match => match[1]);
        assert.deepEqual(commands, [
            "Start-Process 'https://sre.azure.com'",
            "Start-Process 'https://portal.azure.com/#home'"
        ]);
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
        assert.ok(pages[0].indexOf("background activities can take time") <
            pages[0].indexOf("## 1. Sign in to the lab VM"));
        assert.match(source, /The URL for your source repository\\\*/);
        assert.doesNotMatch(source, /Your old repository's clone URL|is already connected to the Caldova GitHub/i);
        assert.match(source, /context wizard for the configuration review \*\*without waiting\*\*/);
        assert.match(source, /At \*\*5 minutes\*\*/);
        assert.match(source, /GitHub is \*\*not connected yet\*\*\. You will connect the imported repository later in this section\./);
        assert.doesNotMatch(source, /not assumed to be connected/);
        assert.ok(pages[3].indexOf("## Review Azure resources and telemetry") <
            pages[3].indexOf("## Connect the imported repository"));
        assert.ok(pages[3].indexOf("## Connect the imported repository") <
            pages[3].indexOf("## Interact with the onboarding thread"));
        assert.match(source, /After sign-in, keep the \*\*context wizard\*\* open/);
        const onboarding = pages[3].split("## Interact with the onboarding thread")[1]
            .split("## First chat thread")[0];
        assert.match(onboarding, /continue to \*\*First chat thread: discover the environment\*\*/);
        assert.doesNotMatch(onboarding, /continue to the configuration review/);
        assert.match(source, /confirm both the \*\*import\*\* and \*\*repository connection\*\* are ready/i);
        assert.match(source, /caldova-sreagent-<suffix>/);
        assert.match(source, /full actual name/);
        assert.match(source, /do not add a duplicate/);
    });

    test(`${lab.name}: configuration review is concise, review-only, and stays in the context wizard`, () => {
        const review = pages[3].split("## Review Azure resources and telemetry before connecting GitHub")[1]
            .split("## Connect the imported repository")[0];
        const connection = pages[3].split("## Connect the imported repository")[1]
            .split("## Interact with the onboarding thread")[0];
        assert.match(review, /Review only in the \*\*context wizard\*\*/);
        assert.equal((review.match(/^\d\. /gm) || []).length, 3);
        assert.match(review, /\*\*subscription\*\* and \*\*resource group\*\*/);
        assert.match(review, /\*\*Log Analytics\*\* and \*\*Application Insights\*\*/);
        assert.match(review, /Do not change these settings/);
        assert.ok(review.trim().split(/\s+/).length <= 100);
        assert.match(connection, /same context wizard/);
        assert.equal((connection.match(/^\d\. /gm) || []).length, 4);
        assert.match(connection, /Confirm the repository connection is ready/);
        assert.ok(connection.trim().split(/\s+/).length <= 160);
        assert.doesNotMatch(review + connection,
            /Azure Portal|Builder|Contributor|RBAC|managed identity|Grant permissions|Complete setup/i);
    });

    test(`${lab.name}: all SRE activities retain evidence, approval, and verification gates`, () => {
        assert.equal((source.match(/^```text$/gm) || []).length, 6);
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

    test(`${lab.name}: screenshots are explicit, uniquely named placeholders rather than stale images`, () => {
        const ids = [...source.matchAll(/^\*\*Screenshot placeholder ([A-Z]+-\d+):/gm)]
            .map(match => match[1]);
        assert.equal(ids.length, lab.name === "PREL38" ? 19 : 18);
        assert.equal(new Set(ids).size, ids.length);
        assert.deepEqual(ids.filter(id => id.startsWith("SRE-")),
            Array.from({ length: 14 }, (_, i) => `SRE-${String(i + 1).padStart(2, "0")}`));
        assert.doesNotMatch(source, /!IMAGE\[|!\[[^\]]*\]\(/);
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
