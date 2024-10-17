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
import { screen, render } from "@testing-library/react-native";

import { jest, describe, it, expect } from "@jest/globals";
import type * as ExpoRouter from "expo-router";

import LoginScreen from "@/app/login";
import * as SessionHooks from "@/hooks/session";

const { useSession } = SessionHooks;

jest.mock("@/hooks/session", () => {
  const actualSessionModule = jest.requireActual(
    "@/hooks/session"
  ) as typeof SessionHooks;
  const actualSessionProvider = actualSessionModule.SessionProvider;
  return {
    useSession: jest.fn<typeof useSession>(),
    SessionProvider: actualSessionProvider,
  };
});

jest.mock("expo-router", () => {
  const actualExpoRouter = jest.requireActual(
    "expo-router"
  ) as typeof ExpoRouter;
  return {
    ...actualExpoRouter,
    Redirect: jest.fn<typeof actualExpoRouter.Redirect>(),
  };
});

// Not mocking this results in an exception during rendering.
jest.mock("react-native-svg");

jest.mock("expo-constants", () => ({
  // Pretend we run in expo to avoid the cookie clearing issue.
  appOwnership: "expo",
}));

// Jest chokes on importing native SVG.
jest.mock("@/assets/images/future_co.svg", () => {
  return jest.fn();
});

// Mock the react-native RCTNetworking module
jest.mock("react-native/Libraries/Network/RCTNetworking", () => ({
  default: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    clearCookies: jest.fn((callback) => callback(true)),
  },
}));

describe("Snapshot testing the login screen", () => {
  it("renders the login screen when unauthenticated", async () => {
    // Mocks start...
    const { useSession: mockedUseSession } = jest.requireMock(
      "@/hooks/session"
    ) as jest.Mocked<typeof SessionHooks>;
    const [mockedSignIn, mockedSignOut, mockedSession] = [
      jest.fn(),
      jest.fn(),
      // When the session is logged out, the sessionId is undefined.
      undefined,
    ];
    mockedUseSession.mockReturnValueOnce({
      signIn: mockedSignIn,
      signOut: mockedSignOut,
      session: mockedSession,
    });
    // ... mocks end.

    render(<LoginScreen />);
    const loginButton = await screen.findByTestId("login-button");
    expect(loginButton).toBeDefined();
    expect(loginButton).toBeVisible();
    expect(loginButton).toHaveTextContent("Login");
    const { Redirect: mockedRedirect } = jest.requireMock(
      "expo-router"
    ) as jest.Mocked<typeof ExpoRouter>;
    expect(mockedRedirect).not.toHaveBeenCalledWith();
  });
});
