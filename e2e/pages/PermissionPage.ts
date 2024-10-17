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

import { expect, web, by } from "detox";

class PermissionPage {
  private continueButton: Detox.WebElement;

  constructor() {
    this.continueButton = web.element(
      by.web.cssSelector('button[data-testid="prompt-continue"]')
    );
  }

  async clickContinueButton() {
    await expect(this.continueButton).toExist();
    await this.continueButton.tap();
  }
}

export default new PermissionPage();
