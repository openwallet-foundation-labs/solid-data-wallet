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
import { getAccessRequests } from "@/api/accessRequest";
import RequestList from "@/components/accessRequests/AccessRequestList";
import useRefreshOnFocus from "@/hooks/useRefreshOnFocus";
import type { AccessRequest } from "@/types/accessRequest";
import { FontAwesome6 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export default function AccessRequestScreen() {
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<AccessRequest[]>({
    queryKey: ["accessRequests"],
    queryFn: getAccessRequests,
    enabled: false,
  });

  useEffect(() => {
    refetch().catch((err) => console.error(err));
    return () => {
      console.debug("Unmount AccessRequestScreen");
    };
  }, [refetch]);

  useRefreshOnFocus(refetch);

  const navigation = useNavigation("/(tabs)");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => refetch()}>
          <FontAwesome6 size={24} name="rotate-right" />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: { paddingRight: 16 },
    });
  }, [navigation, refetch]);
  return (
    <View style={styles.container}>
      <RequestList
        data={data}
        isLoading={isLoading || isFetching}
        onRefresh={() => refetch()}
        refreshing={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
});
