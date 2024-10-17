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

import type { ReactNode } from "react";
import React from "react";
import { render } from "@testing-library/react-native";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { SessionProvider } from "@/hooks/session";

const DefaultProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider value={DefaultTheme}>
      <BottomSheetModalProvider>
        <SessionProvider>{children}</SessionProvider>
      </BottomSheetModalProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: Parameters<typeof render>[0]) =>
  render(ui, { wrapper: DefaultProviders });

export { customRender as render };
