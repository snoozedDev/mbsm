/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@mbsm/eslint-config/package.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
