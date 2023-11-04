const { readdirSync, readFileSync, writeFileSync } = require("fs");
const process = require("process");
const path = require("path");

console.log("+---- Lern-Fair User App Translation -----+");

const command = process.argv[2]?.trim() ?? "";
if (!["", "check", "translate"].includes(command))
    throw new Error(`Unknown Command '${command}'`)

// -------- File Handling -------------

function readLanguage(filename) {
    return JSON.parse(readFileSync(path.resolve(__dirname, "../src/lang/", filename), { encoding: "utf-8", }));
}

function writeLanguage(filename, translationTree) {
    const json = JSON.stringify(translationTree, null, 2);
    writeFileSync(path.resolve(__dirname, "../src/lang/", filename), json);
    console.log("Written language", filename);
}

// ------- Tree Traversal --------------

function lookup(tree, path) {
    let cursor = tree;
    for (const step of path) {
        if (!(step in cursor)) throw new Error(`Failed to resolve ${step} in ${path.join(", ")}`);
        cursor = cursor[step];
    }
    return cursor;
}

// Returns a list of paths in sourceTree that are missing in targetTree
// [{ path: ["a"], type: "object" }, { path: ["a", "b"], "type": "string" }]
function findMissingPaths(sourceTree, targetTree, path = []) {
    return [
        ...Object.keys(sourceTree)
            .filter(key => !(key in targetTree))
            .map(key => ({ type: typeof sourceTree[key], path: [...path, key] })),

        ...Object.keys(sourceTree)
            .filter(key => typeof sourceTree[key] === "object")
            .flatMap(key => findMissingPaths(sourceTree[key], targetTree[key] ?? {}, path.concat(key)))
    ];
}

// ----------- Translation ------------------

function addMissingObjects(tree, paths) {
    console.log(" + add missing objects");
    for (const missingPath of paths) {
        const isArray = Array.isArray(lookup(primaryLanguageTree, missingPath));

        const missingKey = missingPath.pop();
        const root = lookup(tree, missingPath);
        
        root[missingKey] = isArray ? []: {};
        console.log(`  + ${missingPath.join(".")}.${missingKey} = ${isArray ? "[]" : "{}"}`);
    }
}

function addMissingStrings(tree, paths) {
    console.log(" + add missing translations");
    for (const missingPath of paths) {
        const sourceValue = lookup(primaryLanguageTree, missingPath);

        const missingKey = missingPath.pop();
        const root = lookup(tree, missingPath);
        
        const targetValue = `translate(${sourceValue})`;
        root[missingKey] = targetValue;
        console.log(`  + ${missingPath.join(".")}.${missingKey} = "${targetValue}"`);
    }
}

function removeObsoletePaths(tree, paths) {
    console.log(" - remove obsolete translations");
    for (const path of [...paths].reverse()) {
        const obsoleteKey = path.pop();
        const root = lookup(tree, path);

        delete root[obsoleteKey];
        console.log(`  - ${path.join(".")}.${obsoleteKey}`);
    }
}


const languageFiles = readdirSync(path.resolve(__dirname, "../src/lang/"), { encoding: "utf-8" }).filter(it => it !== "de.json");

const primaryLanguageTree = readLanguage("de.json");

let missmatches = false;

for (const languageFile of languageFiles) {
    console.log(`\n\n+----- ${languageFile}`);
    const languageTree = readLanguage(languageFile);

    const missingPaths = findMissingPaths(primaryLanguageTree, languageTree);
    const missingObjects = missingPaths.filter(it => it.type === "object").map(it => it.path);
    const missingStrings = missingPaths.filter(it => it.type === "string").map(it => it.path);
    const obsoletePaths = findMissingPaths(languageTree, primaryLanguageTree).map(it => it.path);
    
    if (command === "translate" || command === "") {
        addMissingObjects(languageTree, missingObjects);
        addMissingStrings(languageTree, missingStrings);
        removeObsoletePaths(languageTree, obsoletePaths);
        writeLanguage(languageFile, languageTree);
    }

    if (command === "check") {
        for (const missingObject of missingObjects)
            console.log(` + ${missingObject.join(".")}`);
        for (const missingString of missingStrings)
            console.log(` + ${missingString.join(".")}`);
        for (const obsoletePath of obsoletePaths)
            console.log(` - ${obsoletePath.join(".")}`);

        if (missingObjects.length || missingStrings.length || obsoletePaths.length) {
            console.error(`de.json differs from ${languageFile}`);
            missmatches = true;
        } else {
            console.info(`de.json matches ${languageFile}`);
        }
    }
}

if (missmatches) {
    console.error("\n\nmissmatches detected. Run 'npm run translate' to fix them");
    process.exit(1);
}