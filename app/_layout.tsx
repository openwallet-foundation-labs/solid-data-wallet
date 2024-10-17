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

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  QueryClientProvider,
  QueryClient,
  focusManager,
} from "@tanstack/react-query";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";
import { LoginWebViewProvider } from "@/hooks/useInruptLogin";
import { ErrorViewProvider } from "@/hooks/useError";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// eslint-disable-next-line @typescript-eslint/no-floating-promises
SplashScreen.preventAutoHideAsync();
// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [appStateStatus, setAppStateStatus] =
    useState<AppStateStatus>("active");

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
      setAppStateStatus(status);
    }
  }
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  const [loaded] = useFonts({
    // eslint-disable-next-line global-require
    "ReadexPro-Regular": require("../assets/fonts/ReadexPro-Regular.ttf"),
    // eslint-disable-next-line global-require
    "ReadexPro-Medium": require("../assets/fonts/ReadexPro-Medium.ttf"),
    // eslint-disable-next-line global-require
    "ReadexPro-SemiBold": require("../assets/fonts/ReadexPro-SemiBold.ttf"),
    // eslint-disable-next-line global-require
    "ReadexPro-Bold": require("../assets/fonts/ReadexPro-Bold.ttf"),
    // eslint-disable-next-line global-require
    "ReadexPro-Light": require("../assets/fonts/ReadexPro-Light.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // eslint-disable-next-line no-console
      SplashScreen.hideAsync().catch((e) => console.log(e));
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <LoginWebViewProvider appStateStatus={appStateStatus}>
              <ErrorViewProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen
                    name="login"
                    options={{
                      animation: "none",
                    }}
                  />
                  <Stack.Screen
                    name="scan-qr"
                    options={{
                      headerShown: false,
                      // Set the presentation mode to modal for our modal route.
                      // presentation: "fullScreenModal",
                      animation: "slide_from_bottom",
                      animationDuration: 200,
                    }}
                  />
                </Stack>
              </ErrorViewProvider>
            </LoginWebViewProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
