const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { execSync } = require("child_process");
const process = require("process");
const path = require("path");

console.log("+---- Lern-Fair User App Translation -----+");

const command = process.argv[2]?.trim() ?? "";
if (!["", "check", "translate", "export", "import"].includes(command))
    throw new Error(`Unknown Command '${command}'`)

// -------- File Handling -------------

function readLanguage(filename) {
    return JSON.parse(readFileSync(path.resolve(__dirname, "../src/lang/", filename), { encoding: "utf-8", }));
}

function writeLanguage(filename, translationTree) {
    const json = JSON.stringify(translationTree, null, 4);
    writeFileSync(path.resolve(__dirname, "../src/lang/", filename), json);
    console.log("Written language", filename);
}

// Gets the language file at the point in time when the current HEAD was branched off from main:
// - A -- (B) -- C -- D  = main
//    \    \
//     E -- F -- G = HEAD, feat/something       
//
// That way, we can always check out some branch that added new translations, i.e. "feat/something" after it was merged
// And export a diff of all the translations that were added, and can then work with all the changes that were made in there
function readLanguageFromMain(filename) {
    try {
        const mergeBase = execSync(`git merge-base -a main HEAD`, { encoding: "utf-8"}).trim();
        const mergeBaseName = execSync(`git show --oneline --no-patch ${mergeBase}`, { encoding: "utf-8"});
        console.log(`Found merge base between main and HEAD:\n${mergeBaseName}`)

        const file = execSync(`git show ${mergeBase}:src/lang/${filename}`, { encoding: "utf-8" });
        return JSON.parse(file);
    } catch(error) {
        console.log("Failed to load language file from main");
        return null
    }
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

// Like findMissingPaths, but finds paths that were changed:
function findChangedPaths(sourceTree, targetTree, path = []) {
    return [
        ...Object.keys(sourceTree)
            .filter(key => key in targetTree && typeof sourceTree[key] === "string" && sourceTree[key] !== targetTree[key])
            .map(key => ({ type: typeof sourceTree[key], path: [...path, key] })),

        ...Object.keys(sourceTree)
            .filter(key => typeof sourceTree[key] === "object" && targetTree[key])
            .flatMap(key => findMissingPaths(sourceTree[key], targetTree[key], path.concat(key)))
    ];
}

// ----------- Translation ------------------

// Adds missing objects or arrays
function addMissingObjects(primaryLanguageTree, tree, paths) {
    console.log(" + add missing objects");
    for (const missingPath of paths) {
        const isArray = Array.isArray(lookup(primaryLanguageTree, missingPath));

        const missingKey = missingPath.pop();
        const root = lookup(tree, missingPath);
        
        root[missingKey] = isArray ? []: {};
        console.log(`  + ${missingPath.join(".")}.${missingKey} = ${isArray ? "[]" : "{}"}`);
    }
}

// Adds strings (so the actual translations) to the target language
//  by calling the Weglot API with all missing translations
async function addMissingStrings(primaryLanguageTree, tree, paths, language) {
    console.log(" + add missing translations");

    // First Pass: Collect all texts to translate
    const sourceValues = [];

    for (const missingPath of paths) {
        sourceValues.push( lookup(primaryLanguageTree, missingPath) );
    }

    // Translate all texts in bulk
    const targetValues = await translate(sourceValues, "de", language);

    for (const [index, missingPath] of paths.entries()) {
        const missingKey = missingPath.pop();
        const root = lookup(tree, missingPath);
        
        const targetValue = targetValues[index];
        root[missingKey] = targetValue;
        console.log(`  + ${missingPath.join(".")}.${missingKey} = "${targetValue}"`);
    }
}

// Removes keys not present in the primary language from other language files
function removeObsoletePaths(tree, paths) {
    console.log(" - remove obsolete translations");
    for (const path of [...paths].reverse()) {
        const obsoleteKey = path.pop();
        const root = lookup(tree, path);

        delete root[obsoleteKey];
        console.log(`  - ${path.join(".")}.${obsoleteKey}`);
    }
}

// -------------- Import / Export ---------------
function exportDiffIntoFile(primaryLanguageTree, languageTree, paths, filename) {
    let result = "";

    for (const path of paths) {
        let original = lookup(primaryLanguageTree, path);
        let translated = lookup(languageTree, path);

        // Escape
        original = original.replaceAll("\n", "\\n");
        translated = translated.replaceAll("\n", "\\n");
        
        result += `# ${path.join(".")}\n`;
        result += `${original}\n`;
        result += `${translated}\n`;
        result += `\n\n`;
    }


    writeFileSync(path.resolve(__dirname, "../src/lang/", filename), result, { encoding: "utf-8"});
}

function importDiffFromFile(filename, primaryLanguageTree, languageTree) {
    let lines = readFileSync(path.resolve(__dirname, "../src/lang/", filename), { encoding: "utf-8"}).split("\n");
    lines = lines.filter(it => it.trim() !== "");

    if (lines.length % 3 !== 0) {
        throw new Error(`Invalid input file, number of non empty lines must be a multiple of three`);
    }

    for (let index = 0; index + 2 < lines.length; index += 3) {
        const pathLine = lines[index];
        let original = lines[index + 1];
        let translated = lines[index + 2];

        if (!pathLine.includes("#")) {
            throw new Error(`Invalid input file in line ${index}: ${pathLine}`);
        }

        const path = pathLine.slice(2).split(".");

        // Unescape
        original = original.replaceAll("\\n", "\n");
        translated = translated.replaceAll("\\n", "\n");
        
        const currentOriginal = lookup(primaryLanguageTree, path);
        if (currentOriginal !== original) {
            throw new Error(`Translation failed for ${path.join(".")}: "${original}" was translated, but "${currentOriginal}" is present currently`);
        }

        const currentTranslated = lookup(languageTree, path);
        if (currentTranslated === translated) continue;

        checkTemplates(currentTranslated, translated);

        console.log(`# ${path.join(".")}\n ${original}\n - ${currentTranslated}\n + ${translated}`);

        const root = lookup(languageTree, path.slice(0, -1));
        root[ path[path.length - 1] ] = translated;
    }

}

// Gets the current short hash of the latest commit, great way to identify a certain point in the (git) history
function getCurrentCommit() {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
}

// -------------- Translation -------------------

function getTemplates(text) {
    return [...text.matchAll(/\{\{([\wäöüÄÖÜß]+)\}\}/ig)].map(it => it[1]);
}

function checkTemplates(expected, actual) {
    const expectedTemplates = getTemplates(expected);
    const actualTemplates = getTemplates(actual);

    expectedTemplates.sort();
    actualTemplates.sort();

    if (expectedTemplates.length !== actualTemplates.length || expectedTemplates.some((it, i) => it !== actualTemplates[i])) {
        throw new Error(`Expected templates: ${expectedTemplates.join(", ")}, got: ${actualTemplates.join(", ")}`);
    }
}

async function translate(texts, fromLanguage, toLanguage) {
    if (!texts.length) {
        return [];
    }

    const templatesPerText = [];
    const escapedTexts = [];

    for (let i = 0; i < texts.length; i++) {
        let text = texts[i];
        const templates = getTemplates(texts[i]);
        templatesPerText.push(templates);

        let escapedText = text;
        for (const [index, template] of templates.entries()) {
            escapedText = escapedText.replaceAll(`{{${template}}}`, `[[${index}]]`);
        }

        console.log(`escaped "${text}" to "${escapedText}"`);

        escapedTexts[i] = escapedText;
    }

    let results;

    if (process.env.WEGLOT_API_KEY)
        results = await translateWithWeglot(escapedTexts, fromLanguage, toLanguage);
    /* if (process.env.GOOGLE_API_KEY)
        results = await translateWithGoogle(escapedTexts, fromLanguage, toLanguage);
    if (process.env.DEEPL_API_KEY)
        results = await translateWithDeepL(escapedTexts, fromLanguage, toLanguage); */

    if (!results) {
        throw new Error(`No Translator configured`);
    }

    if (results.length !== texts.length) {
        throw new Error(`Missing Translations, expected: ${texts.length} got ${results.length}`);
    }

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        let result = results[i];
        const templates = templatesPerText[i];
        
        let unescapedResult = result;
        for (const [index, template] of templates.entries()) {
            unescapedResult = unescapedResult.replaceAll(`[[${index}]]`, `{{${template}}}`);
        }

        console.log(`unescaped "${result}" to "${unescapedResult}"`);
        checkTemplates(text, unescapedResult);

        results[i] = unescapedResult;
    }

    return results;
}

