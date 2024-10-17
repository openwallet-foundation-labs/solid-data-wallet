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
import { Stack } from "expo-router";
import React from "react";
import Loading from "@/components/LoadingButton";
import { useIsMutating } from "@tanstack/react-query";

export default function TabLayout() {
  const isMutatingFiles = useIsMutating({ mutationKey: ["filesMutation"] });
  return (
    <>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "ReadexPro-Regular" },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[webId]" options={{ headerShown: true }} />
      </Stack>
      <Loading isLoading={!!isMutatingFiles} />
    </>
  );
}
