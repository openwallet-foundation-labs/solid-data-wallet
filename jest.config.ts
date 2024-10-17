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
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  // FIXME: use jest-expo/universal preset
  preset: "jest-expo/android",
  // The following must match the tsconfig paths.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  rootDir: ".",
  testMatch: ["<rootDir>/app/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["e2e/"],
  testTimeout: 120000,
  maxWorkers: 1,
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "./coverage/",
  coverageReporters: process.env.CI ? ["text", "lcov"] : ["text"],
};

export default config;
