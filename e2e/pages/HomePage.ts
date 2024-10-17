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
import { by, element, waitFor } from "detox";
import detoxConfig from "../../.detoxrc";

class HomePage {
  private homeTitle: Detox.NativeElement;

  private requestsTab: Detox.NativeElement;

  private addButton: Detox.NativeElement;

  private accessTab: Detox.NativeElement;

  private profileTab: Detox.NativeElement;

  private walletTab: Detox.NativeElement;

  constructor() {
    this.homeTitle = element(by.text("Home"));
    this.requestsTab = element(by.text("Requests"));
    this.addButton = element(by.text("Add"));
    this.accessTab = element(by.text("Access"));
    this.profileTab = element(by.text("Profile"));
    this.walletTab = element(by.text("Wallet"));
  }

  async verifyHomeScreenComponents(
    timeout: number = detoxConfig.custom.defaultTestTimeout
  ) {
    await waitFor(this.homeTitle)
      .toBeVisible()
      .withTimeout(timeout * 2);
    await waitFor(this.requestsTab).toBeVisible().withTimeout(timeout);
    await waitFor(this.addButton).toBeVisible().withTimeout(timeout);
    await waitFor(this.accessTab).toBeVisible().withTimeout(timeout);
    await waitFor(this.profileTab).toBeVisible().withTimeout(timeout);
    await waitFor(this.walletTab).toBeVisible().withTimeout(timeout);
  }

  async isHomeScreenVisible(
    timeout: number = detoxConfig.custom.defaultTestTimeout
  ): Promise<boolean> {
    try {
      await waitFor(this.homeTitle).toBeVisible().withTimeout(timeout);
      // eslint-disable-next-line no-console
      console.log("Home screen is visible");
      return true;
    } catch {
      // eslint-disable-next-line no-console
      console.warn(
        `Warning: Home screen did not load within ${timeout}ms, login may be required`
      );
      return false;
    }
  }

  async clickOnAddButton() {
    await waitFor(this.addButton)
      .toBeVisible()
      .withTimeout(detoxConfig.custom.defaultTestTimeout);
    await this.addButton.tap();
  }

  // eslint-disable-next-line class-methods-use-this
  async showMenuOption(option: string) {
    const menuOptionElement = element(by.text(option));
    await waitFor(menuOptionElement)
      .toBeVisible()
      .withTimeout(detoxConfig.custom.defaultTestTimeout);
  }
}

export default new HomePage();
