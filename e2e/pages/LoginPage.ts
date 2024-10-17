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
import { by, element, expect, web } from "detox";

import detoxConfig from "../../.detoxrc";
import HomePage from "./HomePage";
import PermissionPage from "./PermissionPage";

class LoginPage {
  private loginButton: Detox.NativeElement;

  private signInFormUsernameInput: Detox.WebElement;

  private signInFormPasswordInput: Detox.WebElement;

  private signInSubmitButton: Detox.WebElement;

  constructor() {
    this.loginButton = element(by.text("Login"));
    this.signInFormUsernameInput = web.element(
      by.web.xpath('//*[@id="signInFormUsername"]')
    );
    this.signInFormPasswordInput = web.element(
      by.web.xpath('//*[@id="signInFormPassword"]')
    );
    this.signInSubmitButton = web.element(
      by.web.xpath('//*[@name="signInSubmitButton"]')
    );
  }

  async login(
    username: string,
    password: string,
    timeout: number = detoxConfig.custom.defaultTestTimeout
  ) {
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.tap();
    await new Promise((resolve) => {
      setTimeout(resolve, timeout * 2);
    });

    // Perform login
    await expect(this.signInFormUsernameInput).toExist();
    await this.signInFormUsernameInput.replaceText(username);

    await expect(this.signInFormPasswordInput).toExist();
    await this.signInFormPasswordInput.replaceText(password);

    await new Promise((resolve) => {
      setTimeout(resolve, timeout * 5);
    });

    await expect(this.signInSubmitButton).toExist();
    await this.signInSubmitButton.tap();

    // Handle permission screen
    await new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
    await PermissionPage.clickContinueButton();
  }

  async loginIfNeeded(username: string, password: string) {
    if (!(await HomePage.isHomeScreenVisible())) {
      await this.login(username, password);
    }
  }
}

export default new LoginPage();
