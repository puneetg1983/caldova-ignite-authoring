const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const source = readFileSync(join(__dirname, "standard-workflow.md"), "utf8");
const pages = source.split(/\r?\n===\r?\n/);

test("uses exactly four native pages in the requested order", () => {
    assert.equal(pages.length, 4);
    assert.deepEqual(pages.map(page => page.match(/^# (.+)$/m)?.[1]),
        ["Start", "Modernization", "ARM/Azure Copilot", "SRE Agent"]);
    assert.doesNotMatch(source, /<(?:script|style|iframe|button)\b/i);
});

test("orders VM login, SRE Agent, and Azure Portal on Start", () => {
    assert.deepEqual([...pages[0].matchAll(/^## \d\. (.+)$/gm)].map(match => match[1]),
        ["Sign in to the lab VM", "Azure SRE Agent", "Azure Portal"]);
    assert.ok(pages[0].indexOf("@lab.VirtualMachine(Win11-Pro-Base).SelectLink") <
        pages[0].indexOf("Start-Process"));
});

test("credentials use only documented runtime tokens, never an invented TAP token", () => {
    const allowed = new Set([
        "@lab.VirtualMachine(Win11-Pro-Base).SelectLink",
        "@lab.VirtualMachine(Win11-Pro-Base).Username",
        "@lab.VirtualMachine(Win11-Pro-Base).Password",
        "@lab.CtrlAltDelete",
        "@lab.CloudPortalCredential(User1).Username",
        "@lab.CloudPortalCredential(User1).Password"
    ]);
    const tokens = source.match(/@lab\.[A-Za-z][A-Za-z0-9_]*(?:\([^\r\n)]+\))?(?:\.[A-Za-z][A-Za-z0-9_]*)*/g);
    assert.ok(tokens.length >= 6);
    for (const token of tokens) assert.ok(allowed.has(token), `Unexpected token: ${token}`);
    assert.match(source, /Resources > Azure Portal.*existing.*TAP/);
    for (const token of [
        "@lab.VirtualMachine(Win11-Pro-Base).Username",
        "@lab.VirtualMachine(Win11-Pro-Base).Password",
        "@lab.CloudPortalCredential(User1).Username",
        "@lab.CloudPortalCredential(User1).Password"
    ]) {
        assert.ok(source.includes(`+++${token}+++`), `Missing native Type Text: ${token}`);
    }
});

test("opens fixed URLs with native guest commands and provides matching Type Text fallbacks", () => {
    const commands = [...source.matchAll(/@\[[^\]]+\]\(`([^`]+)`\)\{PowerShell\}/g)]
        .map(match => match[1]);
    assert.deepEqual(commands, [
        "Start-Process 'https://sre.azure.com'",
        "Start-Process 'https://portal.azure.com/#home'"
    ]);
    for (const url of ["https://sre.azure.com", "https://portal.azure.com/#home"]) {
        assert.ok(source.includes(`+++${url}+++`));
    }
    assert.match(source, /require working VM Integration Services/);
    assert.match(source, /press \*\*Enter inside the VM\*\*/);
    assert.doesNotMatch(source, /!?\[[^\]]*\]\(https?:\/\//i);
});

test("keeps pending team content explicit and enforces SRE setup dependencies", () => {
    assert.match(pages[1], /Authoring placeholder/);
    assert.match(pages[2], /Authoring placeholder/);
    assert.match(source, /does not replace the complete PREL38 or LAB720 SRE manual/);
    assert.match(pages[3], /maximum 5 minutes/);
    assert.match(pages[3], /The URL for your source repository\\\*/);
    assert.match(pages[3], /Do not wait here/);
    assert.match(pages[3], /GitHub is \*\*not connected yet\*\*\. You will connect the imported repository later in this section\./);
    assert.doesNotMatch(source, /not assumed to be connected/);
    assert.ok(pages[3].indexOf("Review Azure resources and telemetry") <
        pages[3].indexOf("## Connect the imported repository"));
    assert.ok(pages[3].indexOf("## Connect the imported repository") <
        pages[3].indexOf("## Review the Getting started thread"));
    const setup = pages[3].split("## Review Azure resources and telemetry before connecting GitHub")[1]
        .split("## Review the Getting started thread")[0];
    assert.match(setup, /Review only in the \*\*context wizard\*\*/);
    assert.match(setup, /After sign-in, you should see the \*\*context wizard\*\*\. If not, follow \*\*Additional guidance > Review Azure resources and telemetry\*\* at the end to open it\./);
    assert.match(setup, /same context wizard/);
    assert.doesNotMatch(setup, /Azure Portal|Builder|Contributor|RBAC|Complete setup/i);
    assert.equal((setup.match(/^\d\. /gm) || []).length, 7);
    const gettingStarted = pages[3].split("## Review the Getting started thread")[1]
        .split("## Continue the SRE exercise")[0];
    const main = gettingStarted;
    const guidance = source.split("## Additional guidance")[1];
    assert.match(main, /select \*\*Done and go to agent\*\*\. The \*\*Getting started\*\* thread opens/);
    assert.match(main, /continue with the SRE exercise below/);
    assert.equal((main.match(/^\d\. /gm) || []).length, 4);
    assert.doesNotMatch(main, /Favorites|Search Threads|Operations Hub|continue to the configuration review/);
    assert.match(guidance, /Operations Hub/);
    assert.match(guidance, /Search Threads/);
    assert.doesNotMatch(source, /## First chat thread|Discover all Azure resources|continue read-only discovery/);
    assert.match(pages[3], /confirm both the \*\*import\*\* and \*\*repository connection\*\*/);
    assert.match(source, /caldova-sreagent-<suffix>/);
});

test("points to section-grouped help at the end without interrupting the main flow", () => {
    const [main, guidance, duplicate] = source.split("## Additional guidance");
    assert.ok(guidance);
    assert.equal(duplicate, undefined);
    assert.match(pages[0], /Need help\? See \*\*Additional guidance\*\* at the end, grouped by section, or ask the facilitator/);
    assert.ok(main.indexOf("Need help?") < main.indexOf("## 1. Sign in to the lab VM"));
    assert.ok(main.includes("## Continue the SRE exercise"));
    assert.doesNotMatch(main, /### Need guidance|Operations Hub|Search Threads|Browser did not open/);
    assert.doesNotMatch(guidance, /^## /m);
    assert.deepEqual([...guidance.matchAll(/^### (.+)$/gm)].map(match => match[1]), [
        "Start: VM sign-in",
        "Start: Azure SRE Agent",
        "Start: Azure Portal",
        "Background activities",
        "Review Azure resources and telemetry",
        "Connect the imported repository",
        "Review the Getting started thread"
    ]);
    assert.match(guidance, /TAP requested/);
    assert.match(guidance, /require working VM Integration Services/);
    assert.match(guidance, /Repository already connected/);
});
