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

import * as React from "react";
import { screen } from "@testing-library/react-native";

import { jest, describe, it, expect } from "@jest/globals";
import type * as ExpoRouter from "expo-router";
import type * as ReactQuery from "@tanstack/react-query";

import { render } from "@/test/providers";

import type { WalletFile } from "@/types/WalletFile";
import HomeScreen from "./index";

jest.mock("expo-router", () => {
  const actualExpoRouter = jest.requireActual(
    "expo-router"
  ) as typeof ExpoRouter;
  return {
    ...actualExpoRouter,
    useRouter: jest.fn<typeof actualExpoRouter.useRouter>().mockReturnValue({
      // Only mock a subset of the Expo Router
      navigate: jest.fn(),
    } as unknown as ReturnType<(typeof ExpoRouter)["useRouter"]>),
    useFocusEffect: jest.fn<typeof actualExpoRouter.useFocusEffect>(),
    Redirect: jest.fn<typeof actualExpoRouter.Redirect>(),
  };
});

const mockRefetch = jest.fn().mockImplementation(() => {
  return Promise.resolve({ data: [], status: "success" });
});

function mockUseQuery(
  data: WalletFile[]
): ReturnType<typeof ReactQuery.useQuery> {
  return {
    data,
    isLoading: false,
    isFetching: false,
    refetch: mockRefetch,
  } as unknown as ReturnType<typeof ReactQuery.useQuery>;
}

jest.mock("@tanstack/react-query", () => {
  const actualReactQuery = jest.requireActual(
    "@tanstack/react-query"
  ) as typeof ReactQuery;
  return {
    ...actualReactQuery,
    // Only mock the subset of the module relevant to the test.
    useIsMutating: jest.fn<typeof ReactQuery.useIsMutating>(),
    useMutation: jest.fn<typeof ReactQuery.useMutation>(),
    useQueryClient: jest.fn<typeof ReactQuery.useQueryClient>(),
    useQuery: jest.fn<typeof ReactQuery.useQuery>(),
  };
});

// This module is ESM-only, which is problematic for Jest imports.
jest.mock("@fortawesome/react-native-fontawesome", () => ({
  FontAwesomeIcon: jest.fn(),
}));

// This module is ESM-only, which is problematic for Jest imports.
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(),
}));

// This module is ESM-only, which is problematic for Jest imports.
jest.mock("mime", () => ({
  default: jest.fn(),
}));

describe("Snapshot testing the home screen", () => {
  it("shows the given file list", async () => {
    // Mocks begin...
    const { useQuery: mockedUseQuery } = jest.requireMock(
      "@tanstack/react-query"
    ) as jest.Mocked<typeof ReactQuery>;
    mockedUseQuery.mockReturnValue(
      mockUseQuery([
        {
          identifier: "some-file-identifier",
          fileName: "some-file-name",
          isRDFResource: true,
        },
      ])
    );
    // ... mocks end

    render(<HomeScreen />);
    await expect(screen.findByText("some-file-name")).resolves.toBeVisible();
  });

  it("shows add button on an empty file list", async () => {
    // Mocks begin...
    const { useQuery: mockedUseQuery } = jest.requireMock(
      "@tanstack/react-query"
    ) as jest.Mocked<typeof ReactQuery>;
    mockedUseQuery.mockReturnValue(mockUseQuery([]));
    // ... mocks end

    render(<HomeScreen />);
    await expect(
      screen.findByTestId("default-add-button")
    ).resolves.toBeVisible();
    // Because the way the menu should show up is tied to native behavior,
    // snapshot tests cannot check whether the button works or not.
  });
});
