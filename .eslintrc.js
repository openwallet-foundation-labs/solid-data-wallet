//
// Copyright Inrupt Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

module.exports = {
  extends: ["expo", "@inrupt/eslint-config-lib"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.eslint.json",
  },
  ignorePatterns: [
    "expo-env.d.ts", // Exclude expo-env.d.ts from ESLint checks
  ],
  rules: {
    "no-undef": "off", // TypeScript handles this
    "no-use-before-define": "off", // Disable the base rule
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, variables: false, classes: true, typedefs: true },
    ],
    "no-shadow": "off", // Disable the base rule
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        ignoreRestSiblings: true,
        caughtErrors: "none",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-var-requires": [
      "error", {
        // These exceptions cover imports from CJS configuration modules (e.g. app.config.js, plugins/*.js)
        allow: ["plugins", "fs"]
      }
    ],
    "import/prefer-default-export": "off",
    "no-console": "off",

    // Ensure all code has a license header:
    "header/header": ["warn", require.resolve("./header-license.js")],
  },
};