// ------------- Weglot API ---------------

async function translateWithWeglot(texts, fromLanguage, toLanguage) {
    const { WEGLOT_API_KEY } = process.env;
    if (!WEGLOT_API_KEY) throw new Error(`Missing environment variable WEGLOT_API_KEY`);

    const body = JSON.stringify({
        l_from: fromLanguage,
        l_to: toLanguage,
        words: texts.map(w => ({ w, t: 1 })),
        request_url: "https://app.lern-fair.de"
    });

    console.log(body);

    const response = await fetch(`https://api.weglot.com/translate?api_key=${WEGLOT_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body,
    });

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to fetch from Weglot: ${await response.text()}`);
    }

    const result = (await response.json()).to_words;
    console.log("Weglot returned: ", result);

    return result;
}

// ------------- Google API ---------------
/* async function translateWithGoogle(texts, fromLanguage, toLanguage) {
    const { GOOGLE_API_KEY } = process.env;
    if (!GOOGLE_API_KEY) throw new Error(`Missing environment variable GOOGLE_API_KEY`);

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: texts,
            target: toLanguage,
            source: fromLanguage,
            key: GOOGLE_API_KEY
        }),
    });

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to fetch from Google`);
    }

    const data = await response.json();
    const result = data.data.map(it => it.translatedText);

    return result;
} */

