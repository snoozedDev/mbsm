/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@mbsm/eslint/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
