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

// Adds 
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


async function translate(texts, fromLanguage, toLanguage) {
    if (process.env.WEGLOT_API_KEY)
        return await translateWithWeglot(texts, fromLanguage, toLanguage);
    if (process.env.GOOGLE_API_KEY)
        return await translateWithGoogle(texts, fromLanguage, toLanguage);
    if (process.env.DEEPL_API_KEY)
        return await translateWithDeepL(texts, fromLanguage, toLanguage);

    throw new Error(`No Translator configured`);
}

// ------------- Weglot API ---------------

async function translateWithWeglot(texts, fromLanguage, toLanguage) {
    const { WEGLOT_API_KEY } = process.env;
    if (!WEGLOT_API_KEY) throw new Error(`Missing environment variable WEGLOT_API_KEY`);

    const response = await fetch(`https://api.weglot.com/translate?api_key=${WEGLOT_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            l_from: fromLanguage,
            l_to: toLanguage,
            words: [ texts.map(w => ({ w, t: 1 }))]
        }),
    });

    if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to fetch from Weglot`);
    }

    const result = await response.json();
    // TODO: What is the result format?

    return result;
}

// ------------- Google API ---------------
async function translateWithGoogle(texts, fromLanguage, toLanguage) {
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
}

// ------------- DeepL API ---------------
async function translateWithDeepL(texts, fromLanguage, toLanguage) {
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
}


// ------------- Main ---------------------
(async function main() {


const languageFiles = readdirSync(path.resolve(__dirname, "../src/lang/"), { encoding: "utf-8" }).filter(it => it !== "de.json");

// The main language file all other files are compared to:
const primaryLanguageTree = readLanguage("de.json");


let missmatches = false;

for (const languageFile of languageFiles) {
    const language = languageFile.split(".")[0];
    console.log(`\n\n+----- ${languageFile}`);
    const languageTree = readLanguage(languageFile);

    const missingPaths = findMissingPaths(primaryLanguageTree, languageTree);
    const missingObjects = missingPaths.filter(it => it.type === "object").map(it => it.path);
    const missingStrings = missingPaths.filter(it => it.type === "string").map(it => it.path);
    const obsoletePaths = findMissingPaths(languageTree, primaryLanguageTree).map(it => it.path);
    
    if (command === "translate" || command === "") {
        addMissingObjects(primaryLanguageTree, languageTree, missingObjects);
        addMissingStrings(primaryLanguageTree, languageTree, missingStrings, language);
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

})();