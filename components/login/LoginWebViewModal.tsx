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
import React, { useRef } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  View,
} from "react-native";
import { WebView, type WebViewNavigation } from "react-native-webview";
import { DEFAULT_LOGIN_URL, DEFAULT_WALLET_API } from "@/constants/defaults";

interface LoginWebViewModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onLogoutSuccess: () => void;
  requestMode: "login" | "logout" | "loginSuccess" | "blank";
}

const LoginWebViewModal: React.FC<LoginWebViewModalProps> = ({
  onClose,
  onLoginSuccess,
  onLogoutSuccess,
  requestMode = "blank",
}) => {
  const BASE_URL = process.env.EXPO_PUBLIC_WALLET_API ?? DEFAULT_LOGIN_URL;
  const LOGIN_URL = process.env.EXPO_PUBLIC_LOGIN_URL ?? DEFAULT_WALLET_API;
  const LOGOUT_URL = `${BASE_URL}/logout`;
  const LOGIN_SUCCESS_URL = `${BASE_URL}/login/success`;

  const webViewRef = useRef<WebView | null>(null);

  const handleNavigationStateChange = ({ url }: WebViewNavigation) => {
    if (requestMode === "login" && url.includes("/login/success")) {
      onLoginSuccess();
    }
  };

  const handleLoadEnd = () => {
    if (requestMode === "logout") {
      onLogoutSuccess();
    }
  };

  const handleCloseModal = () => {
    if (webViewRef.current) {
      webViewRef.current!.clearCache(true);
    }
    onClose();
  };

  const isLogoutOrLoginSuccess =
    requestMode === "logout" || requestMode === "loginSuccess";

  if (isLogoutOrLoginSuccess) {
    const sourceUri = requestMode === "logout" ? LOGOUT_URL : LOGIN_SUCCESS_URL;
    return (
      <SafeAreaView style={[styles.container, { display: "none", opacity: 0 }]}>
        <WebView
          ref={webViewRef}
          source={{ uri: sourceUri }}
          onNavigationStateChange={handleNavigationStateChange}
          incognito={false}
          domStorageEnabled={false}
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          onLoadEnd={handleLoadEnd}
        />
      </SafeAreaView>
    );
  }

  const isVisible = requestMode === "login";

  return (
    <Modal visible={isVisible} transparent>
      <SafeAreaView style={[styles.container]}>
        <WebView
          ref={webViewRef}
          source={{ uri: LOGIN_URL }}
          onNavigationStateChange={handleNavigationStateChange}
          incognito={false}
          domStorageEnabled={false}
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          startInLoadingState={true}
          renderLoading={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                height: "100%",
                width: "100%",
              }}
            >
              <ActivityIndicator size={44} />
            </View>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: "transparent",
  },

  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default LoginWebViewModal;
