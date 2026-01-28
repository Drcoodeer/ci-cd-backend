const fs = require("fs");
const { execSync } = require("child_process");

const VERSION_FILE = "version.txt";

// Read version
function readVersion() {
    if (!fs.existsSync(VERSION_FILE)) {
        console.error("version.txt not found!");
        process.exit(1);
    }

    return fs.readFileSync(VERSION_FILE, "utf8").trim();
}

// Increase patch version (1.2.3 → 1.2.4)
function bumpVersion(version) {
    const parts = version.split(".").map(Number);

    if (parts.length !== 3 || parts.some(isNaN)) {
        console.error("Invalid version format. Use: x.y.z");
        process.exit(1);
    }

    parts[2] += 1; // bump patch

    return parts.join(".");
}

// Write new version
function writeVersion(version) {
    fs.writeFileSync(VERSION_FILE, version + "\n");
}

// Run git command
function git(cmd) {
    execSync(cmd, { stdio: "inherit" });
}

// Main
function main() {
    const oldVersion = readVersion();
    const newVersion = bumpVersion(oldVersion);

    console.log(`Updating version: ${oldVersion} → ${newVersion}`);

    writeVersion(newVersion);

    git(`git add ${VERSION_FILE}`);
    git(`git commit -m "Bump version to ${newVersion}"`);
    git(`git push`);

    console.log("Done ✅");
}

main();
