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
import * as SessionHooks from "@/hooks/session";
import type { UserInfo } from "@/constants/user";
import ProfileScreen from "./profile";

const { useSession } = SessionHooks;

const mockRefetch = jest.fn().mockImplementation(() => {
  return Promise.resolve({ data: {}, status: "success" });
});

function mockUseQuery(data: UserInfo): ReturnType<typeof ReactQuery.useQuery> {
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
    useLocalSearchParams: jest
      .fn<typeof actualExpoRouter.useLocalSearchParams>()
      .mockReturnValue({ forceLogout: undefined }),
    useNavigation: jest
      .fn<typeof actualExpoRouter.useNavigation>()
      .mockReturnValue({ setOptions: jest.fn() }),
    Redirect: jest.fn<typeof actualExpoRouter.Redirect>(),
  };
});

jest.mock("@/hooks/session", () => {
  const actualSessionModule = jest.requireActual(
    "@/hooks/session"
  ) as typeof SessionHooks;
  const actualSessionProvider = actualSessionModule.SessionProvider;
  return {
    useSession: jest.fn<typeof useSession>().mockReturnValue({
      signOut: jest.fn(),
      signIn: jest.fn(),
      session: "some-session-id",
    }),
    SessionProvider: actualSessionProvider,
  };
});

// This module is ESM-only, which is problematic for Jest imports.
jest.mock("@fortawesome/react-native-fontawesome", () => ({
  FontAwesomeIcon: jest.fn(),
}));

// Jest chokes on importing native SVG.
jest.mock("@/assets/images/access-solid.svg", () => {
  return jest.fn();
});

describe("Snapshot testing the home screen", () => {
  it("shows user profile", async () => {
    // Mocks begin...
    const { useQuery: mockedUseQuery } = jest.requireMock(
      "@tanstack/react-query"
    ) as jest.Mocked<typeof ReactQuery>;
    mockedUseQuery.mockReturnValue(
      mockUseQuery({
        webId: "https://example.org/id/some-username",
        name: "some-username",
        logo: "https://example.org/id/some-username#some-profile-pic",
        signupRequired: true,
      })
    );
    // ... mocks end

    render(<ProfileScreen />);
    await expect(screen.findByTestId("username")).resolves.toHaveTextContent(
      "some-username"
    );
    await expect(screen.findByTestId("webid")).resolves.toHaveTextContent(
      "https://example.org/id/some-username"
    );
    await expect(screen.findByTestId("qrCode")).resolves.toBeVisible();
  });
});
