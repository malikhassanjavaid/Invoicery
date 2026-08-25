import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const layoutPath = path.join(process.cwd(), "app", "layout.tsx");
const source = await readFile(layoutPath, "utf8");
const sourceFile = ts.createSourceFile(
  layoutPath,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);

const rootLayout = sourceFile.statements.find(
  (statement) =>
    ts.isFunctionDeclaration(statement) && statement.name?.text === "RootLayout",
);

assert(rootLayout && ts.isFunctionDeclaration(rootLayout), "RootLayout must be a function");

const returnStatement = rootLayout.body?.statements.find(ts.isReturnStatement);
let returnedNode = returnStatement?.expression;

while (returnedNode && ts.isParenthesizedExpression(returnedNode)) {
  returnedNode = returnedNode.expression;
}

assert(returnedNode && ts.isJsxElement(returnedNode), "RootLayout must return a JSX element");
assert.equal(
  returnedNode.openingElement.tagName.getText(sourceFile),
  "html",
  "RootLayout must return <html> as the document root so Clerk initializes after the shell hydrates",
);

const body = returnedNode.children.find(
  (child) =>
    ts.isJsxElement(child) && child.openingElement.tagName.getText(sourceFile) === "body",
);

assert(body && ts.isJsxElement(body), "RootLayout must render a <body> element");

let clerkProviderIsInsideBody = false;

function visit(node) {
  if (
    ts.isJsxElement(node) &&
    node.openingElement.tagName.getText(sourceFile) === "ClerkProvider"
  ) {
    clerkProviderIsInsideBody = true;
  }

  ts.forEachChild(node, visit);
}

visit(body);

assert(
  clerkProviderIsInsideBody,
  "ClerkProvider must be inside <body> so its UI renderer mounts after hydration",
);

console.log("ClerkProvider is mounted inside the document body.");
