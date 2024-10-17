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
import React from "react";
import type { FlatListProps } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";
import WebIdAccessGrantCard from "@/components/accessGrants/WebIdAccessGrantCard";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import type { AccessGrantGroup } from "@/types/accessGrant";
import Loading from "../LoadingButton";

interface WebIdAccessGrantListProps
  extends Omit<FlatListProps<AccessGrantGroup>, "data" | "renderItem"> {
  data: AccessGrantGroup[];
  isLoading: boolean;
}

const WebIdAccessGrantList: React.FC<WebIdAccessGrantListProps> = ({
  data,
  isLoading = false,
  ...props
}) => {
  return (
    <>
      {data.length > 0 ? (
        <FlatList
          {...props}
          data={data}
          testID="access-grants-list"
          renderItem={({ item: { ownerName, webId, logo } }) => (
            <WebIdAccessGrantCard
              name={ownerName}
              detail={webId}
              logoUri={logo}
              key={webId}
              id={webId}
            />
          )}
          keyExtractor={(item) => item.webId}
        />
      ) : (
        <View style={styles.emptyState} testID="no-access-grants-text">
          <ThemedText style={styles.emptyStateText}>
            No access has been granted
          </ThemedText>
        </View>
      )}
      <Loading isLoading={isLoading} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    color: Colors.light.grey,
  },
});
export default WebIdAccessGrantList;
