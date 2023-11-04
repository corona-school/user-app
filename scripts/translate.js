const { readdirSync, readFileSync, writeFileSync } = require("fs");
const path = require("path");

console.log("+---- Lern-Fair User App Translation -----+");

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

const languageFiles = readdirSync(path.resolve(__dirname, "../src/lang/"), { encoding: "utf-8" }).filter(it => it !== "de.json");

const primaryLanguageTree = readLanguage("de.json");

for (const languageFile of languageFiles) {
    console.log(`\n\n+----- ${languageFile}`);
    const languageTree = readLanguage(languageFile);

    const missingPaths = findMissingPaths(primaryLanguageTree, languageTree);
    const missingObjects = missingPaths.filter(it => it.type === "object").map(it => it.path);
    const missingStrings = missingPaths.filter(it => it.type === "string").map(it => it.path);

    console.log(" + add missing objects");
    for (const missingPath of missingObjects) {
        const isArray = Array.isArray(lookup(primaryLanguageTree, missingPath));

        const missingKey = missingPath.pop();
        const root = lookup(languageTree, missingPath);
        
        root[missingKey] = isArray ? []: {};
        console.log(`  + ${missingPath.join(".")}.${missingKey} = ${isArray ? "[]" : "{}"}`);
    }

    console.log(" + add missing translations");
    for (const missingPath of missingStrings) {
        const sourceValue = lookup(primaryLanguageTree, missingPath);

        const missingKey = missingPath.pop();
        const root = lookup(languageTree, missingPath);
        
        const targetValue = `translate(${sourceValue})`;
        root[missingKey] = targetValue;
        console.log(`  + ${missingPath.join(".")}.${missingKey} = "${targetValue}"`);
    }

    const obsoletePaths = findMissingPaths(languageTree, primaryLanguageTree);
    console.log(" - remove obsolete translations");
    for (const { path } of obsoletePaths.reverse()) {
        const obsoleteKey = path.pop();
        const root = lookup(languageTree, path);

        delete root[obsoleteKey];
        console.log(`  - ${path.join(".")}.${obsoleteKey}`);
    }

    writeLanguage(languageFile, languageTree);
}