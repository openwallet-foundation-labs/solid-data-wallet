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
const {
  withAppBuildGradle,
  withGradleProperties,
} = require("expo/config-plugins");
const { readFile } = require("fs/promises");

module.exports = function withSigningConfig(config) {
  // Add path to gradle signing snippet to gradle.properties.
  // This is then used by the android/app/build.gradle mod.
  withGradleProperties(config, async (gradleProps) => {
    // Leave signing config unchanged in EAS builds
    if (process.env.EAS_BUILD) {
      return gradleProps;
    }
    if (process.env.SIGNING_CONFIG_PATH === undefined) {
      throw new Error("Missing environment variable SIGNING_CONFIG_PATH");
    }
    gradleProps.modResults.push({
      type: "comment",
      value: "Path to the signing configuration gradle snippet",
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.signing",
      value: process.env.SIGNING_CONFIG_PATH,
    });
    if (process.env.KEYSTORE_PATH === undefined) {
      throw new Error("Missing environment variable KEYSTORE_PATH");
    }
    if (process.env.KEYSTORE_PASSWORD === undefined) {
      throw new Error("Missing environment variable KEYSTORE_PASSWORD");
    }
    gradleProps.modResults.push({
      type: "comment",
      value: "Keystore configuration for app signing.",
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.keystore.file",
      value: process.env.KEYSTORE_PATH,
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.keystore.password",
      value: process.env.KEYSTORE_PASSWORD,
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.key.alias",
      value: "wallet",
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.key.password",
      value: process.env.KEYSTORE_PASSWORD,
    });
    return gradleProps;
  });
  // Append a block to android/app/build.gradle to reuse signing config
  // from /android-config/signing-config.gradle.
  withAppBuildGradle(config, async (buildGradle) => {
    const updatedBuildGradle = { ...buildGradle };
    // The following path is relative to the project root
    const buildGradleSnippet = await readFile(
      "./android-config/extend-build.gradle",
      { encoding: "utf8" }
    );
    updatedBuildGradle.modResults.contents =
      buildGradle.modResults.contents.concat("\n", buildGradleSnippet);
    return updatedBuildGradle;
  });
  return config;
};