// ------------- DeepL API ---------------
/* async function translateWithDeepL(texts, fromLanguage, toLanguage) {
    const { DEEPL_API_KEY } = process.env;
    if (!DEEPL_API_KEY) throw new Error(`Missing environment variable DEEPL_API_KEY`);

    const response = await fetch(`https://api-free.deepl.com/v2/translate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": DEEPL_API_KEY
        },
        body: JSON.stringify({
            text: texts,
            target_lang: toLanguage,
            source_lang: fromLanguage,
            formality: "more",
            tag_handling: "html"
        }),
    });

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to fetch from DeepL`);
    }

    const data = await response.json();
    const result = data.translations.map(it => it.text);

    return result;
} */


// ------------- Main ---------------------
(async function main() {


const languageFiles = readdirSync(path.resolve(__dirname, "../src/lang/"), { encoding: "utf-8" }).filter(it => it !== "de.json");

// The main language file all other files are compared to:
const primaryLanguageTree = readLanguage("de.json");


let missmatches = false;

for (const languageFile of languageFiles) {
    const [language, extension] = languageFile.split(".");
    if (extension !== "json") continue;

    console.log(`\n\n+----- ${languageFile}`);
    const languageTree = readLanguage(languageFile);

    const missingPaths = findMissingPaths(primaryLanguageTree, languageTree);
    const missingObjects = missingPaths.filter(it => it.type === "object").map(it => it.path);
    const missingStrings = missingPaths.filter(it => it.type === "string").map(it => it.path);
    const obsoletePaths = findMissingPaths(languageTree, primaryLanguageTree).map(it => it.path);
    
    if (command === "translate" || command === "") {
        addMissingObjects(primaryLanguageTree, languageTree, missingObjects);
        await addMissingStrings(primaryLanguageTree, languageTree, missingStrings, language);
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

    if (command === "export") {
        if (missingObjects.length || missingStrings.length || obsoletePaths.length) {
            throw new Error(`Cannot export when the language files are not in sync`);
        }

        const onMain = readLanguageFromMain(languageFile) ?? {};
        const addedPaths = findMissingPaths(languageTree, onMain).filter(it => it.type === "string");
        const changedPaths = findChangedPaths(languageTree, onMain);
        const toExport = [...addedPaths, ...changedPaths].map(it => it.path);

        if (!toExport.length) {
            console.log("no changes to export between HEAD and main");
            continue;
        }

        const outFilename = `de_to_${language}.${getCurrentCommit()}.txt`;
        exportDiffIntoFile(primaryLanguageTree, languageTree, toExport, outFilename);
        console.log(`${toExport.length} changes exported to ${outFilename}`);
    }

    if (command === "import") {
        const importFiles = languageFiles.filter(name => name.endsWith("txt") && name.startsWith(`de_to_${language}`));
        if (!importFiles.length) {
            console.log("Found no import file for " + language);
        }

        if (importFiles.length > 1) {
            throw new Error(`Found multiple import files for ${language}`);
        }

        const importFile = importFiles[0];
        console.log("importing " + importFile);
        importDiffFromFile(importFile, primaryLanguageTree, languageTree);
        writeLanguage(languageFile, languageTree);
    }
}

if (missmatches) {
    console.error("\n\nmissmatches detected. Run 'npm run translate' to fix them");
    process.exit(1);
}

})();