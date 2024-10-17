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
import type { ExpoConfig, ConfigContext } from "expo/config";

const isDevelopmentMode =
  process.env.NODE_ENV === "development" ||
  process.env.EAS_BUILD_PROFILE === "development";
const isTestMode =
  !isDevelopmentMode &&
  process.env.EAS_BUILD_PROFILE !== "production" &&
  process.env.EAS_BUILD_PROFILE === "preview";

function validateEnv() {
  if (
    typeof process.env.EXPO_PUBLIC_WALLET_API !== "string" ||
    !URL.canParse(process.env.EXPO_PUBLIC_WALLET_API)
  ) {
    throw new Error(
      `Missing or invalid environment variable EXPO_PUBLIC_WALLET_API. Expected a valid URL, found ${process.env.EXPO_PUBLIC_WALLET_API}`
    );
  }
  if (
    typeof process.env.EXPO_PUBLIC_LOGIN_URL !== "string" ||
    !URL.canParse(process.env.EXPO_PUBLIC_LOGIN_URL)
  ) {
    throw new Error(
      `Missing or invalid environment variable EXPO_PUBLIC_LOGIN_URL. Expected a valid URL, found ${process.env.EXPO_PUBLIC_LOGIN_URL}`
    );
  }
  if (typeof process.env.EAS_PROJECT_ID !== "string") {
    throw new Error(`Missing environment variable EAS_PROJECT_ID.`);
  }
}
if (process.env.EAS_BUILD === "true") {
  // Check that all required environment variables are defined at build time.
  validateEnv();
}

const baseConfig: ExpoConfig = {
  name: "inrupt-data-wallet",
  slug: "inrupt-data-wallet",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  scheme: "inrupt-data-wallet",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.inrupt.inrupt-data-wallet",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.inrupt.inrupt_data_wallet",
    permissions: [
      "android.permission.CAMERA",
      // Not including the following prevents from taking pictures
      // and reading the media gallery in Android 12.
      "android.permission.WRITE_EXTERNAL_STORAGE",
    ],
    blockedPermissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.READ_EXTERNAL_STORAGE",
    ],
    allowBackup: false,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/logo.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: isDevelopmentMode,
        },
      },
    ],
    "./plugins/withSigningConfig",
    // The detox plugin interferes with the generated output, so
    // only include it when actually building for tests.
    ...(isTestMode ? ["@config-plugins/detox"] : []),
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
  owner: "inrupt",
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  ...baseConfig,
});
