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
import { getAccessGrants } from "@/api/accessGrant";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import WebIdAccessGrantList from "@/components/accessGrants/WebIdAccessGrantList";
import useRefreshOnFocus from "@/hooks/useRefreshOnFocus";
import type { AccessGrantGroup } from "@/types/accessGrant";
import { useEffect } from "react";

export default function AccessGrantScreen() {
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<AccessGrantGroup[]>({
    queryKey: ["accessGrants"],
    queryFn: getAccessGrants,
    enabled: false,
  });

  useEffect(() => {
    refetch().catch((err) => console.log(err));
    return () => {
      console.debug("Unmount AccessGrantScreen");
    };
  }, [refetch]);

  useRefreshOnFocus(refetch);

  return (
    <View style={styles.container}>
      <WebIdAccessGrantList
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
    padding: 24,
    backgroundColor: "#fff",
  },
});
