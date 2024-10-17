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
import React, { createContext, useCallback, useState } from "react";
import LoginWebViewModal from "@/components/login/LoginWebViewModal";
import { router } from "expo-router";
import type { AppStateStatus } from "react-native";
import { useStorageState } from "@/hooks/useStorageState";
import { SESSION_KEY } from "@/api/apiRequest";
import { useQueryClient } from "@tanstack/react-query";

const LoginWebViewContext = createContext<{
  showLoginPage: () => void;
  requestLogout: () => void;
  isLoggedIn: () => boolean;
  isActiveScreen: () => boolean;
}>({
  showLoginPage: () => null,
  requestLogout: () => null,
  isLoggedIn: () => false,
  isActiveScreen: () => false,
});

export const LoginWebViewProvider = ({
  appStateStatus,
  children,
}: React.PropsWithChildren & { appStateStatus: AppStateStatus }) => {
  const [modalRequestMode, setModalRequestMode] = useState<
    "login" | "logout" | "loginSuccess" | "blank"
  >("blank");

  const [session, setSession] = useStorageState(SESSION_KEY);
  const queryClient = useQueryClient();

  const handleLoginSuccess = async () => {
    setSession("true");
    setModalRequestMode("loginSuccess");
    router.replace("/");
  };

  const handleLogoutSuccess = () => {
    setSession(null);
    setModalRequestMode("blank");
    queryClient.removeQueries();
    queryClient.clear();
    router.replace("/login");
  };

  const showLoginPage = useCallback(() => {
    setModalRequestMode("login");
  }, []);

  const requestLogout = useCallback(() => {
    setModalRequestMode("logout");
  }, []);

  const isLoggedIn = useCallback(() => {
    return !!session;
  }, [session]);

  const isActiveScreen = useCallback(() => {
    return appStateStatus === "active";
  }, [appStateStatus]);

  return (
    <LoginWebViewContext.Provider
      value={{
        showLoginPage,
        requestLogout,
        isLoggedIn,
        isActiveScreen,
      }}
    >
      {children}
      <LoginWebViewModal
        requestMode={modalRequestMode}
        onLoginSuccess={handleLoginSuccess}
        onLogoutSuccess={handleLogoutSuccess}
        onClose={handleLogoutSuccess}
      />
    </LoginWebViewContext.Provider>
  );
};

export const useLoginWebView = () => React.useContext(LoginWebViewContext);
