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
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import CustomButton from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { clearWebViewIOSCache } from "react-native-webview-ios-cache-clear";
import Logo from "@/assets/images/future_co.svg";
import { useLoginWebView } from "@/hooks/useInruptLogin";
import { useLocalSearchParams } from "expo-router";

const isRunningInExpoGo = Constants.appOwnership === "expo";

const LoginScreen = () => {
  const { showLoginPage, requestLogout } = useLoginWebView();
  const { logout } = useLocalSearchParams();

  const clearCookies = () => {
    import("react-native/Libraries/Network/RCTNetworking")
      .then((RCTNetworking) =>
        RCTNetworking.default.clearCookies((result: never) => {
          console.log("RCTNetworking:: clearCookies", result);
        })
      )
      .catch((error) => console.log("Failed to clear cookies", error));

    if (!isRunningInExpoGo) {
      clearWebViewIOSCache();
      import("@react-native-cookies/cookies")
        .then((CookieManager) =>
          CookieManager.default
            .clearAll()
            .then((success) => console.log("Cleared all cookies?", success))
        )
        .catch((error) => console.log("Failed to clear cookies", error));
    }
  };

  useEffect(() => {
    if (logout) {
      clearCookies();
      requestLogout();
    }
  }, [logout, requestLogout]);

  useEffect(() => {
    clearCookies();
  }, []);

  const handleLoginPress = () => {
    if (!logout) {
      showLoginPage();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width="200" height="200" />
        <ThemedText
          style={[styles.header, { paddingTop: 16 }]}
          fontWeight="bold"
        >
          Future Co
        </ThemedText>
        <ThemedText style={styles.header} fontWeight="bold">
          Wallet
        </ThemedText>
      </View>
      <CustomButton
        onPress={handleLoginPress}
        title="Login"
        variant="primary"
        customStyle={{ paddingHorizontal: 74 }}
        testID="login-button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoContainer: {
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 36,
    textTransform: "uppercase",
    color: "#1C2033",
    fontWeight: 700,
  },
});

export default LoginScreen;
