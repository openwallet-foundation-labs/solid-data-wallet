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

import { describe, beforeAll, it } from "@jest/globals";
import { device } from "detox";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import "./setupEnv";

describe("E2E Test", () => {
  jest.setTimeout(300000);

  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  const testUsername = process.env.TEST_ACCOUNT_USERNAME || "";
  const testPassword = process.env.TEST_ACCOUNT_PASSWORD || "";

  beforeEach(async () => {
    await device.reloadReactNative();
    await LoginPage.loginIfNeeded(testUsername, testPassword);
  });

  // eslint-disable-next-line jest/expect-expect
  it("verify home screen components", async () => {
    await HomePage.verifyHomeScreenComponents();
  });
});
