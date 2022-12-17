module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Always use the gql variant from src/gql (which has proper Typescript types)",
            category: "Lernfair User-App Rule",
            recommended: true,
            url: "https://github.com/corona-school/user-app/tree/main/linter"
        },
        fixable: "code"
    },
    create(context) {
        let importNode = null;

        return {
            "ImportDeclaration": function(_importNode) {
                importNode = _importNode;

            },
            "ImportDeclaration:exit": function () {
                importNode = null;
            },
            "ImportSpecifier": function(importSpecifierNode) {
                if (importSpecifierNode.imported.name !== "gql") {
                    return;
                }

                if (importNode.source.value.endsWith("src/gql") || importNode.source.value.endsWith("./gql")) {
                    return;
                }

                context.report({ 
                
                        node: importNode,
                        message: `Use gql from src/gql instead which has proper Typescript types`,
                        fix(fixer) {
                            const subfolders = context.getFilename().split("src/")[1].split("/").length - 1;
                            return [
                                fixer.removeRange([importSpecifierNode.range[0], importSpecifierNode.range[1] + 1]),
                                fixer.insertTextBefore(importNode, `import { gql } from './${"../".repeat(subfolders)}gql';\n`)
                            ];
                         }
                });
            },
            "TaggedTemplateExpression": function(taggedTemplateNode) {
                if (taggedTemplateNode.tag.name !== "gql") {
                    return;
                }

                context.report({
                    node: taggedTemplateNode,
                    message: `Use regular function call instead of tagged template literal`,
                    fix(fixer) {
                                return [
                                    fixer.insertTextBeforeRange(taggedTemplateNode.quasi.range, "("),
                                    fixer.insertTextAfterRange(taggedTemplateNode.quasi.range, ")"),
                                ]
                            }
                });
            }
        };
    }
};